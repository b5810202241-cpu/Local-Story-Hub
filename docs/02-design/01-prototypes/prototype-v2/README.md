# Prototype v2

- **สถานะ**: DRAFT — ต่อยอดจาก [[../prototype-v1/README|prototype-v1]] เฉพาะ 2 หน้าจอฝั่งนิสิต/อาจารย์ ยังไม่ครอบคลุมทั้งระบบ
- **อ้างอิงจาก**: [[../DESIGN|DESIGN.md]] (design system เดิม, ไม่เปลี่ยน), [[../../../01-requirements/03-task/product-backlog|product-backlog]] (BL-018)
- **ขอบเขต**: เฉพาะ persona นิสิตนิเทศศาสตร์ + อาจารย์ (เหมือน v1 ทุกอย่าง ต่างแค่แหล่งข้อมูล)

เปิดจากเบราว์เซอร์ตรงๆ ไม่ได้เต็มรูปแบบ เพราะใช้ Firebase JS SDK แบบ ES module ซึ่งต้อง serve ผ่าน HTTP server (ติด CORS ถ้าเปิดแบบ `file://`) — รันเซิร์ฟเวอร์ static ธรรมดาชี้มาที่โฟลเดอร์นี้ก่อนเปิด

## ต่างจาก prototype-v1 ตรงไหน

v1 ใช้ `localStorage` จำลองข้อมูลอย่างเดียว ส่วน v2 เชื่อมกับ **Firestore project `lsh-nammon` จริง** (collection `LSHRequests`, `users`) ผ่าน Firebase JS SDK (CDN, modular):

- **`student-publish.html`**: เพิ่ม dropdown "เลือกผู้ส่ง" ดึงรายชื่อจาก `users` ที่ `role == student` แบบสด (แทนที่จะไม่มีตัวตนผู้ส่งเลยแบบ v1) กดส่งแล้วเขียนเอกสารใหม่ลง `LSHRequests` จริงด้วย `status: 'รอพิจารณา'` แล้ว **นำทางไปหน้า `admin-review-student-work.html` ทันที** (v1 ค้างที่ success panel ให้กดเผยแพร่ผลงานอีกชิ้นต่อ)
- **`admin-review-student-work.html`**: อ่านข้อมูลจาก `LSHRequests` แบบ real-time (`onSnapshot`) กดอนุมัติ/ไม่อนุมัติแล้ว update สถานะใน Firestore จริงทันที (v1 เขียนกลับ `localStorage`) ผู้อนุมัติ hardcode เป็นบัญชีตัวอย่าง `u004` เพราะยังไม่มีระบบ login จริง

### Field ใหม่ที่เพิ่มเข้า `LSHRequests` (ไม่มีในเอกสารที่ seed ไว้เดิม)

- **`community`** — จากฟอร์มเดิมที่มีอยู่แล้วใน `student-publish.html` (ค่าจาก dropdown เลือกชุมชน) มีที่มาจาก FR-3.1/Open Question เรื่องเชื่อมโยงชุมชน แต่ schema เดิมของ `LSHRequests` ยังไม่มี field นี้ — เอกสารเก่า (req001-005) จึงไม่มี field นี้ (แสดงเป็นช่องว่างในตาราง)
- **`rejectionReason`** — เหตุผลตอนกดไม่อนุมัติ (มีอยู่แล้วใน UI ของ v1 แต่เดิมเก็บใน `localStorage` เท่านั้น)

ดูรายละเอียดเพิ่มเติมที่หัวข้อ "Mapping กับข้อมูลจริงใน Firestore" ใน [[../../02-technical/architecture|architecture.md]]

### ทดสอบแล้ว (2026-09-11)

ส่งฟอร์มทดสอบจริง 1 รายการ → ปรากฏในหน้า admin แบบ real-time → กดอนุมัติสำเร็จ → ทดสอบกดไม่อนุมัติกับอีกรายการ (คืนสถานะกลับหลังทดสอบเสร็จ) — ยืนยันว่า flow ทำงานได้ครบทั้งเขียน/อ่าน/อัปเดตจริงกับ Firestore project `lsh-nammon`

## Design tokens ที่ใช้

เหมือน prototype-v1 ทุกประการ (ไม่ได้เปลี่ยน design system) — ดู [[../DESIGN|DESIGN.md]]
