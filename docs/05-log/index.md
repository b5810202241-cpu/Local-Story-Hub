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

