/**
 * consent-banner.js — Local Story Hub (prototype-v4)
 * =====================================================================================
 * PDPA consent notice + real Firestore write, replacing the localStorage-only mockup at
 * docs/02-design/01-prototypes/prototype-v1/tourist-home-consent.html.
 *
 * HOW TO USE
 * ----------
 * This file uses native ES module `import` statements (Firebase modular SDK v10.12.2,
 * matching the version already used in prototype-v2), so it MUST be included as a module:
 *
 *   <script src="firebase-config.js"></script>                 <!-- sets window.LSH_FIREBASE_CONFIG -->
 *   <script type="module" src="consent-banner.js"></script>
 *
 * (Note: the task brief said `<script src="consent-banner.js">` — a plain, non-module
 * script tag cannot contain `import` statements at all, so `type="module"` is required.
 * This is called out explicitly so nobody copies a plain `<script src>` tag and gets a
 * silent syntax/parse failure.)
 *
 * If `window.LSH_FIREBASE_CONFIG` is not present (e.g. the host page forgot to load
 * firebase-config.js, or a developer is running this file standalone with no backend),
 * this module degrades gracefully: it still shows the banner and still remembers the
 * visitor's answer locally (so the banner doesn't reappear on reload), it just cannot
 * persist a real ConsentRecord to Firestore. It logs a loud console.warn when that
 * happens so the gap is never silent.
 *
 * INTERPRETATION OF "SINGLE-TOGGLE CONSENT" (see spec Business Rules, 20260822-01-it-log-pdpa-consent.md,
 * decided 2026-09-22: "ปุ่มเดียว 'ยอมรับ' หรือ 'ปฏิเสธ' ไม่มีการแยก toggle รายประเภท"):
 *   - The UI exposes exactly ONE user decision (accept-all vs reject-non-essential), matching
 *     the two buttons already used in prototype-v1 ("ยินยอมทั้งหมด" / "ปฏิเสธที่ไม่จำเป็น").
 *     There is no per-category (analytics vs marketing/IP) toggle anywhere in the UI.
 *   - architecture.md's ConsentRecord entity still keeps TWO stored fields,
 *     `analytics_consent` and `marketing_consent`, and explicitly says merging them into a
 *     single field was left as an implementation detail ("ยังไม่ได้ตัดสินใจรวมเป็น field เดียว
 *     — เป็นรายละเอียดที่ตัดสินใจได้ตอน implement จริง"). This implementation keeps both
 *     fields (so the stored schema matches the documented ER diagram / Firestore rules
 *     proposal without requiring a schema change elsewhere), but derives BOTH of them from
 *     the SAME single toggle/click — they are always written with an identical boolean value,
 *     enforced both here in code and again in the proposed Firestore rule
 *     (`analytics_consent == marketing_consent`) in firestore-rules-compliance-proposal.md.
 *     In short: "one toggle driving two fields", not "one boolean field" and not "two
 *     independently-settable booleans".
 *
 * ANONYMOUS / NOT-YET-AUTHENTICATED VISITORS (Sequence #1, detailed-design.md — the `Client`
 * participant there is generic, not necessarily logged in):
 *   - ConsentRecord.user_account_id is optional per architecture.md ("Consent เกิดขึ้นได้ก่อน
 *     login"). This module resolves the current Firebase Auth uid (if any) at the moment the
 *     user answers and stores that as `user_account_id`; if nobody is logged in yet, it stores
 *     `null` — exactly matching the schema's documented meaning of that field.
 *   - Separately (and only for the *local* de-duplication check — "have I already asked this
 *     browser?"), an anonymous client-generated id is cached in localStorage. This anonymous id
 *     is NOT written into the ConsentRecord document (the schema has no field for it); it only
 *     drives this module's own "don't show the banner again" bookkeeping in localStorage.
 *
 * FIRESTORE COLLECTION NAME: `ConsentRecords` (plural), matching the existing real Firestore
 * naming convention in this project (`AiAssistLogs`, `AiSummaries`, `LSHRequests` are all
 * plural) — see LSH/firestore.rules and CLAUDE.md.
 */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const LS_KEY = 'lsh_consent';
const ANON_ID_KEY = 'lsh_anon_id';
const COLLECTION_NAME = 'ConsentRecords';

/** Reuse an already-initialized Firebase app if the host page (or another LSH module on the
 * same page, e.g. access-log.js) already called initializeApp() — Firebase throws if you call
 * initializeApp() twice with the default app name, so this guards against that. */
function getFirebaseApp() {
  try {
    if (!window.LSH_FIREBASE_CONFIG) return null;
    return getApps().length ? getApp() : initializeApp(window.LSH_FIREBASE_CONFIG);
  } catch (err) {
    console.error('[consent-banner] Firebase initialization failed — consent will only be saved locally:', err);
    return null;
  }
}

/** localStorage-only anonymous id, used purely for this module's own "already asked?"
 * bookkeeping — never written to Firestore (see file header). */
function getOrCreateAnonId() {
  let id = null;
  try { id = localStorage.getItem(ANON_ID_KEY); } catch (e) { /* localStorage unavailable */ }
  if (!id) {
    id = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : ('anon-' + Date.now() + '-' + Math.random().toString(16).slice(2));
    try { localStorage.setItem(ANON_ID_KEY, id); } catch (e) { /* ignore */ }
  }
  return id;
}

