# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ภาพรวมโปรเจกต์และสถานะปัจจุบัน

โปรเจกต์จริงคือ **Local Story Hub** (AI-powered Community Storytelling & Learning Platform) สเปคจริงชุดแรกอยู่ที่ `docs/01-requirements/01-spec/local-story-hub.md` สรุปจากไฟล์ requirement ที่ผู้ใช้แนบมาเท่านั้น (ดู Open Questions ในไฟล์นั้นสำหรับรายละเอียดที่ยังไม่ตัดสินใจ เช่น แพลตฟอร์ม website/application, สิทธิ์การเข้าถึงของแต่ละชุมชน, non-functional requirements) ยังไม่มี Product Backlog จริงสำหรับสเปคนี้ — spec/backlog ตัวอย่าง (mock, เรื่อง Task Management) ที่ใช้สาธิตการทำงานของ agent/skill ถูกย้ายไปเก็บที่ `docs/00-archived/` แล้ว (ดู `docs/05-log/index.md`)

ตัวแพลตฟอร์ม Local Story Hub เอง**ยังไม่มีซอร์สโค้ด** (ยังไม่ตัดสินใจ tech stack เพราะติด Open Question เรื่องแพลตฟอร์มด้านบน) — โค้ดจริงชิ้นเดียวที่มีตอนนี้คือยูทิลิตี้ seed ข้อมูลใน `LSH/` (ดูหัวข้อ "Firestore Seed Script" ด้านล่าง) ไม่ใช่ตัวแอปพลิเคชัน เมื่อเริ่มมีโค้ดแอปจริง (frontend/backend ของ Local Story Hub เอง) ให้อัปเดตไฟล์นี้ด้วยคำสั่ง build/lint/test ที่เกี่ยวข้องทันที ไม่ปล่อยให้ไฟล์นี้ล้าหลังโค้ด

**⚠️ `leaveeasy/` ถูกบันทึกผิดที่เข้ามาใน repo นี้โดยไม่ได้ตั้งใจ — ไม่เกี่ยวข้องกับ Local Story Hub แม้แต่น้อย** เป็นไฟล์ของโปรเจกต์คนละตัว ("Leave Easy" ระบบลาออนไลน์, Firebase project `leaveeasy-nammon`) **ห้ามอ่าน แก้ไข สร้างไฟล์เพิ่ม หรืออ้างอิงโฟลเดอร์นี้เลยเวลาทำงานเกี่ยวกับ Local Story Hub** ไม่ต้องพยายามทำความเข้าใจหรือผูกเข้ากับ docs pipeline/agent/skill ใดๆ ด้านล่างนี้ทั้งสิ้น

## Firestore Seed Script (`LSH/`)

Node.js script ที่ใช้ `firebase-admin` seed ข้อมูลตัวอย่างลง Firestore project **`lsh-nammon`** (collections: `users`, `ContentTypes`, `LSHRequests`) — มีไว้สำหรับข้อมูลทดสอบตอน dev เท่านั้น ไม่ใช่ business logic ของตัวแอป:

```bash
cd LSH
npm install
npm run seed   # รัน scripts/seed-firestore.js
```

**Collections ทั้งหมดที่มีจริงใน Firestore ตอนนี้** (สร้างโดยสคริปต์นี้ ดู `scripts/seed-firestore.js` สำหรับ field ทั้งหมด):

- **`users`** — field: `name`, `email`, `role`
  - **`status`, `approverId`, `approverName`, `rejectionReason`** — เพิ่ม 2026-09-12 (BL-019/BL-020) เฉพาะบัญชี `role: student` เท่านั้น — `status` มี 3 ค่า: `รออนุมัติ` / `อนุมัติแล้ว` / `ไม่อนุมัติ` บัญชีที่สมัครเองต้องรอ `อนุมัติแล้ว` ก่อนถึงจะส่งผลงานได้ (`LSHRequests.create` เช็คเงื่อนไขนี้ใน `firestore.rules` ด้วย) บัญชี `role: teacher` (u004) ไม่มี field เหล่านี้ (provision โดย admin ถือว่า approved ทันที)
- **`role: community`** *(เพิ่ม 2026-09-23)* — บัญชีชุมชนใช้ `users` collection เดียวกับนิสิต (ไม่แยก collection) มี `status`/`approverId`/`approverName`/`rejectionReason` ชุดเดียวกับนิสิตทุกประการ บวก field เพิ่ม **`contactInfo`** (ข้อมูลยืนยันตัวตน — ชื่อผู้ติดต่อ+เบอร์โทร ตาม Business Rule BL-022)
- **`CommunityContent`** *(เพิ่ม 2026-09-23)* — คอนเทนต์ของชุมชน: `title`, `bodyTh`, `caption`, `imageUrl` *(เพิ่ม 2026-09-23 รอบสอง — BL-001 prerequisite, ดูหัวข้อ "Community Image Upload" ด้านล่าง; `null` ได้ถ้ายังไม่อัปโหลดภาพ)*, `location` *(เพิ่ม 2026-09-23 รอบสาม — BL-010, ดูหัวข้อ "ตำแหน่งบนแผนที่" ด้านล่าง; Firestore `GeoPoint`, `null` ได้ถ้าไม่ทราบพิกัด)*, `communityId`/`communityName` (denormalized), `status` (`เผยแพร่แล้ว` เท่านั้น — สร้างแล้วเผยแพร่ทันที ไม่มีสถานะฉบับร่าง เพราะไม่มี path ให้ community แก้ไข/เผยแพร่ฉบับร่างของตนเองใน `firestore.rules`), `createdAt`, `updatedAt`
- **`ContentEditRequests`** *(เพิ่ม 2026-09-23)* — คำขอแก้ไขคอนเทนต์ที่เผยแพร่แล้ว: `contentId`, `contentTitle`, `communityId`/`communityName`, `proposedChanges`/`originalValues` (`{title, bodyTh}`), `status` (`รอพิจารณา`/`อนุมัติ`/`ไม่อนุมัติ`), `rejectionReason`, `approverId`/`approverName`, `createdAt` — ชุมชนแก้ไข/ยกเลิกคำขอขณะ `รอพิจารณา` ไม่ได้ (ไม่มี `allow update` ให้ community ใน `firestore.rules` เลย)
- **`touristAccounts`** *(เพิ่ม 2026-09-22/23)* — บัญชีนักท่องเที่ยว: `displayName`, `email`, `role: 'tourist'`, `createdAt` — **แยก collection จาก `users` โดยเจตนา** (ไม่ใช่ `role: community` ที่ใช้ `users` ร่วมกับนิสิต) เพราะนักท่องเที่ยว**ไม่มีสถานะ pending/approved เลย** สมัครเสร็จใช้งานได้ทันที — `uid` เดียวกันอาจมีทั้ง `users` doc (ถ้าเป็นนิสิต/ชุมชนด้วย) และ `touristAccounts` doc พร้อมกันได้ คนละ collection
- **`Reviews`** *(เพิ่ม 2026-09-23)* — รีวิวของนักท่องเที่ยว: `contentId`, `contentType` (`student`/`community` — ระบุว่าเนื้อหามาจาก `LSHRequests` หรือ `CommunityContent`), `contentTitle`, `touristId`/`touristName`, `text`, `createdAt` — อ่านได้แบบ public ไม่ต้อง login, เขียนต้อง login เท่านั้น (Decision Log 2026-08-28), immutable (ไม่มี update/delete)
- **`Bookmarks`** *(เพิ่ม 2026-09-23)* — สถานที่โปรด: doc id = `{touristId}_{contentType}_{contentId}` (deterministic เพื่อ toggle ได้โดยไม่ต้อง query), field: `touristId`, `contentId`, `contentType`, `contentTitle`, `createdAt` — อ่าน/ลบได้เฉพาะเจ้าของเท่านั้น
- **`ConsentRecords`** *(เพิ่ม 2026-09-22/23)* — หลักฐานการยินยอม PDPA: `user_account_id` (null ได้ถ้ายังไม่ login), `analytics_consent`/`marketing_consent` (เท่ากันเสมอ — single-toggle consent), `timestamp` — เขียนได้แม้ไม่ login (Consent เกิดขึ้นได้ก่อน login), ไม่มี operation อ่านคืน (`allow read: if false`)
- **`AiAssistLogs`** — log ทุกครั้งที่เรียกใช้ AI: `action`, `requesterId`, `success`, `resultText`, `errorMessage`, `model`, `createdAt` *(เพิ่ม 2026-09-23)* — เดิมเขียนได้เฉพาะนิสิต/อาจารย์ ตอนนี้เปิดให้ทุก role ที่ login แล้ว (ชุมชน/นักท่องเที่ยวด้วย) เพราะปุ่ม AI ขยายไปทั้งสองฝั่งแล้ว (ดูหัวข้อ "AI Backend Proxy" ด้านล่าง) — เขียนจาก Cloudflare Worker ผ่าน Firestore REST API โดยใช้ ID token ของผู้เรียกเอง ไม่ใช่ client เขียนตรงอีกต่อไป
- **`AccessLogs`** *(เพิ่ม 2026-09-23, BL-014)* — บันทึกการเข้าใช้งานตามพ.ร.บ. คอมพิวเตอร์: `timestamp`, `ip_address`, `user_agent`, `user_account_id` (null ได้ — ผู้เข้าชมไม่ login), `action`, บวก `expires_at` (= `timestamp` + 90 วัน, ไว้ให้ Firestore TTL policy อ่านเท่านั้น ไม่ใช่ field ตาม Business Rule) — เขียนจาก Cloudflare Worker (`/log-access`) ด้วย **service account** (bypass `firestore.rules` เพราะต้อง log ได้แม้ผู้เข้าชมไม่มี ID token เลย) อ่านได้เฉพาะ role=`teacher` (Data Controller) ดูหัวข้อ "Access Log" ด้านล่าง
- **`ContentTypes`** — field: `name` (ตัวอย่าง: VOD, album photo, Storytelling)
- **`LSHRequests`** — field: `title`, `Content`, `status`, `requesterId`, `requesterName`, `approverId`, `approverName`, `LSHTypeId`, `LSHTypeName`, `createdAt`, `location` *(เพิ่ม 2026-09-23 — BL-010, ดูหัวข้อ "ตำแหน่งบนแผนที่" ด้านล่าง; Firestore `GeoPoint`, `null` ได้ถ้าไม่ทราบพิกัด)*
  - **`status` มี 3 ค่าเท่านั้น**: `รอพิจารณา` (pending) / `อนุมัติ` (approved) / `ไม่อนุมัติ` (rejected)
  - **`community`, `rejectionReason`** — field เสริมที่ `docs/02-design/01-prototypes/prototype-v2/` เพิ่มเข้ามา (2026-09-11) มีเฉพาะเอกสารที่สร้างผ่านฟอร์มเวอร์ชันนั้นเท่านั้น — เอกสาร req001-005 ที่ seed ไว้เดิมไม่มี field นี้

