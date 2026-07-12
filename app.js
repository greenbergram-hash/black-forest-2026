/* ============================================================
   Black Forest 2026 — trip data
   Everything hardcoded, no network calls needed after first load.
   ============================================================ */

const TRIP = {
  start: "2026-08-17",
  end: "2026-08-24",
  hotel: {
    name: "Hotel Schlehdorn",
    address: "Am Sommerberg 1, 79868 Feldberg (Schwarzwald)-Altglashütten, Germany"
  },
  flightIn: { city: "Zürich", date: "2026-08-17", time: "12:30", note: "Drive to hotel: ~1h15–1h30" },
  flightOut: { city: "Zürich", date: "2026-08-24", time: "22:00", note: "Confirm exact time against your actual ticket" }
};

// Pre-trip checklist — persisted with localStorage so ticks stick on-device.
const CHECKLIST = [
  "Book Rulantica tickets in advance — fills up almost every day",
  "Book Europa-Park tickets in advance (linked to a specific date, can't change) — buying at the gate costs 10€ more/person",
  "Download the Europa-Park app, mark favorites, plan Virtual Line (VL) for key rides",
  "Book Lindt chocolate workshop in advance, if doing it on the last day",
  "Book Lindt Home of Chocolate museum ticket + time slot in advance (very high demand)",
  "Bring towels from the hotel for Rulantica (or plan to rent there)",
  "Pack closed shoes / water sandals for the Gutach sensory trail (mud, stones, streams)",
  "Plan Sunday's meals ahead — many restaurants in Germany are closed on Sundays"
];

const GENERAL_TIPS = [
  "Many restaurants in Germany close on Sundays — plan Sunday (23 Aug) meals ahead.",
  "The FIFA Museum in Zürich is closed on Mondays — since 24 Aug is a Monday, it's Lindt or nothing that day.",
  "Towns/trails with stream crossings (Gutach) — bring water shoes or sandals."
];

function mapLink(address) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
}

/* Each day: blocks are chronological. start/end are 24h "HH:MM" local time.
   approx:true means the doc didn't give an exact time — it's a sensible estimate,
   shown with a "~" so nobody mistakes it for a booked time. */
