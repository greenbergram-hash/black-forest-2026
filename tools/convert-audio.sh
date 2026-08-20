#!/bin/bash
# המרת פרק פודקאסט שהורד מ-NotebookLM לקובץ שהאפליקציה מנגנת.
#
#   tools/convert-audio.sh <קובץ-שהורד> <מזהה-אזור>
#   tools/convert-audio.sh ~/Downloads/audio-overview.wav feldberg
#
# למה בכלל להמיר: NotebookLM מוריד WAV, שהוא בסביבות 10 מגה-בייט לדקה.
# 12 פרקים כאלה הם מאות מגה-בייט במאגר שכולו 3.5 מגה-בייט, וגם הורדה
# כזאת בטלפון בחו"ל היא בזבוז. AAC מונו ב-32kbps נשמע זהה לדיבור ושוקל
# בסביבות 1.5 מגה-בייט לפרק.
#
# הכלי afconvert מגיע עם macOS, אז אין מה להתקין (ffmpeg לא נדרש).

set -euo pipefail

SRC="${1:-}"
AREA="${2:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/audio/$AREA.m4a"

if [ -z "$SRC" ] || [ -z "$AREA" ]; then
  echo "שימוש: tools/convert-audio.sh <קובץ-שהורד> <מזהה-אזור>" >&2
  echo "לדוגמה: tools/convert-audio.sh ~/Downloads/audio-overview.wav feldberg" >&2
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "לא נמצא קובץ: $SRC" >&2
  exit 1
fi

# המזהה חייב להתאים לשורה בטבלת PODCASTS שב-app.js, אחרת האפליקציה
# תחפש שם קובץ אחר ותציג "הפרק עוד לא הועלה".
if ! grep -q "^  $AREA: *{" "$ROOT/app.js"; then
  echo "המזהה \"$AREA\" לא מופיע בטבלת PODCASTS שב-app.js." >&2
  echo "המזהים הקיימים:" >&2
  grep -oE "^  [a-z]+: *\{ title" "$ROOT/app.js" | awk '{print "  - " $1}' | tr -d ':' >&2
  exit 1
fi

mkdir -p "$ROOT/audio"

# ההמרה היא בשני שלבים, וזה לא סתם:
# NotebookLM מייצא לפעמים WAV ולפעמים m4a דחוס. כשהמקור כבר דחוס (AAC),
# afconvert לא מצליח למזג לערוץ אחד תוך כדי פענוח וקידוד מחדש, ונופל עם
#   Error: ExtAudioFileSetProperty ('cclo') failed (-66564)
# ('cclo' הוא מבנה הערוצים שהוא מנסה לקבוע). הפתרון: לפענח קודם ל-PCM גולמי,
# ורק ממנו לקודד. עבור מקור WAV השלב הראשון הוא כמעט חינם.
TMP="$(mktemp -t podcast-convert).wav"
trap 'rm -f "$TMP"' EXIT

# שלב 1 — פענוח ל-PCM ומיזוג למונו (‎--mix -c 1).
afconvert -f WAVE -d LEI16 --mix -c 1 "$SRC" "$TMP"

# שלב 2 — קידוד ל-AAC.
# ‎-f m4af   מכולת MPEG-4 audio (‎.m4a)
# ‎-d aac    קידוד AAC-LC
# ‎-b 32000  32kbps — מספיק בהחלט לדיבור מונו
#
# ‎-s 3 (VBR) בכוונה לא כאן — הוא מתעלם מ-‎-b ומנפח את הקובץ פי אחד וחצי.
afconvert -f m4af -d aac -b 32000 "$TMP" "$OUT"

# מכאן והלאה הפרק קיים, אז מסמנים אותו כזמין ב-app.js. בלי ready האפליקציה
# לא מציגה עליו אוזניות בכלל, וזאת בכוונה — הסימון הידני נשכח, והמשתמש היה
# מקבל כפתור שמוביל להודעה "הפרק עוד לא הועלה".
if ! grep -q "^  $AREA: *{.*ready: true" "$ROOT/app.js"; then
  # התוספת נכנסת אחרי rev, בסוף הרשומה — אותו סדר שדות בכל השורות.
  /usr/bin/sed -i '' -E "s/^(  $AREA: *\{.*rev: [0-9]+)( \})/\1, ready: true\2/" "$ROOT/app.js"
  if grep -q "^  $AREA: *{.*ready: true" "$ROOT/app.js"; then
    echo "סומן ב-app.js: הפרק \"$AREA\" זמין עכשיו באפליקציה (ready: true)."
  else
    echo "שימו לב: לא הצלחתי לסמן ready: true בשורה של \"$AREA\" ב-app.js —" >&2
    echo "בלי זה הפרק לא יופיע באפליקציה. להוסיף ידנית בסוף הרשומה." >&2
  fi
fi

SIZE=$(du -h "$OUT" | cut -f1 | tr -d ' ')
SECS=$(afinfo "$OUT" | awk -F': ' '/estimated duration/ {printf "%.0f", $2}')
MINS=$((SECS / 60))
REST=$((SECS % 60))

echo "נוצר: audio/$AREA.m4a · $SIZE · ${MINS}:$(printf '%02d' $REST)"
echo
echo "אם זו החלפה של פרק שכבר הועלה בעבר — להעלות את rev של \"$AREA\" ב-app.js ב-1,"
echo "אחרת מכשיר שכבר הוריד אותו ימשיך לנגן את הגרסה הישנה."