ℹ️ **`LSHRequests`/`ContentTypes` เป็นข้อมูลตัวอย่างเฉพาะกิจ ไม่ใช่ schema ที่ตัดสินใจแล้ว** — schema เชิงแนวคิดที่แท้จริงอยู่ที่ entity `StudentWork`/`UserAccount` ใน `docs/02-design/02-technical/architecture.md` (field/ภาษา/status คนละชุดกัน และไม่มี entity ที่ตรงกับ `ContentTypes` เลย เพราะ "ประเภทผลงาน" ไม่มีที่มาจาก requirement ใดๆ) ผู้ใช้ตัดสินใจแล้ว (2026-09-11) ว่า**ยังไม่รวมสอง schema นี้เข้าด้วยกัน คง `ContentTypes` ไว้ตามเดิม** — ดูตาราง mapping ระหว่างสองฝั่งได้ในหัวข้อ "Database Schema" ของไฟล์นั้น — **ห้ามเดาว่าอันไหนควรใช้จริงตอน implement ให้ถามผู้ใช้ก่อนเสมอ**

ต้องมี `LSH/serviceAccountKey.json` ก่อนรัน (ดาวน์โหลดจาก Firebase Console → Project Settings → Service Accounts → Generate new private key) — ไฟล์นี้ถูก `.gitignore` ไว้แล้วทั้งใน `LSH/.gitignore`, ห้าม commit เด็ดขาด

Firebase CLI ติดตั้งแบบ global ไว้แล้ว (`npm install -g firebase-tools`) และ login ไว้แล้วในเครื่องนี้ — ใช้ project ID **`lsh-nammon`** เท่านั้นสำหรับงาน Local Story Hub เสมอ บัญชีเดียวกันมีสิทธิ์เห็น Firebase project อื่นด้วย เช่น `lsh-nammon-sukhumalchan` — **project นั้นไม่มีความเกี่ยวข้องกับ Local Story Hub เลย ห้ามยุ่งหรืออ้างอิงถึงเวลาทำงานในโปรเจกต์นี้**

## Firebase Authentication + Security Rules (เพิ่ม 2026-09-11)

`lsh-nammon` เปิดใช้ **Email/Password sign-in** จริงแล้ว พร้อมสร้างบัญชี Auth ให้ 4 user ที่ seed ไว้ — **`uid` ของบัญชี Auth ตรงกับ doc id ใน `users` collection พอดี** (u001-u004) เพื่อให้ client lookup role ได้ตรงๆ ด้วย `doc(db,'users', auth.currentUser.uid)` **รหัสผ่านสาธิตทุกบัญชีเหมือนกัน — ดูจากผู้ดูแลระบบ ไม่ได้เก็บไว้ในเอกสารนี้ด้วยเหตุผลด้านความปลอดภัย (ไฟล์นี้ถูก push ขึ้น public repo)**

**สำคัญ — role ของอาจารย์ใน Firestore คือ `teacher` ไม่ใช่ `admin`**: ต่างจาก entity `UserAccount` เชิงแนวคิดที่ใช้ `role: admin` (ดูหัวข้อก่อนหน้า) โค้ด client-side และ security rules ทั้งหมดเช็คเทียบกับ `teacher` เพราะต้องทำงานกับข้อมูลจริง — ถ้าจะเพิ่ม role อื่นในอนาคต ตรวจให้ตรงกับค่าจริงใน Firestore เสมอ อย่าเดาจาก entity เชิงแนวคิด

**Security Rules จริงอยู่ที่ `LSH/firestore.rules`** — เดิม deploy ด้วย `admin.securityRules().releaseFirestoreRulesetFromSource()` ผ่าน service account (ตอนนั้นยังไม่มี `firebase.json`) ตอนนี้มี `firebase.json` แล้ว (ดูหัวข้อ Firebase Hosting ด้านล่าง) จึงใช้ `firebase deploy --only firestore:rules` ได้ปกติเช่นกัน — ทั้งสองวิธี deploy ไปที่ ruleset เดียวกัน บังคับ: `read` บน `LSHRequests` เปิดเป็น **public (ไม่ต้อง login)** เฉพาะเอกสารที่ `status='อนุมัติ'` เท่านั้น (เพิ่ม 2026-09-12 รองรับ BL-021) เอกสารอื่น (`รอพิจารณา`/`ไม่อนุมัติ`) อ่านได้เฉพาะเจ้าของ (`requesterId == uid`) หรือ role=`teacher` เท่านั้น (**แก้ 2026-09-23** — เดิมเงื่อนไขคือแค่ "login แล้ว" เฉยๆ ทำให้ผู้ใช้ที่ login คนไหนก็ได้อ่านผลงานที่ยังไม่อนุมัติของคนอื่นได้หมด เป็นบั๊กจริงที่พบจาก `tests/security-cross-user-pending-work-blocked.spec.js` ดูรายละเอียดในหัวข้อ "เทสต์ความปลอดภัยอัตโนมัติ" ด้านล่าง) `create` บน `LSHRequests` ต้อง login + เป็นนิสิตที่บัญชี `status='อนุมัติแล้ว'` เท่านั้น + `requesterId` ตรงกับ `uid` ตนเอง (กันสวมรอย), `update` ต้อง login + role=`teacher`, อ่าน `users/{uid}` ได้เฉพาะเจ้าของหรือ role=`teacher`, `create` บน `users/{uid}` ทำได้เฉพาะเจ้าของ (สมัครบัญชีเอง) และบังคับ `role='student'`+`status='รออนุมัติ'` เท่านั้น (เพิ่ม 2026-09-12 รองรับ BL-019/BL-020), `update` บน `users` จำกัดเฉพาะ role=`teacher` และแก้ได้แค่ field `status`/`approverId`/`approverName`/`rejectionReason` — **เปลี่ยนจากโหมดทดสอบเดิม (เปิด read/write ให้ทุกคนถึง 2026-10-04) เป็นบังคับสิทธิ์จริงแล้ว** ถ้าจะแก้ rules ต้องแก้ไฟล์นี้แล้ว deploy ซ้ำ (ดูตัวอย่างใน `05-log/index.md` วันที่ 2026-09-11 และ 2026-09-12)

ดูรายละเอียดการบังคับใช้สิทธิ์ตามบทบาทที่ `docs/02-design/02-technical/ACL.md` และการ implement ที่ `docs/02-design/01-prototypes/prototype-v2/README.md`

**สถานะ `firestore.rules` ณ 2026-09-23**: เพิ่ม rule ของ `CommunityContent`/`ContentEditRequests` และเปิด `users.create` ให้ role `community` แล้ว **deploy ขึ้น production จริงแล้ว** (`firebase deploy --only firestore:rules`) และทดสอบผ่าน browser จริงครบ flow (สมัครชุมชน → อาจารย์อนุมัติ → ชุมชนสร้าง/เผยแพร่คอนเทนต์ → ขอแก้ไข → อาจารย์อนุมัติคำขอแก้ไข) ไม่พบ permission-denied — ดู `docs/05-log/index.md` วันที่ 2026-09-23 (ระบบชุมชน)

## เทสต์ความปลอดภัยอัตโนมัติ (เพิ่ม 2026-09-23)

นอกจาก `tests/published-works.spec.js` (สโมค เทสต์เดิม) มีเทสต์ความปลอดภัย 2 ตัวที่ **ห้ามลบ/ข้าม**
เก็บไว้ถาวรใน `tests/` รันด้วย `npx playwright test`:

