// Local Story Hub — AI backend proxy (Cloudflare Workers)
//
// Replaces the old pattern of calling OpenRouter directly from the browser with an
// OPENROUTER_CONFIG.apiKey embedded in client-side JS (see git history of
// docs/02-design/01-prototypes/prototype-v2/ai-assist-config.js) — the key never
// reaches the browser now; it lives only as a Worker secret (OPENROUTER_API_KEY).
//
// Every request must carry a valid Firebase Auth ID token (Authorization: Bearer <token>)
// for project FIREBASE_PROJECT_ID. Verified here with the Web Crypto API (no Admin SDK —
// that's Node-only and unavailable on Workers). One action (summarize-pending) additionally
// requires role=teacher, checked via a Firestore REST self-read using the caller's own ID
// token (already permitted by LSH/firestore.rules: users/{uid} read allowed for the owner).

const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour
let jwksCache = null; // { keys: Map<kid, CryptoKey>, fetchedAt: number }

function base64UrlToBytes(b64url) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function base64UrlToJson(b64url) {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(b64url)));
}

async function getJwks() {
  if (jwksCache && (Date.now() - jwksCache.fetchedAt) < JWKS_TTL_MS) return jwksCache.keys;
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error('โหลด public key ของ Firebase ไม่สำเร็จ (HTTP ' + res.status + ')');
  const data = await res.json();
  const keys = new Map();
  for (const jwk of data.keys) {
    const key = await crypto.subtle.importKey(
      'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
    );
    keys.set(jwk.kid, key);
  }
  jwksCache = { keys, fetchedAt: Date.now() };
  return keys;
}

// Verifies a Firebase Auth ID token and returns { uid, email } on success, throws on failure.
async function verifyFirebaseIdToken(idToken, projectId) {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('รูปแบบโทเคนไม่ถูกต้อง');
  const [headerB64, payloadB64, sigB64] = parts;
  const header = base64UrlToJson(headerB64);
  const payload = base64UrlToJson(payloadB64);

  if (header.alg !== 'RS256') throw new Error('อัลกอริทึมโทเคนไม่รองรับ');

  const keys = await getJwks();
  const key = keys.get(header.kid);
  if (!key) throw new Error('ไม่พบ public key ที่ตรงกับโทเคนนี้ (kid ไม่รู้จัก)');

  const data = new TextEncoder().encode(headerB64 + '.' + payloadB64);
  const signature = base64UrlToBytes(sigB64);
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
  if (!valid) throw new Error('ลายเซ็นโทเคนไม่ถูกต้อง');

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp <= nowSec) throw new Error('โทเคนหมดอายุแล้ว');
  if (payload.iat > nowSec + 60) throw new Error('โทเคนยังไม่ถึงเวลาใช้งาน');
  if (payload.aud !== projectId) throw new Error('โทเคนนี้ไม่ได้ออกให้โปรเจกต์นี้ (aud ไม่ตรง)');
  if (payload.iss !== 'https://securetoken.google.com/' + projectId) throw new Error('ผู้ออกโทเคนไม่ถูกต้อง (iss ไม่ตรง)');
  if (!payload.sub) throw new Error('โทเคนไม่มี uid (sub)');

  return { uid: payload.sub, email: payload.email || null };
}

// Reads users/{uid} via the Firestore REST API using the caller's own ID token as
// Bearer auth — allowed by firestore.rules (`allow read: if ... request.auth.uid == userId`).
// Only used to gate the teacher-only action; not needed for the rest.
async function getFirestoreUserRole(idToken, projectId, uid) {
  const url = 'https://firestore.googleapis.com/v1/projects/' + projectId
    + '/databases/(default)/documents/users/' + uid;
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + idToken } });
  if (res.status === 404) return null; // ไม่มีเอกสาร users/{uid} (เช่น บัญชีนักท่องเที่ยวล้วนๆ)
  if (!res.ok) throw new Error('ตรวจสอบสิทธิ์ไม่สำเร็จ (HTTP ' + res.status + ')');
  const doc = await res.json();
  const roleField = doc.fields && doc.fields.role;
  return roleField ? (roleField.stringValue || null) : null;
}

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || 'https://lsh-nammon.web.app')
    .split(',').map((s) => s.trim());
  const isAllowed = allowed.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, extraHeaders || {}),
  });
}

