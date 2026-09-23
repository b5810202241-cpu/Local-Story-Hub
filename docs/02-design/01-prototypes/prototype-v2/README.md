# Prototype v2

- **สถานะ**: DRAFT — ต่อยอดจาก [[../prototype-v1/README|prototype-v1]] เฉพาะ 3 หน้าจอ (นิสิต, อาจารย์, และหน้าสาธารณะดูผลงาน) ยังไม่ครอบคลุมทั้งระบบ
- **อ้างอิงจาก**: [[../DESIGN|DESIGN.md]] (design system เดิม, ไม่เปลี่ยน), [[../../../01-requirements/03-task/product-backlog|product-backlog]] (BL-018)
- **ขอบเขต**: เฉพาะ persona นิสิตนิเทศศาสตร์ + อาจารย์ (เหมือน v1 ทุกอย่าง ต่างแค่แหล่งข้อมูล)

เปิดจากเบราว์เซอร์ตรงๆ ไม่ได้เต็มรูปแบบ เพราะใช้ Firebase JS SDK แบบ ES module ซึ่งต้อง serve ผ่าน HTTP server (ติด CORS ถ้าเปิดแบบ `file://`) — รันเซิร์ฟเวอร์ static ธรรมดาชี้มาที่โฟลเดอร์นี้ก่อนเปิด

**ก่อนรันครั้งแรก (เพิ่ม 2026-09-18):** ต้องสร้างไฟล์ `firebase-config.js` เอง (คัดลอกจาก `firebase-config.example.js` แล้วใส่ค่าจริงจาก Firebase Console) — ไฟล์นี้ถูก `.gitignore` ไว้ที่ root ของ repo ไม่ได้อยู่ใน GitHub เพื่อไม่ให้ config ฝังอยู่ในโค้ดโดยตรง ทั้ง 3 หน้าจอโหลดไฟล์นี้ผ่าน `<script src="firebase-config.js">` ก่อน initialize Firebase

### ปุ่ม "✨ AI ช่วยปรับปรุงคำอธิบายผลงาน" ใน `student-publish.html` (เพิ่ม 2026-09-19) — local demo เท่านั้น

นิสิตพิมพ์คำอธิบายคร่าวๆ (หรือปล่อยว่าง) แล้วกดปุ่มใต้ช่อง "คำอธิบายผลงาน" → เรียก OpenRouter API
(`google/gemini-2.5-flash-lite`) ตรงจาก browser ให้ช่วยเรียบเรียงข้อความ → แสดงผลลัพธ์พร้อมปุ่ม
"ใช้ข้อความนี้แทนคำอธิบายเดิม" (ไม่ auto-submit นิสิตแก้ต่อเองได้ก่อนกดส่งจริง)