const DAYS = [
  {
    date: "2026-08-17",
    title: "Arrival",
    place: "Zürich → Hotel Schlehdorn",
    driveNote: "Land 12:30, ~1h15–1h30 drive to the hotel",
    blocks: [
      {
        start: "12:30", end: "14:00", approx: false,
        title: "Land in Zürich",
        desc: "Drive from the airport to the hotel, roughly 1h15–1h30.",
      },
      {
        start: "14:30", end: "18:00", approx: true,
        title: "Pandorena, or just rest",
        desc: "Trampolines, ropes course, climbing wall — 15 min from the hotel. Or skip it and just settle in after a travel day.",
        address: "Pandorena, Feldberg (Schwarzwald)",
        tips: [{ text: "First day — no shame in doing nothing but unpacking." }]
      }
    ]
  },
  {
    date: "2026-08-18",
    title: "Titisee",
    place: "Titisee-Neustadt",
    driveNote: "~20 min drive from the hotel",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "Ravenna Gorge (Ravennaschlucht)",
        desc: "Start at Hofgut Sternen — worth seeing before the trail: the Ravenna Viaduct (37m stone railway bridge you walk under), a giant cuckoo clock that opens on the hour, and a cuckoo-clock shop with glass-blowing. The gorge trail itself is shaded, narrow, with small waterfalls — anywhere from 30 min to ~3 hours depending on pace.",
        tips: [{ text: "Flexible length — good for a tired-legs day, just turn back early." }]
      },
      {
        start: "12:00", end: "13:30", approx: true,
        title: "Titisee lake",
        desc: "The most famous touristy lake in the Black Forest — paddle/electric boats, lakeside promenade, ice cream.",
        tips: [{ text: "Pretty, but a tourist trap — 1–2 hours is plenty, don't linger.", warn: false }]
      },
      {
        start: "14:00", end: "18:00", approx: true,
        title: "Badeparadies Schwarzwald",
        desc: "Best water park in the area. Galaxy area has dozens of slides, good for kids and teens; there's a spa zone for adults too. 4 hours is enough — open until 22:00.",
        address: "Am Badeparadies 1, 79822 Titisee-Neustadt",
        price: "~22€ (4hr) / ~30€ (day) per person",
        hours: "9:00–22:00 daily (incl. Tue) in summer holidays",
        tips: [
          { text: "Must book online in advance, including seat/sunbed assignment — no walk-up entry at the box office.", warn: true }
        ]
      }
    ]
  },
  {
    date: "2026-08-19",
    title: "Europa-Park",
    place: "Rust",
    driveNote: "~1h10–1h20 drive from the hotel",
    blocks: [
      {
        start: "09:00", end: "18:00", approx: false,
        title: "Full day at Europa-Park",
        desc: "Wednesday was picked on purpose — along with Friday, it's the least crowded day (weekends are worst). Arrive right at opening.",
        address: "Europa-Park-Straße 2, 77977 Rust",
        price: "~34–38€/day (2026 est., varies by date)",
        hours: "9:00–18:00 (at least, in summer)",
        tips: [
          { text: "Ticket is locked to this specific date — buying at the gate (if space left) costs 10€ more per person, and peak days sell out.", warn: true },
          { text: "Download the app ahead of time, mark favorites, and book Virtual Line (VL) for key rides." }
        ]
      },
      {
        start: null, end: null, approx: true,
        title: "Must-ride coasters",
        desc: "Voltron · Blue Fire · Wodan · Silver Star"
      },
      {
        start: null, end: null, approx: true,
        title: "Also worth it",
        desc: "Voletarium (flight simulator, near entrance), Cancan, Pegasus, Euro-Mir, Fjord (family raft ride), Pirates in Batavia (boat ride), Arthur."
      }
    ]
  },
  {
    date: "2026-08-20",
    title: "Freiburg + Todtnau",
    place: "Freiburg (morning) · Todtnau (afternoon)",
    driveNote: "Freiburg ~45 min from hotel · Todtnau ~20 min from Freiburg",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "Freiburg — Münstermarkt",
        desc: "Cathedral market at Münsterplatz — runs every morning except Sunday. North side: farmers' market (local produce, berries, honey, flowers). South side: spices, wooden crafts, souvenirs, street food. Then a walk around the Münster square and the Bächle water channels; shopping on Kaiser-Joseph-Straße (\"Ka-Jo\") if there's time.",
        tips: [{ text: "Do Freiburg in the morning — the market doesn't run in the afternoon, and it's closed Sundays anyway." }]
      },
      {
        start: "13:00", end: "17:00", approx: true,
        title: "Todtnau Falls + hanging bridge",
        desc: "Two entrances: the LOWER one (recommended with small kids) is off road L126 — an easy, gentle \"red trail\", ~10 min to the main waterfall, simple there-and-back. The UPPER entrance, near Todtnauberg, reaches the hanging bridge but is a steep descent to the falls — the climb back up can be tough for little legs. Tip with two cars: leave one below, drive everyone up, and walk the whole route downhill only. The Blackforestline hanging bridge has its own separate entrance — panoramic views, adrenaline rush.",
        address: "Außer Ort 38, 79674 Todtnauberg",
        price: "Combo ticket (bridge + falls): ~12€ adult, ~9€ child",
        hours: "8:00–20:30 in summer, last entry 19:00. Staffed ticket counter/discounts only 10:00–16:00 — outside that, machines only, no discounts.",
      }
    ]
  },
  {
    date: "2026-08-21",
    title: "Rulantica",
    place: "Rust",
    driveNote: "Same area as Europa-Park",
    blocks: [
      {
        start: "10:00", end: "18:00", approx: true,
        title: "Rulantica water park",
        desc: "Friday was picked on purpose, like Wednesday — one of the least crowded days. Separate ticket from Europa-Park.",
        hours: "Usually 09:30/10:00–22:00 (check official site for the exact date)",
        price: "Day: child ~38–54€, adult ~41–54€ · \"Moonlight\" (19:00–22:00) cheapest, child ~28–34€ · under 4 free · 0–3 free",
        tips: [
          { text: "Book tickets in advance — the park fills up almost every day.", warn: true },
          { text: "Lockers are free via the Rula-Band wristband, which also works for in-park payment." },
          { text: "Parking is paid — pay ahead via the website/app." },
          { text: "No glass bottles or big coolers; water, reusable bottles, and light snacks are fine." },
          { text: "Bring towels from the hotel, or rent on site." },
          { text: "Water temp is 30–32°C." },
          { text: "Kids up to 12 get in free on their actual birthday (bring ID)." }
        ]
      }
    ]
  },
  {
    date: "2026-08-22",
    title: "Triberg + Gutach",
    place: "Triberg · Gutach",
    driveNote: "~55–60 min drive from the hotel",
    blocks: [
      {
        start: "09:30", end: "12:00", approx: true,
        title: "Triberg",
        desc: "Triberg Falls — the most famous in the Black Forest — plus giant cuckoo clocks and a classic town center.",
        price: "Falls entry: adult 7–8€, family ticket ~20€, kids under 6 free (usually cash only). Same ticket also covers the Schwarzwaldmuseum and Triberg-Land.",
        hours: "Ticket booth staffed ~9:00–19:00",
        tips: [{ text: "Outside booth hours (early morning or evening), entry to the falls is free — and less crowded too." }]
      },
      {
        start: "13:00", end: "16:00", approx: true,
        title: "Gutach — sensory trail",
        desc: "Circular trail, 1–3 hours depending on pace. Walking on grass, mud, stones and sand, mostly shaded, with touch/smell/sight stations. Worth doing even with older kids.",
        tips: [
          { text: "Bring water shoes/sandals for anyone who doesn't want to go barefoot on stones." },
          { text: "Bring water — it's not a short trail." },
          { text: "Greek restaurant \"Alexandros\" is 3 min away and recommended." }
        ]
      },
      {
        start: null, end: null, approx: true,
        title: "Optional: Sommerrodelbahn Gutach",
        desc: "Summer toboggan run, usually quieter than the one at Todtnau. Free entry, pay per ride.",
        hours: "From 10:00 (9:00 during summer holidays)",
        tips: [{ text: "Minimum age to ride alone is 8. Our 5-year-old can only ride as a passenger, seated with an adult on the same sled — not solo.", warn: true }]
      }
    ],
    dayNote: "Consider trimming this day — 3 stops plus ~2h of driving round-trip. If time's tight, an hour on the Gutach trail is enough."
  },
  {
    date: "2026-08-23",
    title: "Vogelpark Steinen",
    place: "Steinen (bird park)",
    driveNote: "A deliberately light day after six busy ones",
    blocks: [
      {
        start: "10:00", end: "17:00", approx: true,
        title: "Vogelpark Steinen (bird park)",
        desc: "Not too big, one of the nicer surprises of the trip. Bird-of-prey show at 11:00 and 15:00; monkeys roam free with feedings at 12:00 and 16:00 — there's a morning and an afternoon round, so plan around whatever's convenient.",
        price: "Adult 20€, child (4–11) 10€",
        hours: "10:00–18:00 in summer holidays",
      },
      {
        start: null, end: null, approx: true,
        title: "If there's energy left",
        desc: "Options: Vita Classica spa, Steinwasen Park (rides + animals), or Pandorena (trampolines/ropes/climbing, 15 min from hotel)."
      }
    ]
  },
  {
    date: "2026-08-24",
    title: "Rhine Falls + fly home",
    place: "Schaffhausen → Kilchberg → Zürich Airport",
    driveNote: "~55 min hotel→Schaffhausen, then ~30 min on to Zürich airport",
    blocks: [
      {
        start: "09:00", end: "12:00", approx: true,
        title: "Rhine Falls",
        desc: "The largest waterfall in Europe — genuinely impressive. The must-do is the boat out to the rock in the middle of the falls. There's a ropes park nearby, probably not for the little ones.",
        tips: [{ text: "The boat to the rock can be intense for a 5-year-old — worth checking with him before getting on. Parking near the falls is paid, a few CHF/hour." }]
      },
      {
        start: "12:30", end: "16:00", approx: true,
        title: "Lindt Home of Chocolate",
        desc: "Chocolate fountain, shop and café are open to everyone, even without a museum ticket.",
        address: "Schokoladenplatz 1, 8802 Kilchberg",
        tips: [
          { text: "FIFA Museum is closed on Mondays, and 24 Aug is a Monday — so today it's Lindt, no real choice.", warn: true },
          { text: "High demand — book museum ticket + time slot in advance." },
          { text: "If doing the chocolate-making workshop, that also needs advance booking." }
        ]
      },
      {
        start: "22:00", end: null, approx: false,
        title: "Flight home from Zürich",
        desc: "Confirm the exact time against the actual ticket closer to the date."
      }
    ]
  }
];

