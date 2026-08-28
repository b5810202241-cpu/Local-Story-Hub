# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ภาพรวมโปรเจกต์และสถานะปัจจุบัน

โปรเจกต์นี้ยังไม่มีซอร์สโค้ด มีเพียงโครงสร้างเอกสาร (`docs/`) สำหรับบริหารจัดการโปรเจกต์แบบ end-to-end ตั้งแต่ requirement ไปจนถึง retrospective ยังไม่มี build/lint/test command เพราะยังไม่มีโค้ดให้รัน — เมื่อมีการเพิ่มโค้ดจริงในอนาคต ให้อัปเดตไฟล์นี้ด้วยคำสั่ง build/lint/test ที่เกี่ยวข้องทันที ไม่ปล่อยให้ไฟล์นี้ล้าหลังโค้ด

โปรเจกต์จริงคือ **Local Story Hub** (AI-powered Community Storytelling & Learning Platform) สเปคจริงชุดแรกอยู่ที่ `docs/01-requirements/01-spec/local-story-hub.md` สรุปจากไฟล์ requirement ที่ผู้ใช้แนบมาเท่านั้น (ดู Open Questions ในไฟล์นั้นสำหรับรายละเอียดที่ยังไม่ตัดสินใจ เช่น แพลตฟอร์ม website/application, สิทธิ์การเข้าถึงของแต่ละชุมชน, non-functional requirements) ยังไม่มี Product Backlog จริงสำหรับสเปคนี้ — spec/backlog ตัวอย่าง (mock, เรื่อง Task Management) ที่ใช้สาธิตการทำงานของ agent/skill ถูกย้ายไปเก็บที่ `docs/00-archived/` แล้ว (ดู `docs/05-log/index.md`)

## Requirement intake → Spec → Product Backlog workflow

เมื่อผู้ใช้ให้ **requirement ดิบ** มา (ข้อความไม่มีโครงสร้าง, ไฟล์แนบ, บทสนทนา) ที่ยังไม่มี
เอกสาร spec รองรับ ใช้คู่นี้เป็นจุดเริ่มต้น — ทำ Phase 1 (บันทึกเป็น spec) ต่อด้วย Phase 2
(แตกเป็น backlog) ให้ทันทีในคำขอเดียว:

- **Agent** [.claude/agents/requirement-intake-analyst.md](.claude/agents/requirement-intake-analyst.md)
- **Skill** [.claude/skills/requirement-intake/SKILL.md](.claude/skills/requirement-intake/SKILL.md)

ทั้งสองไฟล์นี้ทำ Phase 1 (สรุป requirement ดิบเป็นไฟล์ spec ที่ `docs/01-requirements/01-spec/{YYYYMMDD}-{RUNNING_NO}-{topic}.md`) เอง แต่สำหรับ Phase 2 (spec → backlog) จะ **อ้างอิงไปยัง workflow ของ `backlog-analyst`/`requirement-to-backlog` ด้านล่างแทนการเขียนขั้นตอนซ้ำ** เพื่อไม่ให้เกิด drift หลายจุด — ถ้าจะแก้ template เอกสาร spec หรือธรรมเนียมตั้งชื่อไฟล์ ให้แก้ทั้งสองไฟล์นี้พร้อมกัน ส่วนการแก้วิธีแตก backlog ให้ไปแก้คู่ agent/skill ถัดไป

ตัวอย่างคำขอที่ควร trigger คู่นี้: "นี่คือ requirement ของฟีเจอร์ใหม่ ช่วยเขียนเป็นเอกสารให้หน่อย", "รับ requirement นี้ไปสรุปเป็น backlog ให้หน่อย", "เพิ่ม requirement ใหม่แล้วแตกเป็น story"

## Spec → Product Backlog workflow

ถ้า spec มีอยู่แล้วและผู้ใช้ต้องการแค่วิเคราะห์เป็น backlog (ไม่มี requirement ดิบใหม่) ใช้คู่นี้
ตรง ๆ — เป็น Phase 2 ที่คู่ intake ด้านบนก็อ้างอิงมาเช่นกัน ครอบคลุม pipeline เดียวกันทั้งหมด:

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

### ธรรมเนียมการตั้งชื่อไฟล์ spec ใหม่

