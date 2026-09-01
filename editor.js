/* ============================================================
   עורך הטיולים
   נטען לפני app.js ומגדיר פונקציות בלבד — הן קוראות לעזרים של app.js
   ($ , escapeHTML, ICON וכו') רק בזמן ריצה, אחרי שהכול כבר נטען.

   עיקרון הבטיחות: מה שפורסם לא משתנה לעולם מתוך העורך. כל עריכה נכתבת
   לטיוטה מקומית (tp:<מזהה>:draft), ורק "פרסום" מוציא אותה החוצה. לכן אפשר
   לטעות, לשחזר גרסה קודמת, או פשוט להשליך את הטיוטה ולחזור למה שפורסם.
   ============================================================ */

const ED = {
  open: false,          // מסך העורך פתוח
  trip: null,           // הטיול שבעריכה (עותק עמוק, לא מה שמוצג באפליקציה)
  meta: null,           // { savedAt, trash: [] }
  dirty: false,
  form: null,           // טופס פעילות פתוח: { dayDate, index|null, draft, lookup }
  undo: null            // פעולת ביטול אחרונה למחיקה, עם טיימר
};

const ED_HISTORY_MAX = 20;

function edDraftKey(id) { return `tp:${id}:draft`; }
function edHistoryKey(id) { return `tp:${id}:history`; }
function edLocalKey() { return "tp:local-trips"; }

function edClone(value) { return JSON.parse(JSON.stringify(value)); }

/* ---------- טיוטות ---------- */

function edReadDraft(id) {
  return storeGet(edDraftKey(id));
}

function edHasDraft(id) {
  return !!edReadDraft(id);
}

/* שמירה. כל שמירה גם דוחפת תמונת מצב להיסטוריה, כדי שתמיד אפשר לחזור
   כמה צעדים אחורה — זה קו ההגנה מפני "מחקתי בטעות ולא שמתי לב מתי". */
function edSaveDraft({ snapshot = true } = {}) {
  ED.meta.savedAt = Date.now();
  storeSet(edDraftKey(ED.trip.id), { trip: ED.trip, meta: ED.meta });
  if (snapshot) {
    const hist = storeGet(edHistoryKey(ED.trip.id), []);
    hist.unshift({ at: ED.meta.savedAt, trip: ED.trip });
    storeSet(edHistoryKey(ED.trip.id), hist.slice(0, ED_HISTORY_MAX));
  }
  ED.dirty = true;
  edMarkLocal(ED.trip);
}

// טיול שקיים רק במכשיר (עוד לא פורסם) חייב להופיע ברשימת הטיולים,
// אחרת הוא "נעלם" ברגע שסוגרים את העורך.
function edMarkLocal(trip) {
  const local = storeGet(edLocalKey(), []);
  if (!local.some(t => t.id === trip.id)) {
    local.push(edIndexEntry(trip));
  } else {
    const i = local.findIndex(t => t.id === trip.id);
    local[i] = { ...local[i], ...edIndexEntry(trip) };
  }
  storeSet(edLocalKey(), local);
}

function edIndexEntry(trip) {
  return {
    id: trip.id,
    title: trip.title,
    subtitle: trip.subtitle || "",
    icon: trip.icon || "route",
    start: trip.start,
    end: trip.end,
    status: trip.status || "planned",
    localOnly: !!trip.localOnly
  };
}

// הרשימה שמוצגת בגיליון: מה שפורסם, בתוספת טיולים שקיימים רק כאן.
function edMergeIndex(published) {
  const local = storeGet(edLocalKey(), []);
  const byId = new Map(published.map(t => [t.id, { ...t }]));
  for (const t of local) {
    if (byId.has(t.id)) byId.set(t.id, { ...byId.get(t.id), localOnly: false });
    else byId.set(t.id, { ...t, localOnly: true });
  }
  for (const t of byId.values()) t.hasDraft = edHasDraft(t.id);
  return Array.from(byId.values());
}

function edDiscardDraft(id) {
  try {
    localStorage.removeItem(edDraftKey(id));
    localStorage.removeItem(edHistoryKey(id));
  } catch { /* התעלמות */ }
  const local = storeGet(edLocalKey(), []).filter(t => t.id !== id);
  storeSet(edLocalKey(), local);
}

/* ---------- יצירת טיול חדש ---------- */

/* המזהה הוא גם שם התיקייה וגם חלק מכתובת ה-URL, ולכן הוא חייב להישאר
   אותיות לטיניות: שם בעברית היה עובר קידוד בכל נתיב — ב-git, ב-API של
   GitHub וב-Pages. שם עברי מתועתק, והמשתמש יכול לתקן את התוצאה בטופס. */
const HEB_TRANSLIT = {
  "א": "a", "ב": "b", "ג": "g", "ד": "d", "ה": "h", "ו": "v", "ז": "z", "ח": "ch",
  "ט": "t", "י": "y", "כ": "k", "ך": "k", "ל": "l", "מ": "m", "ם": "m", "נ": "n",
  "ן": "n", "ס": "s", "ע": "a", "פ": "p", "ף": "f", "צ": "tz", "ץ": "tz", "ק": "k",
  "ר": "r", "ש": "sh", "ת": "t"
};

function edSlug(title) {
  const latin = Array.from(title.trim().toLowerCase())
    .map(ch => HEB_TRANSLIT[ch] !== undefined ? HEB_TRANSLIT[ch] : ch)
    .join("");
  const base = latin.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base || "trip";
}