/* ============================================================
   Rendering helpers
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fmtTime(hhmm) {
  return hhmm || "";
}

function weekdayShort(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}
function weekdayLong(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long" });
}
function dayMonth(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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
  if (block.address) chips.push(`<a class="chip map" href="${mapLink(block.address)}" target="_blank" rel="noopener">📍 Map</a>`);
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

function blockRange(block, dayEndMinutes) {
  const s = toMinutes(block.start);
  const e = toMinutes(block.end);
  return { s, e };
}

/* ============================================================
   Itinerary view
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
            <span class="day-date">${weekdayShort(day.date)}, ${dayMonth(day.date)}${isToday ? '<span class="day-today-dot"></span>' : ""}</span>
            <span class="day-title">${escapeHTML(day.title)}</span>
          </span>
          <span class="day-chevron">▶</span>
        </summary>
        <div class="day-body">
          <div class="day-meta">${escapeHTML(day.place)} · ${escapeHTML(day.driveNote)}</div>
          ${day.dayNote ? `<div class="tip">💡 ${escapeHTML(day.dayNote)}</div>` : ""}
          ${blocksHTML}
        </div>
      </details>
    `;
  }).join("");

  $("#view-itinerary").innerHTML = `<h2 class="mini-list-title" style="margin-top:0">Full itinerary</h2>${html}`;
}

/* ============================================================
   Now view
   ============================================================ */