เมื่อเพิ่มไฟล์ spec ใหม่ใน `docs/01-requirements/01-spec/` ให้ตั้งชื่อไฟล์ตามรูปแบบ
`{YYYYMMDD}-{RUNNING_NO}-{topic-slug}.md` — วันที่ให้ได้จากการรันคำสั่งวันที่จริงเสมอ
(ห้ามเดาจาก training data), running number เริ่มที่ 2 หลักและขยายเมื่อเกิน 99 (list โฟลเดอร์ก่อนเพื่อหาเลขต่อไป), และ topic slug เป็นภาษาอังกฤษ kebab-case (เช่น
`20260822-01-community-content-tools.md`) แล้วเพิ่มลิงก์เข้า `01-spec/index.md` ทุกครั้ง
ไฟล์ `local-story-hub.md` ที่มีอยู่แล้วได้รับการยกเว้น (สร้างก่อนกำหนดธรรมเนียมนี้) ไม่ต้อง
เปลี่ยนชื่อย้อนหลัง

## Backlog sync checking

เมื่อ spec มีการแก้ไข/เพิ่มเนื้อหาทีหลัง (เช่น เมื่อ Open Questions ถูกตอบ) ต้องเช็คว่า
`product-backlog.md` ยังตรงกับ spec ล่าสุดอยู่หรือไม่ — มีสองเครื่องมือที่ทำงานแบบเดียวกัน:

- **Agent** [.claude/agents/backlog-sync-checker.md](.claude/agents/backlog-sync-checker.md)
- **Skill** [.claude/skills/backlog-sync-check/SKILL.md](.claude/skills/backlog-sync-check/SKILL.md)

ทั้งสองไฟล์นี้ก็ตั้งใจอธิบาย process ซ้ำกันเหมือนคู่แรก — **แก้ทั้งสองไฟล์พร้อมกันเสมอ**
เพื่อกัน drift เครื่องมือนี้จะตรวจ coverage ของแต่ละ spec กับบรรทัด `**Source**` ในไฟล์
backlog (MISSING/PARTIAL/IN SYNC) เพิ่ม `BL-XXX` ที่ขาดโดยไม่แก้ของเดิม ทำเครื่องหมาย
รายการที่มาจาก spec ที่ยังมี Open Questions ค้างว่าเป็น provisional และบันทึกทุกการแก้ไขลง
`docs/05-log/index.md` ตัวอย่างคำขอ: "เช็คหน่อยว่า backlog ตรงกับ requirement ล่าสุดไหม", "sync backlog ให้หน่อย"

## Open Questions tracking

แทนที่จะเพิ่ม tooling สำหรับ phase ถัดไป (`02-design`) ทั้งที่ Open Questions ของ spec ที่มีอยู่
ยังไม่ปิดแม้แต่ไฟล์เดียว โปรเจกต์นี้เลือกเพิ่มเครื่องมือรวบรวม Open Questions ที่ค้างทั้งหมดไว้
จุดเดียวก่อน เพื่อให้พาไปคุยกับผู้มีส่วนได้ส่วนเสีย (อาจารย์ที่ปรึกษา/ตัวแทนชุมชน) ได้ง่าย:

- **Agent** [.claude/agents/open-questions-tracker.md](.claude/agents/open-questions-tracker.md)
- **Skill** [.claude/skills/open-questions-tracker/SKILL.md](.claude/skills/open-questions-tracker/SKILL.md)

ทั้งสองไฟล์นี้ก็ตั้งใจอธิบาย process ซ้ำกันเหมือนคู่อื่น ๆ — **แก้ทั้งสองไฟล์พร้อมกันเสมอ**
เครื่องมือนี้**อ่านอย่างเดียว ไม่ตอบหรือเดาคำตอบ Open Question เอง** — ดึง Open Questions จาก
ทุกไฟล์ spec, จับคู่กับ backlog item ที่ provisional เพราะคำถามนั้น, เดาว่าควรถามผู้มีส่วนได้
ส่วนเสียฝ่ายไหน แล้ว **regenerate** (ไม่ใช่ append) ไฟล์สรุปที่
`docs/01-requirements/03-task/open-questions.md` ทุกครั้งที่รัน — ไฟล์นี้เป็น snapshot สถานะ
ปัจจุบัน ต่างจาก `05-log` ที่เก็บประวัติแบบ append เท่านั้น ตัวอย่างคำขอ: "สรุป Open Question
ที่ค้างอยู่ทั้งหมดให้หน่อย", "มีคำถามอะไรที่ต้องเอาไปถามอาจารย์/ชุมชนบ้าง"

## Feature List (จาก backlog)

จัดกลุ่ม backlog ให้เป็นภาพรวมระดับ Feature ที่อ่านง่ายกว่า backlog item ดิบ — อยู่ในฝั่ง
`01-requirements` ล้วน ไม่แตะ `02-design` จึงไม่ผูกกับ gate ของ Open Questions เรียกใช้ได้
ทันทีโดยไม่ต้องรอปิดคำถาม:

- **Agent** [.claude/agents/feature-list-builder.md](.claude/agents/feature-list-builder.md)
- **Skill** [.claude/skills/feature-list/SKILL.md](.claude/skills/feature-list/SKILL.md)

ทั้งสองไฟล์นี้ก็อธิบาย process ซ้ำกัน — **แก้ทั้งสองไฟล์พร้อมกันเสมอ** จัดกลุ่ม 1 Epic = 1
Feature เป็นค่าเริ่มต้น, จัด MoSCoW ระดับ Feature จาก Priority ของ backlog item ข้างใน, แล้ว
**regenerate** (ไม่ใช่ append) `docs/01-requirements/03-task/feature-list.md` ทุกครั้งที่รัน
— รูปแบบผลลัพธ์: ตารางสรุป (Feature / MoSCoW / backlog อ้างอิง) ด้านบน ตามด้วยคำอธิบายแต่ละ
Feature ด้านล่าง

## User Journey (จาก requirement) — ผ่าน gate ของ Open Questions

เครื่องมือแรกของโปรเจกต์ที่เขียนเข้า `02-design/01-prototypes/` จริง จึงเป็นจุดที่บังคับใช้กฎ
gate "Open Question ที่กระทบ scope ใหญ่ต้องปิดก่อนเข้า `02-design`" (ดูหัวข้อ "เงื่อนไขและ
ข้อกำหนดในการทำงาน" ด้านล่าง) โดยตรง:

- **Agent** [.claude/agents/user-journey-designer.md](.claude/agents/user-journey-designer.md)
- **Skill** [.claude/skills/user-journey/SKILL.md](.claude/skills/user-journey/SKILL.md)

ทั้งสองไฟล์นี้ก็อธิบาย process ซ้ำกัน — **แก้ทั้งสองไฟล์พร้อมกันเสมอ** ก่อนวาด journey ต้องเช็ค
`docs/01-requirements/03-task/open-questions.md` เสมอ — ถ้ามี Open Question กระทบ journey ที่
จะวาด **ต้องถามผู้ใช้ก่อนทุกครั้ง** ว่าจะร่างต่อแบบ DRAFT (ทำเครื่องหมายจุดที่ไม่แน่นอนไว้ชัดเจน)
หรือรอคำตอบก่อน — ห้ามเลือกแทนผู้ใช้หรือข้ามการเช็คนี้ไม่ว่ากรณีใด ผลลัพธ์เป็น Mermaid diagram
พร้อมคำอธิบายทีละ step ใต้กราฟที่ map กลับไปยัง `FR-x.x` ของสเปคต้นทางทุกข้อ บันทึกที่
`docs/02-design/01-prototypes/{persona-slug}-journey.md` พร้อม wikilink กลับไปยัง spec ต้นทาง
(bidirectional ตามกฎเดิม)

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

**ทั้ง repo นี้คือ Obsidian vault เดียว** — root ของ vault คือโฟลเดอร์บนสุดของ repo (ที่มี `CLAUDE.md`) **ไม่ใช่ `docs/`** ไฟล์ config `.obsidian/app.json` อยู่ที่ root ตั้ง link format เป็น wikilink แบบ relative path (`newLinkFormat: relative`, `useMarkdownLinks: false`) เพื่อให้ลิงก์ที่สร้างผ่าน Obsidian UI ตรงกับธรรมเนียมเดิม — **เวลาเปิดวอลต์ใน Obsidian ต้องเปิดที่โฟลเดอร์ root ของ repo เสมอ ห้ามเปิดที่ `docs/` เป็นวอลต์แยก** ไม่เช่นนั้นจะหาไฟล์ในนี้ไม่เจอเพราะ Obsidian จะไม่เห็น `.obsidian/app.json` และอาจสร้างวอลต์ใหม่ที่ว่างเปล่าซ้อนขึ้นมาแทน ไฟล์ `.obsidian/workspace*.json` และ `cache` ที่ root ถูก gitignore ไว้เพราะเป็น local/user-specific state

## กฎสำคัญเมื่อแก้ไขเอกสาร

- **ห้ามลบเอกสารออกจากโปรเจกต์โดยตรง** — ให้ย้ายไปเก็บไว้ใน `docs/00-archived/` เพื่อรักษาประวัติการตัดสินใจ (ระบุไว้ใน `docs/00-archived/index.md`)
- เอกสารแต่ละหมวดอ้างอิงถึงกันด้วย wikilink สไตล์ Obsidian (`[[../path/index|label]]`) ตามลำดับการไหลของงานข้างต้น — เมื่อเพิ่มเอกสารใหม่ในหมวดใด ให้เชื่อมโยงไปยังหมวดต้นทางและหมวดปลายทางตามรูปแบบเดิม
- เนื้อหาเอกสารเขียนเป็นภาษาไทย ให้เขียนเอกสารใหม่ในภาษาเดียวกันเพื่อความสอดคล้อง

## เงื่อนไขและข้อกำหนดในการทำงาน

- **ห้ามข้ามลำดับ pipeline** — อย่าเริ่มเขียนเอกสารในหมวดปลายทาง (เช่น `02-design`, `03-testing`) ก่อนที่หมวดต้นทางที่เกี่ยวข้อง (เช่น `01-requirements/01-spec`) จะมีเนื้อหารองรับ หากจำเป็นต้องข้าม ให้ระบุเหตุผลไว้ใน `05-log`
- **Open Question ที่กระทบ scope ใหญ่ต้องปิดก่อนเข้า `02-design`** — เช่น Open Questions ของ `local-story-hub.md` ตอนนี้ (เลือกแพลตฟอร์ม website/application, สิทธิ์การเข้าถึงของแต่ละชุมชน, ขอบเขตของ "ระบบจัดการข้อมูล") ต้องได้รับคำตอบและบันทึกไว้ใน `docs/05-log/index.md` ก่อน ห้ามออกแบบ (`02-design`) โดยเดาคำตอบเอง ส่วน Open Question ปลีกย่อยที่ไม่กระทบ scope หลักสามารถเดินหน้าคู่กันได้
- **บันทึกการตัดสินใจสำคัญทุกครั้ง** — เมื่อมีการเปลี่ยนแผน เปลี่ยน scope หรือตัดสินใจเชิงเทคนิคที่กระทบหลายหมวด ให้เพิ่มรายการใน `docs/05-log/index.md` พร้อมวันที่และเหตุผล
- **ปรับสถานะงานให้ตรงความจริงเสมอ** — เอกสารใน `01-requirements/03-task` ต้องสะท้อนสถานะปัจจุบัน (ยังไม่เริ่ม/กำลังทำ/เสร็จแล้ว) ทุกครั้งที่มีความคืบหน้า
- **ก่อนทำการเปลี่ยนแปลงเชิงโครงสร้าง** (ย้าย/ลบ/รีออร์แกไนซ์โฟลเดอร์ในระดับ `docs/`) ให้แจ้งและขอคำยืนยันจากผู้ใช้ก่อนเสมอ เนื่องจากกระทบ wikilink ที่เชื่อมโยงกันทั้งโปรเจกต์
- ยังไม่มี build/lint/test เพราะไม่มีโค้ด — เมื่อเริ่มมีโค้ดจริง ให้เพิ่มเงื่อนไขเรื่อง commands ในไฟล์นี้ทันที

> เงื่อนไขข้างต้นเป็นค่าเริ่มต้นที่สรุปจากกฎที่มีอยู่แล้วในเอกสาร หากมีข้อกำหนดเฉพาะเจาะจงเพิ่มเติม (เช่น ผู้อนุมัติเอกสาร, deadline ของแต่ละ phase, เครื่องมือที่ต้องใช้) แจ้งได้เพื่อเพิ่มเข้าไปในส่วนนี้

## ผู้มีส่วนได้ส่วนเสีย

ผู้อนุมัติ/ตัดสินใจ scope ของ Local Story Hub:

- **อาจารย์ที่ปรึกษา** — ผู้ดูแล/อนุมัติทิศทางโครงการฝั่งวิชาการ
- **ตัวแทนชุมชน** — ผู้ให้ข้อมูลและยืนยันความต้องการฝั่งผู้ใช้จริงในชุมชน

เมื่อ agent/skill เจอ Open Question ที่ต้องสอบถามเพิ่ม ให้ระบุในรายงานว่าควรถามฝ่ายใด (วิชาการ/หลักการเรียน → อาจารย์ที่ปรึกษา, ความต้องการ/บริบทของชุมชน → ตัวแทนชุมชน) แทนการเดาคำตอบเอง

## แนวโน้มที่ต้องเตรียมล่วงหน้า

- **Data privacy**: ระบบเก็บข้อมูลผู้ใช้จริง (รีวิว/บันทึกสถานที่ของนักท่องเที่ยว, ข้อมูล/คอนเทนต์ของชุมชน, ผลงานของนิสิต) ก่อนเข้า `02-design` ควรมี spec แยกเรื่อง data privacy/การเก็บรักษาข้อมูลผู้ใช้ (ยังไม่มีในตอนนี้ ไม่ใช่ requirement ที่ตั้งขึ้นเอง แต่เป็นข้อสังเกตให้เตรียมสอบถามผู้มีส่วนได้ส่วนเสีย)
