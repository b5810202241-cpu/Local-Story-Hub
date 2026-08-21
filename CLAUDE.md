# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ภาพรวมโปรเจกต์และสถานะปัจจุบัน

โปรเจกต์นี้ยังไม่มีซอร์สโค้ด มีเพียงโครงสร้างเอกสาร (`docs/`) สำหรับบริหารจัดการโปรเจกต์แบบ end-to-end ตั้งแต่ requirement ไปจนถึง retrospective ยังไม่มี build/lint/test command เพราะยังไม่มีโค้ดให้รัน — เมื่อมีการเพิ่มโค้ดจริงในอนาคต ให้อัปเดตไฟล์นี้ด้วยคำสั่ง build/lint/test ที่เกี่ยวข้องทันที ไม่ปล่อยให้ไฟล์นี้ล้าหลังโค้ด

โปรเจกต์จริงคือ **Local Story Hub** (AI-powered Community Storytelling & Learning Platform) สเปคจริงชุดแรกอยู่ที่ `docs/01-requirements/01-spec/local-story-hub.md` สรุปจากไฟล์ requirement ที่ผู้ใช้แนบมาเท่านั้น (ดู Open Questions ในไฟล์นั้นสำหรับรายละเอียดที่ยังไม่ตัดสินใจ เช่น แพลตฟอร์ม website/application, สิทธิ์การเข้าถึงของแต่ละชุมชน, non-functional requirements) ยังไม่มี Product Backlog จริงสำหรับสเปคนี้ — spec/backlog ตัวอย่าง (mock, เรื่อง Task Management) ที่ใช้สาธิตการทำงานของ agent/skill ถูกย้ายไปเก็บที่ `docs/00-archived/` แล้ว (ดู `docs/05-log/index.md`)

## Requirement → Product Backlog workflow

นี่คือ workflow หลักที่โปรเจกต์นี้ตั้งไว้ มีสองเครื่องมือที่ทำงานแบบเดียวกัน ครอบคลุม pipeline เดียวกันทั้งหมด:

- **Agent** [.claude/agents/backlog-analyst.md](.claude/agents/backlog-analyst.md) — เหมาะกับกรณีมี spec จำนวนมาก หรือต้องการแยกบริบทการทำงานออกจากบทสนทนาปัจจุบัน
- **Skill** [.claude/skills/requirement-to-backlog/SKILL.md](.claude/skills/requirement-to-backlog/SKILL.md) — ทำ workflow เดียวกันแบบ inline โดยไม่ต้องเปิด subagent

ทั้งสองไฟล์นี้ตั้งใจอธิบาย process ซ้ำกัน — **ถ้าจะแก้ workflow (template ของ backlog item, naming convention, วิธีจัดลำดับความสำคัญ, output path ฯลฯ) ต้องแก้ทั้งสองไฟล์พร้อมกัน** ไม่เช่นนั้นจะ drift ไม่ตรงกัน

ขั้นตอนของ workflow (ดูรายละเอียดเต็มในสองไฟล์ข้างต้น):

1. อ่านทุกไฟล์ใน `docs/01-requirements/01-spec/` และตรวจสอบ `docs/01-requirements/02-plan/`, `docs/01-requirements/03-task/product-backlog.md` ที่มีอยู่แล้ว เพื่อไม่ให้ backlog ใหม่ซ้ำหรือขัดแย้งกับของเดิม
2. สกัด requirement เป็นหน่วยที่ atomic แล้วจัดกลุ่มเป็น Epic ตาม feature/module
3. เขียนแต่ละรายการเป็น backlog item ด้วย field: ID (`BL-XXX`), Epic, User Story (`ในฐานะ [บทบาท] ฉันต้องการ [สิ่งที่ต้องการ] เพื่อ [เป้าหมาย]`), Acceptance Criteria (Given/When/Then), Priority (MoSCoW), Source (wikilink กลับไปยัง spec ต้นทาง), Status
4. บันทึกที่ `docs/01-requirements/03-task/product-backlog.md` — ถ้าไฟล์มีอยู่แล้วให้ **merge** ไม่เขียนทับ (คงสถานะ/ผู้รับผิดชอบของรายการเดิมที่ยังตรงกับ spec)
5. ถ้า spec คลุมเครือหรือไม่ระบุ priority/scope ชัดเจน ให้ตั้งสมมติฐานที่สมเหตุสมผลและใส่หัวข้อ "ข้อสันนิษฐาน"/"## ข้อสันนิษฐาน" ท้ายไฟล์ backlog ให้ผู้ใช้ตรวจสอบ — ห้ามเดา business rule ที่กระทบ scope ใหญ่โดยไม่ระบุให้เห็น
6. ห้ามลบเอกสารเดิมโดยตรง — ถ้า requirement ใดถูกยกเลิก ให้แจ้งผู้ใช้ให้ย้ายไป `docs/00-archived/` เอง (agent/skill ห้ามลบเองโดยไม่ถาม)

ตัวอย่างคำขอที่ควร trigger workflow นี้: "วิเคราะห์ requirement แล้วสร้าง product backlog ให้หน่อย", "แตก spec เป็น user story", "จัดลำดับความสำคัญ backlog", "backlog grooming"

## โครงสร้างเอกสารและลำดับการไหลของงาน (docs pipeline)

เอกสารทั้งหมดอยู่ใต้ `docs/` และแต่ละโฟลเดอร์มี `index.md` อธิบายจุดประสงค์ของตัวเอง ลำดับการไหลของงานคือ:

