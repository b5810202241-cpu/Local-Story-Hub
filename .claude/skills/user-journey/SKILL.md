---
name: user-journey
description: >
  วาด/อัปเดต User Journey ของ Local Story Hub เป็น Mermaid diagram พร้อมคำอธิบายทีละ step
  ใต้กราฟที่ map กลับไปยัง Functional Requirement แต่ละข้อ บันทึกที่
  docs/02-design/01-prototypes/{persona}-journey.md เช็ค Open Questions ที่ยังค้างก่อนเสมอ
  (ตามกฎ gate ใน CLAUDE.md) ถ้ามีคำถามที่กระทบ journey จะถามผู้ใช้ก่อนว่าจะร่างแบบ DRAFT
  ต่อไปหรือรอคำตอบ ใช้เมื่อผู้ใช้ขอวาด/อัปเดต user journey หรือ user flow ไม่ใช้สำหรับสรุป
  backlog เป็น feature list — ใช้ skill `feature-list` แทน
---

# User Journey จาก Requirement

ทักษะนี้แปล Functional Requirements ในสเปคของ Local Story Hub ให้เป็น **User Journey** แบบ
Mermaid diagram พร้อมคำอธิบาย เพื่อสื่อสารและตกลงหน้าตาของระบบก่อนลงมือพัฒนาจริง
(`docs/02-design/01-prototypes/`)

repo นี้ทั้งหมดเป็น Obsidian vault เดียว (root คือโฟลเดอร์บนสุดของ repo ไม่ใช่ `docs/` — ดู `.obsidian/app.json` ที่ root: `newLinkFormat: relative`, `useMarkdownLinks: false`) — ทุก
ลิงก์ต้องเป็น wikilink แบบ relative path เท่านั้น

## เมื่อไรควรมอบงานต่อให้ agent `user-journey-designer`

ถ้ามี spec จำนวนมาก หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool ด้วย
`subagent_type: user-journey-designer` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้
วิธีการเดียวกัน

## ขั้นตอน

1. **ระบุ persona/journey เป้าหมาย** — ถ้าผู้ใช้ไม่ได้ระบุมาชัดเจน ให้ถามก่อน อย่าเดาว่าจะทำ
   journey ของใคร (ชุมชน, นักท่องเที่ยว, นิสิตนิเทศศาสตร์ หรืออื่น)

2. **รวบรวม Functional Requirements ที่เกี่ยวข้อง** จากไฟล์ spec ใน
   `docs/01-requirements/01-spec/` ที่เกี่ยวกับ persona นั้น (รวมสเปคที่ครอบคลุมผู้ใช้งานทุก
   กลุ่มถ้าเกี่ยวข้อง)

3. **เช็ค Open Questions ที่ยังค้างก่อนเสมอ** — อ่าน
   `docs/01-requirements/03-task/open-questions.md` (หรือไล่ดู `## Open Questions` ในไฟล์
   spec ที่เกี่ยวข้องโดยตรงถ้าไฟล์นี้ไม่มี/ไม่ทันสมัย):
   - ไม่มีคำถามที่กระทบ → วาด journey แบบสมบูรณ์ได้ตามปกติ
   - มีคำถามที่กระทบ → **ถามผู้ใช้ก่อนเสมอ** ว่าจะ (ก) ร่างต่อแบบ DRAFT พร้อมทำเครื่องหมายจุด
     ที่ไม่แน่นอน หรือ (ข) รอคำตอบก่อน — ห้ามเลือกแทนผู้ใช้ (กฎ gate ก่อนเข้า `02-design` ตาม
     `CLAUDE.md`) **ห้ามข้ามขั้นตอนนี้แม้ผู้ใช้จะรีบหรือขอให้ "ทำเลย"**

4. **วาด Mermaid flowchart** แสดงลำดับขั้นตอนจริงที่ผู้ใช้ทำ ใช้ decision diamond เมื่อมี
   ทางเลือกจริงในสเปค — ไม่ใส่ step ที่ไม่มีใน requirement

5. **เขียนคำอธิบายใต้กราฟเป็นลำดับขั้นตอน** แต่ละขั้นตอน**ต้อง map กลับไปยัง Requirement**
   (ระบุ `FR-x.x` พร้อม wikilink ไปยังไฟล์ spec ต้นทาง) — ขั้นตอนที่มาจาก Open Question ให้
   ทำเครื่องหมาย `(DRAFT — ขึ้นกับ Open Question)`

6. **บันทึกไฟล์** ที่ `docs/02-design/01-prototypes/{persona-slug}-journey.md` (slug ภาษา
   อังกฤษ) ตาม template:

   ```
   # User Journey: {ชื่อ persona/journey}

   - **สถานะ**: {Confirmed / DRAFT — ขึ้นกับ Open Question}
   - **อ้างอิงจาก**: [[../../01-requirements/01-spec/{filename}|{filename}]]

   ## Diagram

   ```mermaid
   flowchart TD
     ...
   ```

   ## คำอธิบาย

   1. {ขั้นตอน} — {FR-x.x} [[../../01-requirements/01-spec/{filename}|{filename}]]
   ```

7. เพิ่ม wikilink ไปยัง journey ใหม่ใน `docs/02-design/01-prototypes/index.md`

8. **เพิ่ม wikilink กลับ** จากไฟล์ spec ต้นทางแต่ละไฟล์ที่ใช้ ให้ชี้ไปยัง journey นี้ (append
   ต่อท้าย ห้ามลบ/แก้เนื้อหาเดิม) ตามกฎ bidirectional link ของโปรเจกต์

9. **บันทึกลง `docs/05-log/index.md`** ว่าสร้าง/อัปเดต journey ไหน สถานะ Confirmed หรือ DRAFT
   (ระบุ Open Question ที่บล็อกถ้ามี) — รันคำสั่งหาวันที่จริงเสมอ

## ข้อควรระวัง

- ห้ามข้ามขั้นตอนเช็ค Open Questions ไม่ว่ากรณีใด
- ห้ามเดา requirement ที่ไม่มีอยู่ในสเปค ถ้าไม่แน่ใจให้ถามผู้ใช้
- ห้ามลบหรือแก้ไขไฟล์ spec/backlog เดิม (เว้นแต่การ append wikilink ย้อนกลับ)
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน (ยกเว้นชื่อไฟล์ที่ต้องเป็น
  slug ภาษาอังกฤษ)

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- Journey ที่สร้าง/อัปเดต และสถานะ (Confirmed / DRAFT)
- ถ้าเป็น DRAFT ให้ระบุ Open Question ที่บล็อกอยู่และผลกระทบต่อ journey
- FR ที่ journey นี้ครอบคลุม และ FR ที่ยังไม่ถูกครอบคลุมโดย journey ใดเลย (ถ้าพบ)
