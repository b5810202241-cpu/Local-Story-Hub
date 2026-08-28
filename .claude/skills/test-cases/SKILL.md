---
name: test-cases
description: >
  สร้าง/อัปเดต Test Plan ของ Local Story Hub โดยแปลง Acceptance Criteria ของแต่ละ backlog
  item ที่ปรากฏเป็น step ใน User Journey ให้เป็น test case (Given/When/Then) โดยตรง แล้ว
  regenerate docs/03-testing/01-test-plan/test-plan.md ใช้เมื่อผู้ใช้ขออัปเดต test plan ให้
  ตรงกับ backlog/journey ล่าสุด, สร้าง test case จาก user journey, หรือเช็คว่า test plan ครบ
  ทุก backlog item ที่มี journey รองรับหรือยัง ไม่ใช้สำหรับบันทึกผลทดสอบจริง (ยังไม่มีโค้ดให้
  ทดสอบ)
---

# Test Case Builder

ทักษะนี้แปล Acceptance Criteria ที่มีอยู่แล้วในแต่ละ backlog item ของ Local Story Hub ให้เป็น
test case ที่พร้อมใช้ทดสอบจริง โดย **ไม่แต่งเงื่อนไขการทดสอบใหม่ที่ไม่มีอยู่ใน Acceptance
Criteria เดิม** — งานคือแปลงรูปแบบและ mapping ไม่ใช่คิด test case เพิ่มเอง

`docs/` เป็นส่วนหนึ่งของ Obsidian vault ที่ root ของ repo (`newLinkFormat: relative`,
`useMarkdownLinks: false`) — ทุกลิงก์ต้องเป็น wikilink แบบ relative path เท่านั้น

## เมื่อไรควรมอบงานต่อให้ agent `test-case-builder`

ถ้า backlog/journey มีจำนวนมาก หรือต้องการให้ทำงานแบบแยกบริบท ให้เรียกใช้ผ่าน Agent tool ด้วย
`subagent_type: test-case-builder` แทนการทำตามขั้นตอนด้านล่างเอง ทักษะนี้และ agent ใช้วิธีการ
เดียวกัน

## โครงสร้างไฟล์ผลลัพธ์ (สำคัญ — มี 2 ส่วนที่ปฏิบัติต่างกัน)

`docs/03-testing/01-test-plan/test-plan.md` แบ่งเป็น 2 ส่วน:

1. **"## Test Case จาก Acceptance Criteria"** — **regenerate ทั้งหมดใหม่ทุกครั้งที่รัน** (เป็น
   snapshot คำนวณจาก backlog + journey ปัจจุบันเสมอ) ใช้ ID รูปแบบ `TC-XXX`
2. **"## Test Case เพิ่มเติม (เพิ่มโดยมนุษย์)"** — **ห้ามแตะต้องส่วนนี้เด็ดขาด** ใช้ ID รูปแบบ
   `TC-M-XXX` แยก namespace ไม่ให้ชนกับส่วนที่ 1 — ถ้าไฟล์เดิมมีส่วนนี้อยู่แล้ว ให้คัดลอกมาไว้
   เหมือนเดิมทุกตัวอักษร ถ้ายังไม่มีให้สร้างหัวข้อเปล่าไว้พร้อมคำอธิบายวิธีเพิ่ม

## ขั้นตอน

1. **อ่าน** `docs/01-requirements/03-task/product-backlog.md` ทั้งไฟล์ — ดึง Acceptance
   Criteria (Given/When/Then) และ Priority ของทุก backlog item

2. **อ่าน** User Journey ทุกไฟล์ใน `docs/02-design/01-prototypes/*-journey.md` — หา step ไหน
   อ้างอิงถึง backlog item ใด (ดูจากบรรทัด `FR-x.x` ในคำอธิบายแต่ละ step แล้วจับคู่กับ backlog
   item ที่มี Source อ้างถึง FR เดียวกัน)

3. **สำหรับ backlog item ที่มี step ใน journey อ้างถึง** — แปลงแต่ละ Acceptance Criteria เป็น
   test case 1 รายการ (item ที่มีหลาย AC ให้แตกเป็นหลาย test case):
   ```
   | TC-XXX | {journey ที่มา เช่น "นักท่องเที่ยว step 3"} | {Given...When...Then... คัดลอกจาก
   AC เดิม} | {Priority จาก backlog item} | {BL-XXX} | ยังไม่ทดสอบ | {DRAFT + เหตุผล ถ้า step
   นั้นถูกทำเครื่องหมาย DRAFT ใน journey} |
   ```

4. **สำหรับ backlog item ที่ไม่มี step ใน journey ใดเลย** — ไม่ต้องสร้าง test case ให้ ระบุไว้
   ในหัวข้อ "## Backlog ที่ยังไม่มี Test Case" ท้ายไฟล์พร้อมเหตุผล

5. **เขียนทับเฉพาะส่วน "Test Case จาก Acceptance Criteria"** — ส่วน "Test Case เพิ่มเติม"
   คัดลอกของเดิมมาเก็บไว้เหมือนเดิม (อ่านไฟล์เดิมก่อนเขียนทับเสมอ)

6. เพิ่ม wikilink ไปยัง `test-plan.md` ใน `docs/03-testing/01-test-plan/index.md` ถ้ายังไม่มี

7. เพิ่ม wikilink ระหว่าง `test-plan.md` กับ journey แต่ละไฟล์ที่ใช้ (bidirectional ตามกฎเดิม
   — append เท่านั้น)

## ข้อควรระวัง

- ห้ามแต่งเงื่อนไขการทดสอบที่ไม่มีอยู่ใน Acceptance Criteria เดิม ถ้าคลุมเครือเกินกว่าจะแปลงตรง
  ๆ ได้ ให้ถามผู้ใช้แทนการเดา
- ห้ามแตะต้องหัวข้อ "Test Case เพิ่มเติม (เพิ่มโดยมนุษย์)" ไม่ว่ากรณีใด
- ห้ามแก้ไข Acceptance Criteria ในไฟล์ `product-backlog.md` ต้นทาง — อ่านอย่างเดียว
- เอกสารในโปรเจกต์นี้เขียนเป็นภาษาไทย ให้ผลลัพธ์เป็นภาษาไทยเช่นกัน

## หลังทำงานเสร็จ ให้สรุปให้ผู้ใช้ทราบ

- จำนวน test case ที่สร้าง/อัปเดตในส่วน auto-generated และการเปลี่ยนแปลงจากรอบก่อน
- backlog item ที่ยังไม่มี test case เพราะไม่มีใน journey ใดเลย
- ยืนยันว่าส่วน "Test Case เพิ่มเติม" ไม่ถูกแตะต้อง
