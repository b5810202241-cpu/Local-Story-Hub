# 05 - Log

บันทึก **ความเคลื่อนไหวและเหตุการณ์สำคัญของโปรเจกต์** แบบเรียงตามลำดับเวลา (chronological log) เช่น

- Changelog ของแต่ละเวอร์ชัน/รอบการพัฒนา
- บันทึกการตัดสินใจสำคัญ (decision log) พร้อมเหตุผล
- เหตุการณ์หรือปัญหาที่เกิดขึ้นระหว่างทาง

ใช้เป็นแหล่งอ้างอิงเมื่อสรุปบทเรียนใน [[../04-retrospectives/index|04-retrospectives]] หรือเมื่อย้อนดูว่าเหตุใดจึงมีการตัดสินใจแบบใดแบบหนึ่ง

## สรุปประจำวัน

- [[20260822-log|20260822-log]] — สรุปภาพรวมงานวันที่ 2026-08-21 ถึง 2026-08-22 (snapshot ไม่ใช่ log ต่อเนื่อง)

## บันทึก

### 2026-08-21 — แทนที่ spec/backlog ตัวอย่างด้วยของจริง

- ย้าย `product-spec.md` (mock) และ `product-backlog.md` (mock) ไปเก็บที่ [[../00-archived/product-spec|00-archived/product-spec]] และ [[../00-archived/product-backlog|00-archived/product-backlog]] เนื่องจากเป็นเพียงเอกสารตัวอย่างที่สร้างไว้สาธิตการทำงานของ agent/skill
- สร้าง [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] เป็น spec จริงชุดแรกของโปรเจกต์ Local Story Hub โดยสรุปจากไฟล์ requirement ที่ผู้ใช้แนบมา (`Local Story Hub.docx`) เท่านั้น — มี Open Questions ที่ยังไม่ตัดสินใจอยู่หลายข้อ (ดูในเอกสาร spec)
- แตกเป็น Product Backlog จริงชุดแรก 13 รายการ (BL-001 ถึง BL-013) ที่ [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ทุกรายการยังเป็น provisional เพราะสเปคต้นทางมี Open Questions ที่ยังไม่ตอบ

### 2026-08-22 — เพิ่ม spec เรื่อง IT Log Retention และ PDPA Consent

- เพิ่ม [[../01-requirements/01-spec/20260822-01-it-log-pdpa-consent|01-spec/20260822-01-it-log-pdpa-consent]] จาก requirement ดิบที่ผู้ใช้ให้มา — ครอบคลุมผู้ใช้งานทุกกลุ่ม (ชุมชน, นักท่องเที่ยว, นิสิต/อาจารย์) ไม่ใช่กลุ่มใดกลุ่มหนึ่ง (ยืนยันกับผู้ใช้แล้วหลังจากที่คำว่า "ผู้ซื้อ" ในคำขอเดิมเป็นคำที่ใช้ผิด)
- แตกเป็น backlog เพิ่ม 4 รายการ (BL-014 ถึง BL-017) ใน Epic ใหม่ "การปฏิบัติตามกฎหมาย IT และ PDPA" ที่ [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ทุกรายการยัง provisional เพราะสเปคมี Open Questions ค้างอยู่ (รูปแบบ consent, ประเภท log ที่ต้องเก็บ, ผู้เป็น Data Controller ฯลฯ)

### 2026-08-22 — แก้ไขความเข้าใจผิดเรื่อง Obsidian vault root

- พบว่า `CLAUDE.md` และ agent/skill ทุกไฟล์ (6 คู่) ระบุผิดมาตลอดว่า `docs/` คือ Obsidian vault root และไฟล์ config อยู่ที่ `docs/.obsidian/app.json` — ที่จริง **vault root คือโฟลเดอร์บนสุดของ repo** และ `.obsidian/app.json` อยู่ที่ root ไม่ใช่ใน `docs/`
- สาเหตุที่พบ: ผู้ใช้เปิดไฟล์ในโปรเจกต์ไม่เจอ เมื่อตรวจสอบจึงพบว่าน่าจะมาจากการเปิด Obsidian ผิดตำแหน่ง (ชี้ไปที่ `docs/` แทน root) ตามคำแนะนำที่ผิดในเอกสาร
- แก้ไขข้อความในทุกไฟล์ที่อ้างอิงผิด (`CLAUDE.md` และ `.claude/agents`, `.claude/skills` ทั้งหมด) ให้ระบุ vault root ที่ถูกต้อง พร้อมเพิ่มคำเตือนชัดเจนว่าต้องเปิด Obsidian ที่ root ของ repo เท่านั้น

### 2026-08-22 — เพิ่ม feature-list.md และ User Journey แบบ DRAFT ทั้ง 3 persona

- สร้าง [[../01-requirements/03-task/feature-list|03-task/feature-list]] จาก backlog ปัจจุบัน (7 Feature, MoSCoW: Must 6 / Could 1)
- ก่อนวาด User Journey เช็ค [[../01-requirements/03-task/open-questions|open-questions]] ตามกฎ gate แล้วพบว่าทั้ง 3 journey มี Open Question กระทบอยู่ — ผู้ใช้ยืนยันให้ร่างทุก journey เป็น **DRAFT** ต่อไปโดยทำเครื่องหมายจุดที่ไม่แน่นอนไว้ชัดเจน แทนการรอปิดคำถามก่อน
- สร้าง 3 journey ใน [[../../02-design/01-prototypes/index|02-design/01-prototypes]]: [[../../02-design/01-prototypes/tourist-journey|tourist-journey]], [[../../02-design/01-prototypes/community-content-journey|community-content-journey]], [[../../02-design/01-prototypes/student-content-journey|student-content-journey]]
- `student-content-journey` มี Open Question เชิงโครงสร้างจริง (ต้องผ่านอนุมัติจากชุมชน/อาจารย์ก่อนเผยแพร่หรือไม่) จึงวาด diagram แสดงทั้งสองเส้นทางที่เป็นไปได้แทนการเดาว่าจะเป็นเส้นทางไหน
- เพิ่ม wikilink ย้อนกลับจาก `local-story-hub.md` และ `20260822-01-it-log-pdpa-consent.md` ไปยัง journey ที่เกี่ยวข้องแล้ว ตามกฎ bidirectional link

