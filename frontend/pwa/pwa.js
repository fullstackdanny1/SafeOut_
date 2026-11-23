import { api } from '../shared/api-client.js';

// ============================================================
// SafeOut PWA — logica aplicației (utilizator final)
// RO / EN / DE
// ============================================================

// ---- 1. Dicționar i18n ----
const I18N = {
  en: {
    main_title: "Need help<br>right now?",
    main_sub: "Tap a button. We're here.",
    escort_label: "Get me out",
    contact_label: "Call somebody",
    emergency: "emergency",
    footer: "dispatch active &middot; confidential",
    escort_h: "Get to safety",
    escort_sub: "Nearest safe places",
    escort_loading: "Finding safe places near you&hellip;",
    escort_none: "Couldn't load nearby places. Use the search below.",
    escort_denied: "Turn on location to see places near you, or use the search below.",
    escort_search_label: "Or search in Maps",
    cat_police: "Police", cat_gendarmerie: "Gendarmerie", cat_hospital: "Hospital / ER", cat_pharmacy: "24h pharmacy",
    type_police: "Police", type_hospital: "Hospital",
    q_police: "police station", q_gendarmerie: "gendarmerie", q_hospital: "hospital emergency", q_pharmacy: "24 hour pharmacy",
    // action screen
    act_sub_escort: "Staff will come to you.",
    act_sub_112: "Connects you to emergency services.",
    act_sub_119: "National child helpline.",
    alert_escort: "Alert staff",
    alert_112: "Call 112",
    alert_119: "Call 119",
    act_whatshared: "What's shared?",
    act_cancel: "Cancel",
    act_note: "Nothing is sent until you tap the button. Encrypted &middot; GDPR.",
    // success
    success_title: "Help is on the way",
    success_sub: "Stay where you are if it's safe.",
    success_back: "Back",
    contact_sent_title: "Sharing your location",
    contact_sent_sub: "Keep this SafeOut page open so your live location keeps updating for them.",
    // help
    help_h: "Help &amp; info",
    help_sub: "What SafeOut does",
    help_who_label: "Who we are",
    help_who_body: "A free safety tool. Scan a SafeOut QR code anywhere you feel unsafe and reach a real, trained person instantly &mdash; no app, no account. Our focus is stopping human trafficking and keeping people safe.",
    help_buttons_label: "How each button works",
    help_b_escort: "Shows the nearest safe places on a map &mdash; police, gendarmerie, hospital/ER &mdash; and opens turn-by-turn directions to the one you pick. You decide where to go; no one at the venue is involved.",
    help_b_contact: "Sends a trusted contact a message with your location, asking them to call you right now.",
    help_b_112: "National emergency line (police &middot; ambulance &middot; fire). Shares your location, one photo, a few seconds of audio and venue details with responders.",
    help_b_119: "National child helpline &mdash; free, 24/7, for anyone under 18 in danger or abuse. Confidential.",
    help_data_label: "What is shared",
    help_data_body: "Nothing is sent until you tap the alert button. Depending on the button, SafeOut may share: your location, the venue and time, one photo, and a few seconds of audio. Data is encrypted and seen only by trained dispatch staff. You are asked each time.",
    help_hotlines_label: "Emergency numbers",
    hl_112_name: "Emergency", hl_112_note: "Police &middot; ambulance &middot; fire",
    hl_119_name: "Child helpline", hl_119_note: "Free &middot; 24/7 &middot; confidential",
    hl_anitp_name: "Anti-trafficking", hl_anitp_note: "Free &middot; 24/7 &middot; confidential",
    hl_dv_name: "Domestic violence", hl_dv_note: "Free &middot; 24/7",
    help_privacy: "Encrypted &middot; GDPR-compliant &middot; never sold or shared with third parties.",
    // disguise
    disguise_title: "Site under maintenance",
    disguise_sub: "We're working on some improvements.<br>Please check back soon.",
    disguise_back: "&larr; go back",
    // contacts sheet
    sheet_title: "Alert someone with your live location",
    contact_msg: "I don't feel safe. Follow my live location:",
    contact_note: "A live map link is sent. Keep this page open so your location keeps updating.",
    contacts_open: "Pick from contacts",
    contacts_unsupported: "Your device can't pick contacts from the browser. On Android Chrome this works; on iOS it isn't available yet.",
    sms_body: "I need you to call me NOW. I'm somewhere I don't feel safe."
  },
  ro: {
    main_title: "Ai nevoie<br>de ajutor?",
    main_sub: "Apasă un buton. Suntem aici.",
    escort_label: "Vreau să ies",
    contact_label: "Anunță pe cineva",
    emergency: "urgență",
    footer: "dispecerat activ &middot; confidențial",
    escort_h: "Ajungi în siguranță",
    escort_sub: "Cele mai apropiate locuri sigure",
    escort_loading: "Caut locuri sigure lângă tine&hellip;",
    escort_none: "Nu am putut încărca locurile din apropiere. Folosește căutarea de mai jos.",
    escort_denied: "Activează locația ca să vezi locuri lângă tine, sau folosește căutarea de mai jos.",
    escort_search_label: "Sau caută în Maps",
    cat_police: "Poliție", cat_gendarmerie: "Jandarmerie", cat_hospital: "Spital / UPU", cat_pharmacy: "Farmacie non-stop",
    type_police: "Poliție", type_hospital: "Spital",
    q_police: "secție de poliție", q_gendarmerie: "jandarmerie", q_hospital: "spital UPU", q_pharmacy: "farmacie non stop",
    act_sub_escort: "Personalul vine la tine.",
    act_sub_112: "Te conectează la serviciile de urgență.",
    act_sub_119: "Linia națională pentru copii.",
    alert_escort: "Anunță personalul",
    alert_112: "Sună 112",
    alert_119: "Sună 119",
    act_whatshared: "Ce se trimite?",
    act_cancel: "Anulează",
    act_note: "Nimic nu se trimite până nu apeși butonul. Criptat &middot; GDPR.",
    success_title: "Ajutorul vine",
    success_sub: "Rămâi pe loc dacă e sigur.",
    success_back: "Înapoi",
    contact_sent_title: "Îți partajezi locația",
    contact_sent_sub: "Ține această pagină SafeOut deschisă ca locația ta live să se actualizeze pentru ei.",
    help_h: "Ajutor &amp; info",
    help_sub: "Ce face SafeOut",
    help_who_label: "Cine suntem",
    help_who_body: "Un instrument de siguranță gratuit. Scanezi un cod QR SafeOut oriunde nu te simți în siguranță și ajungi instant la o persoană reală, instruită &mdash; fără aplicație, fără cont. Scopul nostru e să oprim traficul de persoane și să ținem oamenii în siguranță.",
    help_buttons_label: "Ce face fiecare buton",
    help_b_escort: "Îți arată pe hartă cele mai apropiate locuri sigure &mdash; poliție, jandarmerie, spital/UPU &mdash; și deschide traseul cu indicații către cel ales. Tu decizi unde mergi; nimeni din local nu e implicat.",
    help_b_contact: "Trimite unei persoane de încredere un mesaj cu locația ta, cerându-i să te sune imediat.",
    help_b_112: "Numărul național de urgență (poliție &middot; ambulanță &middot; pompieri). Trimite locația, o poză, câteva secunde de audio și detaliile locului către echipele de intervenție.",
    help_b_119: "Linia națională pentru copii &mdash; gratuită, 24/7, pentru orice persoană sub 18 ani aflată în pericol sau abuz. Confidențial.",
    help_data_label: "Ce se trimite",
    help_data_body: "Nimic nu se trimite până nu apeși butonul de alertă. În funcție de buton, SafeOut poate trimite: locația ta, locul și ora, o poză și câteva secunde de audio. Datele sunt criptate și văzute doar de personalul de dispecerat instruit. Ești întrebat de fiecare dată.",
    help_hotlines_label: "Numere de urgență",
    hl_112_name: "Urgențe", hl_112_note: "Poliție &middot; ambulanță &middot; pompieri",
    hl_119_name: "Linia Copilului", hl_119_note: "Gratuit &middot; 24/7 &middot; confidențial",
    hl_anitp_name: "Anti-trafic (ANITP)", hl_anitp_note: "Gratuit &middot; 24/7 &middot; confidențial",
    hl_dv_name: "Violență domestică", hl_dv_note: "Gratuit &middot; 24/7",
    help_privacy: "Criptat &middot; conform GDPR &middot; niciodată vândut sau partajat cu terți.",
    disguise_title: "Site în mentenanță",
    disguise_sub: "Lucrăm la câteva îmbunătățiri.<br>Revino în curând.",
    disguise_back: "&larr; înapoi",
    sheet_title: "Anunță pe cineva cu locația ta live",
    contact_msg: "Nu mă simt în siguranță. Urmărește-mi locația live:",
    contact_note: "Se trimite un link cu harta live. Ține pagina deschisă ca locația să se actualizeze.",
    contacts_open: "Alege din agendă",
    contacts_unsupported: "Dispozitivul tău nu poate selecta contacte din browser. Pe Android Chrome funcționează; pe iOS nu este încă disponibil.",
    sms_body: "Am nevoie să mă suni ACUM. Sunt într-un loc unde nu mă simt în siguranță."
  },
  de: {
    main_title: "Brauchst du<br>jetzt Hilfe?",
    main_sub: "Tippe auf einen Button. Wir sind da.",
    escort_label: "Hol mich raus",
    contact_label: "Kontakt alarmieren",
    emergency: "notruf",
    footer: "leitstelle aktiv &middot; vertraulich",
    escort_h: "Sicher ankommen",
    escort_sub: "Nächste sichere Orte",
    escort_loading: "Suche sichere Orte in deiner Nähe&hellip;",
    escort_none: "Orte in der Nähe konnten nicht geladen werden. Nutze die Suche unten.",
    escort_denied: "Aktiviere den Standort, um Orte in deiner Nähe zu sehen, oder nutze die Suche unten.",
    escort_search_label: "Oder in Maps suchen",
    cat_police: "Polizei", cat_gendarmerie: "Gendarmerie", cat_hospital: "Krankenhaus / Notaufnahme", cat_pharmacy: "Notdienst-Apotheke",
    type_police: "Polizei", type_hospital: "Krankenhaus",
    q_police: "Polizei", q_gendarmerie: "Gendarmerie", q_hospital: "Krankenhaus Notaufnahme", q_pharmacy: "Apotheke Notdienst",
    act_sub_escort: "Das Personal kommt zu dir.",
    act_sub_112: "Verbindet dich mit dem Notruf.",
    act_sub_119: "Nationale Kinder-Hotline.",
    alert_escort: "Personal alarmieren",
    alert_112: "112 anrufen",
    alert_119: "119 anrufen",
    act_whatshared: "Was wird geteilt?",
    act_cancel: "Abbrechen",
    act_note: "Nichts wird gesendet, bis du den Button drückst. Verschlüsselt &middot; DSGVO.",
    success_title: "Hilfe ist unterwegs",
    success_sub: "Bleib, wo du bist, wenn es sicher ist.",
    success_back: "Zurück",
    contact_sent_title: "Standort wird geteilt",
    contact_sent_sub: "Lass diese SafeOut-Seite offen, damit dein Live-Standort für sie aktuell bleibt.",
    help_h: "Hilfe &amp; Info",
    help_sub: "Was SafeOut macht",
    help_who_label: "Wer wir sind",
    help_who_body: "Ein kostenloses Sicherheits-Tool. Scanne einen SafeOut-QR-Code, wo immer du dich unsicher fühlst, und erreiche sofort eine echte, geschulte Person &mdash; ohne App, ohne Konto. Unser Ziel: Menschenhandel stoppen und Menschen schützen.",
    help_buttons_label: "Was jeder Button macht",
    help_b_escort: "Zeigt die nächsten sicheren Orte auf einer Karte &mdash; Polizei, Gendarmerie, Krankenhaus/Notaufnahme &mdash; und öffnet die Navigation zum gewählten Ort. Du entscheidest, wohin; niemand vor Ort ist beteiligt.",
    help_b_contact: "Sendet einer Vertrauensperson eine Nachricht mit deinem Standort und der Bitte, dich sofort anzurufen.",
    help_b_112: "Nationaler Notruf (Polizei &middot; Rettung &middot; Feuerwehr). Teilt deinen Standort, ein Foto, einige Sekunden Audio und Ortsdaten mit den Einsatzkräften.",
    help_b_119: "Nationale Kinder-Hotline &mdash; kostenlos, rund um die Uhr, für alle unter 18 in Gefahr oder bei Missbrauch. Vertraulich.",
    help_data_label: "Was geteilt wird",
    help_data_body: "Nichts wird gesendet, bevor du den Alarm-Button drückst. Je nach Button teilt SafeOut: deinen Standort, Ort und Zeit, ein Foto und einige Sekunden Audio. Daten sind verschlüsselt und nur für geschultes Personal sichtbar. Du wirst jedes Mal gefragt.",
    help_hotlines_label: "Notrufnummern",
    hl_112_name: "Notruf", hl_112_note: "Polizei &middot; Rettung &middot; Feuerwehr",
    hl_119_name: "Kinder-Hotline", hl_119_note: "Kostenlos &middot; 24/7 &middot; vertraulich",
    hl_anitp_name: "Gegen Menschenhandel", hl_anitp_note: "Kostenlos &middot; 24/7 &middot; vertraulich",
    hl_dv_name: "Häusliche Gewalt", hl_dv_note: "Kostenlos &middot; 24/7",
    help_privacy: "Verschlüsselt &middot; DSGVO-konform &middot; niemals verkauft oder an Dritte weitergegeben.",
    disguise_title: "Seite in Wartung",
    disguise_sub: "Wir arbeiten an Verbesserungen.<br>Bitte schau bald wieder vorbei.",
    disguise_back: "&larr; zurück",
    sheet_title: "Jemanden mit deinem Live-Standort alarmieren",
    contact_msg: "Ich fühle mich nicht sicher. Verfolge meinen Live-Standort:",
    contact_note: "Ein Live-Karten-Link wird gesendet. Lass die Seite offen, damit dein Standort aktuell bleibt.",
    contacts_open: "Aus Kontakten wählen",
    contacts_unsupported: "Dein Gerät kann keine Kontakte aus dem Browser wählen. Auf Android Chrome funktioniert es; auf iOS noch nicht.",
    sms_body: "Bitte ruf mich JETZT an. Ich bin an einem Ort, an dem ich mich nicht sicher fühle."
  }
};

