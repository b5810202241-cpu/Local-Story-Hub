/**
 * access-log.js — Local Story Hub (เพิ่ม 2026-09-23, Part 5/5 — BL-014)
 * ============================================================
 * บันทึก Access Log ทุกครั้งที่โหลดหน้า ตามข้อบังคับพ.ร.บ. คอมพิวเตอร์ (เก็บอย่างน้อย 90 วัน) —
 * ดู docs/01-requirements/01-spec/20260822-01-it-log-pdpa-consent.md (FR-1) และ
 * docs/02-design/02-technical/architecture.md § AccessLog
 *
 * HOW TO USE — รวมไว้ในทุกหน้าของ prototype-v2 (หลัง firebase-config.js ถ้ามี):
 *   <script src="firebase-config.js"></script>   <!-- ไม่บังคับ — ถ้าไม่มีก็ยัง log แบบ anonymous ได้ -->
 *   <script src="ai-assist-config.js"></script>  <!-- ตั้งค่า window.LSH_AI_PROXY_URL -->
 *   <script type="module" src="access-log.js"></script>
 *
 * ทำไมต้องเป็น Cloudflare Worker แทนที่จะเขียน Firestore ตรงจาก client:
 *   - ต้องรู้ IP จริงของผู้เข้าชม (Business Rule บังคับเก็บ `ip_address`) — client-side JS หาค่านี้
 *     เองไม่ได้ ต้องพึ่ง header ที่ edge/proxy เห็น (Cloudflare ส่ง `CF-Connecting-IP` ให้ Worker
 *     อัตโนมัติ)
 *   - ต้อง log ได้แม้ผู้ใช้ไม่ login เลย (ผู้เข้าชมแบบ anonymous ก็ต้องถูกนับตามพ.ร.บ. คอมพิวเตอร์)
 *     ซึ่งไม่มี ID token ให้ยึดสิทธิ์ผ่าน firestore.rules ปกติได้ — ดูเหตุผลเต็มที่คอมเมนต์บนสุดของ
 *     cf-worker/src/index.js (ใช้ service account เขียนแทน ไม่ใช่ token ของผู้เรียก)
 *
 * ไม่ผูกกับ Consent banner (consent-banner.js) โดยเจตนา — access log ตามพ.ร.บ. คอมพิวเตอร์เป็น
 * ข้อบังคับทางกฎหมายที่ระบบต้องทำกับผู้เข้าชมทุกคนเสมอ ไม่ใช่สิ่งที่ขอความยินยอมแบบ Google Analytics/
 * IP tracking เพื่อการตลาด (ดู FR-1 ของสเปคเดียวกัน — ไม่มีเงื่อนไขผูกกับ Consent เลย) จึงยิงคำขอนี้
 * ทันทีที่โหลดหน้า ไม่รอผลจาก consent banner ก่อน
 *
 * Fire-and-forget เสมอ: ไม่ throw ไม่แสดง error ให้ผู้ใช้เห็น ไม่บล็อกการแสดงผลหน้าเว็บแม้แต่วินาทีเดียว
 */

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

function getFirebaseApp() {
  try {
    if (!window.LSH_FIREBASE_CONFIG) return null;
    return getApps().length ? getApp() : initializeApp(window.LSH_FIREBASE_CONFIG);
  } catch (err) {
    return null;
  }
}

/** รอสถานะ auth เริ่มต้นแค่สั้นๆ (สูงสุด 1.5 วินาที) — ไม่ยอมให้การ resolve uid ทำให้หน้าเว็บ
 * ดูช้าลง ถ้า Firebase ยังไม่ทันตอบก็ log แบบไม่มี uid ไปก่อน (ดีกว่าไม่ log เลย) */
function resolveIdTokenWithTimeout(app, timeoutMs) {
  return new Promise((resolve) => {
    if (!app) return resolve(null);
    let done = false;
    const finish = (value) => { if (!done) { done = true; resolve(value); } };
    const timer = setTimeout(() => finish(null), timeoutMs);
    try {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          clearTimeout(timer);
          unsubscribe();
          if (!user) return finish(null);
          try { finish(await user.getIdToken()); } catch (e) { finish(null); }
        },
        () => finish(null),
      );
    } catch (err) {
      clearTimeout(timer);
      finish(null);
    }
  });
}

function hasProxyConfigured() {
  return typeof window.LSH_AI_PROXY_URL !== 'undefined'
    && window.LSH_AI_PROXY_URL
    && window.LSH_AI_PROXY_URL.indexOf('YOUR_SUBDOMAIN') === -1;
}

async function logAccess() {
  if (!hasProxyConfigured()) return; // ยังไม่ deploy Worker จริง — ข้ามเงียบๆ (เหมือนปุ่ม AI อื่น)

  const app = getFirebaseApp();
  const idToken = await resolveIdTokenWithTimeout(app, 1500);
  const action = 'view:' + (document.location.pathname.split('/').pop() || 'index.html') + document.location.search;

  const headers = { 'Content-Type': 'application/json' };
  if (idToken) headers.Authorization = 'Bearer ' + idToken;

  try {
    fetch(window.LSH_AI_PROXY_URL + '/log-access', {
      method: 'POST',
      keepalive: true, // ให้คำขอส่งสำเร็จแม้ผู้ใช้ปิด/ออกจากหน้าเร็ว
      headers,
      body: JSON.stringify({ action }),
    }).catch(() => { /* fire-and-forget — เงียบเสมอ ไม่รบกวนผู้ใช้ */ });
  } catch (e) {
    // เงียบเสมอ
  }
}

logAccess();
