# lsh-ai-proxy — Cloudflare Worker (AI backend proxy + Access Log)

> ชื่อ Worker (`lsh-ai-proxy`) เป็นชื่อเดิมจากตอนที่มีแค่ AI proxy — ตั้งแต่ 2026-09-23 (Part 5)
> Worker เดียวกันนี้ยังรับผิดชอบ endpoint `/log-access` (BL-014 — Access Log) ด้วย ไม่ได้แยก
> Worker ใหม่ เพราะ Worker นี้แก้ปัญหาเดียวกันทั้งคู่ (ต้องมี server ที่เห็น IP จริง/verify token
> ได้ ซึ่ง client-side JS ทำเองไม่ได้)

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

**FR-1.1 (ปรับภาพให้สวยด้วย AI) ยังไม่ implement เต็มรูปแบบ** — ตอนนี้มีระบบอัปโหลดภาพจริงแล้ว
(ดู `POST /upload-image` ด้านล่าง, เพิ่ม 2026-09-23) แต่ endpoint ที่เรียก AI มาปรับภาพจริง
(image-to-image) ยังไม่ implement เพราะต้องตัดสินใจเพิ่ม (เลือกโมเดล AI ปรับภาพ, ต้นทุนต่อครั้ง)
ซึ่งเป็นคนละสโคปจากงานอัปโหลด — ปุ่ม "✨ ให้ AI ปรับภาพให้สวย" ใน `community-create-content.html`
ยังปิดใช้งานต่อไปพร้อมข้อความอธิบายเหตุผลที่ชัดเจน ไม่ใช่ของปลอม

### `POST /upload-image` + `GET /image/<key>` (เพิ่ม 2026-09-23 — BL-001 prerequisite)

อัปโหลด/ดึงรูปภาพจริงที่ชุมชนอัปโหลดใน `community-create-content.html` — เก็บบน **Cloudflare R2**
แทน Firebase Storage เพราะ Firebase Storage บังคับอัปเกรดเป็นแผน Blaze (ผูกบัตรเครดิต) แม้ใช้ไม่
เกิน free tier ก็ตาม เหตุผลเดียวกับที่เลือก Cloudflare Workers แทน Firebase Cloud Functions ไปแล้ว
ก่อนหน้านี้ — R2 free tier ให้ 10GB เก็บฟรีไม่ต้องผูกบัตร (ผู้ใช้ควรตรวจสอบในแดชบอร์ด Cloudflare
ของตัวเองอีกครั้งตอน deploy จริง เผื่อเงื่อนไขเปลี่ยนไปจากตอนเขียนเอกสารนี้)

- **`POST /upload-image`** — ต้องแนบ `Authorization: Bearer <Firebase ID token>` เหมือน `/ai/*`
  (ไม่ใช่ anonymous เหมือน `/log-access`) body เป็นไบต์ไฟล์ภาพดิบ ไม่ใช่ JSON, header
  `Content-Type` ต้องเป็น `image/jpeg` / `image/png` / `image/webp` / `image/gif` เท่านั้น
  จำกัดขนาดไม่เกิน 5MB — คืนค่า `{ ok: true, url: "https://<worker>/image/<key>" }`
- **`GET /image/<key>`** — **ไม่บังคับ login** (ตั้งใจ) เพราะรูปภาพประกอบคอนเทนต์ที่เผยแพร่แล้ว
  ต้องดูได้แบบ public เหมือนหน้าอื่นที่ไม่ต้อง login (เช่น `published-works.html`) — cache
  `max-age=31536000, immutable` เพราะแต่ละ key ไม่ถูก overwrite ซ้ำ (อัปโหลดใหม่ = key ใหม่เสมอ)

**ต้องสร้าง R2 bucket เองก่อน deploy** (ดูคำสั่งในหัวข้อ "Deploy จริง" ด้านล่าง) — ต่างจาก secret
ตรงที่ bucket binding (`IMAGES_BUCKET` → `lsh-community-images`) กำหนดไว้ใน `wrangler.toml` แล้ว
(commit เข้า repo ได้ปกติ ไม่ใช่ความลับ) แค่ตัว bucket ต้องมีอยู่จริงบน Cloudflare ก่อน `wrangler deploy`
ถึงจะ bind สำเร็จ