let CUR_LANG = 'en';
let pendingType = null;

function setLang(lang) {
  CUR_LANG = ['ro', 'en', 'de'].includes(lang) ? lang : 'en';
  const dict = I18N[CUR_LANG];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  ['ro', 'en', 'de'].forEach(l => {
    const b = document.getElementById('lang' + l.toUpperCase());
    if (b) b.classList.toggle('active', CUR_LANG === l);
  });
  try { localStorage.setItem('safeout_lang', CUR_LANG); } catch (e) { }
  document.documentElement.lang = CUR_LANG;
}

function initLang() {
  let lang = null;
  try { lang = localStorage.getItem('safeout_lang'); } catch (e) { }
  if (!lang) {
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    lang = nav.startsWith('ro') ? 'ro' : nav.startsWith('de') ? 'de' : 'en';
  }
  setLang(lang);
}

// ---- 2. QR code lookup ----
const QR_ID = new URLSearchParams(window.location.search).get('q') || 'demo';
let currentQRInfo = null;

async function fetchQRInfo() {
  if (QR_ID === 'demo' || QR_ID === 'demo-venue') {
    currentQRInfo = { venue_name: "Demo location", placement: "Main area", city: "Oradea" };
    return;
  }
  try {
    // GET /qrcodes/:code (public) — also increments the scan counter server-side
    currentQRInfo = await api.getQr(QR_ID);
  } catch (error) {
    console.warn('QR not found on server, using fallback:', error.message || error);
    currentQRInfo = { venue_name: "Unknown location", placement: null, city: "Necunoscut" };
  }
}

