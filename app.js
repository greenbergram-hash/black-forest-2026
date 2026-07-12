/* ============================================================
   היער השחור 2026 — נתוני הטיול
   הכל מוטמע בקוד, אין קריאות רשת אחרי הטעינה הראשונה.
   ============================================================ */

const TRIP = {
  start: "2026-08-17",
  end: "2026-08-24",
  hotel: {
    name: "Hotel Schlehdorn",
    address: "Am Sommerberg 1, 79868 Feldberg (Schwarzwald)-Altglashütten, Germany"
  },
  flightIn: { city: "ציריך", date: "2026-08-17", time: "12:30", note: "נסיעה למלון: כשעה ורבע עד שעה וחצי" },
  flightOut: { city: "ציריך", date: "2026-08-24", time: "22:00", note: "לוודא את השעה המדויקת מול הכרטיס בפועל" }
};

// רשימת לפני-הטיול — נשמרת ב-localStorage כך שהסימונים נשארים במכשיר.
const CHECKLIST = [
  "להזמין מראש כרטיסי Rulantica — הפארק מתמלא כמעט כל יום",
  "להזמין מראש כרטיסי Europa-Park (מקושר לתאריך ספציפי, אי אפשר להחליף) — קנייה בקופה עולה 10€ יותר לאדם",
  "להוריד את אפליקציית Europa-Park, לסמן מועדפים ולתכנן Virtual Line (VL) למתקנים המרכזיים",
  "להזמין מראש סדנת שוקולד בלינדט, אם עושים אותה ביום האחרון",
  "להזמין מראש כרטיס + חלון זמן למוזיאון לינדט (ביקוש גבוה מאוד)",
  "להביא מגבות מהמלון לרולנטיקה (או לשכור במקום)",
  "לקחת נעליים סגורות / סנדלי מים לשביל החושים בגוטאך (בוץ, אבנים, נחלים)",
  "לתכנן מראש את ארוחות יום ראשון — הרבה מסעדות בגרמניה סגורות בימי ראשון"
];

const GENERAL_TIPS = [
  "הרבה מסעדות בגרמניה סגורות בימי ראשון — לתכנן מראש את הארוחות ליום ראשון (23.8).",
  "מוזיאון ה-FIFA בציריך סגור בימי שני — ומכיוון שה-24.8 הוא יום שני, באותו יום זה לינדט או כלום.",
  "במסלולים עם מעברי נחל (כמו בגוטאך) — לקחת נעלי מים או סנדלים."
];

function mapLink(address) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
}

const HEB_WEEKDAYS = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"];

/* לכל יום — blocks כרונולוגי. start/end בפורמט "HH:MM" (שעון מקומי).
   approx:true אומר שהמסמך המקורי לא נתן שעה מדויקת — זו הערכה סבירה,
   מוצגת עם "~" כדי שאף אחד לא יתבלבל שזו שעה קבועה. */
const DAYS = [
  {
    date: "2026-08-17",
    title: "הגעה",
    place: "ציריך → Hotel Schlehdorn",
    driveNote: "נחיתה 12:30, נסיעה של כשעה ורבע עד שעה וחצי למלון",
    blocks: [
      {
        start: "12:30", end: "14:00", approx: false,
        title: "נחיתה בציריך",
        desc: "נסיעה מהשדה למלון, כשעה ורבע עד שעה וחצי.",
      },
      {
        start: "14:30", end: "18:00", approx: true,
        title: "מתחם פאנדורנה, או פשוט מנוחה",
        desc: "טרמפולינות, מתחם חבלים, קיר טיפוס — 15 דקות נסיעה מהמלון. או פשוט להתארגן ולנוח במלון אחרי יום נסיעה.",
        address: "Pandorena, Feldberg (Schwarzwald)",
        tips: [{ text: "יום ראשון של הטיול — אין שום בעיה לא לעשות כלום חוץ מלהתארגן." }]
      }
    ]
  },
  {
    date: "2026-08-18",
    title: "טיטיזה",
    place: "טיטיזה-נוישטט",
    driveNote: "כ-20 דקות נסיעה מהמלון",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "שביל רוואנהשלוכט (Ravennaschlucht)",
        desc: "מתחילים ב-Hofgut Sternen — שווה לראות לפני השביל: גשר הרכבת (Ravenna Viaduct, גובה 37 מ׳) שעוברים מתחתיו, שעון קוקייה ענק שנפתח בכל שעה עגולה, וחנות שעוני קוקייה עם סדנת ניפוח זכוכית. השביל עצמו: קניון צר ומיוער, מוצל כמעט כולו, עם מפלים קטנים לאורך הדרך — בין 30 דקות לכ-3 שעות, תלוי בקצב.",
        tips: [{ text: "אורך גמיש — טוב ליום עם רגליים עייפות, פשוט חוזרים מוקדם." }]
      },
      {
        start: "12:00", end: "13:30", approx: true,
        title: "אגם טיטיזי",
        desc: "האגם התיירותי המפורסם ביותר ביער השחור — שיט בסירות פדלים/חשמליות, טיילת, גלידה.",
        tips: [{ text: "יפה, אבל מלכודת תיירים — שעה־שעתיים מספיקות, לא יותר." }]
      },
      {
        start: "14:00", end: "18:00", approx: true,
        title: "Badeparadies Schwarzwald",
        desc: "פארק המים הטוב באזור. אזור Galaxy עם עשרות מגלשות, מתאים לילדים ולמתבגרים; יש גם ספא למבוגרים. 4 שעות מספיקות — פתוח עד 22:00.",
        address: "Am Badeparadies 1, 79822 Titisee-Neustadt",
        price: "כ-22€ (4 שעות) / כ-30€ (יום) לנפש",
        hours: "9:00–22:00 בכל יום (כולל שלישי) בחופשת הקיץ",
        tips: [
          { text: "חובה להזמין מראש באתר, כולל שיבוץ מקום/מיטת שיזוף — אי אפשר פשוט להגיע ולהיכנס בקופה.", warn: true }
        ]
      }
    ]
  },
  {
    date: "2026-08-19",
    title: "Europa-Park",
    place: "Rust",
    driveNote: "כ-1:10–1:20 שעות נסיעה מהמלון",
    blocks: [
      {
        start: "09:00", end: "18:00", approx: false,
        title: "יום מלא ב-Europa-Park",
        desc: "יום רביעי נבחר בכוונה — יחד עם יום שישי, זה היום הכי פחות עמוס בפארק (סופ\"ש הכי צפוף). טיפ: להגיע בפתיחה.",
        address: "Europa-Park-Straße 2, 77977 Rust",
        price: "כ-34–38€ ליום (הערכה 2026, תלוי בתאריך)",
        hours: "9:00–18:00 (לפחות) בקיץ",
        tips: [
          { text: "הכרטיס מקושר לתאריך ספציפי — קנייה בקופה (אם יש מקום) עולה 10€ יותר לאדם, וימי שיא נגמרים בכרטיסים.", warn: true },
          { text: "להוריד את האפליקציה מראש, לסמן מועדפים, ולהזמין Virtual Line (VL) למתקנים המרכזיים." }
        ]
      },
      {
        start: null, end: null, approx: true,
        title: "רכבות שחובה",
        desc: "Voltron · Blue Fire · Wodan · Silver Star"
      },
      {
        start: null, end: null, approx: true,
        title: "עוד שווה",
        desc: "Voletarium (סימולטור טיסה, ליד הכניסה), Cancan, Pegasus, Euro-Mir, Fjord (אבובים למשפחה), Pirates in Batavia (שיט), Arthur."
      }
    ]
  },
  {
    date: "2026-08-20",
    title: "פרייבורג + טודנאו",
    place: "פרייבורג (בוקר) · טודנאו (אחה\"צ)",
    driveNote: "פרייבורג כ-45 דקות מהמלון · טודנאו כ-20 דקות מפרייבורג",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "פרייבורג — שוק הקתדרלה",
        desc: "שוק הקתדרלה (\"מינסטרמארקט\") בכיכר Münsterplatz — פועל כל בוקר חוץ מיום ראשון. צד צפוני: שוק איכרים (תוצרת מקומית, פירות יער, דבש, פרחים). צד דרומי: תבלינים, כלי עץ, מזכרות, אוכל רחוב. אחר כך טיול בכיכר המונסטר ותעלות המים (Bächle), וקניות ב-Kaiser-Joseph-Straße (\"Ka-Jo\") אם נשאר זמן.",
        tips: [{ text: "פרייבורג בבוקר — השוק לא פועל אחה\"צ, וגם ככה סגור בימי ראשון." }]
      },
      {
        start: "13:00", end: "17:00", approx: true,
        title: "מפלי טודנאו והגשר התלוי",
        desc: "שתי כניסות: התחתונה (מומלצת עם ילדים קטנים) בכביש L126 — \"מסלול אדום\" נוח ומתון, כ-10 דק׳ למפל הראשי, הלוך-חזור קלאסי. העליונה, ליד טודנאוברג, מגיעה לגשר התלוי אבל בירידה תלולה למפלים — העלייה בחזרה עלולה להיות מאתגרת לרגליים קטנות. טיפ לשני רכבים: להשאיר רכב אחד למטה, לנסוע עם כולם למעלה וללכת את כל המסלול בירידה בלבד. לגשר התלוי Blackforestline יש כניסה נפרדת משלו — נוף פנורמי וחוויית אדרנלין.",
        address: "Außer Ort 38, 79674 Todtnauberg",
        price: "כרטיס קומבו (גשר + מפל): כ-12€ מבוגר, כ-9€ ילד",
        hours: "8:00–20:30 בקיץ, כניסה אחרונה 19:00. קופה מאוישת/הנחות רק 10:00–16:00 — מעבר לזה רק מכונות, בלי הנחות.",
      }
    ]
  },
  {
    date: "2026-08-21",
    title: "רולנטיקה",
    place: "Rust",
    driveNote: "אותו אזור כמו Europa-Park",
    blocks: [
      {
        start: "10:00", end: "18:00", approx: true,
        title: "פארק המים רולנטיקה",
        desc: "יום שישי נבחר בכוונה, כמו רביעי — אחד הימים הפחות עמוסים. כרטיס נפרד מ-Europa-Park.",
        hours: "בד\"כ 09:30/10:00–22:00 (לבדוק באתר הרשמי לפי התאריך)",
        price: "יום: ילד כ-38–54€, מבוגר כ-41–54€ · \"Moonlight\" (19:00–22:00) הכי זול, ילד כ-28–34€ · מתחת לגיל 4 חינם · 0–3 חינם",
        tips: [
          { text: "להזמין כרטיסים מראש — הפארק מתמלא כמעט כל יום.", warn: true },
          { text: "הלוקרים חינם דרך צמיד Rula-Band, שמשמש גם לתשלום בפארק." },
          { text: "החניה בתשלום — לשלם מראש באתר/אפליקציה." },
          { text: "אסור בקבוקי זכוכית או צידניות גדולות; מים, בקבוק רב-פעמי וחטיפים קלים מותר." },
          { text: "להביא מגבות מהמלון, או לשכור במקום." },
          { text: "טמפרטורת המים 30–32°C." },
          { text: "ילדים עד גיל 12 נכנסים חינם ביום ההולדת שלהם (עם דרכון)." }
        ]
      }
    ]
  },
  {
    date: "2026-08-22",
    title: "טריברג + גוטאך",
    place: "טריברג · גוטאך",
    driveNote: "כ-55–60 דקות נסיעה מהמלון",
    blocks: [
      {
        start: "09:30", end: "12:00", approx: true,
        title: "טריברג",
        desc: "מפלי טריברג — המפורסמים ביער השחור — פלוס שעוני קוקייה ענקיים ומרכז עיירה קלאסי.",
        price: "כניסה למפלים: מבוגר 7–8€, כרטיס משפחתי כ-20€, ילדים עד גיל 6 חינם (בד\"כ מזומן בלבד). אותו כרטיס מזכה גם בכניסה ל-Schwarzwaldmuseum ול-Triberg-Land.",
        hours: "הקופה מאוישת כ-9:00–19:00",
        tips: [{ text: "מחוץ לשעות הקופה (בוקר מוקדם או ערב) הכניסה למפלים חופשית — וגם פחות עמוס." }]
      },
      {
        start: "13:00", end: "16:00", approx: true,
        title: "גוטאך — שביל החושים",
        desc: "מסלול מעגלי, בין שעה לשלוש שעות לפי קצב. הליכה על דשא, בוץ, אבנים וחול, מוצל ברובו, עם תחנות חוש (מישוש, ריח, ראייה). שווה גם עם ילדים גדולים יותר.",
        tips: [
          { text: "קחו נעלי מים/סנדלים למי שלא נוח לו ללכת יחף על אבנים." },
          { text: "קחו מים — לא מסלול קצר." },
          { text: "מסעדה יוונית מומלצת, \"אלכסנדרוס\", 3 דקות נסיעה משם." }
        ]
      },
      {
        start: null, end: null, approx: true,
        title: "אופציה: Sommerrodelbahn גוטאך",
        desc: "מגלשת קיץ נוספת, בד\"כ פחות עמוסה מזו שבטודנאו. כניסה חופשית, משלמים רק לפי נסיעה.",
        hours: "פתוח מ-10:00 (מ-9:00 בחופשת הקיץ)",
        tips: [{ text: "גיל מינימום לנסיעה לבד הוא 8 — הילד בן ה-5 יכול לנסוע רק כנוסע צמוד למבוגר על אותה מזחלת, לא לבד.", warn: true }]
      }
    ],
    dayNote: "שקלו לקצר את היום — 3 עצירות וכ-2 שעות נסיעה הלוך-חזור. אם הזמן לוחץ, שעה בשביל גוטאך מספיקה."
  },
  {
    date: "2026-08-23",
    title: "פארק הציפורים בשטיינן",
    place: "Vogelpark Steinen",
    driveNote: "יום קליל בכוונה, אחרי שישה ימים עמוסים",
    blocks: [
      {
        start: "10:00", end: "17:00", approx: true,
        title: "פארק הציפורים בשטיינן",
        desc: "פארק מעולה, לא גדול מדי — אחת ההפתעות החיוביות של היער השחור. מופע עופות דורסים ב-11:00 וב-15:00; קופים מסתובבים חופשי עם האכלה ב-12:00 וב-16:00 — יש גם סבב בוקר וגם סבב אחה\"צ, אז אפשר לתכנן לפי מה שנוח.",
        price: "מבוגר 20€, ילד (4–11) 10€",
        hours: "10:00–18:00 בחופשת הקיץ",
      },
      {
        start: null, end: null, approx: true,
        title: "אם נשארה אנרגיה",
        desc: "אופציות: ויטה קלאסיקה (ספא), פארק שטיינווטסן (מתקנים וחיות), או פאנדורנה (טרמפולינות/חבלים/טיפוס, 15 דקות מהמלון)."
      }
    ]
  },
  {
    date: "2026-08-24",
    title: "מפלי הריין + טיסה הביתה",
    place: "שפהאוזן ← קילכברג ← נתב\"ג ציריך",
    driveNote: "כ-55 דקות מהמלון לשפהאוזן, ועוד כ-30 דקות לנתב\"ג ציריך",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "מפלי הריין",
        desc: "המפל הגדול ביותר באירופה — מרשים מאוד. החובה: השיט שמגיע לסלע במרכז המפל. יש פארק חבלים בקרבת מקום, כנראה לא מתאים לקטנים.",
        tips: [{ text: "השיט לסלע יכול להיות עוצמתי/מפחיד לילד בן 5 — שווה לבדוק מולו לפני שעולים. החניה ליד המפל בתשלום, כמה פרנקים שוויצריים לשעה." }]
      },
      {
        start: "12:30", end: "16:00", approx: true,
        title: "Lindt Home of Chocolate",
        desc: "מזרקת השוקולד, החנות והקפה פתוחים לכולם, גם בלי כרטיס למוזיאון.",
        address: "Schokoladenplatz 1, 8802 Kilchberg",
        tips: [
          { text: "מוזיאון ה-FIFA סגור בימי שני, וה-24.8 הוא יום שני — אז היום זה לינדט, אין ברירה אחרת.", warn: true },
          { text: "ביקוש גבוה מאוד — להזמין כרטיס וחלון זמן מראש." },
          { text: "אם עושים גם סדנת שוקולד — גם אותה צריך להזמין מראש." }
        ]
      },
      {
        start: "22:00", end: null, approx: false,
        title: "טיסה הביתה מציריך",
        desc: "לוודא את השעה המדויקת מול הכרטיס בפועל, קרוב יותר לתאריך."
      }
    ]
  }
];

