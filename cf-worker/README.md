# lsh-ai-proxy — Cloudflare Worker (AI backend proxy)

แทนที่รูปแบบเดิมที่เรียก OpenRouter ตรงจาก browser พร้อม API key ฝัง client-side
(`docs/02-design/01-prototypes/prototype-v2/ai-assist-config.js`) — key ไม่ต้องอยู่ฝั่ง client
อีกต่อไป เก็บเป็น Cloudflare secret แทน

เลือกใช้ Cloudflare Workers แทน Firebase Cloud Functions เพราะผู้ใช้ไม่ต้องการผูกบัตรเครดิตกับ
Firebase (Cloud Functions บังคับต้องอัปเกรดเป็นแผน Blaze) — Cloudflare Workers free tier ใช้ได้
โดยไม่ต้องผูกบัตร (100,000 requests/วัน)

## Endpoints

ทุก endpoint เป็น `POST /ai/<action>` ต้องแนบ header `Authorization: Bearer <Firebase ID token>`
เสมอ (ยืนยันตัวตนด้วย public key ของ Firebase ผ่าน Web Crypto API — ไม่ได้ใช้ Firebase Admin SDK
เพราะเป็น Node-only ใช้บน Workers ไม่ได้)

| Action | ใช้โดย | Payload | Business Rule |
|---|---|---|---|
| `rewrite-description` | นิสิต (`student-publish.html`) | `{ title, community, draftDesc }` | ของเดิม ย้ายมาเรียกผ่าน Worker |
| `summarize-pending` | อาจารย์ (`admin-review-student-work.html`) — **ต้อง role=teacher เท่านั้น** | `{ works: [{title, requesterName, community, content}] }` | ของเดิม ย้ายมาเรียกผ่าน Worker |
| `caption` | ชุมชน (`community-create-content.html`) | `{ keywords }` | FR-1.2 |
| `translate` | ชุมชน + นักท่องเที่ยว (`community-create-content.html`, `tourist-story-detail.html`) | `{ text }` (ไทย→อังกฤษ) | FR-1.3, FR-2.2 |
| `seo` | ชุมชน (`community-create-content.html`) | `{ text }` | FR-1.4 |
| `story-suggestion` | ชุมชน (`community-create-content.html`) | `{ topic }` | FR-1.5 |

**FR-1.1 (ปรับภาพให้สวยด้วย AI) ยังไม่ implement ในรอบนี้** — ตัว `community-create-content.html`
ไม่มีระบบอัปโหลดภาพจริงเลย (ปุ่ม "เลือกไฟล์" เป็นแค่ placeholder ที่ตั้งชื่อไฟล์ปลอม ไม่มีการอัปโหลด
จริงขึ้น Storage) การทำ endpoint ปรับภาพจริงต้องมีระบบอัปโหลดภาพจริงก่อน (Firebase Storage หรือ
เทียบเท่า) ซึ่งเป็นงานคนละสโคปจาก "AI backend proxy" — ปุ่มนี้ยังคงปิดใช้งานต่อไปพร้อมข้อความ
อธิบายเหตุผลที่ชัดเจน ไม่ใช่ของปลอม

response ทุก endpoint: `{ ok: true, result: "..." }` หรือ `{ ok: false, error: "..." }`

Log การเรียกทุกครั้ง (สำเร็จ/ไม่สำเร็จ) ถูกเขียนลง Firestore collection `AiAssistLogs` ผ่าน
Firestore REST API โดยใช้ ID token ของผู้เรียกเอง (ไม่ต้องมี service account key เพิ่มในนี้เลย —
ใช้สิทธิ์ตาม `firestore.rules` ที่มีอยู่แล้ว)

## Deploy จริง (ต้องทำเองเท่านั้น — agent ห้ามรันขั้นตอนนี้)

```bash
cd cf-worker
npm install
npx wrangler login          # เปิดเบราว์เซอร์ให้ login ด้วยบัญชี Cloudflare ของคุณ (สมัครฟรีได้ที่ dash.cloudflare.com ถ้ายังไม่มี — ไม่ต้องผูกบัตร)
npx wrangler secret put OPENROUTER_API_KEY   # แปะ API key จริงจาก https://openrouter.ai/keys ตอนถูกถาม
npx wrangler deploy
```

หลัง deploy สำเร็จจะได้ URL รูปแบบ `https://lsh-ai-proxy.<your-subdomain>.workers.dev` — เอา URL
นี้ไปตั้งเป็น `window.LSH_AI_PROXY_URL` ใน `docs/02-design/01-prototypes/prototype-v2/ai-assist-config.js`
(ดูตัวอย่างใน `ai-assist-config.example.js` ที่อัปเดตแล้ว) แล้ว deploy hosting ใหม่อีกครั้ง

## ทดสอบ local (ไม่ต้อง login Cloudflare)

```bash
cd cf-worker
npm install
cp .dev.vars.example .dev.vars   # แล้วใส่ API key จริงถ้ามี (ไม่บังคับ — ทดสอบ auth/routing ได้แม้ไม่มี key จริง)
npx wrangler dev
```

`wrangler dev` รันในโหมด local ได้โดยไม่ต้อง login — ใช้ทดสอบ routing/auth verification/CORS ได้
ครบ มีแค่การเรียก OpenRouter จริงเท่านั้นที่ต้องมี key จริงถึงจะได้คำตอบจริง

## ความปลอดภัย

- API key ของ OpenRouter อยู่เป็น Cloudflare secret เท่านั้น ไม่เคยอยู่ในโค้ดที่ commit หรือส่งถึง
  browser เลย
- ทุก request ต้องมี Firebase ID token ที่ valid (verify ด้วย public key ของ Firebase ผ่าน Web
  Crypto API — เช็ค signature, `exp`, `aud`, `iss` ครบ) กันคนนอกยิง endpoint ตรงมาใช้ quota ฟรี
- `summarize-pending` ตรวจ role เพิ่มว่าต้องเป็น `teacher` เท่านั้น (อ่าน `users/{uid}` ผ่าน
  Firestore REST API ด้วย ID token ของผู้เรียกเอง — ใช้สิทธิ์ self-read ที่มีอยู่แล้วใน
  `firestore.rules` ไม่ต้องมี service account เพิ่ม)
- prompt ของทุก action ถูกประกอบขึ้นฝั่งเซิร์ฟเวอร์จาก field ข้อมูลดิบที่ client ส่งมาเท่านั้น
  (ไม่รับ prompt สำเร็จรูปจาก client) กันคนยิง endpoint ตรงไปสั่งให้ AI ทำงานนอกสโคป
- CORS จำกัดเฉพาะ origin ใน `ALLOWED_ORIGINS` (ตั้งค่าใน `wrangler.toml`) บวก `localhost` (ทุก
  port) สำหรับตอน dev เท่านั้น