function getLocation() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve({ lat: null, lng: null, accuracy: null, method: 'unavailable' });
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy, method: p.coords.accuracy < 50 ? 'gps' : 'wifi' }),
      () => resolve({ lat: null, lng: null, accuracy: null, method: 'unavailable' }),
      // first GPS fix on a phone can take 10-30s; 5s was too short and often returned null
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });
}

// ---- 3. Evidence capture (photo / audio) ----
async function capturePhoto(facing) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.setAttribute('playsinline', '');
    await video.play();
    await new Promise(r => setTimeout(r, 600));
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    stream.getTracks().forEach(t => t.stop());
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch (e) { return null; }
}

async function captureBothPhotos() {
  const back = await capturePhoto('environment');
  const front = await capturePhoto('user');
  return { back, front };
}

async function captureAudio(seconds) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    const done = new Promise(resolve => { rec.onstop = () => resolve(); });
    rec.start();
    await new Promise(r => setTimeout(r, (seconds || 5) * 1000));
    rec.stop();
    await done;
    stream.getTracks().forEach(t => t.stop());
    const blob = new Blob(chunks, { type: chunks[0] ? chunks[0].type : 'audio/webm' });
    return await new Promise(resolve => { const fr = new FileReader(); fr.onloadend = () => resolve(fr.result); fr.readAsDataURL(blob); });
  } catch (e) { return null; }
}

