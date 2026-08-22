/* ============================================================
   היער השחור 2026 — נתוני הטיול
   רוב הנתונים מוטמעים בקוד; קריאת הרשת היחידה בפועל היא תחזית מזג האוויר
   (Open-Meteo, בלי מפתח API) בלשונית "מזג אוויר". חוץ מזה, אין קריאות רשת
   אחרי הטעינה הראשונה (חוץ מקישורי מפות/וויז/מידע חיצוניים).
   ============================================================ */

const TRIP = {
  start: "2026-08-17",
  end: "2026-08-24",
  hotel: {
    name: "Hotel Schlehdorn",
    address: "Am Sommerberg 1, 79868 Feldberg (Schwarzwald)-Altglashütten, Germany",
    coords: { lat: 47.8555, lng: 8.1069, elev: 950 }
  },
  flightIn: { city: "ציריך", date: "2026-08-17", time: "12:30", note: "נסיעה למלון: כשעה ורבע עד שעה וחצי" },
  flightOut: { city: "ציריך", date: "2026-08-24", time: "22:00", note: "לוודא את השעה המדויקת מול הכרטיס בפועל" }
};

// רשימת לפני-הטיול — נשמרת ב-localStorage כך שהסימונים נשארים במכשיר.
const CHECKLIST = [
  "לוודא את חלון הזמן של Badeparadies ליום ראשון 23.8 — לפי התוכנית מגיעים ב-16:00",
  "להוריד את אפליקציית Europa-Park, לסמן מועדפים ולתכנן Virtual Line (VL) למתקנים המרכזיים",
  "להזמין מראש כרטיס + חלון זמן למוזיאון לינדט (ביקוש גבוה מאוד)",
  "להזמין מראש סדנת שוקולד בלינדט, אם עושים אותה ביום האחרון",
  "להביא מגבות מהמלון לרולנטיקה, ל-Badeparadies ול-Keidel (או לשכור במקום)",
  "בגדי ים זמינים גם ביום פרייבורג (20.8) — Keidel בסוף היום",
  "לקחת נעליים סגורות / סנדלי מים לשביל החושים בגוטאך (בוץ, אבנים, נחלים)",
  "לבדוק תחזית לפני מגלשת Hasenhorn ב-18.8 — היא לא פועלת בסופת רעמים או ברוח חזקה",
  "לתכנן מראש את ארוחות יום ראשון — הרבה מסעדות בגרמניה סגורות בימי ראשון"
];

const GENERAL_TIPS = [
  "הרבה מסעדות בגרמניה סגורות בימי ראשון — ב-23.8 אתם ב-Badeparadies עד הערב, ויש שם אוכל, אז זה מכוסה.",
  "מוזיאון ה-FIFA בציריך סגור בימי שני — ומכיוון שה-24.8 הוא יום שני, באותו יום זה לינדט או כלום.",
  "אגם טיטיזי מופיע פעמיים בתוכנית כבלוק רשות — ב-20.8 בבוקר וב-23.8 אחרי מפלי הריין. עושים אותו ביום שבו מזג האוויר טוב יותר, לא בשניהם.",
  "שוק הקתדרלה בפרייבורג נסגר סביב 13:00 ולא פועל בימי ראשון — הוא רלוונטי ב-20.8 רק אם מדלגים על האגם ומגיעים מוקדם.",
  "במסלולים עם מעברי נחל (כמו בגוטאך) — לקחת נעלי מים או סנדלים.",
  "זמני הנסיעה בכל האפליקציה הם הערכות שנבדקו מול Google Maps מראש — כדאי לפתוח את \"מסלול הנסיעה של היום\" בפועל לפני היציאה, אם יש קליטה, לזמן מדויק בזמן אמת."
];

/* ============================================================
   אייקונים (SVG קווי, יורשים צבע מהטקסט הסובב)
   ============================================================ */
const ICON = {
  clock: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  calendar: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>`,
  info: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5h.01"/></svg>`,
  pin: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg>`,
  link: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14 20 4"/><path d="M20 4h-5"/><path d="M20 4v5"/><path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>`,
  camera: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z"/><circle cx="12" cy="13" r="3.3"/></svg>`,
  route: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4H9a4 4 0 0 1-4-4v-.5"/></svg>`,
  car: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V11.5l1.7-4A2 2 0 0 1 7.6 6h8.8a2 2 0 0 1 1.9 1.5l1.7 4V16"/><path d="M4 16h16"/><path d="M4 16v2.2c0 .44.36.8.8.8H6a1 1 0 0 0 1-1V16"/><path d="M17 16v2.2c0 .44.36.8.8.8H19a1 1 0 0 0 1-1V16"/><circle cx="7.5" cy="13" r="1"/><circle cx="16.5" cy="13" r="1"/></svg>`,
  hotel: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v15"/><path d="M14 21v-9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v9"/><path d="M4 21h16"/><path d="M7 8h1M7 11h1M7 14h1"/></svg>`,
  bulb: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45.9 1.15.9 1.9V16h5.2v-.2c0-.75.3-1.45.9-1.9A6 6 0 0 0 12 3Z"/></svg>`,
  warn: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 4.4 2.6 18a1.6 1.6 0 0 0 1.4 2.4h16a1.6 1.6 0 0 0 1.4-2.4L13.7 4.4a1.6 1.6 0 0 0-2.8 0Z"/></svg>`,
  tree: `<svg class="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 7 10h2.5L6 16h4.5v5h3v-5H18l-3.5-6H17L12 3Z"/></svg>`,
  chevron: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  ticket: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.3a1.7 1.7 0 0 0 0 3.4V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.3a1.7 1.7 0 0 0 0-3.4Z"/><path d="M9 7.5v9" stroke-dasharray="2.2 2.2"/></svg>`,
  target: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`,
  cloud: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.1 9.5 4 4 0 0 0 7 18Z"/></svg>`,
  refresh: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.6"/><path d="M4 4v4.6h4.6"/><path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.4"/><path d="M20 20v-4.6h-4.6"/></svg>`,
  drop: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></svg>`,
  waze: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 4 10 7-10 7 2.5-7L9 4Z" stroke-linejoin="round"/></svg>`,
  headphones: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h2.5a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 18Z"/><path d="M20 14h-2.5a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1h1a1.5 1.5 0 0 0 1.5-1.5Z"/></svg>`
};

function mapLink(address) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
}

function wazeLink(address) {
  return "https://waze.com/ul?q=" + encodeURIComponent(address) + "&navigate=yes";
}

// תחזית Google לאותו יישוב — כרטיס מזג האוויר של גוגל, לצד התחזית שבאפליקציה.
function googleWeatherLink(place) {
  return "https://www.google.com/search?q=" + encodeURIComponent("weather " + place);
}

function commonsFileUrl(filename) {
  return "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(filename);
}

// מרחק קו-אווירי בק"מ בין שתי נקודות {lat,lng} (נוסחת Haversine) — לא זמן נסיעה.
function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function itemCoords(item) {
  return TOWN_COORDS[item.postal] || null;
}

function formatDistance(km) {
  if (km == null) return "";
  return (km < 10 ? km.toFixed(1) : Math.round(km)) + ' ק"מ';
}

const HEB_WEEKDAYS = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"];

/* ============================================================
   פודקאסטים לילדים — פרק לכל אזור פעילות, להאזנה בדרך לשם.
   הקבצים מיוצרים ב-NotebookLM מחומרי המקור שב-podcast-scripts/, מומרים
   ל-m4a עם tools/convert-audio.sh ונשמרים ב-audio/ באותו שם.
   minutes = אורך היעד, נגזר מזמן הנסיעה לאותו אזור. אם הפרק שיצא ארוך
   יותר זה בסדר — הנגן זוכר איפה עצרנו וממשיך משם בפעם הבאה.
   ברגע שקובץ הפרק קיים, לעדכן כאן את האורך האמיתי שלו: המספר הזה מוצג
   למשתמש על שם המקום ("11 דק׳"), ואין טעם שהוא יבטיח משהו אחר מהקובץ.
   בלוק מקבל פרק דרך השדה area, וכמה בלוקים באותו אזור חולקים פרק אחד
   (מגלשת Hasenhorn, המפלים והגשר התלוי הם כולם "טודנאו").

   rev: חשוב — אם מחליפים קובץ פרק שכבר הועלה פעם, צריך להעלות את המספר
   הזה ב-1. הפרקים נשמרים במטמון לפי כתובת, אז בלי זה מכשיר שכבר הוריד את
   הפרק ימשיך לנגן את הגרסה הישנה לנצח (בדיוק כמו CACHE ב-sw.js).

   ready: האם קובץ ה-m4a באמת נמצא ב-audio/. פרק בלי ready לא מקבל אוזניות
   על שם המקום ולא נגן — עדיף שלא יהיה כפתור מאשר כפתור שמוביל להודעה
   שהפרק עוד לא הועלה. tools/convert-audio.sh מסמן את זה לבד כשהוא מייצר
   את הקובץ, אז אין מה לעדכן כאן ביד.
   ============================================================ */
const PODCASTS = {
  feldberg:     { title: "פלדברג ופאנדורנה",        file: "audio/feldberg.m4a",     minutes: 8,  rev: 1 },
  todtnau:      { title: "טודנאו — מגלשה, מפלים וגשר", file: "audio/todtnau.m4a",   minutes: 11, rev: 1, ready: true },
  vogelpark:    { title: "פארק הציפורים והקופים",    file: "audio/vogelpark.m4a",    minutes: 10, rev: 1, ready: true },
  europapark:   { title: "Europa-Park",              file: "audio/europapark.m4a",   minutes: 15, rev: 1 },
  titisee:      { title: "אגם טיטיזי",               file: "audio/titisee.m4a",      minutes: 15, rev: 1, ready: true },
  freiburg:     { title: "פרייבורג",                 file: "audio/freiburg.m4a",     minutes: 25, rev: 1, ready: true },
  rulantica:    { title: "רולנטיקה",                 file: "audio/rulantica.m4a",    minutes: 15, rev: 1 },
  triberg:      { title: "טריברג ושעוני הקוקייה",    file: "audio/triberg.m4a",      minutes: 23, rev: 1, ready: true },
  gutach:       { title: "גוטאך — שביל החושים",      file: "audio/gutach.m4a",       minutes: 25, rev: 1, ready: true },
  rheinfall:    { title: "מפלי הריין",               file: "audio/rheinfall.m4a",    minutes: 25, rev: 1, ready: true },
  badeparadies: { title: "Badeparadies",             file: "audio/badeparadies.m4a", minutes: 11, rev: 1 },
  lindt:        { title: "לינדט — עולם השוקולד",     file: "audio/lindt.m4a",        minutes: 14, rev: 1 }
};

