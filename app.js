/* ============================================================
   היער השחור 2026 — נתוני הטיול
   הכל מוטמע בקוד, אין קריאות רשת אחרי הטעינה הראשונה (חוץ מקישורי מפות/מידע חיצוניים).
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
  target: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`
};

function mapLink(address) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
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
        desc: "מתחם טרמפולינות, חבלים וטיפוס בפלדברג. שימו לב: השם הרשמי הוא Fundorena (לא Pandorena כפי שכתוב לפעמים). או פשוט להתארגן ולנוח במלון אחרי יום נסיעה.",
        address: "Fundorena, Dr.-Pilet-Spur 11, 79868 Feldberg, Germany",
        drive: { time: "כ-12 דקות", dist: "כ-8 ק\"מ", from: "מהמלון" },
        infoUrl: "https://fundorena.de/",
        tips: [{ text: "יום ראשון של הטיול — אין שום בעיה לא לעשות כלום חוץ מלהתארגן." }]
      }
    ],
    returnLeg: { time: "כ-12 דקות", dist: "כ-8 ק\"מ", from: "מ-Fundorena", label: "חזרה למלון" }
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
        address: "Wanderparkplatz Hofgut Sternen, Höllsteig 76, 79874 Breitnau, Germany",
        drive: { time: "כ-24 דקות", dist: "כ-17 ק\"מ", from: "מהמלון" },
        image: { file: "images/ravennaschlucht.jpg", credit: "Bermicourt", license: "CC BY-SA 4.0", commonsFile: "Ravenna_Bridge.JPG" },
        infoUrl: "https://goblackforest.co.il/שביל-רוואנהשלוכט/",
        tips: [{ text: "אורך גמיש — טוב ליום עם רגליים עייפות, פשוט חוזרים מוקדם." }]
      },
      {
        start: "12:00", end: "13:30", approx: true,
        title: "אגם טיטיזי",
        desc: "האגם התיירותי המפורסם ביותר ביער השחור — שיט בסירות פדלים/חשמליות, טיילת, גלידה.",
        address: "Seestraße, 79822 Titisee-Neustadt, Germany",
        drive: { time: "כ-11 דקות", dist: "כ-9 ק\"מ", from: "משביל רוואנהשלוכט" },
        image: { file: "images/titisee.jpg", credit: "Christian Maier", license: "CC BY-SA 3.0", commonsFile: "Titisee-blick_von_hochfirst.jpg" },
        infoUrl: "https://www.hochschwarzwald.de/en/attractions/promenade-seestrasse-at-lake-titisee-54ccf30e86",
        tips: [{ text: "יפה, אבל מלכודת תיירים — שעה־שעתיים מספיקות, לא יותר." }]
      },
      {
        start: "14:00", end: "18:00", approx: true,
        title: "Badeparadies Schwarzwald",
        desc: "פארק המים הטוב באזור. אזור Galaxy עם עשרות מגלשות, מתאים לילדים ולמתבגרים; יש גם ספא למבוגרים. 4 שעות מספיקות — פתוח עד 22:00.",
        address: "Am Badeparadies 1, 79822 Titisee-Neustadt, Germany",
        drive: { time: "כ-3 דקות", dist: "כ-1 ק\"מ", from: "מאגם טיטיזי" },
        image: { file: "images/badeparadies.jpg", credit: "qwesy qwesy", license: "CC BY 3.0", commonsFile: "Galaxy_Schwarzwald_(Badeparadies_Schwarzwald_in_Titisee)_-_panoramio.jpg" },
        price: "כ-22€ (4 שעות) / כ-30€ (יום) לנפש",
        hours: "9:00–22:00 בכל יום (כולל שלישי) בחופשת הקיץ",
        infoUrl: "https://www.badeparadies-schwarzwald.de/en/",
        tips: [
          { text: "חובה להזמין מראש באתר, כולל שיבוץ מקום/מיטת שיזוף — אי אפשר פשוט להגיע ולהיכנס בקופה.", warn: true }
        ]
      }
    ],
    returnLeg: { time: "כ-11 דקות", dist: "כ-11 ק\"מ", from: "מ-Badeparadies", label: "חזרה למלון" }
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
        address: "Europa-Park-Straße 2, 77977 Rust, Germany",
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
    title: "פרייבורג + טודנאו",
    place: "פרייבורג (בוקר) · טודנאו (אחה\"צ)",
    driveNote: "פרייבורג כ-53 דקות מהמלון · טודנאו כ-34 דקות מפרייבורג",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "פרייבורג — שוק הקתדרלה",
        desc: "שוק הקתדרלה (\"מינסטרמארקט\") בכיכר Münsterplatz — פועל כל בוקר חוץ מיום ראשון. צד צפוני: שוק איכרים (תוצרת מקומית, פירות יער, דבש, פרחים). צד דרומי: תבלינים, כלי עץ, מזכרות, אוכל רחוב. אחר כך טיול בכיכר המונסטר ותעלות המים (Bächle), וקניות ב-Kaiser-Joseph-Straße (\"Ka-Jo\") אם נשאר זמן.",
        address: "Münsterplatz 1, 79098 Freiburg im Breisgau, Germany",
        drive: { time: "כ-53 דקות", dist: "כ-38 ק\"מ", from: "מהמלון" },
        image: { file: "images/freiburg.jpg", credit: "Sven Puth", license: "CC BY-SA 4.0", commonsFile: "Freiburg_-_Münsterplatz.jpg" },
        infoUrl: "https://goblackforest.co.il/שוק-פרייבורג/",
        tips: [{ text: "פרייבורג בבוקר — השוק לא פועל אחה\"צ, וגם ככה סגור בימי ראשון." }]
      },
      {
        start: "13:00", end: "15:00", approx: true,
        title: "מפלי טודנאו",
        desc: "הכניסה התחתונה (מומלצת עם ילדים קטנים) בכביש L126 — \"מסלול אדום\" נוח ומתון, כ-10 דק׳ למפל הראשי, הלוך-חזור קלאסי. יש גם כניסה עליונה, ליד טודנאוברג, עם ירידה תלולה יותר — העלייה בחזרה עלולה להיות מאתגרת לרגליים קטנות. טיפ לשני רכבים: להשאיר רכב אחד למטה, לנסוע עם כולם למעלה וללכת את כל המסלול בירידה בלבד.",
        address: "Parkplatz Todtnauer Wasserfall, L126, 79674 Todtnau-Aftersteg, Germany",
        drive: { time: "כ-34 דקות", dist: "כ-28 ק\"מ", from: "מפרייבורג" },
        image: { file: "images/todtnau-falls.jpg", credit: "Freiburg1120", license: "CC BY-SA 3.0", commonsFile: "Todtnauer_Wasserfall.jpg" },
        infoUrl: "https://goblackforest.co.il/מפלי-טודנאו/"
      },
      {
        start: "15:00", end: "17:00", approx: true,
        title: "הגשר התלוי Blackforestline",
        desc: "כניסה נפרדת משלו (אבל בפועל ממש ליד המפלים — כדקה נסיעה) — נוף פנורמי וחוויית אדרנלין.",
        address: "Außer Ort 38, 79674 Todtnau, Germany",
        drive: { time: "כ-דקה", dist: "כ-80 מ׳ בלבד", from: "ממפלי טודנאו" },
        image: { file: "images/blackforestline.jpg", credit: "Daniel Reust", license: "CC BY-SA 4.0", commonsFile: "Hängebrücke_\"Blackforestline\"_Todtnau.jpg" },
        price: "כרטיס קומבו (גשר + מפל): כ-12€ מבוגר, כ-9€ ילד",
        hours: "8:00–20:30 בקיץ, כניסה אחרונה 19:00. קופה מאוישת/הנחות רק 10:00–16:00 — מעבר לזה רק מכונות, בלי הנחות.",
        infoUrl: "https://goblackforest.co.il/blackforestline/"
      }
    ],
    returnLeg: { time: "כ-28 דקות", dist: "כ-24 ק\"מ", from: "מהגשר התלוי", label: "חזרה למלון" }
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
        address: "Roland-Mack-Ring 1, 77977 Rust, Germany",
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
        desc: "מפלי טריברג — המפורסמים ביער השחור — פלוס שעוני קוקייה ענקיים ומרכז עיירה קלאסי.",
        address: "Hauptstraße 85, 78098 Triberg im Schwarzwald, Germany",
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
        desc: "מסלול מעגלי, בין שעה לשלוש שעות לפי קצב. הליכה על דשא, בוץ, אבנים וחול, מוצל ברובו, עם תחנות חוש (מישוש, ריח, ראייה). שווה גם עם ילדים גדולים יותר.",
        address: "Hauptstr. 103, 77793 Gutach im Schwarzwald, Germany",
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
        desc: "מגלשת קיץ נוספת, בד\"כ פחות עמוסה מזו שבטודנאו. כניסה חופשית, משלמים רק לפי נסיעה.",
        address: "Singersbach 1a, 77793 Gutach im Schwarzwald, Germany",
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
    title: "פארק הציפורים בשטיינן",
    place: "Vogelpark Steinen",
    driveNote: "יום קליל בכוונה, אחרי שישה ימים עמוסים",
    blocks: [
      {
        start: "10:00", end: "17:00", approx: true,
        title: "פארק הציפורים בשטיינן",
        desc: "פארק מעולה, לא גדול מדי — אחת ההפתעות החיוביות של היער השחור. מופע עופות דורסים ב-11:00 וב-15:00; קופים מסתובבים חופשי עם האכלה ב-12:00 וב-16:00 — יש גם סבב בוקר וגם סבב אחה\"צ, אז אפשר לתכנן לפי מה שנוח.",
        address: "Hofener Str. 60, 79585 Steinen, Germany",
        drive: { time: "כ-58 דקות", dist: "כ-49 ק\"מ", from: "מהמלון" },
        image: { file: "images/vogelpark.jpg", credit: "Taxiarchos228 / Wladyslaw Sojka", license: "Free Art License 1.3", commonsFile: "Steinen_-_Vogelpark1.jpg" },
        price: "מבוגר 20€, ילד (4–11) 10€",
        hours: "10:00–18:00 בחופשת הקיץ",
        infoUrl: "https://goblackforest.co.il/פארק-הציפורים-והקופים/"
      },
      {
        start: null, end: null, approx: true,
        title: "אם נשארה אנרגיה",
        desc: "אופציות: ויטה קלאסיקה (ספא), פארק שטיינווטסן (מתקנים וחיות), או Fundorena (טרמפולינות/חבלים/טיפוס, 15 דקות מהמלון)."
      }
    ],
    returnLeg: { time: "כ-57 דקות", dist: "כ-49 ק\"מ", from: "מפארק הציפורים", label: "חזרה למלון" }
  },
  {
    date: "2026-08-24",
    title: "מפלי הריין + טיסה הביתה",
    place: "שפהאוזן ← קילכברג ← נתב\"ג ציריך",
    driveNote: "כ-56 דקות מהמלון לשפהאוזן, ועוד כשעה לקילכברג, ועוד כ-31 דקות לנתב\"ג",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "מפלי הריין",
        desc: "המפל הגדול ביותר באירופה — מרשים מאוד. החובה: השיט שמגיע לסלע במרכז המפל. יש פארק חבלים בקרבת מקום, כנראה לא מתאים לקטנים.",
        address: "Rheinfall, 8212 Neuhausen am Rheinfall, Switzerland",
        drive: { time: "כ-56 דקות", dist: "כ-56 ק\"מ", from: "מהמלון" },
        image: { file: "images/rheinfall.jpg", credit: "CrazyD", license: "CC BY-SA 3.0", commonsFile: "Rheinfall_bei_Schaffhausen_02.JPG" },
        infoUrl: "https://rheinfall.ch/en/",
        tips: [{ text: "השיט לסלע יכול להיות עוצמתי/מפחיד לילד בן 5 — שווה לבדוק מולו לפני שעולים. החניה ליד המפל בתשלום, כמה פרנקים שוויצריים לשעה." }]
      },
      {
        start: "12:30", end: "16:00", approx: true,
        title: "Lindt Home of Chocolate",
        desc: "מזרקת השוקולד, החנות והקפה פתוחים לכולם, גם בלי כרטיס למוזיאון.",
        address: "Schokoladenplatz 1, 8802 Kilchberg, Switzerland",
        drive: { time: "כ-1 שעה", dist: "כ-58 ק\"מ", from: "ממפלי הריין" },
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
        drive: { time: "כ-31 דקות", dist: "כ-19 ק\"מ", from: "מ-Lindt Home of Chocolate" },
        image: { file: "images/zurich-airport.jpg", credit: "Designalltag", license: "CC BY-SA 4.0", commonsFile: "Flughafen_Zuerich.jpg" },
        infoUrl: "https://www.flughafen-zuerich.ch/en/passengers"
      }
    ]
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
    { label: "פורטל ההרשמה וההזמנות", url: "https://mein.hochschwarzwald.de" }
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
    dayDate: "2026-08-18", dayTitle: "טיטיזה", stopTitle: "שיט בסירה באגם טיטיזי",
    type: "free", benefit: "שיט סיבוב חינם עם אחת משתי חברות השיט באגם (Bootsbetrieb Schweizer או Drubba) — תלוי מזג אוויר, אפריל–אוקטובר.",
    originalNote: null,
    caveat: "זה סיבוב מאורגן בסירת שיט — לא זהה להשכרת סירת פדלים/חשמלית עצמאית שמופיעה בתוכנית המקורית. אם רוצים גם וגם, זו הטבה נוספת ולא תחליף.",
    address: "Seestraße 33, 79822 Titisee-Neustadt, Germany",
    site: "https://www.bootsbetrieb-schweizer-titisee.de/"
  },
  {
    dayDate: "2026-08-18", dayTitle: "טיטיזה", stopTitle: "Badeparadies Schwarzwald",
    type: "discount", benefit: "30% הנחה על כרטיס 4 שעות ל-Galaxy או Palmenoase.",
    originalNote: "מחיר מקורי לפי התוכנית: כ-22€ לאדם (4 שעות) ← אחרי הנחה כ-15.4€.",
    caveat: "בטקסט הרשמי מופיע \"ab 16 J.\" (מגיל 16) — לא ברור אם זה חל על Palmenoase (אזור ספא למבוגרים) בלבד או על ההנחה כולה. כדאי לוודא בקבלה או בפורטל הכרטיס לפני שמסתמכים על ההנחה לכל המשפחה. בנוסף: תוספת 6€ לאדם על כרטיס יום מלא, ובסופ״ש כרטיס משולב בלבד.",
    address: "Am Badeparadies 1, 79822 Titisee-Neustadt, Germany",
    site: "https://www.badeparadies-schwarzwald.de/en/"
  },
  {
    dayDate: "2026-08-20", dayTitle: "פרייבורג + טודנאו", stopTitle: "הגשר התלוי Blackforestline",
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
const RED_CARD_CATALOG = [
  // --- פנאי וספורט ---
  { name: "Funny-World פארק שעשועים", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Allmendstr. 1, 77966 Kappel-Grafenhausen, Germany", postal: "77966", phone: "+49 7822 445990", site: "https://www.funny-world.de/", family: true },
  { name: "Spielscheune Unterkirnach — אסם משחקים מקורה", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Schlossbergweg 4, 78089 Unterkirnach, Germany", postal: "78089", phone: "+49 7721 800855", site: "https://www.spielscheune-unterkirnach.de/", family: true },
  { name: "Blattert Mühle — Schnitzeljagd (ציד אוצרות בטחנה)", cat: "leisure-sport", type: "free", benefit: "השתתפות חינם, בלי הרשמה מראש — בשעות הפתיחה של הקורנhaus.", address: "Konstantin-Fehrenbach-Str. 34, 79848 Bonndorf, Germany", postal: "79848", phone: "+49 7703 318", site: "https://www.blattert-muehle.de/", family: true },
  { name: "Lasertag Base טיטיזה", cat: "leisure-sport", type: "free", benefit: "15 דקות חינם, פעם אחת — הזמנה מקוונת בלבד.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", phone: "+49 7651 9331170", family: true },
  { name: "Tatzmania — פארק חיות והרפתקאות", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Wildpark 3, 79843 Löffingen, Germany", postal: "79843", phone: "+49 7654 8068144", site: "https://www.tatzmania.com/", family: true },
  { name: "Brauereigasthof Rothaus", cat: "leisure-sport", type: "free", benefit: "כניסה חינם ל-\"Zäpfle Heimat\" כולל משקה 0.33 ליטר (בירה או חלופה אחרת).", address: "Rothaus 1, 79865 Grafenhausen, Germany", postal: "79865", phone: "+49 7748 522-0", site: "https://www.rothaus.de/", family: true },
  { name: "Spaßpark Hochschwarzwald", cat: "leisure-sport", type: "free", benefit: "כרטיס Card-Gaudi חינם ל-3 שעות בקיץ, כולל Loopy-Ball ופוטבול-גולף/ביליארד.", address: "Fischbacher Str. 16, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7656 9882916", site: "https://www.spasspark.de/", family: true },
  { name: "Abenteuer Golfpark Hochschwarzwald (מיני-גולף הרפתקאות)", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", address: "Am Kurgarten 1, 79853 Lenzkirch-Kappel, Germany", postal: "79853", phone: "+49 7641 6588", site: "https://www.abenteuergolfpark.de/", family: true },
  { name: "תיאטרון ב-Kurhaus טיטיזה", cat: "leisure-sport", type: "free", benefit: "כרטיס חינם למופע לבחירה — לפי מקום פנוי בקופת הערב, בלי הזמנה מראש.", address: "Strandbadstr. 4, 79822 Titisee-Neustadt, Germany", postal: "79822", phone: "+49 7652 1206 8125", family: true },
  { name: "Krone Theater Kino נוישטט", cat: "leisure-sport", type: "free", benefit: "כרטיס קולנוע חינם (פרקט), פעם אחת — לא כולל אירועים מיוחדים.", address: "Hirschenbuckel 2, 79822 Titisee-Neustadt, Germany", postal: "79822", phone: "+49 7651 1387", site: "https://www.krone-theater.de/", family: true },
  { name: "Kino im Höfle לנצקירך", cat: "leisure-sport", type: "free", benefit: "כרטיס קולנוע חינם, פעם אחת.", address: "Im Höfle 11, 79853 Lenzkirch, Germany", postal: "79853", phone: "+49 7653 962220", family: true },
  { name: "Feldbergbahn — הרכבל", cat: "leisure-sport", type: "free", benefit: "עלייה וירידה חינם ברכבל, כולל כניסה למגדל פלדברג.", address: "Dr.-Pilet-Spur, 79868 Feldberg, Germany", postal: "79868", site: "https://www.feldberg-erlebnis.de/", note: "לא בתוכנית הנוכחית — קל לשלב ביום קליל, כמו יום פארק הציפורים.", family: true },
  { name: "SUP בחוף Windgfällweiher", cat: "leisure-sport", type: "free", benefit: "60 דקות גלישת SUP חינם, פעם אחת — תלוי מזג אוויר.", address: "Raitenbucher Str. 37, 79853 Lenzkirch, Germany", postal: "79853", phone: "+49 176 98285016", site: "https://www.strandbad-windgfaellweiher.de/", family: true },
  { name: "Rothaus-Express — רכבת פנורמה", cat: "leisure-sport", type: "free", benefit: "סיור פנורמה חינם, פעם אחת — לפי מקום פנוי.", address: "Sonnhalde 14, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 152 03441239", site: "https://www.rothausexpress.de/", family: true },
  { name: "מיני-גולף St. Georgen", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", address: "Spittelbergstr. 19d, 78112 St. Georgen, Germany", postal: "78112", phone: "+49 7724 870", family: true },
  { name: "מיני-גולף Schönwald", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", address: "Ludwig-van-Beethoven-Str., 78141 Schönwald, Germany", postal: "78141", phone: "+49 1525 1092775", family: true },
  { name: "מיני-גולף Schonach", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", address: "Hauptstraße 6, 78136 Schonach, Germany", postal: "78136", phone: "+49 7722 9650050", family: true },
  { name: "מיני-גולף Schluchsee", cat: "leisure-sport", type: "free", benefit: "משחק חינם, פעם אחת.", address: "Auf der Wacht 1, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7656 988 2916", family: true },
  { name: "Schwarzwaldzoo Waldkirch", cat: "leisure-sport", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Am Buchenbühl 8a, 79183 Waldkirch, Germany", postal: "79183", phone: "+49 7681 8961", site: "https://www.schwarzwaldzoo.de/", note: "קרוב לפרייבורג — אפשר לשלב ביום פרייבורג/טודנאו אם נשאר זמן.", family: true },
  { name: "Action Forest Offroad Park טיטיזה", cat: "leisure-sport", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", phone: "+49 7651 82560", family: true },
  { name: "Action Forest Kletterwald (פארק חבלים)", cat: "leisure-sport", type: "free", benefit: "3 שעות חינם בפארק החבלים.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", phone: "+49 7651 9331170", family: true },
  { name: "סדנת שעון קוקייה עצמאית — stattMuseum פורטוואנגן", cat: "leisure-sport", type: "free", benefit: "השתתפות חינם בהכנת שעון קוקייה, בהרשמה מראש (מגיל 16, ילדים עד 10 עם מלווה).", address: "Friedrichstr. 3, 78120 Furtwangen, Germany", postal: "78120", phone: "+49 7723 9202 800", note: "טלפון/מייל להרשמה מראש, ב-Mo-Fr 9:00-14:30.", family: true },
  { name: "Bogensportzentrum — קשתות", cat: "leisure-sport", type: "free", benefit: "2 שעות קשתות חינם באולם, כולל הדרכה וציוד — לא כולל מסלול חוץ.", address: "Hauptstr. 55, 79871 Eisenbach, Germany", postal: "79871", phone: "+49 7657 471", note: "הרשמה טלפונית מראש, שעות ירי 10:00 / 12:00 / 14:00.", family: true },

  // --- בריכות ואגמים ---
  { name: "Hallenbad Breitnau (בריכה מקורה + סאונה)", cat: "pools-lakes", type: "free", benefit: "כניסה חינם לבריכה ולסאונה, פעם אחת.", address: "Dorfstr. 3, 79874 Breitnau, Germany", postal: "79874", phone: "+49 7652 910950", family: true },
  { name: "Hallenbad Löffingen-Dittishausen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Taborstr. 33, 79843 Löffingen-Dittishausen, Germany", postal: "79843", phone: "+49 7654 493", family: true },
  { name: "Hallenbad St. Georgen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Im Hochwald 6, 78112 St. Georgen, Germany", postal: "78112", phone: "+49 7724 87358", family: true },
  { name: "Hallenbad Schluchsee-Schönenbach", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Weiherstr. 4, 79859 Schluchsee-Schönenbach, Germany", postal: "79859", phone: "+49 7747 511", family: true },
  { name: "בריכת חוץ עירונית בונדורף", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — מתחילת הקיץ עד סוף חופשת הקיץ.", address: "Schwimmbadstr. 11, 79848 Bonndorf, Germany", postal: "79848", phone: "+49 7703 8034", family: true },
  { name: "Waldbad Löffingen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Welschland, 79843 Löffingen, Germany", postal: "79843", phone: "+49 7654 8266", family: true },
  { name: "Freibad Dittishausen", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Schwimmbadstr. 30, 79843 Löffingen-Dittishausen, Germany", postal: "79843", phone: "+49 7654 808801", family: true },
  { name: "Freibad Lenzkirch", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Friedhofstr. 11, 79853 Lenzkirch, Germany", postal: "79853", phone: "+49 7653 400", family: true },
  { name: "Freibad נוישטט (טיטיזה)", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Gutachstraße 33, 79822 Titisee-Neustadt, Germany", postal: "79822", phone: "+49 7651 9331121", family: true },
  { name: "Naturena-Badesee", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Im Tal 1, 79777 Ühlingen-Birkendorf, Germany", postal: "79777", phone: "+49 7743 919727", family: true },
  { name: "Naturfreibad Klosterweiher (סנט גאורגן)", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Brigachstr. 2, 78112 St. Georgen, Germany", postal: "78112", phone: "+49 7724 87386", family: true },
  { name: "Naturfreibad סנט מרגן", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Sportplatz 4, 79274 St. Märgen, Germany", postal: "79274", phone: "+49 7669 91180", family: true },
  { name: "Naturfreibad שנוואלד", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Ludwig-van-Beethoven-Str. 15, 78141 Schönwald, Germany", postal: "78141", phone: "+49 173 2874525", family: true },
  { name: "Bregtalbad פורטוואנגן", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Jahnstraße 11, 78120 Furtwangen, Germany", postal: "78120", phone: "+49 7723 9149709", family: true },
  { name: "aqua fun שלוכזה", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Freiburger Str. 16, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7656 7731", family: true },
  { name: "חוף רחצה Windgfällweiher", cat: "pools-lakes", type: "free", benefit: "כניסה חינם, פעם אחת — תלוי מזג אוויר.", address: "Raitenbucher Str. 37, 79853 Lenzkirch, Germany", postal: "79853", phone: "+49 176 98285016", site: "https://www.strandbad-windgfaellweiher.de/", family: true },

  // --- טבע ואופניים ---
  { name: "טיול/ליטוף אלפקות — Haberjockelshof", cat: "nature-bike", type: "free", benefit: "השתתפות חינם בטיול אלפקות או ליטוף אלפקות, לפי זמינות — הרשמה בפורטל הכרטיס.", address: "Schwärzenbach 24, 79822 Titisee-Neustadt, Germany", postal: "79822", site: "https://www.haberjockelshof.de/", note: "נקודת מפגש 10:00, רק לפי זמינות.", family: true },
  { name: "סיור עשבי בר עם טעימה", cat: "nature-bike", type: "free", benefit: "השתתפות חינם, מיקומים משתנים.", address: "מיקומים משתנים, Hochschwarzwald, Germany", postal: "79868", note: "תאריכים ופרטים בפורטל הכרטיס mein.hochschwarzwald.de.", family: true },
  { name: "סדנת משחות טבעיות", cat: "nature-bike", type: "free", benefit: "השתתפות חינם — מתקיים בשנוואלד.", address: "Schönwald, 78141, Germany", postal: "78141", note: "תאריכים ופרטים בפורטל הכרטיס mein.hochschwarzwald.de.", family: true },
  { name: "Tannenmühle — סיור בטחנה + חיות מחמד", cat: "nature-bike", type: "free", benefit: "כניסה חינם לסיור בטחנה ולפינת החיות ללטיפה, פעם אחת.", address: "Tannenmühleweg 5, 79865 Grafenhausen, Germany", postal: "79865", phone: "+49 7748 215", site: "https://www.tannenmuehle.de/", family: true },
  { name: "סיורי E-MTB", cat: "nature-bike", type: "free", benefit: "השתתפות חינם בסיור E-MTB מודרך, פעם אחת.", address: "Fischbacher Str. 16, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7656 9882916", note: "הרשמה מראש בפורטל הכרטיס בלבד.", family: true },
  { name: "Kids Bike Basics", cat: "nature-bike", type: "free", benefit: "השתתפות חינם בסדנת רכיבה לילדים, פעם אחת.", address: "Fischbacher Str. 16, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7656 9882916", note: "הרשמה מראש בפורטל הכרטיס בלבד.", family: true },
  { name: "Bikepark Todtnau — קורס טעימה", cat: "nature-bike", type: "free", benefit: "קורס טעימה חינם בפארק האופניים.", address: "Brandenbergstr. 2, 79674 Todtnau, Germany", postal: "79674", phone: "+49 7671 959 9999", note: "הרשמה מראש בפורטל הכרטיס בלבד.", family: true },
  { name: "השכרת אופניים חשמליים — Tannenmühle (גרפנהאוזן)", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 12, לפי זמינות.", address: "Tannenmühleweg 5, 79865 Grafenhausen, Germany", postal: "79865", phone: "+49 7748 215", family: true },
  { name: "השכרת אופניים חשמליים — פלדברג", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", address: "Dr.-Pilet-Spur 1, 79868 Feldberg, Germany", postal: "79868", phone: "+49 7676 422", family: true },
  { name: "השכרת אופניים חשמליים — Sport Lehr טודנאו", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", address: "Friedrichstraße 7, 79674 Todtnau, Germany", postal: "79674", phone: "+49 7671 317", family: true },
  { name: "השכרת אופניים חשמליים — Thoma Sports טיטיזה", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", address: "Seestraße 2, 79822 Titisee-Neustadt, Germany", postal: "79822", phone: "+49 7651 9724967", family: true },
  { name: "השכרת אופניים חשמליים — Spaßpark שלוכזה", cat: "nature-bike", type: "free", benefit: "3 שעות השכרה חינם, מגיל 16, לפי זמינות.", address: "Fischbacher Straße 16, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7656 9882878", family: true },
  { name: "השכרת אופניים חשמליים — שנוואלד", cat: "nature-bike", type: "free", benefit: "השכרה ליום שלם, חינם, מגיל 16 — בהרשמה מראש בלבד.", address: "Franz-Schubert-Straße 3, 78141 Schönwald, Germany", postal: "78141", phone: "+49 7652 12067400", family: true },
  { name: "השכרת סירת פדלים — Müllers Bootsvermietung שלוכזה", cat: "nature-bike", type: "free", benefit: "30 דקות חינם, עד 4 אנשים בסירה — תלוי מזג אוויר.", address: "An der Staumauer 1, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 170 3803299", note: "זה באגם שלוכזה, לא טיטיזה — אופציה נוספת אם רוצים גם השכרת סירת פדלים עצמאית.", family: true },

  // --- מוזיאונים וסיורים ---
  { name: "Blattert Mühle — סדנת פרצלה קטנה", cat: "museums-tours", type: "free", benefit: "השתתפות חינם בהכנת פרצל, בהרשמה מראש חובה.", address: "Konstantin-Fehrenbach-Str. 34, 79848 Bonndorf, Germany", postal: "79848", phone: "+49 7703 318", note: "הזמנה מראש חובה דרך mein.hochschwarzwald.de.", family: true },
  { name: "מוזיאון Le Petit Salon Winterhalter", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Hinterdorfstraße 15, 79837 Menzenschwand, Germany", postal: "79837", phone: "+49 7675 9296988", family: true },
  { name: "Kloster Museum סנט מרגן", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Rathausplatz 1, 79274 St. Märgen, Germany", postal: "79274", phone: "+49 7669 91180", family: true },
  { name: "Oldtimer Museum Lafette", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת — ה'-ב', 10:30-18:30.", address: "Heiligbrunnenstr. 10, 79822 Titisee-Neustadt, Germany", postal: "79822", phone: "+49 7652 360", family: true },
  { name: "Schwarzwälder Skimuseum הינטרצרטן", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Erlenbrucker Straße 35, 79856 Hinterzarten, Germany", postal: "79856", phone: "+49 7652 982192", family: true },
  { name: "Deutsches Phonomuseum סנט גאורגן", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Bärenplatz 1, 78112 St. Georgen, Germany", postal: "78112", phone: "+49 7724 87320", family: true },
  { name: "Kreismuseum סנט בלאזין", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Am Kurgarten 1-3, 79837 St. Blasien, Germany", postal: "79837", phone: "+49 7672 41437", family: true },
  { name: "Volkskundemuseum Hüsli", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Am Hüsli 1, 79865 Grafenhausen, Germany", postal: "79865", phone: "+49 7748 212", family: true },
  { name: "Haus der Natur — פלדברג", cat: "museums-tours", type: "free", benefit: "כניסה חינם לתערוכה, פעם אחת.", address: "Dr.-Pilet-Spur 4, 79868 Feldberg, Germany", postal: "79868", phone: "+49 7676 933630", family: true },
  { name: "Schwarzwaldhaus der Sinne — מוזיאון חוויתי", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Schulstr. 1, 79865 Grafenhausen, Germany", postal: "79865", phone: "+49 7748 52048", family: true },
  { name: "סיור בקתדרלת סנט בלאזין", cat: "museums-tours", type: "free", benefit: "סיור מודרך חינם, פעם אחת — הרשמה במשרד התיירות המקומי.", address: "Fürstabt-Gerber-Str. 16, 79837 St. Blasien, Germany", postal: "79837", phone: "+49 7672 41437", family: true },
  { name: "Freilichtmuseum Klausenhof הרישריד", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת.", address: "Lindenweg 3, 79737 Herrischried, Germany", postal: "79737", family: true },
  { name: "מוזיאון טבע Kalchreuter — Glashütte", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת — רק בשבת הראשונה בחודש, 14:00-16:00.", address: "Glashütte 4, 79848 Bonndorf, Germany", postal: "79848", phone: "+49 7653 6660", note: "שעות פתיחה מצומצמות — לוודא תאריך לפני שיוצאים.", family: true },
  { name: "תערוכת זכוכית ב-Kurhaus שלוכזה", cat: "museums-tours", type: "free", benefit: "כניסה חינם, פעם אחת — יש להירשם במשרד התיירות המקומי.", address: "Fischbacher Str. 7, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7562 1206 0", family: true },
  { name: "סיורי תיאטרון רחוב — Freiburg Living History", cat: "museums-tours", type: "free", benefit: "השתתפות חינם בסיור שחקנים בפרייבורג — ו' 18:00 (\"מכשפת פרייבורג\"), ש' 18:00 (\"הנוודת\").", address: "Hinter-den-Eichen 12/1, 79276 Reute, Germany", postal: "79276", phone: "+49 176 432 114 19", note: "תוכן מיועד למבוגרים יותר (עלילות מימי הביניים) — לשקול לפי גיל הילדים.", family: false },

  // --- משחקי בריחה ו-VR ---
  { name: "Outdoor-Escape — Die doppelte Biergit (Brauerei Rothaus)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", address: "Hauptstr. 38a, 79199 Kirchzarten, Germany", postal: "79199", phone: "+49 7661 98 93 790", note: "המיקום בפועל: Brauerei Rothaus. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Outdoor-Escape — Das verlorene Dorf (שלוכזה)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", address: "Fischbacher Str. 7, 79859 Schluchsee, Germany", postal: "79859", phone: "+49 7661 98 93 790", note: "נקודת יציאה: משרד התיירות שלוכזה. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Outdoor-Escape — Das Rätsel der Zeit (לנצקירך)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", address: "Am Kurgarten 1, 79853 Lenzkirch, Germany", postal: "79853", phone: "+49 7661 98 93 790", note: "נקודת יציאה: Abenteuer Golfpark לנצקירך. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Outdoor-Escape — Die vier Tode des falschen Mönchs (סנט מרגן)", cat: "escape-vr", type: "discount", benefit: "מחיר מוזל, הזמנה מקוונת בלבד, ב'-ה'.", address: "79274 St. Märgen, Germany", postal: "79274", phone: "+49 7661 98 93 790", note: "נקודת יציאה: Hotel \"Der Hirschen\", סנט מרגן. הזמנה דרך berggeheimnis.com.", family: true },
  { name: "Explor Games — Tico & Itza (הרפתקת משפחות)", cat: "escape-vr", type: "free", benefit: "השאלת טאבלט חינם לעד 5 אנשים + משחק אחד, פעם אחת.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", phone: "+49 7651 82560", note: "להזמין מראש, בין 10:00-16:00.", family: true },
  { name: "Explor Games — Lenofi und die Legende von Guta", cat: "escape-vr", type: "free", benefit: "השאלת טאבלט חינם לעד 5 אנשים + משחק אחד, פעם אחת.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", phone: "+49 7651 82560", note: "להזמין מראש, בין 10:00-16:00.", family: true },
  { name: "Lasertag Base — 15 דקות חינם", cat: "escape-vr", type: "free", benefit: "15 דקות לייזר-טאג חינם, פעם אחת — הזמנה מקוונת בלבד.", address: "Neustädter Str. 41, 79822 Titisee, Germany", postal: "79822", phone: "+49 7651 9331170", family: true },
  { name: "Operation Mindfall — חדר בריחה", cat: "escape-vr", type: "free", benefit: "השתתפות חינם, פעם אחת — הזמנה מקוונת בלבד.", address: "Höllsteig 76, 79874 Breitnau, Germany", postal: "79874", phone: "+49 7652 9010", family: true },
  { name: "Magic Portal — חדר בריחה", cat: "escape-vr", type: "free", benefit: "השתתפות חינם, פעם אחת — הזמנה מקוונת בלבד.", address: "Höllsteig 76, 79874 Breitnau, Germany", postal: "79874", phone: "+49 7652 9010", family: true },
  { name: "Anni's Schwarzwaldgeheimnis — טיול-בריחה", cat: "escape-vr", type: "free", benefit: "טיול-בריחה בטבע, חינם — בתיאום מראש בלבד.", address: "Franz-Schubert-Str. 3, 78141 Schönwald, Germany", postal: "78141", phone: "+49 7652 12067400", family: true },
  { name: "VR Point Mr. Modicap — חוויית VR", cat: "escape-vr", type: "free", benefit: "25 דקות מציאות מדומה חינם — רק בתיאום טלפוני, ימי ו'/ש'.", address: "Bürgermeister-Kuner-Str. 12, 78136 Schonach, Germany", postal: "78136", phone: "+49 7722 868 9968", note: "בזמן זה החדר-הצג הזמני נמצא ב-VR Arena Triberg.", family: true },
  { name: "VR-Experience קפיצת סקי — מוזיאון הסקי הינטרצרטן", cat: "escape-vr", type: "free", benefit: "שימוש חינם, פעם אחת.", address: "Erlenbrucker Straße 35, 79856 Hinterzarten, Germany", postal: "79856", phone: "+49 7652 982192", family: true },
  { name: "VR קפיצת סקי — מגדל הקפיצה בשונאך", cat: "escape-vr", type: "free", benefit: "השתתפות חינם — רק בתיאום מראש, ימי ו' 15:00.", address: "Bürgermeister-Kuner-Str. 12, 78136 Schonach, Germany", postal: "78136", family: true },

  // --- אוכל ושתייה ---
  { name: "Heinz Wagner Sekt Manufaktur", cat: "culinary", type: "free", benefit: "סיור מודרך + טעימת שמפניה חינם, כולל שובר קנייה בשווי 5€.", address: "Albtalstr. 14, 79837 St. Blasien, Germany", postal: "79837", phone: "+49 7672 922 663 0", note: "יין תוסס — הרשמה טלפונית מראש חובה.", family: false },
  { name: "בירה עם אומני הבירה", cat: "culinary", type: "free", benefit: "השתתפות חינם בטעימת בירה, לפי זמינות והרשמה מראש.", address: "Feldbergstr. 5, 79868 Feldberg, Germany", postal: "79868", phone: "+49 151 44626615", note: "אלכוהול — הרשמה מראש חובה דרך mein.hochschwarzwald.de.", family: false },
  { name: "Gscheiter Beck — מוזיאון שנאפס", cat: "culinary", type: "free", benefit: "כניסה חינם למוזיאון + טעימת שנאפס, מגיל 18 בלבד.", address: "Bahnhofstraße 3, 79868 Feldberg, Germany", postal: "79868", phone: "+49 7655 341", note: "מגבלת גיל 18+ מפורשת.", family: false },
  { name: "Café Zimmermann — סדנת עוגת יער שחור", cat: "culinary", type: "free", benefit: "השתתפות חינם בהכנת עוגת דובדבנים שחורה, כולל פרוסה וקפה — כל שבועיים בימי ג'.", address: "Kurparkweg 2, 79682 Todtmoos, Germany", postal: "79682", phone: "+49 7674 90570", note: "הרשמה חובה עד יום ב' 17:30.", family: true },
  { name: "Schwarzwaldimkerei und Brennerei Herb", cat: "culinary", type: "free", benefit: "סיור מזקקה + טעימה חינם, מגיל 18 בלבד — כל שבועיים בימי ו' 16:00.", address: "Tiroler Str. 8, 79848 Bonndorf, Germany", postal: "79848", phone: "+49 7653 6660", note: "מגבלת גיל 18+ מפורשת.", family: false },
  { name: "טעימת תה — סנט מרגן", cat: "culinary", type: "free", benefit: "השתתפות חינם בטעימת תה, פעם אחת.", address: "Feldbergstraße 2, 79274 St. Märgen, Germany", postal: "79274", phone: "+49 7669 939826", note: "הרשמה חובה יום לפני — ג'/ה' מ-15:00, ש' מ-10:00.", family: true },

  // --- גולף ---
  { name: "Freiburger Golfplatz", cat: "golf", type: "free", benefit: "גרין-פי חינם ל-18 חורים, פעם אחת.", address: "Krüttweg 1, 79199 Kirchzarten, Germany", postal: "79199", phone: "+49 7661 98470", family: false },
  { name: "Golfclub Königsfeld", cat: "golf", type: "free", benefit: "גרין-פי חינם ל-18 חורים, פעם אחת.", address: "Angelmoos 20, 78126 Königsfeld, Germany", postal: "78126", phone: "+49 7725 9396-0", family: false },
  { name: "Golfclub Obere Alp (שטילינגן)", cat: "golf", type: "free", benefit: "גרין-פי חינם, פעם אחת — אפשרויות ל-18 חורים, 9 חורים, או 18 חורים על מגרש 9 החורים.", address: "Am Golfplatz 1-3, 79780 Stühlingen, Germany", postal: "79780", phone: "+49 7703 92030", family: false }
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
  if (block.infoUrl) chips.push(`<a class="chip info" href="${escapeHTML(block.infoUrl)}" target="_blank" rel="noopener">${ICON.link} מידע נוסף</a>`);
  if (!chips.length) return "";
  return `<div class="chips">${chips.join("")}</div>`;
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

// בלוק "תחנה" מלא — עם תמונה, כתובת, זמן נסיעה, וכל השאר.
function stopCardHTML(block) {
  return `
    <div class="stop">
      ${imageHTML(block.image)}
      <div class="stop-body">
        ${timeLabel(block) ? `<div class="stop-time">${timeLabel(block)}</div>` : ""}
        <h3>${escapeHTML(block.title)}</h3>
        <p>${escapeHTML(block.desc)}</p>
        ${chipsHTML(block)}
        ${tipsHTML(block)}
      </div>
    </div>
  `;
}

// בלוק מידע נלווה (בלי כתובת/מפה/תמונה משלו).
function infoItemHTML(block) {
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
      html += stopCardHTML(b);
    } else {
      html += infoItemHTML(b);
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

function renderItinerary() {
  const todayStr = localDateStr(new Date());
  const html = DAYS.map((day, i) => {
    const isToday = day.date === todayStr;

    return `
      <details class="day" data-date="${day.date}" ${isToday ? "open" : ""}>
        <summary>
          <span class="day-summary-left">
            <span class="day-date">${hebWeekday(day.date)}, ${dayMonth(day.date)}${isToday ? '<span class="day-today-dot"></span>' : ""}</span>
            <span class="day-title">${escapeHTML(day.title)}</span>
          </span>
          <span class="day-chevron">${ICON.chevron}</span>
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
        <div class="chips"><a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.pin} מפה</a></div>
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
  let heroHTML = `
    <div class="hero">
      <p class="hero-eyebrow">יום ${dayNum} מתוך ${DAYS.length} · ${hebWeekday(day.date)}, ${dayMonth(day.date)}</p>
      <h1 class="hero-title">${escapeHTML(day.title)}</h1>
      <p class="hero-sub">${escapeHTML(day.place)} · ${escapeHTML(day.driveNote)}</p>
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
        <h2>${escapeHTML(b.title)}</h2>
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
      return `
        <div class="timeline-item ${isPast ? "done" : ""}">
          <div class="time">${timeLabel(b)}</div>
          <div class="body">
            ${b.drive && !isPast ? `<div class="leg-hint">${ICON.car} ${escapeHTML(b.drive.time)} ${escapeHTML(b.drive.from)}</div>` : ""}
            <h3>${escapeHTML(b.title)}</h3>
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
        <div class="chips"><a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">${ICON.pin} פתיחה במפות</a></div>
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
      <h2>כדאי לדעת</h2>
      <div class="card">
        ${GENERAL_TIPS.map(t => `<div class="tip">${ICON.bulb}<span>${escapeHTML(t)}</span></div>`).join("")}
      </div>
    </div>
  `;
  bindChecklist();
}

/* ============================================================
   תצוגת כרטיס האדום
   ============================================================ */

