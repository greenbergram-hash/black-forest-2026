// חשוב: כל שינוי ב-app.js / style.css / index.html מחייב העלאת המספר כאן.
// ה-Service Worker הוא cache-first, אז בלי זה מכשיר שכבר התקין את האפליקציה
// ימשיך להריץ את הגרסה הישנה לנצח.
const CACHE = "bf2026-v12";

// פרקי הפודקאסט יושבים במטמון נפרד ובלי מספר גרסה, כדי שעדכון של האפליקציה
// לא ימחק אותם — הורדה חוזרת של כל הפרקים היא הרבה מגה-בייט.
const AUDIO_CACHE = "bf2026-audio";
const KEEP = [CACHE, AUDIO_CACHE];

const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./images/ravennaschlucht.jpg",
  "./images/titisee.jpg",
  "./images/badeparadies.jpg",
  "./images/europapark.jpg",
  "./images/freiburg.jpg",
  "./images/todtnau-falls.jpg",
  "./images/blackforestline.jpg",
  "./images/rulantica.jpg",
  "./images/triberg.jpg",
  "./images/vogelpark.jpg",
  "./images/rheinfall.jpg",
  "./images/lindt.jpg",
  "./images/zurich-airport.jpg"
];
// שימו לב: קבצי audio/ לא נמצאים ב-SHELL בכוונה. הם כמה מגה-בייט כל אחד,
// ואין סיבה שההתקנה הראשונה תוריד את כולם. פרק נשמר כאן בהאזנה הראשונה
// אליו, ומאותו רגע הוא זמין גם בלי קליטה.

// cache: "reload" מכריח כל קובץ ב-SHELL להגיע מהרשת בזמן ההתקנה.
// בלי זה, העלאת המספר של CACHE לא מספיקה: GitHub Pages מגיש את הקבצים עם
// Cache-Control: max-age=600, כך שמכשיר שפתח את האפליקציה בעשר הדקות
// האחרונות היה שומר במטמון החדש דווקא את app.js הישן מהמטמון של הדפדפן —
// ומכיוון שה-Service Worker הוא cache-first, הגרסה הישנה הייתה נתקעת שם
// עד העלאת הגרסה הבאה.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL.map(url => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !KEEP.includes(k)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

const isAudio = url => url.pathname.includes("/audio/");

/* נגן אודיו לא מבקש את הקובץ במלואו — הוא שולח בקשות Range ומצפה לתשובת 206
   עם החלק שביקש. תשובה כזאת גם אסור לשמור במטמון (cache.put דוחה 206), וגם אם
   מחזירים 200 שלם במקומה, ספארי ב-iOS נתקע בגרירה בתוך הפרק. לכן כאן חותכים
   את התשובה השלמה שבמטמון לפרוסה ובונים 206 ידנית — ככה פרק שהורד מראש עובד
   באוטו גם בלי קליטה, כולל דילוג קדימה ואחורה. */
async function sliceFromCache(request, cached) {
  const range = request.headers.get("range");
  if (!range) return cached;

  const buffer = await cached.arrayBuffer();
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match) return cached;

  const total = buffer.byteLength;
  const hasStart = match[1] !== "";
  const hasEnd = match[2] !== "";
  let start, end; // end כולל, כמו בכותרת Content-Range

  if (hasStart) {
    start = Number(match[1]);
    end = hasEnd ? Math.min(Number(match[2]), total - 1) : total - 1;
  } else if (hasEnd) {
    // "bytes=-500" — 500 הבתים האחרונים
    const suffix = Math.min(Number(match[2]), total);
    start = total - suffix;
    end = total - 1;
  } else {
    return cached;
  }

  if (!(start >= 0) || start > end || start >= total) {
    return new Response(null, {
      status: 416,
      statusText: "Range Not Satisfiable",
      headers: { "Content-Range": `bytes */${total}` }
    });
  }

  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": cached.headers.get("Content-Type") || "audio/mp4",
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Accept-Ranges": "bytes"
    }
  });
}

async function handleAudio(request) {
  // מפתח המטמון הוא תמיד הבקשה בלי Range — פרק אחד, רשומה אחת.
  const plain = new Request(request.url, { credentials: "same-origin" });
  const cache = await caches.open(AUDIO_CACHE);
  const cached = await cache.match(plain);
  if (cached) return sliceFromCache(request, cached);

  try {
    // מביאים את הפרק במלואו גם אם המכשיר ביקש רק פרוסה, כדי שיישמר לאופליין.
    const full = await fetch(plain);
    if (full.status === 200) {
      await cache.put(plain, full.clone());
      return sliceFromCache(request, full);
    }
    // 404 וכל השאר — הפרק כנראה עוד לא הועלה; מעבירים כמו שהוא, האפליקציה מסבירה.
    return full;
  } catch {
    return new Response(null, { status: 504, statusText: "Offline" });
  }
}

// Cache-first for same-origin requests, so the app keeps working with no signal.
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;

  if (isAudio(url)) {
    event.respondWith(handleAudio(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        // רק 200 שלם נשמר: תשובת 206 חלקית לא ניתנת לאחסון ב-Cache API בכלל.
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