```
01-requirements (01-spec → 02-plan → 03-task)
        ↓
02-design (01-prototypes → 02-technical)
        ↓
03-testing (01-test-plan → 02-test-result)
        ↓
04-retrospectives
```

พร้อมกับ `05-log` ที่บันทึกความเคลื่อนไหว/การตัดสินใจสำคัญแบบ chronological คู่ขนานไปกับทุกขั้นตอน และ `00-archived` สำหรับเอกสารที่เลิกใช้แล้ว

รายละเอียดแต่ละโฟลเดอร์:

- **01-requirements/01-spec** — ต้นทาง (source of truth) ของ feature requirements, user stories, business rules, scope
- **01-requirements/02-plan** — roadmap, phase/milestone, priority ที่แตกมาจาก spec
- **01-requirements/03-task** — task breakdown ที่ลงมือทำได้จริง พร้อมสถานะ/ผู้รับผิดชอบ (รวม `product-backlog.md`)
- **02-design/01-prototypes** — wireframe/mockup, user flow, design system เบื้องต้น อ้างอิงจาก spec
- **02-design/02-technical** — system architecture, database schema, API design, ตัวเลือกเทคโนโลยี
- **03-testing/01-test-plan** — test case/scenario อ้างอิงจาก spec และ technical design
- **03-testing/02-test-result** — ผล pass/fail และบั๊กที่พบจริง
- **04-retrospectives** — สรุปบทเรียนหลังจบ phase/sprint โดยอ้างอิงจาก test result และ log
- **05-log** — changelog, decision log, เหตุการณ์สำคัญ
- **00-archived** — เอกสารเวอร์ชันเก่า/ที่ถูกยกเลิก

`docs/` เป็น Obsidian vault (`docs/.obsidian/`) ตั้ง link format เป็น wikilink แบบ relative path (`newLinkFormat: relative`, `useMarkdownLinks: false` ใน `docs/.obsidian/app.json`) เพื่อให้ลิงก์ที่สร้างผ่าน Obsidian UI ตรงกับธรรมเนียมเดิม ไฟล์ `docs/.obsidian/workspace*.json` และ `cache` ถูก gitignore ไว้เพราะเป็น local/user-specific state

## กฎสำคัญเมื่อแก้ไขเอกสาร

- **ห้ามลบเอกสารออกจากโปรเจกต์โดยตรง** — ให้ย้ายไปเก็บไว้ใน `docs/00-archived/` เพื่อรักษาประวัติการตัดสินใจ (ระบุไว้ใน `docs/00-archived/index.md`)
- เอกสารแต่ละหมวดอ้างอิงถึงกันด้วย wikilink สไตล์ Obsidian (`[[../path/index|label]]`) ตามลำดับการไหลของงานข้างต้น — เมื่อเพิ่มเอกสารใหม่ในหมวดใด ให้เชื่อมโยงไปยังหมวดต้นทางและหมวดปลายทางตามรูปแบบเดิม
- เนื้อหาเอกสารเขียนเป็นภาษาไทย ให้เขียนเอกสารใหม่ในภาษาเดียวกันเพื่อความสอดคล้อง

## เงื่อนไขและข้อกำหนดในการทำงาน

- **ห้ามข้ามลำดับ pipeline** — อย่าเริ่มเขียนเอกสารในหมวดปลายทาง (เช่น `02-design`, `03-testing`) ก่อนที่หมวดต้นทางที่เกี่ยวข้อง (เช่น `01-requirements/01-spec`) จะมีเนื้อหารองรับ หากจำเป็นต้องข้าม ให้ระบุเหตุผลไว้ใน `05-log`
- **บันทึกการตัดสินใจสำคัญทุกครั้ง** — เมื่อมีการเปลี่ยนแผน เปลี่ยน scope หรือตัดสินใจเชิงเทคนิคที่กระทบหลายหมวด ให้เพิ่มรายการใน `docs/05-log/index.md` พร้อมวันที่และเหตุผล
- **ปรับสถานะงานให้ตรงความจริงเสมอ** — เอกสารใน `01-requirements/03-task` ต้องสะท้อนสถานะปัจจุบัน (ยังไม่เริ่ม/กำลังทำ/เสร็จแล้ว) ทุกครั้งที่มีความคืบหน้า
- **ก่อนทำการเปลี่ยนแปลงเชิงโครงสร้าง** (ย้าย/ลบ/รีออร์แกไนซ์โฟลเดอร์ในระดับ `docs/`) ให้แจ้งและขอคำยืนยันจากผู้ใช้ก่อนเสมอ เนื่องจากกระทบ wikilink ที่เชื่อมโยงกันทั้งโปรเจกต์
- ยังไม่มี build/lint/test เพราะไม่มีโค้ด — เมื่อเริ่มมีโค้ดจริง ให้เพิ่มเงื่อนไขเรื่อง commands ในไฟล์นี้ทันที

> เงื่อนไขข้างต้นเป็นค่าเริ่มต้นที่สรุปจากกฎที่มีอยู่แล้วในเอกสาร หากมีข้อกำหนดเฉพาะเจาะจงเพิ่มเติม (เช่น ผู้อนุมัติเอกสาร, deadline ของแต่ละ phase, เครื่องมือที่ต้องใช้) แจ้งได้เพื่อเพิ่มเข้าไปในส่วนนี้
