---
name: feature-list
description: >
  จัดกลุ่ม Product Backlog ของ Local Story Hub เป็น Feature List ระดับสูง (ตาม Epic)
  พร้อมจัดลำดับความสำคัญด้วย MoSCoW แล้ว regenerate docs/01-requirements/03-task/feature-list.md
  ใช้เมื่อผู้ใช้ขอสรุป feature list จาก backlog, ขออัปเดต feature list, หรือถามว่า backlog
  ตอนนี้มีฟีเจอร์อะไรบ้าง ไม่ใช้สำหรับสร้าง User Journey หรือ technical design — ใช้ skill
  `user-journey` แทน
---

# Feature List จาก Product Backlog

ทักษะนี้สรุป Product Backlog ของ Local Story Hub ให้เป็น **Feature List** ระดับสูงที่อ่านง่าย
กว่ารายการ backlog item ดิบ ๆ มีหน้าที่จัดกลุ่มและจัดลำดับความสำคัญเท่านั้น **ไม่มีหน้าที่
ออกแบบ user flow หรือแตะ `02-design`**

repo นี้ทั้งหมดเป็น Obsidian vault เดียว (root คือโฟลเดอร์บนสุดของ repo ไม่ใช่ `docs/` — ดู `.obsidian/app.json` ที่ root: `newLinkFormat: relative`, `useMarkdownLinks: false`) — ทุก
ลิงก์ต้องเป็น wikilink แบบ relative path เท่านั้น

## เมื่อไรควรมอบงานต่อให้ agent `feature-list-builder`

ถ้า backlog มีขนาดใหญ่มาก หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool ด้วย
`subagent_type: feature-list-builder` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้
วิธีการเดียวกัน

## ขั้นตอน

1. **อ่าน** `docs/01-requirements/03-task/product-backlog.md` ทั้งไฟล์ — ถ้ายังไม่มีไฟล์นี้
   ให้แจ้งผู้ใช้ว่าต้องรัน `backlog-analyst`/`requirement-to-backlog` ก่อน ไม่ต้องเดาข้อมูล

2. **จัดกลุ่มเป็น Feature** — ค่าเริ่มต้นคือ 1 Epic = 1 Feature (ตามหัวข้อ `## Epic: ...` ที่มี
   อยู่แล้วในไฟล์ backlog) — ถ้าพบว่า Epic ใดใหญ่เกินไปจนควรแตกเป็นหลาย Feature หรือมี Epic
   ที่ควรรวมกัน ให้ถามผู้ใช้ก่อนตัดสินใจเอง

3. **จัดลำดับความสำคัญของแต่ละ Feature ด้วย MoSCoW** จาก Priority ของ backlog item ข้างใน:
   - item ส่วนใหญ่/item หลักเป็น Must → Feature เป็น **Must**
   - ไม่มี Must เลย → ใช้ค่าสูงสุดที่พบ (Should > Could > Won't)
   - ถ้าปนกันมากจนตัดสินใจยาก ให้ระบุเหตุผลไว้ในคำอธิบายของ Feature นั้น (ห้ามเลือกโดยไม่
     อธิบาย)

4. **เขียนไฟล์** `docs/01-requirements/03-task/feature-list.md` ใหม่ทั้งไฟล์ทุกครั้ง (เป็น
   **snapshot ที่คำนวณจาก backlog ปัจจุบันเสมอ** ไม่ใช่เอกสารที่แก้มือแล้วคงอยู่ข้ามรอบ — ถ้า
   ผู้ใช้เคยแก้ไขเนื้อหาด้วยมือ ให้เตือนก่อนเขียนทับ) ตาม template:

   ```
   # Feature List

   _สรุปจาก [[product-backlog|product-backlog]] — regenerate ทุกครั้งที่รัน ไม่ใช่เอกสารที่
   แก้ไขแล้วคงอยู่ถาวร_

   ## สรุป

   | Feature | MoSCoW | Backlog อ้างอิง |
   |---|---|---|
   | {ชื่อ Feature} | {Must/Should/Could/Won't} | {BL-XXX, BL-YYY} |

   ## รายละเอียด

   ### {ชื่อ Feature} — {MoSCoW}
   {คำอธิบาย: ทำไมถึงจัดกลุ่มนี้ ทำไมถึงได้ priority นี้ อ้างอิง BL-XXX}
   ```

5. เพิ่ม wikilink ไปยัง `feature-list.md` ใน `docs/01-requirements/03-task/index.md` ถ้ายัง
   ไม่มี

## ข้อควรระวัง

- ห้ามเปลี่ยน Priority หรือเนื้อหาของ backlog item เดิมใน `product-backlog.md` — อ่านอย่าง
  เดียว
- ห้ามเดา business value ที่ไม่มีอยู่ในเอกสารต้นทาง ถ้าจัดกลุ่ม/จัด priority ไม่ชัดเจนให้ถาม
  ผู้ใช้
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- จำนวน Feature ที่สรุปได้ และการกระจายตัวของ MoSCoW
- Feature ใดที่จัด priority ยากเพราะ backlog item ข้างในปนกันมาก พร้อมเหตุผลที่เลือก