async function uploadEvidence(incidentId, photos, audio) {
  if (!incidentId) return;
  const uploads = [];
  if (photos && photos.back) uploads.push(api.addEvidence({ incident_id: incidentId, file_type: 'photo', storage_url: photos.back }));
  if (photos && photos.front) uploads.push(api.addEvidence({ incident_id: incidentId, file_type: 'photo', storage_url: photos.front }));
  if (audio) uploads.push(api.addEvidence({ incident_id: incidentId, file_type: 'audio', storage_url: audio }));
  await Promise.allSettled(uploads);
}

// ---- 4. Record incident (POST /incidents) ----
async function recordIncident(situationType, extra = {}) {
  // Use a pre-fetched fix if given, else the QR's fixed coordinates, else live GPS.
  let loc;
  if (extra.__loc) {
    loc = extra.__loc;
    delete extra.__loc;
  } else if (currentQRInfo && currentQRInfo.latitude && currentQRInfo.longitude) {
    loc = { lat: Number(currentQRInfo.latitude), lng: Number(currentQRInfo.longitude), accuracy: 5, method: 'qr_fixed' };
  } else {
    loc = await getLocation();
  }

  const data = {
    situation_type: situationType,                                   // 'escort' | 'contact' | 'emergency'
    city: (currentQRInfo && currentQRInfo.city) || 'Necunoscut',     // required by backend
    qr_code_id: (currentQRInfo && typeof currentQRInfo.id === 'number') ? currentQRInfo.id : null,
    venue_name: (currentQRInfo && currentQRInfo.venue_name) || null,
    placement: (currentQRInfo && currentQRInfo.placement) || null,
    latitude: loc.lat,
    longitude: loc.lng,
    location_accuracy_m: loc.accuracy,
    location_method: loc.method === 'unavailable' ? null : loc.method,
    live_tracking: false,
    ...extra
  };

  try {
    return await api.createIncident(data);
  } catch (error) {
    console.error('Incident POST failed:', error);
    return null;
  }
}