function renderNow() {
  const now = new Date();
  const todayStr = localDateStr(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const view = $("#view-now");

  if (todayStr < TRIP.start) {
    const daysToGo = Math.ceil((new Date(TRIP.start + "T00:00:00") - new Date(todayStr + "T00:00:00")) / 86400000);
    view.innerHTML = `
      <div class="countdown">
        <div class="num">${daysToGo}</div>
        <div class="label">day${daysToGo === 1 ? "" : "s"} until the Black Forest</div>
      </div>
      <div class="card">
        <strong>${TRIP.hotel.name}</strong><br>
        <span style="color:var(--ink-soft);font-size:14px">${escapeHTML(TRIP.hotel.address)}</span>
        <div class="chips"><a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">📍 Map</a></div>
      </div>
      <h2 class="mini-list-title">Before you go</h2>
      ${renderChecklistHTML()}
    `;
    bindChecklist();
    return;
  }

  if (todayStr > TRIP.end) {
    view.innerHTML = `
      <div class="countdown">
        <div class="num">🌲</div>
        <div class="label">Trip's done — hope it was a good one.</div>
      </div>
      <div class="empty-note">The full itinerary is still here under "Itinerary" if you want to look back.</div>
    `;
    return;
  }

  const dayIndex = DAYS.findIndex(d => d.date === todayStr);
  const day = DAYS[dayIndex];
  if (!day) {
    view.innerHTML = `<div class="empty-note">No plan found for today — check the Itinerary tab.</div>`;
    return;
  }

  // classify blocks as done / current / upcoming
  const timed = day.blocks.map((b, i) => {
    const s = toMinutes(b.start);
    let e = toMinutes(b.end);
    if (e == null) {
      // extend to next timed block's start, or end of day
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
    // find next upcoming
    const upcoming = timed.findIndex(t => t.s != null && t.s > nowMinutes);
    currentIdx = upcoming;
  }

  const dayNum = dayIndex + 1;
  let heroHTML = `
    <div class="hero">
      <p class="hero-eyebrow">Day ${dayNum} of ${DAYS.length} · ${weekdayLong(day.date)}, ${dayMonth(day.date)}</p>
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
        <div class="kicker"><span class="pulse"></span>${isNow ? "Right now" : "Up next"}${timeLabel(b) ? " · " + timeLabel(b) : ""}</div>
        <h2>${escapeHTML(b.title)}</h2>
        <p>${escapeHTML(b.desc)}</p>
        ${chipsHTML(b)}
        ${tipsHTML(b)}
      </div>
    `;
  } else {
    currentHTML = `
      <div class="now-current">
        <div class="kicker"><span class="pulse"></span>Free time</div>
        <h2>Nothing scheduled right now</h2>
        <p>Check "Later today" below, or just enjoy the downtime.</p>
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
    ${restHTML ? `<h2 class="mini-list-title">Rest of today</h2><div class="card">${restHTML}</div>` : ""}
    <div class="chips" style="margin-top:16px">
      <a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">📍 ${escapeHTML(TRIP.hotel.name)}</a>
    </div>
  `;
}

/* ============================================================
   Info view
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
      <h2>Hotel</h2>
      <div class="card">
        <div class="info-row"><span class="k">Name</span><span class="v">${escapeHTML(TRIP.hotel.name)}</span></div>
        <div class="info-row"><span class="k">Address</span><span class="v">${escapeHTML(TRIP.hotel.address)}</span></div>
        <div class="chips"><a class="chip map" href="${mapLink(TRIP.hotel.address)}" target="_blank" rel="noopener">📍 Open in Maps</a></div>
      </div>
    </div>

    <div class="info-section">
      <h2>Flights</h2>
      <div class="card">
        <div class="info-row"><span class="k">Arrival — ${weekdayLong(TRIP.flightIn.date)} ${dayMonth(TRIP.flightIn.date)}</span><span class="v">${TRIP.flightIn.city}, ${TRIP.flightIn.time}</span></div>
        <div class="info-row"><span class="k">Departure — ${weekdayLong(TRIP.flightOut.date)} ${dayMonth(TRIP.flightOut.date)}</span><span class="v">${TRIP.flightOut.city}, ${TRIP.flightOut.time}</span></div>
        <div class="tip">💡 ${escapeHTML(TRIP.flightOut.note)}</div>
      </div>
    </div>

    <div class="info-section">
      <h2>Before you go</h2>
      ${renderChecklistHTML()}
    </div>

    <div class="info-section">
      <h2>Good to know</h2>
      <div class="card">
        ${GENERAL_TIPS.map(t => `<div class="tip">💡 ${escapeHTML(t)}</div>`).join("")}
      </div>
    </div>
  `;
  bindChecklist();
}

/* ============================================================
   Tabs + init
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

  // Refresh the "Now" view periodically so "current activity" stays accurate
  // if the app is left open.
  setInterval(renderNow, 60000);
}

init();