/* לכל יום — blocks כרונולוגי. start/end בפורמט "HH:MM" (שעון מקומי).
   approx:true אומר שהמסמך המקורי לא נתן שעה מדויקת — זו הערכה סבירה.
   בלוק עם address הוא "תחנה" אמיתית (עם מפה, תמונה, זמן נסיעה מהתחנה הקודמת).
   בלוק בלי address הוא מידע נלווה בלבד (בלי מפה/תמונה/זמן נסיעה).
   drive: {time, dist, from} — זמן/מרחק נסיעה מהתחנה הקודמת (או מהמלון, לתחנה הראשונה של היום).
   returnLeg ברמת היום: זמן/מרחק חזרה למלון בסוף היום (לא קיים ביום שיש בו טיסה בסוף). */
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
        title: "Fundorena (\"פאנדורנה\")",
        area: "feldberg",
        desc: "מתחם טרמפולינות, חבלים וטיפוס בפלדברג. שימו לב: השם הרשמי הוא Fundorena (לא Pandorena כפי שכתוב לפעמים). או פשוט להתארגן ולנוח במלון אחרי יום נסיעה.",
        address: "Fundorena, Dr.-Pilet-Spur 11, 79868 Feldberg, Germany",
        coords: { lat: 47.8747, lng: 8.0233, elev: 1230 },
        wxPlace: "Feldberg (Schwarzwald), Germany",
        indoor: true,
        drive: { time: "כ-12 דקות", dist: "כ-8 ק\"מ", from: "מהמלון" },
        infoUrl: "https://fundorena.de/",
        tips: [{ text: "יום ראשון של הטיול — אין שום בעיה לא לעשות כלום חוץ מלהתארגן." }]
      }
    ],
    returnLeg: { time: "כ-12 דקות", dist: "כ-8 ק\"מ", from: "מ-Fundorena", label: "חזרה למלון" }
  },
  {
    date: "2026-08-18",
    title: "טודנאו + פארק הציפורים",
    place: "טודנאו (בוקר) · שטיינן (אחה\"צ)",
    driveNote: "כ-28 דקות לטודנאו · משם כ-40 דקות בעמק הוויזנטל (B317) לשטיינן",
    blocks: [
      {
        start: "09:00", end: "10:00", approx: false,
        title: "מגלשת הקיץ Hasenhorn",
        area: "todtnau",
        desc: "מגלשת קיץ באורך 2.9 ק\"מ — מהארוכות והמרשימות בגרמניה. עולים ברכבל הכיסא ויורדים במזחלת על מסילה. מגיעים בפתיחה בכוונה: בסופי שבוע ובחופשות נוצרים תורים ארוכים.",
        address: "Brandenbergstr. 3, 79674 Todtnau, Germany",
        coords: { lat: 47.83, lng: 7.939, elev: 660 },
        wxPlace: "Todtnau, Germany",
        drive: { time: "כ-28 דקות", dist: "כ-24 ק\"מ", from: "מהמלון" },
        hours: "09:00–16:30 בקיץ",
        infoUrl: "https://www.hasenhorn-rodelbahn.de/en/",
        tips: [
          { text: "נסיעה עצמאית רק מגיל 8 ומגובה 1.40 מ׳. עם מבוגר על אותה מזחלת — מגיל 3 ומגובה 95 ס\"מ, כך שהילד בן ה-5 רוכב צמוד ולא לבד.", warn: true },
          { text: "לא פועלת בסופת רעמים, ברוח חזקה או בכפור — שווה לבדוק את התחזית לפני שיוצאים." }
        ]
      },
      {
        start: "10:15", end: "11:30", approx: true,
        title: "מפלי טודנאו",
        area: "todtnau",
        desc: "הכניסה התחתונה (מומלצת עם ילדים קטנים) בכביש L126 — \"מסלול אדום\" נוח ומתון, כ-10 דק׳ למפל הראשי, הלוך-חזור קלאסי. יש גם כניסה עליונה, ליד טודנאוברג, עם ירידה תלולה יותר — העלייה בחזרה עלולה להיות מאתגרת לרגליים קטנות. טיפ לשני רכבים: להשאיר רכב אחד למטה, לנסוע עם כולם למעלה וללכת את כל המסלול בירידה בלבד.",
        address: "Parkplatz Todtnauer Wasserfall, L126, 79674 Todtnau-Aftersteg, Germany",
        coords: { lat: 47.8266, lng: 7.9469, elev: 700 },
        wxPlace: "Todtnau, Germany",
        drive: { time: "כ-6 דקות", dist: "כ-4 ק\"מ", from: "ממגלשת Hasenhorn" },
        image: { file: "images/todtnau-falls.jpg", credit: "Freiburg1120", license: "CC BY-SA 3.0", commonsFile: "Todtnauer_Wasserfall.jpg" },
        infoUrl: "https://goblackforest.co.il/מפלי-טודנאו/"
      },
      {
        start: "11:30", end: "12:45", approx: true,
        title: "הגשר התלוי Blackforestline",
        area: "todtnau",
        desc: "כניסה נפרדת משלו (אבל בפועל ממש ליד המפלים — כדקה נסיעה) — נוף פנורמי וחוויית אדרנלין.",
        address: "Außer Ort 38, 79674 Todtnau, Germany",
        coords: { lat: 47.8283, lng: 7.945, elev: 730 },
        wxPlace: "Todtnau, Germany",
        drive: { time: "כ-דקה", dist: "כ-80 מ׳ בלבד", from: "ממפלי טודנאו" },
        image: { file: "images/blackforestline.jpg", credit: "Daniel Reust", license: "CC BY-SA 4.0", commonsFile: "Hängebrücke_\"Blackforestline\"_Todtnau.jpg" },
        price: "כרטיס קומבו (גשר + מפל): כ-12€ מבוגר, כ-9€ ילד",
        hours: "8:00–20:30 בקיץ, כניסה אחרונה 19:00. קופה מאוישת/הנחות רק 10:00–16:00 — מעבר לזה רק מכונות, בלי הנחות.",
        infoUrl: "https://goblackforest.co.il/blackforestline/",
        tips: [{ text: "זו נקודת תצפית פנורמית — ביום מעונן נמוך רואים ממנה הרבה פחות. שווה להציץ בתחזית לפני שקונים את הקומבו." }]
      },
      {
        start: "13:45", end: "17:00", approx: true,
        title: "פארק הציפורים והקופים בשטיינן",
        area: "vogelpark",
        desc: "פארק מעולה, לא גדול מדי — אחת ההפתעות החיוביות של היער השחור. מגיעים לסבב אחר הצהריים: מופע עופות דורסים ב-15:00, וקופים שמסתובבים חופשי עם האכלה ב-16:00. (יש גם סבב בוקר ב-11:00 וב-12:00, אבל היום מתחיל בטודנאו.)",
        address: "Hofener Str. 60, 79585 Steinen, Germany",
        coords: { lat: 47.6472, lng: 7.7386, elev: 330 },
        wxPlace: "Steinen, Baden-Württemberg, Germany",
        drive: { time: "כ-40 דקות", dist: "כ-35 ק\"מ", from: "מהגשר התלוי, בעמק הוויזנטל" },
        image: { file: "images/vogelpark.jpg", credit: "Taxiarchos228 / Wladyslaw Sojka", license: "Free Art License 1.3", commonsFile: "Steinen_-_Vogelpark1.jpg" },
        price: "מבוגר 20€, ילד (4–11) 10€",
        hours: "10:00–18:00 בחופשת הקיץ",
        infoUrl: "https://goblackforest.co.il/פארק-הציפורים-והקופים/",
        tips: [{ text: "המופעים בחוץ — בגשם חזק הם עלולים להתבטל. אם התחזית גרועה לאחה\"צ, שווה להקדים ולתפוס את סבב 11:00/12:00 במקום." }]
      }
    ],
    returnLeg: { time: "כ-57 דקות", dist: "כ-49 ק\"מ", from: "מפארק הציפורים", label: "חזרה למלון" }
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
        area: "europapark",
        desc: "יום רביעי נבחר בכוונה — יחד עם יום שישי, זה היום הכי פחות עמוס בפארק (סופ\"ש הכי צפוף). טיפ: להגיע בפתיחה.",
        address: "Europa-Park-Straße 2, 77977 Rust, Germany",
        coords: { lat: 48.266, lng: 7.722, elev: 160 },
        wxPlace: "Rust, Baden-Württemberg, Germany",
        drive: { time: "כ-1:20 שעות", dist: "כ-76 ק\"מ", from: "מהמלון" },
        image: { file: "images/europapark.jpg", credit: "Gabriel Rinaldi", license: "CC BY-SA 4.0", commonsFile: "Haupteingang_(main_entrance)_Europa-Park_Rust.JPG" },
        price: "כ-34–38€ ליום (הערכה 2026, תלוי בתאריך)",
        hours: "9:00–18:00 (לפחות) בקיץ",
        infoUrl: "https://www.europapark.de/en",
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
    ],
    returnLeg: { time: "כ-1:10 שעות", dist: "כ-78 ק\"מ", from: "מ-Europa-Park", label: "חזרה למלון" }
  },
  {
    date: "2026-08-20",
    title: "טיטיזה + פרייבורג",
    place: "אגם טיטיזי (רשות) · פרייבורג",
    driveNote: "האגם כ-12 דקות מהמלון · פרייבורג כ-45 דקות מהאגם",
    blocks: [
      {
        start: "10:00", end: "12:00", approx: true,
        title: "אגם טיטיזי (רשות)",
        area: "titisee",
        desc: "האגם התיירותי המפורסם ביותר ביער השחור — שיט בסירות פדלים/חשמליות, טיילת, גלידה. הבלוק הזה אופציונלי, והוא מופיע גם ביום ראשון 23.8: עושים אותו ביום שבו מזג האוויר נראה טוב יותר, ואם שני הימים אפורים וקרים — אפשר פשוט לוותר.",
        address: "Seestraße, 79822 Titisee-Neustadt, Germany",
        coords: { lat: 47.9008, lng: 8.147, elev: 850 },
        wxPlace: "Titisee-Neustadt, Germany",
        drive: { time: "כ-12 דקות", dist: "כ-10 ק\"מ", from: "מהמלון" },
        image: { file: "images/titisee.jpg", credit: "Christian Maier", license: "CC BY-SA 3.0", commonsFile: "Titisee-blick_von_hochfirst.jpg" },
        infoUrl: "https://www.hochschwarzwald.de/en/attractions/promenade-seestrasse-at-lake-titisee-54ccf30e86",
        tips: [
          { text: "יפה, אבל מלכודת תיירים — שעה־שעתיים מספיקות, לא יותר." },
          { text: "אם מוותרים על האגם ויוצאים ישר לפרייבורג, מגיעים בזמן לשוק הקתדרלה לפני שהוא נסגר סביב 13:00." },
          { text: "לוודא את שעות ההשכרה של סירות הפדלים לפני שמגיעים." }
        ]
      },
      {
        start: "13:30", end: "16:00", approx: true,
        title: "פרייבורג — העיר העתיקה",
        area: "freiburg",
        desc: "כיכר המונסטר, תעלות המים הקטנות שברחובות (Bächle), וקניות ב-Kaiser-Joseph-Straße (\"Ka-Jo\"). שוק הקתדרלה (\"מינסטרמארקט\") ב-Münsterplatz פועל כל בוקר חוץ מיום ראשון ונסגר סביב 13:00 — צד צפוני שוק איכרים (תוצרת מקומית, פירות יער, דבש, פרחים), צד דרומי תבלינים, כלי עץ, מזכרות ואוכל רחוב.",
        address: "Münsterplatz 1, 79098 Freiburg im Breisgau, Germany",
        coords: { lat: 47.9955, lng: 7.8522, elev: 280 },
        wxPlace: "Freiburg im Breisgau, Germany",
        drive: { time: "כ-45 דקות", dist: "כ-32 ק\"מ", from: "מאגם טיטיזי" },
        image: { file: "images/freiburg.jpg", credit: "Sven Puth", license: "CC BY-SA 4.0", commonsFile: "Freiburg_-_Münsterplatz.jpg" },
        infoUrl: "https://goblackforest.co.il/שוק-פרייבורג/",
        tips: [{ text: "בהגעה ב-13:30 השוק כבר סגור — הוא רלוונטי רק אם מדלגים על האגם ומגיעים לפני 13:00.", warn: true }]
      },
      {
        start: "16:00", end: "19:00", approx: true,
        title: "Keidel Mineral-Thermalbad",
        area: "freiburg",
        desc: "מרחצאות מינרליים תרמיים בשכונת St. Georgen שבדרום פרייבורג. בריכות פנים וחוץ במים חמים, בריכת חוויה חיצונית עם תעלת זרם ומיטות בועות, ומגרש משחקים בחוץ. סיום טוב ליום עירוני — ובמיוחד אם יורד גשם.",
        address: "An den Heilquellen 4, 79111 Freiburg im Breisgau, Germany",
        coords: { lat: 47.9739, lng: 7.8203, elev: 240 },
        wxPlace: "Freiburg im Breisgau, Germany",
        indoor: true,
        drive: { time: "כ-12 דקות", dist: "כ-7 ק\"מ", from: "ממרכז פרייבורג" },
        price: "ילדים 4–13: כ-9.50€ כרטיס יום",
        hours: "09:00–22:00 בכל יום · אזור הסאונה מ-10:00",
        infoUrl: "https://www.keideltherme.de/informationen/",
        tips: [{ text: "לקחת בגדי ים ומגבות מהמלון." }]
      }
    ],
    returnLeg: { time: "כ-55 דקות", dist: "כ-42 ק\"מ", from: "מ-Keidel", label: "חזרה למלון" }
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
        area: "rulantica",
        desc: "יום שישי נבחר בכוונה, כמו רביעי — אחד הימים הפחות עמוסים. כרטיס נפרד מ-Europa-Park.",
        address: "Roland-Mack-Ring 1, 77977 Rust, Germany",
        coords: { lat: 48.2597, lng: 7.73, elev: 160 },
        wxPlace: "Rust, Baden-Württemberg, Germany",
        indoor: true,
        drive: { time: "כ-1:22 שעות", dist: "כ-74 ק\"מ", from: "מהמלון" },
        image: { file: "images/rulantica.jpg", credit: "Simone Graffi", license: "CC0 / נחלת הכלל", commonsFile: "Rulantica_EuropaPark.jpg" },
        hours: "בד\"כ 09:30/10:00–22:00 (לבדוק באתר הרשמי לפי התאריך)",
        price: "יום: ילד כ-38–54€, מבוגר כ-41–54€ · \"Moonlight\" (19:00–22:00) הכי זול, ילד כ-28–34€ · מתחת לגיל 4 חינם · 0–3 חינם",
        infoUrl: "https://www.europapark.de/en/rulantica/info/plan-your-visit/opening-hours",
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
    ],
    returnLeg: { time: "כ-1:08 שעות", dist: "כ-76 ק\"מ", from: "מ-Rulantica", label: "חזרה למלון" }
  },
  {
    date: "2026-08-22",
    title: "טריברג + גוטאך",
    place: "טריברג · גוטאך",
    driveNote: "כ-54 דקות נסיעה מהמלון",
    blocks: [
      {
        start: "09:30", end: "12:00", approx: true,
        title: "טריברג",
        area: "triberg",
        desc: "מפלי טריברג — המפורסמים ביער השחור — פלוס שעוני קוקייה ענקיים ומרכז עיירה קלאסי.",
        address: "Hauptstraße 85, 78098 Triberg im Schwarzwald, Germany",
        coords: { lat: 48.1297, lng: 8.2306, elev: 700 },
        wxPlace: "Triberg im Schwarzwald, Germany",
        drive: { time: "כ-54 דקות", dist: "כ-55 ק\"מ", from: "מהמלון" },
        image: { file: "images/triberg.jpg", credit: "Arminia", license: "CC BY-SA 3.0", commonsFile: "Triberger_Wasserfall2.JPG" },
        price: "כניסה למפלים: מבוגר 7–8€, כרטיס משפחתי כ-20€, ילדים עד גיל 6 חינם (בד\"כ מזומן בלבד). אותו כרטיס מזכה גם בכניסה ל-Schwarzwaldmuseum ול-Triberg-Land.",
        hours: "הקופה מאוישת כ-9:00–19:00",
        infoUrl: "https://www.triberg.de/tourismus-freizeit/tourismus-freizeit/natur-erlebnis/deutschlands-hoechste-wasserfaelle",
        tips: [{ text: "מחוץ לשעות הקופה (בוקר מוקדם או ערב) הכניסה למפלים חופשית — וגם פחות עמוס." }]
      },
      {
        start: "13:00", end: "15:30", approx: true,
        title: "גוטאך — שביל החושים",
        area: "gutach",
        desc: "מסלול מעגלי, בין שעה לשלוש שעות לפי קצב. הליכה על דשא, בוץ, אבנים וחול, מוצל ברובו, עם תחנות חוש (מישוש, ריח, ראייה). שווה גם עם ילדים גדולים יותר.",
        address: "Hauptstr. 103, 77793 Gutach im Schwarzwald, Germany",
        coords: { lat: 48.2461, lng: 8.1917, elev: 290 },
        wxPlace: "Gutach im Schwarzwald, Germany",
        drive: { time: "כ-25 דקות", dist: "כ-16 ק\"מ", from: "מטריברג" },
        infoUrl: "https://www.parkmitallensinnen.de/",
        tips: [
          { text: "קחו נעלי מים/סנדלים למי שלא נוח לו ללכת יחף על אבנים." },
          { text: "קחו מים — לא מסלול קצר." },
          { text: "מסעדה יוונית מומלצת, \"אלכסנדרוס\", 3 דקות נסיעה משם." }
        ]
      },
      {
        start: "15:30", end: "16:30", approx: true,
        title: "Sommerrodelbahn גוטאך (רשות)",
        area: "gutach",
        desc: "מגלשת קיץ נוספת, בד\"כ פחות עמוסה מזו שבטודנאו. כניסה חופשית, משלמים רק לפי נסיעה.",
        address: "Singersbach 1a, 77793 Gutach im Schwarzwald, Germany",
        coords: { lat: 48.24, lng: 8.185, elev: 320 },
        wxPlace: "Gutach im Schwarzwald, Germany",
        drive: { time: "כ-3 דקות", dist: "כ-1.6 ק\"מ", from: "משביל החושים" },
        hours: "פתוח מ-10:00 (מ-9:00 בחופשת הקיץ)",
        infoUrl: "https://www.sommerrodelbahn-gutach.de/en/",
        tips: [{ text: "גיל מינימום לנסיעה לבד הוא 8 — הילד בן ה-5 יכול לנסוע רק כנוסע צמוד למבוגר על אותה מזחלת, לא לבד.", warn: true }]
      }
    ],
    dayNote: "שקלו לקצר את היום — 3 עצירות וכשעה נסיעה בין הראשונה לאחרונה. אם הזמן לוחץ, שעה בשביל גוטאך מספיקה.",
    returnLeg: { time: "כ-1:15 שעות", dist: "כ-69 ק\"מ", from: "מ-Sommerrodelbahn", label: "חזרה למלון" }
  },
  {
    date: "2026-08-23",
    title: "מפלי הריין + Badeparadies",
    place: "נוישאוזן אם ריינפאל · טיטיזה-נוישטט",
    driveNote: "כ-56 דקות למפלי הריין · כשעה חזרה לאזור טיטיזה",
    blocks: [
      {
        start: "10:30", end: "12:30", approx: true,
        title: "מפלי הריין",
        area: "rheinfall",
        desc: "המפל הגדול ביותר באירופה — מרשים מאוד. החובה: השיט שמגיע לסלע במרכז המפל. יש פארק חבלים בקרבת מקום, כנראה לא מתאים לקטנים.",
        address: "Rheinfall, 8212 Neuhausen am Rheinfall, Switzerland",
        coords: { lat: 47.6779, lng: 8.6152, elev: 390 },
        wxPlace: "Neuhausen am Rheinfall, Switzerland",
        drive: { time: "כ-56 דקות", dist: "כ-56 ק\"מ", from: "מהמלון" },
        image: { file: "images/rheinfall.jpg", credit: "CrazyD", license: "CC BY-SA 3.0", commonsFile: "Rheinfall_bei_Schaffhausen_02.JPG" },
        infoUrl: "https://rheinfall.ch/en/",
        tips: [
          { text: "השיט לסלע יכול להיות עוצמתי/מפחיד לילד בן 5 — שווה לבדוק מולו לפני שעולים. החניה ליד המפל בתשלום, כמה פרנקים שוויצריים לשעה." },
          { text: "לא להגיע מוקדם מדי — בשעות הבוקר המוקדמות האזור נוטה להיות מעונן וקריר, ומ-11:00 מתבהר ומתחמם." }
        ]
      },
      {
        start: "14:00", end: "15:30", approx: true,
        title: "אגם טיטיזי (רשות)",
        area: "titisee",
        desc: "האגם התיירותי המפורסם ביותר ביער השחור — שיט בסירות פדלים/חשמליות, טיילת, גלידה. הבלוק הזה אופציונלי, והוא מופיע גם ביום חמישי 20.8: עושים אותו ביום שבו מזג האוויר נראה טוב יותר. היתרון כאן — האגם שלוש דקות מ-Badeparadies, אז אפשר להחליט על המקום.",
        address: "Seestraße, 79822 Titisee-Neustadt, Germany",
        coords: { lat: 47.9008, lng: 8.147, elev: 850 },
        wxPlace: "Titisee-Neustadt, Germany",
        drive: { time: "כ-1 שעה", dist: "כ-70 ק\"מ", from: "ממפלי הריין, מעבר גבול חזרה לגרמניה" },
        image: { file: "images/titisee.jpg", credit: "Christian Maier", license: "CC BY-SA 3.0", commonsFile: "Titisee-blick_von_hochfirst.jpg" },
        infoUrl: "https://www.hochschwarzwald.de/en/attractions/promenade-seestrasse-at-lake-titisee-54ccf30e86",
        tips: [{ text: "יפה, אבל מלכודת תיירים — שעה־שעתיים מספיקות, לא יותר." }]
      },
      {
        start: "16:00", end: "20:00", approx: true,
        title: "Badeparadies Schwarzwald",
        area: "badeparadies",
        desc: "פארק המים הטוב באזור. אזור Galaxy עם עשרות מגלשות, מתאים לילדים ולמתבגרים; יש גם ספא למבוגרים. פתוח עד 22:00, אז גם כניסה ב-16:00 נותנת יום מלא.",
        address: "Am Badeparadies 1, 79822 Titisee-Neustadt, Germany",
        coords: { lat: 47.9089, lng: 8.1637, elev: 860 },
        wxPlace: "Titisee-Neustadt, Germany",
        indoor: true,
        drive: { time: "כ-3 דקות", dist: "כ-1 ק\"מ", from: "מאגם טיטיזי" },
        image: { file: "images/badeparadies.jpg", credit: "qwesy qwesy", license: "CC BY 3.0", commonsFile: "Galaxy_Schwarzwald_(Badeparadies_Schwarzwald_in_Titisee)_-_panoramio.jpg" },
        price: "כ-22€ (4 שעות) / כ-30€ (יום) לנפש",
        hours: "9:00–22:00 בכל יום בחופשת הקיץ",
        infoUrl: "https://www.badeparadies-schwarzwald.de/en/",
        tips: [
          { text: "הכרטיסים כבר קנויים ליום ראשון אחר הצהריים — לוודא את חלון הזמן המדויק מול ההזמנה, במיוחד אם הוא כרטיס 4 שעות.", warn: true },
          { text: "יום ראשון והרבה מסעדות סגורות — יש אוכל בתוך הפארק, וזה פותר את ארוחת הערב." },
          { text: "להביא מגבות מהמלון, או לשכור במקום." }
        ]
      }
    ],
    returnLeg: { time: "כ-11 דקות", dist: "כ-11 ק\"מ", from: "מ-Badeparadies", label: "חזרה למלון" }
  },
  {
    date: "2026-08-24",
    title: "לינדט + טיסה הביתה",
    place: "קילכברג ← נתב\"ג ציריך",
    driveNote: "כ-1:50 שעות מהמלון לקילכברג, ועוד כ-31 דקות לנתב\"ג",
    blocks: [
      {
        start: "11:30", end: "16:00", approx: true,
        title: "Lindt Home of Chocolate",
        area: "lindt",
        desc: "מזרקת השוקולד, החנות והקפה פתוחים לכולם, גם בלי כרטיס למוזיאון.",
        address: "Schokoladenplatz 1, 8802 Kilchberg, Switzerland",
        coords: { lat: 47.3231, lng: 8.5453, elev: 410 },
        wxPlace: "Kilchberg, Zürich, Switzerland",
        indoor: true,
        drive: { time: "כ-1:50 שעות", dist: "כ-145 ק\"מ", from: "מהמלון" },
        image: { file: "images/lindt.jpg", credit: "Brian Shamblen", license: "CC BY 2.0", commonsFile: "Two_story_chocolate_fountain_in_the_lobby_of_the_Lindt_factory_in_Zurich,_Switzerland_(52167915483).jpg" },
        tips: [
          { text: "מוזיאון ה-FIFA סגור בימי שני, וה-24.8 הוא יום שני — אז היום זה לינדט, אין ברירה אחרת.", warn: true },
          { text: "ביקוש גבוה מאוד — להזמין כרטיס וחלון זמן מראש." },
          { text: "אם עושים גם סדנת שוקולד — גם אותה צריך להזמין מראש." }
        ]
      },
      {
        start: "17:00", end: "22:00", approx: true,
        title: "טיסה הביתה מציריך",
        desc: "נסיעה לנתב\"ג ציריך, ואז המראה ב-22:00. לוודא את השעה המדויקת מול הכרטיס בפועל, קרוב יותר לתאריך.",
        address: "Zürich Airport (ZRH), Flughafenstrasse, 8058 Zürich-Flughafen, Switzerland",
        coords: { lat: 47.4502, lng: 8.5618, elev: 430 },
        wxPlace: "Kloten (Zürich Airport), Switzerland",
        indoor: true,
        drive: { time: "כ-31 דקות", dist: "כ-19 ק\"מ", from: "מ-Lindt Home of Chocolate" },
        image: { file: "images/zurich-airport.jpg", credit: "Designalltag", license: "CC BY-SA 4.0", commonsFile: "Flughafen_Zuerich.jpg" },
        infoUrl: "https://www.flughafen-zuerich.ch/en/passengers"
      }
    ],
    dayNote: "מפלי הריין עברו ליום ראשון 23.8, אז היום הזה קליל ויש בו הרבה זמן פנוי לפני הטיסה. זמן הנסיעה מהמלון לקילכברג הוא הערכה — שווה לפתוח את \"מסלול הנסיעה של היום\" ולוודא בבוקר."
    // אין returnLeg ביום הזה — מסתיים בשדה התעופה, לא חוזרים למלון.
  }
];

