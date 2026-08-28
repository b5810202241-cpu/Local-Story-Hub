---
name: requirement-intake
description: >
  รับ requirement ดิบจากผู้ใช้ (ข้อความ, ไฟล์แนบ, บทสนทนา) แล้วบันทึกเป็นเอกสาร spec อย่าง
  เป็นทางการที่ docs/01-requirements/01-spec/{YYYYMMDD}-{RUNNING_NO}-{topic}.md จากนั้นแตก
  เป็น Product Backlog ทันที ใช้ทักษะนี้เมื่อผู้ใช้ให้ requirement ดิบมาเพื่อบันทึกเป็นเอกสารและ/
  หรือสรุปเป็น backlog ถ้า spec มีอยู่แล้วและผู้ใช้ต้องการแค่วิเคราะห์เป็น backlog โดยไม่มี
  requirement ดิบใหม่ ให้ใช้ skill `requirement-to-backlog` แทน
---

# Requirement Intake → Spec → Product Backlog

ทักษะนี้ครอบคลุม 2 phase ต่อเนื่องกันสำหรับโปรเจกต์ Local Story Hub: (1) รับ requirement
ดิบจากผู้ใช้แล้วบันทึกเป็นเอกสาร spec ที่มีโครงสร้างใน `docs/01-requirements/01-spec/` และ
(2) แตก spec นั้นเป็น **Product Backlog** ทันที (ไม่ต้องถามว่าจะทำต่อหรือไม่ ยกเว้นผู้ใช้ขอให้
ทำแค่บันทึก spec)

repo นี้ทั้งหมดเป็น Obsidian vault เดียว (root คือโฟลเดอร์บนสุดของ repo ไม่ใช่ `docs/` — ดู `.obsidian/app.json` ที่ root: `newLinkFormat: relative`,
`useMarkdownLinks: false`) — ทุกลิงก์ที่คุณเพิ่มต้องเป็น wikilink แบบ relative path
(`[[../path/file|label]]`) ห้ามใช้ markdown link

## เมื่อไรควรมอบงานต่อให้ agent `requirement-intake-analyst`

ถ้ามี requirement ดิบยาว/ซับซ้อน หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool
ด้วย `subagent_type: requirement-intake-analyst` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ
agent ใช้วิธีการเดียวกัน

## Phase 1 — รับ Requirement ดิบ → เอกสาร Spec

1. อ่าน requirement ดิบที่ผู้ใช้ให้มา ถ้าเนื้อหาคลุมเครือจนสรุปหัวข้อ/ขอบเขตไม่ได้ ให้ถามก่อน
   แทนการเดาเอง — ถ้าให้มาเป็นไฟล์แนบ ให้อ่านจากไฟล์นั้นเท่านั้น ห้ามเติมเนื้อหาที่ไม่มีในไฟล์

2. สรุปเป็นเอกสาร markdown ตาม template นี้ (รูปแบบเดียวกับ
   `docs/01-requirements/01-spec/local-story-hub.md` ที่มีอยู่แล้ว):

   ```
   # {ชื่อเรื่องสั้นๆ}

   - **วันที่บันทึก:** {YYYY-MM-DD}
   - **สถานะ:** Draft

   ## Context
   {สรุปว่าทำไมถึงมี requirement นี้}

   ## ต้นฉบับ (Verbatim จากผู้ใช้)
   > {เก็บข้อความ/เนื้อหาต้นฉบับไว้อ้างอิง ย่อได้ถ้ายาวมากแต่ต้องไม่เสียใจความ}

   ## ขอบเขต (Scope)
   - In scope: ...
   - Out of scope: ...

   ## Functional Requirements
   1. ...

   ## Business Rules
   - ...

   ## Open Questions
   - ...
   ```