response ทุก endpoint: `{ ok: true, result: "..." }` หรือ `{ ok: false, error: "..." }`

Log การเรียกทุกครั้ง (สำเร็จ/ไม่สำเร็จ) ถูกเขียนลง Firestore collection `AiAssistLogs` ผ่าน
Firestore REST API โดยใช้ ID token ของผู้เรียกเอง (ไม่ต้องมี service account key เพิ่มในนี้เลย —
ใช้สิทธิ์ตาม `firestore.rules` ที่มีอยู่แล้ว)

### `POST /log-access` (เพิ่ม 2026-09-23, Part 5 — BL-014, Access Log)

ต่างจาก endpoint `/ai/*` ด้านบนตรงที่**ไม่บังคับต้องมี ID token** — ต้อง log ได้แม้ผู้เข้าชมไม่เคย
login เลย (พ.ร.บ. คอมพิวเตอร์บังคับเก็บ log ของทุกคนที่เข้าใช้งาน ไม่ใช่แค่คนที่ login) แนบ token
มาด้วยก็ได้ (ไม่บังคับ) — ถ้าแนบมาและ valid จะบันทึก `user_account_id` ไปด้วย ถ้าไม่มี/ไม่ valid ก็
ยัง log ต่อแบบ anonymous (ไม่ปฏิเสธ request)

| Field ที่ Worker เติมเอง | ที่มา |
|---|---|
| `ip_address` | header `CF-Connecting-IP` ที่ Cloudflare ใส่ให้อัตโนมัติ (client ปลอมไม่ได้) |
| `user_agent` | header `User-Agent` ของ request |
| `user_account_id` | ผลจาก verify ID token ถ้ามีแนบมาและ valid เท่านั้น (ไม่เชื่อ field `uid` ที่ client ส่งมาตรงๆ) |
| `timestamp` | เวลาที่ Worker รับ request |

Payload จาก client มีแค่ `{ action }` (ข้อความสั้นๆ บอกว่ากำลังดูหน้าไหน เช่น `view:tourist-home-consent.html`)

**เขียนด้วย ID token ของ uid คงที่ `access-log-worker` แทน ID token ของผู้เรียก** (ต่างจาก
endpoint อื่นทั้งหมดในไฟล์นี้ที่ใช้ token ของผู้เรียกเอง) เพราะผู้เรียกอาจไม่มี ID token เลย
(anonymous) — Worker เซ็น **Firebase custom token** สำหรับ uid นี้ด้วย private key ของ service
account แล้วแลกเป็น ID token จริงผ่าน `signInWithCustomToken` (ดูเหตุผลเต็มที่คอมเมนต์บนสุดของ
`src/index.js` ส่วน "Firestore access for anonymous /log-access writes")