/** Resolves the current Firebase Auth uid, waiting for Firebase Auth's initial state
 * resolution (important on page reload, where auth state isn't known synchronously). */
function resolveUserId(app) {
  return new Promise((resolve) => {
    if (!app) return resolve(null);
    try {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => { unsubscribe(); resolve(user ? user.uid : null); },
        () => resolve(null),
      );
    } catch (err) {
      resolve(null);
    }
  });
}

function readLocalConsent() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch (e) { return null; }
}

function saveLocalConsent(consent) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(consent)); } catch (e) { /* ignore */ }
}

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.id = 'lsh-consent-banner-styles';
  style.textContent = `
    .lsh-consent-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;
      background:#F3EEE4;border-top:1px solid #C9BFAC;box-shadow:0 -2px 12px rgba(46,42,34,0.08);
      padding:16px 24px;font-family:'Sarabun',system-ui,sans-serif;}
    .lsh-consent-banner__inner{max-width:960px;margin:0 auto;display:flex;flex-wrap:wrap;
      align-items:center;gap:16px;}
    .lsh-consent-banner p{flex:1 1 420px;font-size:16px;line-height:1.6;margin:0;min-width:260px;
      color:#2E2A22;}
    .lsh-consent-banner__actions{display:flex;gap:12px;flex-wrap:wrap;}
    .lsh-consent-banner button{height:44px;padding:0 20px;border-radius:8px;font-size:15px;
      font-weight:600;cursor:pointer;border:1px solid transparent;font-family:inherit;}
    .lsh-consent-banner button.lsh-accept{background:#B0673F;color:#F3EEE4;}
    .lsh-consent-banner button.lsh-reject{background:transparent;color:#2E2A22;border-color:#C9BFAC;}
  `;
  document.head.appendChild(style);
}

/** Injects the banner DOM and wires up both buttons. Returns nothing; the banner removes
 * itself from the DOM as soon as either button is clicked. */
function renderBanner(onDecision) {
  const el = document.createElement('div');
  el.className = 'lsh-consent-banner';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'แจ้งการเก็บข้อมูลตาม PDPA');
  el.innerHTML = `
    <div class="lsh-consent-banner__inner">
      <p>เว็บไซต์นี้ใช้ Google Analytics และเก็บ IP Address เพื่อปรับปรุงการใช้งาน
      คุณสามารถเลือกยินยอมหรือปฏิเสธการเก็บข้อมูลที่ไม่จำเป็นได้</p>
      <div class="lsh-consent-banner__actions">
        <button type="button" class="lsh-reject">ปฏิเสธที่ไม่จำเป็น</button>
        <button type="button" class="lsh-accept">ยินยอมทั้งหมด</button>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  function decide(accepted) {
    el.remove();
    onDecision(accepted);
  }
  el.querySelector('.lsh-accept').addEventListener('click', () => decide(true));
  el.querySelector('.lsh-reject').addEventListener('click', () => decide(false));
}

/** Writes the ConsentRecord to Firestore. Local caching happens synchronously before this is
 * even called (see init()), so the banner UX never blocks on network/Firestore latency. */
async function persistConsent(accepted) {
  const app = getFirebaseApp();
  if (!app) {
    console.warn(
      '[consent-banner] window.LSH_FIREBASE_CONFIG not found — consent was recorded in ' +
      'localStorage only, NOT written to Firestore. Load firebase-config.js (see ' +
      'firebase-config.example.js) before this script for real PDPA-compliant persistence.',
    );
    return;
  }
  try {
    const uid = await resolveUserId(app);
    const db = getFirestore(app);
    await addDoc(collection(db, COLLECTION_NAME), {
      user_account_id: uid, // null if not logged in yet (architecture.md ConsentRecord.user_account_id)
      analytics_consent: accepted, // single-toggle: always equal to marketing_consent, see file header
      marketing_consent: accepted,
      timestamp: serverTimestamp(),
    });
    const cached = readLocalConsent() || {};
    cached.synced = true;
    saveLocalConsent(cached);
  } catch (err) {
    console.error(
      '[consent-banner] Failed to write ConsentRecord to Firestore (local copy still kept ' +
      'so the banner will not reappear, but there is no server-side evidence of this consent):',
      err,
    );
  }
}

function init() {
  getOrCreateAnonId(); // ensure it exists even if never used elsewhere on this page
  const existing = readLocalConsent();
  if (existing) return; // already asked this browser once — BL-015/016 only require asking once

  injectStyles();
  renderBanner((accepted) => {
    saveLocalConsent({
      analytics_consent: accepted,
      marketing_consent: accepted,
      answered_at: new Date().toISOString(),
      synced: false,
    });
    // Fire-and-forget from the UI's perspective: the banner is already gone by the time this
    // promise settles. Errors are caught and logged inside persistConsent(), never thrown here.
    persistConsent(accepted);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Small public API — lets other scripts check consent state, and lets Playwright/manual tests
// reset local state between runs without clearing all of localStorage.
window.LSHConsent = {
  hasAnswered: () => !!readLocalConsent(),
  getConsent: () => readLocalConsent(),
  resetForTesting: () => { try { localStorage.removeItem(LS_KEY); } catch (e) { /* ignore */ } },
};

export { persistConsent as _persistConsentForTesting };
