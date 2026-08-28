---
name: requirement-to-backlog
description: วิเคราะห์เอกสาร requirement/spec ในโฟลเดอร์ docs/01-requirements/01-spec แล้วแปลงเป็น Product Backlog ที่มี epic, user story, acceptance criteria และ priority (MoSCoW) ใช้ทักษะนี้เมื่อผู้ใช้ขอ "วิเคราะห์ requirement", "สร้าง product backlog", "แตก spec เป็น backlog", "จัดลำดับความสำคัญ backlog" หรือ "backlog grooming" ไม่ใช้สำหรับ technical design, test plan หรือการเขียนโค้ด
---

# Requirement → Product Backlog

ทักษะนี้ใช้แปลงเอกสาร requirement/spec ให้เป็น Product Backlog ที่พร้อมใช้วางแผนงาน ตามลำดับ pipeline ของโปรเจกต์ (`01-requirements: 01-spec → 02-plan → 03-task`) ที่ระบุไว้ใน `CLAUDE.md`

repo นี้ทั้งหมดเป็น Obsidian vault เดียว (root คือโฟลเดอร์บนสุดของ repo ไม่ใช่ `docs/` — ดู `.obsidian/app.json` ที่ root: `newLinkFormat: relative`, `useMarkdownLinks: false`) — ทุกลิงก์ระหว่างเอกสารที่คุณสร้าง/แก้ไขต้องเป็น **wikilink แบบ relative path** รูปแบบ `[[../path/file|label]]` เท่านั้น ห้ามใช้ markdown link (`[label](path)`) เด็ดขาด ไม่เช่นนั้น Graph view และ backlink ของ Obsidian จะไม่เห็นความเชื่อมโยง

## เมื่อไรควรมอบงานต่อให้ agent `backlog-analyst`

ถ้ามีเอกสาร spec จำนวนมาก หรือต้องการให้ทำงานแบบแยกบริบท (ไม่ปนกับงานสนทนาปัจจุบัน) ให้เรียกใช้ผ่าน Agent tool ด้วย `subagent_type: backlog-analyst` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้วิธีการเดียวกัน

## ขั้นตอน

1. **รวบรวมต้นทาง** — อ่านทุกไฟล์ใน `docs/01-requirements/01-spec/` และตรวจสอบ `docs/01-requirements/02-plan/`, `docs/01-requirements/03-task/product-backlog.md` (ถ้ามีอยู่แล้ว) เพื่อไม่ให้ซ้ำหรือขัดแย้งกับของเดิม

2. **สกัด requirement ให้เป็นหน่วยที่ atomic** — แต่ละหน่วยควรทดสอบและประเมินขนาดได้อย่างอิสระ อย่ารวมหลาย feature ไว้ใน backlog item เดียว

3. **จัดกลุ่มเป็น Epic** ตาม feature/module ที่เกี่ยวข้องกัน

4. **เขียน backlog item แต่ละรายการด้วย template นี้:**

   ```
   ### BL-XXX: <ชื่อสั้นๆ>
   - **Epic**: <ชื่อ epic>
   - **User Story**: ในฐานะ <บทบาท> ฉันต้องการ <สิ่งที่ต้องการ> เพื่อ <เป้าหมาย/ประโยชน์>
   - **Acceptance Criteria**:
     - Given <บริบท> When <การกระทำ> Then <ผลลัพธ์ที่คาดหวัง>
   - **Priority**: Must | Should | Could | Won't
   - **Source**: [[../01-spec/index|01-spec]]
   - **Status**: ยังไม่เริ่ม
   ```

5. **บันทึกผลลัพธ์** ลงที่ `docs/01-requirements/03-task/product-backlog.md`
   - ถ้าไฟล์ยังไม่มี ให้สร้างใหม่พร้อมหัวเอกสาร (`# Product Backlog`) และ wikilink กลับไปยัง `01-spec` และ `02-plan` ตามธรรมเนียมของโฟลเดอร์อื่นใน `docs/`
   - ถ้าไฟล์มีอยู่แล้ว ให้ **merge**: คงสถานะ/ผู้รับผิดชอบของ item เดิมที่ยังตรงกับ spec, เพิ่ม item ใหม่, และทำเครื่องหมาย item ที่ spec ต้นทางถูกเอาออกไปแล้วว่า "ต้องตรวจสอบ" (ห้ามลบทิ้งเอง)

6. **เพิ่ม wikilink แบบ bidirectional** — นอกจาก backlog item แต่ละรายการมี wikilink ชี้ไปยัง spec ต้นทาง (field **Source**) แล้ว ให้กลับไปเพิ่ม wikilink ในไฟล์ spec ต้นทางแต่ละไฟล์ที่ถูกอ้างถึง ให้ชี้กลับมายัง `docs/01-requirements/03-task/product-backlog.md` ด้วย ถ้ายังไม่มีลิงก์นี้อยู่ — เพิ่มแบบ **append** ต่อท้ายเนื้อหาเดิมเท่านั้น ห้ามลบหรือแก้ไขข้อความเดิมของ spec เพื่อให้ Obsidian graph เห็นความเชื่อมโยงทั้งสองทาง

7. **ระบุข้อสันนิษฐาน** — ถ้า spec ไม่ระบุ priority หรือ scope ชัดเจน ให้ตั้งสมมติฐานที่สมเหตุสมผลและรวบรวมไว้ในหัวข้อ "## ข้อสันนิษฐาน" ท้ายไฟล์ backlog เพื่อให้ผู้ใช้ตรวจสอบ — ห้ามเดา business rule ที่กระทบ scope ใหญ่โดยไม่ระบุให้เห็น

8. **เคารพกฎของโปรเจกต์**: ห้ามลบเอกสารเดิมโดยตรง (ให้แนะนำย้ายไป `docs/00-archived/` และรอผู้ใช้ยืนยัน), เขียนทุกอย่างเป็นภาษาไทย, เพิ่ม wikilink เชื่อมโยงตามรูปแบบเดิมของโปรเจกต์

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- จำนวน backlog item และ epic ที่สร้าง/อัปเดต
- ข้อสันนิษฐานที่ตั้งไว้ (ถ้ามี) ที่ต้องให้ผู้ใช้ยืนยัน
- requirement ที่คลุมเครือเกินกว่าจะแตกเป็น backlog item ได้ พร้อมคำถามที่ต้องการคำตอบเพิ่มเติม