let redCardSortMode = localStorage.getItem("bf2026-redcard-sort") || "hotel";
let redCardFilterMode = localStorage.getItem("bf2026-redcard-filter") || "all";
let redCardLiveCoords = null;
let redCardLiveError = null;

const REDCARD_CATEGORY_ORDER = ["leisure-sport", "pools-lakes", "nature-bike", "museums-tours", "escape-vr", "culinary", "golf"];

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
          ${item.site ? `<a class="chip info" href="${escapeHTML(item.site)}" target="_blank" rel="noopener">${ICON.link} אתר</a>` : ""}
        </div>
      </div>
    </div>
  `;
}

function redCardCatalogItemHTML(item, dist) {
  return `
    <div class="card redcard-item">
      ${benefitBadgeHTML(item)}
      <h3>${escapeHTML(item.name)}</h3>
      <p>${escapeHTML(item.benefit)}</p>
      ${item.note ? `<div class="tip">${ICON.bulb}<span>${escapeHTML(item.note)}</span></div>` : ""}
      <div class="chips">
        ${dist != null ? `<span class="chip distance-tag">${ICON.route} ${formatDistance(dist)} ${redCardSortMode === "live" && redCardLiveCoords ? "מהמיקום שלי" : "מהמלון"}</span>` : ""}
        <a class="chip map" href="${mapLink(item.address)}" target="_blank" rel="noopener">${ICON.pin} מפה</a>
        ${item.site ? `<a class="chip info" href="${escapeHTML(item.site)}" target="_blank" rel="noopener">${ICON.link} אתר</a>` : ""}
      </div>
    </div>
  `;
}

function renderRedCardCatalog() {
  const container = $("#redcard-catalog-list");
  if (!container) return;

  let items = RED_CARD_CATALOG.slice();
  if (redCardFilterMode === "family") items = items.filter(i => i.family);

  const refPoint = (redCardSortMode === "live" && redCardLiveCoords) ? redCardLiveCoords : HOTEL_COORDS;
  const withDist = items.map(item => {
    const coords = itemCoords(item);
    return { item, dist: coords ? haversineKm(refPoint, coords) : null };
  });
  withDist.sort((a, b) => (a.dist ?? Infinity) - (b.dist ?? Infinity));

  let html = "";
  for (const cat of REDCARD_CATEGORY_ORDER) {
    const catItems = withDist.filter(x => x.item.cat === cat);
    if (!catItems.length) continue;
    html += `<h3 class="mini-list-title">${escapeHTML(CATEGORY_LABELS[cat])}</h3>`;
    html += catItems.map(x => redCardCatalogItemHTML(x.item, x.dist)).join("");
  }
  container.innerHTML = html || `<div class="empty-note">אין תוצאות עם הסינון הנוכחי.</div>`;
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

  const controlsHTML = `
    <div class="redcard-controls">
      <div class="toggle-group" id="redcard-sort-group">
        <button class="toggle-btn ${redCardSortMode === "hotel" ? "active" : ""}" data-sort="hotel">מרחק מהמלון</button>
        <button class="toggle-btn ${redCardSortMode === "live" ? "active" : ""}" data-sort="live">${ICON.target}<span>המיקום שלי עכשיו</span></button>
      </div>
      <div class="toggle-group" id="redcard-filter-group">
        <button class="toggle-btn ${redCardFilterMode === "all" ? "active" : ""}" data-filter="all">הכל</button>
        <button class="toggle-btn ${redCardFilterMode === "family" ? "active" : ""}" data-filter="family">מתאים למשפחות</button>
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
  $("#topbarIcon").innerHTML = ICON.tree;
  $$(".tab-icon").forEach(el => { el.innerHTML = ICON[el.dataset.icon]; });

  renderNow();
  renderItinerary();
  renderRedCard();
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