3. **ก่อนตั้งชื่อไฟล์ ให้ list ไฟล์ทั้งหมดใน `docs/01-requirements/01-spec/` ก่อนเสมอ** (ห้ามเดา
   ว่ามีไฟล์อะไรบ้าง) แล้วเช็คว่ามีไฟล์ที่คุยเรื่อง/หัวข้อใกล้เคียงกันอยู่แล้วหรือไม่ — ถ้ามี ให้ถาม
   ผู้ใช้ว่าต้องการอัปเดตไฟล์เดิมหรือสร้างไฟล์ใหม่แยกจริงๆ แทนการสร้างไฟล์ใหม่ทับซ้อนโดยไม่ถาม

4. ตั้งชื่อไฟล์ตามรูปแบบ `{YYYYMMDD}-{RUNNING_NO}-{SUMMARIZE_TOPIC}.md` (ธรรมเนียมที่ระบุไว้
   ใน `CLAUDE.md`):
   - `YYYYMMDD` = วันที่ปัจจุบัน — **ต้องรันคำสั่งหาวันที่จริง** (เช่น `date +%Y%m%d` ผ่าน Bash)
     เสมอ ห้ามอนุมานจาก training data หรือความจำ
   - `RUNNING_NO` = เลข 2 หลัก (`01`, `02`, ...) นับต่อจากไฟล์ที่มี prefix วันที่เดียวกันในรายการ
     ไฟล์ที่ list มาแล้วในข้อ 3 ถ้าวันนั้นมีไฟล์ครบ 99 แล้วให้ขยายเป็น 3 หลัก (`100`, ...)
   - `SUMMARIZE_TOPIC` = slug ภาษาอังกฤษตัวพิมพ์เล็ก คั่นด้วย `-` สรุปหัวข้อหลัก ไม่เกิน ~5 คำ
   - ตัวอย่าง: `20260822-01-community-photo-editing.md`

5. บันทึกไฟล์ที่ `docs/01-requirements/01-spec/{filename}` และเพิ่ม wikilink ไปยังไฟล์นี้ใน
   `docs/01-requirements/01-spec/index.md`

6. **ถ้า requirement มี Open Question ที่กระทบ scope ใหญ่** ให้ระบุในรายงานสุดท้ายว่าควรถามใคร
   ระหว่างผู้มีส่วนได้ส่วนเสียของโปรเจกต์ (ดู `CLAUDE.md`): อาจารย์ที่ปรึกษา หรือตัวแทนชุมชน —
   ห้ามเดาคำตอบเอง

## Phase 2 — Spec → Product Backlog

ใช้ spec ที่สร้างใหม่จาก Phase 1 เป็นอินพุตหลัก แล้วทำตาม **workflow เดียวกันทุกขั้นตอน** กับ
[requirement-to-backlog skill](../requirement-to-backlog/SKILL.md) / agent
`backlog-analyst` — ไม่ต้องเขียนขั้นตอนซ้ำที่นี่ เพื่อไม่ให้เกิด drift (ถ้าจะแก้วิธีแตก backlog
ให้ไปแก้ไฟล์นั้น ไม่ใช่ไฟล์นี้)

## ข้อควรระวัง (ทั้งสอง Phase)

- ห้ามสมมติ requirement ที่ไม่มีอยู่ในเอกสาร/ไฟล์แนบ/คำขอของผู้ใช้ — ถ้าไม่ชัดเจนให้ถามก่อน
- ห้ามลบหรือแก้ไขไฟล์ spec หรือ backlog เดิมที่มีอยู่แล้วโดยไม่ถูกขอ — ไฟล์ spec ใหม่จาก
  Phase 1 คือไฟล์เพิ่มเติม
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน (ยกเว้นชื่อไฟล์ที่ต้องเป็น
  slug ภาษาอังกฤษ)

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- ไฟล์ spec ที่สร้าง/อัปเดต (ชื่อไฟล์และ path)
- จำนวน backlog item และ epic ที่สร้าง/อัปเดต
- Open Questions ที่พบ พร้อมระบุว่าควรถามฝ่ายใด (อาจารย์ที่ปรึกษา/ตัวแทนชุมชน)