// ---- 5. Screen navigation ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}
function goHome() { closeSheet(); showScreen('screen-main'); }
function showHelp() { showScreen('screen-help'); }

function setSuccess(title, sub) {
  const t = document.querySelector('#screen-success [data-i18n="success_title"]');
  const s = document.querySelector('#screen-success [data-i18n="success_sub"]');
  if (t) t.textContent = title;
  if (s) s.textContent = sub;
}

// ---- 6. Minimal action screen ----
function showAct(type) {
  pendingType = type;
  const d = I18N[CUR_LANG];
  const numEl = document.getElementById('actNum');
  const subEl = document.getElementById('actSub');
  const btnEl = document.getElementById('actAlert');

  if (type === 'escort') {
    numEl.className = 'act-num word blue'; numEl.innerHTML = d.escort_label;
    subEl.textContent = d.act_sub_escort;
    btnEl.className = 'act-alert blue'; btnEl.textContent = d.alert_escort;
  } else if (type === '112') {
    numEl.className = 'act-num big red'; numEl.textContent = '112';
    subEl.textContent = d.act_sub_112;
    btnEl.className = 'act-alert red'; btnEl.textContent = d.alert_112;
  } else if (type === '119') {
    numEl.className = 'act-num big yellow'; numEl.textContent = '119';
    subEl.textContent = d.act_sub_119;
    btnEl.className = 'act-alert yellow'; btnEl.textContent = d.alert_119;
  }
  showScreen('screen-act');
}