// เนื้อหา prompt ของแต่ละ action สร้างฝั่งเซิร์ฟเวอร์ทั้งหมด — client ส่งแค่ field ข้อมูลดิบ
// ไม่ส่ง prompt ที่ประกอบเสร็จแล้วมาเอง (กันคนยิง endpoint ตรงไปสั่งให้ AI ทำอย่างอื่นนอกสโคป)
const ACTIONS = {
  'rewrite-description': {
    requireRole: null,
    buildMessages(payload) {
      const { title, community, draftDesc } = payload;
      return [{
        role: 'user',
        content: 'ช่วยเรียบเรียงคำอธิบายผลงานสั้น ๆ (ไม่เกิน 3-4 ประโยค) สำหรับเผยแพร่บนเว็บ Local Story Hub\n'
          + 'ชื่อผลงาน: ' + (title || '(ไม่ระบุ)') + '\n'
          + 'ชุมชนที่เกี่ยวข้อง: ' + (community || '(ไม่ระบุ)') + '\n'
          + 'คำอธิบายฉบับร่างจากนิสิต: ' + (draftDesc || '(ยังไม่มี ให้ช่วยแต่งตัวอย่างจากชื่อผลงานและชุมชนแทน)') + '\n'
          + 'ตอบเป็นภาษาไทย เฉพาะข้อความคำอธิบายเท่านั้น ห้ามมีคำนำหรือคำอธิบายเพิ่มเติม',
      }];
    },
  },
  'summarize-pending': {
    requireRole: 'teacher',
    buildMessages(payload) {
      const works = Array.isArray(payload.works) ? payload.works.slice(0, 50) : [];
      const listText = works.map((w, i) => (
        (i + 1) + '. ชื่อผลงาน: ' + (w.title || '(ไม่ระบุ)')
        + ' | ผู้ส่ง: ' + (w.requesterName || '(ไม่ระบุ)')
        + ' | ชุมชน: ' + (w.community || '(ไม่ระบุ)')
        + ' | คำอธิบาย: ' + (w.content || '(ไม่มี)')
      )).join('\n');
      return [{
        role: 'user',
        content: 'ต่อไปนี้คือรายการผลงานของนิสิตที่รอการพิจารณาจากอาจารย์ทั้งหมด ' + works.length + ' รายการ:\n\n'
          + listText + '\n\n'
          + 'ช่วยสรุปภาพรวมสั้นๆ เป็นภาษาไทย (ไม่เกิน 6-8 บรรทัด) ให้อาจารย์อ่านก่อนตรวจทีละชิ้น '
          + 'เช่น มีกี่รายการ กระจายไปชุมชนไหนบ้าง มีธีม/ประเด็นร่วมอะไรที่น่าสนใจ ตอบเฉพาะเนื้อหาสรุปเท่านั้น ห้ามมีคำนำ',
      }];
    },
  },
  caption: {
    requireRole: null,
    buildMessages(payload) {
      const keywords = (payload.keywords || '').toString().slice(0, 300);
      return [{
        role: 'user',
        content: 'คิดแคปชันโพสต์สำหรับเนื้อหาท่องเที่ยวชุมชน จาก keyword ต่อไปนี้: ' + (keywords || '(ไม่ระบุ)') + '\n'
          + 'ภาษาไทย กระชับ น่าสนใจ ความยาว 1-2 ประโยค ตอบเฉพาะแคปชันเท่านั้น ห้ามมีคำนำ',
      }];
    },
  },
  translate: {
    requireRole: null,
    buildMessages(payload) {
      const text = (payload.text || '').toString().slice(0, 4000);
      return [{
        role: 'user',
        content: 'แปลข้อความต่อไปนี้จากภาษาไทยเป็นภาษาอังกฤษ รักษาโทนการเล่าเรื่องแบบ storytelling ไว้:\n\n'
          + text + '\n\nตอบเฉพาะคำแปลภาษาอังกฤษเท่านั้น ห้ามมีคำนำหรือใส่ต้นฉบับภาษาไทยกลับมาด้วย',
      }];
    },
  },
  seo: {
    requireRole: null,
    buildMessages(payload) {
      const text = (payload.text || '').toString().slice(0, 4000);
      return [{
        role: 'user',
        content: 'วิเคราะห์เนื้อหาต่อไปนี้แล้วแนะนำคำสำคัญ (keyword) ที่คนอาจใช้ค้นหาเนื้อหานี้ 5-8 คำ:\n\n'
          + text + '\n\nตอบเป็นภาษาไทย เป็น list คั่นด้วยเครื่องหมายจุลภาค (,) เท่านั้น ห้ามมีคำนำหรือคำอธิบายเพิ่มเติม',
      }];
    },
  },
  'story-suggestion': {
    requireRole: null,
    buildMessages(payload) {
      const topic = (payload.topic || '').toString().slice(0, 1000);
      return [{
        role: 'user',
        content: 'ชุมชนต้องการเล่าเรื่องเกี่ยวกับหัวข้อ/ประเด็นต่อไปนี้: ' + (topic || '(ไม่ระบุ)') + '\n'
          + 'ช่วยแนะนำแนวทาง/โครงเรื่องสั้นๆ 3-5 ข้อ ที่จะทำให้เล่าเรื่องนี้ได้น่าสนใจสำหรับนักท่องเที่ยว '
          + 'ตอบเป็นภาษาไทย เป็นรายการข้อ ห้ามมีคำนำ',
      }];
    },
  },
};

