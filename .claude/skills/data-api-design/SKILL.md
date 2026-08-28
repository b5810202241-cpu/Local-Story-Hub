---
name: data-api-design
description: >
  สร้าง/ปรับปรุงส่วน Database Schema และ API Spec ของ Local Story Hub แบบ conceptual (ยังไม่
  ผูกมัดกับ technical stack) ประกอบด้วย ER Diagram, รายละเอียดแต่ละตาราง/entity, และรายการ API
  operation บันทึกที่ docs/02-design/02-technical/architecture.md (ไฟล์เดียวกับ High-Level
  Architecture — ไฟล์นี้เป็น "ภาพรวมระบบ" รวมทุกอย่างไว้ที่เดียวตามที่ผู้ใช้ขอ ทักษะนี้แก้เฉพาะ
  หัวข้อ "Database Schema" และ "API Spec" ในไฟล์นั้น ไม่แตะหัวข้ออื่นที่ skill
  `architecture-design` ดูแล) ใช้เมื่อผู้ใช้ขอออกแบบ database schema, ER diagram, หรือ API spec
  ไม่ใช้สำหรับ component/data flow ระดับสูง (ใช้ skill `architecture-design`) หรือ sequence
  flow ละเอียด (ใช้ skill `detailed-design`)
---

# Database Schema & API Spec (Conceptual)

ทักษะนี้แปล Requirement + Backlog + Feature List + User Journey ของ Local Story Hub ที่มีอยู่
ให้เป็นส่วน **Database Schema และ API Spec แบบ conceptual** — ระบุ entity/ตาราง, field,
ความสัมพันธ์, และ operation ที่ระบบต้องมี โดย **ห้ามผูกมัดกับ technical stack เฉพาะเจาะจง**
(ห้ามระบุยี่ห้อฐานข้อมูล, รูปแบบ API เฉพาะ framework, หรือ data type เฉพาะภาษาโปรแกรม — ใช้
ประเภทข้อมูลเชิงแนวคิดแทน) **ผลลัพธ์อยู่ในไฟล์เดียวกับ High-Level Architecture โดยเจตนา** —
`docs/02-design/02-technical/architecture.md` คือไฟล์ "ภาพรวมระบบ" ไฟล์เดียว ให้แก้เฉพาะหัวข้อ
"Database Schema" และ "API Spec" ในไฟล์นั้น ไม่แตะหัวข้ออื่นที่เป็นความรับผิดชอบของ skill
`architecture-design`

`docs/` เป็นส่วนหนึ่งของ Obsidian vault ที่ root ของ repo (`newLinkFormat: relative`,
`useMarkdownLinks: false`) — ทุกลิงก์ต้องเป็น wikilink แบบ relative path เท่านั้น

## เมื่อไรควรมอบงานต่อให้ agent `data-api-designer`

ถ้ามี entity/feature จำนวนมาก หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool ด้วย
`subagent_type: data-api-designer` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้วิธีการ
เดียวกัน

## หลักการทั่วไป: เมื่อไม่ชัดเจน ให้ถามพร้อมทางเลือก

จุดไหนที่ต้องตัดสินใจเชิงโครงสร้างข้อมูลแทนผู้ใช้ **ห้ามเดาและตัดสินใจเอง** — ให้ถามผู้ใช้พร้อม
เสนอ **อย่างน้อย 3 แนวทาง** ทุกแนวทางต้องมีข้อดี/ข้อเสียกำกับ

## ขั้นตอน

1. **รวบรวมต้นทาง** — อ่าน spec ทั้งหมดใน `docs/01-requirements/01-spec/`,
   `docs/01-requirements/03-task/product-backlog.md`,
   `docs/01-requirements/03-task/feature-list.md` (ถ้ามี), และ User Journey ทุกไฟล์ใน
   `docs/02-design/01-prototypes/*-journey.md` — ถ้ามี `docs/02-design/02-technical/architecture.md`
   อยู่แล้ว **ต้องอ่านทั้งไฟล์เสมอ** (ไม่ใช่แค่อ่านประกอบ) เพราะเป็นไฟล์เดียวกับที่จะแก้ไขใน
   ขั้นตอนที่ 7 ให้สอดคล้องกับ component ที่ระบุไว้ (ถ้ายังไม่มีไฟล์นี้เลยแจ้งผู้ใช้ว่าควรรัน
   `architecture-design` ก่อน แต่ยังทำต่อได้โดยตรงจาก requirement ถ้าผู้ใช้ยืนยัน — จะสร้างไฟล์
   ใหม่พร้อมหัวข้อ Database Schema/API Spec เท่านั้น)