- **`tests/security-unauth-review-list-blocked.spec.js`** — ไม่ login แล้วเปิด
  `admin-review-student-work.html` (หน้ารวมผลงาน/บัญชี/คำขอแก้ไขของอาจารย์) ต้องอ่านข้อมูลไม่ได้เลย
  เช็คทุก container ที่มีข้อมูลจริง (`#pending-list`, `#pending-accounts-list`,
  `#pending-edits-list`, ตารางประวัติ/Access Log) ต้องว่างเปล่า ไม่ใช่แค่ parent ถูกซ่อนด้วย CSS
- **`tests/security-cross-user-pending-work-blocked.spec.js`** — นิสิต A ส่งผลงานใหม่ (สถานะ
  "รอพิจารณา") → นิสิต B (login คนละบัญชี) พยายามเปิดผลงานนั้นตรงๆ ผ่าน URL ต้องเปิดไม่ได้ **ทั้งสอง
  ระดับ**: (1) UI ไม่แสดงเนื้อหาของ A ให้ B เห็น (2) Firestore **ต้องปฏิเสธการอ่านจริง**
  (permission-denied ใน console) ไม่ใช่แค่ client ฝั่ง B อ่านสำเร็จแล้วซ่อนด้วย JS เฉยๆ — เช็คระดับ
  (2) เพิ่มเพราะเคยพบว่า rule เดิมรั่วจริงแม้ UI จะดูเหมือนผ่าน (ดูด้านล่าง)

ใช้บัญชีสาธิต `u002@example.com`/`u003@example.com` (นิสิตที่อนุมัติแล้ว) แทนการสมัครใหม่ — อีเมล
ไม่ใช่ความลับ (มีอยู่แล้วใน `LSH/scripts/seed-firestore.js` ที่ commit ไว้) ส่วนรหัสผ่านอ่านจาก
`LSH/DEMO_CREDENTIALS.md` (gitignored) ผ่าน `tests/helpers/demo-credentials.js` — **ห้าม hardcode
รหัสผ่านในไฟล์ `.spec.js` ที่ commit เด็ดขาด** ต้องมี `LSH/DEMO_CREDENTIALS.md` ในเครื่องก่อนรันเทสต์
สองตัวนี้ (เทสต์จะ throw error ชัดเจนถ้าไม่มีไฟล์)

`student-publish.html`'s รายการ "ผลงานที่เคยส่งของคุณ" มี `data-id="<doc id>"` ต่อ 1 รายการ (เพิ่ม
2026-09-23) เพื่อให้เจ้าของอ่าน id ผลงานตัวเองได้จาก DOM โดยตรง (ใช้ในเทสต์ตัวที่สองด้านบน) — ไม่ใช่
ช่องโหว่เพราะเป็น id ของผลงานตัวเองที่เจ้าของอ่านได้อยู่แล้วผ่าน query ปกติ

**บั๊กจริงที่เทสต์ตัวที่สองพบ (ก่อนแก้)**: `LSHRequests.read` rule เดิมเช็คแค่ `request.auth != null`
(login แล้วคนไหนก็ได้) ไม่ได้จำกัดว่าต้องเป็นเจ้าของหรือ role=teacher — นิสิต B ที่ login อยู่จึงอ่าน
ผลงาน "รอพิจารณา"/"ไม่อนุมัติ" ของนิสิต A ได้จริงผ่าน Firestore แม้หน้าเว็บจะซ่อนไม่แสดงให้เห็นก็ตาม
(rule รั่ว ไม่ใช่แค่ UI) แก้แล้วให้แคบลงเหลือ owner/teacher/public-approved เท่านั้น deploy ขึ้น
production แล้ว retest ผ่านทั้งสองระดับ — ตรวจสอบว่าไม่กระทบฟีเจอร์อื่น (นิสิตอ่านผลงานตัวเอง,
อาจารย์อ่านทุกอัน, public อ่านที่อนุมัติแล้ว) ยืนยันผ่านครบ

## Firebase Hosting (เพิ่ม 2026-09-11)

`firebase.json` และ `.firebaserc` อยู่ที่ **root ของ repo** (ไม่ใช่ใน `LSH/`) เพราะ Firebase Hosting ห้ามชี้ `public` ไปนอกโฟลเดอร์ที่มี `firebase.json` — `public` ชี้ไปที่ `docs/02-design/01-prototypes/prototype-v2` ตรงๆ deploy ด้วย:

```bash
firebase deploy --only hosting,firestore:rules
```

รันจาก root ของ repo เท่านั้น (ไม่ใช่จาก `LSH/`) — เว็บที่ deploy แล้วอยู่ที่ `https://lsh-nammon.web.app/student-publish.html`, `https://lsh-nammon.web.app/admin-review-student-work.html`, และ `https://lsh-nammon.web.app/published-works.html` (หน้าสาธารณะ ไม่ต้อง login — เพิ่ม 2026-09-12) (ลิงก์อยู่ใน `README.md` ที่ root ด้วย)

**Firebase web config แยกไฟล์แล้ว (เพิ่ม 2026-09-18):** `docs/02-design/01-prototypes/prototype-v2/firebase-config.js` เก็บค่า `firebaseConfig` (รวม `apiKey`) จริง — ไฟล์นี้ถูก `.gitignore` ไว้ที่ root ของ repo ไม่ขึ้น GitHub ทั้ง 3 หน้าจอ (`student-publish.html`, `admin-review-student-work.html`, `published-works.html`) โหลดไฟล์นี้ผ่าน `<script src="firebase-config.js">` ก่อน `initializeApp` เสมอ — มี `firebase-config.example.js` (มีค่า placeholder, commit เข้า repo) เป็น template ให้คัดลอก **`firebase deploy --only hosting` ยังทำงานได้ปกติ** เพราะ deploy อ่านจาก local filesystem ไม่ใช่จาก git ไฟล์นี้จึงถูก deploy ขึ้น Hosting จริงแม้จะไม่ถูก commit — ถ้า clone repo ใหม่ต้องสร้างไฟล์นี้เองก่อน deploy/รัน local ครั้งแรก

## AI Backend Proxy — Cloudflare Worker (เพิ่ม 2026-09-23)

ทุกปุ่ม AI ในระบบ (คิดแคปชัน/แนะนำวิธีเล่าเรื่อง/SEO/แปลภาษาฝั่งชุมชน+นักท่องเที่ยว, ช่วยร่างคำอธิบายผลงานนิสิต,
สรุปภาพรวมงานของอาจารย์) เรียกผ่าน Cloudflare Worker ที่ `cf-worker/` แทนการเรียก OpenRouter API ตรงจาก
browser แบบเดิม — **เลือก Cloudflare Workers แทน Firebase Cloud Functions เพราะผู้ใช้ไม่ต้องการผูกบัตร
เครดิตกับ Firebase** (Cloud Functions บังคับต้องอัปเกรดเป็นแผน Blaze) ส่วน Cloudflare Workers free tier
ใช้ได้โดยไม่ต้องผูกบัตร (100,000 requests/วัน)

**สถาปัตยกรรม**: ทุก request ต้องแนบ Firebase ID token (`Authorization: Bearer <token>`) — Worker verify
เองด้วย Web Crypto API (ไม่ใช้ Firebase Admin SDK เพราะเป็น Node-only ใช้บน Workers ไม่ได้), แล้วเรียก
OpenRouter ด้วย key ที่เก็บเป็น Cloudflare secret เท่านั้น (ไม่เคยส่งถึง browser) — action `summarize-pending`
ตรวจ role เพิ่มว่าต้อง `teacher` เท่านั้น โดยอ่าน `users/{uid}` ผ่าน Firestore REST API ด้วย ID token ของ
ผู้เรียกเอง (ใช้สิทธิ์ self-read ที่มีอยู่แล้วใน `firestore.rules` ไม่ต้องมี service account เพิ่ม) — log ทุกครั้ง
ลง `AiAssistLogs` ด้วยวิธีเดียวกัน (ดูรายละเอียด endpoint ทั้งหมดที่ `cf-worker/README.md`)

**`ai-assist-config.js` ไม่ใช่ secret อีกต่อไป** (เพิ่ม 2026-09-23) — เดิมเก็บ OpenRouter API key จริง
(client-side secret) ตอนนี้เก็บแค่ `window.LSH_AI_PROXY_URL` (URL ของ Worker ซึ่งไม่ใช่ความลับ ป้องกันด้วย
การ verify ID token ข้างในตัว Worker เอง) — จึง**ลบออกจาก `.gitignore` และ `firebase.json` hosting.ignore
แล้ว** commit + deploy ได้ตามปกติ

**สถานะ ณ 2026-09-23**: โค้ด Worker และฝั่ง client เสร็จหมดแล้ว ทดสอบ auth verification/role gate/CORS/error
handling ผ่าน local `wrangler dev` ครบ (ดู `docs/05-log/index.md`) **แต่ยังไม่ได้ deploy Worker จริงขึ้น
Cloudflare** — `ai-assist-config.js` ที่ commit ไว้ยังเป็น placeholder URL อยู่ ทุกปุ่ม AI จะขึ้นข้อความ
"AI backend ยังไม่พร้อมใช้งาน" จนกว่าจะ deploy จริงตามขั้นตอนนี้ (**ผู้ใช้ต้องทำเอง** เพราะต้อง login
ด้วยบัญชี Cloudflare ของตัวเองผ่านเบราว์เซอร์):