function edUniqueId(title, year, asIs = false) {
  const stem = asIs ? edSlug(title) : `${edSlug(title)}-${year}`;
  let id = stem;
  const taken = new Set(TRIP_INDEX.map(t => t.id));
  let n = 2;
  while (taken.has(id)) id = `${stem}-${n++}`;
  return id;
}

function edDatesBetween(start, end) {
  const out = [];
  for (let d = new Date(start + "T12:00:00"); localDateStr(d) <= end; d.setDate(d.getDate() + 1)) {
    out.push(localDateStr(d));
  }
  return out;
}

function edSubtitleFor(start, end) {
  const a = Number(start.slice(8, 10));
  const b = Number(end.slice(8, 10));
  const monthA = HEB_MONTHS[Number(start.slice(5, 7)) - 1];
  const monthB = HEB_MONTHS[Number(end.slice(5, 7)) - 1];
  const year = end.slice(0, 4);
  return start.slice(0, 7) === end.slice(0, 7)
    ? `${a}–${b} ${monthB} ${year}`
    : `${a} ${monthA} – ${b} ${monthB} ${year}`;
}

// שלד טיול: יום ריק לכל תאריך בטווח. משם ממשיכים בטופס הפעילויות.
function edCreateTrip({ title, start, end, baseName, baseAddress, baseCoords, kind, id: wantedId }) {
  const id = wantedId ? edUniqueId(wantedId, end.slice(0, 4), true) : edUniqueId(title, end.slice(0, 4));
  return {
    schemaVersion: 1,
    id,
    localOnly: true,
    status: "planned",
    title: title.trim(),
    subtitle: edSubtitleFor(start, end),
    icon: "route",
    start,
    end,
    base: { kind: kind || "hotel", name: baseName.trim(), address: baseAddress.trim(), coords: baseCoords },
    flightIn: null,
    flightOut: null,
    checklist: [],
    tips: [],
    podcasts: {},
    days: edDatesBetween(start, end).map(date => ({
      date,
      title: "",
      place: "",
      driveNote: "",
      blocks: []
    }))
  };
}

/* ---------- השלמות אוטומטיות ----------
   הכול ממקורות חופשיים בלי מפתח API. שום ערך לא נכנס לטיול בשקט — הוא
   ממלא שדה שאפשר לתקן, ומוצג לצידו מאיפה הגיע. */

// חיפוש מקום: קודם הגאוקודר של Open-Meteo (אותו ספק כמו התחזית, מהיר
// ומדויק לשמות מקומות), ואם אין תוצאה — Nominatim, שיודע גם כתובות רחוב.
async function edGeocode(query) {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const url = "https://geocoding-api.open-meteo.com/v1/search?count=6&language=he&format=json&name=" + encodeURIComponent(q);
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const hits = (json.results || []).map(r => ({
        name: r.name,
        detail: [r.admin1, r.country].filter(Boolean).join(", "),
        address: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
        coords: { lat: r.latitude, lng: r.longitude, elev: Math.round(r.elevation ?? 0) },
        source: "Open-Meteo"
      }));
      if (hits.length) return hits;
    }
  } catch { /* ממשיכים ל-Nominatim */ }

  try {
    const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=he&q=" + encodeURIComponent(q);
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.map(r => ({
      name: r.name || r.display_name.split(",")[0],
      detail: r.display_name.split(",").slice(1, 3).join(",").trim(),
      address: r.display_name,
      coords: { lat: Number(r.lat), lng: Number(r.lon), elev: null },
      source: "OpenStreetMap"
    }));
  } catch { return []; }
}

// גובה — התחזית משתמשת בו, ובלעדיו פסגה ועמק באותו אזור מקבלים אותם מספרים.
async function edElevation(coords) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${coords.lat}&longitude=${coords.lng}`);
    if (!res.ok) return null;
    const json = await res.json();
    const e = json.elevation && json.elevation[0];
    return typeof e === "number" ? Math.round(e) : null;
  } catch { return null; }
}

/* תקציר מוויקיפדיה לפי קרבה לנקודה. עברית קודם; לישובים קטנים בגרמניה
   בדרך כלל אין ערך עברי, ואז חוזרים לגרמנית/אנגלית — אבל טקסט בשפה זרה
   לא נכנס לתיאור בעצמו, אלא מוצג לצידו כחומר גלם לכתיבה. */
async function edWikiNearby(coords) {
  for (const lang of ["he", "de", "en"]) {
    try {
      const geo = `https://${lang}.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${coords.lat}|${coords.lng}&gsradius=3000&gslimit=1&format=json&origin=*`;
      const res = await fetch(geo);
      if (!res.ok) continue;
      const json = await res.json();
      const hit = json.query && json.query.geosearch && json.query.geosearch[0];
      if (!hit) continue;

      const sum = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`);
      if (!sum.ok) continue;
      const page = await sum.json();
      if (!page.extract) continue;
      return {
        lang,
        title: page.title,
        extract: page.extract,
        url: page.content_urls && page.content_urls.desktop && page.content_urls.desktop.page
      };
    } catch { /* השפה הבאה */ }
  }
  return null;
}

/* תמונות מוויקישיתוף לפי קרבה. extmetadata נותן את היוצר והרישיון, שזה
   בדיוק המבנה שהאפליקציה כבר מרנדרת — כך שהקרדיט נכון מעצם הבחירה. */
async function edCommonsPhotos(coords) {
  try {
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*"
      + "&generator=geosearch&ggsnamespace=6&ggslimit=12"
      + `&ggscoord=${coords.lat}|${coords.lng}&ggsradius=2000`
      + "&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200";
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    const pages = (json.query && json.query.pages) || {};
    return Object.values(pages).map(p => {
      const info = p.imageinfo && p.imageinfo[0];
      if (!info) return null;
      const meta = info.extmetadata || {};
      const strip = html => String(html || "").replace(/<[^>]*>/g, "").trim();
      if (!/\.(jpe?g|png)$/i.test(p.title)) return null;
      return {
        commonsFile: p.title.replace(/^File:/, ""),
        thumb: info.thumburl || info.url,
        credit: strip(meta.Artist && meta.Artist.value) || "ויקישיתוף",
        license: strip(meta.LicenseShortName && meta.LicenseShortName.value) || ""
      };
    }).filter(Boolean);
  } catch { return []; }
}

/* ---------- הערכת זמן נסיעה ----------
   מרחק אווירי כפול מקדם דרכים, עם מהירות שגדלה במרחק (עירוני קצר מול
   כביש מהיר). זו הערכה ומוצגת ככזאת — הכפתור "מסלול הנסיעה של היום"
   נשאר המקור לזמן אמת. */
function estimateDrive(from, to, fromLabel) {
  if (!from || !to) return null;
  const air = haversineKm(from, to);
  const road = air * 1.3;
  const kmh = road < 15 ? 45 : road < 40 ? 60 : 75;
  const mins = Math.max(5, Math.round((road / kmh) * 60 / 5) * 5);
  const time = mins >= 60
    ? `כ-${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")} שעות`
    : `כ-${mins} דקות`;
  return { time, dist: `כ-${formatDistance(road)}`, from: fromLabel, auto: true };
}