/* ============================================================
   כרטיס האדום — Hochschwarzwald Card
   כל ההטבות מהרשימה הרשמית 2026 (מוצג בקיץ בלבד — פריטי חורף הוסרו).
   קואורדינטות ב-TOWN_COORDS הן מרכז-עיר משוער לפי מיקוד, למיון מרחק אווירי
   בלבד — לא לניווט. פתיחת "מפה" בכל כרטיס פותחת כתובת מדויקת ב-Google Maps.
   שדות בפריט: name, cat, type ("free"|"discount"), benefit (טקסט ההטבה),
   address, postal (למיון מרחק), phone, site, note (הערה/סייג), family (bool).
   ============================================================ */

const HOTEL_COORDS = { lat: 47.8601, lng: 8.1075 }; // Hotel Schlehdorn, Altglashütten

const TOWN_COORDS = {
  "79868": { lat: 47.8608, lng: 8.1064 }, // Feldberg
  "79822": { lat: 47.9174, lng: 8.1524 }, // Titisee-Neustadt
  "79859": { lat: 47.8241, lng: 8.1808 }, // Schluchsee
  "79874": { lat: 47.9294, lng: 8.0264 }, // Breitnau
  "79865": { lat: 47.7994, lng: 8.1214 }, // Grafenhausen / Rothaus
  "79274": { lat: 48.0011, lng: 8.1067 }, // St. Märgen
  "79843": { lat: 47.8836, lng: 8.3436 }, // Löffingen / Dittishausen
  "79837": { lat: 47.7597, lng: 8.1278 }, // St. Blasien / Menzenschwand
  "79848": { lat: 47.8264, lng: 8.3325 }, // Bonndorf
  "78120": { lat: 48.0503, lng: 8.2081 }, // Furtwangen
  "78112": { lat: 48.1272, lng: 8.3308 }, // St. Georgen
  "78136": { lat: 48.1206, lng: 8.2181 }, // Schonach
  "78141": { lat: 48.1039, lng: 8.1961 }, // Schönwald
  "79199": { lat: 47.9836, lng: 7.9736 }, // Kirchzarten
  "79254": { lat: 47.9214, lng: 7.9803 }, // Oberried
  "79674": { lat: 47.8317, lng: 7.9364 }, // Todtnau
  "79737": { lat: 47.6497, lng: 8.0122 }, // Herrischried
  "79777": { lat: 47.7167, lng: 8.3000 }, // Ühlingen-Birkendorf
  "79183": { lat: 48.0956, lng: 7.9639 }, // Waldkirch
  "77966": { lat: 48.3167, lng: 7.8500 }, // Kappel-Grafenhausen
  "79780": { lat: 47.7394, lng: 8.4394 }, // Stühlingen
  "79682": { lat: 47.7442, lng: 7.9611 }, // Todtmoos
  "79276": { lat: 48.0244, lng: 7.9522 }, // Reute (Freiburg)
  "78089": { lat: 48.0575, lng: 8.3364 }, // Unterkirnach
  "79856": { lat: 47.9058, lng: 8.1017 }, // Hinterzarten
  "78126": { lat: 48.0975, lng: 8.4364 }, // Königsfeld
  "79871": { lat: 47.8747, lng: 8.1719 }, // Eisenbach
  "79853": { lat: 47.8672, lng: 8.2000 }  // Lenzkirch
};

const RED_CARD_INFO = {
  title: "כרטיס האדום — Hochschwarzwald Card",
  eligibilityNote: "המלון שלכם (Hotel Schlehdorn) הוא בית הארחה שותף, וכל שהייה של 2 לילות ומעלה מזכה בכרטיס בחינם — אתם שוהים 7 לילות, אז זה אוטומטי לגמרי. אין צורך לרכוש שום דבר.",
  activationSteps: [
    "אחרי ההזמנה המלון אמור לשלוח מייל הפעלה עם קישור לרישום — אם לא הגיע, לבדוק בספאם או לשאול בקבלה עם ההגעה.",
    "בהרשמה כל בן משפחה, כולל הילדים, מקבל קוד QR אישי משלו.",
    "הכרטיס דיגיטלי לגמרי — מציגים את קוד ה-QR מהטלפון בכל אטרקציה.",
    "כדאי להירשם לפני היום הראשון (17.8) — כבר באותו יום יש הטבה ב-Fundorena."
  ],
  links: [
    { label: "האתר הרשמי של הכרטיס", url: "https://www.hochschwarzwald.de/en/red-card" },
    { label: "פורטל ההרשמה וההזמנות", url: "https://mein.hochschwarzwald.de" },
    { label: "כל ההטבות באתר הרשמי (כולל תמונות ומפה)", url: "https://www.hochschwarzwald.de/en/red-card/red-card-attractions" }
  ]
};

// התאמות מאומתות מול DAYS — הטבות שכבר חלות על עצירות בתוכנית הקיימת.
const RED_CARD_PLANNED = [
  {
    dayDate: "2026-08-17", dayTitle: "הגעה", stopTitle: "Fundorena — פארק החבלים המקורה",
    type: "free", benefit: "שעה חינם בפארק החבלים המקורה (Indoor-Hochseilpark, מגיל 5).",
    originalNote: "ערך משוער לפי מחירון האתר: כ-18€ לאדם.",
    caveat: null,
    address: "Dr.-Pilet-Spur 11, 79868 Feldberg, Germany",
    site: "https://fundorena.de/"
  },
  {
    dayDate: "2026-08-17", dayTitle: "הגעה", stopTitle: "Fundorena — טרמפולינות / בולדרינג",
    type: "free", benefit: "שעה חינם בפארק הטרמפולינות (מגיל 2) או בקיר הבולדרינג (מגיל 5) — לבחירה. גרביים/נעלי בולדרינג בתוספת 4€.",
    originalNote: "ערך משוער לפי מחירון האתר: כ-15.50€ לאדם.",
    caveat: "שתי ההטבות של Fundorena (טיפוס + טרמפולינות/בולדר) בתוקף בו-זמנית — כל בן משפחה יכול לנצל את שתיהן.",
    address: "Dr.-Pilet-Spur 11, 79868 Feldberg, Germany",
    site: "https://fundorena.de/"
  },
  {
    dayDate: "2026-08-20", dayTitle: "טיטיזה + פרייבורג", stopTitle: "שיט בסירה באגם טיטיזי",
    type: "free", benefit: "שיט סיבוב חינם עם אחת משתי חברות השיט באגם (Bootsbetrieb Schweizer או Drubba) — תלוי מזג אוויר, אפריל–אוקטובר.",
    originalNote: null,
    caveat: "בלוק האגם הוא רשות ומופיע גם ב-23.8 אחרי מפלי הריין — ההטבה תקפה בכל יום שבו תגיעו לאגם. בנוסף: זה סיבוב מאורגן בסירת שיט, לא זהה להשכרת סירת פדלים/חשמלית עצמאית. אם רוצים גם וגם, זו הטבה נוספת ולא תחליף.",
    address: "Seestraße 33, 79822 Titisee-Neustadt, Germany",
    site: "https://www.bootsbetrieb-schweizer-titisee.de/"
  },
  {
    dayDate: "2026-08-23", dayTitle: "מפלי הריין + Badeparadies", stopTitle: "Badeparadies Schwarzwald",
    type: "discount", benefit: "30% הנחה על כרטיס 4 שעות ל-Galaxy או Palmenoase.",
    originalNote: "מחיר מקורי לפי התוכנית: כ-22€ לאדם (4 שעות) ← אחרי הנחה כ-15.4€.",
    caveat: "בטקסט הרשמי מופיע \"ab 16 J.\" (מגיל 16) — לא ברור אם זה חל על Palmenoase (אזור ספא למבוגרים) בלבד או על ההנחה כולה. כדאי לוודא בקבלה או בפורטל הכרטיס לפני שמסתמכים על ההנחה לכל המשפחה. בנוסף: תוספת 6€ לאדם על כרטיס יום מלא, ובסופ״ש כרטיס משולב בלבד.",
    address: "Am Badeparadies 1, 79822 Titisee-Neustadt, Germany",
    site: "https://www.badeparadies-schwarzwald.de/en/"
  },
  {
    dayDate: "2026-08-18", dayTitle: "טודנאו + פארק הציפורים", stopTitle: "הגשר התלוי Blackforestline",
    type: "free", benefit: "כניסה חינם לגשר התלוי (פעם אחת).",
    originalNote: "בתוכנית המקורית מופיע כרטיס קומבו גשר+מפל בעלות של כ-12€ מבוגר / 9€ ילד.",
    caveat: "ההטבה מכסה רק את הגשר עצמו — לא נמצא אזכור לכניסה למפלי טודנאו בתוך הטבת הכרטיס. כדאי לבדוק בקופה אם אפשר לשלם רק על חלק המפל, או אם המחיר המשולב עדיין רלוונטי.",
    address: "Außer Ort 38, 79674 Todtnauberg, Germany",
    site: "https://blackforestline.de/"
  }
];

const CATEGORY_LABELS = {
  "leisure-sport": "פנאי וספורט",
  "pools-lakes": "בריכות ואגמים",
  "nature-bike": "טבע ואופניים",
  "museums-tours": "מוזיאונים וסיורים",
  "escape-vr": "משחקי בריחה ו-VR",
  "culinary": "אוכל ושתייה",
  "golf": "גולף"
};