⚠️ **แก้ไข 2026-09-23 (จำกัดสิทธิ์แคบลงจากการออกแบบรอบแรก)**: เดิมทีเดียวใช้ OAuth2 access token
ที่มี scope `datastore` ซึ่ง **บายพาส `firestore.rules` ไปเลยทั้งระบบ** (เหมือนที่
`firebase-admin`/`LSH/scripts/seed-firestore.js` ทำ) — ผู้ประสานงานรีวิวแล้วเห็นว่าเสี่ยงเกินไป
(secret หลุด = เข้าถึงทั้งฐานข้อมูลได้) จึงเปลี่ยนมาใช้วิธีนี้แทน: การเขียนยังผ่าน
`firestore.rules` ตามปกติ เพียงแต่ authenticate เป็น uid พิเศษที่ไม่ตรงกับผู้ใช้จริงคนไหนเลย
(`access-log-worker`) ซึ่ง rule อนุญาตให้ทำได้แค่ `create` บน `AccessLogs` เท่านั้น ไม่มีสิทธิ์อื่น
เลยในทั้งระบบ — ถ้า secret หลุด ผลกระทบจึงจำกัดอยู่แค่ "เขียน AccessLogs ปลอมได้" ไม่ใช่
"เข้าถึง/แก้ไขข้อมูลทุกอย่างในฐานข้อมูล" **ความเสี่ยงที่ยังเหลืออยู่**: private key เดียวกันนี้ใช้
เซ็น custom token ได้ (ในทางเทคนิค) สำหรับ uid ไหนก็ได้ ไม่ใช่แค่ `access-log-worker` — ถ้า key
หลุดจริง คนร้ายสามารถปลอมเป็น uid อื่น (เช่น uid ของอาจารย์) แล้วใช้สิทธิ์เท่าที่ `firestore.rules`
อนุญาตให้ role นั้นทำได้ ไม่ใช่ "แค่เขียน AccessLogs" เป๊ะๆ ตามที่ตั้งใจ 100% — แต่ยังแคบกว่าการ
บายพาส rule ทั้งระบบมาก เพราะยังต้องอิงกับสิทธิ์ที่ rule กำหนดไว้ต่อ uid นั้นเสมอ ไม่ใช่เข้าถึงได้
ทุกอย่างแบบไม่มีเงื่อนไข — เก็บ `FIREBASE_SERVICE_ACCOUNT_JSON` เป็นความลับอย่างเข้มงวดเหมือนเดิม

**ต้องมี secret เพิ่ม 1 ตัว**: `FIREBASE_SERVICE_ACCOUNT_JSON` — service account key (คนละตัวกับ
`LSH/serviceAccountKey.json` เดิมที่ใช้ตอน seed ข้อมูล จะสร้างใหม่หรือใช้ตัวเดิมก็ได้) วิธีขอ:
Firebase Console → โปรเจกต์ `lsh-nammon` → ⚙️ Project Settings → Service Accounts → Generate new
private key → ดาวน์โหลดไฟล์ JSON แล้วตั้งเป็น secret (ดูขั้นตอน `wrangler secret put` ด้านล่าง —
วางเนื้อหาไฟล์ JSON ทั้งไฟล์เป็นสตริงเดียวตอนถูกถาม) — **ต้องมีอีก var 1 ตัวที่ไม่ใช่ secret**:
`FIREBASE_WEB_API_KEY` ตั้งไว้ใน `wrangler.toml` แล้ว (ค่าเดียวกับ `apiKey` ใน
`docs/02-design/01-prototypes/prototype-v2/firebase-config.js` — เป็น public key ไม่ใช่ความลับ)

### response ทุก endpoint

`{ ok: true, result: "..." }` หรือ `{ ok: false, error: "..." }` — ยกเว้น `/log-access` ที่ตอบแค่
`{ ok: true }` เสมอ (ไม่รอผลเขียนจริงก่อนตอบ — ดู `ctx.waitUntil()` ในโค้ด)

## Deploy จริง (ต้องทำเองเท่านั้น — agent ห้ามรันขั้นตอนนี้)

```bash
cd cf-worker
npm install
npx wrangler login          # เปิดเบราว์เซอร์ให้ login ด้วยบัญชี Cloudflare ของคุณ (สมัครฟรีได้ที่ dash.cloudflare.com ถ้ายังไม่มี — ไม่ต้องผูกบัตร)
npx wrangler secret put OPENROUTER_API_KEY            # แปะ API key จริงจาก https://openrouter.ai/keys ตอนถูกถาม
npx wrangler secret put FIREBASE_SERVICE_ACCOUNT_JSON # แปะเนื้อหาไฟล์ JSON ทั้งไฟล์ (ดูวิธีขอด้านบน § /log-access)
npx wrangler r2 bucket create lsh-community-images    # สร้าง R2 bucket ครั้งเดียว (ดูหัวข้อ /upload-image ด้านบน) — ต้องมีก่อน deploy ถึงจะ bind สำเร็จ
npx wrangler deploy
```