/* ============================================================
   פונקציות עזר לרינדור
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function hebWeekday(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return HEB_WEEKDAYS[d.getDay()];
}

function dayMonth(dateStr) {
  const day = Number(dateStr.slice(8, 10));
  return `${day} באוגוסט`;
}

function localDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function chipsHTML(block) {
  const chips = [];
  if (block.price) chips.push(`<span class="chip">💶 ${escapeHTML(block.price)}</span>`);
  if (block.hours) chips.push(`<span class="chip">🕐 ${escapeHTML(block.hours)}</span>`);
  if (block.address) chips.push(`<a class="chip map" href="${mapLink(block.address)}" target="_blank" rel="noopener">📍 מפה</a>`);
  if (!chips.length) return "";
  return `<div class="chips">${chips.join("")}</div>`;
}

function tipsHTML(block) {
  if (!block.tips || !block.tips.length) return "";
  return block.tips.map(t => `<div class="tip ${t.warn ? "warn" : ""}">${t.warn ? "⚠️ " : "💡 "}${escapeHTML(t.text)}</div>`).join("");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function timeLabel(block) {
  if (block.start && block.end) return `${block.approx ? "~" : ""}${block.start}–${block.end}`;
  if (block.start) return `${block.approx ? "~" : ""}${block.start}`;
  return "";
}

/* ============================================================
   תצוגת המסלול המלא
   ============================================================ */