```bash
cd cf-worker
npm install
npx wrangler login                              # เปิดเบราว์เซอร์ให้ login (สมัครฟรีได้ที่ dash.cloudflare.com ถ้ายังไม่มี — ไม่ต้องผูกบัตร)
npx wrangler secret put OPENROUTER_API_KEY       # แปะ API key จริงจาก https://openrouter.ai/keys
npx wrangler deploy
```

หลัง deploy จะได้ URL รูปแบบ `https://lsh-ai-proxy.<subdomain>.workers.dev` — เอาไปตั้งใน
`docs/02-design/01-prototypes/prototype-v2/ai-assist-config.js` (แทนที่ placeholder) แล้ว
`firebase deploy --only hosting` ใหม่อีกครั้ง

## Community Image Upload — BL-001 prerequisite (เพิ่ม 2026-09-23 รอบสอง)

`community-create-content.html` มีระบบอัปโหลดภาพจริงแล้ว (แทนปุ่ม "เลือกไฟล์" placeholder เดิม)
— เก็บบน **Cloudflare R2** ผ่าน Worker เดียวกับ AI Backend Proxy ด้านบน (`cf-worker/`, endpoint
`POST /upload-image` + `GET /image/<key>`) **เลือก R2 แทน Firebase Storage เพราะ Firebase Storage
บังคับอัปเกรดเป็นแผน Blaze (ผูกบัตรเครดิต) แม้ใช้ไม่เกิน free tier** — เหตุผลเดียวกับที่เลือก
Cloudflare Workers แทน Firebase Cloud Functions ไปแล้วก่อนหน้านี้ (ดูหัวข้อ AI Backend Proxy)

**สถาปัตยกรรม**: อัปโหลดต้องแนบ Firebase ID token เหมือนปุ่ม AI ทุกปุ่ม (ไม่ใช่ anonymous เหมือน
`/log-access`) จำกัดเฉพาะไฟล์ JPEG/PNG/WEBP/GIF ไม่เกิน 5MB — ไฟล์ที่อัปโหลดสำเร็จบันทึก URL ไว้ที่
field `imageUrl` ของเอกสาร `CommunityContent` (ดูหัวข้อ Firestore Seed Script ด้านบน) ภาพเสิร์ฟกลับ
แบบ public ไม่ต้อง login (`GET /image/<key>`) เพราะคอนเทนต์ที่เผยแพร่แล้วต้องดูได้แบบ public อยู่แล้ว
เหมือนหน้าอื่น — แสดงผลจริงแล้วที่ `tourist-story-detail.html` (แทนที่ hero placeholder เดิมเมื่อมี
`imageUrl`) ส่วน `tourist-search-results.html`/`published-works.html` **ยังไม่ได้เพิ่มรูปในการ์ด
ผลการค้นหา** (ยังคงเป็น text-only เหมือนเดิม ไม่ใช่ regression แค่ยังไม่ได้ทำ)

**ต้องสร้าง R2 bucket เองก่อน deploy** (`npx wrangler r2 bucket create lsh-community-images` —
ดูรายละเอียดเต็มที่ `cf-worker/README.md`) binding (`IMAGES_BUCKET`) กำหนดไว้ใน `cf-worker/wrangler.toml`
แล้ว ไม่ใช่ secret

**สถานะ ณ 2026-09-23**: โค้ดฝั่ง Worker + client เสร็จแล้ว ทดสอบ round-trip เต็มรูปแบบผ่าน local
`wrangler dev` แล้ว (R2 จำลองแบบ local ได้เองโดยไม่ต้อง login Cloudflare) — login จริงด้วยบัญชี
`u001@example.com`, อัปโหลดไฟล์ PNG จริงผ่าน `POST /upload-image`, ดึงกลับผ่าน `GET /image/<key>`
แล้วเทียบไบต์ตรงกับต้นฉบับ 100%, ยืนยัน `Content-Type`/`Cache-Control` headers ถูกต้อง, และยืนยัน
กรณีปฏิเสธทั้งหมดทำงานถูก (ไม่มี token, token ปลอม, content-type ผิด, ไฟล์เกิน 5MB) **แต่ยังไม่ได้
ทดสอบบน Cloudflare จริง** เพราะ Worker ยังไม่ได้ deploy ขึ้นจริง (รอผู้ใช้ทำตามขั้นตอนเดียวกับ AI
Backend Proxy ด้านบน บวกขั้นตอนสร้าง R2 bucket) **ปุ่ม "✨ ให้ AI ปรับภาพให้สวย" (image-to-image
enhancement) ยังไม่ implement** — เป็นงานคนละสโคปจากงานอัปโหลดรอบนี้ ต้องเลือกโมเดล AI ปรับภาพก่อน
ถึงจะทำต่อได้ (ดู BL-001 ใน product-backlog.md)

## ตำแหน่งบนแผนที่ — BL-010 (เพิ่ม 2026-09-23 รอบสาม)

เดิม BL-010 ทำได้แค่ workaround (ลิงก์ Google Maps ค้นหาด้วย**ชื่อชุมชน** ไม่ใช่ตำแหน่งจริง) เพราะมี
3 คำถามที่กระทบ schema/scope ต้องถามอาจารย์ที่ปรึกษาก่อนตามกฎ CLAUDE.md — ผู้ใช้คุยกับอาจารย์ที่
ปรึกษามาแล้วและให้คำตอบทั้ง 3 ข้อ (2026-09-23):

1. **รูปแบบ field พิกัด**: Firestore `GeoPoint` เดียว field ชื่อ `location` (ไม่แยก `lat`/`lng` เป็น 2 field)
2. **ใครกรอกพิกัด**: นิสิต/ชุมชนกรอกเองตอนสร้าง/เผยแพร่เนื้อหา ผ่าน UI ปักหมุดในฟอร์ม (ไม่ใช่ geocode อัตโนมัติ)
3. **ขอบเขตของ "หมุดหมายเดินทางที่ชัดเจน"**: แค่ปักหมุดตำแหน่งเดียว ไม่ต้องมีเส้นทาง/นำทาง

**Implement แล้วตามคำตอบทั้ง 3 ข้อ**:

- **UI ปักหมุด** (ไม่บังคับกรอก): เพิ่มใน `student-publish.html` และ `community-create-content.html`
  ใช้ **Leaflet + OpenStreetMap tiles** แทน Google Maps JavaScript API เพราะไม่ต้องขอ API key/ผูกบัตร
  เครดิต (เหตุผลเดียวกับที่เลือก Cloudflare Workers/R2 ก่อนหน้านี้ — ผู้ใช้ยืนยันตัวเลือกนี้เองหลังถูกถาม
  พร้อมทางเลือกอื่น) โหลดผ่าน CDN (`unpkg.com/leaflet@1.9.4`) ไม่ต้อง build step — คลิก/แตะบนแผนที่เพื่อ
  ปักหมุด บันทึกเป็น `new GeoPoint(lat, lng)` ลง field `location` ตอนส่ง/เผยแพร่
- **แสดงผล**: `tourist-story-detail.html` แสดง embedded Leaflet map พร้อมหมุดจริงเมื่อมี `location`
  (แทน placeholder เดิม) และเปลี่ยนลิงก์ "ดูตำแหน่งบน Google Maps" ให้ใช้พิกัดจริง
  (`google.com/maps?q=lat,lng`) แทนการค้นหาด้วยชื่อชุมชน — ถ้าไม่มี `location` (เนื้อหาเก่าก่อน
  2026-09-23 หรือผู้สร้างข้ามการปักหมุด) **ยังคง fallback เป็น workaround เดิม** (ค้นหาด้วยชื่อชุมชน)
  ไว้เหมือนเดิม ไม่ regression — `tourist-search-results.html` และ `published-works.html` อัปเกรด
  แค่ลิงก์ (ใช้พิกัดจริงถ้ามี) ไม่ได้เพิ่ม embedded map ต่อการ์ด (จำกัดสโคป กันโหลดแผนที่หลายสิบอันพร้อมกัน)
- ไม่ต้องแก้ `firestore.rules` — `create` ของทั้ง `LSHRequests`/`CommunityContent` ไม่ได้จำกัด field
  ที่อนุญาตอยู่แล้ว (ต่างจาก `update` ที่จำกัด — ดู `LSH/firestore.rules`) field `location` ที่มีอยู่
  จึงไม่ถูกแก้ไขภายหลังผ่าน edit-request flow (BL-023) เหมือนกับ `imageUrl` (ตั้งครั้งเดียวตอนสร้าง)