async function confirmAct() {
  const type = pendingType || 'escort';

  // Dial emergency numbers (tel: works without further gesture)
  if (type === '112') setTimeout(() => { window.location.href = 'tel:112'; }, 600);
  if (type === '119') setTimeout(() => { window.location.href = 'tel:119'; }, 600);

  const dd = I18N[CUR_LANG];
  setSuccess(dd.success_title, dd.success_sub);
  showScreen('screen-success');

  let stype = 'escort', vmsg = null, withEvidence = false, live = false;
  if (type === '112') { stype = 'emergency'; vmsg = '112'; withEvidence = true; live = true; }
  else if (type === '119') { stype = 'emergency'; vmsg = '119 (Linia Copilului)'; live = true; }

  const extra = {};
  if (vmsg) extra.victim_message = vmsg;
  if (live) extra.live_tracking = true;

  const res = await recordIncident(stype, extra);
  const incidentId = res ? res.id : null;

  // Live location: keep sending the victim's position to dispatch while the page stays open.
  if (live && res && res.id && res.update_token) {
    startLiveTracking(res.id, res.update_token, res.city);
  }

  if (withEvidence && incidentId) {
    Promise.all([captureBothPhotos(), captureAudio(5)])
      .then(([photos, audio]) => uploadEvidence(incidentId, photos, audio))
      .catch(err => console.warn('Could not collect media evidence:', err));
  }
}

// ---- 6b. Live location tracking (112 / 119) ----
// Sends the victim's position to the server as it changes, so dispatch can follow
// the moving dot even if the victim can't say where they are. Works only while the
// page stays open (browser limitation); auto-stops after 30 minutes.
let liveWatchId = null, liveStopTimer = null, liveLastSent = 0;
let liveIncidentId = null, liveToken = null, liveCity = null;

function sendFix(pos) {
  if (liveIncidentId == null || !liveToken) return;
  api.updateLocation(liveIncidentId, {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    location_accuracy_m: pos.coords.accuracy,
    update_token: liveToken,
    city: liveCity
  }).catch(() => {});
}

