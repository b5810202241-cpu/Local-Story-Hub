---
name: detailed-design
description: >
  สร้าง/ปรับปรุงเอกสาร Detailed Design ของ Local Story Hub แบบ conceptual (ยังไม่ผูกมัดกับ
  technical stack) ประกอบด้วย Sequence Flow ของแต่ละการทำงานสำคัญ บันทึกที่
  docs/02-design/02-technical/detailed-design.md ใช้เมื่อผู้ใช้ขอทำ detailed design หรือ
  sequence diagram ไม่ใช้สำหรับ high-level architecture (ใช้ skill `architecture-design`)
  หรือ database schema/API spec (ใช้ skill `data-api-design`)
---

# Detailed Design (Conceptual)

ทักษะนี้แปล User Journey + Architecture + API Spec ของ Local Story Hub ที่มีอยู่ให้เป็นเอกสาร
**Detailed Design แบบ conceptual** — เจาะรายละเอียดการทำงานภายในระบบระดับ component-to-
component โดยเน้น **Sequence Flow** เป็นหลัก **ห้ามผูกมัดกับ technical stack เฉพาะเจาะจง**

`docs/` เป็นส่วนหนึ่งของ Obsidian vault ที่ root ของ repo (`newLinkFormat: relative`,
`useMarkdownLinks: false`) — ทุกลิงก์ต้องเป็น wikilink แบบ relative path เท่านั้น

## เมื่อไรควรมอบงานต่อให้ agent `detailed-designer`

ถ้ามีการทำงานสำคัญจำนวนมาก หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool ด้วย
`subagent_type: detailed-designer` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้วิธีการ
เดียวกัน

## หลักการทั่วไป: เมื่อไม่ชัดเจน ให้ถามพร้อมทางเลือก

จุดไหนที่ต้องตัดสินใจเชิงพฤติกรรมระบบแทนผู้ใช้ **ห้ามเดาและตัดสินใจเอง** — ให้ถามผู้ใช้พร้อม
เสนอ **อย่างน้อย 3 แนวทาง** ทุกแนวทางต้องมีข้อดี/ข้อเสียกำกับ

## ขั้นตอน

1. **รวบรวมต้นทาง** — อ่าน `docs/02-design/02-technical/architecture.md` และ
   `docs/02-design/02-technical/api-spec.md` (ถ้ายังไม่มี แจ้งผู้ใช้ว่าควรรัน
   `architecture-design`/`data-api-design` ก่อน แต่ทำต่อโดยตรงจาก User Journey ได้ถ้าผู้ใช้
   ยืนยัน — ระบุไว้ในรายงานว่าข้ามการอ้างอิงนี้) และอ่าน User Journey ที่เกี่ยวข้องใน
   `docs/02-design/01-prototypes/*-journey.md`

2. **เช็ค Open Questions ที่กระทบพฤติกรรมระบบ** — อ่าน
   `docs/01-requirements/03-task/open-questions.md` คัดเฉพาะข้อที่กระทบ sequence flow จริง
   แล้วถามผู้ใช้เฉพาะจุดที่จำเป็น

3. **เลือกการทำงานสำคัญที่ต้องทำ Sequence Flow** — อิงจาก journey step ที่มีการโต้ตอบข้าม
   component มากกว่า 1 ตัว ไม่ต้องทำทุก step ที่เป็นแค่การแสดงผลหน้าจอเฉย ๆ

4. **วาด Sequence Diagram ด้วย Mermaid (`sequenceDiagram`)** ต่อการทำงาน แสดง participant
   ตามที่ระบุใน architecture.md และลำดับการเรียก/ตอบกลับ พร้อม label บนลูกศรบอกว่าส่งอะไร
   และรวม error/edge case สำคัญถ้ามีในสเปค

5. **map แต่ละ sequence กลับไปยัง**: journey step ต้นทาง, API operation ที่เกี่ยวข้อง (ถ้ามี),
   และ FR/BL ต้นทาง

6. **เขียน/อัปเดต** `docs/02-design/02-technical/detailed-design.md` — อ่านไฟล์เดิมก่อนแล้ว
   ปรับปรุงเฉพาะส่วนที่เปลี่ยน

7. เพิ่ม wikilink ใน `docs/02-design/02-technical/index.md` และเพิ่ม wikilink ย้อนกลับจาก
   architecture.md/api-spec.md/journey ที่ใช้ (append เท่านั้น)

8. **บันทึกลง `docs/05-log/index.md`** ว่าสร้าง/อัปเดตอะไร คำถามที่ถามผู้ใช้และคำตอบ (รันคำสั่ง
   หาวันที่จริงเสมอ)

## ข้อควรระวัง

- ห้ามระบุ technical stack เฉพาะเจาะจงเว้นแต่ผู้ใช้ระบุเอง
- ห้ามเดาพฤติกรรมระบบที่ไม่มีที่มาจาก requirement/journey/architecture จริง
- ห้ามลบเนื้อหาที่มนุษย์เขียนเพิ่มไว้ในไฟล์เดิมโดยไม่ถูกขอ
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- รายชื่อ sequence flow ที่สร้าง/อัปเดต และ component/API ที่เกี่ยวข้อง
- คำถามที่ถามผู้ใช้ (ถ้ามี) และการตัดสินใจที่ได้
- ถ้าทำโดยไม่มี architecture.md/api-spec.md รองรับ ให้ระบุไว้ชัดเจน
- ประเด็นที่ยังค้างเพราะ Open Question ยังไม่ปิด