function renderItinerary() {
  const todayStr = localDateStr(new Date());
  const html = DAYS.map((day, i) => {
    const isToday = day.date === todayStr;
    const blocksHTML = day.blocks.map(b => `
      <div class="timeline-item">
        <div class="time">${timeLabel(b)}</div>
        <div class="body">
          <h3>${escapeHTML(b.title)}</h3>
          <p>${escapeHTML(b.desc)}</p>
          ${chipsHTML(b)}
          ${tipsHTML(b)}
        </div>
      </div>
    `).join("");

    return `
      <details class="day" data-date="${day.date}" ${isToday ? "open" : ""}>
        <summary>
          <span class="day-summary-left">
            <span class="day-date">${hebWeekday(day.date)}, ${dayMonth(day.date)}${isToday ? '<span class="day-today-dot"></span>' : ""}</span>
            <span class="day-title">${escapeHTML(day.title)}</span>
          </span>
          <span class="day-chevron">⌄</span>
        </summary>
        <div class="day-body">
          <div class="day-meta">${escapeHTML(day.place)} · ${escapeHTML(day.driveNote)}</div>
          ${day.dayNote ? `<div class="tip">💡 ${escapeHTML(day.dayNote)}</div>` : ""}
          ${blocksHTML}
        </div>
      </details>
    `;
  }).join("");

  $("#view-itinerary").innerHTML = `<h2 class="mini-list-title" style="margin-top:0">המסלול המלא</h2>${html}`;
}

