---
name: architecture-design
description: >
  สร้าง/ปรับปรุงส่วน High-Level Architecture (component หลักของระบบและ data flow ตาม User
  Journey แต่ละเส้นทาง) ของ Local Story Hub แบบ conceptual (ยังไม่ผูกมัดกับ technical stack)
  บันทึกที่ docs/02-design/02-technical/architecture.md — ไฟล์นี้เป็น "ภาพรวมระบบ" ไฟล์เดียวที่
  รวม Database Schema และ API Spec ไว้ด้วย (ดู skill `data-api-design` สำหรับสองหัวข้อนั้น)
  ทักษะนี้ดูแลเฉพาะส่วน Component/Data Flow/ประเด็นข้ามระบบเท่านั้น ใช้เมื่อผู้ใช้ขอสร้าง/
  ปรับปรุง architecture, high level design, หรือ data flow diagram ไม่ใช้สำหรับ sequence flow
  ละเอียด (ใช้ skill `detailed-design`)
---

# Architecture Design (Conceptual)

ทักษะนี้แปล Requirement + Backlog + Feature List + User Journey ของ Local Story Hub ที่มีอยู่
ให้เป็นเอกสาร **High-Level Architecture แบบ conceptual** — อธิบายว่าระบบมี component อะไรบ้าง
และข้อมูลไหลอย่างไร โดย **ห้ามผูกมัดกับ technical stack เฉพาะเจาะจง** (ห้ามระบุชื่อ framework,
ภาษาโปรแกรม, ยี่ห้อฐานข้อมูล, cloud provider ฯลฯ เว้นแต่ผู้ใช้ระบุเองว่าตัดสินใจแล้ว)

`docs/` เป็นส่วนหนึ่งของ Obsidian vault ที่ root ของ repo (`newLinkFormat: relative`,
`useMarkdownLinks: false`) — ทุกลิงก์ต้องเป็น wikilink แบบ relative path เท่านั้น

## เมื่อไรควรมอบงานต่อให้ agent `architecture-designer`

ถ้ามี spec/journey จำนวนมาก หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool ด้วย
`subagent_type: architecture-designer` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้
วิธีการเดียวกัน

## หลักการทั่วไป: เมื่อไม่ชัดเจน ให้ถามพร้อมทางเลือก

จุดไหนที่ต้องตัดสินใจเชิงสถาปัตยกรรมแทนผู้ใช้ **ห้ามเดาและตัดสินใจเอง** — ให้ถามผู้ใช้พร้อม
เสนอ **อย่างน้อย 3 แนวทาง** ทุกแนวทางต้องมีข้อดี/ข้อเสียกำกับ

## ขั้นตอน

1. **รวบรวมต้นทาง** — อ่าน spec ทั้งหมดใน `docs/01-requirements/01-spec/`,
   `docs/01-requirements/03-task/product-backlog.md`,
   `docs/01-requirements/03-task/feature-list.md` (ถ้ามี), และ User Journey ทุกไฟล์ใน
   `docs/02-design/01-prototypes/*-journey.md`

2. **เช็ค Open Questions ที่กระทบสถาปัตยกรรม** — อ่าน
   `docs/01-requirements/03-task/open-questions.md` คัดเฉพาะข้อที่กระทบการตัดสินใจเชิง
   สถาปัตยกรรมจริง แล้วถามผู้ใช้เฉพาะจุดที่จำเป็นต้องรู้คำตอบก่อนออกแบบต่อได้อย่างมีความหมาย —
   จุดที่ยังออกแบบแบบ conceptual ได้โดยไม่ต้องรู้คำตอบ ไม่ต้องหยุดถาม

3. **ระบุ Component หลักของระบบ** ในระดับแนวคิด (Client, ชั้น API/Application, บริการ AI,
   ฐานข้อมูล, บริการ Consent/Log, บริการภายนอก) พร้อมหน้าที่สั้น ๆ ของแต่ละ component

4. **วาด Data Flow ตาม User Journey แต่ละเส้นทาง** ด้วย Mermaid อย่างน้อย 1 diagram ต่อ journey
   ที่มีอยู่ พร้อม map กลับไปยัง journey/FR ต้นทาง

5. **บันทึกประเด็นข้ามระบบ**: จุดที่ต้องเก็บ log 90 วัน/ขอ Consent (อ้างอิงสเปค IT log/PDPA),
   ข้อกำหนดผู้สูงอายุ (FR-1.7), ขอบเขตระบบจัดการข้อมูลชุมชนที่ยังเป็น Open Question

6. **แก้ไข `docs/02-design/02-technical/architecture.md`** — อ่านไฟล์เต็มก่อนเสมอ (ไฟล์นี้อาจมี
   หัวข้อ "Database Schema"/"API Spec" ที่ skill `data-api-design` ดูแลอยู่ ห้ามลบ/แก้หัวข้อ
   เหล่านั้น) แล้วแก้ไข/สร้างเฉพาะหัวข้อ Context, Component หลัก, Data Flow, ประเด็นข้ามระบบ,
   Decision Log, Open Items — ปรับปรุงเฉพาะส่วนที่เปลี่ยน ไม่เขียนทับทั้งไฟล์โดยไม่จำเป็น

7. เพิ่ม wikilink ใน `docs/02-design/02-technical/index.md` และเพิ่ม wikilink ย้อนกลับจาก
   journey/spec ที่ใช้ (append เท่านั้น)

8. **บันทึกลง `docs/05-log/index.md`** ว่าสร้าง/อัปเดตอะไร คำถามที่ถามผู้ใช้และคำตอบ (รันคำสั่ง
   หาวันที่จริงเสมอ)

## ข้อควรระวัง

- ห้ามระบุ technical stack เฉพาะเจาะจงเว้นแต่ผู้ใช้ระบุเอง
- ห้ามเดา requirement ที่ไม่มีอยู่จริง ถ้าไม่มีข้อมูลรองรับให้ถามผู้ใช้แทนการเดา
- ห้ามลบเนื้อหาที่มนุษย์เขียนเพิ่มไว้ในไฟล์เดิมโดยไม่ถูกขอ
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- component หลักและ data flow ที่สร้าง/อัปเดต
- คำถามที่ถามผู้ใช้ (ถ้ามี) และการตัดสินใจที่ได้
- ประเด็นสถาปัตยกรรมที่ยังค้างเพราะ Open Question ยังไม่ปิด