function startLiveTracking(incidentId, token, city) {
  stopLiveTracking();
  if (!navigator.geolocation) return;
  liveIncidentId = incidentId; liveToken = token; liveCity = city; liveLastSent = 0;
  liveWatchId = navigator.geolocation.watchPosition(
    pos => {
      const now = Date.now();
      if (now - liveLastSent < 8000) return;   // throttle: at most one update / 8s
      liveLastSent = now;
      sendFix(pos);
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
  );
  liveStopTimer = setTimeout(stopLiveTracking, 30 * 60 * 1000);
}

function stopLiveTracking() {
  if (liveWatchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(liveWatchId);
  liveWatchId = null; liveIncidentId = null; liveToken = null; liveCity = null;
  if (liveStopTimer) { clearTimeout(liveStopTimer); liveStopTimer = null; }
}

// ---- 7. Contact sheet ("Call somebody" / "Anunță pe cineva") ----
// Sends a trusted contact a LIVE location link (via WhatsApp or SMS) and keeps
// the victim's position updating on the server while the page stays open.
function openSheet() {
  const sheet = document.getElementById('sheetOverlay');
  if (!sheet) return;
  const d = I18N[CUR_LANG];
  const pickWrap = document.getElementById('contactPickWrap');
  if (pickWrap) {
    const supported = ('contacts' in navigator && 'ContactsManager' in window);
    pickWrap.innerHTML = supported
      ? `<button class="contact-pick" onclick="pickContact()">${d.contacts_open}</button>`
      : '';
  }
  sheet.classList.add('open');
}
function closeSheet() {
  const sheet = document.getElementById('sheetOverlay');
  if (sheet) sheet.classList.remove('open');
}

// Android only: fill the number field from the address book.
async function pickContact() {
  try {
    const contacts = await navigator.contacts.select(['tel'], { multiple: false });
    if (contacts && contacts.length && contacts[0].tel && contacts[0].tel[0]) {
      const input = document.getElementById('contactNumber');
      if (input) input.value = contacts[0].tel[0];
    }
  } catch (e) { /* cancelled */ }
}

// Send the live-location link through WhatsApp or SMS, and start live tracking.
async function sendToContact(channel) {
  const d = I18N[CUR_LANG];
  const input = document.getElementById('contactNumber');
  const raw = input ? input.value.trim() : '';

  // Get a reliable fix FIRST, so the incident is created WITH a location —
  // otherwise the contact's link just shows "waiting for location" forever.
  const loc = await getLocation();

  const res = await recordIncident('contact', { live_tracking: true, __loc: loc });
  let link = '';
  if (res && res.id && res.share_token) {
    link = window.location.origin + '/track?t=' + encodeURIComponent(res.share_token);
    if (res.update_token) startLiveTracking(res.id, res.update_token, res.city);
  } else if (loc.lat && loc.lng) {
    link = 'https://maps.google.com/?q=' + loc.lat + ',' + loc.lng;   // fallback: static link
  }
  api.recordContactPing().catch(() => {});

  const body = d.contact_msg + (link ? ' ' + link : '') + ' (SafeOut)';

  // Show the "keep this page open" screen first, so it's what the victim sees on return.
  setSuccess(d.contact_sent_title, d.contact_sent_sub);
  showScreen('screen-success');
  closeSheet();

  if (channel === 'whatsapp') {
    let wa = raw.replace(/\D/g, '');
    if (wa.startsWith('0')) wa = '40' + wa.slice(1);   // Romanian local -> international
    window.location.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(body);
  } else {
    const num = raw.replace(/\s+/g, '');
    const sep = /(iPhone|iPad|Macintosh)/.test(navigator.userAgent) ? '&' : '?';
    window.location.href = 'sms:' + num + sep + 'body=' + encodeURIComponent(body);
  }
}

// ---- 7b. "Get me out" -> map + nearest safe places ----
let escortMap = null, escortLayer = null;

function showEscort() {
  showScreen('screen-escort');
  setTimeout(initEscort, 80);
}

function initEscort() {
  if (typeof L === 'undefined') {           // Leaflet CDN not available
    const el = document.getElementById('escortList');
    if (el) el.innerHTML = `<div class="escort-hint">${I18N[CUR_LANG].escort_none}</div>`;
    return;
  }
  if (!escortMap) {
    escortMap = L.map('escortMap', { zoomControl: true, attributionControl: true }).setView([47.0722, 21.9211], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(escortMap);
    escortLayer = L.layerGroup().addTo(escortMap);
  }
  escortMap.invalidateSize();
  escortLocate();
}

async function escortLocate() {
  const d = I18N[CUR_LANG];
  const listEl = document.getElementById('escortList');
  listEl.innerHTML = `<div class="escort-hint">${d.escort_loading}</div>`;
  const loc = await getLocation();
  if (!loc.lat || !loc.lng) {
    listEl.innerHTML = `<div class="escort-hint">${d.escort_denied}</div>`;
    return;
  }
  escortLayer.clearLayers();
  escortMap.setView([loc.lat, loc.lng], 15);
  L.circleMarker([loc.lat, loc.lng], { radius: 8, color: '#4ecfaa', fillColor: '#4ecfaa', fillOpacity: 0.9, weight: 2 }).addTo(escortLayer);
  loadNearby(loc.lat, loc.lng);
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000, toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Parse an Overpass response into the 3 nearest places (exported for testing)
function parseNearby(data, lat, lng, d) {
  return (data.elements || []).map(el => {
    const plat = el.lat != null ? el.lat : (el.center && el.center.lat);
    const plng = el.lon != null ? el.lon : (el.center && el.center.lon);
    if (plat == null || plng == null) return null;
    const amenity = el.tags && el.tags.amenity;
    const kind = amenity === 'hospital' ? 'hospital' : 'police';
    return {
      name: (el.tags && el.tags.name) || (kind === 'hospital' ? d.type_hospital : d.type_police),
      type: kind === 'hospital' ? d.type_hospital : d.type_police,
      kind, lat: plat, lng: plng,
      dist: haversine(lat, lng, plat, plng)
    };
  }).filter(Boolean).sort((a, b) => a.dist - b.dist).slice(0, 3);
}

async function loadNearby(lat, lng) {
  const d = I18N[CUR_LANG];
  const listEl = document.getElementById('escortList');
  const q = `[out:json][timeout:8];(node["amenity"="police"](around:5000,${lat},${lng});way["amenity"="police"](around:5000,${lat},${lng});node["amenity"="hospital"](around:5000,${lat},${lng});way["amenity"="hospital"](around:5000,${lat},${lng}););out center 40;`;
  let data;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(q),
      signal: ctrl.signal
    });
    clearTimeout(t);
    data = await res.json();
  } catch (e) {
    listEl.innerHTML = `<div class="escort-hint">${d.escort_none}</div>`;
    return;
  }

  const items = parseNearby(data, lat, lng, d);
  if (!items.length) {
    listEl.innerHTML = `<div class="escort-hint">${d.escort_none}</div>`;
    return;
  }

  const policeIco = '<svg viewBox="0 0 24 24" stroke="#a0aaff"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
  const hospIco = '<svg viewBox="0 0 24 24" stroke="#ff8080"><path d="M12 8v8M8 12h8"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>';

  listEl.innerHTML = items.map(it => {
    const dist = it.dist < 1000 ? Math.round(it.dist) + ' m' : (it.dist / 1000).toFixed(1) + ' km';
    const ico = it.kind === 'hospital' ? hospIco : policeIco;
    return `<button class="place-item" onclick="openDirections(${it.lat},${it.lng})">
      <div class="place-ico ${it.kind}">${ico}</div>
      <div class="place-body"><div class="place-name">${escapeHtml(it.name)}</div><div class="place-type">${it.type}</div></div>
      <div class="place-dist">${dist}</div><div class="place-go">&rsaquo;</div>
    </button>`;
  }).join('');

  items.forEach(it => {
    const color = it.kind === 'hospital' ? '#ff6b6b' : '#7b8fff';
    L.circleMarker([it.lat, it.lng], { radius: 7, color, fillColor: color, fillOpacity: 0.85, weight: 2 })
      .addTo(escortLayer).bindPopup(escapeHtml(it.name));
  });
}

function openDirections(lat, lng) {
  window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

function mapsSearch(cat) {
  const d = I18N[CUR_LANG];
  const q = { police: d.q_police, gendarmerie: d.q_gendarmerie, hospital: d.q_hospital, pharmacy: d.q_pharmacy }[cat] || cat;
  window.location.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}

// ---- 8. Expose for inline onclick handlers ----
window.setLang = setLang;
window.goHome = goHome;
window.showHelp = showHelp;
window.showAct = showAct;
window.confirmAct = confirmAct;
window.openSheet = openSheet;
window.closeSheet = closeSheet;
window.pickContact = pickContact;
window.sendToContact = sendToContact;
window.showEscort = showEscort;
window.openDirections = openDirections;
window.mapsSearch = mapsSearch;

// ---- 9. Init ----
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  fetchQRInfo();

  // When the victim returns to SafeOut (after opening WhatsApp/the dialer), push a
  // fresh position immediately so the contact's live link resumes updating.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && liveWatchId !== null && navigator.geolocation) {
      liveLastSent = 0;
      navigator.geolocation.getCurrentPosition(
        p => sendFix(p), () => {},
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  });

  // disguise: double-tap the logo -> maintenance screen
  const logoEl = document.querySelector('.logo-img');
  if (logoEl) {
    let taps = 0, timer;
    logoEl.addEventListener('click', () => {
      taps++;
      clearTimeout(timer);
      if (taps >= 2) { showScreen('screen-disguise'); taps = 0; }
      else timer = setTimeout(() => taps = 0, 500);
    });
  }

  // tap outside the sheet to close
  const overlay = document.getElementById('sheetOverlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeSheet(); });
});