// כל שאר הטבות הכרטיס (קיץ + כל השנה) שלא נכללות כבר ב-RED_CARD_PLANNED.
// תגית family=false ניתנה רק כשהטקסט הרשמי מציין גיל 18+ במפורש, או שמדובר
// במגרש גולף/יין/אלכוהול — בכל שאר המקרים ברירת המחדל היא family=true.
// setting: "indoor" | "outdoor" | "mixed" — לפי אופי הפעילות.
// reservation: true כשההטבה עצמה או ההערה מציינות הזמנה/הרשמה/תיאום מראש כתנאי.
// desc: תיאור קצר של המקום עצמו (לא של ההטבה) — לתצוגת ה-drill-down.
const RED_CARD_CATALOG = [
  // --- פנאי וספורט ---
  { name: "Funny-World פארק שעשועים", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "פארק שעשועים משפחתי עם מתקנים, קרוסלות ופעילויות מקורות ובחוץ, מתאים לילדים בכל הגילאים.", address: "Allmendstr. 1, 77966 Kappel-Grafenhausen, Germany", postal: "77966", town: "קאפל-גרפנהאוזן", setting: "indoor", reservation: false, phone: "+49 7822 445990", site: "https://www.funny-world.de/", family: true },
  { name: "Spielscheune Unterkirnach — אסם משחקים מקורה", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "אסם משחקים מקורה גדול לילדים קטנים, עם מתקני טיפוס, מגלשות ופינות משחק.", address: "Schlossbergweg 4, 78089 Unterkirnach, Germany", postal: "78089", town: "אונטרקירנאך", setting: "indoor", reservation: false, phone: "+49 7721 800855", site: "https://www.spielscheune-unterkirnach.de/", family: true },
  { name: "Blattert Mühle — Schnitzeljagd (ציד אוצרות בטחנה)", cat: "leisure-sport", type: "free", benefit: "השתתפות חינם, בלי הרשמה מראש — בשעות הפתיחה של הקורנhaus.", desc: "ציד אוצרות משפחתי בשטח טחנת הקמח ההיסטורית של בונדורף.", address: "Konstantin-Fehrenbach-Str. 34, 79848 Bonndorf, Germany", postal: "79848", town: "בונדורף", setting: "outdoor", reservation: false, phone: "+49 7703 318", site: "https://www.blattert-muehle.de/", family: true },
  { name: "Lasertag Base טיטיזה", cat: "leisure-sport", type: "free", benefit: "15 דקות חינם, פעם אחת — הזמנה מקוונת בלבד.", desc: "מתחם לייזר-טאג מקורה בטיטיזה, פעילות אקשן קבוצתית לילדים גדולים יותר ומבוגרים.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "indoor", reservation: true, phone: "+49 7651 9331170", family: true },
  { name: "Tatzmania — פארק חיות והרפתקאות", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "פארק חיות והרפתקאות בלופינגן עם בעלי חיים, מתקני שעשועים ומופעים.", address: "Wildpark 3, 79843 Löffingen, Germany", postal: "79843", town: "לפינגן", setting: "outdoor", reservation: false, phone: "+49 7654 8068144", site: "https://www.tatzmania.com/", family: true },
  { name: "Brauereigasthof Rothaus", cat: "leisure-sport", type: "free", benefit: "כניסה חינם ל-\"Zäpfle Heimat\" כולל משקה 0.33 ליטר (בירה או חלופה אחרת).", desc: "מרכז מבקרים ומסעדה של מבשלת הבירה המפורסמת רוטהאוס.", address: "Rothaus 1, 79865 Grafenhausen, Germany", postal: "79865", town: "גרפנהאוזן", setting: "indoor", reservation: false, phone: "+49 7748 522-0", site: "https://www.rothaus.de/", family: true },
  { name: "Spaßpark Hochschwarzwald", cat: "leisure-sport", type: "free", benefit: "כרטיס Card-Gaudi חינם ל-3 שעות בקיץ, כולל Loopy-Ball ופוטבול-גולף/ביליארד.", desc: "פארק פנאי בשלוכזה עם פעילויות קיץ כמו כדור-ענק (Loopy-Ball) ופוטבול-גולף.", address: "Fischbacher Str. 16, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: false, phone: "+49 7656 9882916", site: "https://www.spasspark.de/", family: true },
  { name: "Abenteuer Golfpark Hochschwarzwald (מיני-גולף הרפתקאות)", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", desc: "מיני-גולף הרפתקאות בלנצקירך-קאפל, מסלול חוץ צבעוני למשפחות.", address: "Am Kurgarten 1, 79853 Lenzkirch-Kappel, Germany", postal: "79853", town: "לנצקירך", setting: "outdoor", reservation: false, phone: "+49 7641 6588", site: "https://www.abenteuergolfpark.de/", family: true },
  { name: "תיאטרון ב-Kurhaus טיטיזה", cat: "leisure-sport", type: "free", benefit: "כרטיס חינם למופע לבחירה — לפי מקום פנוי בקופת הערב, בלי הזמנה מראש.", desc: "אולם תיאטרון קטן בבית הקורהאוס של טיטיזה, עם הצגות ומופעים מתחלפים.", address: "Strandbadstr. 4, 79822 Titisee-Neustadt, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "indoor", reservation: false, phone: "+49 7652 1206 8125", family: true },
  { name: "Krone Theater Kino נוישטט", cat: "leisure-sport", type: "free", benefit: "כרטיס קולנוע חינם (פרקט), פעם אחת — לא כולל אירועים מיוחדים.", desc: "בית קולנוע עצמאי במרכז טיטיזה-נוישטט.", address: "Hirschenbuckel 2, 79822 Titisee-Neustadt, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "indoor", reservation: false, phone: "+49 7651 1387", site: "https://www.krone-theater.de/", family: true },
  { name: "Kino im Höfle לנצקירך", cat: "leisure-sport", type: "free", benefit: "כרטיס קולנוע חינם, פעם אחת.", desc: "בית קולנוע קטן ומקומי בלנצקירך.", address: "Im Höfle 11, 79853 Lenzkirch, Germany", postal: "79853", town: "לנצקירך", setting: "indoor", reservation: false, phone: "+49 7653 962220", family: true },
  { name: "Feldbergbahn — הרכבל", cat: "leisure-sport", type: "free", benefit: "עלייה וירידה חינם ברכבל, כולל כניסה למגדל פלדברג.", desc: "רכבל העולה לפסגת הפלדברג, ההר הגבוה ביותר ביער השחור, עם נוף פנורמי ומגדל תצפית.", address: "Dr.-Pilet-Spur, 79868 Feldberg, Germany", postal: "79868", town: "פלדברג", setting: "outdoor", reservation: false, site: "https://www.feldberg-erlebnis.de/", note: "לא בתוכנית הנוכחית — קל לשלב ביום קליל, כמו יום פארק הציפורים.", family: true },
  { name: "SUP בחוף Windgfällweiher", cat: "leisure-sport", type: "free", benefit: "60 דקות גלישת SUP חינם, פעם אחת — תלוי מזג אוויר.", desc: "חוף אגם קטן בלנצקירך עם אפשרות לגלישת SUP.", address: "Raitenbucher Str. 37, 79853 Lenzkirch, Germany", postal: "79853", town: "לנצקירך", setting: "outdoor", reservation: false, phone: "+49 176 98285016", site: "https://www.strandbad-windgfaellweiher.de/", family: true },
  { name: "Rothaus-Express — רכבת פנורמה", cat: "leisure-sport", type: "free", benefit: "סיור פנורמה חינם, פעם אחת — לפי מקום פנוי.", desc: "רכבת תיירותית פתוחה שמסתובבת בנוף שסביב מבשלת רוטהאוס.", address: "Sonnhalde 14, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: false, phone: "+49 152 03441239", site: "https://www.rothausexpress.de/", family: true },
  { name: "מיני-גולף St. Georgen", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", desc: "מסלול מיני-גולף חוץ קלאסי, פעילות קלה ומשפחתית בסנט גאורגן.", address: "Spittelbergstr. 19d, 78112 St. Georgen, Germany", postal: "78112", town: "סנט גאורגן", setting: "outdoor", reservation: false, phone: "+49 7724 870", family: true },
  { name: "מיני-גולף Schönwald", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", desc: "מסלול מיני-גולף חוץ קלאסי, פעילות קלה ומשפחתית בשנוואלד.", address: "Ludwig-van-Beethoven-Str., 78141 Schönwald, Germany", postal: "78141", town: "שנוואלד", setting: "outdoor", reservation: false, phone: "+49 1525 1092775", family: true },
  { name: "מיני-גולף Schonach", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", desc: "מסלול מיני-גולף חוץ קלאסי, פעילות קלה ומשפחתית בשונאך.", address: "Hauptstraße 6, 78136 Schonach, Germany", postal: "78136", town: "שונאך", setting: "outdoor", reservation: false, phone: "+49 7722 9650050", family: true },
  { name: "מיני-גולף Schluchsee", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", desc: "מסלול מיני-גולף חוץ קלאסי, פעילות קלה ומשפחתית בשלוכזה.", address: "Auf der Wacht 1, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: false, phone: "+49 7656 988 2916", family: true },
  { name: "Schwarzwaldzoo Waldkirch", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "גן חיות קטן ונעים בוולדקירך, ליד פרייבורג.", address: "Am Buchenbühl 8a, 79183 Waldkirch, Germany", postal: "79183", town: "וולדקירך", setting: "outdoor", reservation: false, phone: "+49 7681 8961", site: "https://www.schwarzwaldzoo.de/", note: "קרוב לפרייבורג — אפשר לשלב ביום פרייבורג/טודנאו אם נשאר זמן.", family: true },
  { name: "Action Forest Offroad Park טיטיזה", cat: "leisure-sport", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד.", desc: "מסלול רכבי שטח (Offroad) בטיטיזה, לילדים ומבוגרים.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "outdoor", reservation: true, phone: "+49 7651 82560", family: true },
  { name: "Action Forest Kletterwald (פארק חבלים)", cat: "leisure-sport", type: "free", benefit: "3 שעות חינם בפארק החבלים.", desc: "פארק חבלים בחוץ בטיטיזה, עם מסלולים בגבהים שונים בין העצים.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "outdoor", reservation: true, phone: "+49 7651 9331170", family: true },
  { name: "סדנת שעון קוקייה עצמאית — stattMuseum פורטוואנגן", cat: "leisure-sport", type: "free", benefit: "השתתפות חינם בהכנת שעון קוקייה, בהרשמה מראש (מגיל 16, ילדים עד 10 עם מלווה).", desc: "סדנה עצמאית להרכבת שעון קוקייה משלכם, ב-stattMuseum בפורטוואנגן.", address: "Friedrichstr. 3, 78120 Furtwangen, Germany", postal: "78120", town: "פורטוואנגן", setting: "indoor", reservation: true, phone: "+49 7723 9202 800", note: "טלפון/מייל להרשמה מראש, ב-Mo-Fr 9:00-14:30.", family: true },
  { name: "Bogensportzentrum — קשתות", cat: "leisure-sport", type: "free", benefit: "2 שעות קשתות חינם באולם, כולל הדרכה וציוד — לא כולל מסלול חוץ.", desc: "אולם קשתות מקצועי באייזנבך, עם הדרכה לכל הרמות.", address: "Hauptstr. 55, 79871 Eisenbach, Germany", postal: "79871", town: "אייזנבך", setting: "indoor", reservation: true, phone: "+49 7657 471", note: "הרשמה טלפונית מראש, שעות ירי 10:00 / 12:00 / 14:00.", family: true },

  // --- בריכות ואגמים ---
  { name: "Hallenbad Breitnau (בריכה מקורה + סאונה)", cat: "pools-lakes", type: "free", benefit: "כניסה חינם לבריכה ולסאונה, פעם אחת.", desc: "בריכה מקורה קטנה בברייטנאו, עם סאונה.", address: "Dorfstr. 3, 79874 Breitnau, Germany", postal: "79874", town: "ברייטנאו", setting: "indoor", reservation: false, phone: "+49 7652 910950", family: true },
  { name: "Hallenbad Löffingen-Dittishausen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "בריכה מקורה קהילתית בשכונת דיטישאוזן שבלפינגן.", address: "Taborstr. 33, 79843 Löffingen-Dittishausen, Germany", postal: "79843", town: "לפינגן", setting: "indoor", reservation: false, phone: "+49 7654 493", family: true },
  { name: "Hallenbad St. Georgen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "בריכה מקורה עירונית בסנט גאורגן.", address: "Im Hochwald 6, 78112 St. Georgen, Germany", postal: "78112", town: "סנט גאורגן", setting: "indoor", reservation: false, phone: "+49 7724 87358", family: true },
  { name: "Hallenbad Schluchsee-Schönenbach", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "בריכה מקורה קטנה בשכונת שנבך שבשלוכזה.", address: "Weiherstr. 4, 79859 Schluchsee-Schönenbach, Germany", postal: "79859", town: "שלוכזה", setting: "indoor", reservation: false, phone: "+49 7747 511", family: true },
  { name: "בריכת חוץ עירונית בונדורף", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — מתחילת הקיץ עד סוף חופשת הקיץ.", desc: "בריכת חוץ קהילתית בלב בונדורף, פתוחה בקיץ.", address: "Schwimmbadstr. 11, 79848 Bonndorf, Germany", postal: "79848", town: "בונדורף", setting: "outdoor", reservation: false, phone: "+49 7703 8034", family: true },
  { name: "Waldbad Löffingen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת חוץ בטבע, בשולי היער ליד לפינגן.", address: "Welschland, 79843 Löffingen, Germany", postal: "79843", town: "לפינגן", setting: "outdoor", reservation: false, phone: "+49 7654 8266", family: true },
  { name: "Freibad Dittishausen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת חוץ שכונתית קטנה בדיטישאוזן.", address: "Schwimmbadstr. 30, 79843 Löffingen-Dittishausen, Germany", postal: "79843", town: "לפינגן", setting: "outdoor", reservation: false, phone: "+49 7654 808801", family: true },
  { name: "Freibad Lenzkirch", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת חוץ עירונית בלנצקירך.", address: "Friedhofstr. 11, 79853 Lenzkirch, Germany", postal: "79853", town: "לנצקירך", setting: "outdoor", reservation: false, phone: "+49 7653 400", family: true },
  { name: "Freibad נוישטט (טיטיזה)", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת חוץ עירונית בטיטיזה-נוישטט.", address: "Gutachstraße 33, 79822 Titisee-Neustadt, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "outdoor", reservation: false, phone: "+49 7651 9331121", family: true },
  { name: "Naturena-Badesee", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "אגם רחצה טבעי באילינגן-בירקנדורף.", address: "Im Tal 1, 79777 Ühlingen-Birkendorf, Germany", postal: "79777", town: "אילינגן-בירקנדורף", setting: "outdoor", reservation: false, phone: "+49 7743 919727", family: true },
  { name: "Naturfreibad Klosterweiher (סנט גאורגן)", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת טבע קטנה בסנט גאורגן.", address: "Brigachstr. 2, 78112 St. Georgen, Germany", postal: "78112", town: "סנט גאורגן", setting: "outdoor", reservation: false, phone: "+49 7724 87386", family: true },
  { name: "Naturfreibad סנט מרגן", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת טבע כפרית בסנט מרגן.", address: "Sportplatz 4, 79274 St. Märgen, Germany", postal: "79274", town: "סנט מרגן", setting: "outdoor", reservation: false, phone: "+49 7669 91180", family: true },
  { name: "Naturfreibad שנוואלד", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת טבע כפרית בשנוואלד.", address: "Ludwig-van-Beethoven-Str. 15, 78141 Schönwald, Germany", postal: "78141", town: "שנוואלד", setting: "outdoor", reservation: false, phone: "+49 173 2874525", family: true },
  { name: "Bregtalbad פורטוואנגן", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת חוץ לאורך נהר הברג, בפורטוואנגן.", address: "Jahnstraße 11, 78120 Furtwangen, Germany", postal: "78120", town: "פורטוואנגן", setting: "outdoor", reservation: false, phone: "+49 7723 9149709", family: true },
  { name: "aqua fun שלוכזה", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "בריכת חוץ עירונית בשלוכזה, ליד האגם.", address: "Freiburger Str. 16, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: false, phone: "+49 7656 7731", family: true },
  { name: "חוף רחצה Windgfällweiher", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", desc: "חוף רחצה טבעי על אגם קטן בלנצקירך.", address: "Raitenbucher Str. 37, 79853 Lenzkirch, Germany", postal: "79853", town: "לנצקירך", setting: "outdoor", reservation: false, phone: "+49 176 98285016", site: "https://www.strandbad-windgfaellweiher.de/", family: true },

  // --- טבע ואופניים ---
  { name: "טיול/ליטוף אלפקות — Haberjockelshof", cat: "nature-bike", type: "free", benefit: "השתתפות חינם בטיול אלפקות או ליטוף אלפקות, לפי זמינות — הרשמה בפורטל הכרטיס.", desc: "חוות אלפקות בטיטיזה-נוישטט, עם טיולים מודרכים או ליטוף בחצר.", address: "Schwärzenbach 24, 79822 Titisee-Neustadt, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "outdoor", reservation: true, site: "https://www.haberjockelshof.de/", note: "נקודת מפגש 10:00, רק לפי זמינות.", family: true },
  { name: "סיור עשבי בר עם טעימה", cat: "nature-bike", type: "free", benefit: "השתתפות חינם, מיקומים משתנים.", desc: "סיור רגלי מודרך ללימוד צמחי בר אכילים ברחבי האזור, כולל טעימה.", address: "מיקומים משתנים, Hochschwarzwald, Germany", postal: "79868", town: "פלדברג (ואזור)", setting: "outdoor", reservation: true, note: "תאריכים ופרטים בפורטל הכרטיס mein.hochschwarzwald.de.", family: true },
  { name: "סדנת משחות טבעיות", cat: "nature-bike", type: "free", benefit: "השתתפות חינם — מתקיים בשנוואלד.", desc: "סדנת הכנת משחות טבעיות מצמחי מרפא, בשנוואלד.", address: "Schönwald, 78141, Germany", postal: "78141", town: "שנוואלד", setting: "indoor", reservation: true, note: "תאריכים ופרטים בפורטל הכרטיס mein.hochschwarzwald.de.", family: true },
  { name: "Tannenmühle — סיור בטחנה + חיות מחמד", cat: "nature-bike", type: "free", benefit: "כניסה חינם לסיור בטחנה ולפינת החיות ללטיפה, פעם אחת.", desc: "טחנת קמח היסטורית בגרפנהאוזן, עם סיור וגם פינת חיות ללטיפה.", address: "Tannenmühleweg 5, 79865 Grafenhausen, Germany", postal: "79865", town: "גרפנהאוזן", setting: "mixed", reservation: false, phone: "+49 7748 215", site: "https://www.tannenmuehle.de/", family: true },
  { name: "סיורי E-MTB", cat: "nature-bike", type: "free", benefit: "השתתפות חינם בסיור E-MTB מודרך, פעם אחת.", desc: "סיור אופניים חשמליים מודרך באזור שלוכזה.", address: "Fischbacher Str. 16, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: true, phone: "+49 7656 9882916", note: "הרשמה מראש בפורטל הכרטיס בלבד.", family: true },
  { name: "Kids Bike Basics", cat: "nature-bike", type: "free", benefit: "השתתפות חינם בסדנת רכיבה לילדים, פעם אחת.", desc: "סדנת יסודות רכיבה על אופניים לילדים, בשלוכזה.", address: "Fischbacher Str. 16, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: true, phone: "+49 7656 9882916", note: "הרשמה מראש בפורטל הכרטיס בלבד.", family: true },
  { name: "Bikepark Todtnau — קורס טעימה", cat: "nature-bike", type: "free", benefit: "קורס טעימה חינם בפארק האופניים.", desc: "קורס טעימה בפארק האופניים ההררי של טודנאו.", address: "Brandenbergstr. 2, 79674 Todtnau, Germany", postal: "79674", town: "טודנאו", setting: "outdoor", reservation: true, phone: "+49 7671 959 9999", note: "הרשמה מראש בפורטל הכרטיס בלבד.", family: true },
  { name: "השכרת אופניים חשמליים — Tannenmühle (גרפנהאוזן)", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 12, לפי זמינות.", desc: "השכרת אופני חשמל ל-3 שעות בגרפנהאוזן.", address: "Tannenmühleweg 5, 79865 Grafenhausen, Germany", postal: "79865", town: "גרפנהאוזן", setting: "outdoor", reservation: false, phone: "+49 7748 215", family: true },
  { name: "השכרת אופניים חשמליים — פלדברג", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", desc: "השכרת אופני חשמל ל-3 שעות בפלדברג.", address: "Dr.-Pilet-Spur 1, 79868 Feldberg, Germany", postal: "79868", town: "פלדברג", setting: "outdoor", reservation: false, phone: "+49 7676 422", family: true },
  { name: "השכרת אופניים חשמליים — Sport Lehr טודנאו", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", desc: "השכרת אופני חשמל ל-3 שעות בטודנאו.", address: "Friedrichstraße 7, 79674 Todtnau, Germany", postal: "79674", town: "טודנאו", setting: "outdoor", reservation: false, phone: "+49 7671 317", family: true },
  { name: "השכרת אופניים חשמליים — Thoma Sports טיטיזה", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", desc: "השכרת אופני חשמל ל-3 שעות בטיטיזה-נוישטט.", address: "Seestraße 2, 79822 Titisee-Neustadt, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "outdoor", reservation: false, phone: "+49 7651 9724967", family: true },
  { name: "השכרת אופניים חשמליים — Spaßpark שלוכזה", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", desc: "השכרת אופני חשמל ל-3 שעות בשלוכזה.", address: "Fischbacher Straße 16, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: false, phone: "+49 7656 9882878", family: true },
  { name: "השכרת אופניים חשמליים — שנוואלד", cat: "nature-bike", type: "free", benefit: "השכרה ליום שלם, חינם, מגיל 16 — בהרשמה מראש בלבד.", desc: "השכרת אופני חשמל ליום שלם בשנוואלד.", address: "Franz-Schubert-Straße 3, 78141 Schönwald, Germany", postal: "78141", town: "שנוואלד", setting: "outdoor", reservation: true, phone: "+49 7652 12067400", family: true },
  { name: "השכרת סירת פדלים — Müllers Bootsvermietung שלוכזה", cat: "nature-bike", type: "free", benefit: "30 דקות חינם, עד 4 אנשים בסירה — תלוי מזג אוויר.", desc: "השכרת סירות פדלים על אגם שלוכזה, ליד הסכר.", address: "An der Staumauer 1, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: false, phone: "+49 170 3803299", note: "זה באגם שלוכזה, לא טיטיזה — אופציה נוספת אם רוצים גם השכרת סירת פדלים עצמאית.", family: true },

  // --- מוזיאונים וסיורים ---
  { name: "Blattert Mühle — סדנת פרצלה קטנה", cat: "museums-tours", type: "free", benefit: "השתתפות חינם בהכנת פרצל, בהרשמה מראש חובה.", desc: "סדנה להכנת פרצל קטן בטחנת בונדורף ההיסטורית.", address: "Konstantin-Fehrenbach-Str. 34, 79848 Bonndorf, Germany", postal: "79848", town: "בונדורף", setting: "indoor", reservation: true, phone: "+49 7703 318", note: "הזמנה מראש חובה דרך mein.hochschwarzwald.de.", family: true },
  { name: "מוזיאון Le Petit Salon Winterhalter", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון קטן במנצנשוואנד, המציג אוסף פרטי.", address: "Hinterdorfstraße 15, 79837 Menzenschwand, Germany", postal: "79837", town: "מנצנשוואנד", setting: "indoor", reservation: false, phone: "+49 7675 9296988", family: true },
  { name: "Kloster Museum סנט מרגן", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון המנזר של סנט מרגן, על ההיסטוריה הדתית של האזור.", address: "Rathausplatz 1, 79274 St. Märgen, Germany", postal: "79274", town: "סנט מרגן", setting: "indoor", reservation: false, phone: "+49 7669 91180", family: true },
  { name: "Oldtimer Museum Lafette", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת — ה'-ב', 10:30-18:30.", desc: "אוסף מכוניות עתיקות (אולדטיימרים) בטיטיזה-נוישטט.", address: "Heiligbrunnenstr. 10, 79822 Titisee-Neustadt, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "indoor", reservation: false, phone: "+49 7652 360", family: true },
  { name: "Schwarzwälder Skimuseum הינטרצרטן", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון ההיסטוריה של ספורט הסקי ביער השחור, בהינטרצרטן.", address: "Erlenbrucker Straße 35, 79856 Hinterzarten, Germany", postal: "79856", town: "הינטרצרטן", setting: "indoor", reservation: false, phone: "+49 7652 982192", family: true },
  { name: "Deutsches Phonomuseum סנט גאורגן", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון גרמני להיסטוריית הפונוגרף ומכשירי ההשמעה, בסנט גאורגן.", address: "Bärenplatz 1, 78112 St. Georgen, Germany", postal: "78112", town: "סנט גאורגן", setting: "indoor", reservation: false, phone: "+49 7724 87320", family: true },
  { name: "Kreismuseum סנט בלאזין", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון מחוזי על היסטוריית האזור, בסנט בלאזין.", address: "Am Kurgarten 1-3, 79837 St. Blasien, Germany", postal: "79837", town: "סנט בלאזין", setting: "indoor", reservation: false, phone: "+49 7672 41437", family: true },
  { name: "Volkskundemuseum Hüsli", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון פולקלור בבית איכרים היסטורי בגרפנהאוזן.", address: "Am Hüsli 1, 79865 Grafenhausen, Germany", postal: "79865", town: "גרפנהאוזן", setting: "indoor", reservation: false, phone: "+49 7748 212", family: true },
  { name: "Haus der Natur — פלדברג", cat: "museums-tours", type: "free", benefit: "כניסה חינם לתערוכה, פעם אחת.", desc: "מרכז מבקרים ותערוכת טבע על שמורת הטבע של הפלדברג.", address: "Dr.-Pilet-Spur 4, 79868 Feldberg, Germany", postal: "79868", town: "פלדברג", setting: "indoor", reservation: false, phone: "+49 7676 933630", family: true },
  { name: "Schwarzwaldhaus der Sinne — מוזיאון חוויתי", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון חוויתי לחושים בגרפנהאוזן, מתאים לילדים.", address: "Schulstr. 1, 79865 Grafenhausen, Germany", postal: "79865", town: "גרפנהאוזן", setting: "indoor", reservation: false, phone: "+49 7748 52048", family: true },
  { name: "סיור בקתדרלת סנט בלאזין", cat: "museums-tours", type: "free", benefit: "סיור מודרך חינם, פעם אחת — הרשמה במשרד התיירות המקומי.", desc: "סיור מודרך בקתדרלה הבארוקית המרשימה של סנט בלאזין.", address: "Fürstabt-Gerber-Str. 16, 79837 St. Blasien, Germany", postal: "79837", town: "סנט בלאזין", setting: "indoor", reservation: true, phone: "+49 7672 41437", family: true },
  { name: "Freilichtmuseum Klausenhof הרישריד", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", desc: "מוזיאון פתוח (חוץ) עם חוות ובתים היסטוריים, בהרישריד.", address: "Lindenweg 3, 79737 Herrischried, Germany", postal: "79737", town: "הרישריד", setting: "outdoor", reservation: false, family: true },
  { name: "מוזיאון טבע Kalchreuter — Glashütte", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת — רק בשבת הראשונה בחודש, 14:00-16:00.", desc: "אוסף מינרלים פרטי קטן בגלאסהיטה שליד בונדורף.", address: "Glashütte 4, 79848 Bonndorf, Germany", postal: "79848", town: "בונדורף", setting: "indoor", reservation: false, phone: "+49 7653 6660", note: "שעות פתיחה מצומצמות — לוודא תאריך לפני שיוצאים.", family: true },
  { name: "תערוכת זכוכית ב-Kurhaus שלוכזה", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת — יש להירשם במשרד התיירות המקומי.", desc: "תערוכת זכוכית אמנותית בבית הקורהאוס של שלוכזה.", address: "Fischbacher Str. 7, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "indoor", reservation: true, phone: "+49 7562 1206 0", family: true },
  { name: "סיורי תיאטרון רחוב — Freiburg Living History", cat: "museums-tours", type: "free", benefit: "השתתפות חינם בסיור שחקנים בפרייבורג — ו' 18:00 (\"מכשפת פרייבורג\"), ש' 18:00 (\"הנוודת\").", desc: "סיור שחקנים תיאטרלי ברחובות פרייבורג העתיקה, בערבי שישי ושבת.", address: "Hinter-den-Eichen 12/1, 79276 Reute, Germany", postal: "79276", town: "רויטה (פרייבורג)", setting: "outdoor", reservation: false, phone: "+49 176 432 114 19", note: "תוכן מיועד למבוגרים יותר (עלילות מימי הביניים) — לשקול לפי גיל הילדים.", family: false },

  // --- משחקי בריחה ו-VR ---
  { name: "Outdoor-Escape — Die doppelte Biergit (Brauerei Rothaus)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", desc: "משחק בריחה בחוץ (Outdoor-Escape) לקבוצה, עם רמזים בשטח סביב מבשלת רוטהאוס.", address: "Hauptstr. 38a, 79199 Kirchzarten, Germany", postal: "79199", town: "קירכצרטן", setting: "outdoor", reservation: true, phone: "+49 7661 98 93 790", note: "המיקום בפועל: Brauerei Rothaus. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Outdoor-Escape — Das verlorene Dorf (שלוכזה)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", desc: "משחק בריחה בחוץ (Outdoor-Escape) לקבוצה, עם רמזים בשטח סביב שלוכזה.", address: "Fischbacher Str. 7, 79859 Schluchsee, Germany", postal: "79859", town: "שלוכזה", setting: "outdoor", reservation: true, phone: "+49 7661 98 93 790", note: "נקודת יציאה: משרד התיירות שלוכזה. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Outdoor-Escape — Das Rätsel der Zeit (לנצקירך)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", desc: "משחק בריחה בחוץ (Outdoor-Escape) לקבוצה, עם רמזים בשטח סביב לנצקירך.", address: "Am Kurgarten 1, 79853 Lenzkirch, Germany", postal: "79853", town: "לנצקירך", setting: "outdoor", reservation: true, phone: "+49 7661 98 93 790", note: "נקודת יציאה: Abenteuer Golfpark לנצקירך. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Outdoor-Escape — Die vier Tode des falschen Mönchs (סנט מרגן)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", desc: "משחק בריחה בחוץ (Outdoor-Escape) לקבוצה, עם רמזים בשטח סביב סנט מרגן.", address: "79274 St. Märgen, Germany", postal: "79274", town: "סנט מרגן", setting: "outdoor", reservation: true, phone: "+49 7661 98 93 790", note: "נקודת יציאה: Hotel \"Der Hirschen\", סנט מרגן. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Explor Games — Tico & Itza (הרפתקת משפחות)", cat: "escape-vr", type: "free", benefit: "השאלת טאבלט חינם לעד 5 אנשים + משחק אחד, פעם אחת.", desc: "משחק הרפתקה דיגיטלי מודרך טאבלט, לכל המשפחה, יוצא מטיטיזה.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "outdoor", reservation: true, phone: "+49 7651 82560", note: "להזמין מראש, בין 10:00-16:00.", family: true },
  { name: "Explor Games — Lenofi und die Legende von Guta", cat: "escape-vr", type: "free", benefit: "השאלת טאבלט חינם לעד 5 אנשים + משחק אחד, פעם אחת.", desc: "משחק הרפתקה דיגיטלי מודרך טאבלט נוסף, יוצא מטיטיזה.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "outdoor", reservation: true, phone: "+49 7651 82560", note: "להזמין מראש, בין 10:00-16:00.", family: true },
  { name: "Lasertag Base — 15 דקות חינם", cat: "escape-vr", type: "free", benefit: "15 דקות לייזר-טאג חינם, פעם אחת — הזמנה מקוונת בלבד.", desc: "מתחם לייזר-טאג מקורה בטיטיזה.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", town: "טיטיזה-נוישטט", setting: "indoor", reservation: true, phone: "+49 7651 9331170", family: true },
  { name: "Operation Mindfall — חדר בריחה", cat: "escape-vr", type: "free", benefit: "השתתפות חינם, פעם אחת — הזמנה מקוונת בלבד.", desc: "חדר בריחה מקורה בהופגוט שטרנן שליד ברייטנאו.", address: "Höllsteig 76, 79874 Breitnau, Germany", postal: "79874", town: "ברייטנאו", setting: "indoor", reservation: true, phone: "+49 7652 9010", family: true },
  { name: "Magic Portal — חדר בריחה", cat: "escape-vr", type: "free", benefit: "השתתפות חינם, פעם אחת — הזמנה מקוונת בלבד.", desc: "חדר בריחה נוסף בהופגוט שטרנן, נושא קסם.", address: "Höllsteig 76, 79874 Breitnau, Germany", postal: "79874", town: "ברייטנאו", setting: "indoor", reservation: true, phone: "+49 7652 9010", family: true },
  { name: "Anni's Schwarzwaldgeheimnis — טיול-בריחה", cat: "escape-vr", type: "free", benefit: "טיול-בריחה בטבע, חינם — בתיאום מראש בלבד.", desc: "טיול-בריחה בטבע סביב שנוואלד, פתרון חידות תוך כדי הליכה.", address: "Franz-Schubert-Str. 3, 78141 Schönwald, Germany", postal: "78141", town: "שנוואלד", setting: "outdoor", reservation: true, phone: "+49 7652 12067400", family: true },
  { name: "VR Point Mr. Modicap — חוויית VR", cat: "escape-vr", type: "free", benefit: "25 דקות מציאות מדומה חינם — רק בתיאום טלפוני, ימי ו'/ש'.", desc: "חוויית מציאות מדומה (VR) בשונאך.", address: "Bürgermeister-Kuner-Str. 12, 78136 Schonach, Germany", postal: "78136", town: "שונאך", setting: "indoor", reservation: true, phone: "+49 7722 868 9968", note: "בזמן זה החדר-הצג הזמני נמצא ב-VR Arena Triberg.", family: true },
  { name: "VR-Experience קפיצת סקי — מוזיאון הסקי הינטרצרטן", cat: "escape-vr", type: "free", benefit: "שימוש חינם, פעם אחת.", desc: "סימולטור VR לקפיצות סקי, בתוך מוזיאון הסקי בהינטרצרטן.", address: "Erlenbrucker Straße 35, 79856 Hinterzarten, Germany", postal: "79856", town: "הינטרצרטן", setting: "indoor", reservation: false, phone: "+49 7652 982192", family: true },
  { name: "VR קפיצת סקי — מגדל הקפיצה בשונאך", cat: "escape-vr", type: "free", benefit: "השתתפות חינם — רק בתיאום מראש, ימי ו' 15:00.", desc: "חוויית VR נוספת לקפיצות סקי, במגדל הקפיצה של שונאך.", address: "Bürgermeister-Kuner-Str. 12, 78136 Schonach, Germany", postal: "78136", town: "שונאך", setting: "indoor", reservation: true, family: true },

  // --- אוכל ושתייה ---
  { name: "Heinz Wagner Sekt Manufaktur", cat: "culinary", type: "free", benefit: "סיור מודרך + טעימת שמפניה חינם, כולל שובר קנייה בשווי 5€.", desc: "יקב שמפניה משפחתי בסנט בלאזין, עם סיורים וטעימות.", address: "Albtalstr. 14, 79837 St. Blasien, Germany", postal: "79837", town: "סנט בלאזין", setting: "indoor", reservation: true, phone: "+49 7672 922 663 0", note: "יין תוסס — הרשמה טלפונית מראש חובה.", family: false },
  { name: "בירה עם אומני הבירה", cat: "culinary", type: "free", benefit: "השתתפות חינם בטעימת בירה, לפי זמינות והרשמה מראש.", desc: "מפגש טעימת בירה עם אומנים מקומיים, בפלדברג.", address: "Feldbergstr. 5, 79868 Feldberg, Germany", postal: "79868", town: "פלדברג", setting: "indoor", reservation: true, phone: "+49 151 44626615", note: "אלכוהול — הרשמה מראש חובה דרך mein.hochschwarzwald.de.", family: false },
  { name: "Gscheiter Beck — מוזיאון שנאפס", cat: "culinary", type: "free", benefit: "כניסה חינם למוזיאון + טעימת שנאפס, מגיל 18 בלבד.", desc: "מוזיאון שנאפס קטן בפלדברג, עם טעימה למבוגרים.", address: "Bahnhofstraße 3, 79868 Feldberg, Germany", postal: "79868", town: "פלדברג", setting: "indoor", reservation: false, phone: "+49 7655 341", note: "מגבלת גיל 18+ מפורשת.", family: false },
  { name: "Café Zimmermann — סדנת עוגת יער שחור", cat: "culinary", type: "free", benefit: "השתתפות חינם בהכנת עוגת דובדבנים שחורה, כולל פרוסה וקפה — כל שבועיים בימי ג'.", desc: "בית קפה בטודמוס, עם סדנת הכנת עוגת יער שחור מסורתית.", address: "Kurparkweg 2, 79682 Todtmoos, Germany", postal: "79682", town: "טודמוס", setting: "indoor", reservation: true, phone: "+49 7674 90570", note: "הרשמה חובה עד יום ב' 17:30.", family: true },
  { name: "Schwarzwaldimkerei und Brennerei Herb", cat: "culinary", type: "free", benefit: "סיור מזקקה + טעימה חינם, מגיל 18 בלבד — כל שבועיים בימי ו' 16:00.", desc: "מזקקה ודבוראות משפחתית בבונדורף.", address: "Tiroler Str. 8, 79848 Bonndorf, Germany", postal: "79848", town: "בונדורף", setting: "indoor", reservation: true, phone: "+49 7653 6660", note: "מגבלת גיל 18+ מפורשת. הרשמה מראש חובה.", family: false },
  { name: "טעימת תה — סנט מרגן", cat: "culinary", type: "free", benefit: "השתתפות חינם בטעימת תה, פעם אחת.", desc: "טעימת תה בסנט מרגן.", address: "Feldbergstraße 2, 79274 St. Märgen, Germany", postal: "79274", town: "סנט מרגן", setting: "indoor", reservation: true, phone: "+49 7669 939826", note: "הרשמה חובה יום לפני — ג'/ה' מ-15:00, ש' מ-10:00.", family: true },

  // --- גולף ---
  { name: "Freiburger Golfplatz", cat: "golf", type: "free", benefit: "גרין-פי חינם ל-18 חורים, פעם אחת.", desc: "מגרש גולף 18 חורים ליד קירכצרטן, קרוב לפרייבורג.", address: "Krüttweg 1, 79199 Kirchzarten, Germany", postal: "79199", town: "קירכצרטן", setting: "outdoor", reservation: false, phone: "+49 7661 98470", family: false },
  { name: "Golfclub Königsfeld", cat: "golf", type: "free", benefit: "גרין-פי חינם ל-18 חורים, פעם אחת.", desc: "מגרש גולף 18 חורים בקניגספלד.", address: "Angelmoos 20, 78126 Königsfeld, Germany", postal: "78126", town: "קניגספלד", setting: "outdoor", reservation: false, phone: "+49 7725 9396-0", family: false },
  { name: "Golfclub Obere Alp (שטילינגן)", cat: "golf", type: "free", benefit: "גרין-פי חינם, פעם אחת — אפשרויות ל-18 חורים, 9 חורים, או 18 חורים על מגרש 9 החורים.", desc: "מגרש גולף בשטילינגן, עם אפשרות ל-9 או 18 חורים.", address: "Am Golfplatz 1-3, 79780 Stühlingen, Germany", postal: "79780", town: "שטילינגן", setting: "outdoor", reservation: false, phone: "+49 7703 92030", family: false }
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

function chipsHTML(block) {
  const chips = [];
  if (block.price) chips.push(`<span class="chip">${escapeHTML(block.price)}</span>`);
  if (block.hours) chips.push(`<span class="chip">${ICON.clock} ${escapeHTML(block.hours)}</span>`);
  if (block.address) chips.push(`<a class="chip map" href="${mapLink(block.address)}" target="_blank" rel="noopener">${ICON.pin} מפה</a>`);
  if (block.address) chips.push(`<a class="chip waze" href="${wazeLink(block.address)}" target="_blank" rel="noopener">${ICON.waze} Waze</a>`);
  if (block.infoUrl) chips.push(`<a class="chip info" href="${escapeHTML(block.infoUrl)}" target="_blank" rel="noopener">${ICON.link} מידע נוסף</a>`);
  if (!chips.length) return "";
  return `<div class="chips">${chips.join("")}</div>`;
}

/* ============================================================
   נגן הפודקאסטים לילדים
   שם המקום עצמו הוא הקישור — לחיצה עליו פותחת נגן מתחתיו.
   יש אלמנט <audio> אחד לכל האפליקציה, שנודד לפאנל הפתוח. זה מה שמאפשר
   ל-renderNow() לרוץ כל דקה בלי לקטוע פרק באמצע: הוצאת האלמנט מה-DOM
   לא עוצרת השמעה, כל עוד מחזיקים בהפניה אליו.
   ============================================================ */

const POD = { key: null, id: null, audio: null };
const POD_POS_KEY = "bf2026-pod-pos";   // איפה עצרנו בכל פרק
const POD_RATE_KEY = "bf2026-pod-rate"; // מהירות ההשמעה — אחת לכל הפרקים
const POD_RATES = [1, 1.25, 1.5, 1.75];

// פרק שהקובץ שלו עוד לא נמצא ב-audio/ לא קיים מבחינת הממשק — ראו ready למעלה.
function podReady(area) {
  const pod = PODCASTS[area];
  return pod && pod.ready ? pod : null;
}

/* הפרק נתלה רק על התחנה הראשונה של האזור באותו יום. יום טודנאו, למשל, הוא
   שלוש תחנות שחולקות פרק אחד — הקישור מופיע על מגלשת Hasenhorn בלבד, ולא
   שוב על המפלים ועל הגשר התלוי. הסימון נעשה פעם אחת בטעינה, לפי סדר
   הבלוקים ביום, כך שאגם טיטיזי שמופיע בשני ימים מקבל קישור בכל אחד מהם. */
(function markPodcastLeads() {
  for (const day of DAYS) {
    const seen = new Set();
    for (const b of day.blocks) {
      if (!b.area || !podReady(b.area) || seen.has(b.area)) continue;
      seen.add(b.area);
      b.podLead = true;
      // מפתח ייחודי למופע הזה של הפרק. אגם טיטיזי מופיע פעמיים (20.8 ו-23.8),
      // ובלשונית "מסלול" כל הימים מרונדרים יחד — בלי התאריך במפתח, לחיצה על
      // הכרטיס של 23.8 פתחה את הנגן בתוך הכרטיס של 20.8, כי החיפוש מחזיר את
      // ההתאמה הראשונה, והכרטיס שנלחץ נשאר ריק ומוסתר.
      b.podKey = `${day.date}:${b.area}`;
    }
  }
})();

// המפתח הוא "תאריך:אזור", והאזור הוא מה שמופיע בטבלת PODCASTS.
function podAreaOf(key) {
  return key ? key.slice(key.indexOf(":") + 1) : null;
}

function podcastFor(block) {
  return block && block.podLead ? podReady(block.area) : null;
}

// הכתובת שממנה מנגנים ושלפיה נשמר המטמון — כולל מספר הגרסה של הפרק.
function podUrl(pod) {
  return `${pod.file}?v=${pod.rev || 1}`;
}

function podLoadPos() {
  try { return JSON.parse(localStorage.getItem(POD_POS_KEY)) || {}; } catch { return {}; }
}

function podSavePos(id, seconds) {
  const all = podLoadPos();
  all[id] = Math.floor(seconds);
  try { localStorage.setItem(POD_POS_KEY, JSON.stringify(all)); } catch { /* התעלמות */ }
}

function podLoadRate() {
  const r = parseFloat(localStorage.getItem(POD_RATE_KEY));
  return POD_RATES.includes(r) ? r : 1;
}

function podSaveRate(rate) {
  try { localStorage.setItem(POD_RATE_KEY, String(rate)); } catch { /* התעלמות */ }
}

/* חשוב ששני השדות ייקבעו יחד: לפי התקן, טעינת מקור חדש מאפסת את
   playbackRate לערך של defaultPlaybackRate. קביעת playbackRate לבדה הייתה
   חוזרת ל-1× בכל מעבר בין פרקים. */
function podApplyRate(rate) {
  const el = POD.audio;
  if (!el) return;
  el.defaultPlaybackRate = rate;
  el.playbackRate = rate;
}

/* כפתורי המהירות הם של האפליקציה ולא של הדפדפן, בכוונה. הפקדים המובנים של
   <audio> מקצצים כפתורים כשהנגן צר, ומהירות ההשמעה יושבת אצלם בתפריט
   שלוש הנקודות — זה שנעלם ראשון. ברשימת "המשך היום" הנגן צר ב-76 פיקסלים
   מכרטיס מלא (עמודת השעה), כך שאותו פרק קיבל תפריט מהירות בכרטיס הנוכחי
   ולא קיבל אותו ברשימה. בספארי של האייפון אין תפריט כזה בכלל. */
function podRatesHTML() {
  const cur = podLoadRate();
  const btns = POD_RATES.map(r => {
    const on = r === cur;
    return `<button type="button" class="pod-rate${on ? " on" : ""}" data-pod-rate="${r}"`
      + ` aria-pressed="${on}" aria-label="מהירות ${r}">${r}×</button>`;
  }).join("");
  return `<div class="pod-rates" role="group" aria-label="מהירות השמעה">`
    + `<span class="pod-rates-label">מהירות</span>${btns}</div>`;
}

// כותרת המקום כקישור לפרק. extraHTML נשאר בתוך הכותרת (למשל התחזית המוטבעת).
function podTitleHTML(block, extraHTML = "") {
  const pod = podcastFor(block);
  const title = escapeHTML(block.title);
  if (!pod) return title + extraHTML;
  const label = escapeHTML(`האזנה לפרק הפודקאסט על ${pod.title}, ${pod.minutes} דקות`);
  return `<button type="button" class="pod-title" data-pod="${block.podKey}" aria-expanded="false" aria-label="${label}">`
    + `<span class="pod-title-text">${title}</span>`
    + `<span class="pod-cue">${ICON.headphones}${pod.minutes} דק׳</span>`
    + `</button>${extraHTML}`;
}

function podPanelHTML(block) {
  if (!podcastFor(block)) return "";
  return `<div class="pod-panel" data-pod-panel="${block.podKey}" hidden></div>`;
}

function podEnsureAudio() {
  if (POD.audio) return POD.audio;
  const el = document.createElement("audio");
  el.className = "pod-audio";
  el.controls = true;
  el.preload = "metadata";
  el.addEventListener("timeupdate", () => {
    if (POD.id && el.currentTime > 0) podSavePos(POD.id, el.currentTime);
  });
  el.addEventListener("ended", () => { if (POD.id) podSavePos(POD.id, 0); });
  el.addEventListener("error", podShowMissing);
  // רשת ביטחון: יש דפדפנים שמאפסים את המהירות בטעינת מקור חדש גם כש-
  // defaultPlaybackRate נקבע מראש.
  el.addEventListener("loadedmetadata", () => podApplyRate(podLoadRate()));
  POD.audio = el;
  podApplyRate(podLoadRate());
  return el;
}

function podSetMediaSession(pod) {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: pod.title,
      artist: "פודקאסט לילדים",
      album: "היער השחור 2026",
      artwork: [{ src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }]
    });
  } catch { /* התעלמות — אין תמיכה */ }
}

// מעביר את הנגן לפאנל הפתוח ומסנכרן את כל הכותרות. נקרא אחרי כל רינדור.
function podMount() {
  const audio = POD.key ? podEnsureAudio() : POD.audio;
  if (audio && audio.parentNode) audio.parentNode.removeChild(audio);
  $$(".pod-panel").forEach(p => { p.innerHTML = ""; p.hidden = true; });
  $$(".pod-title").forEach(b => b.setAttribute("aria-expanded", String(!!POD.key && b.dataset.pod === POD.key)));
  if (!POD.key) return;

  const pod = PODCASTS[POD.id];
  // אותו בלוק מרונדר גם ב"עכשיו" וגם ב"מסלול" — מעדיפים את התצוגה הפעילה.
  const target = $(`.view.active .pod-panel[data-pod-panel="${POD.key}"]`)
    || $(`.pod-panel[data-pod-panel="${POD.key}"]`);
  if (!target) return;

  target.innerHTML = `<div class="pod-head">${ICON.headphones}<strong>${escapeHTML(pod.title)}</strong>`
    + `<span class="pod-note">פרק לילדים · ${pod.minutes} דק׳</span></div>`;
  target.appendChild(audio);
  target.insertAdjacentHTML("beforeend", podRatesHTML());
  target.hidden = false;
}

function podShowMissing() {
  const target = $(`.pod-panel[data-pod-panel="${POD.key}"]:not([hidden])`);
  if (!target || target.querySelector(".pod-missing")) return;
  const note = document.createElement("div");
  note.className = "pod-missing";
  note.innerHTML = `${ICON.warn}<span>הפרק הזה עוד לא הועלה לאפליקציה — ההוראות ליצירה שלו ב-NotebookLM נמצאות בתיקייה podcast-scripts.</span>`;
  target.appendChild(note);
}

function podOpen(key) {
  const id = podAreaOf(key);
  const pod = podReady(id);
  if (!pod) return;
  const el = podEnsureAudio();
  // מעבר בין שני המופעים של אותו פרק (טיטיזי ב-20.8 וב-23.8) רק מזיז את
  // הנגן לכרטיס השני — אותו קובץ, אותו מיקום, בלי לטעון מחדש.
  if (POD.id !== id) {
    el.pause();
    POD.id = id;
    el.src = podUrl(pod);
    const pos = podLoadPos()[id] || 0;
    if (pos > 0) {
      el.addEventListener("loadedmetadata", function seek() {
        el.removeEventListener("loadedmetadata", seek);
        // לא ממשיכים מ-5 השניות האחרונות — עדיף להתחיל מחדש
        if (isFinite(el.duration) && pos < el.duration - 5) el.currentTime = pos;
      });
    }
    podSetMediaSession(pod);
  }
  POD.key = key;
  podApplyRate(podLoadRate());
  podMount();
  el.play().catch(() => { /* אם הדפדפן חסם — יש כפתור ניגון בנגן עצמו */ });
}

function podClose() {
  if (POD.audio) POD.audio.pause();
  POD.key = null;
  POD.id = null;
  podMount();
}

function podToggle(key) {
  if (POD.key === key) podClose(); else podOpen(key);
}

function tipsHTML(block) {
  if (!block.tips || !block.tips.length) return "";
  return block.tips.map(t => `<div class="tip ${t.warn ? "warn" : ""}">${t.warn ? ICON.warn : ICON.bulb}<span>${escapeHTML(t.text)}</span></div>`).join("");
}

function legHTML(drive) {
  if (!drive) return "";
  const dist = drive.dist ? ` · ${escapeHTML(drive.dist)}` : "";
  return `<div class="leg">${ICON.car}<span>${escapeHTML(drive.time)}${dist} ${escapeHTML(drive.from)}</span></div>`;
}

function imageHTML(image) {
  if (!image) return "";
  const credit = image.credit
    ? `<a class="stop-credit" href="${commonsFileUrl(image.commonsFile)}" target="_blank" rel="noopener">${ICON.camera} ${escapeHTML(image.credit)} · ${escapeHTML(image.license)}, ויקישיתוף</a>`
    : "";
  return `<img class="stop-img" src="${image.file}" alt="" loading="lazy" onerror="this.style.display='none'">${credit}`;
}

// בלוק "תחנה" מלא — עם תמונה, כתובת, זמן נסיעה, תחזית וכל השאר.
function stopCardHTML(day, block) {
  return `
    <div class="stop">
      ${imageHTML(block.image)}
      <div class="stop-body">
        ${timeLabel(block) ? `<div class="stop-time">${timeLabel(block)}</div>` : ""}
        <h3>${podTitleHTML(block)}</h3>
        ${podPanelHTML(block)}
        ${weatherHTML(day, block)}
        <p>${escapeHTML(block.desc)}</p>
        ${chipsHTML(block)}
        ${tipsHTML(block)}
      </div>
    </div>
  `;
}

// בלוק מידע נלווה (בלי כתובת/מפה/תמונה משלו).
function infoItemHTML(day, block) {
  return `
    <div class="timeline-item">
      <div class="time">${timeLabel(block)}</div>
      <div class="body">
        <h3>${escapeHTML(block.title)}</h3>
        <p>${escapeHTML(block.desc)}</p>
        ${chipsHTML(block)}
        ${tipsHTML(block)}
      </div>
    </div>
  `;
}

function dayStopsHTML(day) {
  let html = "";
  for (const b of day.blocks) {
    if (b.address) {
      html += legHTML(b.drive);
      html += stopCardHTML(day, b);
    } else {
      html += infoItemHTML(day, b);
    }
  }
  if (day.returnLeg) {
    html += legHTML(day.returnLeg);
    html += `<div class="leg-end">${ICON.hotel} ${escapeHTML(day.returnLeg.label)}</div>`;
  }
  return html;
}

function dayRouteLink(day) {
  const stops = day.blocks.filter(b => b.address).map(b => b.address);
  if (!stops.length) return null;
  const full = day.returnLeg
    ? [TRIP.hotel.address, ...stops, TRIP.hotel.address]
    : [TRIP.hotel.address, ...stops];
  const origin = full[0];
  const destination = full[full.length - 1];
  const waypoints = full.slice(1, -1);
  let url = "https://www.google.com/maps/dir/?api=1&travelmode=driving"
    + "&origin=" + encodeURIComponent(origin)
    + "&destination=" + encodeURIComponent(destination);
  if (waypoints.length) url += "&waypoints=" + waypoints.map(encodeURIComponent).join("|");
  return url;
}

function routeButtonHTML(day) {
  const link = dayRouteLink(day);
  if (!link) return "";
  return `<a class="route-btn" href="${link}" target="_blank" rel="noopener">${ICON.route} מסלול הנסיעה של היום ב-Maps</a>`;
}

/* ============================================================
   תצוגת המסלול המלא
   ============================================================ */

// אילו ימים פתוחים כרגע — נשמר כדי שרענון התחזית לא יסגור את מה שהמשתמש פתח.
// null = המשתמש עוד לא נגע, וברירת המחדל (היום פתוח) בתוקף.
let openDays = null;

function renderItinerary() {
  const todayStr = localDateStr(new Date());
  const html = DAYS.map((day, i) => {
    const isToday = day.date === todayStr;
    const isOpen = openDays ? openDays.has(day.date) : isToday;

    return `
      <details class="day" data-date="${day.date}" ${isOpen ? "open" : ""}>
        <summary>
          <span class="day-summary-left">
            <span class="day-date">${hebWeekday(day.date)}, ${dayMonth(day.date)}${isToday ? '<span class="day-today-dot"></span>' : ""}</span>
            <span class="day-title">${escapeHTML(day.title)}</span>
          </span>
          <span class="day-summary-right">
            ${dayWeatherHTML(day)}
            <span class="day-chevron">${ICON.chevron}</span>
          </span>
        </summary>
        <div class="day-body">
          <div class="day-meta">${escapeHTML(day.place)} · ${escapeHTML(day.driveNote)}</div>
          ${routeButtonHTML(day)}
          ${day.dayNote ? `<div class="tip">${ICON.bulb}<span>${escapeHTML(day.dayNote)}</span></div>` : ""}
          ${dayStopsHTML(day)}
        </div>
      </details>
    `;
  }).join("");

  $("#view-itinerary").innerHTML = `<h2 class="mini-list-title" style="margin-top:0">המסלול המלא</h2>${html}`;

  // שמירת מצב פתוח/סגור, כדי לשחזר אותו אחרי רינדור מחדש (למשל כשהתחזית מתעדכנת).
  $$("details.day").forEach(el => {
    el.addEventListener("toggle", () => {
      openDays = new Set($$("details.day").filter(d => d.open).map(d => d.dataset.date));
    });
  });

  podMount();
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
        <span style="color:var(--text-muted);font-size:14px">${escapeHTML(TRIP.hotel.address)}</span>
        <div class="chips">
          <a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.pin} מפה</a>
          <a class="chip waze" href="${wazeLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.waze} Waze</a>
        </div>
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
        <div class="num">${ICON.tree}</div>
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
  const heroWx = dayWeatherHTML(day);
  const heroRain = dayRainWindowLabel(day);
  let heroHTML = `
    <div class="hero">
      <p class="hero-eyebrow">יום ${dayNum} מתוך ${DAYS.length} · ${hebWeekday(day.date)}, ${dayMonth(day.date)}</p>
      <h1 class="hero-title">${escapeHTML(day.title)}</h1>
      <p class="hero-sub">${escapeHTML(day.place)} · ${escapeHTML(day.driveNote)}</p>
      ${heroWx ? `<p class="hero-wx">${heroWx}</p>` : ""}
      ${heroRain ? `<div class="wx-day-rain">${ICON.drop} גשם צפוי בשעות הפעילות בין ${heroRain}</div>` : ""}
    </div>
    ${routeButtonHTML(day)}
  `;

  let currentHTML = "";
  if (currentIdx !== -1 && currentIdx < timed.length) {
    const { b, s } = timed[currentIdx];
    const isNow = s != null && nowMinutes >= s;
    currentHTML = `
      <div class="now-current">
        <div class="kicker"><span class="pulse"></span>${isNow ? "עכשיו" : "בקרוב"}${timeLabel(b) ? " · " + timeLabel(b) : ""}</div>
        ${imageHTML(b.image)}
        <h2>${podTitleHTML(b)}</h2>
        ${podPanelHTML(b)}
        ${weatherHTML(day, b)}
        ${!isNow ? legHTML(b.drive) : ""}
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
      const bw = isPast ? null : blockWeather(day, b);
      const bwHTML = bw
        ? `<span class="wx-inline ${popLevel(bw.pop)}">${weatherEmoji(bw.code)} ${bw.tMin === bw.tMax ? `${bw.tMax}°` : `${bw.tMin}°–${bw.tMax}°`} · ${ICON.drop}${bw.pop}%</span>`
        : "";
      return `
        <div class="timeline-item ${isPast ? "done" : ""}">
          <div class="time">${timeLabel(b)}</div>
          <div class="body">
            ${b.drive && !isPast ? `<div class="leg-hint">${ICON.car} ${escapeHTML(b.drive.time)} ${escapeHTML(b.drive.from)}</div>` : ""}
            <h3>${podTitleHTML(b, bwHTML ? ` ${bwHTML}` : "")}</h3>
            ${podPanelHTML(b)}
            <p>${escapeHTML(b.desc)}</p>
          </div>
        </div>
      `;
    }).join("");

  const returnHTML = (currentIdx === -1 && day.returnLeg)
    ? `${legHTML(day.returnLeg)}<div class="leg-end">${ICON.hotel} ${escapeHTML(day.returnLeg.label)}</div>`
    : "";

  view.innerHTML = `
    ${heroHTML}
    ${currentHTML}
    ${restHTML ? `<h2 class="mini-list-title">המשך היום</h2><div class="card">${restHTML}</div>` : ""}
    ${returnHTML}
    <div class="chips" style="margin-top:16px">
      <a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.pin} ${escapeHTML(TRIP.hotel.name)}</a>
      <a class="chip waze" href="${wazeLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.waze} Waze</a>
    </div>
  `;

  podMount();               // מחזיר את הנגן לפאנל שהיה פתוח, בלי לקטוע השמעה
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
        <div class="chips">
          <a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.pin} פתיחה במפות</a>
          <a class="chip waze" href="${wazeLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.waze} Waze</a>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h2>טיסות</h2>
      <div class="card">
        <div class="info-row"><span class="k">נחיתה — ${hebWeekday(TRIP.flightIn.date)}, ${dayMonth(TRIP.flightIn.date)}</span><span class="v">${TRIP.flightIn.city}, ${TRIP.flightIn.time}</span></div>
        <div class="info-row"><span class="k">טיסת חזרה — ${hebWeekday(TRIP.flightOut.date)}, ${dayMonth(TRIP.flightOut.date)}</span><span class="v">${TRIP.flightOut.city}, ${TRIP.flightOut.time}</span></div>
        <div class="tip">${ICON.bulb}<span>${escapeHTML(TRIP.flightOut.note)}</span></div>
      </div>
    </div>

    <div class="info-section">
      <h2>לפני שנוסעים</h2>
      ${renderChecklistHTML()}
    </div>

    <div class="info-section">
      <h2>על התחזית</h2>
      <div class="card">
        <div class="info-row"><span class="k">מקור</span><span class="v"><a class="plain" href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></span></div>
        <div class="info-row"><span class="k">רזולוציה</span><span class="v">שעתית, לפי מיקום כל תחנה</span></div>
        <div class="info-row"><span class="k">אופק</span><span class="v">כ-${WX.horizonDays} ימים קדימה</span></div>
        <div class="tip">${ICON.bulb}<span>לכל פעילות מוצגת התחזית לשעות שלה בלבד, לפי הקואורדינטות של אותה תחנה — לכן פלדברג (1,200 מ׳) ורוסט (160 מ׳) מקבלים מספרים שונים לגמרי באותו יום.</span></div>
        <div class="tip">${ICON.bulb}<span>התחזית נמשכת מחדש בפתיחת האפליקציה, בחזרה אליה, בחזרה לרשת, ואוטומטית כשהיא בת יותר מחצי שעה. אפשר גם ללחוץ "רענון". התחזית האחרונה נשמרת במכשיר ומוצגת גם בלי קליטה.</span></div>
        <div class="tip">${ICON.bulb}<span>תחזית ליום 7–8 קדימה היא כיוון כללי, לא הבטחה — ככל שמתקרבים היא מתייצבת. שווה להסתכל שוב בכל בוקר.</span></div>
      </div>
    </div>

    <div class="info-section">
      <h2>כדאי לדעת</h2>
      <div class="card">
        ${GENERAL_TIPS.map(t => `<div class="tip">${ICON.bulb}<span>${escapeHTML(t)}</span></div>`).join("")}
      </div>
    </div>
  `;
  bindChecklist();
}

/* ============================================================
   תחזית מזג אוויר — לפי השעות והמיקום של כל פעילות
   מקור: Open-Meteo (חינמי, בלי מפתח API). קריאה אחת מביאה תחזית שעתית
   לכל תחנות הטיול ולכל ימי הטיול, ומכאן כל פעילות שולפת רק את השעות שלה
   ורק את הנקודה שלה — לכן פלדברג (1,230 מ׳) ורוסט (160 מ׳) מקבלים מספרים
   שונים לגמרי באותו יום. התחזית נשמרת ב-localStorage כדי שתהיה זמינה גם
   בלי קליטה, ומתרעננת אוטומטית כשהיא מתיישנת (WX.maxAgeMs).
   ============================================================ */

const WX = {
  api: "https://api.open-meteo.com/v1/forecast",
  cacheKey: "bf2026-weather-v1",
  maxAgeMs: 30 * 60 * 1000,   // אחרי חצי שעה התחזית נחשבת מיושנת ונמשכת מחדש
  horizonDays: 15,            // Open-Meteo נותן תחזית עד ~16 יום קדימה
  store: null,                // { fetchedAt, range, byPoint }
  status: "idle",             // idle | loading | ok | error | out-of-range
  listeners: []
};

const WEATHER_EMOJI = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  56: "🌧️", 57: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  66: "🌧️", 67: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "🌨️", 77: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "🌨️",
  95: "⛈️", 96: "⛈️", 99: "⛈️"
};
const WEATHER_LABEL_HE = {
  0: "בהיר", 1: "בהיר בעיקר", 2: "מעונן חלקית", 3: "מעונן",
  45: "ערפילי", 48: "ערפילי (כפור)",
  51: "טפטוף קל", 53: "טפטוף", 55: "טפטוף חזק",
  56: "טפטוף קופא", 57: "טפטוף קופא חזק",
  61: "גשם קל", 63: "גשם", 65: "גשם חזק",
  66: "גשם קופא", 67: "גשם קופא חזק",
  71: "שלג קל", 73: "שלג", 75: "שלג כבד", 77: "גרגירי שלג",
  80: "ממטרים קלים", 81: "ממטרים", 82: "ממטרים חזקים",
  85: "ממטרי שלג", 86: "ממטרי שלג כבדים",
  95: "סופת רעמים", 96: "סופת רעמים עם ברד", 99: "סופת רעמים עם ברד כבד"
};

// דירוג חומרה — כשפעילות פרושה על כמה שעות, מציגים את המצב הגרוע ביותר
// שבהן ולא את הראשון. הסדר לא זהה לסדר המספרי של הקודים (ערפל למשל
// פחות חמור מטפטוף, למרות שהקוד שלו גבוה יותר).
const WEATHER_RANK = {
  0: 0, 1: 1, 2: 2, 3: 3,
  45: 4, 48: 4,
  51: 5, 53: 6, 55: 7, 56: 6, 57: 7,
  61: 8, 63: 9, 65: 10, 66: 9, 67: 10,
  71: 8, 73: 9, 75: 10, 77: 8,
  80: 8, 81: 9, 82: 11,
  85: 9, 86: 10,
  95: 12, 96: 13, 99: 13
};

function weatherEmoji(code) { return WEATHER_EMOJI[code] || "🌡️"; }
function weatherLabelHe(code) { return WEATHER_LABEL_HE[code] || ""; }
function weatherRank(code) { return WEATHER_RANK[code] != null ? WEATHER_RANK[code] : 0; }

function minutesAgoLabel(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "עודכן לפני רגע";
  if (mins === 1) return "עודכן לפני דקה";
  if (mins < 60) return `עודכן לפני ${mins} דקות`;
  const hours = Math.floor(mins / 60);
  return hours === 1 ? "עודכן לפני שעה" : `עודכן לפני ${hours} שעות`;
}

function wxPointKey(c) {
  return `${c.lat.toFixed(4)},${c.lng.toFixed(4)}`;
}

// כל הנקודות שצריך להן תחזית — תחנות הטיול (בלי כפילויות).
function wxPoints() {
  const map = new Map();
  for (const day of DAYS) {
    for (const b of day.blocks) {
      if (!b.coords) continue;
      const key = wxPointKey(b.coords);
      if (!map.has(key)) map.set(key, { key, ...b.coords });
    }
  }
  return Array.from(map.values());
}

// טווח התאריכים שאפשר לבקש עכשיו: החיתוך בין ימי הטיול לבין אופק התחזית.
function wxRange() {
  const now = new Date();
  const today = localDateStr(now);
  const horizon = localDateStr(new Date(now.getTime() + WX.horizonDays * 86400000));
  const start = today > TRIP.start ? today : TRIP.start;
  const end = TRIP.end < horizon ? TRIP.end : horizon;
  if (start > end) return null;   // הטיול נגמר, או שעדיין רחוק מדי לתחזית
  return { start, end };
}

function wxDaysUntilForecast() {
  const today = new Date(localDateStr(new Date()) + "T00:00:00");
  const first = new Date(TRIP.start + "T00:00:00");
  return Math.max(0, Math.ceil((first - today) / 86400000) - WX.horizonDays);
}

function wxLoadCache() {
  try {
    const parsed = JSON.parse(localStorage.getItem(WX.cacheKey) || "null");
    if (!parsed || !parsed.byPoint || !parsed.fetchedAt) return null;
    return parsed;
  } catch { return null; }
}

function wxSaveCache(store) {
  try { localStorage.setItem(WX.cacheKey, JSON.stringify(store)); } catch { /* מכסת אחסון — לא קריטי */ }
}

function wxIsStale() {
  if (!WX.store) return true;
  const range = wxRange();
  if (!range) return false;
  if (WX.store.range.start !== range.start || WX.store.range.end !== range.end) return true;
  return Date.now() - WX.store.fetchedAt > WX.maxAgeMs;
}

async function wxFetch({ force = false } = {}) {
  const range = wxRange();
  if (!range) { WX.status = "out-of-range"; wxNotify(); return; }
  if (WX.status === "loading") return;
  if (!force && !wxIsStale()) return;
  if (!navigator.onLine) {
    // אין רשת — נשארים עם מה שיש בקאש, בלי להציג שגיאה מיותרת.
    if (!WX.store) { WX.status = "error"; wxNotify(); }
    return;
  }

  const points = wxPoints();
  const params = new URLSearchParams({
    latitude: points.map(p => p.lat).join(","),
    longitude: points.map(p => p.lng).join(","),
    elevation: points.map(p => p.elev).join(","),
    hourly: "temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m",
    timezone: "Europe/Berlin",
    start_date: range.start,
    end_date: range.end
  });

  WX.status = "loading";
  wxNotify();

  try {
    const res = await fetch(`${WX.api}?${params}`, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    const results = Array.isArray(json) ? json : [json];
    if (results.length !== points.length) throw new Error("unexpected response shape");

    const byPoint = {};
    results.forEach((r, i) => { if (r && r.hourly) byPoint[points[i].key] = r.hourly; });

    WX.store = { fetchedAt: Date.now(), range, byPoint };
    WX.status = "ok";
    WX.error = null;
    wxSaveCache(WX.store);
  } catch (err) {
    // נכשל — אם יש תחזית ישנה בקאש ממשיכים להציג אותה.
    WX.status = WX.store ? "ok" : "error";
    WX.error = String(err);
  }
  wxNotify();
}

function wxNotify() {
  WX.listeners.forEach(fn => { try { fn(); } catch { /* התעלמות */ } });
}

/* התחזית של פעילות בודדת: קיצונים על השעות שהיא מתוכננת להן, בנקודה שלה.
   מחזיר null אם אין קואורדינטות, אין שעה, או שהתאריך עוד לא בתוך אופק התחזית. */
function blockWeather(day, block) {
  if (!block || !block.coords || !WX.store) return null;
  const series = WX.store.byPoint[wxPointKey(block.coords)];
  if (!series || !series.time) return null;

  const startMin = toMinutes(block.start);
  if (startMin == null) return null;
  let endMin = toMinutes(block.end);
  if (endMin == null || endMin <= startMin) endMin = startMin + 60;

  const firstHour = Math.floor(startMin / 60);
  const lastHour = Math.min(23, Math.ceil(endMin / 60) - 1);

  const idx = [];
  for (let h = firstHour; h <= lastHour; h++) {
    const i = series.time.indexOf(`${day.date}T${String(h).padStart(2, "0")}:00`);
    if (i !== -1) idx.push(i);
  }
  if (!idx.length) return null;

  const pick = (arr, i) => (arr && arr[i] != null ? arr[i] : null);
  let tMin = Infinity, tMax = -Infinity, feelsMax = -Infinity;
  let pop = 0, mm = 0, wind = 0, worst = null;

  for (const i of idx) {
    const t = pick(series.temperature_2m, i);
    if (t != null) { tMin = Math.min(tMin, t); tMax = Math.max(tMax, t); }
    const f = pick(series.apparent_temperature, i);
    if (f != null) feelsMax = Math.max(feelsMax, f);
    const p = pick(series.precipitation_probability, i);
    if (p != null) pop = Math.max(pop, p);
    const r = pick(series.precipitation, i);
    if (r != null) mm += r;
    const w = pick(series.wind_speed_10m, i);
    if (w != null) wind = Math.max(wind, w);
    const c = pick(series.weather_code, i);
    if (c != null && (worst == null || weatherRank(c) > weatherRank(worst))) worst = c;
  }
  if (tMin === Infinity) return null;

  return {
    tMin: Math.round(tMin),
    tMax: Math.round(tMax),
    feels: feelsMax === -Infinity ? null : Math.round(feelsMax),
    pop: Math.round(pop),
    mm: Math.round(mm * 10) / 10,
    wind: Math.round(wind),
    code: worst,
    firstHour,
    lastHour
  };
}

// סיכום יומי — איחוד של כל הפעילויות של אותו יום, כל אחת בשעות ובמיקום שלה.
function dayWeather(day) {
  const parts = day.blocks.map(b => blockWeather(day, b)).filter(Boolean);
  if (!parts.length) return null;
  return {
    tMin: Math.min(...parts.map(p => p.tMin)),
    tMax: Math.max(...parts.map(p => p.tMax)),
    pop: Math.max(...parts.map(p => p.pop)),
    mm: Math.round(parts.reduce((s, p) => s + p.mm, 0) * 10) / 10,
    code: parts.reduce((worst, p) => (worst == null || weatherRank(p.code) > weatherRank(worst) ? p.code : worst), null)
  };
}

/* חלונות הגשם של היום — אבל רק בשעות שאתם בחוץ, ולפי המיקום שאתם אמורים
   להיות בו באותה שעה. שעה שבה סיכוי הגשם עובר את הסף נחשבת "גשומה";
   רצפים סמוכים (עם פער של שעה אחת לכל היותר) מאוחדים לחלון אחד. */
const RAIN_HOUR_THRESHOLD = 20;

function dayRainWindows(day) {
  if (!WX.store) return [];
  const byHour = new Map();
  for (const b of day.blocks) {
    if (!b.coords) continue;
    const series = WX.store.byPoint[wxPointKey(b.coords)];
    const w = blockWeather(day, b);
    if (!series || !w) continue;
    for (let h = w.firstHour; h <= w.lastHour; h++) {
      const i = series.time.indexOf(`${day.date}T${String(h).padStart(2, "0")}:00`);
      if (i === -1) continue;
      const p = series.precipitation_probability ? series.precipitation_probability[i] : null;
      if (p == null) continue;
      byHour.set(h, Math.max(byHour.get(h) != null ? byHour.get(h) : 0, p));
    }
  }
  if (!byHour.size) return [];

  const hours = Array.from(byHour.keys()).sort((a, b) => a - b);
  const wet = hours.filter(h => byHour.get(h) >= RAIN_HOUR_THRESHOLD);
  const windows = [];
  for (const h of wet) {
    const last = windows[windows.length - 1];
    if (last && h - last[1] <= 2) last[1] = h;
    else windows.push([h, h]);
  }
  return windows;
}

function dayRainWindowLabel(day) {
  const windows = dayRainWindows(day);
  if (!windows.length) return null;
  const fmt = h => String(h).padStart(2, "0") + ":00";
  return windows.map(([a, b]) => (a === b ? fmt(a) : `${fmt(a)}–${fmt(b + 1)}`)).join(" · ");
}

function popLevel(pop) {
  if (pop >= 60) return "high";
  if (pop >= 30) return "mid";
  return "low";
}

// שורת מזג האוויר שמוצגת בתוך כרטיס פעילות.
function weatherHTML(day, block) {
  const w = blockWeather(day, block);
  if (!w) {
    if (!block.coords || !block.start) return "";
    if (WX.status === "loading") return `<div class="wx wx-pending">טוען תחזית…</div>`;
    if (WX.status === "out-of-range") return `<div class="wx wx-pending">התחזית תיפתח בעוד ${wxDaysUntilForecast()} ימים</div>`;
    if (WX.status === "error") return `<div class="wx wx-pending">אין תחזית זמינה כרגע</div>`;
    return "";
  }

  const temp = w.tMin === w.tMax ? `${w.tMax}°` : `${w.tMin}°–${w.tMax}°`;
  const label = weatherLabelHe(w.code);

  const rainWarn = (!block.indoor && w.pop >= 50)
    ? `<div class="wx-warn">${ICON.warn}<span>סיכוי גבוה לגשם בשעות של הפעילות הזו — שווה מעיל/מטרייה, או להחליף עם פעילות מקורה ביום אחר.</span></div>`
    : "";

  return `
    <div class="wx">
      <span class="wx-icon">${weatherEmoji(w.code)}</span>
      <span class="wx-temp">${temp}</span>
      <span class="wx-pop ${popLevel(w.pop)}">${ICON.drop}${w.pop}% גשם</span>
      ${w.mm >= 0.5 ? `<span class="wx-mm">${w.mm} מ"מ</span>` : ""}
      ${label ? `<span class="wx-desc">${escapeHTML(label)}</span>` : ""}
      ${w.wind >= 25 ? `<span class="wx-wind">${w.wind} קמ"ש רוח</span>` : ""}
    </div>
    ${rainWarn}
  `;
}

function dayWeatherHTML(day) {
  const w = dayWeather(day);
  if (!w) return "";
  const temp = w.tMin === w.tMax ? `${w.tMax}°` : `${w.tMin}°–${w.tMax}°`;
  return `<span class="wx-inline ${popLevel(w.pop)}">${weatherEmoji(w.code)} ${temp} · ${ICON.drop}${w.pop}%</span>`;
}

function wxUpdatedLabel() {
  if (WX.status === "out-of-range") return `התחזית נפתחת בעוד ${wxDaysUntilForecast()} ימים`;
  if (!WX.store) return WX.status === "error" ? "לא הצלחנו להביא תחזית" : "אין עדיין תחזית";
  return minutesAgoLabel(WX.store.fetchedAt);
}

function wxBarHTML() {
  const loading = WX.status === "loading";
  return `
    <div class="weather-updated">
      <span>${loading ? "מרענן…" : escapeHTML(wxUpdatedLabel())}</span>
      <button class="weather-refresh-btn" id="weather-refresh" ${loading ? "disabled" : ""}>${ICON.refresh}${loading ? "מרענן…" : "רענון"}</button>
    </div>
  `;
}

function bindWxRefresh() {
  const btn = $("#weather-refresh");
  if (btn) btn.addEventListener("click", () => wxFetch({ force: true }));
}

/* ============================================================
   תצוגת מזג אוויר — כל ימי הטיול, פעילות אחרי פעילות
   ============================================================ */

function weatherDayCardHTML(day) {
  const todayStr = localDateStr(new Date());
  const isToday = day.date === todayStr;
  const dw = dayWeather(day);
  const rain = dayRainWindowLabel(day);

  const rows = day.blocks.map(b => {
    if (!b.coords || !b.start) return "";
    const w = blockWeather(day, b);
    const right = w
      ? `<span class="wx-act-temp">${w.tMin === w.tMax ? `${w.tMax}°` : `${w.tMin}°–${w.tMax}°`}</span>
         <span class="wx-pop ${popLevel(w.pop)}">${ICON.drop}${w.pop}%</span>`
      : `<span class="wx-act-none">—</span>`;
    return `
      <div class="wx-act">
        <span class="wx-act-icon">${w ? weatherEmoji(w.code) : "🌡️"}</span>
        <span class="wx-act-body">
          <span class="wx-act-title">
            <strong><bdi>${escapeHTML(b.title)}</bdi></strong>
            ${b.wxPlace ? `<a class="wx-act-link" href="${googleWeatherLink(b.wxPlace)}" target="_blank" rel="noopener" title="${escapeHTML("תחזית Google עבור " + b.wxPlace)}">${ICON.link} Google</a>` : ""}
          </span>
          <span class="wx-act-meta">
            <span class="wx-act-when">${escapeHTML(timeLabel(b))}${w && weatherLabelHe(w.code) ? " · " + escapeHTML(weatherLabelHe(w.code)) : ""}</span>
            ${right}
          </span>
        </span>
      </div>
    `;
  }).join("");

  return `
    <div class="card wx-day-card ${isToday ? "today" : ""}">
      <div class="wx-day-head">
        <div class="wx-day-date">
          ${isToday ? "היום" : escapeHTML(hebWeekday(day.date).replace("יום ", ""))}
          <span>${dayMonth(day.date)} · ${escapeHTML(day.title)}</span>
        </div>
        ${dw ? `<div class="wx-day-sum">${weatherEmoji(dw.code)} <strong>${dw.tMin}°–${dw.tMax}°</strong> <span class="wx-pop ${popLevel(dw.pop)}">${ICON.drop}${dw.pop}%</span></div>` : ""}
      </div>
      ${rows || `<div class="empty-note" style="padding:8px 0">אין פעילות עם מיקום ושעה ביום הזה.</div>`}
      ${rain ? `<div class="wx-day-rain">${ICON.drop} גשם צפוי בשעות הפעילות בין ${rain}</div>` : ""}
    </div>
  `;
}

function renderWeather() {
  const body = (WX.status === "out-of-range" && !WX.store)
    ? `<div class="empty-note">התחזית מכסה כ-${WX.horizonDays} ימים קדימה — היא תיפתח בעוד ${wxDaysUntilForecast()} ימים ותתמלא כאן.</div>`
    : (!WX.store && WX.status === "error")
      ? `<div class="empty-note">לא הצלחנו לטעון תחזית — בדקו חיבור לאינטרנט ונסו "רענון".</div>`
      : (!WX.store)
        ? `<div class="empty-note">טוען תחזית…</div>`
        : DAYS.map(weatherDayCardHTML).join("");

  $("#view-weather").innerHTML = `
    <h2 class="mini-list-title" style="margin-top:0">מזג אוויר — לפי שעות הפעילות</h2>
    ${wxBarHTML()}
    ${body}
    <div class="chips" style="margin-top:14px">
      <a class="chip info" href="https://open-meteo.com/" target="_blank" rel="noopener">${ICON.link} נתונים מ-Open-Meteo</a>
    </div>
  `;
  bindWxRefresh();
}

/* ============================================================
   תצוגת כרטיס האדום
   ============================================================ */

let redCardSortMode = localStorage.getItem("bf2026-redcard-sort") || "hotel";
let redCardFilterMode = localStorage.getItem("bf2026-redcard-filter") || "all";
let redCardCategory = localStorage.getItem("bf2026-redcard-category") || "all";
let redCardTown = localStorage.getItem("bf2026-redcard-town") || "all";
let redCardSetting = localStorage.getItem("bf2026-redcard-setting") || "all";
let redCardReservation = localStorage.getItem("bf2026-redcard-reservation") || "all";
let redCardSearchQuery = "";
let redCardSearchDebounce = null;
let redCardLiveCoords = null;
let redCardLiveError = null;

const REDCARD_CATEGORY_ORDER = ["leisure-sport", "pools-lakes", "nature-bike", "museums-tours", "escape-vr", "culinary", "golf"];

function redCardTownOptions() {
  return Array.from(new Set(RED_CARD_CATALOG.map(i => i.town))).sort((a, b) => a.localeCompare(b, "he"));
}

function redCardMatchesSearch(item, query) {
  if (!query) return true;
  const hay = `${item.name} ${item.desc} ${item.town} ${CATEGORY_LABELS[item.cat]}`.toLowerCase();
  return hay.includes(query.toLowerCase());
}

function benefitBadgeHTML(item) {
  return item.type === "free"
    ? `<span class="benefit-badge free">חינם</span>`
    : `<span class="benefit-badge discount">בהנחה</span>`;
}

function redCardPlannedItemHTML(item) {
  return `
    <div class="stop">
      <div class="stop-body">
        <div class="stop-time">${escapeHTML(item.dayTitle)} · ${dayMonth(item.dayDate)}</div>
        ${benefitBadgeHTML(item)}
        <h3>${escapeHTML(item.stopTitle)}</h3>
        <p>${escapeHTML(item.benefit)}</p>
        ${item.originalNote ? `<div class="tip">${ICON.bulb}<span>${escapeHTML(item.originalNote)}</span></div>` : ""}
        ${item.caveat ? `<div class="tip warn">${ICON.warn}<span>${escapeHTML(item.caveat)}</span></div>` : ""}
        <div class="chips">
          <a class="chip map" href="${mapLink(item.address)}" target="_blank" rel="noopener">${ICON.pin} מפה</a>
          <a class="chip waze" href="${wazeLink(item.address)}" target="_blank" rel="noopener">${ICON.waze} Waze</a>
          ${item.site ? `<a class="chip info" href="${escapeHTML(item.site)}" target="_blank" rel="noopener">${ICON.link} אתר</a>` : ""}
        </div>
      </div>
    </div>
  `;
}

function redCardCatalogItemHTML(item, dist) {
  const distLabel = redCardSortMode === "live" && redCardLiveCoords ? "מהמיקום שלי" : "מהמלון";
  return `
    <details class="redcard-item">
      <summary>
        <span class="redcard-item-summary-left">
          ${benefitBadgeHTML(item)}
          <span class="redcard-item-name">${escapeHTML(item.name)}</span>
        </span>
        <span class="redcard-item-summary-right">
          ${dist != null ? `<span class="redcard-item-dist">${ICON.route} ${formatDistance(dist)} ${distLabel}</span>` : ""}
          <span class="day-chevron">${ICON.chevron}</span>
        </span>
      </summary>
      <div class="redcard-item-body">
        <p>${escapeHTML(item.desc)}</p>
        <p class="redcard-item-benefit">${item.type === "free" ? "מה מקבלים עם הכרטיס" : "ההנחה עם הכרטיס"}: ${escapeHTML(item.benefit)}</p>
        ${item.note ? `<div class="tip">${ICON.bulb}<span>${escapeHTML(item.note)}</span></div>` : ""}
        <div class="chips">
          <a class="chip map" href="${mapLink(item.address)}" target="_blank" rel="noopener">${ICON.pin} מפה</a>
          <a class="chip waze" href="${wazeLink(item.address)}" target="_blank" rel="noopener">${ICON.waze} Waze</a>
          ${item.site ? `<a class="chip info" href="${escapeHTML(item.site)}" target="_blank" rel="noopener">${ICON.link} אתר</a>` : ""}
        </div>
      </div>
    </details>
  `;
}

function renderRedCardCatalog() {
  const container = $("#redcard-catalog-list");
  if (!container) return;

  let items = RED_CARD_CATALOG.slice();
  if (redCardFilterMode === "family") items = items.filter(i => i.family);
  if (redCardCategory !== "all") items = items.filter(i => i.cat === redCardCategory);
  if (redCardTown !== "all") items = items.filter(i => i.town === redCardTown);
  if (redCardSetting !== "all") items = items.filter(i => i.setting === redCardSetting || i.setting === "mixed");
  if (redCardReservation === "no-reservation") items = items.filter(i => !i.reservation);
  if (redCardSearchQuery) items = items.filter(i => redCardMatchesSearch(i, redCardSearchQuery));

  const refPoint = (redCardSortMode === "live" && redCardLiveCoords) ? redCardLiveCoords : HOTEL_COORDS;
  const withDist = items.map(item => {
    const coords = itemCoords(item);
    return { item, dist: coords ? haversineKm(refPoint, coords) : null };
  });
  withDist.sort((a, b) => (a.dist ?? Infinity) - (b.dist ?? Infinity));

  let html = "";
  if (redCardCategory === "all") {
    for (const cat of REDCARD_CATEGORY_ORDER) {
      const catItems = withDist.filter(x => x.item.cat === cat);
      if (!catItems.length) continue;
      html += `<h3 class="mini-list-title">${escapeHTML(CATEGORY_LABELS[cat])}</h3>`;
      html += catItems.map(x => redCardCatalogItemHTML(x.item, x.dist)).join("");
    }
  } else {
    html = withDist.map(x => redCardCatalogItemHTML(x.item, x.dist)).join("");
  }
  container.innerHTML = html || `<div class="empty-note">אין תוצאות עם הסינון הנוכחי — נסו לרוקן חלק מהמסננים.</div>`;
}

function renderRedCard() {
  const infoHTML = `
    <div class="card">
      <h3>${escapeHTML(RED_CARD_INFO.title)}</h3>
      <p>${escapeHTML(RED_CARD_INFO.eligibilityNote)}</p>
      ${RED_CARD_INFO.activationSteps.map(s => `<div class="tip">${ICON.bulb}<span>${escapeHTML(s)}</span></div>`).join("")}
      <div class="chips">
        ${RED_CARD_INFO.links.map(l => `<a class="chip info" href="${escapeHTML(l.url)}" target="_blank" rel="noopener">${ICON.link} ${escapeHTML(l.label)}</a>`).join("")}
      </div>
    </div>
  `;

  const plannedHTML = `
    <h2 class="mini-list-title" style="margin-top:0">כלול כבר בתוכנית שלכם</h2>
    ${RED_CARD_PLANNED.map(redCardPlannedItemHTML).join("")}
  `;

  const townOptions = redCardTownOptions();
  const controlsHTML = `
    <div class="redcard-controls">
      <input type="search" id="redcard-search" class="redcard-search" placeholder="חיפוש — שם, עיר או קטגוריה…" value="${escapeHTML(redCardSearchQuery)}">
      <div class="redcard-select-row">
        <select id="redcard-category-select" class="redcard-select">
          <option value="all" ${redCardCategory === "all" ? "selected" : ""}>כל הקטגוריות</option>
          ${REDCARD_CATEGORY_ORDER.map(cat => `<option value="${cat}" ${redCardCategory === cat ? "selected" : ""}>${escapeHTML(CATEGORY_LABELS[cat])}</option>`).join("")}
        </select>
        <select id="redcard-town-select" class="redcard-select">
          <option value="all" ${redCardTown === "all" ? "selected" : ""}>כל הערים</option>
          ${townOptions.map(t => `<option value="${escapeHTML(t)}" ${redCardTown === t ? "selected" : ""}>${escapeHTML(t)}</option>`).join("")}
        </select>
      </div>
      <div class="toggle-group" id="redcard-sort-group">
        <button class="toggle-btn ${redCardSortMode === "hotel" ? "active" : ""}" data-sort="hotel">מרחק מהמלון</button>
        <button class="toggle-btn ${redCardSortMode === "live" ? "active" : ""}" data-sort="live">${ICON.target}<span>המיקום שלי עכשיו</span></button>
      </div>
      <div class="toggle-group" id="redcard-filter-group">
        <button class="toggle-btn ${redCardFilterMode === "all" ? "active" : ""}" data-filter="all">הכל</button>
        <button class="toggle-btn ${redCardFilterMode === "family" ? "active" : ""}" data-filter="family">מתאים למשפחות</button>
      </div>
      <div class="redcard-group-label">סוג מקום</div>
      <div class="toggle-group" id="redcard-setting-group">
        <button class="toggle-btn ${redCardSetting === "all" ? "active" : ""}" data-setting="all">הכל</button>
        <button class="toggle-btn ${redCardSetting === "indoor" ? "active" : ""}" data-setting="indoor">מקורה</button>
        <button class="toggle-btn ${redCardSetting === "outdoor" ? "active" : ""}" data-setting="outdoor">בחוץ</button>
      </div>
      <div class="redcard-group-label">הזמנה מראש</div>
      <div class="toggle-group" id="redcard-reservation-group">
        <button class="toggle-btn ${redCardReservation === "all" ? "active" : ""}" data-reservation="all">הכל</button>
        <button class="toggle-btn ${redCardReservation === "no-reservation" ? "active" : ""}" data-reservation="no-reservation">בלי הזמנה מראש</button>
      </div>
      ${redCardLiveError ? `<div class="empty-note" style="padding:6px 0;font-size:12.5px">${escapeHTML(redCardLiveError)}</div>` : ""}
    </div>
  `;

  $("#view-redcard").innerHTML = `
    ${infoHTML}
    ${plannedHTML}
    <h2 class="mini-list-title">עוד הטבות בכרטיס (מרחק אווירי, לא זמן נסיעה)</h2>
    ${controlsHTML}
    <div id="redcard-catalog-list"></div>
  `;

  renderRedCardCatalog();
  bindRedCard();
}

function bindRedCard() {
  const searchInput = $("#redcard-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(redCardSearchDebounce);
      const val = searchInput.value;
      redCardSearchDebounce = setTimeout(() => {
        redCardSearchQuery = val;
        renderRedCardCatalog();
      }, 150);
    });
  }

  const categorySelect = $("#redcard-category-select");
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      redCardCategory = categorySelect.value;
      localStorage.setItem("bf2026-redcard-category", redCardCategory);
      renderRedCard();
    });
  }

  const townSelect = $("#redcard-town-select");
  if (townSelect) {
    townSelect.addEventListener("change", () => {
      redCardTown = townSelect.value;
      localStorage.setItem("bf2026-redcard-town", redCardTown);
      renderRedCard();
    });
  }

  $$("#redcard-sort-group .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.sort;
      if (mode !== "live") {
        redCardSortMode = "hotel";
        redCardLiveError = null;
        localStorage.setItem("bf2026-redcard-sort", "hotel");
        renderRedCard();
        return;
      }
      if (!("geolocation" in navigator)) {
        redCardLiveError = "הדפדפן לא תומך באיתור מיקום — ממשיכים למיין לפי מרחק מהמלון.";
        redCardSortMode = "hotel";
        renderRedCard();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          redCardLiveCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          redCardLiveError = null;
          redCardSortMode = "live";
          localStorage.setItem("bf2026-redcard-sort", "live");
          renderRedCard();
        },
        () => {
          redCardLiveError = "לא הצלחנו לקבל הרשאת מיקום — ממשיכים למיין לפי מרחק מהמלון.";
          redCardSortMode = "hotel";
          localStorage.setItem("bf2026-redcard-sort", "hotel");
          renderRedCard();
        },
        { timeout: 8000 }
      );
    });
  });

  $$("#redcard-filter-group .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      redCardFilterMode = btn.dataset.filter;
      localStorage.setItem("bf2026-redcard-filter", redCardFilterMode);
      renderRedCard();
    });
  });

  $$("#redcard-setting-group .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      redCardSetting = btn.dataset.setting;
      localStorage.setItem("bf2026-redcard-setting", redCardSetting);
      renderRedCard();
    });
  });

  $$("#redcard-reservation-group .toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      redCardReservation = btn.dataset.reservation;
      localStorage.setItem("bf2026-redcard-reservation", redCardReservation);
      renderRedCard();
    });
  });
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
  podMount();   // אם פרק מתנגן, הנגן עובר לתצוגה שנפתחה עכשיו
}

$$(".tab").forEach(tab => {
  tab.addEventListener("click", () => showView(tab.dataset.view));
});

// רינדור מחדש של כל התצוגות שמושפעות מהתחזית, בלי לאבד את הגלילה
// ואת הימים הפתוחים במסלול.
function rerenderWeatherViews() {
  const app = $("#app");
  const scroll = app ? app.scrollTop : 0;
  renderNow();         // תחזית של הפעילות הנוכחית ושל המשך היום
  renderItinerary();   // סיכום יומי בכותרת כל יום
  renderWeather();
  if (app) app.scrollTop = scroll;
}

function init() {
  $("#topbarIcon").innerHTML = ICON.tree;
  $$(".tab-icon").forEach(el => { el.innerHTML = ICON[el.dataset.icon]; });

  // תחזית שמורה מהפעם הקודמת — מוצגת מיד, גם בלי רשת.
  WX.store = wxLoadCache();
  if (WX.store) WX.status = "ok";

  renderNow();
  renderItinerary();
  renderRedCard();
  renderInfo();
  renderWeather();
  showView("now");

  // האזנה מואצלת: "עכשיו" מתרנדר כל דקה, ובלי אצילה היו נערמים מאזינים.
  $("#app").addEventListener("click", e => {
    const rate = e.target.closest("[data-pod-rate]");
    if (rate) {
      const r = parseFloat(rate.dataset.podRate);
      podSaveRate(r);
      podApplyRate(r);
      // עדכון הסימון במקום, ולא רינדור מחדש של הפאנל — כדי לא לגעת בנגן.
      $$(".pod-rate").forEach(b => {
        const on = parseFloat(b.dataset.podRate) === r;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      return;
    }
    const title = e.target.closest(".pod-title");
    if (title) podToggle(title.dataset.pod);
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // כל שינוי במצב התחזית (טעינה/הצלחה/כישלון) מרנדר מחדש.
  WX.listeners.push(rerenderWeatherViews);
  wxFetch();

  // רענון תצוגת "עכשיו" מדי דקה, כדי שהפעילות הנוכחית תישאר מדויקת
  // אם האפליקציה נשארת פתוחה. באותה הזדמנות בודקים אם התחזית התיישנה.
  setInterval(() => {
    renderNow();
    if (wxIsStale()) wxFetch();
  }, 60000);

  // חזרה לאפליקציה / חזרה לרשת — מושכים תחזית מעודכנת אם צריך.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && wxIsStale()) wxFetch();
  });
  window.addEventListener("online", () => wxFetch({ force: true }));
}

init();
