---
name: data-api-design
description: >
  สร้าง/ปรับปรุงเอกสาร Database Schema และ API Spec ของ Local Story Hub แบบ conceptual (ยังไม่
  ผูกมัดกับ technical stack) รวมไว้ใน**ไฟล์เดียว** ประกอบด้วย ER Diagram, รายละเอียดแต่ละ
  ตาราง/entity, และรายการ API operation บันทึกที่
  docs/02-design/02-technical/data-api-spec.md (แยกจาก High-Level Architecture ซึ่งเป็นอีก
  ไฟล์ต่างหาก — ดู skill `architecture-design`) ใช้เมื่อผู้ใช้ขอออกแบบ database schema, ER
  diagram, หรือ API spec ไม่ใช้สำหรับ high-level architecture (ใช้ skill `architecture-design`)
  หรือ sequence flow ละเอียด (ใช้ skill `detailed-design`)
---

# Database Schema & API Spec (Conceptual)

ทักษะนี้แปล Requirement + Backlog + Feature List + User Journey ของ Local Story Hub ที่มีอยู่
ให้เป็นเอกสาร **Database Schema และ API Spec แบบ conceptual รวมไว้ในไฟล์เดียว** — ระบุ
entity/ตาราง, field, ความสัมพันธ์, และ operation ที่ระบบต้องมี โดย **ห้ามผูกมัดกับ technical
stack เฉพาะเจาะจง** (ห้ามระบุยี่ห้อฐานข้อมูล, รูปแบบ API เฉพาะ framework, หรือ data type เฉพาะ
ภาษาโปรแกรม — ใช้ประเภทข้อมูลเชิงแนวคิดแทน) เอกสารนี้เป็นคนละไฟล์กับ High-Level Architecture
โดยเจตนา — ดู `architecture-design` สำหรับไฟล์นั้น

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
   `docs/02-design/01-prototypes/*-journey.md` — ถ้ามี
   `docs/02-design/02-technical/architecture.md` ให้อ่านประกอบด้วยเพื่อให้สอดคล้องกับ
   component ที่ระบุไว้ (ถ้ายังไม่มีแจ้งผู้ใช้ว่าควรรัน `architecture-design` ก่อน แต่ยังทำต่อ
   ได้โดยตรงจาก requirement ถ้าผู้ใช้ยืนยัน)

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

7. **เขียน/อัปเดตไฟล์เดียว**: `docs/02-design/02-technical/data-api-spec.md` แบ่งเป็น 2 หัวข้อ
   หลักในไฟล์เดียวกัน — "## Database Schema" (entity + field + ER diagram) และ "## API Spec"
   (operation list) — อ่านไฟล์เดิมก่อนแล้วปรับปรุงเฉพาะส่วนที่เปลี่ยน

8. เพิ่ม wikilink ใน `docs/02-design/02-technical/index.md` และเพิ่ม wikilink ย้อนกลับจาก
   journey/spec/architecture ที่ใช้ (append เท่านั้น)

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