2. **เช็ค Open Questions ที่กระทบโครงสร้างข้อมูล/API** — อ่าน
   `docs/01-requirements/03-task/open-questions.md` คัดเฉพาะข้อที่กระทบจริง แล้วถามผู้ใช้เฉพาะ
   จุดที่จำเป็นต้องรู้ก่อนออกแบบต่อได้จริง

3. **ระบุ Entity/ตารางจาก Feature List + Journey** — ห้ามสร้าง entity ที่ไม่มีที่มาจาก
   requirement/backlog/journey จริง

4. **สำหรับแต่ละ entity ระบุอย่างน้อย**: ชื่อ entity, คำอธิบาย, รายการ field (ชื่อ, ประเภทเชิง
   แนวคิด, บังคับ/ไม่บังคับ, คำอธิบาย), ความสัมพันธ์กับ entity อื่น, ข้อจำกัด/business rule ที่
   เกี่ยวข้อง (อ้างอิงกลับไปยัง spec ต้นทาง)

5. **วาด ER Diagram** ด้วย Mermaid (`erDiagram`) แสดงทุก entity และความสัมพันธ์

6. **ระบุ API operation** ต่อ entity/feature: operation, input, output, เงื่อนไขสิทธิ์การเข้าถึง
   (ถ้ามี), และ map กลับไปยัง journey step / FR / BL ที่ทำให้เกิด operation นี้

7. **แก้ไข `docs/02-design/02-technical/architecture.md`** — อ่านไฟล์เต็มก่อนเสมอ (มีหัวข้อ
   อื่นที่ skill `architecture-design` ดูแลอยู่ ห้ามลบ/แก้หัวข้อเหล่านั้น) แล้วแก้ไข/สร้างเฉพาะ
   หัวข้อ "## Database Schema" (entity + field + ER diagram) และ "## API Spec" (operation
   list) — ถ้ายังไม่มีสองหัวข้อนี้ให้เพิ่มต่อท้าย ถ้ามีอยู่แล้วให้ปรับปรุงเฉพาะส่วนที่เปลี่ยน

8. เพิ่ม wikilink ใน `docs/02-design/02-technical/index.md` (ถ้ายังไม่มี entry ของ
   `architecture.md`) และเพิ่ม wikilink ย้อนกลับจาก journey/spec ที่ใช้ (append เท่านั้น)

9. **บันทึกลง `docs/05-log/index.md`** ว่าสร้าง/อัปเดตอะไร คำถามที่ถามผู้ใช้และคำตอบ (รันคำสั่ง
   หาวันที่จริงเสมอ)

## ข้อควรระวัง

- ห้ามระบุยี่ห้อฐานข้อมูล/รูปแบบ API เฉพาะ framework เว้นแต่ผู้ใช้ระบุเอง
- ห้ามสร้าง entity, field, หรือ API operation ที่ไม่มีที่มาจาก requirement/backlog/journey จริง
- ห้ามลบเนื้อหาที่มนุษย์เขียนเพิ่มไว้ในไฟล์เดิมโดยไม่ถูกขอ
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน (ชื่อ field/entity อาจเป็น
  ภาษาอังกฤษ slug แต่คำอธิบายเป็นภาษาไทย)

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- รายชื่อ entity/ตาราง และ API operation ที่สร้าง/อัปเดต
- คำถามที่ถามผู้ใช้ (ถ้ามี) และการตัดสินใจที่ได้
- ประเด็นที่ยังค้างเพราะ Open Question ยังไม่ปิด
