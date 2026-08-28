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

### 2026-08-22 — ปิด Open Question เรื่องการอนุมัติผลงานนิสิต

- ผู้ใช้ยืนยันว่าผลงานของนิสิต (FR-3.1) เผยแพร่ได้ทันทีโดยไม่ต้องผ่านการอนุมัติจากชุมชนหรืออาจารย์ก่อน — ย้ายจาก Open Questions ไปเป็น Business Rule ใน [[../01-requirements/01-spec/local-story-hub|local-story-hub]] แล้ว
- อัปเดต BL-013 ใน [[../01-requirements/03-task/product-backlog|product-backlog]]: เพิ่ม Acceptance Criteria สะท้อนการเผยแพร่ทันที และปรับหมายเหตุว่าคำถามนี้ปิดแล้ว (ยังเหลือ Open Question ย่อยเรื่องวิธีเชื่อมโยงผลงานกับพื้นที่ชุมชน)
- อัปเดต [[../01-requirements/03-task/open-questions|open-questions]] และ [[../../02-design/01-prototypes/student-content-journey|student-content-journey]]: ตัดเส้นทาง "ต้องอนุมัติ" ออกจาก diagram เหลือ flow เดียว (อัปโหลด → เผยแพร่ทันที) — journey ยังเป็น DRAFT ต่อเพราะ Open Question ย่อยเรื่องการเชื่อมโยงกับชุมชนยังไม่ปิด

### 2026-08-22 — สร้าง Test Plan จาก User Journey ทั้ง 3 persona

- สร้าง [[../03-testing/01-test-plan/test-plan|03-testing/01-test-plan/test-plan]] เป็นเอกสารแรกใน `03-testing` — แปลง Acceptance Criteria ของ backlog item ที่ปรากฏใน User Journey แต่ละ step ให้เป็น test case โดยตรง (18 test case จาก 13 backlog item)
- BL-014 และ BL-017 (พฤติกรรม backend/log) ยังไม่มี test case เพราะไม่ปรากฏเป็น step ใน journey ใดโดยตรง — รอ technical design ใน `02-technical` ก่อน
- test case ที่มาจาก journey step ที่ยังเป็น DRAFT (8 จาก 18 ข้อ) ถูกทำเครื่องหมายไว้ในคอลัมน์หมายเหตุ เพื่อไม่ให้ถือเป็น test case สุดท้ายจนกว่า Open Question ที่เกี่ยวข้องจะปิด
- เพิ่ม wikilink สองทางระหว่าง test plan กับ journey ทั้ง 3 ไฟล์แล้ว

### 2026-08-22 — สร้าง DESIGN.md (Design System)

- สร้าง [[../02-design/01-prototypes/DESIGN|02-design/01-prototypes/DESIGN]] ตามที่ผู้ใช้ขอ แนวทาง earth tone / minimalist / Muji-inspired ครอบคลุม Brand Identity & CI, Design Tokens (Colors, Typography, Spacing), และ UI Components & Pattern
- ผูก design decision กับ requirement จริงในสเปค เช่น ขนาดตัวอักษรเริ่มต้น 18px และปุ่มขั้นต่ำ 48px มาจาก FR-1.7 (ผู้สูงอายุ), pattern Consent Banner มาจาก BL-015/BL-016
- ระบุหมายเหตุจุดที่ Open Question (แพลตฟอร์ม, TTS) ยังกระทบ pattern บางส่วนไว้ท้ายเอกสาร ไม่ได้ฟันธงแทน

### 2026-08-22 — สร้าง Prototype v1 ด้วย prototype-builder (ทั้งระบบ 3 persona)

- เสนอแผน (6 หน้าจอ อ้างอิงจาก journey/FR ใด, component จาก DESIGN.md อะไรบ้าง) ให้ผู้ใช้ยืนยันก่อนตามกฎบังคับของ `prototype-builder` แล้วจึงลงมือสร้าง — ยังไม่มี version เดิมมาก่อนจึงสร้าง `prototype-v1/` ได้เลยโดยไม่ต้องถามเรื่อง folder version
- สร้าง [[../02-design/01-prototypes/prototype-v1/README|02-design/01-prototypes/prototype-v1]]: 6 หน้าจอ HTML self-contained (ยึด DESIGN.md ทุก token) ครอบคลุมทั้ง 3 journey — นักท่องเที่ยว 3 หน้า, ชุมชน 2 หน้า, นิสิต 1 หน้า
- จุดที่เป็น DRAFT ในแต่ละหน้าจอถูกทำเครื่องหมายไว้ในหน้าจอเองด้วย badge "DRAFT" ไม่ใช่แค่ในเอกสารข้างนอก เพื่อให้เห็นชัดตอนรีวิว
- เพิ่ม wikilink สองทางระหว่าง prototype-v1 กับ journey ทั้ง 3 ไฟล์ และ index ของ 01-prototypes แล้ว

### 2026-08-22 — เพิ่มพฤติกรรม Interactive จริงใน Prototype v1

- ผู้ใช้ขอ "interactive prototype" — เลือกแนวทางเพิ่มพฤติกรรมจริงในไฟล์ 6 หน้าเดิม (ไม่ทำเป็น Artifact แยก) เพื่อให้ยังเปิดตรงจากเครื่องได้เหมือนเดิมและเก็บเป็น source of truth เดียวใน repo
- Consent บันทึกจริงผ่าน `localStorage` และแสดงสถานะเป็น badge ที่ header ทุกหน้าฝั่งนักท่องเที่ยว, ค้นหากรองผลลัพธ์แบบ live, บันทึกสถานที่โปรด/โพสต์รีวิวทำงานจริงและจำสถานะข้ามการโหลดหน้า
- ปุ่ม AI ทุกปุ่มในหน้าสร้างคอนเทนต์ของชุมชนมีผลลัพธ์จริง (ไม่ใช่ปุ่มเปล่า) และการเผยแพร่/บันทึกร่างเชื่อมข้อมูลไปแสดงในตารางหน้า dashboard จริงผ่าน `localStorage` — จำลอง data flow ข้ามหน้าจอ
- ฟอร์มเผยแพร่ผลงานนิสิตมีการตรวจสอบข้อมูลก่อนส่งจริง และแสดงหน้าจอสำเร็จเมื่อเผยแพร่