// מחשב מחדש את כל רגלי הנסיעה של יום: מהבסיס לתחנה הראשונה, בין תחנות,
// וחזרה. רגל שנכתבה ביד (בלי auto) לא נדרסת.
function edRecalcDay(day) {
  const base = ED.trip.base;
  if (!base.coords) return;
  const stops = day.blocks.filter(b => b.address && b.coords);
  let prev = { coords: base.coords, label: `מ${base.name ? "-" + base.name : "הבסיס"}` };
  for (const b of stops) {
    if (!b.drive || b.drive.auto) {
      const leg = estimateDrive(prev.coords, b.coords, prev.label);
      if (leg) b.drive = leg;
    }
    prev = { coords: b.coords, label: `מ-${b.title}` };
  }
  if (stops.length && (!day.returnLeg || day.returnLeg.auto)) {
    const back = estimateDrive(prev.coords, base.coords, prev.label);
    if (back) day.returnLeg = { ...back, label: "חזרה לבסיס" };
  }
  if (!stops.length) delete day.returnLeg;
}

/* ---------- סל מחיקות וביטול ---------- */

function edTrashPush(kind, payload) {
  ED.meta.trash.push({ kind, at: Date.now(), payload });
}

function edUndoLast() {
  if (!ED.undo) return;
  ED.undo.restore();
  ED.meta.trash.pop();
  ED.undo = null;
  edSaveDraft();
  edRender();
}

function edShowUndo(text, restore) {
  ED.undo = { restore };
  clearTimeout(ED.undoTimer);
  ED.undoTimer = setTimeout(() => { ED.undo = null; edRender(); }, 12000);
}

/* ---------- היסטוריה ---------- */

function edRestoreSnapshot(index) {
  const hist = storeGet(edHistoryKey(ED.trip.id), []);
  const snap = hist[index];
  if (!snap) return;
  ED.trip = edClone(snap.trip);
  edSaveDraft();
  edRender();
}

/* ---------- גיבוי ---------- */

