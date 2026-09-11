# Prototype v2

- **สถานะ**: DRAFT — ต่อยอดจาก [[../prototype-v1/README|prototype-v1]] เฉพาะ 2 หน้าจอฝั่งนิสิต/อาจารย์ ยังไม่ครอบคลุมทั้งระบบ
- **อ้างอิงจาก**: [[../DESIGN|DESIGN.md]] (design system เดิม, ไม่เปลี่ยน), [[../../../01-requirements/03-task/product-backlog|product-backlog]] (BL-018)
- **ขอบเขต**: เฉพาะ persona นิสิตนิเทศศาสตร์ + อาจารย์ (เหมือน v1 ทุกอย่าง ต่างแค่แหล่งข้อมูล)

เปิดจากเบราว์เซอร์ตรงๆ ไม่ได้เต็มรูปแบบ เพราะใช้ Firebase JS SDK แบบ ES module ซึ่งต้อง serve ผ่าน HTTP server (ติด CORS ถ้าเปิดแบบ `file://`) — รันเซิร์ฟเวอร์ static ธรรมดาชี้มาที่โฟลเดอร์นี้ก่อนเปิด

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

## Design tokens ที่ใช้

เหมือน prototype-v1 ทุกประการ (ไม่ได้เปลี่ยน design system) — ดู [[../DESIGN|DESIGN.md]]