/* ============================================================
   תצוגת "עכשיו"
   ============================================================ */

function renderNow() {
  const now = new Date();
  const todayStr = localDateStr(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const view = $("#view-now");

  if (todayStr < TRIP.start) {
    const daysToGo = Math.ceil((new Date(TRIP.start + "T00:00:00") - new Date(todayStr + "T00:00:00")) / 86400000);
    const daysLabel = daysToGo === 1 ? "יום אחד" : daysToGo === 2 ? "יומיים" : `${daysToGo} ימים`;
    view.innerHTML = `
      <div class="countdown">
        <div class="num">${daysToGo}</div>
        <div class="label">${daysLabel} עד היער השחור</div>
      </div>
      <div class="card">
        <strong>${escapeHTML(TRIP.hotel.name)}</strong><br>
        <span style="color:var(--ink-soft);font-size:14px">${escapeHTML(TRIP.hotel.address)}</span>
        <div class="chips"><a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">📍 מפה</a></div>
      </div>
      <h2 class="mini-list-title">לפני שנוסעים</h2>
      ${renderChecklistHTML()}
    `;
    bindChecklist();
    return;
  }

  if (todayStr > TRIP.end) {
    view.innerHTML = `
      <div class="countdown">
        <div class="num">🌲</div>
        <div class="label">הטיול נגמר — מקווים שהיה כיף!</div>
      </div>
      <div class="empty-note">המסלול המלא עדיין כאן, תחת "מסלול", אם בא לכם להיזכר.</div>
    `;
    return;
  }

  const dayIndex = DAYS.findIndex(d => d.date === todayStr);
  const day = DAYS[dayIndex];
  if (!day) {
    view.innerHTML = `<div class="empty-note">לא נמצאה תוכנית להיום — בדקו בלשונית "מסלול".</div>`;
    return;
  }

  // סיווג הבלוקים ל: הסתיים / קורה עכשיו / בקרוב
  const timed = day.blocks.map((b, i) => {
    const s = toMinutes(b.start);
    let e = toMinutes(b.end);
    if (e == null) {
      const next = day.blocks.slice(i + 1).find(nb => toMinutes(nb.start) != null);
      e = next ? toMinutes(next.start) : 23 * 60 + 59;
    }
    return { b, s, e };
  });

  let currentIdx = -1;
  for (let i = 0; i < timed.length; i++) {
    const { s, e } = timed[i];
    if (s == null) continue;
    if (nowMinutes >= s && nowMinutes < e) { currentIdx = i; break; }
  }
  if (currentIdx === -1) {
    const upcoming = timed.findIndex(t => t.s != null && t.s > nowMinutes);
    currentIdx = upcoming;
  }

  const dayNum = dayIndex + 1;
  let heroHTML = `
    <div class="hero">
      <p class="hero-eyebrow">יום ${dayNum} מתוך ${DAYS.length} · ${hebWeekday(day.date)}, ${dayMonth(day.date)}</p>
      <h1 class="hero-title">${escapeHTML(day.title)}</h1>
      <p class="hero-sub">${escapeHTML(day.place)} · ${escapeHTML(day.driveNote)}</p>
    </div>
  `;

  let currentHTML = "";
  if (currentIdx !== -1 && currentIdx < timed.length) {
    const { b, s } = timed[currentIdx];
    const isNow = s != null && nowMinutes >= s;
    currentHTML = `
      <div class="now-current">
        <div class="kicker"><span class="pulse"></span>${isNow ? "עכשיו" : "בקרוב"}${timeLabel(b) ? " · " + timeLabel(b) : ""}</div>
        <h2>${escapeHTML(b.title)}</h2>
        <p>${escapeHTML(b.desc)}</p>
        ${chipsHTML(b)}
        ${tipsHTML(b)}
      </div>
    `;
  } else {
    currentHTML = `
      <div class="now-current">
        <div class="kicker"><span class="pulse"></span>זמן פנוי</div>
        <h2>אין כרגע שום דבר מתוכנן</h2>
        <p>אפשר לבדוק את "המשך היום" למטה, או פשוט ליהנות מהזמן הפנוי.</p>
      </div>
    `;
  }

  const restHTML = timed
    .filter((_, i) => i !== currentIdx)
    .map(({ b, s }) => {
      const isPast = s != null && s < nowMinutes && currentIdx !== -1 && s < timed[currentIdx].s;
      return `
        <div class="timeline-item ${isPast ? "done" : ""}">
          <div class="time">${timeLabel(b)}</div>
          <div class="body">
            <h3>${escapeHTML(b.title)}</h3>
            <p>${escapeHTML(b.desc)}</p>
          </div>
        </div>
      `;
    }).join("");

  view.innerHTML = `
    ${heroHTML}
    ${currentHTML}
    ${restHTML ? `<h2 class="mini-list-title">המשך היום</h2><div class="card">${restHTML}</div>` : ""}
    <div class="chips" style="margin-top:16px">
      <a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">📍 ${escapeHTML(TRIP.hotel.name)}</a>
    </div>
  `;
}

/* ============================================================
   תצוגת מידע
   ============================================================ */

function renderChecklistHTML() {
  const done = JSON.parse(localStorage.getItem("bf2026-checklist") || "{}");
  return `
    <div class="card">
      ${CHECKLIST.map((item, i) => `
        <label class="check-item ${done[i] ? "checked" : ""}" data-idx="${i}">
          <input type="checkbox" ${done[i] ? "checked" : ""}>
          <span>${escapeHTML(item)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function bindChecklist() {
  $$(".check-item").forEach(el => {
    el.addEventListener("change", () => {
      const idx = el.dataset.idx;
      const done = JSON.parse(localStorage.getItem("bf2026-checklist") || "{}");
      const checked = $("input", el).checked;
      done[idx] = checked;
      localStorage.setItem("bf2026-checklist", JSON.stringify(done));
      el.classList.toggle("checked", checked);
    });
  });
}

function renderInfo() {
  const view = $("#view-info");
  view.innerHTML = `
    <div class="info-section">
      <h2>המלון</h2>
      <div class="card">
        <div class="info-row"><span class="k">שם</span><span class="v">${escapeHTML(TRIP.hotel.name)}</span></div>
        <div class="info-row"><span class="k">כתובת</span><span class="v">${escapeHTML(TRIP.hotel.address)}</span></div>
        <div class="chips"><a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">📍 פתיחה במפות</a></div>
      </div>
    </div>

    <div class="info-section">
      <h2>טיסות</h2>
      <div class="card">
        <div class="info-row"><span class="k">נחיתה — ${hebWeekday(TRIP.flightIn.date)}, ${dayMonth(TRIP.flightIn.date)}</span><span class="v">${TRIP.flightIn.city}, ${TRIP.flightIn.time}</span></div>
        <div class="info-row"><span class="k">טיסת חזרה — ${hebWeekday(TRIP.flightOut.date)}, ${dayMonth(TRIP.flightOut.date)}</span><span class="v">${TRIP.flightOut.city}, ${TRIP.flightOut.time}</span></div>
        <div class="tip">💡 ${escapeHTML(TRIP.flightOut.note)}</div>
      </div>
    </div>

    <div class="info-section">
      <h2>לפני שנוסעים</h2>
      ${renderChecklistHTML()}
    </div>

    <div class="info-section">
      <h2>כדאי לדעת</h2>
      <div class="card">
        ${GENERAL_TIPS.map(t => `<div class="tip">💡 ${escapeHTML(t)}</div>`).join("")}
      </div>
    </div>
  `;
  bindChecklist();
}

/* ============================================================
   טאבים + אתחול
   ============================================================ */

function showView(name) {
  $$(".view").forEach(v => v.classList.remove("active"));
  $(`#view-${name}`).classList.add("active");
  $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
  $("#app").scrollTop = 0;
  localStorage.setItem("bf2026-lasttab", name);
}

$$(".tab").forEach(tab => {
  tab.addEventListener("click", () => showView(tab.dataset.view));
});

function init() {
  renderNow();
  renderItinerary();
  renderInfo();
  showView("now");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // רענון תצוגת "עכשיו" מדי דקה, כדי שהפעילות הנוכחית תישאר מדויקת
  // אם האפליקציה נשארת פתוחה.
  setInterval(renderNow, 60000);
}

init();