**สถานะ ณ 2026-09-23**: ทดสอบ end-to-end จริงผ่าน local server + Playwright ก่อน (login จริงด้วย
`u001@example.com`, ปักหมุดจริง, ส่งจริงลง `LSHRequests`, อาจารย์อนุมัติจริง, ยืนยันว่า
`tourist-story-detail.html`/`tourist-search-results.html`/`published-works.html` อ่านและแสดงพิกัด
ที่ปักไว้ถูกต้องครบทุกหน้า) — **deploy ขึ้น Firebase Hosting จริงแล้ว** (`firebase deploy --only
hosting,firestore:rules`) และ retest ซ้ำบน production จริงผ่านครบเหมือนกัน (พบระหว่างทางว่ารอบ
regression QA แรกทดสอบก่อน deploy จึงไม่พบ UI เลย — ไม่ใช่บั๊กโค้ด แค่ยังไม่ได้ deploy ดู
`docs/03-testing/02-test-result/20260923-test-run-regression-full.md` และ TC-006 ใน test-plan.md)
BL-010 ปิดสถานะเป็น "เสร็จแล้ว" ตาม Acceptance Criteria (ปักหมุดตำแหน่งเดียว ไม่รวมเส้นทาง/นำทาง
ตามขอบเขตที่อาจารย์ยืนยัน) ยืนยันใช้งานได้จริงบน production แล้ว ไม่ใช่แค่ local

## Access Log — BL-014 (เพิ่ม 2026-09-23)

Worker เดียวกับ AI Backend Proxy ด้านบน (`cf-worker/`) รับผิดชอบ endpoint เพิ่ม `POST /log-access`
ด้วย — ทุกหน้าใน `prototype-v2/` ยิง request นี้แบบ fire-and-forget ตอนโหลดหน้า (ผ่าน
`access-log.js`, `fetch(..., {keepalive:true})`) ไม่ว่าผู้เข้าชมจะ login หรือไม่ก็ตาม (พ.ร.บ.
คอมพิวเตอร์บังคับเก็บ log ของทุกคน ไม่ใช่แค่คนที่ login)

**ต่างจาก endpoint `/ai/*`**: `/log-access` **ไม่บังคับต้องมี Firebase ID token** (แนบมาได้แต่ไม่
บังคับ) และ**เขียน Firestore ด้วยสิทธิ์ service account แทน ID token ของผู้เรียก** — เพราะผู้เข้าชม
อาจไม่มี token เลย การจะให้ log สำเร็จได้ต้องมีสิทธิ์ที่ไม่ผูกกับ auth ของผู้ใช้ปลายทาง วิธีนี้
**บายพาส `firestore.rules` ไปเลย** เหมือนที่ `firebase-admin`/`LSH/scripts/seed-firestore.js` ใช้
อยู่แล้ว — `firestore.rules` จึงปิด `AccessLogs.create` ไว้ที่ `if false` สำหรับ client ปกติ (กันไม่
ให้ใครเขียนตรงได้นอกจาก Worker นี้), เปิด `read` เฉพาะ role=`teacher` (Data Controller ตาม Business
Rule ที่ปิดแล้วใน `20260822-01-it-log-pdpa-consent.md`) — ดูหน้าดู log สั้นๆ ให้อาจารย์ที่
`admin-review-student-work.html` § "Access Log"

**เก็บ 90 วันด้วย Firestore TTL policy** (ไม่ใช่ scheduled function) — ใช้ได้บนแผนฟรี Spark โดยตรง
ไม่ต้องอัปเกรด Blaze เขียน field แยก `expires_at` (= `timestamp` + 90 วัน) ไว้ให้ TTL policy อ่าน
โดยเฉพาะ (ไม่ปนกับ `timestamp` ที่เป็นเวลาเข้าใช้งานจริงตาม Business Rule) — รายละเอียดวิธีตั้งค่า
เต็มอยู่ที่ `cf-worker/README.md` § "ตั้งค่า Firestore TTL policy"

**ต้องมี secret เพิ่ม 1 ตัวสำหรับ endpoint นี้โดยเฉพาะ**: `FIREBASE_SERVICE_ACCOUNT_JSON` (คนละตัว
กับ `LSH/serviceAccountKey.json` เดิม — แนะนำสร้างใหม่จำกัดสิทธิ์แค่ "Cloud Datastore User") ดู
ขั้นตอนเต็มที่ `cf-worker/README.md`

**สถานะ ณ 2026-09-23**: โค้ด Worker + ฝั่ง client (`access-log.js`, หน้าดู log ของอาจารย์) เสร็จหมด
แล้ว ทดสอบ routing/auth-optional/JWT-signing ผ่าน local `wrangler dev` ครบ (verify ด้วย service
account จริงที่สร้างขึ้นมาทดสอบเฉพาะกิจ ยืนยันว่า flow เซ็น JWT + แลก access token ถูกต้อง — error
ที่ได้คือ "account not found" จาก Google ตามคาด เพราะ service account นั้นไม่มีอยู่จริง) **แต่ยังไม่ได้
deploy Worker จริงและยังไม่ได้ตั้งค่า TTL policy** — ผู้ใช้ต้องทำเองตามขั้นตอนใน `cf-worker/README.md`

## Requirement intake → Spec → Product Backlog workflow

เมื่อผู้ใช้ให้ **requirement ดิบ** มา (ข้อความไม่มีโครงสร้าง, ไฟล์แนบ, บทสนทนา) ที่ยังไม่มี
เอกสาร spec รองรับ ใช้คู่นี้เป็นจุดเริ่มต้น — ทำ Phase 1 (บันทึกเป็น spec) ต่อด้วย Phase 2
(แตกเป็น backlog) ให้ทันทีในคำขอเดียว:

- **Agent** [.claude/agents/requirement-intake-analyst.md](.claude/agents/requirement-intake-analyst.md)
- **Skill** [.claude/skills/requirement-intake/SKILL.md](.claude/skills/requirement-intake/SKILL.md)

ทั้งสองไฟล์นี้ทำ Phase 1 (สรุป requirement ดิบเป็นไฟล์ spec ที่ `docs/01-requirements/01-spec/{YYYYMMDD}-{RUNNING_NO}-{topic}.md`) เอง แต่สำหรับ Phase 2 (spec → backlog) จะ **อ้างอิงไปยัง workflow ของ `backlog-analyst`/`requirement-to-backlog` ด้านล่างแทนการเขียนขั้นตอนซ้ำ** เพื่อไม่ให้เกิด drift หลายจุด — ถ้าจะแก้ template เอกสาร spec หรือธรรมเนียมตั้งชื่อไฟล์ ให้แก้ทั้งสองไฟล์นี้พร้อมกัน ส่วนการแก้วิธีแตก backlog ให้ไปแก้คู่ agent/skill ถัดไป

ตัวอย่างคำขอที่ควร trigger คู่นี้: "นี่คือ requirement ของฟีเจอร์ใหม่ ช่วยเขียนเป็นเอกสารให้หน่อย", "รับ requirement นี้ไปสรุปเป็น backlog ให้หน่อย", "เพิ่ม requirement ใหม่แล้วแตกเป็น story"

## Spec → Product Backlog workflow

ถ้า spec มีอยู่แล้วและผู้ใช้ต้องการแค่วิเคราะห์เป็น backlog (ไม่มี requirement ดิบใหม่) ใช้คู่นี้
ตรง ๆ — เป็น Phase 2 ที่คู่ intake ด้านบนก็อ้างอิงมาเช่นกัน ครอบคลุม pipeline เดียวกันทั้งหมด:

- **Agent** [.claude/agents/backlog-analyst.md](.claude/agents/backlog-analyst.md) — เหมาะกับกรณีมี spec จำนวนมาก หรือต้องการแยกบริบทการทำงานออกจากบทสนทนาปัจจุบัน
- **Skill** [.claude/skills/requirement-to-backlog/SKILL.md](.claude/skills/requirement-to-backlog/SKILL.md) — ทำ workflow เดียวกันแบบ inline โดยไม่ต้องเปิด subagent

ทั้งสองไฟล์นี้ตั้งใจอธิบาย process ซ้ำกัน — **ถ้าจะแก้ workflow (template ของ backlog item, naming convention, วิธีจัดลำดับความสำคัญ, output path ฯลฯ) ต้องแก้ทั้งสองไฟล์พร้อมกัน** ไม่เช่นนั้นจะ drift ไม่ตรงกัน

ขั้นตอนของ workflow (ดูรายละเอียดเต็มในสองไฟล์ข้างต้น):

1. อ่านทุกไฟล์ใน `docs/01-requirements/01-spec/` และตรวจสอบ `docs/01-requirements/02-plan/`, `docs/01-requirements/03-task/product-backlog.md` ที่มีอยู่แล้ว เพื่อไม่ให้ backlog ใหม่ซ้ำหรือขัดแย้งกับของเดิม
2. สกัด requirement เป็นหน่วยที่ atomic แล้วจัดกลุ่มเป็น Epic ตาม feature/module
3. เขียนแต่ละรายการเป็น backlog item ด้วย field: ID (`BL-XXX`), Epic, User Story (`ในฐานะ [บทบาท] ฉันต้องการ [สิ่งที่ต้องการ] เพื่อ [เป้าหมาย]`), Acceptance Criteria (Given/When/Then), Priority (MoSCoW), Source (wikilink กลับไปยัง spec ต้นทาง), Status
4. บันทึกที่ `docs/01-requirements/03-task/product-backlog.md` — ถ้าไฟล์มีอยู่แล้วให้ **merge** ไม่เขียนทับ (คงสถานะ/ผู้รับผิดชอบของรายการเดิมที่ยังตรงกับ spec)
5. ถ้า spec คลุมเครือหรือไม่ระบุ priority/scope ชัดเจน ให้ตั้งสมมติฐานที่สมเหตุสมผลและใส่หัวข้อ "ข้อสันนิษฐาน"/"## ข้อสันนิษฐาน" ท้ายไฟล์ backlog ให้ผู้ใช้ตรวจสอบ — ห้ามเดา business rule ที่กระทบ scope ใหญ่โดยไม่ระบุให้เห็น
6. ห้ามลบเอกสารเดิมโดยตรง — ถ้า requirement ใดถูกยกเลิก ให้แจ้งผู้ใช้ให้ย้ายไป `docs/00-archived/` เอง (agent/skill ห้ามลบเองโดยไม่ถาม)

