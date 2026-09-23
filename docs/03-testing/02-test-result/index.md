# 02 - Test Result

เก็บ **ผลการทดสอบจริง** ตาม test case ที่วางไว้ใน [[../01-test-plan/index|01-test-plan]] เช่น

- ผล pass/fail ของแต่ละ test case
- บั๊ก (bug) ที่พบ พร้อมรายละเอียดและความรุนแรง
- สถานะการแก้ไขบั๊ก

ผลลัพธ์และปัญหาที่พบในโฟลเดอร์นี้จะถูกนำไปสรุปบทเรียนต่อใน [[../../04-retrospectives/index|04-retrospectives]]

## บันทึกผลทดสอบ

- [[20260923-test-run-tourist|20260923-test-run-tourist]] — ผลทดสอบ TC-001 ถึง TC-008 (หมวดนักท่องเที่ยว) ผ่าน browser จริงบน production (`https://lsh-nammon.web.app/`)
- [[20260923-test-run-community-content|20260923-test-run-community-content]] — ผลทดสอบ TC-009 ถึง TC-016 (หมวดชุมชน — สร้าง/จัดการคอนเทนต์) ผ่าน browser จริงบน production (`https://lsh-nammon.web.app/`)
- [[20260923-test-run-community-registration|20260923-test-run-community-registration]] — ผลทดสอบ TC-017 ถึง TC-019 (หมวดชุมชน — สมัคร/อนุมัติบัญชีชุมชนใหม่) ผ่าน browser จริงบน production (`https://lsh-nammon.web.app/`)
- [[20260923-test-run-community-edit-request|20260923-test-run-community-edit-request]] — ผลทดสอบ TC-020 ถึง TC-022 (หมวดชุมชน — ขอแก้ไขข้อมูล/คอนเทนต์) ผ่าน browser จริงบน production (`https://lsh-nammon.web.app/`)
- [[20260923-test-run-student-content|20260923-test-run-student-content]] — ผลทดสอบ TC-023 ถึง TC-026 (หมวดนิสิตนิเทศศาสตร์ — ส่งผลงาน/อนุมัติ/ไม่อนุมัติ) รวมการ retest dropdown "เลือกชุมชนที่เกี่ยวข้อง" (BL-013) หลัง deploy firestore.rules ผ่าน browser จริงบน production (`https://lsh-nammon.web.app/`)
- [[20260923-test-run-student-registration|20260923-test-run-student-registration]] — ผลทดสอบ TC-027 ถึง TC-032 (หมวดนิสิต — สมัคร/อนุมัติบัญชีผู้ใช้ใหม่) ผ่าน browser จริงบน production (`https://lsh-nammon.web.app/`)
- [[20260923-test-run-public-view|20260923-test-run-public-view]] — ผลทดสอบ TC-033 ถึง TC-036 (หมวดบุคคลทั่วไป — ไม่ Login) รวม security test เจาะลึก TC-035 ผ่าน browser จริงบน production (`https://lsh-nammon.web.app/`) — **รอบทดสอบสุดท้ายของชุดแรก ปิด test plan ครบ 36/36 ข้อ**
- [[20260923-test-run-regression-full|20260923-test-run-regression-full]] — **Regression test เต็มรูปแบบรอบที่ 2** ทดสอบซ้ำทุก TC (TC-001 ถึง TC-036 + TC-M-001 รวม 37 ข้อ) ผ่าน browser จริงบน production ในรอบเดียว — ยืนยันบั๊กที่เคยแก้ (TC-022, TC-026) ยังคงทำงานถูกต้อง แต่พบ regression ใหม่ที่ TC-006 (BL-010 — เอกสารอ้างว่ามี UI ปักหมุดจริงแล้วแต่ production ไม่มี ความรุนแรงสูง)