async function callOpenRouter(env, messages) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: 'Bearer ' + env.OPENROUTER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: env.AI_MODEL || 'google/gemini-2.5-flash-lite', messages }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data.error && data.error.message) || ('HTTP ' + res.status));
    return data.choices[0].message.content.trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

// บันทึก log การเรียก AI ทุกครั้งลง Firestore (collection AiAssistLogs) ผ่าน REST API โดยใช้
// ID token ของผู้เรียกเอง — ใช้ rule เดิมที่อนุญาตให้ผู้ใช้ที่ login สร้าง log ของตัวเองอยู่แล้ว
// ไม่ await ผลลัพธ์นี้ในผู้เรียก (fire-and-forget เหมือน pattern เดิมของ client-side)
async function logAiAssistUse(env, idToken, uid, action, payload, result, error) {
  try {
    const url = 'https://firestore.googleapis.com/v1/projects/' + env.FIREBASE_PROJECT_ID
      + '/databases/(default)/documents/AiAssistLogs';
    const fields = {
      action: { stringValue: action },
      requesterId: { stringValue: uid },
      success: { booleanValue: !error },
      resultText: result ? { stringValue: result.slice(0, 4000) } : { nullValue: null },
      errorMessage: error ? { stringValue: String(error).slice(0, 1000) } : { nullValue: null },
      model: { stringValue: env.AI_MODEL || 'google/gemini-2.5-flash-lite' },
      createdAt: { timestampValue: new Date().toISOString() },
    };
    await fetch(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + idToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
  } catch (e) {
    // เหมือนเดิม — log พังไม่กระทบผลลัพธ์ที่ส่งให้ผู้ใช้เห็น แค่ปล่อยผ่าน (มองเห็นได้จาก Worker logs)
    console.error('logAiAssistUse failed', e);
  }
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405, cors);

    const url = new URL(request.url);
    const action = url.pathname.replace(/^\/ai\//, '');
    const spec = ACTIONS[action];
    if (!spec) return json({ ok: false, error: 'ไม่รู้จัก action นี้: ' + action }, 404, cors);

    const authHeader = request.headers.get('Authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) return json({ ok: false, error: 'ต้อง login ก่อนใช้งานฟีเจอร์ AI นี้' }, 401, cors);

    let uid;
    try {
      const verified = await verifyFirebaseIdToken(idToken, env.FIREBASE_PROJECT_ID);
      uid = verified.uid;
    } catch (e) {
      return json({ ok: false, error: 'ยืนยันตัวตนไม่สำเร็จ: ' + e.message }, 401, cors);
    }

    if (spec.requireRole) {
      let role = null;
      try {
        role = await getFirestoreUserRole(idToken, env.FIREBASE_PROJECT_ID, uid);
      } catch (e) {
        return json({ ok: false, error: e.message }, 500, cors);
      }
      if (role !== spec.requireRole) {
        return json({ ok: false, error: 'ฟีเจอร์นี้ใช้ได้เฉพาะบทบาท ' + spec.requireRole + ' เท่านั้น' }, 403, cors);
      }
    }

    if (!env.OPENROUTER_API_KEY) {
      return json({ ok: false, error: 'AI backend ยังไม่ได้ตั้งค่า OPENROUTER_API_KEY (ผู้ดูแลระบบต้องรัน wrangler secret put)' }, 503, cors);
    }

    let payload = {};
    try {
      payload = await request.json();
    } catch (e) {
      return json({ ok: false, error: 'รูปแบบ request ไม่ถูกต้อง (ต้องเป็น JSON)' }, 400, cors);
    }

    const messages = spec.buildMessages(payload);
    try {
      const result = await callOpenRouter(env, messages);
      // fire-and-forget แบบไม่ block response — แต่ต้องใช้ ctx.waitUntil() เสมอ ไม่งั้น Cloudflare
      // Workers จะฆ่า promise นี้ทิ้งทันทีที่ response ถูกส่งกลับไปแล้ว (พบบั๊กนี้จริงตอนทดสอบ:
      // ยิง request ตรงๆ ทีละครั้งแล้วรอ log ก่อนค่อยยิงต่อ เขียนสำเร็จ แต่ยิงรัวๆ จาก browser จริง
      // ไม่เขียนเลยสักครั้ง — สาเหตุคือ isolate ถูกฆ่าก่อน fetch() ไป Firestore เสร็จ)
      ctx.waitUntil(logAiAssistUse(env, idToken, uid, action, payload, result, null));
      return json({ ok: true, result }, 200, cors);
    } catch (e) {
      const message = e.name === 'AbortError' ? 'หมดเวลารอคำตอบจาก AI (เกิน 20 วินาที) ลองใหม่อีกครั้ง' : e.message;
      ctx.waitUntil(logAiAssistUse(env, idToken, uid, action, payload, null, message));
      return json({ ok: false, error: message }, 502, cors);
    }
  },
};