ตัวอย่างคำขอที่ควร trigger workflow นี้: "วิเคราะห์ requirement แล้วสร้าง product backlog ให้หน่อย", "แตก spec เป็น user story", "จัดลำดับความสำคัญ backlog", "backlog grooming"

### ธรรมเนียมการตั้งชื่อไฟล์ spec ใหม่

เมื่อเพิ่มไฟล์ spec ใหม่ใน `docs/01-requirements/01-spec/` ให้ตั้งชื่อไฟล์ตามรูปแบบ
`{YYYYMMDD}-{RUNNING_NO}-{topic-slug}.md` — วันที่ให้ได้จากการรันคำสั่งวันที่จริงเสมอ
(ห้ามเดาจาก training data), running number เริ่มที่ 2 หลักและขยายเมื่อเกิน 99 (list โฟลเดอร์ก่อนเพื่อหาเลขต่อไป), และ topic slug เป็นภาษาอังกฤษ kebab-case (เช่น
`20260822-01-community-content-tools.md`) แล้วเพิ่มลิงก์เข้า `01-spec/index.md` ทุกครั้ง
ไฟล์ `local-story-hub.md` ที่มีอยู่แล้วได้รับการยกเว้น (สร้างก่อนกำหนดธรรมเนียมนี้) ไม่ต้อง
เปลี่ยนชื่อย้อนหลัง

## Backlog sync checking

เมื่อ spec มีการแก้ไข/เพิ่มเนื้อหาทีหลัง (เช่น เมื่อ Open Questions ถูกตอบ) ต้องเช็คว่า
`product-backlog.md` ยังตรงกับ spec ล่าสุดอยู่หรือไม่ — มีสองเครื่องมือที่ทำงานแบบเดียวกัน:

- **Agent** [.claude/agents/backlog-sync-checker.md](.claude/agents/backlog-sync-checker.md)
- **Skill** [.claude/skills/backlog-sync-check/SKILL.md](.claude/skills/backlog-sync-check/SKILL.md)

ทั้งสองไฟล์นี้ก็ตั้งใจอธิบาย process ซ้ำกันเหมือนคู่แรก — **แก้ทั้งสองไฟล์พร้อมกันเสมอ**
เพื่อกัน drift เครื่องมือนี้จะตรวจ coverage ของแต่ละ spec กับบรรทัด `**Source**` ในไฟล์
backlog (MISSING/PARTIAL/IN SYNC) เพิ่ม `BL-XXX` ที่ขาดโดยไม่แก้ของเดิม ทำเครื่องหมาย
รายการที่มาจาก spec ที่ยังมี Open Questions ค้างว่าเป็น provisional และบันทึกทุกการแก้ไขลง
`docs/05-log/index.md` ตัวอย่างคำขอ: "เช็คหน่อยว่า backlog ตรงกับ requirement ล่าสุดไหม", "sync backlog ให้หน่อย"

## Open Questions tracking

แทนที่จะเพิ่ม tooling สำหรับ phase ถัดไป (`02-design`) ทั้งที่ Open Questions ของ spec ที่มีอยู่
ยังไม่ปิดแม้แต่ไฟล์เดียว โปรเจกต์นี้เลือกเพิ่มเครื่องมือรวบรวม Open Questions ที่ค้างทั้งหมดไว้
จุดเดียวก่อน เพื่อให้พาไปคุยกับผู้มีส่วนได้ส่วนเสีย (อาจารย์ที่ปรึกษา/ตัวแทนชุมชน) ได้ง่าย:

- **Agent** [.claude/agents/open-questions-tracker.md](.claude/agents/open-questions-tracker.md)
- **Skill** [.claude/skills/open-questions-tracker/SKILL.md](.claude/skills/open-questions-tracker/SKILL.md)

ทั้งสองไฟล์นี้ก็ตั้งใจอธิบาย process ซ้ำกันเหมือนคู่อื่น ๆ — **แก้ทั้งสองไฟล์พร้อมกันเสมอ**
เครื่องมือนี้**อ่านอย่างเดียว ไม่ตอบหรือเดาคำตอบ Open Question เอง** — ดึง Open Questions จาก
ทุกไฟล์ spec, จับคู่กับ backlog item ที่ provisional เพราะคำถามนั้น, เดาว่าควรถามผู้มีส่วนได้
ส่วนเสียฝ่ายไหน แล้ว **regenerate** (ไม่ใช่ append) ไฟล์สรุปที่
`docs/01-requirements/03-task/open-questions.md` ทุกครั้งที่รัน — ไฟล์นี้เป็น snapshot สถานะ
ปัจจุบัน ต่างจาก `05-log` ที่เก็บประวัติแบบ append เท่านั้น ตัวอย่างคำขอ: "สรุป Open Question
ที่ค้างอยู่ทั้งหมดให้หน่อย", "มีคำถามอะไรที่ต้องเอาไปถามอาจารย์/ชุมชนบ้าง"

## Feature List (จาก backlog)

จัดกลุ่ม backlog ให้เป็นภาพรวมระดับ Feature ที่อ่านง่ายกว่า backlog item ดิบ — อยู่ในฝั่ง
`01-requirements` ล้วน ไม่แตะ `02-design` จึงไม่ผูกกับ gate ของ Open Questions เรียกใช้ได้
ทันทีโดยไม่ต้องรอปิดคำถาม:

- **Agent** [.claude/agents/feature-list-builder.md](.claude/agents/feature-list-builder.md)
- **Skill** [.claude/skills/feature-list/SKILL.md](.claude/skills/feature-list/SKILL.md)

ทั้งสองไฟล์นี้ก็อธิบาย process ซ้ำกัน — **แก้ทั้งสองไฟล์พร้อมกันเสมอ** จัดกลุ่ม 1 Epic = 1
Feature เป็นค่าเริ่มต้น, จัด MoSCoW ระดับ Feature จาก Priority ของ backlog item ข้างใน, แล้ว
**regenerate** (ไม่ใช่ append) `docs/01-requirements/03-task/feature-list.md` ทุกครั้งที่รัน
— รูปแบบผลลัพธ์: ตารางสรุป (Feature / MoSCoW / backlog อ้างอิง) ด้านบน ตามด้วยคำอธิบายแต่ละ
Feature ด้านล่าง

## User Journey (จาก requirement) — ผ่าน gate ของ Open Questions