function edExportBackup() {
  const local = storeGet(edLocalKey(), []);
  const drafts = {};
  for (const t of TRIP_INDEX) {
    const d = edReadDraft(t.id);
    if (d) drafts[t.id] = d;
  }
  const payload = { kind: "trips-backup", at: new Date().toISOString(), local, drafts };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `trips-backup-${localDateStr(new Date())}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function edImportBackup(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (data.kind === "trips-backup") {
    storeSet(edLocalKey(), data.local || []);
    for (const [id, d] of Object.entries(data.drafts || {})) storeSet(edDraftKey(id), d);
    return Object.keys(data.drafts || {}).length;
  }
  // קובץ טיול בודד
  if (data.schemaVersion && data.days) {
    storeSet(edDraftKey(data.id), { trip: data, meta: { savedAt: Date.now(), trash: [] } });
    edMarkLocal({ ...data, localOnly: true });
    return 1;
  }
  throw new Error("קובץ לא מוכר");
}

/* ============================================================
   ממשק העורך
   מסך מלא מעל האפליקציה. נפתח מגיליון הטיולים, ונסגר בחזרה אליו.
   ============================================================ */

function edHost() {
  let el = $("#editor");
  if (!el) {
    el = document.createElement("div");
    el.id = "editor";
    el.className = "editor";
    document.body.appendChild(el);
    el.addEventListener("click", edOnClick);
    el.addEventListener("input", edOnInput);
    el.addEventListener("change", edOnInput);
  }
  return el;
}

async function edOpenTrip(id) {
  const draft = edReadDraft(id);
  if (draft) {
    ED.trip = draft.trip;
    ED.meta = draft.meta || { savedAt: draft.trip ? Date.now() : 0, trash: [] };
  } else {
    const published = await fetchJSON(`trips/${id}/trip.json`);
    ED.trip = published;
    ED.meta = { savedAt: 0, trash: [] };
  }
  if (!ED.meta.trash) ED.meta.trash = [];
  ED.dirty = !!draft;
  ED.open = true;
  ED.form = null;
  closeTripSheet();
  edRender();
}

function edClose() {
  ED.open = false;
  ED.form = null;
  edHost().innerHTML = "";
  edHost().classList.remove("on");
  // מה שנערך צריך להופיע מיד באפליקציה עצמה.
  if (ED.trip) reloadActiveTrip(ED.trip.id);
}

function edSavedLabel() {
  if (!ED.meta.savedAt) return "לא נשמרו שינויים";
  const mins = Math.floor((Date.now() - ED.meta.savedAt) / 60000);
  if (mins < 1) return "נשמר לפני רגע";
  if (mins < 60) return `נשמר לפני ${mins} דק׳`;
  return "נשמר מוקדם יותר";
}

function edDayLabel(date) {
  return `${hebWeekday(date)}, ${dayMonth(date)}`;
}

function edBlockRowHTML(day, b, i) {
  const time = timeLabel(b) || "ללא שעה";
  const auto = b.drive && b.drive.auto;
  return `
    <div class="ed-row" data-edit-block="${day.date}:${i}">
      <span class="ed-row-main">
        <span class="ed-row-title">${escapeHTML(b.title || "ללא שם")}</span>
        <span class="ed-row-sub">${escapeHTML(time)}${b.drive ? ` · ${escapeHTML(b.drive.time)}${auto ? " (הערכה)" : ""}` : ""}</span>
      </span>
      <span class="ed-row-icons">
        ${b.image ? ICON.camera : ""}
        ${b.area && ED.trip.podcasts[b.area] ? ICON.headphones : ""}
        <button class="ed-del" data-del-block="${day.date}:${i}" aria-label="מחיקת פעילות">${ICON.trash}</button>
      </span>
    </div>
  `;
}

function edDayHTML(day, n) {
  return `
    <section class="ed-day">
      <header class="ed-day-head">
        <span class="ed-day-n">יום ${n}</span>
        <span class="ed-day-date">${edDayLabel(day.date)}</span>
      </header>
      <input class="ed-day-title" data-day-title="${day.date}" value="${escapeHTML(day.title || "")}" placeholder="כותרת היום — למשל: סיינה">
      ${day.blocks.length ? day.blocks.map((b, i) => edBlockRowHTML(day, b, i)).join("") : `<p class="ed-empty">אין עדיין פעילויות ביום הזה.</p>`}
      <button class="ed-add" data-add-block="${day.date}">${ICON.plus} פעילות ליום הזה</button>
    </section>
  `;
}

function edRender() {
  const host = edHost();
  host.classList.add("on");

  if (ED.newTrip) { host.innerHTML = edNewTripHTML(); return; }
  if (ED.form) { host.innerHTML = edFormHTML(); edAfterFormRender(); return; }

  const trash = ED.meta.trash.length;
  const hist = storeGet(edHistoryKey(ED.trip.id), []).length;

  host.innerHTML = `
    <header class="ed-top">
      <button class="ed-back" data-close-editor>${ICON.chevron} סיום</button>
      <strong>${escapeHTML(ED.trip.title)}</strong>
      <button class="ed-publish" data-publish>פרסום</button>
    </header>

    <div class="ed-body">
      <div class="ed-banner ${ED.dirty ? "on" : ""}">
        <span>${ED.dirty ? "טיוטה שלא פורסמה" : "אין שינויים מקומיים"}</span>
        <span class="ed-banner-time">${escapeHTML(edSavedLabel())}</span>
      </div>

      <div class="ed-tools">
        <button data-history ${hist ? "" : "disabled"}>${ICON.refresh} ${hist} גרסאות</button>
        <button data-trash ${trash ? "" : "disabled"}>${ICON.trash} סל: ${trash}</button>
        <button data-backup>${ICON.download} גיבוי</button>
      </div>

      ${ED.trip.days.map((d, i) => edDayHTML(d, i + 1)).join("")}

      <div class="ed-danger">
        <button data-discard>השלכת כל השינויים המקומיים</button>
      </div>
    </div>

    ${ED.undo ? `<div class="ed-undo"><span>הפעילות נמחקה</span><button data-undo>ביטול</button></div>` : ""}
  `;
}

/* ---------- טופס פעילות (הוספה ועריכה — אותו מסך) ---------- */

function edEmptyBlock(dayDate) {
  return { start: "", end: "", approx: true, title: "", desc: "", address: "", coords: null, _day: dayDate };
}

function edOpenForm(dayDate, index) {
  const day = ED.trip.days.find(d => d.date === dayDate);
  const block = index == null ? edEmptyBlock(dayDate) : edClone(day.blocks[index]);
  block._day = dayDate;
  ED.form = { dayDate, index, block, results: null, busy: false, photos: null, wiki: null, wikiDismissed: false, query: "" };
  edRender();
}

function edDayOptionsHTML(selected) {
  return ED.trip.days.map((d, i) =>
    `<option value="${d.date}" ${d.date === selected ? "selected" : ""}>יום ${i + 1} · ${escapeHTML(edDayLabel(d.date))}</option>`
  ).join("");
}

function edAreaOptionsHTML(selected) {
  const areas = Object.keys(ED.trip.podcasts || {});
  return `<option value="">— בלי פרק —</option>` + areas.map(a =>
    `<option value="${escapeHTML(a)}" ${a === selected ? "selected" : ""}>${escapeHTML(ED.trip.podcasts[a].title || a)}</option>`
  ).join("");
}

// כמה פעילויות חולקות את אותו פרק — הפרק שייך לאזור, לא לפעילות בודדת.
function edAreaSiblings(area, exceptDay, exceptIndex) {
  const out = [];
  ED.trip.days.forEach(d => d.blocks.forEach((b, i) => {
    if (b.area === area && !(d.date === exceptDay && i === exceptIndex)) out.push(b.title || "ללא שם");
  }));
  return out;
}

function edFormHTML() {
  const f = ED.form;
  const b = f.block;
  const isNew = f.index == null;
  const siblings = b.area ? edAreaSiblings(b.area, f.dayDate, f.index) : [];

  return `
    <header class="ed-top">
      <button class="ed-back" data-form-cancel>${ICON.chevron} ביטול</button>
      <strong>${isNew ? "פעילות חדשה" : "עריכת פעילות"}</strong>
      <button class="ed-publish" data-form-save>שמירה</button>
    </header>

    <div class="ed-body">
      <div class="ed-field-row">
        <label class="ed-field ed-flex2">
          <span>יום</span>
          <select data-field="_day">${edDayOptionsHTML(b._day)}</select>
        </label>
        <label class="ed-field">
          <span>משעה</span>
          <input data-field="start" value="${escapeHTML(b.start || "")}" placeholder="09:30" inputmode="numeric">
        </label>
        <label class="ed-field">
          <span>עד</span>
          <input data-field="end" value="${escapeHTML(b.end || "")}" placeholder="12:00" inputmode="numeric">
        </label>
      </div>
      <p class="ed-hint">שינוי היום כאן מעביר את הפעילות — זמני הנסיעה יחושבו מחדש בשני הימים.</p>

      <label class="ed-field">
        <span>חיפוש מקום</span>
        <input data-lookup value="${escapeHTML(f.query)}" placeholder="שם מקום או כתובת">
      </label>
      <button class="ed-add" data-do-lookup ${f.busy ? "disabled" : ""}>
        ${ICON.target} ${f.busy ? "מחפש…" : "חיפוש והשלמה אוטומטית"}
      </button>
      ${edResultsHTML()}

      <label class="ed-field">
        <span>שם הפעילות</span>
        <input data-field="title" value="${escapeHTML(b.title || "")}" placeholder="מפלי טריברג">
      </label>

      <label class="ed-field">
        <span>תיאור</span>
        <textarea data-field="desc" rows="4" placeholder="מה עושים שם">${escapeHTML(b.desc || "")}</textarea>
      </label>
      ${edWikiOfferHTML()}

      <label class="ed-field">
        <span>כתובת</span>
        <input data-field="address" value="${escapeHTML(b.address || "")}" placeholder="רחוב, עיר, מדינה">
      </label>
      ${edDerivedHTML(b)}

      ${edPhotoHTML(b)}

      <div class="ed-field-row">
        <label class="ed-field"><span>מחיר</span><input data-field="price" value="${escapeHTML(b.price || "")}" placeholder="מבוגר 12€"></label>
        <label class="ed-field"><span>שעות</span><input data-field="hours" value="${escapeHTML(b.hours || "")}" placeholder="09:00–18:00"></label>
      </div>
      <label class="ed-field">
        <span>קישור למידע</span>
        <input data-field="infoUrl" value="${escapeHTML(b.infoUrl || "")}" placeholder="https://">
      </label>

      <label class="ed-field">
        <span>פרק פודקאסט</span>
        <select data-field="area">${edAreaOptionsHTML(b.area)}</select>
      </label>
      ${siblings.length ? `<div class="ed-warn">${ICON.warn} הפרק משותף גם ל: ${escapeHTML(siblings.join(", "))} — החלפה תשנה אותו גם עבורן.</div>` : ""}

      ${isNew ? "" : `<div class="ed-danger"><button data-form-delete>מחיקת הפעילות</button></div>`}
    </div>
  `;
}

/* הצעת ויקיפדיה. תמיד הצעה ולעולם לא מילוי שקט: שם הכתבה מוצג, כדי
   שהתאמה שגויה תהיה מיד גלויה, וטקסט בשפה זרה מסומן ככזה. */
function edWikiOfferHTML() {
  const w = ED.form.wiki;
  if (!w || ED.form.wikiDismissed) return "";
  const langName = w.lang === "he" ? "" : w.lang === "de" ? " (בגרמנית)" : " (באנגלית)";
  return `
    <div class="ed-ref">
      <span class="ed-ref-tag">מוויקיפדיה — הכתבה "${escapeHTML(w.title)}"${langName}</span>
      <p>${escapeHTML(w.extract)}</p>
      <div class="ed-ref-actions">
        <button class="ed-link" data-wiki-use>${w.lang === "he" ? "שימוש כתיאור" : "העתקה לתיאור לתרגום"}</button>
        <button class="ed-link" data-wiki-skip>לא קשור</button>
      </div>
    </div>`;
}

function edResultsHTML() {
  const f = ED.form;
  if (!f.results) return "";
  if (!f.results.length) return `<p class="ed-hint">לא נמצאו תוצאות. אפשר למלא את השדות ידנית.</p>`;
  return `<div class="ed-results">${f.results.map((r, i) => `
    <button class="ed-result" data-pick="${i}">
      <span class="ed-result-name">${escapeHTML(r.name)}</span>
      <span class="ed-result-detail">${escapeHTML(r.detail || "")} · ${escapeHTML(r.source)}</span>
    </button>`).join("")}</div>`;
}

// מה שהאפליקציה תפיק לבד ברגע שיש כתובת וקואורדינטות.
function edDerivedHTML(b) {
  if (!b.coords) return `<p class="ed-hint">בלי קואורדינטות לא תהיה תחזית לפעילות הזאת.</p>`;
  const prev = edPrevStop();
  const leg = prev ? estimateDrive(prev.coords, b.coords, prev.label) : null;
  return `
    <div class="ed-derived">
      <span class="ed-tag ok">${ICON.cloud} תחזית פעילה</span>
      ${b.address ? `<span class="ed-tag ok">${ICON.pin} Maps · Waze</span>` : ""}
      ${leg ? `<span class="ed-tag est">${ICON.car} ${escapeHTML(leg.time)} · הערכה</span>` : ""}
      <span class="ed-tag plain">${b.coords.lat.toFixed(3)}, ${b.coords.lng.toFixed(3)}${b.coords.elev != null ? ` · ${b.coords.elev} מ׳` : ""}</span>
    </div>
  `;
}

// התחנה שלפני הפעילות ביום שנבחר — בסיס ההערכה של זמן הנסיעה.
function edPrevStop() {
  const f = ED.form;
  const day = ED.trip.days.find(d => d.date === f.block._day);
  if (!day) return null;
  const stops = day.blocks.filter((b, i) => b.coords && i !== f.index);
  const last = stops[stops.length - 1];
  return last
    ? { coords: last.coords, label: `מ-${last.title}` }
    : { coords: ED.trip.base.coords, label: `מ${ED.trip.base.name ? "-" + ED.trip.base.name : "הבסיס"}` };
}

function edPhotoHTML(b) {
  const f = ED.form;
  if (b.image) {
    return `
      <div class="ed-field"><span>תמונה</span></div>
      <div class="ed-photo-current">
        <img src="${escapeHTML(b.image.thumb || tripAsset(b.image.file))}" alt="">
        <div>
          <p class="ed-hint">${escapeHTML(b.image.credit)} · ${escapeHTML(b.image.license)}</p>
          <button class="ed-link" data-photo-clear>הסרה</button>
          <button class="ed-link" data-photo-pick>החלפה</button>
        </div>
      </div>`;
  }
  if (f.photos && f.photos.length) {
    return `
      <div class="ed-field"><span>תמונה מוויקישיתוף</span></div>
      <div class="ed-photos">${f.photos.map((p, i) =>
        `<button class="ed-photo" data-photo="${i}"><img src="${escapeHTML(p.thumb)}" alt="" loading="lazy"></button>`).join("")}</div>`;
  }
  if (f.photos) return `<p class="ed-hint">לא נמצאו תמונות חופשיות סביב הנקודה הזאת.</p>`;
  return b.coords ? `<button class="ed-add" data-photo-pick>${ICON.camera} חיפוש תמונה</button>` : "";
}

function edAfterFormRender() {
  const el = $("[data-lookup]", edHost());
  if (el && ED.form.focusLookup) { el.focus(); ED.form.focusLookup = false; }
}

/* ---------- אירועים ---------- */

function edOnInput(e) {
  const host = edHost();
  const dayTitle = e.target.closest("[data-day-title]");
  if (dayTitle) {
    const day = ED.trip.days.find(d => d.date === dayTitle.dataset.dayTitle);
    day.title = dayTitle.value;
    edSaveDraft({ snapshot: false });
    return;
  }
  if (e.target.matches("[data-lookup]")) { ED.form.query = e.target.value; return; }

  const nt = e.target.closest("[data-new]");
  if (nt && ED.newTrip) {
    ED.newTrip[nt.dataset.new] = e.target.value;
    if (nt.dataset.new === "id") ED.newTrip.idTouched = true;
    // כל עוד לא נגעו במזהה ידנית הוא ממשיך להיגזר מהשם.
    if (nt.dataset.new === "title" && !ED.newTrip.idTouched) ED.newTrip.id = edSlug(e.target.value);
    // התאריכים והשם משנים את מצב כפתור "יצירה", אז צריך רינדור מחדש —
    // אבל לא בזמן הקלדה בשדות טקסט, כדי לא לאבד את מיקום הסמן.
    if (e.type === "change" || nt.type === "date") edRender();
    return;
  }

  const field = e.target.closest("[data-field]");
  if (field && ED.form) {
    // נשמר באובייקט הטופס בלבד; לטיול עצמו זה נכנס רק ב"שמירה".
    ED.form.block[field.dataset.field] = e.target.value;
    return;
  }
}

async function edOnClick(e) {
  const hit = sel => e.target.closest(sel);

  if (hit("[data-close-editor]")) { edClose(); return; }
  if (hit("[data-new-cancel]")) { ED.newTrip = null; edClose(); return; }
  if (hit("[data-new-lookup]")) { await edNewTripLookup(); return; }
  const npick = hit("[data-new-pick]");
  if (npick) { await edNewTripPick(Number(npick.dataset.newPick)); return; }
  if (hit("[data-new-create]")) { edNewTripCreate(); return; }
  if (hit("[data-undo]")) { edUndoLast(); return; }
  if (hit("[data-backup]")) { edExportBackup(); return; }

  if (hit("[data-discard]")) {
    if (!confirm("להשליך את כל השינויים המקומיים בטיול הזה ולחזור למה שפורסם?")) return;
    edDiscardDraft(ED.trip.id);
    edClose();
    location.reload();
    return;
  }

  if (hit("[data-history]")) {
    const hist = storeGet(edHistoryKey(ED.trip.id), []);
    const pick = prompt("שחזור גרסה — מספר מהרשימה:\n" +
      hist.map((h, i) => `${i + 1}. ${new Date(h.at).toLocaleString("he-IL")}`).join("\n"));
    const n = Number(pick);
    if (n >= 1 && n <= hist.length) edRestoreSnapshot(n - 1);
    return;
  }

  if (hit("[data-trash]")) {
    alert("בסל:\n" + ED.meta.trash.map(t => `· ${t.payload.title || "ללא שם"}`).join("\n") +
      "\n\nהפריטים האלה יימחקו לצמיתות רק בפרסום.");
    return;
  }

  const add = hit("[data-add-block]");
  if (add) { edOpenForm(add.dataset.addBlock, null); return; }

  const edit = hit("[data-edit-block]");
  if (edit && !hit("[data-del-block]")) {
    const [date, i] = edit.dataset.editBlock.split(":");
    edOpenForm(date, Number(i));
    return;
  }

  const del = hit("[data-del-block]");
  if (del) {
    const [date, i] = del.dataset.delBlock.split(":");
    edDeleteBlock(date, Number(i));
    return;
  }

  if (hit("[data-form-cancel]")) { ED.form = null; edRender(); return; }
  if (hit("[data-form-save]")) { edSaveForm(); return; }
  if (hit("[data-form-delete]")) {
    edDeleteBlock(ED.form.dayDate, ED.form.index);
    ED.form = null;
    edRender();
    return;
  }

  if (hit("[data-do-lookup]")) { await edRunLookup(); return; }

  const pick = hit("[data-pick]");
  if (pick) { await edApplyResult(ED.form.results[Number(pick.dataset.pick)]); return; }

  if (hit("[data-wiki-use]")) {
    const w = ED.form.wiki;
    ED.form.block.desc = w.extract;
    if (!ED.form.block.infoUrl && w.url) ED.form.block.infoUrl = w.url;
    ED.form.wikiDismissed = true;
    edRender();
    return;
  }
  if (hit("[data-wiki-skip]")) { ED.form.wikiDismissed = true; edRender(); return; }

  if (hit("[data-photo-pick]")) { await edLoadPhotos(); return; }
  if (hit("[data-photo-clear]")) { delete ED.form.block.image; edRender(); return; }

  const photo = hit("[data-photo]");
  if (photo) {
    const p = ED.form.photos[Number(photo.dataset.photo)];
    // file נקבע סופית בפרסום, כשהתמונה באמת נכתבת לתיקיית הטיול.
    ED.form.block.image = {
      file: `images/${edSlug(p.commonsFile.replace(/\.[^.]+$/, ""))}.jpg`,
      thumb: p.thumb,
      credit: p.credit,
      license: p.license,
      commonsFile: p.commonsFile,
      pending: true
    };
    ED.form.photos = null;
    edRender();
    return;
  }

  if (hit("[data-publish]")) { edPublish(); return; }
}

/* ---------- חיפוש והשלמה ---------- */

async function edRunLookup() {
  const f = ED.form;
  if (!f.query.trim()) return;
  f.busy = true; edRender();
  f.results = await edGeocode(f.query);
  f.busy = false;
  edRender();
}

async function edApplyResult(r) {
  const f = ED.form;
  const b = f.block;
  f.busy = true; f.results = null; edRender();

  b.coords = { ...r.coords };
  if (b.coords.elev == null) b.coords.elev = await edElevation(b.coords);
  if (!b.address) b.address = r.address;
  b.wxPlace = r.detail ? `${r.name}, ${r.detail}` : r.name;

  // השם מגיע מהמקום שחיפשתם, לא מוויקיפדיה: geosearch מחזיר את הערך
  // הגיאוגרפי הקרוב ביותר, וזה לא בהכרח המקום עצמו — חיפוש של פיאצה דל
  // קמפו מחזיר את "פאליו", מרוץ הסוסים שנערך בה. לכן הערך מוצע בנפרד,
  // עם שם הכתבה גלוי, ונכנס לתיאור רק בלחיצה.
  if (!b.title) b.title = r.name;
  f.wiki = await edWikiNearby(b.coords);

  f.photos = await edCommonsPhotos(b.coords);
  f.busy = false;
  edRender();
}

async function edLoadPhotos() {
  const f = ED.form;
  if (!f.block.coords) return;
  f.busy = true; edRender();
  f.photos = await edCommonsPhotos(f.block.coords);
  f.busy = false;
  edRender();
}

/* ---------- שמירה ומחיקה של פעילות ---------- */

function edSaveForm() {
  const f = ED.form;
  const b = edClone(f.block);
  const targetDate = b._day;
  delete b._day;

  if (!b.title.trim()) { alert("צריך שם לפעילות."); return; }
  for (const k of ["price", "hours", "infoUrl", "area", "address", "desc"]) {
    if (b[k] === "") delete b[k];
  }
  if (!b.end) delete b.end;
  if (!b.start) delete b.start;

  // הסרה מהיום הישן והוספה ליום שנבחר — זה גם המנגנון של "העברה ליום אחר".
  if (f.index != null) {
    const from = ED.trip.days.find(d => d.date === f.dayDate);
    from.blocks.splice(f.index, 1);
    edRecalcDay(from);
  }
  const to = ED.trip.days.find(d => d.date === targetDate);
  to.blocks.push(b);
  to.blocks.sort((x, y) => (toMinutes(x.start) ?? 9999) - (toMinutes(y.start) ?? 9999));
  edRecalcDay(to);

  ED.form = null;
  edSaveDraft();
  edRender();
}

function edDeleteBlock(date, index) {
  const day = ED.trip.days.find(d => d.date === date);
  const removed = day.blocks[index];
  if (!removed) return;
  day.blocks.splice(index, 1);
  edRecalcDay(day);
  edTrashPush("block", { ...removed, _day: date });
  edShowUndo("הפעילות נמחקה", () => {
    day.blocks.splice(index, 0, removed);
    edRecalcDay(day);
  });
  edSaveDraft();
  edRender();
}

/* ---------- טיול חדש ---------- */

function edNewTrip() {
  const today = localDateStr(new Date());
  ED.newTrip = { title: "", id: "", idTouched: false, start: today, end: today, baseName: "", baseQuery: "", results: null, busy: false, base: null };
  ED.trip = null;
  ED.form = null;
  ED.open = true;
  closeTripSheet();
  edRender();
}

function edNewTripHTML() {
  const n = ED.newTrip;
  const ready = n.title.trim() && /^\d{4}-\d{2}-\d{2}$/.test(n.start) && /^\d{4}-\d{2}-\d{2}$/.test(n.end) && n.end >= n.start;
  const nights = ready ? edDatesBetween(n.start, n.end).length : 0;
  return `
    <header class="ed-top">
      <button class="ed-back" data-new-cancel>${ICON.chevron} ביטול</button>
      <strong>טיול חדש</strong>
      <button class="ed-publish" data-new-create ${ready ? "" : "disabled"}>יצירה</button>
    </header>

    <div class="ed-body">
      <label class="ed-field">
        <span>שם הטיול</span>
        <input data-new="title" value="${escapeHTML(n.title)}" placeholder="טוסקנה">
      </label>

      <label class="ed-field">
        <span>מזהה (שם התיקייה בכתובת)</span>
        <input data-new="id" value="${escapeHTML(n.id || edSlug(n.title))}" placeholder="tuscany" dir="ltr">
      </label>
      <p class="ed-hint">אותיות לטיניות בלבד — זה הופך ל-trips/${escapeHTML(edSlug(n.id || n.title))}/ ולכתובת של התמונות והפרקים. אפשר לשנות עכשיו, קשה לשנות אחר כך.</p>

      <div class="ed-field-row">
        <label class="ed-field"><span>מתאריך</span><input type="date" data-new="start" value="${escapeHTML(n.start)}"></label>
        <label class="ed-field"><span>עד תאריך</span><input type="date" data-new="end" value="${escapeHTML(n.end)}"></label>
      </div>
      ${ready
        ? `<p class="ed-hint">${nights} ימים · ${escapeHTML(edSubtitleFor(n.start, n.end))}</p>`
        : `<p class="ed-hint">צריך שם ותאריכים תקינים (תאריך הסיום לא לפני ההתחלה).</p>`}

      <label class="ed-field">
        <span>איפה ישנים</span>
        <input data-new="baseName" value="${escapeHTML(n.baseName)}" placeholder="שם המלון או הדירה">
      </label>

      <label class="ed-field">
        <span>כתובת מקום הלינה</span>
        <input data-new="baseQuery" value="${escapeHTML(n.baseQuery)}" placeholder="רחוב, עיר, מדינה">
      </label>
      <button class="ed-add" data-new-lookup ${n.busy ? "disabled" : ""}>
        ${ICON.target} ${n.busy ? "מחפש…" : "איתור הכתובת"}
      </button>

      ${n.results ? (n.results.length
        ? `<div class="ed-results">${n.results.map((r, i) => `
            <button class="ed-result" data-new-pick="${i}">
              <span class="ed-result-name">${escapeHTML(r.name)}</span>
              <span class="ed-result-detail">${escapeHTML(r.detail || "")} · ${escapeHTML(r.source)}</span>
            </button>`).join("")}</div>`
        : `<p class="ed-hint">לא נמצאה כתובת כזאת. אפשר ליצור בלי — אבל בלי קואורדינטות אין זמני נסיעה מוערכים ואין תחזית לבסיס.</p>`) : ""}

      ${n.base ? `<div class="ed-derived">
        <span class="ed-tag ok">${ICON.pin} ${escapeHTML(n.base.address)}</span>
        <span class="ed-tag plain">${n.base.coords.lat.toFixed(3)}, ${n.base.coords.lng.toFixed(3)}${n.base.coords.elev != null ? ` · ${n.base.coords.elev} מ׳` : ""}</span>
      </div>` : ""}

      <p class="ed-hint">הטיול ייווצר עם יום ריק לכל תאריך. משם מוסיפים פעילויות.</p>
    </div>
  `;
}

async function edNewTripLookup() {
  const n = ED.newTrip;
  if (!n.baseQuery.trim()) return;
  n.busy = true; edRender();
  n.results = await edGeocode(n.baseQuery);
  n.busy = false;
  edRender();
}

async function edNewTripPick(i) {
  const n = ED.newTrip;
  const r = n.results[i];
  n.busy = true; n.results = null; edRender();
  const coords = { ...r.coords };
  if (coords.elev == null) coords.elev = await edElevation(coords);
  n.base = { address: r.address, coords };
  n.busy = false;
  edRender();
}

function edNewTripCreate() {
  const n = ED.newTrip;
  const trip = edCreateTrip({
    title: n.title,
    id: n.id || n.title,
    start: n.start,
    end: n.end,
    baseName: n.baseName || n.title,
    baseAddress: n.base ? n.base.address : n.baseQuery,
    baseCoords: n.base ? n.base.coords : null
  });
  ED.newTrip = null;
  ED.trip = trip;
  ED.meta = { savedAt: 0, trash: [] };
  edSaveDraft();
  TRIP_INDEX = edMergeIndex(TRIP_INDEX.filter(t => !t.localOnly));
  edRender();
}

function edPublish() {
  alert("פרסום ל-Pull Request עוד לא מחובר.\n\nבינתיים: \"גיבוי\" מוריד את הטיול כקובץ JSON,\nוהוא נשמר במכשיר גם בלי פרסום.");
}