**ต้องสร้างไฟล์ `ai-assist-config.js` เอง** (คัดลอกจาก `ai-assist-config.example.js` แล้วใส่ OpenRouter
key จริงจาก https://openrouter.ai/keys) — ไม่มีไฟล์นี้ ปุ่มจะถูก disable อัตโนมัติ

⚠️ **คีย์นี้เป็น secret จริง (ต่างจาก Firebase apiKey ที่ตั้งใจให้ public ได้)** — ถ้าฝังใน client-side
แล้วเผยแพร่สู่สาธารณะ ใครก็ขโมยไปใช้แทนบัญชีได้ทันทีจาก network tab ดังนั้น:

- `ai-assist-config.js` ถูก `.gitignore` (ไม่ขึ้น GitHub) **และ**ถูกใส่ใน `firebase.json` →
  `hosting.ignore` (ไม่ถูกอัปโหลดตอน `firebase deploy --only hosting` แม้จะอยู่ในโฟลเดอร์ public นี้ก็ตาม)
  — ห้ามลบรายการนี้ออกจาก `hosting.ignore` จนกว่าฟีเจอร์นี้จะย้ายไปเรียกผ่าน backend/serverless proxy
  (เช่น Firebase Cloud Function) ที่เก็บคีย์ไว้ฝั่งเซิร์ฟเวอร์แทน
- ฟีเจอร์นี้ใช้ทดสอบในเครื่อง (local server) เท่านั้น ตอนนี้ยังไม่เหมาะ deploy ขึ้นใช้งานจริงกับผู้ใช้จริง

**เพิ่ม 2026-09-19 — checklist ตรวจสอบผ่านแล้ว**: มีป้าย "🤖 ข้อเสนอจาก AI — โปรดตรวจสอบก่อนยืนยัน"
(ซ่อนตอน error กันกดเอา error message ไปใช้แทน), มี timeout 15 วินาทีด้วย `AbortController` (ทดสอบจริง
แล้วว่า trigger ที่ ~15.0 วิ), การบันทึก log ไม่ `await` อีกต่อไป (fire-and-forget) — **เจอบั๊กจริงระหว่าง
ทดสอบ**: เดิม await การเขียน log ทำให้ปุ่มค้างถ้า Firestore ไม่ตอบสนอง แก้แล้ว ปุ่ม "ส่งขออนุมัติ" หลักไม่เคย
ผูกกับสถานะ AI อยู่แล้วจึงกดได้ปกติเสมอ

### ปุ่ม "🤖 AI สรุปภาพรวมผลงานที่รอพิจารณา" ใน `admin-review-student-work.html` (เพิ่ม 2026-09-19) — "ระดับ 2"

ต่างจากปุ่มใน `student-publish.html` (ระดับ 1 = ถามครั้งเดียวตอบครั้งเดียว) ปุ่มนี้เป็น "ระดับ 2": อ่านผลงาน
ที่สถานะ `รอพิจารณา` ทั้งหมดจาก Firestore (ใช้ list ที่ `onSnapshot` โหลดไว้อยู่แล้ว ไม่ query ซ้ำ) → ส่งให้
OpenRouter (`google/gemini-2.5-flash-lite`) สรุปภาพรวมเป็นภาษาไทยสั้นๆ ให้อาจารย์อ่านก่อนตรวจทีละชิ้น →
**เขียนผลสรุปกลับเป็นเอกสารใหม่ในคอลเลกชัน `AiSummaries`** (ไม่ทับของเดิม เก็บเป็นประวัติ) → จด log การทำงาน
ลง `AiAssistLogs` เดียวกับระดับ 1 (เพิ่ม field `level`/`action` แยกว่าเป็นระดับไหนทำอะไร)

ใช้คีย์ไฟล์เดียวกับระดับ 1 (`ai-assist-config.js`) และมี timeout ป้องกันการค้างสองชั้น: 15 วินาทีสำหรับ
เรียก OpenRouter, 10 วินาทีสำหรับเขียนผลลง Firestore (ถ้าเขียนไม่สำเร็จจะแจ้งว่า "ยังไม่ได้บันทึกอะไรลง
ฐานข้อมูล" ไม่ทิ้งสถานะค้างครึ่งๆ กลางๆ)

**`LSH/firestore.rules`**: เพิ่ม `match /AiSummaries/{summaryId}` (create/read เฉพาะ role=`teacher`,
update/delete ปิดหมด) และแก้ `AiAssistLogs.create` ให้อนุญาตทั้งนิสิตที่อนุมัติแล้วและอาจารย์ (เดิมอนุญาต
เฉพาะนิสิต) — **ยังไม่ได้ deploy กฎนี้ขึ้น project จริง** ต้องรัน `firebase deploy --only firestore:rules`
ก่อนฟีเจอร์นี้จะเขียนข้อมูลจริงสำเร็จ

### แปะร่องรอยการใช้ AI ลงบนตัวเอกสารที่ส่งจริง (เพิ่ม 2026-09-19)

อิงแนวทางจากโปรเจก leaveeasy (เก็บ `aiSuggestion` ติดกับเอกสารหลัก ไม่ใช่แค่ log แยก) — ปรับให้เข้ากับจังหวะ
ของ LSH ระดับ 1 ที่ AI ถูกเรียก**ก่อน**มีเอกสาร `LSHRequests` จริง (นิสิตยังไม่กดส่ง): ตอนกด "ใช้ข้อความนี้"
จะจำข้อความที่ AI เสนอไว้ในตัวแปร แล้วตอนกด "ส่งขออนุมัติ" จริง จะแปะเพิ่มลงเอกสาร `LSHRequests`:

- `aiAssisted: true/false` — เคยกด "ใช้ข้อความนี้" ระหว่างร่างชิ้นนี้หรือไม่
- `aiSuggestionText` — ข้อความที่ AI เสนอ (ถ้าใช้), `null` ถ้าไม่ได้ใช้

`admin-review-student-work.html` แสดงป้าย "🤖 มี AI ช่วยร่าง" ต่อท้ายชื่อผลงานในรายการรอพิจารณา ถ้า
`aiAssisted === true` ให้อาจารย์เห็นตั้งแต่แรกว่าชิ้นไหนมี AI ช่วย — log ดิบทุกครั้งที่กด (ไม่ว่าจะเอาไปใช้จริง
หรือไม่) ยังอยู่ใน `AiAssistLogs` เหมือนเดิม (เก็บเป็น top-level collection ไม่ nest ใต้ `LSHRequests` เพราะ
เรียกได้ตั้งแต่ก่อนมีเอกสารจริง ต่างจาก leaveeasy ที่ใบลามีอยู่แล้วตอนเรียก AI)

## ต่างจาก prototype-v1 ตรงไหน

v1 ใช้ `localStorage` จำลองข้อมูลอย่างเดียว ส่วน v2 เชื่อมกับ **Firestore project `lsh-nammon` จริง** (collection `LSHRequests`, `users`) ผ่าน Firebase JS SDK (CDN, modular):

- **`student-publish.html`**: ต้อง login ก่อนถึงเห็นฟอร์ม กดส่งแล้วเขียนเอกสารใหม่ลง `LSHRequests` จริงด้วย `status: 'รอพิจารณา'` โดยใช้ตัวตนจาก login จริง (ไม่ใช่ dropdown เลือกเอง) แล้ว **นำทางไปหน้า `admin-review-student-work.html` ทันที** (v1 ค้างที่ success panel ให้กดเผยแพร่ผลงานอีกชิ้นต่อ)
- **`admin-review-student-work.html`**: ต้อง login ก่อนถึงเห็นรายการ อ่านข้อมูลจาก `LSHRequests` แบบ real-time (`onSnapshot`) กดอนุมัติ/ไม่อนุมัติแล้ว update สถานะใน Firestore จริงทันที (v1 เขียนกลับ `localStorage`) ผู้อนุมัติมาจากบัญชีที่ login อยู่จริง

### ระบบ Login จริง (Firebase Authentication) + จำกัดสิทธิ์ตาม ACL.md (เพิ่ม 2026-09-11)

ทั้งสองหน้าเพิ่มระบบ login จริงผ่าน **Firebase Authentication** (Email/Password) — ไม่ใช่แค่จำลอง:

- เปิด provider Email/Password ให้ project `lsh-nammon` แล้ว และสร้างบัญชี Auth จริงให้ 4 user ที่ seed ไว้ (`uid` ตรงกับ doc id ใน `users` collection พอดี คือ u001-u004) — **รหัสผ่านสาธิตทุกบัญชีเหมือนกัน — ดูจากผู้ดูแลระบบ ไม่ได้เก็บไว้ในเอกสารนี้ด้วยเหตุผลด้านความปลอดภัย (ไฟล์นี้ถูก push ขึ้น public repo)**
- login สำเร็จ → หา doc `users/{uid}` เพื่ออ่าน `role` แล้วจำกัด UI ตาม [[../../02-technical/ACL|ACL.md]]:
  - `student-publish.html`: role ≠ `student` → ซ่อนฟอร์ม แสดงข้อความปฏิเสธอ้างอิง ACL แทน
  - `admin-review-student-work.html`: role ≠ `teacher` → ซ่อนปุ่มอนุมัติ/ไม่อนุมัติทั้งหมด แสดงข้อความปฏิเสธอ้างอิง ACL แทน
  - ลิงก์เมนูข้ามหน้า ("มุมมองอาจารย์"/"มุมมองนิสิต") ซ่อนเมื่อ role ปัจจุบันไม่ตรงกับหน้านั้น
  - ยังไม่ login เลย → เห็นแค่ฟอร์ม login เท่านั้น
- **จำกัดสิทธิ์จริงระดับ backend ด้วย** ไม่ใช่แค่ซ่อนปุ่ม — อัปเดต `LSH/firestore.rules` (deploy แล้วจริงกับ project `lsh-nammon`) ให้บังคับ: `create` บน `LSHRequests` ต้อง login และ role=`student` และ `requesterId` ต้องตรงกับ `uid` ของตนเอง (กันสวมรอย), `update` ต้อง login และ role=`teacher` เท่านั้น, อ่าน `users/{uid}` ได้เฉพาะเจ้าของบัญชี — ทดสอบยิง request ตรงผ่าน browser console (ข้าม UI) แล้วว่า rules บล็อกจริงทั้ง 3 กรณี (นิสิตพยายามอนุมัติเอง, นิสิตพยายามสวมรอยส่งงานแทนคนอื่น, ไม่ login แล้วพยายามอ่านข้อมูล)

### Field ใหม่ที่เพิ่มเข้า `LSHRequests` (ไม่มีในเอกสารที่ seed ไว้เดิม)

- **`community`** — จากฟอร์มเดิมที่มีอยู่แล้วใน `student-publish.html` (ค่าจาก dropdown เลือกชุมชน) มีที่มาจาก FR-3.1/Open Question เรื่องเชื่อมโยงชุมชน แต่ schema เดิมของ `LSHRequests` ยังไม่มี field นี้ — เอกสารเก่า (req001-005) จึงไม่มี field นี้ (แสดงเป็นช่องว่างในตาราง)
- **`rejectionReason`** — เหตุผลตอนกดไม่อนุมัติ (มีอยู่แล้วใน UI ของ v1 แต่เดิมเก็บใน `localStorage` เท่านั้น)

ดูรายละเอียดเพิ่มเติมที่หัวข้อ "Mapping กับข้อมูลจริงใน Firestore" ใน [[../../02-technical/architecture|architecture.md]]

### ทดสอบแล้ว (2026-09-11)

**รอบแรก (ก่อนมี login):** ส่งฟอร์มทดสอบจริง 1 รายการ → ปรากฏในหน้า admin แบบ real-time → กดอนุมัติสำเร็จ → ทดสอบกดไม่อนุมัติกับอีกรายการ (คืนสถานะกลับหลังทดสอบเสร็จ)

**รอบสอง (หลังเพิ่ม login + rules):**
- login เป็นนิสิต (u001) → เห็นฟอร์ม → ส่งสำเร็จ → redirect ไปหน้า admin → เห็น deny-view ถูกต้อง (ไม่ใช่อาจารย์)
- login เป็นอาจารย์ (u004) → เห็นรายการ + ปุ่มอนุมัติ/ไม่อนุมัติ → กดอนุมัติสำเร็จด้วยตัวตนจาก session จริง (ไม่ใช่ hardcode)
- ยิง request ตรงผ่าน browser console ข้าม UI ไปเลย 3 กรณี — **rules บล็อกจริงทุกกรณี**: (1) นิสิตพยายามอนุมัติงาน `permission-denied`, (2) นิสิตพยายามส่งงานสวมรอยเป็นคนอื่น `permission-denied`, (3) ไม่ login แล้วพยายามอ่านข้อมูล `permission-denied`
- ข้อมูลทดสอบทั้งหมดถูกลบ/คืนสถานะกลับเป็น 3 รอพิจารณา/1 อนุมัติ/1 ไม่อนุมัติ เหมือนเดิมทุกประการหลังทดสอบเสร็จ

> **บทเรียนจากการทดสอบ**: ระหว่างทดสอบเจอแท็บเบราว์เซอร์ค้าง (auto-preview จากการแก้ไฟล์ครั้งก่อนๆ) ที่ยังรันโค้ดเวอร์ชันเก่า (ก่อนมี login) อยู่เบื้องหลัง ทำให้มีการอนุมัติผลงานเกิดขึ้นโดยไม่ได้ตั้งใจ 2 ครั้ง — แก้ไขข้อมูลกลับให้ถูกต้องแล้ว บทเรียน: ปิดแท็บ preview เก่าทุกครั้งก่อนทดสอบรอบใหม่

### หมายเหตุ: role ของอาจารย์ใน Firestore คือ `teacher` ไม่ใช่ `admin`

`users` collection ที่ seed ไว้จริงใช้ `role: "teacher"` สำหรับอาจารย์ ในขณะที่ entity `UserAccount` เชิงแนวคิดใน `architecture.md` ใช้ `role: admin` — โค้ดใน v2 และ `firestore.rules` **ยึดตามของจริง (`teacher`)** เพราะต้องทำงานกับข้อมูลที่มีอยู่จริง ไม่ใช่ schema เชิงแนวคิด (ดู [[../../02-technical/architecture|architecture.md]] § Mapping)

### สมัครสมาชิก + อนุมัติบัญชีผู้ใช้ใหม่ (เพิ่ม 2026-09-12)

> ดู User Journey (Confirmed, เพิ่ม 2026-09-22) ที่แตกจาก flow นี้ที่ [[../student-account-registration-journey|student-account-registration-journey]]

Implement ตาม [[../../../01-requirements/01-spec/20260912-01-account-registration-approval|20260912-01-account-registration-approval]] (BL-019, BL-020) — **เฉพาะบทบาทนิสิตเท่านั้นที่สมัครเองได้** บัญชีอาจารย์ยัง provision โดย admin เหมือนเดิม:

- **`student-publish.html`**: เพิ่มลิงก์ "สมัครสมาชิก (นิสิต)" ที่หน้า login — กรอกชื่อ-นามสกุล/อีเมล/รหัสผ่าน แล้ว `createUserWithEmailAndPassword` + สร้างเอกสาร `users/{uid}` เอง ด้วย `role: 'student'`, `status: 'รออนุมัติ'` เสมอ (กำหนดจาก client แต่ rules บังคับค่านี้ซ้ำอีกชั้น กันแก้ไขค่าเอง) — หลังสมัครเสร็จเห็นข้อความ "รอการอนุมัติ" ทันที บัญชีที่สถานะ `รออนุมัติ`/`ไม่อนุมัติ` login เข้ามาจะเห็นข้อความสถานะนั้นๆ แทนฟอร์ม (บัญชี `ไม่อนุมัติ` แสดงเหตุผลที่อาจารย์ระบุ พร้อมข้อความว่าต้องสมัครใหม่เท่านั้น)
- **`admin-review-student-work.html`**: เพิ่มหัวข้อ "บัญชีผู้ใช้ใหม่ที่รออนุมัติ" อ่านจาก `users` ด้วย query `role==student && status==รออนุมัติ` แบบ real-time พร้อม**แบนเนอร์แจ้งเตือนจำลอง** ("🔔 มีบัญชีนิสิตใหม่ N รายการรออนุมัติ") แทนการส่งอีเมลจริง (ตามที่ตัดสินใจไว้ — ยังไม่มีบริการส่งอีเมลให้ใช้) กดอนุมัติ → `status: 'อนุมัติแล้ว'`, กดไม่อนุมัติ (บังคับกรอกเหตุผล) → `status: 'ไม่อนุมัติ'` + `rejectionReason`
- **`LSH/firestore.rules`**: เพิ่มกฎสำหรับ `users` — `create` อนุญาตเฉพาะเจ้าของบัญชีสร้างเอกสารตัวเอง และบังคับ `role='student'`, `status='รออนุมัติ'` เท่านั้น (กันสมัครเป็นอาจารย์หรือ self-approve ตั้งแต่ตอนสมัคร), `read` เฉพาะเจ้าของหรือ role=`teacher`, `update` เฉพาะ role=`teacher` และจำกัด field ที่แก้ได้ (`status`/`approverId`/`approverName`/`rejectionReason` เท่านั้น) — เพิ่มเงื่อนไข `isApprovedStudent()` ให้ `LSHRequests.create` ต้องเป็นนิสิตที่ `status='อนุมัติแล้ว'` เท่านั้นด้วย (เดิมเช็คแค่ role)
- **ข้อมูลเดิม (u001-u003)**: เพิ่ม `status: 'อนุมัติแล้ว'` ย้อนหลังให้ทั้ง 3 บัญชี (migration ครั้งเดียว) เพื่อไม่ให้ของเดิมใช้งานไม่ได้ — อัปเดต `LSH/scripts/seed-firestore.js` ให้ seed ครั้งต่อไปมี field นี้ด้วย

**ทดสอบแล้ว (2026-09-12):** สมัครบัญชีทดสอบ 2 บัญชี → บัญชีแรก: เห็นสถานะรออนุมัติถูกต้อง, อาจารย์เห็นในรายการ+แบนเนอร์, กดอนุมัติสำเร็จด้วยตัวตนจริง, login กลับมาเห็นฟอร์มส่งผลงานได้ปกติ — บัญชีที่สอง: ทดสอบยิง request ตรงผ่าน browser console ข้าม UI 3 กรณี (ส่งผลงานทั้งที่ยังไม่อนุมัติ, self-approve ตัวเอง, อ่านข้อมูล user คนอื่น) **rules บล็อกจริงทุกกรณี** แล้วทดสอบกดไม่อนุมัติผ่าน UI จริง เห็นเหตุผลที่อาจารย์ระบุถูกต้องตอน login กลับมา — ลบบัญชีทดสอบทั้งสองออกหลังทดสอบเสร็จ (ทั้ง Firebase Auth และเอกสาร Firestore)

### ดู/ค้นหาผลงานที่เผยแพร่แล้วโดยไม่ต้อง Login (เพิ่ม 2026-09-12)

> ดู User Journey (DRAFT บางส่วน, เพิ่ม 2026-09-22) ที่แตกจาก flow นี้ที่ [[../public-view-search-journey|public-view-search-journey]]

Implement ตาม [[../../../01-requirements/01-spec/20260912-02-public-view-search-published-works|20260912-02-public-view-search-published-works]] (BL-021) — หน้าใหม่ **`published-works.html`**:

- ไม่มีหน้า login เลย เปิดดูได้ทันที — อ่าน `LSHRequests` ด้วย query `where('status','==','อนุมัติ')` แบบ real-time (`onSnapshot`)
- ช่องค้นหา (`<select>`) กรองตามชื่อชุมชนที่สนใจ (ชุมชนบ้านผาบ่อง/ชุมชนริมน้ำแม่กลอง/ชุมชนดอยสูง/ทั้งหมด) แบบ live ที่ client-side จากผลลัพธ์ที่โหลดมาแล้ว
- ผลงานเก่าที่ไม่มี field `community` (เช่น req004) แสดงเป็น "ไม่ระบุชุมชน" แทนที่จะซ่อนไปเลย
- เพิ่มลิงก์ "ผลงานที่เผยแพร่แล้ว" ในเมนูของ `student-publish.html` และ `admin-review-student-work.html` ให้กดเข้าถึงได้ง่าย
- **`LSH/firestore.rules`**: แก้ `allow read` ของ `LSHRequests` จาก "ต้อง login เท่านั้น" เป็น `request.auth != null || resource.data.status == 'อนุมัติ'` — อนุญาต public read เฉพาะเอกสารที่อนุมัติแล้วเท่านั้น เอกสารอื่นยังต้อง login เหมือนเดิม (นี่คือ public read operation แรกของระบบ)

**ทดสอบแล้ว (2026-09-12):** เปิดหน้าโดยไม่ login เห็นผลงานที่อนุมัติแล้วถูกต้อง, ค้นหากรองตามชุมชนทำงานถูกต้อง — ทดสอบยิง request ตรงข้าม UI 2 กรณี: (1) อ่านเอกสารที่ยังไม่อนุมัติโดยตรงด้วย id, (2) list ทั้ง collection โดยไม่กรอง `status` **rules บล็อกจริงทั้งสองกรณี**

### ฝั่งชุมชน — เชื่อม Firebase จริง (เพิ่ม 2026-09-23) — แทนที่ mockup `localStorage` ของ [[../prototype-v3/README|prototype-v3]]

Implement ตาม BL-006, BL-022, BL-023 — หน้าใหม่ 4 หน้า + ส่วนขยายใน `admin-review-student-work.html`:

- **`community-register.html`** — สมัคร/เข้าสู่ระบบชุมชน (Firebase Auth จริง) เหมือน pattern ของ `student-publish.html` ทุกประการ ต่างที่: role=`community`, มีฟิลด์เพิ่ม "ข้อมูลยืนยันตัวตน" (`contactInfo` — ชื่อผู้ติดต่อ+เบอร์โทร ไม่ต้องแนบเอกสาร ตาม Business Rule 2026-09-22) บันทึกลง `users` collection เดียวกับนิสิต (ต่างแค่ `role`) — อนุมัติแล้วนำทางไป `community-dashboard.html` อัตโนมัติ
- **`community-dashboard.html`** — แสดงคอนเทนต์ของชุมชนตนเอง (query `CommunityContent` where `communityId==uid`) + คอนเทนต์ชุมชนอื่นแบบ read-only (where `status=='เผยแพร่แล้ว'`, กรอง `communityId!=uid` ฝั่ง client) ค้นหาแบบ live ทั้ง 2 ตาราง real-time ผ่าน `onSnapshot` ปุ่ม "ขอแก้ไข" ปรากฏเฉพาะคอนเทนต์เผยแพร่แล้วที่ไม่มีคำขอค้าง (เช็คจาก `ContentEditRequests` แบบ realtime)
- **`community-create-content.html`** — สร้าง/เผยแพร่คอนเทนต์จริงลง `CommunityContent` — **ปุ่ม AI ทั้งหมด (ปรับภาพ/แคปชัน/แนะนำเรื่อง/SEO/แปลภาษา) ปิดใช้งานชั่วคราวในรอบนี้** (แสดงข้อความ "จะเชื่อมต่อ AI backend จริงในรอบถัดไป") เพราะต้องรอ Cloud Functions proxy (Firebase แผน Blaze) ก่อนถึงจะเรียก AI จากฝั่งเซิร์ฟเวอร์ได้อย่างปลอดภัย
- **`community-request-edit.html`** — อ่านคอนเทนต์จาก `CommunityContent` ตรวจสิทธิ์จริง (ต้องเป็นเจ้าของ + สถานะเผยแพร่แล้ว + ไม่มีคำขอค้าง) ส่งคำขอเข้า `ContentEditRequests` — **ส่งแล้วแก้ไข/ยกเลิกไม่ได้จนกว่าอาจารย์จะพิจารณา** (ตัดสินใจ 2026-09-23, บังคับด้วย `firestore.rules` ที่ไม่มี `allow update` ให้ community เลย)
- **`admin-review-student-work.html`** — เพิ่มส่วน "บัญชีผู้ใช้ใหม่ที่รออนุมัติ" ให้ครอบคลุมทั้งนิสิต+ชุมชน (query เดิมตัด filter `role` ออก), เพิ่มส่วน "คำขอแก้ไขข้อมูลชุมชนที่รอพิจารณา" พร้อม diff เดิม/ใหม่ — อนุมัติแล้ว update ทั้ง `ContentEditRequests.status` และ field `title`/`bodyTh`/`caption`/`updatedAt` ของ `CommunityContent` เอกสารเดิมในคราวเดียว, เพิ่มตารางประวัติคำขอแก้ไขที่พิจารณาแล้ว

**Firestore collection ใหม่**: `CommunityContent`, `ContentEditRequests` (ดู field เต็มที่ [[../../02-technical/architecture|architecture.md]] § Mapping) — `users` ขยายให้รองรับ `role: 'community'` (field เพิ่ม `contactInfo`)

**`LSH/firestore.rules`**: เพิ่ม `isApprovedCommunity()`, เปิด `users.create` ให้ role `community` ได้ (เดิมอนุญาตแค่ `student`), เพิ่ม `match /CommunityContent/...` (create เฉพาะเจ้าของที่อนุมัติแล้ว, update เฉพาะ teacher จำกัด field) และ `match /ContentEditRequests/...` (create เฉพาะเจ้าของที่อนุมัติแล้ว, update เฉพาะ teacher จำกัด field — **ไม่มี rule ให้ community update/delete เอกสารตนเองเลย** ตามการตัดสินใจปิดคำถามเรื่องแก้ไข/ยกเลิกคำขอ 2026-09-23) — **ยังไม่ได้ deploy กฎนี้ขึ้น project จริง** ต้องรัน `firebase deploy --only firestore:rules` ก่อนฟีเจอร์นี้จะเขียนข้อมูลจริงสำเร็จ

**ทดสอบแล้วบางส่วน (2026-09-23, ผ่าน local http-server + Playwright)**: หน้า login/register แสดงผลถูกต้อง, validate ฟอร์มสมัครบัญชี (ช่องว่าง) ทำงานถูกต้อง, ทั้ง 3 หน้าที่ต้อง login (`community-dashboard.html`, `community-create-content.html`, `community-request-edit.html`) redirect กลับ `community-register.html` ถูกต้องเมื่อยังไม่ login, ไม่มี JS error บนทุกหน้า (รวม `admin-review-student-work.html` ที่แก้ไข) — **ยังไม่ได้ทดสอบ flow เขียนข้อมูลจริงแบบ end-to-end** (สมัคร→อนุมัติ→สร้าง/แก้ไขคอนเทนต์→อนุมัติคำขอแก้ไข) เพราะ `firestore.rules` ที่แก้ในรอบนี้ยังไม่ถูก deploy ขึ้น production (เครื่องมือทดสอบนี้ไม่มีสิทธิ์ deploy เอง) — **ต้อง deploy rules แล้วทดสอบ flow เต็มอีกครั้งก่อนถือว่าสมบูรณ์**

## Design tokens ที่ใช้

เหมือน prototype-v1 ทุกประการ (ไม่ได้เปลี่ยน design system) — ดู [[../DESIGN|DESIGN.md]]