หลัง deploy สำเร็จจะได้ URL รูปแบบ `https://lsh-ai-proxy.<your-subdomain>.workers.dev` — เอา URL
นี้ไปตั้งเป็น `window.LSH_AI_PROXY_URL` ใน `docs/02-design/01-prototypes/prototype-v2/ai-assist-config.js`
(ดูตัวอย่างใน `ai-assist-config.example.js` ที่อัปเดตแล้ว) แล้ว deploy hosting ใหม่อีกครั้ง

### ตั้งค่า Firestore TTL policy (BL-014 — ลบ Access Log อัตโนมัติหลัง 90 วัน)

ไม่ต้องเขียน scheduled function ลบเองเลย — Firestore มีฟีเจอร์ TTL (Time-to-Live) ในตัวที่ใช้ได้
บนแผนฟรี Spark โดยตรง (ไม่ต้องอัปเกรด Blaze) ตั้งค่าผ่าน Firebase Console ครั้งเดียว **หลัง deploy
Worker แล้ว**:

1. ต้องมีเอกสารอย่างน้อย 1 ชิ้นใน collection `AccessLogs` ก่อน Console ถึงจะรู้จัก collection group
   นี้ (เข้าเว็บที่ deploy แล้วสักครั้งหลังตั้งค่า secret ครบ)
2. ไปที่ [Firebase Console](https://console.firebase.google.com/project/lsh-nammon/firestore) →
   Firestore Database → แท็บ **Time-to-live** (อยู่แถวเดียวกับแท็บ Data/Rules/Indexes)
3. กด **Create policy** → Collection group ID: `AccessLogs` → Timestamp field: **`expires_at`**
   (⚠️ ไม่ใช่ `timestamp`) → บันทึก

**ทำไมต้องเป็น `expires_at` ไม่ใช่ `timestamp`**: Firestore TTL ลบเอกสารเมื่อเวลาปัจจุบันเลย
"ค่าที่เก็บใน field นั้นตรงๆ" ไปแล้ว (field ต้องเป็นเวลาหมดอายุจริง ไม่ใช่ระยะห่าง/เวลาที่เกิดเหตุ) —
`timestamp` ใน field ที่ Business Rule กำหนด หมายถึง "เวลาที่เข้าใช้งานจริง" (ใช้แสดงในหน้า Access
Log ของอาจารย์) จึงเก็บ field แยกต่างหากชื่อ `expires_at` = `timestamp + 90 วัน` ไว้เฉพาะให้ TTL
policy อ่านเท่านั้น (ดูคอมเมนต์ใน `src/index.js` § `writeAccessLog`) — เอกสารจะถูกลบภายในไม่กี่วัน
หลังพ้น `expires_at` ไปแล้ว (Firestore ไม่รับประกันลบทันทีเป๊ะวินาที แต่ไม่ลบก่อนกำหนดแน่นอน)

## ทดสอบ local (ไม่ต้อง login Cloudflare)

```bash
cd cf-worker
npm install
cp .dev.vars.example .dev.vars   # แล้วใส่ API key + service account จริงถ้ามี (ไม่บังคับ — ทดสอบ auth/routing ได้แม้ไม่มี key จริง)
npx wrangler dev
```

`wrangler dev` รันในโหมด local ได้โดยไม่ต้อง login — ใช้ทดสอบ routing/auth verification/CORS ได้
ครบ มีแค่การเรียก OpenRouter/Firestore จริงเท่านั้นที่ต้องมี key จริงถึงจะได้ผลจริง

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
- `/upload-image` ต้องมี ID token ที่ valid เหมือน `/ai/*` (กันคนนอกยิงอัปโหลดตรงเข้ามาใช้ quota
  ฟรีของ R2), เช็ค `Content-Type` เทียบ allowlist ภาพจริงเท่านั้น (JPEG/PNG/WEBP/GIF) และจำกัด
  ขนาดไม่เกิน 5MB ต่อไฟล์ — `/image/<key>` เปิด public โดยตั้งใจ (ดูเหตุผลในหัวข้อ endpoint ด้านบน)