เครื่องมือแรกของโปรเจกต์ที่เขียนเข้า `02-design/01-prototypes/` จริง จึงเป็นจุดที่บังคับใช้กฎ
gate "Open Question ที่กระทบ scope ใหญ่ต้องปิดก่อนเข้า `02-design`" (ดูหัวข้อ "เงื่อนไขและ
ข้อกำหนดในการทำงาน" ด้านล่าง) โดยตรง:

- **Agent** [.claude/agents/user-journey-designer.md](.claude/agents/user-journey-designer.md)
- **Skill** [.claude/skills/user-journey/SKILL.md](.claude/skills/user-journey/SKILL.md)

ทั้งสองไฟล์นี้ก็อธิบาย process ซ้ำกัน — **แก้ทั้งสองไฟล์พร้อมกันเสมอ** ก่อนวาด journey ต้องเช็ค
`docs/01-requirements/03-task/open-questions.md` เสมอ — ถ้ามี Open Question กระทบ journey ที่
จะวาด **ต้องถามผู้ใช้ก่อนทุกครั้ง** ว่าจะร่างต่อแบบ DRAFT (ทำเครื่องหมายจุดที่ไม่แน่นอนไว้ชัดเจน)
หรือรอคำตอบก่อน — ห้ามเลือกแทนผู้ใช้หรือข้ามการเช็คนี้ไม่ว่ากรณีใด ผลลัพธ์เป็น Mermaid diagram
พร้อมคำอธิบายทีละ step ใต้กราฟที่ map กลับไปยัง `FR-x.x` ของสเปคต้นทางทุกข้อ บันทึกที่
`docs/02-design/01-prototypes/{persona-slug}-journey.md` พร้อม wikilink กลับไปยัง spec ต้นทาง
(bidirectional ตามกฎเดิม)

## Prototype Builder — สังเคราะห์ Requirement + Backlog + Feature List + User Journey เป็นหน้าจอ HTML แบบ Interactive

เครื่องมือที่แปลงทุกอย่างที่โปรเจกต์นี้สะสมไว้ (spec, backlog, feature list, journey) ให้เป็น
**Interactive Prototype** จริงที่เปิดในเบราว์เซอร์ได้ (มีพฤติกรรมจริงเมื่อคลิก/กรอกฟอร์ม ไม่ใช่
แค่ mockup นิ่ง) ยึด `docs/02-design/01-prototypes/DESIGN.md` เป็น design system เสมอ:

- **Agent** [.claude/agents/prototype-builder.md](.claude/agents/prototype-builder.md)
- **Skill** [.claude/skills/prototype-builder/SKILL.md](.claude/skills/prototype-builder/SKILL.md)

ทั้งสองไฟล์นี้ก็อธิบาย process ซ้ำกัน — **แก้ทั้งสองไฟล์พร้อมกันเสมอ** กฎสำคัญที่ห้ามข้าม:

1. **ไม่มี DESIGN.md → ห้ามเดาโทนสี/สไตล์เอง** ต้องหยุดถามผู้ใช้ก่อน (เสนอ ≥3 ทางเลือกพร้อม
   ข้อดี/ข้อเสีย) แล้วสร้าง DESIGN.md ให้ก่อนค่อยทำ prototype ต่อ
2. **ต้องเสนอแผนให้ผู้ใช้ยืนยันก่อนสร้างไฟล์จริงเสมอ** (หน้าจอที่จะสร้าง, อ้างอิงจากอะไร,
   component ที่ใช้, พฤติกรรม Interactive ที่จะใส่ต่อหน้าจอ, folder version ที่จะเก็บ) — ห้าม
   ข้ามแม้ผู้ใช้ขอให้ "ทำเลย"
3. **มี prototype version เดิมอยู่แล้ว → ต้องถามทุกครั้งไม่มีข้อยกเว้น** ว่าจะสร้าง version ใหม่
   (`prototype-v{N+1}/`) หรือแก้ version ล่าสุด พร้อมให้คำแนะนำ แต่ผู้ใช้ตัดสินใจเอง
4. เช็ค `open-questions.md` ก่อนวาดหน้าจอเสมอ เหมือน `user-journey-designer`
5. **Interactive baseline เป็นค่าเริ่มต้นของทุกหน้าจอ ไม่ใช่ทางเลือก**: ปุ่ม/ฟอร์มต้องมีผลลัพธ์
   จริงเมื่อกด, decision point ใน journey ต้องมี UI ให้เลือกจริง, state ที่ควรอยู่ข้ามหน้าให้
   persist ด้วย `localStorage`, data ที่ควรไปโผล่หน้าอื่นให้จำลอง data flow จริงข้ามหน้าจอ,
   ฟอร์ม validate ก่อนส่งจริง, ช่องค้นหา/กรองข้อมูลกรองแบบ live จริง — รายละเอียดเต็มอยู่ใน
   agent/skill ทั้งสองไฟล์ ห้ามส่ง static HTML เปล่า ๆ เว้นแต่ผู้ใช้ระบุไว้ในแผนที่ยืนยันแล้ว
   ว่าต้องการ static

รองรับทั้งสร้างทั้งระบบและระบุเจาะจง (เฉพาะ persona/feature/journey เดียว) ทุกจุดที่คลุมเครือ
ต้องถามพร้อมเสนออย่างน้อย 3 ทางเลือกพร้อมข้อดี/ข้อเสียเสมอ ไม่ใช่ถามลอย ๆ หรือเดาเอง

## Test Case Builder — Acceptance Criteria + User Journey → Test Plan

Acceptance Criteria มีอยู่แล้วในทุก backlog item (ผ่าน `backlog-analyst`/`requirement-to-backlog`)
เครื่องมือนี้แค่แปลงให้เป็น test case ที่พร้อมใช้ ไม่ได้แต่งเงื่อนไขใหม่:

- **Agent** [.claude/agents/test-case-builder.md](.claude/agents/test-case-builder.md)
- **Skill** [.claude/skills/test-cases/SKILL.md](.claude/skills/test-cases/SKILL.md)

ทั้งสองไฟล์นี้ก็อธิบาย process ซ้ำกัน — **แก้ทั้งสองไฟล์พร้อมกันเสมอ** `docs/03-testing/01-test-plan/test-plan.md` แบ่งเป็น 2 ส่วนที่ปฏิบัติต่างกัน: **"Test Case จาก Acceptance
Criteria"** (`TC-XXX`) — regenerate ทั้งหมดใหม่ทุกครั้งที่รันจาก backlog + journey ปัจจุบัน
กับ **"Test Case เพิ่มเติม (เพิ่มโดยมนุษย์)"** (`TC-M-XXX`) — **ห้ามแตะต้องเด็ดขาด** เก็บ edge
case ที่คนเพิ่มเอง คนละ namespace ID กับส่วน auto-generated เพื่อไม่ให้ชนกัน backlog item ที่
ไม่มี step ใน journey ใดเลย (เช่น พฤติกรรม backend อย่าง log retention) จะไม่ถูกสร้าง test case
ให้ แต่ระบุไว้ในหัวข้อ "Backlog ที่ยังไม่มี Test Case" แทน

ยังไม่สร้างเครื่องมือบันทึกผลทดสอบจริง (`03-testing/02-test-result`) เพราะยังไม่มีโค้ดให้รัน
ทดสอบ — รอจนกว่าจะเริ่มมีโค้ดจริงค่อยพิจารณาเพิ่ม

## Technical Design (Conceptual) — 3 คู่ agent/skill สำหรับ `02-design/02-technical`

ครอบคลุม High-Level Architecture, Database Schema/API Spec, และ Detailed Design **ทั้งหมด
เป็น conceptual — ห้ามผูกมัดกับ technical stack เฉพาะเจาะจง** (framework/ภาษา/ยี่ห้อฐานข้อมูล/
cloud) เว้นแต่ผู้ใช้ระบุเองว่าตัดสินใจแล้ว ทั้ง 3 คู่ยึดหลักการเดียวกัน: **จุดไหนต้องตัดสินใจ
เชิงเทคนิคแทนผู้ใช้ ห้ามเดา ต้องถามพร้อมเสนออย่างน้อย 3 แนวทางพร้อมข้อดี/ข้อเสียเสมอ** และ
เขียนทับเฉพาะส่วนที่เปลี่ยนในไฟล์เดิม (ไม่ regenerate ทั้งไฟล์แบบ feature-list/open-questions
เพราะเอกสารกลุ่มนี้มีเนื้อหาเชิงตัดสินใจที่มนุษย์มักแก้ไขเพิ่มเติมด้วยมือ)

**1+2. Architecture + Database Schema + API Spec — รวมไว้ในไฟล์เดียว** `docs/02-design/02-technical/architecture.md`
เป็น "ภาพรวมระบบ" ไฟล์เดียว (ตามที่ผู้ใช้ขอ 2026-08-28 — เดิมเคยแยก `architecture.md` กับ
`data-api-spec.md` สองไฟล์) มี **2 คู่ agent/skill ที่แก้ไฟล์เดียวกันนี้ คนละหัวข้อ**:

- **Architecture** (component หลัก + data flow ตาม User Journey + ประเด็นข้ามระบบ):
  - **Agent** [.claude/agents/architecture-designer.md](.claude/agents/architecture-designer.md)
  - **Skill** [.claude/skills/architecture-design/SKILL.md](.claude/skills/architecture-design/SKILL.md)
- **Database Schema + API Spec** (ER Diagram, รายละเอียดแต่ละ entity, API operation):
  - **Agent** [.claude/agents/data-api-designer.md](.claude/agents/data-api-designer.md)
  - **Skill** [.claude/skills/data-api-design/SKILL.md](.claude/skills/data-api-design/SKILL.md)

ทั้งสองคู่นี้ **ต้องอ่านไฟล์ `architecture.md` เต็มไฟล์ก่อนแก้เสมอ** และแก้เฉพาะหัวข้อที่ตนดูแล
(Architecture: Context/Component หลัก/Data Flow/ประเด็นข้ามระบบ/Decision Log/Open Items —
Data & API: Database Schema/API Spec) ห้ามลบ/แก้หัวข้อของอีกฝ่าย

**3. Detailed Design** — Sequence Flow ของการทำงานสำคัญที่ข้าม component (แยกไฟล์ต่างหาก
เพราะเป็นรายละเอียดที่ลึกกว่าระดับภาพรวม):
- **Agent** [.claude/agents/detailed-designer.md](.claude/agents/detailed-designer.md)
- **Skill** [.claude/skills/detailed-design/SKILL.md](.claude/skills/detailed-design/SKILL.md)
- บันทึกที่ `docs/02-design/02-technical/detailed-design.md` — ควรมี `architecture.md`
  (ครบทั้งส่วน Architecture และ Database/API) ก่อน (ไม่บังคับ แต่ sequence จะอ้างอิง
  component/API จากไฟล์นั้น)

ทุกคู่ในกลุ่มนี้เป็นไฟล์แยกกัน (agent ≠ skill ในแต่ละคู่) — **แก้ทั้งสองไฟล์ในคู่เดียวกันพร้อม
กันเสมอ** เหมือนคู่อื่น ๆ ทั้งหมดในโปรเจกต์นี้

## โครงสร้างเอกสารและลำดับการไหลของงาน (docs pipeline)

เอกสารทั้งหมดอยู่ใต้ `docs/` และแต่ละโฟลเดอร์มี `index.md` อธิบายจุดประสงค์ของตัวเอง ลำดับการไหลของงานคือ:

```
01-requirements (01-spec → 02-plan → 03-task)
        ↓
02-design (01-prototypes → 02-technical)
        ↓
03-testing (01-test-plan → 02-test-result)
        ↓
04-retrospectives
```

พร้อมกับ `05-log` ที่บันทึกความเคลื่อนไหว/การตัดสินใจสำคัญแบบ chronological คู่ขนานไปกับทุกขั้นตอน และ `00-archived` สำหรับเอกสารที่เลิกใช้แล้ว

รายละเอียดแต่ละโฟลเดอร์:

- **01-requirements/01-spec** — ต้นทาง (source of truth) ของ feature requirements, user stories, business rules, scope
- **01-requirements/02-plan** — roadmap, phase/milestone, priority ที่แตกมาจาก spec
- **01-requirements/03-task** — task breakdown ที่ลงมือทำได้จริง พร้อมสถานะ/ผู้รับผิดชอบ (รวม `product-backlog.md`)
- **02-design/01-prototypes** — wireframe/mockup, user flow, design system เบื้องต้น อ้างอิงจาก spec
- **02-design/02-technical** — system architecture, database schema, API design, ตัวเลือกเทคโนโลยี
- **03-testing/01-test-plan** — test case/scenario อ้างอิงจาก spec และ technical design
- **03-testing/02-test-result** — ผล pass/fail และบั๊กที่พบจริง
- **04-retrospectives** — สรุปบทเรียนหลังจบ phase/sprint โดยอ้างอิงจาก test result และ log
- **05-log** — changelog, decision log, เหตุการณ์สำคัญ
- **00-archived** — เอกสารเวอร์ชันเก่า/ที่ถูกยกเลิก

**ทั้ง repo นี้คือ Obsidian vault เดียว** — root ของ vault คือโฟลเดอร์บนสุดของ repo (ที่มี `CLAUDE.md`) **ไม่ใช่ `docs/`** ไฟล์ config `.obsidian/app.json` อยู่ที่ root ตั้ง link format เป็น wikilink แบบ relative path (`newLinkFormat: relative`, `useMarkdownLinks: false`) เพื่อให้ลิงก์ที่สร้างผ่าน Obsidian UI ตรงกับธรรมเนียมเดิม — **เวลาเปิดวอลต์ใน Obsidian ต้องเปิดที่โฟลเดอร์ root ของ repo เสมอ ห้ามเปิดที่ `docs/` เป็นวอลต์แยก** ไม่เช่นนั้นจะหาไฟล์ในนี้ไม่เจอเพราะ Obsidian จะไม่เห็น `.obsidian/app.json` และอาจสร้างวอลต์ใหม่ที่ว่างเปล่าซ้อนขึ้นมาแทน ไฟล์ `.obsidian/workspace*.json` และ `cache` ที่ root ถูก gitignore ไว้เพราะเป็น local/user-specific state

## กฎสำคัญเมื่อแก้ไขเอกสาร

- **ห้ามลบเอกสารออกจากโปรเจกต์โดยตรง** — ให้ย้ายไปเก็บไว้ใน `docs/00-archived/` เพื่อรักษาประวัติการตัดสินใจ (ระบุไว้ใน `docs/00-archived/index.md`)
- เอกสารแต่ละหมวดอ้างอิงถึงกันด้วย wikilink สไตล์ Obsidian (`[[../path/index|label]]`) ตามลำดับการไหลของงานข้างต้น — เมื่อเพิ่มเอกสารใหม่ในหมวดใด ให้เชื่อมโยงไปยังหมวดต้นทางและหมวดปลายทางตามรูปแบบเดิม
- เนื้อหาเอกสารเขียนเป็นภาษาไทย ให้เขียนเอกสารใหม่ในภาษาเดียวกันเพื่อความสอดคล้อง

## เงื่อนไขและข้อกำหนดในการทำงาน

- **ห้ามข้ามลำดับ pipeline** — อย่าเริ่มเขียนเอกสารในหมวดปลายทาง (เช่น `02-design`, `03-testing`) ก่อนที่หมวดต้นทางที่เกี่ยวข้อง (เช่น `01-requirements/01-spec`) จะมีเนื้อหารองรับ หากจำเป็นต้องข้าม ให้ระบุเหตุผลไว้ใน `05-log`
- **Open Question ที่กระทบ scope ใหญ่ต้องปิดก่อนเข้า `02-design`** — เช่น Open Questions ของ `local-story-hub.md` ตอนนี้ (เลือกแพลตฟอร์ม website/application, สิทธิ์การเข้าถึงของแต่ละชุมชน, ขอบเขตของ "ระบบจัดการข้อมูล") ต้องได้รับคำตอบและบันทึกไว้ใน `docs/05-log/index.md` ก่อน ห้ามออกแบบ (`02-design`) โดยเดาคำตอบเอง ส่วน Open Question ปลีกย่อยที่ไม่กระทบ scope หลักสามารถเดินหน้าคู่กันได้
- **บันทึกการตัดสินใจสำคัญทุกครั้ง** — เมื่อมีการเปลี่ยนแผน เปลี่ยน scope หรือตัดสินใจเชิงเทคนิคที่กระทบหลายหมวด ให้เพิ่มรายการใน `docs/05-log/index.md` พร้อมวันที่และเหตุผล
- **ปรับสถานะงานให้ตรงความจริงเสมอ** — เอกสารใน `01-requirements/03-task` ต้องสะท้อนสถานะปัจจุบัน (ยังไม่เริ่ม/กำลังทำ/เสร็จแล้ว) ทุกครั้งที่มีความคืบหน้า
- **ก่อนทำการเปลี่ยนแปลงเชิงโครงสร้าง** (ย้าย/ลบ/รีออร์แกไนซ์โฟลเดอร์ในระดับ `docs/`) ให้แจ้งและขอคำยืนยันจากผู้ใช้ก่อนเสมอ เนื่องจากกระทบ wikilink ที่เชื่อมโยงกันทั้งโปรเจกต์
- ยังไม่มี build/lint/test สำหรับตัวแพลตฟอร์ม Local Story Hub เพราะยังไม่มีโค้ดแอปจริง (มีแค่ Firestore seed script ตามหัวข้อด้านบน) — เมื่อเริ่มมีโค้ดแอปจริง ให้เพิ่มเงื่อนไขเรื่อง build/lint/test commands ในไฟล์นี้ทันที
- **ห้ามใส่คีย์/ความลับ (service account key, API secret, token, password) ลงในไฟล์ใดๆ ที่จะถูก push ขึ้น GitHub เด็ดขาด** — repo นี้เป็น public แล้ว ใช้ `.gitignore` กันไว้เสมอ (ดูตัวอย่าง `LSH/serviceAccountKey.json`) ถ้าไม่แน่ใจว่าไฟล์/ค่าไหนเป็นความลับหรือไม่ **ให้หยุดถามผู้ใช้ก่อน commit/push เสมอ** ห้ามเดาเอง

> เงื่อนไขข้างต้นเป็นค่าเริ่มต้นที่สรุปจากกฎที่มีอยู่แล้วในเอกสาร หากมีข้อกำหนดเฉพาะเจาะจงเพิ่มเติม (เช่น ผู้อนุมัติเอกสาร, deadline ของแต่ละ phase, เครื่องมือที่ต้องใช้) แจ้งได้เพื่อเพิ่มเข้าไปในส่วนนี้

## ผู้มีส่วนได้ส่วนเสีย

ผู้อนุมัติ/ตัดสินใจ scope ของ Local Story Hub:

- **อาจารย์ที่ปรึกษา** — ผู้ดูแล/อนุมัติทิศทางโครงการฝั่งวิชาการ
- **ตัวแทนชุมชน** — ผู้ให้ข้อมูลและยืนยันความต้องการฝั่งผู้ใช้จริงในชุมชน

เมื่อ agent/skill เจอ Open Question ที่ต้องสอบถามเพิ่ม ให้ระบุในรายงานว่าควรถามฝ่ายใด (วิชาการ/หลักการเรียน → อาจารย์ที่ปรึกษา, ความต้องการ/บริบทของชุมชน → ตัวแทนชุมชน) แทนการเดาคำตอบเอง

## แนวโน้มที่ต้องเตรียมล่วงหน้า

- **Data privacy**: ระบบเก็บข้อมูลผู้ใช้จริง (รีวิว/บันทึกสถานที่ของนักท่องเที่ยว, ข้อมูล/คอนเทนต์ของชุมชน, ผลงานของนิสิต) ก่อนเข้า `02-design` ควรมี spec แยกเรื่อง data privacy/การเก็บรักษาข้อมูลผู้ใช้ (ยังไม่มีในตอนนี้ ไม่ใช่ requirement ที่ตั้งขึ้นเอง แต่เป็นข้อสังเกตให้เตรียมสอบถามผู้มีส่วนได้ส่วนเสีย)
