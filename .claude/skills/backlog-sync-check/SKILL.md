---
name: backlog-sync-check
description: >
  ตรวจสอบว่า docs/01-requirements/03-task/product-backlog.md up to date กับเอกสาร
  spec ใน docs/01-requirements/01-spec/ ครบทุกไฟล์หรือไม่ ถ้าไม่ ให้เพิ่ม backlog item
  ที่ขาดไป ใช้เมื่อผู้ใช้ขอเช็คว่า backlog ตรงกับ requirement ล่าสุดไหม, spec ที่เพิ่งแก้ไข
  มี backlog รองรับหรือยัง, หรือขอให้ sync backlog
---

# ตรวจสอบความ Sync ระหว่าง Requirement และ Product Backlog

ทักษะนี้หา **drift** ระหว่าง spec กับ backlog ของโปรเจกต์ Local Story Hub (spec ที่
backlog ยังตามไม่ทัน) แล้วแก้ไข backlog ให้ทันโดยไม่แตะ item เดิมที่มีอยู่แล้ว

repo นี้ทั้งหมดเป็น Obsidian vault เดียว (root คือโฟลเดอร์บนสุดของ repo ไม่ใช่ `docs/` — ดู `.obsidian/app.json` ที่ root: `newLinkFormat: relative`,
`useMarkdownLinks: false`) — ทุกลิงก์ที่คุณเพิ่มต้องเป็น wikilink แบบ relative path
(`[[../path/file|label]]`) ห้ามใช้ markdown link

## เมื่อไรควรมอบงานต่อให้ agent `backlog-sync-checker`

ถ้ามีเอกสาร spec จำนวนมาก หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool ด้วย
`subagent_type: backlog-sync-checker` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้
วิธีการเดียวกัน

## ขั้นตอน

1. **List ไฟล์ spec ทั้งหมด** ใน `docs/01-requirements/01-spec/` (ไม่รวม `index.md`)

2. **อ่าน** `docs/01-requirements/03-task/product-backlog.md` — ถ้ายังไม่มีไฟล์นี้ ถือว่าทุก
   spec ยังไม่มี backlog รองรับเลย ให้รัน workflow เต็มใน
   [requirement-to-backlog skill](../requirement-to-backlog/SKILL.md) กับทุก spec ที่มี

3. **ตรวจ coverage ต่อไฟล์ spec** โดยหาบรรทัด `**Source**:` ของแต่ละ backlog item
   (`### BL-XXX: ...`) ในไฟล์ backlog:
   - spec ไฟล์ไหนไม่มี item อ้างถึงเลย → **MISSING** ต้องแตก backlog ใหม่ทั้งไฟล์
   - มี item อ้างถึงอยู่แล้ว ให้เทียบ **Functional Requirements** ในไฟล์ spec กับ User Story
     ของ item ที่อ้างถึง spec นั้น ว่าครอบคลุมครบทุกข้อหรือไม่ — ถ้ายังไม่ครบ → **PARTIAL**
   - ครบแล้ว → **IN SYNC** ไม่ต้องทำอะไร
   - item ที่ไม่มีค่า `**Source**` เลย (ข้อมูลเก่า/พิมพ์ตก) ให้เตือนผู้ใช้ แทนการเดาเติมเอง

4. **ตรวจว่า `docs/01-requirements/01-spec/index.md`** ลิงก์ไปยัง spec ไฟล์ทุกไฟล์ครบหรือไม่
   ถ้าขาดให้เพิ่ม

5. **ตรวจว่าไฟล์ spec แต่ละไฟล์** มี wikilink ชี้กลับไปยัง `product-backlog.md` หรือยัง (ตามกฎ
   bidirectional link ของโปรเจกต์) ถ้ายังไม่มีให้ append เพิ่มให้

## เมื่อพบ MISSING หรือ PARTIAL

ทำตาม workflow ของ [requirement-to-backlog skill](../requirement-to-backlog/SKILL.md)
(atomic requirement, Epic, User Story, Given/When/Then, MoSCoW) กับ spec ไฟล์นั้น แล้ว:

1. เพิ่ม backlog item ใหม่ต่อท้ายไฟล์ (หรือต่อท้าย Epic ที่เกี่ยวข้องถ้ามีอยู่แล้ว) ใส่ค่า
   **Source** เป็น wikilink ไปยังไฟล์ spec นั้น — **ห้ามแก้ไขหรือลบ item เดิม** ใช้ `BL-XXX`
   ต่อเนื่องจากเลขสูงสุดที่มีอยู่ในไฟล์
2. **ถ้าไฟล์ spec นั้นยังมี Open Questions ค้างอยู่** ให้ระบุไว้ในส่วน "หมายเหตุ" ของ backlog.md
   ว่า item ที่เพิ่งเพิ่มเป็น provisional เพราะ spec ต้นทางยังไม่ปิดคำถามเหล่านั้น
3. **บันทึกลง `docs/05-log/index.md`** เสมอ: เพิ่มหัวข้อวันที่ใต้ `## บันทึก` (รันคำสั่งหาวันที่
   จริงเสมอ อย่าเดา) ถ้ายังไม่มีหัวข้อของวันนั้น แล้วสรุปว่าพบ spec ไฟล์ไหน out of sync, เพิ่ม
   BL-XXX อะไรบ้าง, และมี Open Question ค้างหรือไม่

## รายงานผลให้ผู้ใช้

สรุปว่า spec ไฟล์ไหน IN SYNC อยู่แล้ว, ไฟล์ไหน MISSING/PARTIAL และเพิ่ม BL-XXX อะไรไปบ้าง,
และไฟล์ไหนที่ backlog เพิ่งเพิ่มยังเป็น provisional เพราะ Open Question ยังไม่ปิด

## ข้อควรระวัง

- ห้ามลบหรือแก้ไข item เดิม รวมถึงห้ามเปลี่ยน Status ของ item เดิมโดยไม่ถูกขอ
- ห้ามสมมติเนื้อหา Functional Requirement ที่ไม่มีอยู่ในไฟล์ spec จริง
- ถ้าไม่แน่ใจว่า FR ข้อใดถูกครอบคลุมแล้วหรือยัง ให้ถามผู้ใช้แทนการเดา
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน
