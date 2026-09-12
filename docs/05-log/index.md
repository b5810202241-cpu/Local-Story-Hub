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

### 2026-08-28 — เพิ่ม 3 คู่ agent/skill สำหรับ Technical Design (conceptual) + รวมไฟล์ Database/API เป็นไฟล์เดียว

- เพิ่ม `architecture-designer`/`architecture-design`, `data-api-designer`/`data-api-design`, `detailed-designer`/`detailed-design` — ทั้งหมด conceptual ไม่ผูกมัดกับ technical stack ตามที่ผู้ใช้ขอ
- ผู้ใช้ขอให้รวม Database Schema + API Spec เป็นไฟล์เดียว (`data-api-spec.md`) แทนการแยก 2 ไฟล์ — แก้ agent/skill ของคู่นั้นและ reference ใน `detailed-designer`/`detailed-design` ให้ตรงกันแล้ว ส่วน Architecture (High-Level Design) ยังคงแยกไฟล์ต่างหากตามที่ขอ

### 2026-08-28 — รัน architecture-designer ครั้งแรก สร้าง architecture.md

- ก่อนวาด data flow พบจุดตัดสินใจเชิงสถาปัตยกรรมที่ไม่มีคำตอบในสเปค (ไม่ใช่ Open Question ที่มีอยู่แล้ว) — ถามผู้ใช้ตามหลักการของ agent (≥3 ทางเลือกพร้อมข้อดี/ข้อเสีย): AI Content Service ควรเป็น Synchronous, Asynchronous ผ่านคิว, หรือ Hybrid — ผู้ใช้เลือก **Synchronous** เพราะสอดคล้องกับ [[../02-design/01-prototypes/prototype-v1/README|prototype-v1]] ที่ออกแบบไว้แล้ว
- ประเมิน Open Questions ทั้ง 14 ข้อใน [[../01-requirements/03-task/open-questions|open-questions]] แล้วพบว่าไม่มีข้อไหนบล็อกการออกแบบ conceptual ได้ (ออกแบบ component แบบกลาง ๆ ได้โดยไม่ต้องรู้คำตอบ) จึงไม่หยุดถามเพิ่ม แต่ระบุเป็นหมายเหตุ "Open Items" ไว้ในเอกสารแทน
- สร้าง [[../02-design/02-technical/architecture|02-technical/architecture]]: ระบุ 6 component หลัก + data flow (Mermaid) ตาม User Journey ทั้ง 3 เส้นทาง + Decision Log + Open Items ที่กระทบสถาปัตยกรรมในอนาคต
- เพิ่ม wikilink สองทางกับ spec ทั้ง 2 ไฟล์และ journey ทั้ง 3 ไฟล์แล้ว

### 2026-08-28 — รัน data-api-designer ครั้งแรก สร้าง data-api-spec.md

- ก่อนออกแบบ entity พบจุดตัดสินใจเชิงโครงสร้างข้อมูลที่ไม่มีคำตอบในสเปค — ถามผู้ใช้ (≥3 ทางเลือกพร้อมข้อดี/ข้อเสีย): นักท่องเที่ยวต้องมีบัญชีผู้ใช้ (login) หรือไม่สำหรับเขียนรีวิว/บันทึกสถานที่โปรด — ผู้ใช้เลือก **ต้องมีบัญชีเต็มรูปแบบ** (ไม่ใช่ตัวเลือกที่แนะนำไว้ซึ่งคือแบบไม่มีบัญชี)
- **ผลกระทบสำคัญ**: [[../02-design/01-prototypes/prototype-v1/README|prototype-v1]] ฝั่งนักท่องเที่ยวออกแบบไว้แบบไม่มี login (ใช้ `localStorage`) จึงไม่ตรงกับการตัดสินใจนี้อีกต่อไป — ยังไม่ได้แก้ไข prototype ในรอบนี้ บันทึกไว้เป็นรายการที่ต้องตามแก้ทั้งใน `data-api-spec.md` และที่นี่
- สร้าง [[../02-design/02-technical/data-api-spec|02-technical/data-api-spec]]: 8 entity (UserAccount แบบรวม role เดียวแทนการแยก 3 entity, Community, Content, Review, Bookmark, StudentWork, ConsentRecord, AccessLog) พร้อม ER Diagram (Mermaid) และ API operation ครบทุก feature หลัก
- เพิ่ม wikilink สองทางกับ architecture.md และ spec ทั้ง 2 ไฟล์แล้ว

### 2026-08-28 — รัน detailed-designer ครั้งแรก สร้าง detailed-design.md (ครบทั้ง 3 คู่ Technical Design)

- ก่อนวาด sequence ของ flow ที่ใช้ AI พบจุดพฤติกรรมระบบที่ไม่มีคำตอบในสเปคอีกจุด — ถามผู้ใช้ (≥3 ทางเลือกพร้อมข้อดี/ข้อเสีย): ถ้า AI ประมวลผลไม่สำเร็จควรทำอย่างไร — ผู้ใช้เลือก **แจ้ง error ทันที ให้ผู้ใช้กดลองใหม่เอง** (ไม่ retry อัตโนมัติ)
- สร้าง [[../02-design/02-technical/detailed-design|02-technical/detailed-design]]: 6 sequence diagram (Mermaid) ครอบคลุม Consent flow, ค้นหา/อ่านเรื่องราว, เขียนรีวิว, AI ปรับภาพ (พร้อม error handling), เผยแพร่คอนเทนต์ชุมชน, เผยแพร่ผลงานนิสิต — แต่ละ sequence map กลับ journey step/FR/API operation
- ยืนยันความไม่สอดคล้องเรื่อง login นักท่องเที่ยวอีกครั้ง (sequence #3 ออกแบบให้ต้อง login ตาม data-api-spec แต่ journey/prototype เดิมยังไม่มี) — เพิ่มคำเตือนไว้ในเอกสารและ wikilink ของ tourist-journey ให้เห็นชัดเจน ยังไม่ได้แก้ไข journey/prototype ในรอบนี้
- เพิ่ม wikilink สองทางกับ architecture.md, data-api-spec.md และ journey ทั้ง 3 ไฟล์แล้ว — **ครบทั้ง 3 เอกสารในกลุ่ม Technical Design (conceptual) ตามที่ผู้ใช้ขอไว้**

### 2026-08-28 — รวม architecture.md + data-api-spec.md เป็นไฟล์เดียว (ภาพรวมระบบ)

- ผู้ใช้ขอให้ High-Level Design มี "ภาพใหญ่ไว้ใช้ในระบบ 1 ไฟล์" รวมถึง database schema และ api spec ด้วย — ย้อนกลับการตัดสินใจแยกไฟล์เมื่อก่อนหน้านี้ในวันเดียวกัน
- รวมเนื้อหาทั้งหมดของ [[../02-design/02-technical/architecture|02-technical/architecture]] (เดิม) และ `data-api-spec.md` (เดิม) เข้าเป็นไฟล์เดียว — ลบ `data-api-spec.md` ทิ้ง (ประวัติยังอยู่ใน git) แก้ไข wikilink ทุกจุดที่เคยชี้ไปยัง `data-api-spec.md` ให้ชี้มาที่ `architecture.md` แทน (detailed-design.md, 02-technical/index.md, local-story-hub.md, 20260822-01-it-log-pdpa-consent.md) — ยกเว้นบรรทัดใน Decision Log และ log รายการก่อนหน้าที่เป็นบันทึกประวัติ ไม่แก้ย้อนหลัง
- ปรับปรุง `architecture-designer`/`architecture-design` และ `data-api-designer`/`data-api-design` ให้ทั้งสองคู่แก้ไฟล์ `architecture.md` ไฟล์เดียวกัน คนละหัวข้อ (อ่านทั้งไฟล์ก่อนแก้เสมอ ห้ามแตะหัวข้อของอีกฝ่าย) และแก้ reference ใน `detailed-designer`/`detailed-design` ให้ตรงกัน
- อัปเดต `CLAUDE.md` ให้สะท้อนโครงสร้างใหม่ (2 คู่ agent/skill ใช้ไฟล์เดียวกัน + detailed-design แยกไฟล์ต่างหาก)

### 2026-09-04 — กลับคำตัดสินใจ: ผลงานนิสิตต้องผ่านการอนุมัติจากอาจารย์ก่อนเผยแพร่

- ผู้ใช้แก้ไข Business Rule ที่เคยยืนยันปิดไปแล้วเมื่อ 2026-08-22 ("เผยแพร่ทันทีไม่ต้องอนุมัติ") กลับเป็น **ต้องได้รับการอนุมัติจากอาจารย์ (ในฐานะผู้ดูแลระบบ) ก่อนเผยแพร่เสมอ** — เก็บประวัติการกลับคำตัดสินใจไว้ในข้อความแทนการลบทิ้ง ตามธรรมเนียมของโปรเจกต์
- ไล่แก้ทุกชั้นเอกสารตามลำดับ dependency เพื่อให้สอดคล้องกันทั้งหมด:
  1. [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] — แก้ Business Rules ของ FR-3.1 พร้อมระบุว่าเป็นการกลับคำตัดสินใจจากวันที่ 2026-08-22
  2. [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — แก้ AC ของ BL-013 ให้ระบุว่า supersede แล้ว และเพิ่ม **BL-018** (User Story ใหม่: อาจารย์ตรวจสอบและอนุมัติ/ไม่อนุมัติผลงานนิสิต) พร้อม AC แบบ Given/When/Then สำหรับเส้นทางอนุมัติและไม่อนุมัติ — priority Must
  3. [[../02-design/01-prototypes/student-content-journey|02-design/01-prototypes/student-content-journey]] — วาด diagram ใหม่ เพิ่มเส้นทางอนุมัติ/ไม่อนุมัติ/แก้ไขส่งใหม่ (loop กลับ)
  4. [[../02-design/01-prototypes/prototype-v1/README|02-design/01-prototypes/prototype-v1]] (`student-publish.html`) — แก้ข้อความ/ปุ่ม/หน้าจอสำเร็จให้สะท้อนว่าเป็นการ "ส่งขออนุมัติ" ไม่ใช่เผยแพร่ทันที (ยังไม่มีหน้าจอฝั่งอาจารย์สำหรับอนุมัติ/ไม่อนุมัติในเวอร์ชันนี้)
  5. [[../03-testing/01-test-plan/test-plan|03-testing/01-test-plan/test-plan]] — แก้ TC-017 ให้ตรงกับ flow ใหม่ เพิ่ม TC-019/TC-020 (กรณีอนุมัติ/ไม่อนุมัติ) รวมเป็น 20 test case จาก 14 backlog item
  6. [[../02-design/02-technical/architecture|02-design/02-technical/architecture]] — แก้ Data Flow diagram ของนิสิต, เพิ่ม role=admin ใน UserAccount, เพิ่ม field `reviewer_id`/`rejection_reason` และปรับ `status` ของ StudentWork เป็น pending_approval/published/rejected, เพิ่ม API operation อนุมัติ/ไม่อนุมัติ, เพิ่ม Decision Log entry และ Open Item ใหม่ (จำนวนครั้งที่ส่งใหม่ได้)
  7. [[../02-design/02-technical/detailed-design|02-design/02-technical/detailed-design]] — ออกแบบ Sequence #6 ใหม่ทั้งหมดให้มี alt อนุมัติ/ไม่อนุมัติ พร้อม actor อาจารย์ (role=admin)
- Open Question ที่ยังไม่ปิดจากการเปลี่ยนแปลงนี้: จำนวนครั้งที่นิสิตแก้ไขและส่งผลงานใหม่ได้หลังไม่ผ่านอนุมัติ (สมมติไว้ก่อนว่าไม่จำกัดครั้ง) — ควรยืนยันกับอาจารย์ที่ปรึกษาในภายหลัง

### 2026-09-04 — เพิ่มหน้าจอ "อาจารย์อนุมัติ/ไม่อนุมัติผลงานนิสิต" ใน Prototype v1

- ผู้ใช้ขอเพิ่ม prototype ฝั่งอาจารย์ต่อจากการกลับคำตัดสินใจเรื่องอนุมัติผลงานนิสิตข้างต้น — ถามผู้ใช้ก่อนตามกฎบังคับของ `prototype-builder` ว่าจะแก้ `prototype-v1/` เดิมหรือสร้าง `prototype-v2/` ใหม่ ผู้ใช้เลือก **แก้ไข prototype-v1 เดิม**
- สร้าง `admin-review-student-work.html` ในโฟลเดอร์ [[../02-design/01-prototypes/prototype-v1/README|prototype-v1]]: อาจารย์เห็นรายการผลงานรออนุมัติ (พร้อมข้อมูลตัวอย่างตั้งต้น) กดอนุมัติได้ทันที หรือกดไม่อนุมัติซึ่งบังคับกรอกเหตุผลก่อนยืนยัน แล้วย้ายไปตาราง "ประวัติการตรวจสอบ" — อ้างอิง FR-3.1, BL-018
- แก้ `student-publish.html` ให้บันทึกผลงานที่ส่งเข้าคีย์ `localStorage` เดียวกัน (`lsh_student_works`) แทนที่จะเป็นแค่ข้อความสำเร็จลอย ๆ เพื่อให้ข้อมูลไหลข้ามหน้าไปยัง `admin-review-student-work.html` ได้จริง (จำลอง data flow ของ sequence #6 ใน [[../02-design/02-technical/detailed-design|detailed-design]]) — เพิ่มลิงก์นำทาง "มุมมองอาจารย์ (ตัวอย่าง)" ในหน้านี้ด้วย
- อัปเดต `prototype-v1/README.md` และ `student-content-journey.md` ให้ชี้ไปยังหน้าจอใหม่ — จุดที่ยังเป็น DRAFT: จำนวนครั้งที่ส่งใหม่ได้หลังไม่ผ่านอนุมัติ (Open Question เดิม ยังไม่ปิด)

### 2026-09-11 — เทียบ schema จริงใน Firestore กับ StudentWork และลบ ContentTypes ที่ไม่มีที่มาจาก requirement

- ผู้ใช้ขอ "รวม" schema ของ Firestore ที่ seed ไว้จริง (`users`, `LSHRequests` ใน `LSH/scripts/seed-firestore.js`) เข้ากับ entity เชิงแนวคิด `StudentWork`/`UserAccount` ใน [[../02-design/02-technical/architecture|02-technical/architecture]] — ทั้งสองฝั่ง field/ภาษา/status ไม่ตรงกันเลย และ `ContentTypes` (VOD/album photo/Storytelling) ไม่มีที่มาจาก requirement/backlog/journey ใดๆ เลย จึงหยุดถามผู้ใช้ก่อนตามกฎของ `data-api-design` (ห้ามเดาโครงสร้างข้อมูล/ห้ามสร้าง entity ที่ไม่มีที่มา):
  1. **ทิศทางการรวม schema** — เสนอ 3 ทาง (ยึด Firestore เป็นหลัก / ยึด schema เชิงแนวคิดเป็นหลัก / ไม่รวมจริงแค่ทำตาราง mapping) ผู้ใช้เลือก **ไม่รวมจริง แค่ทำตาราง mapping** — คงทั้งสอง schema แยกกันตามเดิม
  2. **`ContentTypes`** — เสนอ 3 ทาง (เพิ่มเป็น entity ทางการพร้อมหมายเหตุ / ไม่เพิ่มเข้าสคีมาเชิงแนวคิด / ใส่เป็น Open Item รอ requirement) ผู้ใช้เลือก **เอาออกทั้งหมด** แล้วถามต่อว่า "ออกเลย" หมายถึงแค่เอกสารหรือรวม Firestore จริงด้วย — ผู้ใช้ยืนยัน **ลบทั้งหมด รวม Firestore จริงด้วย**
- ผลจากการตัดสินใจ:
  - ลบ collection `ContentTypes` (3 เอกสาร: ct001–ct003) ออกจาก Firestore project `lsh-nammon` จริง และลบ field `LSHTypeId`/`LSHTypeName` ออกจากทุกเอกสารใน `LSHRequests` (5 เอกสาร) ด้วยสคริปต์ one-off ที่ลบทิ้งหลังใช้งานเสร็จ (ไม่ commit เข้า repo)
  - แก้ `LSH/scripts/seed-firestore.js` ให้ไม่สร้าง `ContentTypes`/`LSHTypeId`/`LSHTypeName` อีกต่อไป (กันไม่ให้ re-seed แล้วข้อมูลกลับมา)
  - เพิ่มหัวข้อ "Mapping กับข้อมูลจริงใน Firestore" ต่อท้าย Database Schema ใน [[../02-design/02-technical/architecture|02-technical/architecture]] — ตาราง field-by-field เทียบ `users`/`LSHRequests` กับ `UserAccount`/`StudentWork` พร้อมระบุจุดต่าง (denormalized vs reference, ภาษาไทย vs อังกฤษ) และหมายเหตุว่ายังไม่ตัดสินใจว่าจะยึดฝั่งไหนตอน implement จริง
  - อัปเดต [[../../CLAUDE|CLAUDE.md]] (root) ให้ตรงกับสถานะใหม่ (ตัด `ContentTypes` ออกจากรายการ collection จริง, ปรับคำเตือนเรื่อง schema ไม่ตรงกันให้ชี้ไปที่ตาราง mapping นี้แทน)
- Open Item ที่ยังไม่ปิด: ยังไม่ตัดสินใจว่า schema ที่จะใช้ตอน implement จริงจะยึดฝั่ง Firestore ปัจจุบันหรือ `StudentWork` เชิงแนวคิด — ต้องถามผู้ใช้ก่อนเสมอเมื่อมีงานที่ต้องเลือกจริงจัง

### 2026-09-11 — กลับคำตัดสินใจ: คง ContentTypes ไว้ตามเดิม ไม่ลบ

- ผู้ใช้เปลี่ยนใจจากการตัดสินใจข้างต้นในวันเดียวกัน — ขอให้ **คง `ContentTypes` ไว้เหมือนเดิม ไม่ต้องลบแล้ว**
- คืนค่าทุกอย่างกลับสู่สถานะก่อนลบ:
  - คืน collection `ContentTypes` (3 เอกสาร: ct001–ct003) กลับเข้า Firestore project `lsh-nammon` และคืน field `LSHTypeId`/`LSHTypeName` ให้ `LSHRequests` ทั้ง 5 เอกสารเหมือนเดิมทุกประการ (ด้วยสคริปต์ one-off อีกครั้ง ลบทิ้งหลังใช้งานเสร็จ ไม่ commit เข้า repo)
  - แก้ `LSH/scripts/seed-firestore.js` กลับให้สร้าง `ContentTypes`/`LSHTypeId`/`LSHTypeName` เหมือนเดิม
  - แก้ [[../02-design/02-technical/architecture|02-technical/architecture]] หัวข้อ "Mapping กับข้อมูลจริงใน Firestore" ให้ตรงกับความจริงใหม่ (ไม่ใช่ "ถูกลบ" อีกต่อไป แต่ยังคงหมายเหตุเดิมไว้ว่าไม่มีที่มาจาก requirement — แค่ยังไม่ลบเท่านั้น)
  - แก้ [[../../CLAUDE|CLAUDE.md]] (root) ให้ตรงกับสถานะใหม่เช่นกัน
- Open Item เดิมยังคงอยู่เหมือนเดิม: `ContentTypes` ยังไม่มีที่มาจาก requirement/backlog ใดๆ เลย แค่ผู้ใช้เลือกคงไว้ในเชิงข้อมูลไปก่อน ไม่ใช่การตัดสินใจว่าฟีเจอร์นี้ผ่านการอนุมัติแล้ว

### 2026-09-11 — เชื่อม student-publish.html เข้ากับ Firestore จริง (สร้าง prototype-v2)

- ผู้ใช้ขอให้ฟอร์ม `student-publish.html` บันทึกลง Firestore จริงแทน `localStorage`, ตั้งสถานะเริ่มต้นเป็น `รอพิจารณา`, แล้วนำทางกลับไปหน้ารายการ — ขอดูแผนก่อนตามธรรมเนียม แล้วถามคำถามที่จำเป็นก่อนลงมือ:
  1. **หน้ารายการปลายทาง** — เสนอ `admin-review-student-work.html` (หน้าเดียวที่มีอยู่ที่ตรงกับ `LSHRequests`) แต่พบว่าหน้านั้นยังอ่านจาก `localStorage` คนละ schema กับ `LSHRequests` เลย จึงถามต่อว่าจะแก้ให้อ่าน Firestore ด้วยหรือไม่ — ผู้ใช้เลือก **แก้ให้อ่านจาก Firestore ด้วย** เพื่อให้ flow ทำงานจริงครบวงจร
  2. **Prototype version** — ตามกฎบังคับของ `prototype-builder` (มี version เดิมอยู่แล้วต้องถามเสมอ) ผู้ใช้เลือก **สร้าง `prototype-v2/` ใหม่** ไม่แก้ `prototype-v1` เดิม
  3. **วิธีระบุตัวผู้ส่ง** — เสนอช่องกรอกชื่อ + generate id ชั่วคราว (ยังไม่มีระบบ login) ผู้ใช้ขอให้เปลี่ยนเป็น **เลือกจากรายชื่อผู้ใช้จริงใน Firestore แทน** (dropdown ดึงจาก `users` ที่ `role == student`)
- สร้าง [[../02-design/01-prototypes/prototype-v2/README|02-design/01-prototypes/prototype-v2]] พร้อม 2 หน้าจอใหม่:
  - `student-publish.html` — เพิ่ม Firebase JS SDK (CDN, modular), dropdown เลือกผู้ส่งจาก `users` แบบสด, เขียนเอกสารใหม่ลง `LSHRequests` (`title`, `Content`, `community`, `status: 'รอพิจารณา'`, `requesterId`, `requesterName`, `approverId/approverName: null`, `createdAt: serverTimestamp()`) แล้ว redirect ไป `admin-review-student-work.html` ทันทีเมื่อสำเร็จ (ไม่ค้าง success panel เหมือน v1)
  - `admin-review-student-work.html` — อ่าน `LSHRequests` แบบ real-time (`onSnapshot`), ปุ่มอนุมัติ/ไม่อนุมัติ update สถานะ Firestore จริง (`อนุมัติ`/`ไม่อนุมัติ`) พร้อม `approverId/approverName` hardcode เป็นบัญชีตัวอย่าง `u004` (ยังไม่มีระบบ login), ไม่อนุมัติบันทึก `rejectionReason` ด้วย
  - เพิ่ม field ใหม่ 2 ตัวเข้า `LSHRequests` ที่ไม่มีในเอกสารเดิม: `community` (มีที่มาจากฟอร์ม/FR-3.1 อยู่แล้ว แค่ schema เดิมไม่มี field นี้) และ `rejectionReason` (มีอยู่แล้วใน UI ของ v1 แต่ไม่เคยเก็บลง Firestore) — บันทึกไว้ใน [[../02-design/02-technical/architecture|02-technical/architecture]] ตาราง Mapping และใน [[../../CLAUDE|CLAUDE.md]] ด้วย
- **ทดสอบจริงผ่าน Browser** ก่อนสรุปงาน: รัน static server ชี้ไปที่ `prototype-v2/`, กรอกฟอร์มจริง 1 รายการ → เห็นขึ้นในหน้า admin แบบ real-time ทันที → กดอนุมัติสำเร็จ → ทดสอบกดไม่อนุมัติกับอีกรายการ (คืนสถานะกลับเป็นเดิมหลังทดสอบเสร็จผ่านสคริปต์ one-off ที่ลบทิ้งแล้ว ไม่ commit เข้า repo) — Firestore กลับสู่สถานะ 3 รอพิจารณา/1 อนุมัติ/1 ไม่อนุมัติเหมือนก่อนทดสอบทุกประการ
- Open Item ที่ยังไม่ปิด: ยืนยันด้วยตนเองว่า Firestore security rules ของ `lsh-nammon` ตอนนี้เป็นโหมดทดสอบ เปิด read/write ให้ทุกคนจนถึง 2026-10-04 — ยังไม่ได้แก้ในรอบนี้ (แจ้งผู้ใช้ไว้แล้วว่าเป็นความเสี่ยงถ้าจะใช้งานต่อหลังจากนั้น)

### 2026-09-11 — เพิ่ม ACL.md: ตารางสิทธิ์บทบาทนิสิต/อาจารย์

- ผู้ใช้ขอตารางสิทธิ์ (บทบาท/ทำได้/ทำไม่ได้) สำหรับ 2 บทบาท: อาจารย์ (พิจารณา/อนุมัติ/ไม่อนุมัติ) และนิสิต (ลงผลงานคอนเทนต์)
- สร้าง [[../02-design/02-technical/ACL|02-technical/ACL]] อ้างอิงจาก FR-3.1, BL-018, และ entity `StudentWork`/`UserAccount` ใน [[../02-design/02-technical/architecture|02-technical/architecture]] — ระบุชัดว่าครอบคลุมเฉพาะ flow ตรวจสอบผลงานนิสิต ไม่รวมบทบาทชุมชน/นักท่องเที่ยว (ยังติด Open Question เรื่องสิทธิ์การเข้าถึงของแต่ละชุมชน)
- เพิ่มหัวข้อ "ข้อสันนิษฐาน" (จำนวนครั้งส่งผลงานใหม่ไม่จำกัด) และ "คำถามที่ยังไม่มีคำตอบ" (แก้ไข/ลบผลงานก่อนอนุมัติ, อาจารย์แก้เนื้อหาแทนนิสิตได้ไหม) แทนการเดา ตามธรรมเนียมโปรเจกต์
- เพิ่ม wikilink สองทางกับ [[../02-design/02-technical/index|02-technical/index]] และ [[../02-design/02-technical/architecture|architecture.md]] (หัวข้อประเด็นข้ามระบบ)

### 2026-09-11 — เพิ่ม Firebase Authentication จริง + บังคับ ACL.md ด้วย Security Rules

- ผู้ใช้ขอให้อ่าน `ACL.md` แล้วจำกัดปุ่ม/เมนูบนหน้าจอตามตาราง โดยอ่าน role ของคนที่ login อยู่ — ขอดูแผนก่อนตามธรรมเนียม แล้วถามคำถามที่จำเป็นก่อนลงมือ (ยังไม่มีระบบ login ใดๆ ในระบบเลยตอนนั้น):
  1. **วิธีจำลอง "คนที่ login อยู่"** — เสนอ 2 ทาง (จำลอง login เฉยๆ ด้วย dropgin เดิม vs ทำ Firebase Authentication จริง) ผู้ใช้เลือก **ทำ Firebase Authentication จริง** (แม้ขอบเขตใหญ่กว่า)
  2. **Prototype version** — ตามกฎบังคับ ผู้ใช้เลือก **แก้ prototype-v2 เดิม** ไม่สร้าง v3
  3. **Firestore Security Rules บังคับจริงด้วยไหม** (ไม่ใช่แค่ซ่อนปุ่ม) — ผู้ใช้เห็นด้วยให้ทำ
- ดำเนินการ:
  1. เปิด **Email/Password sign-in provider** ให้ `lsh-nammon` ผ่าน Identity Toolkit Admin API (ใช้ service account, ไม่ต้องเข้า Console เอง)
  2. สร้างบัญชี Firebase Auth จริงให้ 4 user ที่ seed ไว้ (u001-u004) โดยตั้ง `uid` ให้ตรงกับ doc id ใน `users` collection พอดี เพื่อ lookup role ง่าย — รหัสผ่านสาธิตกลาง (ไม่บันทึกค่าไว้ในไฟล์นี้ เพราะจะถูก push ขึ้น public repo)
  3. เพิ่มหน้า login (email+password) ในทั้ง `student-publish.html` และ `admin-review-student-work.html` (v2) — หลัง login อ่าน role จาก `users/{uid}` แล้วซ่อนฟอร์ม/ปุ่ม/เมนูตาม `ACL.md`: นิสิตไม่เห็นปุ่มอนุมัติ/ไม่อนุมัติ, อาจารย์ไม่เห็นฟอร์มส่งผลงาน, ลิงก์ข้ามหน้าซ่อนเมื่อ role ไม่ตรง — เอา dropdown "เลือกผู้ส่ง" เดิมออก ใช้ตัวตนจาก login แทน
  4. เขียน `LSH/firestore.rules` ใหม่ (แทนโหมดทดสอบเดิมที่เปิดทุกอย่างถึง 2026-10-04) บังคับ role-based access จริง แล้ว deploy ผ่าน `admin.securityRules().releaseFirestoreRulesetFromSource()` (ไม่มี `firebase.json` ในโปรเจกต์ เลยไม่ใช้ `firebase deploy`)
  5. **เจอบั๊กระหว่างทดสอบ**: seed data จริงใช้ `role: "teacher"` สำหรับอาจารย์ แต่โค้ด/rules ที่เขียนครั้งแรกเช็คกับ `role: "admin"` (ตามชื่อ entity เชิงแนวคิด) ทำให้อาจารย์ login แล้วเจอ deny-view ผิด — แก้ทั้งโค้ด client และ rules ให้เช็ค `teacher` ตามของจริง แล้ว redeploy rules ใหม่
  6. **เจอข้อมูลทดสอบเพี้ยนระหว่างทดสอบ**: พบว่ามีแท็บเบราว์เซอร์ค้าง (auto-preview จากการแก้ไฟล์ก่อนหน้า) รันโค้ดเวอร์ชันเก่า (ก่อนมี login, hardcode ผู้อนุมัติ) อยู่เบื้องหลัง ทำให้มีการอนุมัติผลงานเกิดขึ้นเองโดยไม่ได้ตั้งใจ 2 ครั้ง (req003 และ test doc อีก 1 รายการ) — ปิดแท็บที่ค้าง แก้ข้อมูลกลับให้ถูกต้อง แล้วตรวจสอบซ้ำจนแน่ใจว่า Firestore กลับสู่สถานะเดิม (3 รอพิจารณา/1 อนุมัติ/1 ไม่อนุมัติ)
- **ทดสอบยืนยันการบังคับใช้จริงผ่าน browser console** (ข้าม UI ไปเลย ไม่ใช่แค่เช็คว่าปุ่มถูกซ่อน): (1) นิสิตพยายามอนุมัติงานตรงๆ → `permission-denied`, (2) นิสิตพยายามส่งงานสวมรอยเป็นคนอื่น (`requesterId` ไม่ตรง `uid`) → `permission-denied`, (3) ไม่ login แล้วพยายามอ่าน `LSHRequests` → `permission-denied` — ครบทั้ง 3 กรณีตามที่ออกแบบไว้
- อัปเดตเอกสาร: [[../02-design/01-prototypes/prototype-v2/README|02-design/01-prototypes/prototype-v2/README]] (รายละเอียด login + รหัสผ่านสาธิต + rules), [[../02-design/02-technical/ACL|02-technical/ACL]] (ระบุว่าบังคับใช้จริงแล้วทั้ง UI และ backend, แก้ label role อาจารย์เป็น `teacher`), [[../../CLAUDE|CLAUDE.md]] (หัวข้อใหม่ Firebase Authentication + Security Rules)
- **แก้ไขความผิดพลาดของตัวเอง**: ใส่รหัสผ่านสาธิตจริง ๆ ลงในไฟล์ที่เตรียม push จริงๆ (README.md, CLAUDE.md, log นี้) ซึ่งขัดกับกฎ "ห้ามใส่คีย์/ความลับลงในไฟล์ที่ push" ที่ตัวเองเพิ่งเพิ่มไว้ก่อนหน้า — ผู้ใช้ทักท้วง ถามกลับแล้วลบค่ารหัสผ่านออกจากทุกไฟล์ที่จะ commit ก่อน push (แทนที่ด้วยข้อความ "ดูจากผู้ดูแลระบบ") บันทึกค่าจริงไว้ใน memory ส่วนตัวแทน — ยืนยันด้วย `grep` ทั้ง repo ว่าไม่มีค่ารหัสผ่านหลงเหลือก่อน commit จริง
- ต่อมาผู้ใช้ขอเก็บรหัสผ่านนี้ไว้ในเครื่องด้วย (ไม่ใช่แค่ memory) — สร้าง `LSH/DEMO_CREDENTIALS.md` (ไม่ commit ขึ้น git) พร้อมเพิ่ม `DEMO_CREDENTIALS.md` เข้า `LSH/.gitignore`
- เพิ่ม Open Item ใหม่ (ข้อ 9) ใน [[../02-design/02-technical/architecture|02-design/02-technical/architecture]] § Open Items: ต้องลบบัญชี Auth สาธิตทั้งหมดและตัดสินใจวิธี login จริง ก่อนขึ้นระบบจริง — ผู้ใช้ขอให้บันทึกไว้กันลืมหลังถามว่าต้องยกเลิกรหัส demo ไหมตอนระบบเสร็จจริง

### 2026-09-12 — เพิ่ม requirement เรื่องการอนุมัติบัญชีผู้ใช้ใหม่ (requirement-intake)

- ผู้ใช้ตอบคำถามเปิด (Open Item #9 ใน architecture.md เรื่องวิธี login จริงก่อนขึ้นระบบจริง) ว่า: "ให้อาจารย์ที่ปรึกษาเป็นผู้อนุมัติบัญชีใหม่ที่สมัครก่อนถึงจะล็อกอินได้" — เรียกใช้ `requirement-intake` skill ทำ Phase 1+2 ต่อเนื่องกันตามธรรมเนียมโปรเจกต์
- **Phase 1**: สร้าง [[../01-requirements/01-spec/20260912-01-account-registration-approval|01-spec/20260912-01-account-registration-approval]] — list ไฟล์ spec เดิมก่อนแล้วพบว่าไม่มีเรื่องนี้มาก่อน (ไม่ต้องถามเรื่อง update ไฟล์เดิม) รันคำสั่งหาวันที่จริง (`20260912`) ตามกฎตั้งชื่อไฟล์ เพิ่ม wikilink เข้า `01-spec/index.md` แล้ว
- **Phase 2**: แตกเป็น 2 backlog item ใหม่ใน Epic ใหม่ "การจัดการบัญชีผู้ใช้ (Account Management)" ที่ [[../01-requirements/03-task/product-backlog|03-task/product-backlog]]: **BL-019** (นิสิตสมัครบัญชีเอง สถานะเริ่มต้น "รออนุมัติ") และ **BL-020** (อาจารย์อนุมัติ/ไม่อนุมัติบัญชีใหม่) ทั้งคู่ Priority Must เพราะเป็นเงื่อนไขบังคับก่อนใช้งานระบบจริงได้เลย — เพิ่มเหตุผลไว้ในหัวข้อ "ข้อสันนิษฐาน" ด้วย
- Open Questions ที่พบในสเปคใหม่ (ยังไม่ได้เดาคำตอบ) — **ทุกข้อควรถามอาจารย์ที่ปรึกษา**: (1) เปิดสมัครเฉพาะ role นิสิตหรือทั้งสอง role, (2) ถ้าไม่อนุมัติจะเกิดอะไรกับบัญชี (ลบ/แจ้งเหตุผล/ค้างไว้), (3) อาจารย์ทราบว่ามีบัญชีใหม่รออนุมัติอย่างไร, (4) ต้องใช้ข้อมูลอะไรยืนยันตัวตนตอนสมัครเพื่อกันมิจฉาชีพแอบอ้าง — ยังไม่ได้ลงมือ implement ใดๆ ในรอบนี้ รอคำตอบ Open Questions ก่อนตามกฎ pipeline ของโปรเจกต์

### 2026-09-12 — ปิด Open Questions เรื่องการอนุมัติบัญชีผู้ใช้ใหม่

ผู้ใช้ตอบ Open Question ทั้ง 4 ข้อจากรายการข้างต้นในวันเดียวกัน:
1. เปิดสมัครเองเฉพาะ role นิสิต (คำตอบเป็นข้อความสั้น "เปิดสมัครเฉพาะ role" — ตีความตามสมมติฐานเดิมในสเปค ระบุหมายเหตุไว้ในเอกสารให้ผู้ใช้ตรวจสอบซ้ำหากตีความผิด)
2. บัญชีที่ไม่อนุมัติ → login ไม่ได้, แจ้งเหตุผลกลับ, ต้องสมัครบัญชีใหม่เท่านั้น (เป็นสถานะสิ้นสุด ไม่มีแก้ไข/ส่งซ้ำบัญชีเดิม)
3. อาจารย์ทราบผ่านการแจ้งเตือน (ช่องทางที่ใช้จริงยังไม่ระบุ — ลดระดับเหลือเป็นรายละเอียดเชิงเทคนิคที่ตัดสินใจได้ตอน design ไม่ต้องถามอาจารย์ที่ปรึกษาเพิ่ม)
4. ข้อมูลที่ต้องกรอกตอนสมัคร: ชื่อ-นามสกุล, **รหัสนิสิต** (field ใหม่ที่ยังไม่มีใน `users` collection ปัจจุบัน), อีเมล, รหัสผ่าน
- อัปเดต [[../01-requirements/01-spec/20260912-01-account-registration-approval|01-spec/20260912-01-account-registration-approval]]: ย้าย Open Question ทั้ง 4 ข้อไปเป็น Functional Requirements/Business Rules พร้อมวันที่กำกับ เหลือ Open Question ใหม่ 1 ข้อ (ช่องทางแจ้งเตือน) ที่ไม่กระทบ scope ใหญ่แล้ว
- อัปเดต **BL-019**/**BL-020** ใน [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] ให้ตรงกับรายละเอียดที่ปิดแล้ว (เพิ่ม Acceptance Criteria กรณีบัญชีถูกปฏิเสธ, เพิ่ม field รหัสนิสิต, เพิ่มการแจ้งเตือนอาจารย์)
- ยังไม่ได้ลงมือ implement/design ใดๆ ในรอบนี้ — รอผู้ใช้สั่งขั้นต่อไป

### 2026-09-12 — ปิด Open Question สุดท้าย: ตัด field รหัสนิสิต, ใช้อีเมลแจ้งเตือนอาจารย์

- ผู้ใช้ยืนยันการตีความ "เฉพาะนิสิต" ถูกต้อง แล้วตอบ 2 เรื่องที่ค้างอยู่: (1) **ตัด field รหัสนิสิตออกจากฟอร์มสมัคร** — เหลือแค่ ชื่อ-นามสกุล/อีเมล/รหัสผ่าน ไม่ต้องเพิ่ม field ใหม่ใน `users` collection แล้ว (2) **ช่องทางแจ้งเตือนอาจารย์ = อีเมล**
- อัปเดต [[../01-requirements/01-spec/20260912-01-account-registration-approval|01-spec/20260912-01-account-registration-approval]]: เอา `รหัสนิสิต` ออกจาก FR-1, ระบุ FR-3 ว่าแจ้งเตือนทางอีเมล, ปิดหัวข้อ Open Questions ทั้งหมด (ไม่เหลือค้างแล้ว)
- อัปเดต **BL-019** (เอา field รหัสนิสิตออกจาก Acceptance Criteria) และ **BL-020** (ระบุว่าแจ้งเตือนทางอีเมล) ใน [[../01-requirements/03-task/product-backlog|03-task/product-backlog]]
- สเปคนี้ปิด Open Question ครบทุกข้อแล้ว พร้อมไปขั้น design/implement ได้เต็มที่ — ยังไม่ได้ลงมือในรอบนี้ รอผู้ใช้สั่ง
