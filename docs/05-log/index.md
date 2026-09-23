# 05 - Log

บันทึก **ความเคลื่อนไหวและเหตุการณ์สำคัญของโปรเจกต์** แบบเรียงตามลำดับเวลา (chronological log) เช่น

- Changelog ของแต่ละเวอร์ชัน/รอบการพัฒนา
- บันทึกการตัดสินใจสำคัญ (decision log) พร้อมเหตุผล
- เหตุการณ์หรือปัญหาที่เกิดขึ้นระหว่างทาง

ใช้เป็นแหล่งอ้างอิงเมื่อสรุปบทเรียนใน [[../04-retrospectives/index|04-retrospectives]] หรือเมื่อย้อนดูว่าเหตุใดจึงมีการตัดสินใจแบบใดแบบหนึ่ง

## สรุปประจำวัน

- [[20260822-log|20260822-log]] — สรุปภาพรวมงานวันที่ 2026-08-21 ถึง 2026-08-22 (snapshot ไม่ใช่ log ต่อเนื่อง)

## บันทึก

### 2026-09-22 — ปิด 2 คำถามค้างที่พบระหว่างงาน ACL.md (ชุมชนแก้ไขข้ามชุมชน + ข้อมูลยืนยันตัวตน)

ผู้ใช้ขอให้จัดการต่อ 2 เรื่องสุดท้าย — เสนอตัวเลือกทั้งคู่:

1. **ชุมชนขอแก้ไขคอนเทนต์ของชุมชนอื่นได้ไหม (BL-023)** — เสนอ 3 ทาง (ไม่ได้ เฉพาะของตนเอง ตรงกับของจริง / ได้ ขอแก้ไขข้ามชุมชนได้ / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **ไม่ได้ เฉพาะของตนเอง**
2. **ข้อมูลยืนยันตัวตนตอนชุมชนสมัครบัญชี (BL-022)** — เสนอ 3 ทาง (ข้อมูลพื้นฐาน ไม่ต้องแนบเอกสาร / ต้องแนบเอกสารทางการ / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **ข้อมูลพื้นฐาน**

ทั้งสองคำตอบตรงกับสิ่งที่ prototype-v3 implement ไว้อยู่แล้ว (ข้อสันนิษฐานที่ตั้งไว้ตอนสร้างถูกต้อง) — งานหลักคือทำให้เป็นทางการ (formal decision) ทั่วทั้งเอกสาร ไม่ใช่แก้โค้ดใหม่

ไล่แก้ทุกไฟล์ที่เกี่ยวข้อง:
1. [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] — เพิ่ม Business Rules 2 ข้อ (ชี้แจง "ใช้ร่วมกัน" = ดูได้อย่างเดียว, ข้อมูลยืนยันตัวตน = พื้นฐานเท่านั้น)
2. [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ปิด note ของ BL-022 และ BL-023
3. [[../02-design/02-technical/architecture|02-technical/architecture]] — ปิด Open Items ข้อ 7-8, ปิด note ของ API operation "สมัครบัญชี (ชุมชน)"
4. [[../02-design/02-technical/ACL|02-technical/ACL]] — ปิดข้อสันนิษฐานที่เหลืออยู่ข้อสุดท้าย, ลบ 2 ข้อจาก "คำถามที่ยังไม่มีคำตอบ"
5. [[../02-design/01-prototypes/community-account-registration-journey|community-account-registration-journey]], [[../02-design/01-prototypes/community-content-edit-request-journey|community-content-edit-request-journey]] — ปิด note ในคำอธิบาย step ที่เกี่ยวข้อง
6. [[../03-testing/01-test-plan/test-plan|test-plan]] — ปิด note ของ TC-020
7. [[../02-design/01-prototypes/prototype-v3/README|prototype-v3/README]] — ลบหัวข้อ "ข้อสันนิษฐานที่ยังไม่ยืนยัน" ทั้งหมด (ปิดครบแล้ว)
8. **แก้ข้อความในหน้าจอจริง**: `community-request-edit.html` (ข้อความ deny ตอนขอแก้ไขข้ามชุมชน — จาก "ยังไม่ยืนยัน" เป็นยืนยันแล้วว่าไม่รองรับ) และ `community-register.html` (field-error + label + placeholder ของช่องข้อมูลยืนยันตัวตน ให้ระบุชัดว่าต้องการชื่อผู้ติดต่อ+เบอร์โทรเท่านั้น)
9. [[../01-requirements/03-task/open-questions|open-questions]] — อัปเดตหมายเหตุท้ายไฟล์ว่างานค้างทั้งหมดที่เคยระบุไว้จัดการครบแล้ว เหลือแค่ BL-014/BL-017

ทดสอบผ่าน browser จริงว่าฟอร์มสมัครชุมชนยังทำงานปกติหลังแก้ข้อความ (validate error แสดงข้อความใหม่ถูกต้อง ไม่มี JS error)

### 2026-09-22 — ลบ badge "DRAFT/Open Question" ที่ล้าสมัยออกจากหน้าจอ prototype-v1 จริง

ผู้ใช้ขอให้จัดการต่อจากการอัปเดต README — ตัว badge `<div class="draft-note">`/`<span class="draft-note">` ที่แสดงอยู่จริงในหน้าเว็บ (ไม่ใช่แค่เอกสาร) ยังอ้างอิง Open Question ที่ปิดไปหมดแล้ว ลบ/แก้ 6 จุดใน 5 ไฟล์:

- `community-dashboard.html` — ลบ badge เรื่องขอบเขตระบบจัดการข้อมูล
- `community-create-content.html` — ลบ badge เรื่อง SEO และเรื่องรูปแบบการแปล (2 จุด)
- `student-publish.html` — ลบ badge เรื่องเชื่อมโยงชุมชน
- `admin-review-student-work.html` — ลบ badge เรื่องจำนวนครั้งส่งใหม่
- `tourist-story-detail.html` — ลบ badge เรื่องภาษา/TTS

**พบเพิ่มเติมระหว่างตรวจ — ไม่ใช่แค่ badge แต่เป็นพฤติกรรม UI ที่ขัดกับ Business Rule จริง**: `tourist-home-consent.html` ยังมีปุ่ม "ตั้งค่า" ที่เปิด panel ให้เลือก consent แบบ granular (แยก analytics/tracking) ทั้งที่ปิด Open Question ไปแล้วว่า Consent เป็น**แบบเดียว**เท่านั้น (ยอมรับ/ปฏิเสธทั้งหมด) — ตัดปุ่ม "ตั้งค่า", panel `#consent-settings`, และฟังก์ชัน `saveGranularConsent()` ออกทั้งหมด เหลือแค่ 2 ปุ่มตามที่ตัดสินใจไว้ พร้อมอัปเดต [[../02-design/01-prototypes/DESIGN|DESIGN.md]] § Consent Banner pattern ให้ตรงกัน (เดิมเขียนไว้ว่า "รองรับได้ทั้งสองแบบ" ซึ่งล้าสมัยแล้ว)

**ทดสอบผ่าน browser จริง** ทั้ง 5 หน้าที่แก้ (รวม `tourist-home-consent.html` ที่เปลี่ยนพฤติกรรมจริง): ไม่มี `.draft-note` เหลืออยู่เลย, ไม่มี JS error, ปุ่ม "ยินยอมทั้งหมด" ทำงานถูกต้อง (ปุ่ม "ตั้งค่า" หายไปแล้วจริง), ปุ่ม AI ใน `community-create-content.html` ยังทำงานปกติ, dropdown ชุมชนใน `student-publish.html` ยังครบ 3 ตัวเลือก — ไม่พบผลกระทบข้างเคียง

อัปเดต [[../02-design/01-prototypes/prototype-v1/README|prototype-v1/README]] บรรทัด Consent ให้ตรงกับพฤติกรรมใหม่ (ตัดคำว่า "ตั้งค่าแยกทีละประเภท" ออก)

### 2026-09-22 — อัปเดต prototype-v1/README.md ให้ตรงกับ Open Question ที่ปิดแล้ว

ผู้ใช้ขอให้ปิดช่องว่างสุดท้ายที่ตัวเองพบไว้ก่อนหน้านี้ — `prototype-v1/README.md` มี DRAFT note เก่าหลายจุดที่อ้างอิง Open Question ซึ่งจริงๆ ปิดไปหมดแล้ว (0 ข้อทั้งโปรเจกต์ ณ วันนี้)

แก้ [[../02-design/01-prototypes/prototype-v1/README|prototype-v1/README]]:
- แก้ status บนสุด: จาก "DRAFT — บางหน้าจอขึ้นกับ Open Question" เป็นระบุชัดว่าปิดครบแล้ว พร้อม cross-link ไปยัง [[../02-design/01-prototypes/prototype-v2/README|prototype-v2]] และ [[../02-design/01-prototypes/prototype-v3/README|prototype-v3]] ที่เป็นเวอร์ชันทันสมัยกว่าของฝั่งนิสิต/ชุมชนตามลำดับ
- `community-dashboard.html`, `community-create-content.html` — ปิด flag ขอบเขตข้อมูล/SEO/แปลภาษา พร้อมระบุชัดว่าเป็น mockup รุ่นแรกที่ไม่ได้อัปเดตตาม decision ล่าสุด ให้ดู prototype-v3 แทน
- `student-publish.html`, `admin-review-student-work.html` — ปิด flag เชื่อมโยงชุมชน/จำนวนครั้งส่งใหม่ พร้อม cross-link ไป prototype-v2 (เวอร์ชันที่ต่อ Firestore จริง)
- `tourist-story-detail.html` — แก้ข้อความที่เขียนผิด/ล้าสมัยไปแล้ว ("TTS ยังเป็น Open Question แยก" ทั้งที่ปิดไปแล้วจริง)

**หมายเหตุที่ยังไม่ได้แก้ (นอกขอบเขตที่ขอ)**: badge "DRAFT" ที่แสดงอยู่จริงในตัวหน้า HTML เอง (เช่น `<div class="draft-note">` ใน `tourist-story-detail.html`, `community-create-content.html`, `community-dashboard.html`) ยังไม่ได้ลบ/แก้ข้อความให้ตรงกับ Open Question ที่ปิดแล้ว — ผู้ใช้ขอเฉพาะไฟล์ README เท่านั้นในรอบนี้

### 2026-09-22 — ขยาย ACL.md ให้ครอบคลุมนักท่องเที่ยวแบบมีบัญชี

ผู้ใช้ขอให้ปิดช่องว่างสุดท้ายที่ระบุไว้ใน [[../02-design/02-technical/ACL|ACL.md]] — บทบาท "นักท่องเที่ยวแบบมีบัญชี" ที่ยังไม่เคยวิเคราะห์สิทธิ์เลย (ต่างจาก "บุคคลทั่วไป" ที่มีอยู่แล้วซึ่งแคบกว่า)

แก้ [[../02-design/02-technical/ACL|ACL.md]]:
- อัปเดต header ให้ครอบคลุม 6 flow (เพิ่ม flow บัญชีนักท่องเที่ยว), ปรับหมายเหตุจุดเริ่มไฟล์ที่เคยระบุว่ายังไม่ครอบคลุมให้ตรงกับสถานะใหม่
- เพิ่มบรรทัด "สถานะการบังคับใช้" ของ flow นี้ — ระบุชัดว่าบังคับที่ **UI ผ่าน `localStorage` เท่านั้น** ไม่มี backend/security rules จริง (ต่างจาก flow นิสิต/อาจารย์ที่ต่อ Firestore + rules จริงแล้ว) เพราะนักท่องเที่ยวยังไม่มี collection จริง
- เพิ่มแถว **"นักท่องเที่ยว (มีบัญชี)"** ในตารางสิทธิ์: ดู/สืบค้นไม่ต้อง login, สมัครบัญชีแล้ว**ใช้งานได้ทันทีไม่ต้องรออนุมัติ** (จุดที่ต่างจากนิสิต/ชุมชนอย่างมีนัยสำคัญ), เขียนรีวิว/บันทึกสถานที่ได้เฉพาะมีบัญชี — ปรับแถว "บุคคลทั่วไป" เดิมให้ระบุชัดว่าแคบกว่าแถวใหม่นี้อย่างไร
- อัปเดตหัวข้อ "สถานะบัญชี (Account Status)" ให้ระบุชัดว่า**บัญชีนักท่องเที่ยวไม่มีสถานะ pending/approved/rejected เลย** ต่างจากนิสิต/ชุมชน

ไม่ได้แก้ architecture.md เพิ่มเติม เพราะ entity `Review`/`Bookmark` มีเงื่อนไข "ต้องมี UserAccount role=tourist" ระบุไว้ถูกต้องอยู่แล้วตั้งแต่ Decision Log 2026-08-28 — ช่องว่างมีแค่ใน ACL.md ไฟล์เดียว

### 2026-09-22 — แก้ login inconsistency ของนักท่องเที่ยว (ค้างมาตั้งแต่ 2026-08-28)

ผู้ใช้ขอให้จัดการงานค้างที่ไม่ใช่ Open Question แล้ว — ความไม่สอดคล้องที่บันทึกไว้ตั้งแต่ decision 2026-08-28 ว่านักท่องเที่ยวต้องมีบัญชี (login เต็มรูปแบบ) ก่อนเขียนรีวิว/บันทึกสถานที่โปรดได้ แต่ [[../02-design/01-prototypes/tourist-journey|tourist-journey]] และ [[../02-design/01-prototypes/prototype-v1/README|prototype-v1]] เดิมยังทำได้โดยไม่ต้อง login เลย (ปุ่ม "เข้าสู่ระบบ" ใน nav เป็น `href="#"` กดไม่ได้จริง)

ถามผู้ใช้ตามกฎบังคับของ `prototype-builder` (มี version เดิมอยู่แล้วต้องถามเสมอ): แก้ prototype-v1 เดิม หรือสร้าง v4 ใหม่ — ผู้ใช้เลือก **แก้ prototype-v1 เดิม** (เป็นการแก้ inconsistency ของหน้าที่มีอยู่แล้ว ไม่ใช่ฟีเจอร์ใหม่)

**เพิ่ม/แก้ไขใน [[../02-design/01-prototypes/prototype-v1/README|prototype-v1]]**:
- สร้าง `tourist-login.html` ใหม่ — สมัครบัญชี + login แบบสาธิต (จำลองด้วย `localStorage` เพราะนักท่องเที่ยวไม่มี backend จริง เหมือนแนวทางเดียวกับ `community-register.html` ใน prototype-v3) รองรับ `?redirect=` พากลับไปหน้าที่เรียกมา
- แก้ nav ของทั้ง 3 หน้าเดิม (`tourist-home-consent.html`, `tourist-search-results.html`, `tourist-story-detail.html`) ให้ลิงก์ "เข้าสู่ระบบ" ใช้งานได้จริง + แสดงชื่อ/ปุ่มออกจากระบบเมื่อ login แล้ว
- แก้ `tourist-story-detail.html`: ปุ่ม "บันทึกสถานที่โปรด" และฟอร์มเขียนรีวิว เช็ค session ก่อนเสมอ — ยังไม่ login จะถูกพาไปหน้า `tourist-login.html?redirect=...` แทนที่จะทำงานได้ทันที (ตรงกับ Decision Log 2026-08-28), รีวิวที่โพสต์แนบชื่อจริงจาก session แทนคำว่า "คุณ"

**ทดสอบผ่าน browser จริง** (รัน `npx http-server` local ชี้ที่ prototype-v1): guest เห็น prompt "ต้องเข้าสู่ระบบก่อน" ถูกต้อง → กดบันทึกสถานที่ตอนยังไม่ login ถูกพาไป `tourist-login.html` ถูกต้อง → สมัครบัญชีสำเร็จ พากลับมาหน้าเดิมพร้อม session ถูกต้อง → บันทึกสถานที่/โพสต์รีวิวสำเร็จพร้อมชื่อถูกต้อง → logout ถูกต้อง กลับเป็น guest state ทุกหน้า → login ด้วยบัญชีเดิม (ไม่ใช่สมัครใหม่) สำเร็จ — ผ่านทุก flow ไม่พบบั๊ก

อัปเดตเอกสารตามให้ตรงกัน: [[../02-design/01-prototypes/tourist-journey|tourist-journey]] (เพิ่ม step login ในไดอะแกรม), [[../02-design/02-technical/architecture|architecture.md]] (ปิด "ผลกระทบที่ต้องตามแก้" ใน Decision Log 2026-08-28), [[../02-design/02-technical/detailed-design|detailed-design.md]] (ลบ ⚠️ warning, ปิด Open Item #1, เพิ่ม Decision Log entry), [[../01-requirements/03-task/product-backlog|product-backlog]] (เพิ่มหมายเหตุ login ใน BL-011/BL-012), [[../03-testing/01-test-plan/test-plan|test-plan]] (ปรับ Given clause ของ TC-007/TC-008 ให้ระบุเงื่อนไข login)

**หมายเหตุ**: `prototype-v1/README.md` ส่วนของฝั่งชุมชน/นิสิตยังมี DRAFT note เก่าที่อ้างอิง Open Question ที่จริงๆ ปิดไปแล้วในรอบก่อนหน้า (เช่น ขอบเขตระบบจัดการข้อมูล, SEO) — ไม่ได้แก้ในรอบนี้เพราะนอกขอบเขตงานที่ขอ (เฉพาะ login inconsistency ของนักท่องเที่ยว) ควรพิจารณาอัปเดตแยกทีหลัง

### 2026-09-22 — ปิด Open Questions ที่เหลือทั้งหมด (6 ข้อในรอบเดียว) 🎉

ผู้ใช้ขอให้ปิดทั้งหมดที่เหลือ พร้อมให้แนะนำตัวเลือก — ถามเป็น 2 ชุด (4 ข้อ + 2 ข้อ) พร้อมตัวเลือกทุกข้อ:

1. **Out of scope** — เสนอ 3 ทาง (สิ่งที่ยังไม่ implement = เวอร์ชันถัดไป / ทุกอย่างยังอยู่ใน scope v1 / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **สิ่งที่ยังไม่ implement = เวอร์ชันถัดไป**
2. **NFR** — เสนอ 3 ทาง (ระดับชุมชน/มหาวิทยาลัย ตรงกับ architecture.md เดิม / ระดับประเทศ / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **ระดับชุมชน/มหาวิทยาลัย**
3. **จำนวนครั้งส่งผลงานใหม่ (BL-018)** — เสนอ 3 ทาง (ไม่จำกัด / จำกัดจำนวนครั้ง / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **ไม่จำกัด**
4. **Tracking tools อื่น** — เสนอ 3 ทาง (ไม่มี เฉพาะ GA+IP / มีเพิ่ม เช่น FB Pixel/Hotjar / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **ไม่มี**
5. **สิทธิ์เจ้าของข้อมูล** — เสนอ 3 ทาง (ขั้นพื้นฐาน ติดต่อ Data Controller เอง / self-service เต็มรูปแบบ / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **ขั้นพื้นฐาน**
6. **ตำแหน่งหน้า public-view** — เสนอ 3 ทาง (แยกหน้าต่างหาก ตรงกับของจริง / รวมกับ tourist-search-results / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **แยกหน้าต่างหาก**

ไล่แก้ทุกไฟล์ที่เกี่ยวข้องทั้งหมด:
1. [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] — เพิ่ม Business Rules 3 ข้อ (out of scope, NFR, จำนวนครั้งส่งใหม่) **ปิด Open Questions ครบทุกข้อในไฟล์นี้แล้ว**
2. [[../01-requirements/01-spec/20260822-01-it-log-pdpa-consent|01-spec/20260822-01-it-log-pdpa-consent]] — เพิ่ม Business Rules 2 ข้อ (tracking tools, สิทธิ์เจ้าของข้อมูล — รวมถึงปิด "สิทธิ์ถอน Consent" ในข้อเสนอแนะเดิมไปด้วยเพราะคำตอบเดียวกันครอบคลุม) **ปิด Open Questions ครบทุกข้อในไฟล์นี้แล้ว**
3. [[../01-requirements/01-spec/20260912-02-public-view-search-published-works|01-spec/20260912-02-public-view-search-published-works]] — เพิ่ม Business Rule ตำแหน่งหน้าจอ **ปิด Open Questions ครบทุกข้อในไฟล์นี้แล้ว**
4. [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ปิด note ของ BL-018, แก้ note บนสุดของไฟล์ให้สะท้อนว่าไม่มี backlog item ใดเป็น provisional จาก Open Question ของสเปคหลักแล้ว
5. [[../02-design/02-technical/architecture|02-technical/architecture]] — ปิด flag ของ NFR ใน cross-cutting concerns, ปิด Open Items ข้อ 1 (NFR) และข้อ 5 (จำนวนครั้งส่งใหม่), เพิ่ม Decision Log entry สรุป
6. [[../02-design/02-technical/ACL|02-technical/ACL]] — ปิดข้อสันนิษฐานเรื่องจำนวนครั้งส่งใหม่ (ไม่ใช่ข้อสันนิษฐานแล้ว)
7. [[../02-design/01-prototypes/student-content-journey|student-content-journey]] — ปิด step 5 (จำนวนครั้งส่งใหม่), ปรับสถานะให้ชัดว่าปิดครบทุกจุดแล้ว (ไม่มีข้อยกเว้นเหลือ)
8. [[../02-design/01-prototypes/public-view-search-journey|public-view-search-journey]] — ปิด step 2 (ตำแหน่งหน้าจอ — จุดสุดท้ายที่ค้าง) **เปลี่ยนสถานะเป็น Confirmed**
9. [[../02-design/02-technical/detailed-design|02-technical/detailed-design]] — ปิด note ของ Sequence #6 (จำนวนครั้งส่งใหม่)
10. [[../03-testing/01-test-plan/test-plan|test-plan]] — ปิด note ของ TC-026
11. [[../02-design/01-prototypes/index|01-prototypes/index]] — อัปเดตสถานะ journey ทั้งหมดให้ตรงกัน

**🎉 ผลลัพธ์**: [[../01-requirements/03-task/open-questions|open-questions]] regenerate เหลือ **0 ข้อ** — ปิด Open Question ครบทุกข้อในทั้งโปรเจกต์เป็นครั้งแรก **User Journey ทุกไฟล์ (7 ไฟล์) เป็น Confirmed หมดแล้ว** ไม่มี journey ไหนเป็น DRAFT อีกต่อไป

**สิ่งที่ยังไม่ใช่ Open Question แต่เป็นงานค้างที่ควรทำต่อ** (บันทึกไว้ให้ชัดเจน ไม่ปนกับ Open Question): ความไม่สอดคล้องเรื่อง login ของนักท่องเที่ยว (tourist-journey/prototype-v1 ยังไม่อัปเดต), บทบาทนักท่องเที่ยวแบบมีบัญชียังไม่มีใน ACL.md, ชุมชนขอแก้ไขคอนเทนต์ของชุมชนอื่นได้หรือไม่ (ความคลุมเครือที่ ACL.md เจอเอง ไม่ได้มาจากสเปค), ข้อมูลยืนยันตัวตนที่ต้องใช้ตอนชุมชนสมัครบัญชี, และ BL-014/BL-017 ที่ต้องรอโค้ดจริงถึงจะมี test case ได้

### 2026-09-22 — ปิด Open Question เรื่องขอบเขตการค้นหาใน public-view

ผู้ใช้ขอให้ปิดต่อโดยให้แนะนำ — เสนอ "ขอบเขตของค้นหาสถานที่ที่สนใจ (BL-021)" เพราะจะทำให้ DRAFT test case เหลือ 0 ข้อพอดี (เป็นข้อสุดท้าย) และเป็นข้อเดียวที่เหลือที่แนะนำถามตัวแทนชุมชน เสนอ 2 ทาง (เฉพาะชื่อชุมชน ตรงกับของจริง / เพิ่มค้นหาจากชื่อผลงาน/เนื้อหาด้วย) ผู้ใช้เลือก **เฉพาะชื่อชุมชน**

ไล่แก้:
1. [[../01-requirements/01-spec/20260912-02-public-view-search-published-works|01-spec/20260912-02-public-view-search-published-works]] — เพิ่ม Business Rule, ปิด Open Question ข้อนี้ (เหลือแค่ข้อ "ตำแหน่งหน้าจอ")
2. [[../02-design/01-prototypes/public-view-search-journey|public-view-search-journey]] — ปิด step 4 (เหลือแค่ step 2 เรื่องตำแหน่งหน้าจอที่ยัง DRAFT)
3. [[../03-testing/01-test-plan/test-plan|test-plan]] — ปิด DRAFT ของ TC-034 **ทำให้ DRAFT test case เหลือ 0/36 ข้อ** — ปิดครบทุก test case ที่เคยเป็น DRAFT ในระบบทั้งหมดแล้ว
4. [[../01-requirements/03-task/open-questions|open-questions]] — regenerate: เหลือ **6 ข้อ** (จาก 7) — ไม่มีข้อไหนแนะนำถามตัวแทนชุมชนเป็นการเฉพาะแล้ว (เหมือนที่เคยปิดฝั่งอาจารย์ที่ปรึกษาไปก่อนหน้า) เหลือแต่ข้อที่ต้องถามทั้งสองฝ่ายร่วมกันทั้งหมด

**สรุปความคืบหน้าสะสมของวันนี้**: จาก 16 Open Questions ตอนเริ่มวัน เหลือ 6 ข้อ (ปิดไป 11 ข้อ, พบใหม่ 1 ข้อ) — ไม่มี gate-blocking, ไม่มีข้อที่ต้องถามอาจารย์ที่ปรึกษาหรือตัวแทนชุมชนเป็นการเฉพาะเหลืออยู่แล้ว, DRAFT test case เหลือ 0/36, journey ที่เป็น DRAFT เหลือแค่ 2 ไฟล์บางส่วน (community-content-journey ปิดครบ, tourist-journey ปิดครบ, student-content-journey ปิดครบ — เหลือ public-view-search-journey บางส่วน)

### 2026-09-22 — ปิด Open Question เรื่องการเชื่อมโยงผลงานนิสิตกับชุมชน

ผู้ใช้ขอให้ปิดต่อโดยให้แนะนำ — เสนอ "เชื่อมโยงผลงานนิสิตกับชุมชน (FR-3.1)" เพราะกระทบหลายจุด (TC-024, student-content-journey, BL-013, field `community_id`) เสนอ 3 ทาง (เลือกจาก dropdown ตอนอัปโหลด ตรงกับของจริง / ระบบจับคู่อัตโนมัติ / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **เลือกจาก dropdown ตอนอัปโหลด**

ไล่แก้:
1. [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] — เพิ่ม Business Rule, renumber Open Questions (3→2 ข้อ: Out of scope, NFR)
2. [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ปิด note ของ BL-013
3. [[../02-design/02-technical/architecture|02-technical/architecture]] — ปิด flag ของ field `community_id` (StudentWork), ปิด Open Items ข้อ 4
4. [[../02-design/01-prototypes/student-content-journey|student-content-journey]] — ปิด step 6 **ทำให้ journey นี้ปิด Open Question ครบแล้ว เปลี่ยนสถานะเป็น Confirmed** อัปเดต [[../02-design/01-prototypes/index|01-prototypes/index]] ให้ตรงกัน
5. [[../03-testing/01-test-plan/test-plan|test-plan]] — ปิด DRAFT ของ TC-024 — DRAFT รวมลดเหลือ **1/36 ข้อ** (TC-034 เท่านั้น)

**พบข้อค้นพบระหว่างปิดคำถามนี้**: "จำนวนครั้งที่นิสิตส่งผลงานใหม่ได้หลังไม่ผ่านอนุมัติ" มีแค่ข้อสันนิษฐานกระจายอยู่หลายที่ (BL-018, ACL.md, architecture.md, journey) แต่ไม่เคยถูกติดตามเป็น Open Question อย่างเป็นทางการใน [[../01-requirements/03-task/open-questions|open-questions]] เลย (เกิดจาก log การกลับคำตัดสินใจ 2026-09-04 ไม่ได้มาจาก "## Open Questions" ของสเปคต้นทาง) — เพิ่มเข้าไปในไฟล์ tracker พร้อมหมายเหตุอธิบายที่มา ทำให้ยอดรวม Open Questions คงที่ 7 ข้อ (ปิด 1 เพิ่ม 1)

6. [[../01-requirements/03-task/open-questions|open-questions]] — regenerate ตามด้านบน

### 2026-09-22 — ปิด Open Questions เรื่อง Consent granular และ Log detail

ผู้ใช้ขอให้ปิดทั้งสองข้อพร้อมกัน — เสนอตัวเลือกทีละข้อ:

1. **Consent granular หรือแบบเดียว** — เสนอ 3 ทาง (แบบเดียว ยอมรับ/ปฏิเสธทั้งหมด / แบบ granular แยก toggle รายประเภท / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **แบบเดียว**
2. **Log เก็บ field อะไรบ้าง ใครเข้าถึงได้** — เสนอ 3 ทาง (timestamp+ip+user-agent+action เข้าถึงเฉพาะ Data Controller / เก็บละเอียดกว่านี้+แยกเป็น log store ต่างหาก+ให้ทีมพัฒนาเข้าถึงได้ด้วย / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **แบบแรก**

ไล่แก้ทุกจุดที่มี DRAFT flag ค้างจาก 2 คำถามนี้:
1. [[../01-requirements/01-spec/20260822-01-it-log-pdpa-consent|01-spec/20260822-01-it-log-pdpa-consent]] — เพิ่ม Business Rules 2 ข้อ, ลบ "Consent แบบ granular" ออกจากข้อเสนอแนะที่ค้าง (ไม่ใช่ข้อเสนอแนะรอตัดสินใจอีกต่อไป), ปิด Open Questions ทั้งสองข้อ (renumber 4→2 ข้อ)
2. [[../02-design/02-technical/architecture|02-technical/architecture]] — ปิดหมายเหตุของ field `analytics_consent`/`marketing_consent` (ConsentRecord), **เพิ่ม field `user_agent` ใหม่เข้า AccessLog entity** (field ที่ขาดไปตาม Open Question เดิม) พร้อมปิดหมายเหตุระบุสิทธิ์เข้าถึงเฉพาะ Data Controller, ปิด Open Items ข้อ 2-3 (strikethrough)
3. [[../02-design/02-technical/detailed-design|02-technical/detailed-design]] — ปิดหมายเหตุของ Sequence #7 (Access Log) ส่วน field/สิทธิ์เข้าถึง (เหลือแค่ความถี่ retention job ที่ยังเป็นรายละเอียด technical stack)
4. [[../02-design/01-prototypes/tourist-journey|tourist-journey]] — ปิด step 1-2 (จุดสุดท้ายที่ค้างของ journey นี้) **ทำให้ tourist-journey ปิด Open Question ครบทุกจุดแล้ว เปลี่ยนสถานะเป็น Confirmed** (ความไม่สอดคล้องเรื่อง login ของนักท่องเที่ยวยังคงค้างแยกต่างหาก ไม่ใช่ Open Question) อัปเดต [[../02-design/01-prototypes/index|01-prototypes/index]] ให้ตรงกัน
5. [[../03-testing/01-test-plan/test-plan|test-plan]] — ปิด DRAFT ของ TC-001, TC-002, TC-003 — DRAFT รวมลดจาก 5/36 เหลือ **2/36 ข้อ** (ต่ำสุดเท่าที่เคยมีมา)
6. [[../01-requirements/03-task/open-questions|open-questions]] — regenerate: เหลือ 7 ข้อ (จาก 9)

### 2026-09-22 — ปิด Open Question เรื่องรูปแบบการแปลภาษา/TTS

ผู้ใช้ขอให้ปิด Open Question นี้ต่อ (แนะนำเป็นข้อถัดไปเพราะกระทบหลายจุดพร้อมกัน) — เสนอ 3 ทางเลือก (ข้อความแปลอย่างเดียว / ต้องมี TTS ด้วย / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **ข้อความแปลอย่างเดียว ไม่มีเสียงพากย์**

ไล่แก้ทุกจุดที่มี DRAFT flag ค้างจากคำถามนี้:
1. [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] — เพิ่ม Business Rule, renumber Open Questions (4→3 ข้อ)
2. [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ปิด note ของ BL-003
3. [[../02-design/02-technical/architecture|02-technical/architecture]] — ปิด flag ของ field `body_en`
4. [[../02-design/01-prototypes/community-content-journey|community-content-journey]] — ปิด step 6 (จุดสุดท้ายที่ค้าง) **ทำให้ journey นี้ปิด Open Question ครบทุกจุดแล้ว เปลี่ยนสถานะเป็น Confirmed** อัปเดต [[../02-design/01-prototypes/index|01-prototypes/index]] ให้ตรงกัน
5. [[../02-design/01-prototypes/tourist-journey|tourist-journey]] — ปิด step 4 ส่วน TTS (ส่วนภาษาปิดไปแล้วรอบก่อน) — journey นี้ยังเป็น DRAFT โดยรวมต่อไปเพราะ Consent granular (step 1-2) ยังไม่ปิด
6. [[../02-design/01-prototypes/DESIGN|DESIGN.md]] — ปิดหมายเหตุท้ายไฟล์เรื่อง TTS component ที่เคยกันไว้ (ไม่ต้องเพิ่มปุ่มเล่นเสียงแล้ว)
7. [[../03-testing/01-test-plan/test-plan|test-plan]] — ปิด DRAFT ของ TC-015 (BL-003) — DRAFT รวมลดจาก 6/36 เหลือ 5/36 ข้อ
8. [[../01-requirements/03-task/open-questions|open-questions]] — regenerate: เหลือ 9 ข้อ (จาก 10)

### 2026-09-22 — ปิด Open Question เรื่อง Data Controller

ผู้ใช้ขอให้ปิด Open Question "ใครเป็น Data Controller/ผู้รับผิดชอบด้าน PDPA ของโครงการ" — เสนอ 3 ทางเลือก (อาจารย์ที่ปรึกษาโครงการ / มหาวิทยาลัยพะเยาในนามนิติบุคคล / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **อาจารย์ที่ปรึกษาโครงการ**

แก้ [[../01-requirements/01-spec/20260822-01-it-log-pdpa-consent|01-spec/20260822-01-it-log-pdpa-consent]]:
- เพิ่ม Business Rule ใหม่ระบุ Data Controller ชัดเจน
- ลบข้อเสนอแนะเดิม "กำหนด Data Controller" ออกจากหัวข้อ "ข้อเสนอแนะเพิ่มเติม" (ไม่ใช่ข้อเสนอแนะที่รอตัดสินใจอีกต่อไป — กลายเป็น Business Rule แล้ว)
- ปิด Open Question ข้อนี้ออกจากลิสต์ (เหลือ 4 ข้อจาก 5 ข้อเดิมของไฟล์นี้)

อัปเดต [[../01-requirements/03-task/open-questions|open-questions]]: เหลือ **10 ข้อ** (จาก 11) — **ไม่มีข้อไหนที่ต้องถามอาจารย์ที่ปรึกษาเป็นการเฉพาะแล้ว** (ข้อเดียวที่เคยแนะนำถามอาจารย์ปิดไปแล้ว) ข้อที่เหลือทั้งหมดแนะนำถามตัวแทนชุมชนหรือทั้งสองฝ่ายร่วมกัน

### 2026-09-22 — ปิด Open Questions เรื่อง SEO และภาษาที่รองรับ

ผู้ใช้ขอให้ตอบ Open Questions 2 ข้อของ `local-story-hub` — เป็นการตัดสินใจเชิง scope จึงเสนอตัวเลือกให้ผู้ใช้เลือกเองแทนการเดา (ตามกฎ ≥3 ทางเลือกของโปรเจกต์):

1. **SEO (FR-1.4, BL-004)** — เสนอ 3 ทาง (แนะนำ keyword ภายในระบบเท่านั้น / เชื่อมกับ search engine จริง / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **แนะนำ keyword ภายในระบบเท่านั้น ไม่เชื่อม search engine จริง**
2. **ภาษาที่รองรับ (FR-2.2)** — เสนอ 3 ทาง (เฉพาะไทย-อังกฤษ / รองรับภาษาอื่นเพิ่ม เช่น จีน/ญี่ปุ่น / ยังไม่ตัดสินใจ) ผู้ใช้เลือก **เฉพาะไทย-อังกฤษ**

ไล่แก้เอกสารตามลำดับ dependency:
1. [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] — ย้ายทั้ง 2 คำตอบไปเป็น Business Rules, ปิดออกจาก Open Questions แล้ว renumber (6→4 ข้อ) — ระบุชัดว่าคำถามเรื่อง TTS/เสียงพากย์ (แยกจากเรื่องจำนวนภาษา) ยังเป็น Open Question ต่อไป
2. [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ปิด Open Question note ของ BL-004, ปรับ note บนสุดของไฟล์
3. [[../02-design/02-technical/architecture|02-technical/architecture]] — ปิด flag ของ field `seo_keywords` ใน Content entity
4. [[../02-design/01-prototypes/community-content-journey|community-content-journey]] — ปิด DRAFT ของ step 5 (SEO) เหลือแค่ step 6 (TTS) เป็น DRAFT
5. [[../02-design/01-prototypes/tourist-journey|tourist-journey]] — แก้ step 4 ให้แยกชัดว่าส่วนภาษาปิดแล้ว เหลือแค่ส่วน TTS ที่ยังเป็น DRAFT
6. [[../03-testing/01-test-plan/test-plan|test-plan]] — ปิด DRAFT flag ของ TC-005 (BL-009) และ TC-014 (BL-004) — DRAFT รวมลดจาก 8/36 เหลือ 6/36 ข้อ
7. [[../01-requirements/03-task/open-questions|open-questions]] — regenerate: เหลือ 11 ข้อ (จาก 13)

### 2026-09-22 — รัน detailed-design ปิดช่องว่างเทคนิคของ BL-014/BL-017

ผู้ใช้ขอให้ปิดช่องว่างของ BL-014 (เก็บ log 90 วัน) และ BL-017 (บันทึกหลักฐาน consent) โดยให้ทำ technical design ให้ครบก่อน — เช็ค open-questions.md แล้วพบว่า Open Question ที่เหลือ (รายละเอียด field ของ log, รูปแบบ consent granular/เดียว) ไม่กระทบการออกแบบ sequence ระดับ conceptual จึงไม่ต้องถามผู้ใช้เพิ่ม ดำเนินการต่อได้เลย:

- **ตรวจสอบ Sequence #1 (PDPA Consent)** ที่มีอยู่แล้ว — พบว่าขั้น "ConsentLog->>DB: บันทึก ConsentRecord" ครอบคลุม BL-017 อยู่แล้ว (ConsentRecord มี field `timestamp` ตรงตาม Acceptance Criteria พอดี) — เพิ่มหมายเหตุระบุ BL-017 ไว้ในบรรทัดอ้างอิงให้ชัดเจน ไม่ต้องออกแบบ sequence ใหม่ซ้ำ
- **เพิ่ม Sequence #7 ใหม่** ใน [[../02-design/02-technical/detailed-design|detailed-design]]: "บันทึก Access Log อัตโนมัติ + นโยบายเก็บรักษา 90 วัน" (BL-014) — ครอบคลุมทั้งการบันทึกทุก request แบบ fire-and-forget และ retention job ที่ลบ/หมุนเวียน log เก่ากว่า 90 วัน ซึ่งไม่เคยถูกออกแบบมาก่อนในเอกสารใดของโปรเจกต์ (เดิมมีแค่ note บรรทัดเดียวใน Sequence #2)
- อัปเดต Open Items ของ detailed-design.md: ปิดข้อเดิมเรื่องสิทธิ์เข้าถึงชุมชน (ตกหล่นจากรอบ architecture-design ก่อนหน้า ไม่เคยอัปเดตในไฟล์นี้), เพิ่มข้อสรุปการปิดช่องว่าง BL-014/017
- เพิ่ม backlink จาก [[../01-requirements/01-spec/20260822-01-it-log-pdpa-consent|20260822-01-it-log-pdpa-consent]] ไปยัง detailed-design.md, เพิ่มสเปคนี้เข้าหัวข้ออ้างอิงบนสุดของ detailed-design.md
- อัปเดต [[../03-testing/01-test-plan/test-plan|test-plan]] § "Backlog ที่ยังไม่มี Test Case": ระบุชัดว่า technical design เสร็จแล้วแต่ **ยังไม่มี test case แบบ journey-based ได้** เพราะเป็นพฤติกรรมอัตโนมัติที่ไม่มีผู้ใช้ริเริ่ม — แนะนำให้เพิ่มเป็น backend/integration test แยกต่างหากเมื่อมีโค้ดจริง แทนการฝืนสร้าง journey step ปลอมขึ้นมา

**สรุปสถานะ BL-014/BL-017**: technical design ปิดครบแล้ว — เป็นข้อจำกัดของรูปแบบ test-plan ปัจจุบัน (journey-based เท่านั้น) ไม่ใช่งานที่ค้างอยู่อีกต่อไป

### 2026-09-22 — สร้าง User Journey ปิดช่องว่าง BL-019/020/021 (สมัครบัญชีนิสิต + ดูผลงานแบบ public)

ผู้ใช้ขอให้รัน `user-journey` ปิดช่องว่างที่พบระหว่างงาน `test-cases` รอบก่อน — BL-019/020 (สมัคร/อนุมัติบัญชีนิสิต) และ BL-021 (ดู/ค้นหาผลงานแบบ public) implement จริงแล้วใน prototype-v2 ตั้งแต่ 2026-09-12 แต่ไม่เคยมี journey diagram รองรับเลย

เช็ค open-questions.md ตามกฎ gate ก่อนเสมอ:
- สเปค `20260912-01-account-registration-approval` (BL-019/020) — **ไม่มี Open Question ค้างแล้ว** (ปิดครบ 2026-09-12) → วาด **Confirmed**
- สเปค `20260912-02-public-view-search-published-works` (BL-021) — ยังมี 2 Open Question ค้าง (ขอบเขตการค้นหา, ตำแหน่งหน้าจอ) แต่ไม่ gate-blocking — **ถามผู้ใช้ตามกฎบังคับ** ว่าจะวาด DRAFT ตามสมมติฐานที่ implement ไปแล้วจริง หรือรอคำตอบก่อน ผู้ใช้เลือก **วาดเป็น DRAFT ตามสมมติฐานที่ implement ไปแล้ว**

สร้าง 2 journey ใหม่ (อ้างอิงโค้ดจริงใน [[../02-design/01-prototypes/prototype-v2/README|prototype-v2]] เพื่อให้ diagram ตรงกับพฤติกรรมจริง):
- [[../02-design/01-prototypes/student-account-registration-journey|student-account-registration-journey]] (Confirmed) — mirror จากโครงสร้างเดียวกับ community-account-registration-journey แต่เป็นฝั่งนิสิต
- [[../02-design/01-prototypes/public-view-search-journey|public-view-search-journey]] (DRAFT บางส่วน) — ทำเครื่องหมาย DRAFT ที่ step ค้นหา (ขอบเขตการค้นหา) และ step เปิดหน้า (ตำแหน่งหน้าจอ)

อัปเดต backlink: [[../02-design/02-technical/architecture|architecture.md]] (2 จุดใน Data Flow/API Spec), สเปคทั้ง 2 ไฟล์ต้นทาง, [[../02-design/01-prototypes/prototype-v2/README|prototype-v2/README]] (2 จุด), และ [[../02-design/01-prototypes/index|01-prototypes/index]]

ต่อด้วยอัปเดต [[../03-testing/01-test-plan/test-plan|test-plan]] เพิ่ม TC-027–032 (BL-019/020) และ TC-033–036 (BL-021) — หัวข้อ "Backlog ที่ยังไม่มี Test Case" เหลือแค่ BL-014/BL-017 แล้ว (ครบทุก backlog item ที่มี journey รองรับ) รวมเป็น 36 test case จาก 21 backlog item, DRAFT 8/36 ข้อ

### 2026-09-22 — Regenerate Test Plan ทั้งระบบ (เพิ่ม test case ฝั่งชุมชน)

ผู้ใช้ขอให้ทำ `test-cases` ต่อจากงาน prototype-v3 ฝั่งชุมชน — ตามกฎของ skill ต้อง regenerate หัวข้อ "Test Case จาก Acceptance Criteria" ใหม่ทั้งหมดจาก backlog + journey **ปัจจุบันทั้งระบบ** (ไม่ใช่แค่เพิ่มเฉพาะชุมชน) จึงอ่าน product-backlog.md และ journey ทั้ง 5 ไฟล์ใหม่ทั้งหมดก่อนเขียนทับ — ส่วน "Test Case เพิ่มเติม (เพิ่มโดยมนุษย์)" ไม่มีรายการอยู่แล้วจึงคงว่างไว้เหมือนเดิม ไม่ได้แตะต้อง

**ผลลัพธ์**: 20 → **26 test case** (จาก 18 backlog item, เพิ่มจาก journey ใหม่ 2 ไฟล์ฝั่งชุมชน):
- เพิ่ม TC-017–019 จาก BL-022 (สมัคร/อนุมัติบัญชีชุมชน) และ TC-020–022 จาก BL-023 (ขอแก้ไขข้อมูล→อนุมัติ)
- ปิด DRAFT flag ของ TC-009 (BL-006) เพราะ Open Question ปิดแล้ว 2026-09-22
- **renumber ทั้งไฟล์**: จัดกลุ่ม journey ฝั่งชุมชนทั้ง 3 ไฟล์ให้อยู่ติดกัน (TC-009–022) — ทำให้ TC ของฝั่งนิสิตเดิม (TC-017–020) ย้ายเป็น TC-023–026 อัปเดต backlink ใน [[../02-design/01-prototypes/student-content-journey|student-content-journey]] ให้ตรงกันแล้ว

**พบข้อผิดพลาดเดิมที่แก้ไขในรอบนี้**: หัวข้อ "Backlog ที่ยังไม่มี Test Case" เดิมระบุแค่ BL-014/BL-017 — แต่ BL-019/BL-020/BL-021 (เพิ่มเข้า backlog มาตั้งแต่ 2026-09-12) ไม่เคยมี User Journey diagram รองรับเลยเช่นกัน (ทั้งที่ implement จริงแล้วใน prototype-v2) ไม่เคยถูกระบุไว้ในหัวข้อนี้มาก่อน — เพิ่มเข้าไปให้ถูกต้องพร้อมคำแนะนำให้รัน `user-journey` เพิ่มถ้าต้องการ test case ของ 3 รายการนี้

เพิ่ม backlink ระหว่าง test-plan.md กับ journey ทั้ง 5 ไฟล์ (เลข TC ตรงกันแล้วทุกจุด) และปรับคำอธิบายใน [[../03-testing/01-test-plan/index|01-test-plan/index]] เล็กน้อย

### 2026-09-22 — สร้าง Prototype v3 ฝั่งชุมชน (5 หน้าจอ)

ผู้ใช้ขอให้ทำ `prototype-builder` ต่อจากงาน architecture/data-api/ACL/journey ฝั่งชุมชนที่ครบแล้ว — เสนอแผน 5 หน้าจอให้ผู้ใช้ดูก่อนตามกฎบังคับของ skill แล้วถามเรื่อง folder version (มี prototype-v1/v2 อยู่แล้ว) พร้อม 3 ทางเลือก (v3 ใหม่ / แก้ v1 เดิม / เพิ่มเข้า v2) — ผู้ใช้เลือก **สร้าง `prototype-v3/` ใหม่** เพราะเป็นรอบการตัดสินใจชุดใหม่ทั้งหมด ไม่กระทบ v1/v2 เดิม

สร้าง 5 ไฟล์ (self-contained, ยึด DESIGN.md ทุก token, จำลองข้อมูลด้วย `localStorage` เพราะยังไม่มี Firestore collection รองรับ entity ใหม่):
- `community-register.html` — สมัครบัญชี + login แบบสาธิต (BL-022)
- `community-dashboard.html` — คอนเทนต์ตนเอง + คอนเทนต์ชุมชนอื่น (read-only, shared data), ค้นหาแบบ live ทั้งสองตาราง
- `community-create-content.html` — ปุ่ม AI ครบ (ปรับภาพ/แคปชัน/แนะนำเรื่อง/SEO DRAFT/แปลภาษา DRAFT), เผยแพร่ได้ทันที
- `community-request-edit.html` — ขอแก้ไขคอนเทนต์ตนเองที่เผยแพร่แล้ว (BL-023) — บล็อกการขอแก้ไขคอนเทนต์ชุมชนอื่นจริง (ตามข้อสันนิษฐานใน ACL.md)
- `admin-review-community.html` — อนุมัติบัญชีชุมชน + คำขอแก้ไข (พร้อม diff เดิม/ใหม่), ประวัติทั้งสองประเภท

**ทดสอบผ่าน browser จริง** (รัน `npx http-server` local ชี้ที่โฟลเดอร์นี้ เพราะ `localStorage` ต้องรันผ่าน HTTP ไม่ใช่ `file://`) ครบ flow หลัก: สมัคร → ถูกบล็อกตอน pending → อนุมัติ → login → สร้าง+เผยแพร่ → เห็นคอนเทนต์ชุมชนอื่น + ค้นหา live ถูกต้อง → ส่งคำขอแก้ไข → อาจารย์เห็น diff ถูกต้อง → อนุมัติ → คอนเทนต์จริงเปลี่ยนตาม → ทดสอบเคสปฏิเสธ (ขอแก้ไขข้ามชุมชนถูกบล็อก, ฟอร์ม validate ช่องว่าง/อีเมลผิดรูปแบบ) — ผ่านทุกเคส ไม่พบบั๊ก

เพิ่ม wikilink ใน [[../02-design/01-prototypes/index|01-prototypes/index]] และ backlink จาก journey ทั้ง 3 ไฟล์ที่เกี่ยวข้อง (append เท่านั้น)

ฝั่งชุมชนตอนนี้ครบทุกขั้นของ pipeline แล้ว: Requirement/Backlog → Architecture (Component/Data Flow/Database/API) → ACL → User Journey → Prototype (ยังเป็น mockup `localStorage` ไม่ใช่ backend จริง)

### 2026-09-22 — สร้าง User Journey ใหม่ 2 เส้นทางฝั่งชุมชน + อัปเดต community-content-journey เดิม

ผู้ใช้ขอให้ทำ `user-journey` ต่อจากงาน architecture-design/data-api-design/ACL ฝั่งชุมชน — เช็ค [[../01-requirements/03-task/open-questions|open-questions]] ก่อนตามกฎ gate แล้วพบว่าไม่มี Open Question กระทบ 2 flow ใหม่ (สมัครบัญชีชุมชน, ขอแก้ไขข้อมูล) จึงวาดแบบ **Confirmed** ได้เลย ไม่ต้อง DRAFT:

- สร้าง [[../02-design/01-prototypes/community-account-registration-journey|community-account-registration-journey]] (Confirmed) — mirror จาก flow อนุมัติบัญชีนิสิต แต่ยืนยันตัวตนชุมชนโดยอาจารย์/แอดมิน (BL-022)
- สร้าง [[../02-design/01-prototypes/community-content-edit-request-journey|community-content-edit-request-journey]] (Confirmed) — ใช้ entity `ContentEditRequest` ใหม่ (BL-023) — พบข้อสันนิษฐานเดิม (ชุมชนขอแก้ไขคอนเทนต์ของชุมชนอื่นได้ไหม) ยังไม่ปิด ระบุไว้ในคำอธิบาย step 2 ของ journey นี้ ไม่ใช่ Open Question ที่บล็อก แค่เป็นข้อสันนิษฐานที่ต้องยืนยันภายหลัง
- อัปเดต [[../02-design/01-prototypes/community-content-journey|community-content-journey]] เดิม: ปิด DRAFT flag ของ step 1 (ล็อกอิน/สิทธิ์เข้าถึง) เพราะ Open Question ปิดแล้ว 2026-09-22 — **step 5 (SEO) และ step 6 (TTS) ยังคง DRAFT ต่อไป** เพราะ Open Question ที่เกี่ยวข้องยังไม่ปิด (ไม่ได้เดาปิดให้ทั้งไฟล์)
- อัปเดต [[../02-design/01-prototypes/index|01-prototypes/index]]: เพิ่ม entry 2 journey ใหม่, แก้ข้อความหัวข้อบนให้สะท้อนว่าไม่ใช่ทุก journey เป็น DRAFT แล้ว
- เพิ่ม backlink จาก [[../01-requirements/01-spec/local-story-hub|local-story-hub]] ไปยัง journey ใหม่ทั้ง 2 ไฟล์ (append เท่านั้น)
- อัปเดต [[../02-design/02-technical/architecture|architecture.md]]: เพิ่มลิงก์ไปยัง journey ใหม่ในหัวข้อ Data Flow ทั้ง 2 จุด และปิด Open Item เดิมข้อ 9 (ยังไม่มี journey diagram)

ฝั่งชุมชนตอนนี้มีครบ: Architecture (Component/Data Flow), Database Schema/API Spec, ACL, และ User Journey แล้วทั้งหมด (ยังเป็น conceptual — ยังไม่มี prototype/backend จริงรองรับ)

### 2026-09-22 — ขยาย ACL.md ให้ครอบคลุมบทบาทชุมชน

ผู้ใช้ขอให้ทำ ACL.md ต่อจากงาน architecture-design/data-api-design ฝั่งชุมชน — ไม่มี agent/skill เฉพาะสำหรับ ACL.md (เดิมสร้างแบบ ad-hoc ตามคำขอผู้ใช้เมื่อ 2026-09-11) จึงแก้ไฟล์ตรงตามรูปแบบเดิมที่มีอยู่แล้ว (ตาราง ทำได้/ทำไม่ได้ ต่อบทบาท + ข้อสันนิษฐาน + คำถามที่ยังไม่มีคำตอบ):

- เพิ่มแถวบทบาท **ชุมชน** ในตารางสิทธิ์: สมัครบัญชี+ยืนยันตัวตน (BL-022), จัดการ/เผยแพร่คอนเทนต์ตนเองทันที (BL-006 — ไม่เปลี่ยนจากเดิม), ดูคอนเทนต์ชุมชนอื่นได้ (shared data), ส่งคำขอแก้ไขคอนเทนต์ตนเองไปรออนุมัติ (BL-023)
- ขยายแถวบทบาท **อาจารย์**: เพิ่มสิทธิ์อนุมัติ/ไม่อนุมัติบัญชีชุมชนใหม่และคำขอแก้ไขข้อมูลชุมชน (BL-022, BL-023)
- ขยายตาราง "สถานะบัญชี" ให้ครอบคลุม role=community เหมือน role=student
- **พบประเด็นที่ Business Rule ไม่ได้ตอบชัด** ระหว่างเขียนตาราง: ชุมชนขอแก้ไขคอนเทนต์ของชุมชนอื่นได้หรือไม่ (เพราะข้อมูลใช้ร่วมกันแบบ shared) — ไม่เดาเอง ระบุเป็นข้อสันนิษฐาน (สมมติว่าแก้ได้เฉพาะของตนเอง) พร้อมเพิ่มในหัวข้อ "คำถามที่ยังไม่มีคำตอบ" ของ ACL.md และ Open Items ของ [[../02-design/02-technical/architecture|architecture.md]] (ข้อ 8) ให้ตรงกัน — ต้องยืนยันกับผู้ใช้/ตัวแทนชุมชนก่อน implement จริง
- อัปเดต [[../02-design/02-technical/architecture|architecture.md]]: ปิด Open Item เดิมเรื่อง "ACL.md ยังไม่ครอบคลุมบทบาทชุมชน" (เสร็จแล้ว) และแก้ข้อความในหัวข้อประเด็นข้ามระบบให้ตรงกับสถานะใหม่
- ระบุชัดในไฟล์ว่า flow ฝั่งชุมชนทั้งหมดยังเป็น **conceptual เท่านั้น** ยังไม่มี prototype/backend จริงรองรับ ต่างจาก flow นิสิต/บุคคลทั่วไปที่ implement จริงแล้ว

### 2026-09-22 — รัน data-api-design ฝั่งชุมชน (community) ต่อจาก architecture-design

ผู้ใช้ขอให้ทำ Database Schema/API Spec ต่อจาก Data Flow ใหม่ 2 เส้นทางที่เพิ่งเพิ่มใน architecture.md (BL-022, BL-023) — อ่านทั้งไฟล์ก่อนแก้เสมอ แก้เฉพาะหัวข้อ "Database Schema" และ "API Spec" ไม่แตะ Component/Data Flow ที่เป็นของ `architecture-design`

**ถามผู้ใช้ 1 จุด** (โครงสร้างข้อมูลไม่ชัดเจน ตามกฎของ skill): กลไกเก็บ "คำขอแก้ไขคอนเทนต์ชุมชน" (BL-023) ควรออกแบบแบบไหน — เสนอ 3 ทาง (เพิ่ม field pending ใน Content เดิม / สร้าง entity `ContentEditRequest` แยก / version ทั้ง Content แบบ append-only) ผู้ใช้เลือก **สร้าง entity แยก** เพราะ Content ที่ published ไม่ถูกแตะจนกว่าอนุมัติ, รองรับหลายคำขอ/ประวัติได้, และตรงกับ pattern เดียวกับ StudentWork/UserAccount ที่มีอยู่แล้ว

**Database Schema**:
- **UserAccount** — ขยาย field `status`/`rejection_reason`/`reviewed_by` ให้ครอบคลุม `role=community` ด้วย (เดิมมีแค่ `role=student`), ปิด flag Open Question ของ field `community_id`
- **Content** — เพิ่มหมายเหตุว่าการแก้ไขคอนเทนต์ published ต้องผ่าน ContentEditRequest เสมอ ไม่ update ตรง ๆ
- เพิ่ม entity ใหม่ **ContentEditRequest** (content_id, proposed_changes, status pending/approved/rejected, requested_by role=community, reviewed_by role=admin, rejection_reason, created_at) พร้อมเพิ่มความสัมพันธ์ใน ER Diagram

**API Spec**:
- เพิ่ม operation ของ UserAccount: สมัครบัญชี(ชุมชน), ดูรายการ/อนุมัติ/ไม่อนุมัติบัญชีชุมชนใหม่ (BL-022)
- เพิ่มตาราง operation ใหม่ของ ContentEditRequest: ส่งคำขอแก้ไข, ดูรายการรอพิจารณา, อนุมัติ (นำ proposed_changes ไป apply), ไม่อนุมัติ (BL-023)
- เพิ่ม operation แจ้งเตือนอาจารย์/แอดมินเมื่อมีคำขอแก้ไขรอพิจารณา ใน Notification

เพิ่ม Decision Log entry บันทึกทางเลือกที่ถามและเหตุผลที่ผู้ใช้เลือก — ไม่มี Open Item ใหม่เพิ่มจากงานรอบนี้ (รายละเอียดข้อมูลยืนยันตัวตนชุมชนที่ยังไม่ปิดถูกบันทึกไว้แล้วในรอบ architecture-design ก่อนหน้า)

### 2026-09-22 — รัน architecture-design ฝั่งชุมชน (community) หลังปิด Open Questions

ผู้ใช้ขอให้เริ่มออกแบบ Architecture ฝั่งชุมชนต่อ หลังปิด 3 Open Questions gate-blocking (ดูรายการด้านล่าง) — ตรวจ [[../01-requirements/03-task/open-questions|open-questions]] แล้วพบว่าไม่มีข้อไหนบล็อกงานฝั่งชุมชนอีก (คำถามที่เหลือ เช่น NFR/Consent/Log ไม่กระทบการออกแบบ component ระดับนี้) จึงไม่ต้องถามเพิ่มก่อนลงมือ

แก้ [[../02-design/02-technical/architecture|02-technical/architecture]] เฉพาะหัวข้อที่ agent นี้ดูแล (Context, Component หลัก, Data Flow, ประเด็นข้ามระบบ, Decision Log, Open Items) — ไม่แตะ Database Schema/API Spec:

- **Component**: อัปเดต Client ให้ระบุ Website เท่านั้น (ตัดธง Open Question ออก), ขยายหน้าที่ Notification Service ให้ครอบคลุมการแจ้งเตือนบัญชีชุมชนใหม่ (BL-022) และคำขอแก้ไขข้อมูลชุมชน (BL-023) นอกเหนือจากบัญชีนิสิตเดิม
- **Data Flow**: เพิ่ม 2 diagram ใหม่ — "สมัคร/อนุมัติบัญชีชุมชนใหม่" (มีรูปแบบเดียวกับ flow อนุมัติบัญชีนิสิต) และ "ชุมชนขอแก้ไขข้อมูล → อาจารย์/แอดมินอนุมัติ" (สะท้อน Business Rule ข้อมูลใช้ร่วมกันแต่ต้องอนุมัติก่อนแก้ไข)
- **ประเด็นข้ามระบบ**: ปิด flag ของขอบเขตระบบจัดการข้อมูลชุมชน (= เฉพาะคอนเทนต์), เพิ่มบันทึกเรื่อง shared-data + edit-approval pattern และบัญชีชุมชนต้องอนุมัติก่อนใช้งาน, ระบุชัดว่า [[../02-design/02-technical/ACL|ACL.md]] ยังไม่ครอบคลุมบทบาทชุมชน (เดิมติด Open Question ตอนนี้เป็นแค่งานค้าง)
- **Decision Log**: เพิ่มรายการ 2026-09-22 สรุปการปิด 3 Open Questions และผลกระทบต่อเอกสารนี้
- **Open Items**: ปิด/ย้าย 3 ข้อเดิมออก (แพลตฟอร์ม, สิทธิ์เข้าถึงชุมชน, ขอบเขตข้อมูล), renumber ที่เหลือ (9→6), เพิ่ม 3 ข้อใหม่ — ข้อมูลยืนยันตัวตนที่ต้องใช้ตอนชุมชนสมัครบัญชียังไม่ระบุ, ACL.md ยังไม่ครอบคลุมชุมชน, ยังไม่มี User Journey diagram แยกสำหรับ 2 flow ใหม่ (แนะนำให้รัน skill `user-journey` ต่อ)

ไม่ได้แตะ [[../02-design/01-prototypes/community-content-journey|community-content-journey]] ในรอบนี้ (นอกขอบเขตงานที่ขอ — เป็นของ skill `user-journey`) แม้ journey นั้นจะยังมี DRAFT flag อ้างอิง Open Question ที่ปิดไปแล้ว — ทิ้งไว้เป็น Open Item ให้ตามแก้ทีหลัง

### 2026-09-22 — ปิด 3 Open Questions ที่เป็น gate-blocking ของ local-story-hub

ผู้ใช้ตอบคำถามทั้ง 3 ข้อ gate-blocking ที่ค้างมาตั้งแต่ต้นโครงการ (ระบุไว้ใน [[../01-requirements/03-task/open-questions|open-questions]] ว่าบล็อกทั้งไฟล์สเปคหลักไม่ให้เข้า `02-design` เต็มรูปแบบ):

1. **แพลตฟอร์ม**: **Website** เท่านั้น
2. **สิทธิ์การเข้าถึงข้อมูลของแต่ละชุมชน (multi-tenant)**: ข้อมูล/คอนเทนต์ใช้ร่วมกันได้ระหว่างชุมชน ไม่ทำ isolation เต็มรูปแบบ แต่คำขอ**แก้ไข**ข้อมูลต้องผ่านการอนุมัติจากอาจารย์ที่ปรึกษา/แอดมินก่อนเสมอ
3. **การยืนยันตัวตนชุมชนใหม่** (กันมิจฉาชีพแอบอ้างเป็นไกด์ชุมชน): อาจารย์ที่ปรึกษา/แอดมินเป็นผู้อนุมัติบัญชีชุมชนใหม่เอง (รูปแบบเดียวกับการอนุมัติบัญชีนิสิต BL-019/020)
4. **ขอบเขตของ "ระบบจัดการข้อมูลชุมชน" (FR-1.6)**: ครอบคลุมเฉพาะการจัดการ**คอนเทนต์** (เรื่องราว/สื่อ) เท่านั้น ไม่รวมโปรไฟล์ชุมชน/แดชบอร์ด

ไล่แก้เอกสารตามลำดับ dependency:
1. [[../01-requirements/01-spec/local-story-hub|01-spec/local-story-hub]] — ย้ายทั้ง 4 คำตอบจาก Open Questions ไปเป็น Business Rules, แก้หัวข้อ Scope ให้ระบุ Website ชัดเจน, renumber Open Questions ที่เหลือ (9 → 6 ข้อ)
2. [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] — ปิด Open Question ของ BL-006 (ระบุขอบเขต = คอนเทนต์เท่านั้น), เพิ่ม Epic ใหม่ "การจัดการบัญชีและสิทธิ์แก้ไขข้อมูลชุมชน" พร้อม **BL-022** (สมัคร/ยืนยันตัวตนบัญชีชุมชนใหม่ อนุมัติโดยอาจารย์/แอดมิน) และ **BL-023** (อาจารย์/แอดมินอนุมัติคำขอแก้ไขข้อมูลชุมชน) ทั้งคู่ Priority Must — ลบรายการ "มิจฉาชีพแอบอ้าง" และ "แพลตฟอร์ม" ออกจากหัวข้อ "Requirement ที่ยังคลุมเครือ" เพราะตอบแล้ว
3. [[../01-requirements/03-task/open-questions|03-task/open-questions]] — regenerate ใหม่: เหลือ 13 ข้อค้าง (จาก 16), **ไม่มี Open Question ที่กระทบ scope ใหญ่ (gate-blocking) ค้างอยู่แล้วทั้งโปรเจกต์**

Open Question ย่อยที่ยังไม่ปิด (ไม่บล็อก): รายละเอียดข้อมูลยืนยันตัวตนที่ต้องใช้ตอนชุมชนสมัครบัญชี (BL-022) ยังไม่ระบุ — ควรสอบถามเพิ่มภายหลัง ไม่จำเป็นต้องหยุดรอก่อนเข้า `02-design` เพราะไม่กระทบ scope ใหญ่

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

### 2026-09-12 — อัปเดต architecture.md และ ACL.md ให้ครอบคลุมการสมัคร/อนุมัติบัญชีผู้ใช้ใหม่

- ผู้ใช้ขอให้อัปเดต [[../02-design/02-technical/architecture|02-technical/architecture]] และ [[../02-design/02-technical/ACL|02-technical/ACL]] ให้ตรงกับสเปค/backlog ที่ปิด Open Question ไปแล้ว (BL-019, BL-020)
- **architecture.md**: เพิ่ม component `Notification Service` (ส่งอีเมล), เพิ่ม Data Flow diagram ใหม่ "สมัคร/อนุมัติบัญชีผู้ใช้ใหม่", เพิ่ม field `status`/`rejection_reason`/`reviewed_by` ใน entity `UserAccount` (รูปแบบเดียวกับที่ทำกับ StudentWork เมื่อ 2026-09-04 — ระบุชัดว่าใช้เฉพาะ role=student เท่านั้น ไม่ครอบคลุม tourist/community), เพิ่ม self-referencing relationship ใน ER diagram, เพิ่ม API operation (สมัครบัญชี/ดูรายการรออนุมัติ/อนุมัติ/ไม่อนุมัติ) และ operation ส่งอีเมลแจ้งเตือน, อัปเดต Decision Log และปิด Open Item #9 บางส่วน (วิธี login ของนิสิตตัดสินใจแล้ว ส่วนการลบบัญชี demo ยังไม่ได้ทำ)
- **ACL.md**: ขยายขอบเขตชื่อ/คำอธิบายให้ครอบคลุม 2 flow แทน 1, เพิ่มรายการ "ทำได้"/"ทำไม่ได้" ใหม่ในตารางสิทธิ์เดิมสำหรับทั้งนิสิตและอาจารย์, เพิ่มหัวข้อใหม่ "สถานะบัญชี (Account Status)" อธิบาย gate แบบ pending/approved/rejected ที่แยกจาก role, ระบุชัดว่า flow นี้ **ยังไม่ได้ implement** (ต่างจาก flow ตรวจสอบผลงานที่บังคับใช้จริงแล้ว)
- ยังไม่ได้ลงมือเขียนโค้ด/prototype ใดๆ สำหรับ flow นี้ในรอบนี้ — เป็นแค่การอัปเดตเอกสาร design

### 2026-09-12 — Implement การสมัคร/อนุมัติบัญชีผู้ใช้ใหม่ (BL-019, BL-020)

- ผู้ใช้ขอให้ implement ต่อจากเอกสาร design — ถามคำถามบังคับก่อนลงมือ 2 ข้อ: (1) แก้ prototype-v2 เดิม (เลือกแล้ว ไม่สร้าง v3) (2) ส่งอีเมลจริงหรือจำลอง — ผู้ใช้เลือก **จำลองก่อน** เพราะยังไม่มีบริการส่งอีเมลให้ใช้จริง
- **Migration**: เพิ่ม `status: 'อนุมัติแล้ว'` ย้อนหลังให้บัญชีเดิม u001-u003 (ไม่งั้นจะใช้งานไม่ได้เมื่อ rules ใหม่ตรวจสอบ status ด้วย) อัปเดต `LSH/scripts/seed-firestore.js` ให้ seed field นี้ในอนาคตด้วย
- **`LSH/firestore.rules`**: เพิ่ม `create`/`read`/`update` rule ใหม่สำหรับ `users` (สมัครเองได้เฉพาะ role=student+status=รออนุมัติ, อ่านได้เฉพาะเจ้าของหรือ teacher, teacher แก้ได้เฉพาะ 4 field ที่กำหนด) และเพิ่มเงื่อนไข `isApprovedStudent()` ให้ `LSHRequests.create` ต้องเช็ค status ด้วยไม่ใช่แค่ role — deploy 2 รอบ (ก่อน/หลัง debug)
- **`student-publish.html`**: เพิ่มหน้าสมัครสมาชิก (ชื่อ-นามสกุล/อีเมล/รหัสผ่าน) สลับกับหน้า login ได้, เพิ่ม pending-view/rejected-view ตาม `status` ของบัญชี (rejected แสดงเหตุผลที่อาจารย์ระบุ + ต้องสมัครใหม่เท่านั้น)
- **`admin-review-student-work.html`**: เพิ่มหัวข้อ "บัญชีผู้ใช้ใหม่ที่รออนุมัติ" อ่านจาก `users` แบบ real-time พร้อมแบนเนอร์แจ้งเตือนจำลอง (ไม่ส่งอีเมลจริง) ปุ่มอนุมัติ/ไม่อนุมัติ (บังคับกรอกเหตุผล) เหมือน flow ผลงานเดิม
- **ทดสอบจริงผ่าน browser** (ปิดแท็บ auto-preview ที่ค้างก่อนทุกครั้งตามบทเรียนจากรอบก่อน แต่ก็ยังเจอปัญหาเดิมอีกระหว่างแก้ไฟล์ — แก้ไขข้อมูล req001 และลบ test doc ที่หลุดออกมาหลังตรวจพบ): สมัครบัญชีทดสอบ 2 บัญชี → บัญชีแรกอนุมัติสำเร็จแล้ว login กลับมาส่งผลงานได้ปกติ → บัญชีที่สอง**ทดสอบยิง request ตรงข้าม UI 3 กรณี (ส่งผลงานทั้งที่ยังไม่อนุมัติ, self-approve, อ่านข้อมูล user อื่น) rules บล็อกจริงทุกกรณี** แล้วทดสอบไม่อนุมัติผ่าน UI จริง เห็นเหตุผลถูกต้องตอน login กลับมา — ลบบัญชีทดสอบทั้งสอง (Auth + Firestore) หลังทดสอบเสร็จ ตรวจสอบซ้ำว่าข้อมูลเดิมทั้งหมด (`users` u001-u004, `LSHRequests` req001-005) กลับสู่สถานะที่ถูกต้อง
- อัปเดตเอกสาร: [[../02-design/01-prototypes/prototype-v2/README|02-design/01-prototypes/prototype-v2/README]] (รายละเอียด implementation + ผลทดสอบ), [[../02-design/02-technical/ACL|02-technical/ACL]] (ระบุว่า flow นี้บังคับใช้จริงแล้ว), [[../02-design/02-technical/architecture|02-technical/architecture]] (ปิด Open Item #9 บางส่วน, เพิ่มแถว mapping ใหม่), [[../../CLAUDE|CLAUDE.md]] (field ใหม่ของ `users`, รายละเอียด rules ใหม่, เพิ่มหัวข้อ Firebase Hosting ที่ขาดหายไปจากรอบก่อน)
- Redeploy ทั้ง Hosting และ Firestore rules ให้เว็บจริง (`https://lsh-nammon.web.app`) ตรงกับโค้ดล่าสุด

### 2026-09-12 — เพิ่ม requirement เรื่องดูผลงานนิสิตแบบไม่ต้อง login (requirement-intake)

- ผู้ใช้ถามว่าควรมีหน้าดูผลงานเผยแพร่แบบไม่ต้อง login ไหม — แนะนำว่าควรมี (อ้างอิง Decision Log 2026-08-28 เรื่องนักท่องเที่ยวไม่ต้องมีบัญชีตอนดู/อ่าน และ API Spec เดิมใน architecture.md ที่มี operation นี้อยู่แล้วแต่ยังไม่ implement) ผู้ใช้ยืนยันให้ทำ พร้อมระบุขอบเขต: ดู+ค้นหาตามชุมชนที่สนใจได้เท่านั้น ทำอย่างอื่นไม่ได้
- **Phase 1**: สร้าง [[../01-requirements/01-spec/20260912-02-public-view-search-published-works|01-spec/20260912-02-public-view-search-published-works]] เพิ่ม wikilink เข้า `01-spec/index.md`
- **Phase 2**: เพิ่ม **BL-021** ใน Epic เดิม "พื้นที่คอนเทนต์สำหรับนิสิตนิเทศศาสตร์" ที่ [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] (ต่อจาก BL-018) Priority Must — เพิ่มเหตุผลไว้ในหัวข้อ "ข้อสันนิษฐาน"
- Open Questions ที่พบ (ไม่กระทบ scope หลัก ไปต่อ design ได้เลย): (1) ขอบเขตการค้นหา — สมมติว่ากรองตามชื่อชุมชนเท่านั้น (2) หน้าใหม่แยกหรือรวมกับ `tourist-search-results.html` เดิม — ยังไม่ตัดสินใจ
- ยังไม่ได้ลงมือ design/implement ในรอบนี้ — รอผู้ใช้สั่งต่อ

### 2026-09-12 — Design: เปิด operation ดูผลงานนิสิตแบบ public (BL-021)

- ผู้ใช้ขอ commit เอกสาร requirement ก่อน (ทำแล้ว) แล้วแนะนำให้ไปต่อ design — อัปเดต [[../02-design/02-technical/architecture|02-technical/architecture]]: แก้ operation "ดูผลงานนิสิตที่เกี่ยวข้องกับชุมชน" เดิมให้ระบุชัดว่าเป็น **public ไม่ต้อง login** พร้อมอ้างอิงสเปคใหม่, เพิ่มหมายเหตุ cross-cutting concern เรื่องต้องแยก public/authenticated endpoint ที่ backend ไม่ใช่แค่ UI, เพิ่ม Decision Log entry
- อัปเดต [[../02-design/02-technical/ACL|02-technical/ACL]]: ขยายชื่อ/ขอบเขตเป็น 3 flow, เพิ่มบทบาท **"บุคคลทั่วไป" (ไม่ login)** เป็นแถวใหม่ในตารางสิทธิ์ (ทำได้แค่ดู+ค้นหาผลงานที่อนุมัติแล้ว) ระบุชัดว่าคนละอันกับบทบาท "นักท่องเที่ยว" เต็มรูปแบบที่ยังเป็น Open Question อยู่ ทำเครื่องหมายว่า flow นี้ยังไม่ได้ implement
- ยังไม่ได้ลงมือเขียนโค้ด — รอถามคำถามบังคับ (แก้หน้าเดิม/สร้างใหม่, จะรวมกับ tourist-search-results.html หรือแยก) ก่อน implement ต่อไป

### 2026-09-12 — Implement หน้าดูผลงานที่เผยแพร่แล้วแบบ public (BL-021)

- ถามคำถามบังคับ 2 ข้อก่อนลงมือ: (1) หน้าใหม่แยกหรือรวมกับ `tourist-search-results.html` — ผู้ใช้เลือก **สร้างหน้าใหม่แยก** (2) เพิ่มเข้า prototype-v2 เดิมหรือสร้าง v3 — ผู้ใช้เลือก **เพิ่มเข้า v2 เดิม**
- สร้าง `published-works.html` ใน [[../02-design/01-prototypes/prototype-v2/README|prototype-v2]]: ไม่มี login เลย อ่าน `LSHRequests` ด้วย query `status=='อนุมัติ'` แบบ real-time พร้อมช่องค้นหากรองตามชุมชน (client-side live filter) เพิ่มลิงก์ "ผลงานที่เผยแพร่แล้ว" ในเมนูของอีก 2 หน้า
- แก้ `LSH/firestore.rules`: `allow read` ของ `LSHRequests` เปิดเป็น public เฉพาะเอกสาร `status=='อนุมัติ'` (`request.auth != null || resource.data.status == 'อนุมัติ'`) — operation อื่นทั้งหมดยังต้อง login เหมือนเดิม
- **ทดสอบจริงผ่าน browser** (ปิดแท็บ auto-preview ค้างทั้ง 3 แท็บก่อนตามบทเรียนเดิม): เปิดหน้าโดยไม่ login เห็นผลงานอนุมัติแล้วถูกต้อง (รวมงานเก่าที่ไม่มี field `community` แสดงเป็น "ไม่ระบุชุมชน"), ค้นหากรองตามชุมชนทำงานถูกต้อง, ทดสอบยิง request ตรงข้าม UI 2 กรณี (อ่านเอกสารที่ยังไม่อนุมัติโดยตรง, list ทั้ง collection ไม่กรอง) **rules บล็อกจริงทั้งสองกรณี**
- **พบข้อมูลที่ไม่คาดคิดระหว่างทดสอบ**: บัญชีนิสิต 1 บัญชีกับผลงานที่อนุมัติแล้ว 1 รายการที่ไม่ได้มาจากการทดสอบของผม — ครั้งนี้ไม่ใช่ปัญหาแท็บค้างเหมือน 2 ครั้งก่อน แต่เป็นเพราะ**ผู้ใช้ทดสอบระบบเองแบบขนานกันไป** (ยืนยันแล้ว) จึงไม่ลบทิ้ง — ผู้ใช้บอกให้เก็บไว้ก่อนแต่ไม่ถือเป็นข้อมูลทางการ (รายละเอียดบัญชี/อีเมลไม่บันทึกไว้ในไฟล์นี้เพราะ repo เป็น public — บันทึกไว้ใน memory ส่วนตัวแทน) บันทึกไว้ว่า baseline ของ Firestore ตอนนี้คือ 5+1 LSHRequests และ 4+1 users ไม่ใช่แค่ 5/4 เดิม กันสับสนเป็นข้อมูลหลุดในการทดสอบครั้งต่อไป
- อัปเดตเอกสาร: [[../02-design/01-prototypes/prototype-v2/README|02-design/01-prototypes/prototype-v2/README]], [[../02-design/02-technical/ACL|02-technical/ACL]] (ทำเครื่องหมายว่า implement แล้ว), [[../../CLAUDE|CLAUDE.md]] และ [[../../README|README.md]] (root — เพิ่มลิงก์หน้าใหม่)
- Redeploy Hosting + Firestore rules ให้เว็บจริงตรงกับโค้ดล่าสุด

### 2026-09-23 — Detailed Design: เพิ่ม Sequence Flow สำหรับ flow ชุมชนให้ครบ (BL-022, BL-023)

- ผู้ใช้ขอ "ทำ detailed-design เพิ่ม sequence สำหรับ flow ชุมชนให้ครบ" — ปิดช่องว่างที่ระบุไว้ใน [[../02-design/02-technical/detailed-design|02-technical/detailed-design]] § Open Items ข้อ 2 เดิม: มี Data Flow ระดับ high-level ใน [[../02-design/02-technical/architecture|02-technical/architecture]] สำหรับ 2 flow ของชุมชน (BL-022 สมัคร/อนุมัติบัญชี, BL-023 ขอแก้ไขข้อมูล→อนุมัติ) แต่ยังไม่มี Sequence Diagram ละเอียดระดับ component-to-component ในไฟล์ detailed-design.md เลย
- เช็ค `open-questions.md` ก่อนตามกฎ gate ของ skill — **ไม่มี Open Question ค้างที่กระทบ 2 flow นี้แล้ว** (ปิดหมดตั้งแต่ 2026-09-22) จึงออกแบบ sequence แบบสมบูรณ์ได้เลยโดยไม่ต้องถามผู้ใช้เพิ่ม
- เพิ่ม **Sequence #8** (สมัคร/อนุมัติบัญชีชุมชนใหม่) — ออกแบบตาม pattern เดียวกับ Sequence #6 (นิสิตส่งผลงานขออนุมัติ): Client → API → DB (สร้าง UserAccount role=community, status=pending_approval) → Notification Service แจ้งอาจารย์/แอดมิน → alt อนุมัติ/ไม่อนุมัติ — ต่างจาก Sequence #6 ตรงที่ไม่อนุมัติ = สถานะสิ้นสุด (ไม่มี resubmission เหมือนนิสิต ตรงตาม Business Rule ที่ปิดแล้ว)
- เพิ่ม **Sequence #9** (ชุมชนขอแก้ไขข้อมูล → อนุมัติ) — แสดงการตรวจสอบความเป็นเจ้าของคอนเทนต์ก่อน (ปฏิเสธทันทีถ้าไม่ใช่คอนเทนต์ของตนเอง — ไม่รองรับข้ามชุมชน), สร้าง `ContentEditRequest` (status=pending) → แจ้งเตือน → alt อนุมัติ (นำ proposed_changes ไปใช้จริงกับ Content) / ไม่อนุมัติ (Content ไม่เปลี่ยน)
- เพิ่ม Decision Log entry อธิบายที่มาและเหตุผลที่ไม่ต้องถามผู้ใช้เพิ่ม, ปิด Open Items ข้อ 2 ส่วนที่เหลือ (sequence diagram gap), เพิ่ม wikilink อ้างอิงจากทั้งสอง Data Flow ใน architecture.md และทั้งสอง journey file ([[../02-design/01-prototypes/community-account-registration-journey|community-account-registration-journey]], [[../02-design/01-prototypes/community-content-edit-request-journey|community-content-edit-request-journey]]) กลับมายัง detailed-design.md § Sequence #8/#9 (append เท่านั้น)
- เป็นเอกสารเชิงแนวคิดล้วน ไม่มีโค้ด/prototype ให้ทดสอบในรอบนี้ — ไม่กระทบ test-plan.md เพราะ BL-022/BL-023 มี test case (TC-017–022) อยู่แล้วจาก journey โดยไม่ต้องพึ่ง sequence diagram
- **สถานะหลังรอบนี้**: detailed-design.md มี Sequence Flow ครบ 9 เส้นทางแล้ว ครอบคลุมทั้ง 3 persona (นักท่องเที่ยว, นิสิต, ชุมชน) + PDPA Consent + Access Log — ไม่มีช่องว่างที่รู้จักเหลืออยู่ในเอกสารนี้อีก

### 2026-09-23 — ตรวจสอบ Open Question/งานค้างทั้งโปรเจกต์ + ปิดคำถามที่เหลือใน ACL.md

- ผู้ใช้ขอตรวจสอบว่ามี Open Question หรืองานค้างอื่นเหลือไหม — ตรวจตรงจากทุกไฟล์ spec จริง (`local-story-hub.md`, `20260822-01-it-log-pdpa-consent.md`, `20260912-01-account-registration-approval.md`, `20260912-02-public-view-search-published-works.md`) ยืนยันตรงกับ `open-questions.md`: **0 Open Question ค้างทั้งโปรเจกต์** ตรวจ [[../02-design/02-technical/detailed-design|02-technical/detailed-design]] § Open Items — ปิดครบทั้ง 4 ข้อ (ข้อ 3 เป็นข้อจำกัดที่ยอมรับแล้ว ไม่ใช่ของค้าง)
- พบงานค้างจริง 3 ข้อใน [[../02-design/02-technical/ACL|02-technical/ACL]] § "คำถามที่ยังไม่มีคำตอบ" — เป็นรายละเอียดที่ไม่เคยมีที่มาจาก spec/backlog ใดเลย ไม่ใช่ gate-blocking Open Question แต่ยังไม่มีคำตอบ: (1) นิสิตแก้ไข/ลบผลงานที่ส่งไปแล้วได้ไหมก่อนอาจารย์ตรวจสอบ (2) อาจารย์แก้ไขเนื้อหาผลงานนิสิตได้โดยตรงไหม หรือทำได้แค่อนุมัติ/ไม่อนุมัติ (3) ชุมชนแก้ไข/ยกเลิกคำขอแก้ไขที่ส่งไปแล้วได้ไหมก่อนอาจารย์/แอดมินพิจารณา
- ผู้ใช้ขอให้ปิดให้ครบพร้อมเสนอทางเลือก — ถามผ่าน AskUserQuestion 3 ข้อ ข้อละ 3 ทางเลือกพร้อมข้อดี/ข้อเสีย ผู้ใช้เลือกทางเลือกที่แนะนำทั้ง 3 ข้อ (ทุกข้อคือ "ทำไม่ได้ ต้องรอผลอนุมัติ/ไม่อนุมัติก่อนเสมอ" หรือ "ทำได้แค่อนุมัติ/ไม่อนุมัติ") เพราะสอดคล้องกับ sequence ที่ออกแบบไว้แล้วในตอนแรก ไม่ต้องเพิ่ม state/API ใหม่
- คำตอบ: (1) นิสิตแก้ไข/ลบผลงานไม่ได้ขณะสถานะ "รอพิจารณา" ต้องรอผลอนุมัติ/ไม่อนุมัติก่อน ถ้าไม่ผ่านค่อยแก้ไขแล้วส่งใหม่ (2) อาจารย์แก้ไขเนื้อหาผลงานนิสิตแทนไม่ได้ ทำได้แค่อนุมัติ/ไม่อนุมัติ (3) ชุมชนแก้ไข/ยกเลิกคำขอแก้ไขไม่ได้ขณะสถานะ "รอพิจารณา" ต้องรอผลอนุมัติ/ไม่อนุมัติก่อนเช่นกัน
- อัปเดตเอกสาร: [[../02-design/02-technical/ACL|02-technical/ACL]] (เพิ่มข้อจำกัดใหม่ในแถว "นิสิต"/"อาจารย์"/"ชุมชน" ของตารางสิทธิ์ ปิด/ลบหัวข้อ "คำถามที่ยังไม่มีคำตอบ" เดิมเป็นรายการที่ปิดแล้ว), [[../01-requirements/03-task/product-backlog|03-task/product-backlog]] (เพิ่มหมายเหตุใน BL-018 และ BL-023), [[../02-design/02-technical/detailed-design|02-technical/detailed-design]] (เพิ่มหมายเหตุยืนยันใน Sequence #6/#9 ว่าไม่มี operation แก้ไข/ยกเลิกโดยเจตนา + Decision Log entry ใหม่)
- เป็นเอกสารเชิงแนวคิดล้วน ไม่มีโค้ด/prototype ให้ทดสอบในรอบนี้ (ยังไม่มี implementation ฝั่งชุมชนหรือ edit-request จริง) — **ตอนนี้ไม่มี Open Question หรืองานค้างที่รู้จักเหลืออยู่เลยทั้งโปรเจกต์** เหลือแค่ BL-014/BL-017 ที่ต้องรอโค้ดจริงถึงจะมี test case แบบ backend/integration ได้ (ข้อจำกัดที่ยอมรับแล้ว ไม่ใช่ของค้าง)

### 2026-09-23 — ตรวจสอบ prototype-v1/prototype-v3 ว่ายังตรงกับการตัดสินใจล่าสุดไหม + แก้ไข

- ผู้ใช้ขอตรวจว่า `prototype-v1` กับ `prototype-v3` ยังตรงกับการตัดสินใจล่าสุดทั้งหมดไหม (ทั้ง 3 การตัดสินใจใหม่เรื่อง edit/cancel ก่อนอนุมัติ และการตัดสินใจเก่าที่ 2026-09-22 เช่น tourist login gate, consent single-toggle, community edit request ข้ามชุมชน, ข้อมูลยืนยันตัวตนชุมชน)
- ตรวจ 8 จุดผ่าน fork agent (อ่านโค้ด HTML จริงทุกไฟล์ที่เกี่ยวข้อง): `student-publish.html`/`admin-review-student-work.html` (prototype-v1) ไม่มี UI ให้แก้ไข/ลบผลงาน pending หรือให้อาจารย์แก้เนื้อหาแทนอยู่แล้ว (**ผ่าน** ตรงกับการตัดสินใจ 2026-09-23 โดยไม่ต้องแก้โค้ด), `tourist-login.html`/`tourist-story-detail.html`/`tourist-home-consent.html` ยังคง login-gate และ consent แบบเดียวถูกต้อง (**ผ่าน** ไม่มี regression), `community-request-edit.html`/`community-dashboard.html` (prototype-v3) ไม่มีปุ่มแก้ไข/ยกเลิกคำขอที่ pending อยู่แล้ว (**ผ่าน**), `community-register.html` ใช้ข้อมูลพื้นฐานอย่างเดียวถูกต้อง (**ผ่าน**)
- **พบ 1 จุดไม่ตรงจริง**: `prototype-v3/community-create-content.html` step 4 (SEO) และ step 5 (แปลภาษา) ยังมี `.draft-note` บอกว่า "ยังเป็น Open Question" ทั้งที่ Business Rule เรื่อง SEO (แนะนำ keyword ภายในระบบเท่านั้น) และแปลภาษา/TTS (ข้อความอย่างเดียว ไม่มีเสียงพากย์) ปิดไปแล้วตั้งแต่ 2026-09-22 (วันเดียวกับที่สร้าง prototype-v3) — `prototype-v1` เวอร์ชันเดียวกันถูกลบ badge นี้ไปแล้วในรอบก่อนหน้า แต่ `prototype-v3` ตกหล่นไม่ได้อัปเดตตาม
- แก้ไข: ลบทั้ง 2 `.draft-note` div ออกจาก `community-create-content.html`, อัปเดต [[../02-design/01-prototypes/prototype-v3/README|prototype-v3/README]] § "จุดที่ยังเป็น DRAFT" เป็น "ไม่มี" พร้อมอธิบายที่มา และปรับตารางหน้าจอให้ตรงกัน
- **ทดสอบผ่าน browser จริง** (`npx http-server -p 8747`, ตั้ง `lsh_v3_session` ผ่าน `page.evaluate` แล้ว navigate เข้า `community-create-content.html`): หน้าเรนเดอร์ปกติ, `document.querySelectorAll('.draft-note').length === 0` ยืนยันว่าลบครบ, ไม่มี JS error ใหม่ (มีแค่ 404 ของ resource ที่ไม่เกี่ยวข้อง เช่น favicon)
- **สรุป**: หลังแก้ไขจุดนี้ `prototype-v1` และ `prototype-v3` ตรงกับการตัดสินใจล่าสุดทั้งหมดครบแล้ว ไม่มีจุดไม่สอดคล้องเหลืออยู่

### 2026-09-23 — Implement ฝั่งชุมชนจริง เชื่อม Firebase (BL-006, BL-022, BL-023) — Part 1/5 ของแผน "สร้างระบบตาม spec.md ให้ครบ"

ผู้ใช้ขอให้สร้างส่วนที่เหลือของระบบทั้งหมดตาม `spec.md` โดยแบ่งเป็น 5 ส่วน (ชุมชน → นักท่องเที่ยว → AI backend → notification → consent/log service) รอบนี้ทำเฉพาะ **ส่วนชุมชน**

แปลง mockup `localStorage` เดิมใน [[../02-design/01-prototypes/prototype-v3/README|prototype-v3]] ให้เป็นระบบจริงที่เชื่อม Firebase Authentication + Firestore project `lsh-nammon` (ตาม pattern เดียวกับที่ [[../02-design/01-prototypes/prototype-v2/README|prototype-v2]] ทำไว้แล้วฝั่งนิสิต/อาจารย์):

- สร้าง 4 หน้าใหม่ใน `prototype-v2/`: `community-register.html`, `community-dashboard.html`, `community-create-content.html`, `community-request-edit.html`
- ขยาย `admin-review-student-work.html`: บัญชีรออนุมัติครอบคลุมทั้งนิสิต+ชุมชน, เพิ่มส่วนอนุมัติ/ไม่อนุมัติคำขอแก้ไขข้อมูลชุมชนพร้อม diff เดิม/ใหม่ (ตัดสินใจรวมเป็นหน้าเดียวกับที่มีอยู่แล้ว แทนที่จะแยกหน้า `admin-review-community.html` ใหม่ — อาจารย์คนเดียวดูแลทุกอย่างสมจริงกว่า)
- Firestore collection ใหม่: `CommunityContent`, `ContentEditRequests` — `users` ขยายให้รองรับ `role: 'community'` (เพิ่ม field `contactInfo`) ในเอกสารเดียวกับนิสิต ไม่แยก collection (ตัดสินใจให้ตรงกับ conceptual `UserAccount` เดียวที่รวมทุก role) — เพิ่ม mapping เข้า [[../02-design/02-technical/architecture|architecture.md]] § Mapping กับ Firestore จริง
- แก้ `LSH/firestore.rules`: เพิ่ม `isApprovedCommunity()`, เปิด `users.create` ให้ role `community`, เพิ่ม rule ของ 2 collection ใหม่ (least-privilege ตาม ACL.md — **ชุมชนไม่มีสิทธิ์ update/delete คำขอแก้ไข/คอนเทนต์ตนเองเลย** ตรงกับการตัดสินใจปิดคำถาม 2026-09-23 ก่อนหน้านี้ในวันเดียวกัน) — **ยังไม่ deploy** รอผู้ประสานงานรีวิวก่อน
- ปุ่ม AI ทั้งหมดใน `community-create-content.html` ปิดใช้งานชั่วคราว (placeholder ชัดเจนว่าจะเชื่อมต่อรอบถัดไป) — เป็นสโคปของ Part 3 ที่ต้องรออัปเกรด Firebase เป็นแผน Blaze ก่อน

**ทดสอบผ่าน browser จริงบางส่วน** (local http-server + Playwright): หน้า login/register เรนเดอร์ถูกต้อง, validate ฟอร์มทำงานถูกต้อง, หน้าที่ต้อง login ทั้ง 3 หน้า redirect กลับ `community-register.html` ถูกต้องเมื่อยังไม่ login, ไม่มี JS error บนทุกหน้าที่แก้/สร้างใหม่ — **ไม่สามารถทดสอบ flow เขียนข้อมูลจริงแบบ end-to-end ได้ในรอบนี้** เพราะ `firestore.rules` ที่แก้ยังไม่ได้ deploy (ไม่มีสิทธิ์ deploy เอง) และเครื่องนี้ไม่มี Java จึงรัน Firebase emulator ทดสอบแทนไม่ได้ — **ต้อง deploy rules แล้วทดสอบ flow เต็มอีกครั้ง** (สมัคร→อนุมัติ→สร้าง/แก้ไขคอนเทนต์→อนุมัติคำขอแก้ไข) ก่อนถือว่าสมบูรณ์

อัปเดตสถานะ BL-006/BL-022/BL-023 ใน [[../01-requirements/03-task/product-backlog|product-backlog]] เป็น "เสร็จแล้ว" (พร้อมหมายเหตุข้อจำกัดข้างต้น), ทำเครื่องหมาย [[../02-design/01-prototypes/prototype-v3/README|prototype-v3]] ว่า superseded (ไม่ลบไฟล์)

### 2026-09-23 — รีวิว + deploy + ทดสอบ end-to-end ระบบชุมชน (ต่อจาก Part 1 ด้านบน)

ผู้ประสานงานรีวิวโค้ดที่ agent สร้างไว้ก่อน deploy จริง — พบช่องโหว่ 1 จุด: `community-create-content.html` มีปุ่ม "บันทึกฉบับร่าง" (status `ฉบับร่าง`) แต่ `firestore.rules` ไม่มี `allow update` ให้ชุมชนแก้ไข/เผยแพร่คอนเทนต์ตนเองเลย (มีแต่ `allow update` ของอาจารย์) — คอนเทนต์ที่บันทึกเป็นฉบับร่างจะติดค้างถาวร แก้ไข/เผยแพร่ไม่ได้อีกเลย เพราะหน้า `community-request-edit.html` ก็รับเฉพาะคอนเทนต์ที่ `status == 'เผยแพร่แล้ว'` เท่านั้น

**แก้ไข**: ตัดปุ่ม "บันทึกฉบับร่าง" ออกจาก `community-create-content.html` เหลือแค่ "เผยแพร่คอนเทนต์" ปุ่มเดียว (ตรงกับ hint ที่มีอยู่แล้วในหน้า dashboard ว่า "สร้าง/เผยแพร่คอนเทนต์ใหม่ทำได้เองทันที") และล็อก `firestore.rules` ให้ `CommunityContent.create` รับเฉพาะ `status == 'เผยแพร่แล้ว'` เท่านั้น (ตัดตัวเลือก `ฉบับร่าง` ออกเป็น defense-in-depth)

**Deploy**: `firebase deploy --only firestore:rules` ขึ้น production แล้ว (ยืนยันกับผู้ใช้ก่อน)

**ทดสอบ end-to-end ผ่าน browser จริง** (local http-server ชี้ `prototype-v2` + Playwright, ต่อ Firestore/Auth จริงของ `lsh-nammon`) — สร้างบัญชีชุมชนทดสอบ `qa-community-20260923@example.com`:
1. สมัครบัญชีชุมชนใหม่ → เห็นหน้า "รอการอนุมัติ" ถูกต้อง
2. login อาจารย์ (u004) → เห็นบัญชีชุมชนใหม่ในรายการรออนุมัติ พร้อมข้อมูลยืนยันตัวตน → กดอนุมัติสำเร็จ ไม่มี error
3. login ชุมชนที่อนุมัติแล้ว → สร้าง/เผยแพร่คอนเทนต์ใหม่สำเร็จ (เขียน Firestore จริง ไม่มี permission-denied)
4. กด "ขอแก้ไข" คอนเทนต์ตนเอง → ส่งคำขอสำเร็จ → dashboard เปลี่ยนเป็น "มีคำขอแก้ไขรอพิจารณา" ถูกต้อง (ปุ่มขอแก้ไขหายไป ป้องกันส่งคำขอซ้ำ)
5. login อาจารย์ → เห็นคำขอแก้ไขพร้อม diff เดิม/ใหม่ถูกต้องครบทั้งชื่อและเนื้อหา → กดอนุมัติสำเร็จ (เขียนทั้ง `ContentEditRequests.status` และ `CommunityContent` จริง ไม่มี error) → ขึ้นในตาราง "ประวัติคำขอแก้ไขที่พิจารณาแล้ว" ถูกต้อง

ไม่พบ JS error หรือ permission-denied ตลอด flow (มีแค่ 404 ของ favicon ที่ไม่เกี่ยวข้อง) — **ระบบชุมชนใช้งานได้จริงครบสมบูรณ์แล้ว** เก็บบัญชี/คอนเทนต์ทดสอบไว้ใน Firestore ตามธรรมเนียมเดิมของโปรเจกต์ (ไม่ลบข้อมูลทดสอบทิ้ง)

Deploy hosting ขึ้น `lsh-nammon.web.app` แล้ว, push ขึ้น `origin/main` แล้ว — **Part 1/5 เสร็จสมบูรณ์**

### 2026-09-23 — Implement ฝั่งนักท่องเที่ยวจริง เชื่อม Firebase (BL-008–012, BL-015–017) — Part 2/5 ของแผน "สร้างระบบตาม spec.md ให้ครบ"

รอบนี้ทำเฉพาะ **ส่วนนักท่องเที่ยว** ต่อจาก Part 1 (ระบบชุมชน)

**พบว่ามีงานค้างจากสองรอบก่อนหน้าที่ไม่เคยเสร็จสมบูรณ์**: `tourist-login.html` (สมัคร/login ด้วย Firebase Auth จริง เขียน collection `touristAccounts`) และ `consent-banner.js` (เขียน `ConsentRecords` จริง) ถูกสร้างไว้แล้วใน `prototype-v4/` ตั้งแต่ก่อนแผน 5-part นี้เริ่ม แต่**ไม่เคยมี `firestore.rules` รองรับทั้งสอง collection เลย** (ตรวจสอบ git history ยืนยันแล้ว — ไม่มีใน commit ใดก่อนหน้านี้) ทำให้ทุก write ของสองไฟล์นี้ถูกบล็อกด้วย catch-all `allow read, write: if false` มาตลอด ไม่เคยทำงานจริงบน production แม้แต่ครั้งเดียว และ `consent-banner.js` ก็ไม่เคยถูก wire เข้าใช้ในหน้าใดเลย (มีคอมเมนต์ในโค้ดเดิมระบุว่าจงใจทิ้งไว้ให้ agent คนถัดไปต่อ) — งานรอบนี้คือทำให้ทั้งสองส่วนนี้ใช้งานได้จริงเป็นครั้งแรก บวกสร้างส่วนที่ยังไม่มีเลย (ค้นหา/ดูเนื้อหาจริง, รีวิว, บันทึกสถานที่โปรด)

**ตัดสินใจ**: รวมหน้าจอทั้งหมดเข้า `prototype-v2/` (โฟลเดอร์ deploy จริง) ตาม pattern เดียวกับ Part 1 — ย้าย `tourist-login.html`, `tourist-home-consent.html`, `tourist-search-results.html`, `consent-banner.js` จาก `prototype-v4/` มาไว้ที่นี่ (แก้ path `firebase-config.js` ให้ตรง), คง `touristAccounts` เป็น collection แยกจาก `users` ตามที่ออกแบบไว้เดิม (ไม่รวมเข้า `users` แบบชุมชน เพราะนักท่องเที่ยวไม่มีสถานะ pending/approved เลย — ดู ACL.md § สถานะบัญชี)

**สร้างใหม่**:
- [[../02-design/01-prototypes/prototype-v2/README|prototype-v2/tourist-story-detail.html]] — หน้าใหม่ทั้งหมด (ไม่เคยมีเวอร์ชันจริงมาก่อน) โหลดเนื้อหาจริงตาม `?type=student|community&id=...`, เขียนรีวิว (`Reviews`)/บันทึกสถานที่โปรด (`Bookmarks`) ต้อง login ก่อนเสมอ (Decision Log 2026-08-28), หมุดหมายเดินทางลิงก์ไป Google Maps ด้วยชื่อชุมชน (ยังไม่มี field พิกัดจริงในสคีมา — บันทึกเป็นข้อจำกัดใน BL-010), คำแปลภาษาอังกฤษแจ้งผู้ใช้ตรงๆ ว่ายังไม่พร้อมใช้งาน (รอ AI backend Part 3) แทนการเดา/ปลอมคำแปล
- `tourist-search-results.html` (rewrite) — query จริงรวมจากทั้ง `LSHRequests`(status=อนุมัติ) และ `CommunityContent`(status=เผยแพร่แล้ว) มาเป็น array กลางฝั่ง client (ไม่แก้ schema ต้นทาง) ค้นหา/กรองแบบ live
- `tourist-home-consent.html` (rewrite) — การ์ดตัวอย่าง 3 รายการดึงจากข้อมูลจริงเดียวกัน, wire `consent-banner.js` เข้าใช้จริงเป็นครั้งแรก (ของเดิมมีแค่ banner ปลอมด้วย localStorage คู่ขนานอยู่)

**แก้ `LSH/firestore.rules`** (ยังไม่ deploy รอผู้ประสานงาน):
- เพิ่ม rule `touristAccounts` (อ่าน/สร้างเฉพาะเจ้าของ, role ต้องเป็น `tourist`), `Reviews` (อ่าน public, เขียนต้อง login+เจ้าของ, immutable), `Bookmarks` (อ่าน/ลบเฉพาะเจ้าของ), `ConsentRecords` (เขียนได้แม้ไม่ login, บังคับ analytics=marketing ตาม single-toggle, ไม่มี read)
- **แก้ rule เดิมของ Part 1**: `CommunityContent.read` เดิมบังคับ login เสมอ (`if request.auth != null`) — พบระหว่างทดสอบว่าขัดกับ ACL.md ที่ระบุชัดว่า "บุคคลทั่วไป"/"นักท่องเที่ยว" ต้องดูเนื้อหาชุมชนได้โดยไม่ login (เหมือน `LSHRequests`) แก้เป็น `if request.auth != null || resource.data.status == 'เผยแพร่แล้ว'` ให้ตรงกับ pattern เดียวกับ `LSHRequests`

**ทดสอบผ่าน headless browser จริง** (`npx playwright` แบบ script ตรงๆ ไม่ผ่าน MCP — MCP เชื่อมต่อหลุดไปตั้งแต่ก่อนหน้านี้ในเซสชันนี้): ยืนยันว่า
- `tourist-login.html`: validate ฟอร์มถูกต้อง (ชื่อว่างขึ้น error), toggle สมัคร/login ทำงานถูกต้อง, ไม่มี JS error
- `tourist-story-detail.html?type=student&id=<เอกสารจริงที่อนุมัติแล้ว>`: โหลดเนื้อหาจริงสำเร็จ (public read ของ `LSHRequests` ที่ deploy อยู่แล้วทำงานถูกต้อง), guest เห็น prompt login ถูกต้อง (ไม่เห็นฟอร์มรีวิว), กดบันทึกสถานที่โปรดตอนยังไม่ login redirect ไป `tourist-login.html?redirect=...` ถูกต้อง (URL-encode ถูกต้อง)
- type ที่ไม่ถูกต้อง (`?type=bogus`) แสดง error "ไม่พบเรื่องราวนี้ (ลิงก์ไม่ถูกต้อง)" ถูกต้องโดยไม่ยิง query ไป Firestore เลย
- `Reviews`/`Bookmarks`/`touristAccounts`/`ConsentRecords` ทุก query ขึ้น `permission-denied` ตามคาด เพราะ rules ที่แก้ยังไม่ได้ deploy — **ยังไม่สามารถทดสอบ flow เขียนข้อมูลจริงแบบ end-to-end ได้ในรอบนี้** (เหมือนสถานการณ์เดียวกับ Part 1) ต้อง deploy rules แล้วทดสอบซ้ำเต็ม flow (สมัครนักท่องเที่ยว → ดูเนื้อหาที่รวมทั้งนิสิต+ชุมชน → เขียนรีวิว → บันทึกสถานที่ → consent banner เขียนจริง) ก่อนถือว่าสมบูรณ์

**ทำเครื่องหมาย superseded** (ไม่ลบไฟล์): `prototype-v1/tourist-*.html` (README อัปเดตแล้ว), `prototype-v4/tourist-login.html`/`tourist-home-consent.html`/`tourist-search-results.html`/`consent-banner.js` (เพิ่มคอมเมนต์ชี้ไปที่ไฟล์ใหม่ใน prototype-v2)

**พบไฟล์นอกสโคปที่ควรตรวจสอบภายหลัง**: `prototype-v4/community-register.html` มีอยู่ (ซ้ำกับ `prototype-v3`/`prototype-v2` — ไม่แน่ใจที่มา) ไม่ได้แตะเพราะเป็นสโคปของระบบชุมชน (Part 1) ไม่ใช่นักท่องเที่ยว

อัปเดตสถานะ BL-008/009/011/012/015/016/017 เป็น "เสร็จแล้ว" (BL-010 ยังไม่เริ่ม — ไม่มีข้อมูลพิกัดจริง) ใน [[../01-requirements/03-task/product-backlog|product-backlog]], เพิ่ม mapping ใน [[../02-design/02-technical/architecture|architecture.md]], อัปเดต [[../02-design/02-technical/ACL|ACL.md]] § สถานะการบังคับใช้ ให้ตรงกับ backend จริง

### 2026-09-23 — รีวิว + แก้บั๊ก + deploy + ทดสอบ end-to-end ระบบนักท่องเที่ยว (ต่อจาก Part 2 ด้านบน)

ผู้ประสานงานรีวิวโค้ดก่อน deploy — พบช่องโหว่ 1 จุดใน `firestore.rules` (คล้ายรูปแบบเดียวกับบั๊ก draft ของ Part 1): rule ของ `Bookmarks` เดิมเช็คสิทธิ์ `read`/`delete` จาก `resource.data.touristId` — แต่ `tourist-story-detail.html` เรียก `getDoc()` เพื่อเช็คว่า "บันทึกไว้แล้วหรือยัง" **ก่อน**ที่เอกสารจะถูกสร้าง (ผู้ใช้ยังไม่เคยกดบันทึก) ทำให้ `resource` เป็น `null` และการอ้างอิง `resource.data.touristId` ทำให้ rule ปฏิเสธเสมอ (`permission-denied`) แทนที่จะได้ "ไม่พบเอกสาร" ตามปกติ — ปุ่ม "บันทึกสถานที่โปรด" จะพังตั้งแต่ครั้งแรกที่กดสำหรับทุกคน

**แก้ไข**: เปลี่ยนเงื่อนไขสิทธิ์ของ `Bookmarks.read`/`delete` ให้เช็คจาก **document ID** แทน (`bookmarkId.split('_')[0] == request.auth.uid` — ใช้ประโยชน์จากรูปแบบ id ที่กำหนดตายตัวอยู่แล้วคือ `{touristId}_{contentType}_{contentId}`) ซึ่งไม่ต้องพึ่งว่าเอกสารมีอยู่จริงหรือไม่ พร้อมเพิ่มเงื่อนไขใน `create` ให้ตรวจว่า `bookmarkId` ต้องตรงกับรูปแบบที่คำนวณจาก field จริงเสมอ (กัน id ปลอม)

**Deploy**: `firebase deploy --only firestore:rules` ขึ้น production แล้ว (ยืนยันกับผู้ใช้ก่อน)

**ทดสอบ end-to-end ผ่าน headless Chromium จริง** (`npx playwright` script ตรง ต่อ Firestore/Auth จริงของ `lsh-nammon` เพราะ Playwright MCP ยังเชื่อมต่อไม่กลับมา) ด้วยบัญชีทดสอบ `qa-tourist-20260923@example.com`:
1. สมัครบัญชีนักท่องเที่ยวใหม่ → เข้าใช้งานได้ทันที ไม่ต้องรออนุมัติ (redirect ไปหน้าค้นหาทันที ตรงตาม ACL.md)
2. หน้าค้นหาแสดงคอนเทนต์ที่รวมทั้งงานนิสิต (`LSHRequests`) และคอนเทนต์ชุมชน (`CommunityContent`) ปนกันถูกต้อง (ทดสอบด้วยคอนเทนต์ชุมชนที่สร้างไว้ตอนทดสอบ Part 1)
3. เปิดหน้ารายละเอียด → เช็คสถานะบันทึกสถานที่ครั้งแรก **ไม่มี permission-denied แล้ว** (bug fix ยืนยันผล) → กดบันทึกสำเร็จ → reload หน้าเห็นสถานะ "บันทึกแล้ว" คงอยู่ → กดยกเลิกสำเร็จ (ลบเอกสารจริง)
4. เขียนรีวิวสำเร็จ ขึ้นในรายการรีวิวทันทีหลังโพสต์
5. กดยินยอม consent banner สำเร็จ ไม่มี error (เขียน `ConsentRecords` จริง)
6. logout แล้ว login ซ้ำด้วยบัญชีเดิมสำเร็จ

ไม่พบ JS error หรือ permission-denied ใดๆ ตลอด flow — **ระบบนักท่องเที่ยวใช้งานได้จริงครบสมบูรณ์แล้ว** เก็บบัญชี/รีวิว/บันทึกสถานที่ทดสอบไว้ตามธรรมเนียมเดิม (ไม่ลบข้อมูลทดสอบทิ้ง)

Deploy hosting ขึ้น `lsh-nammon.web.app` แล้ว, push ขึ้น `origin/main` แล้ว — **Part 2/5 เสร็จสมบูรณ์**

### 2026-09-23 — สร้าง AI backend proxy ด้วย Cloudflare Worker (Part 3/5 ของแผน "สร้างระบบตาม spec.md ให้ครบ")

รอบนี้ทำเฉพาะ **AI backend proxy** ต่อจาก Part 1/2 (ชุมชน/นักท่องเที่ยว) — เปลี่ยนจากแผนเดิม Firebase
Cloud Functions มาเป็น **Cloudflare Workers** เพราะผู้ใช้ไม่ต้องการผูกบัตรเครดิตกับ Firebase (Cloud
Functions บังคับอัปเกรดเป็นแผน Blaze) ส่วน Cloudflare Workers free tier ใช้ได้โดยไม่ต้องผูกบัตร
(100,000 requests/วัน)

**สร้างใหม่**: `cf-worker/` (ที่ root) — `src/index.js`, `wrangler.toml`, `package.json`,
`.dev.vars.example`, `.gitignore`, `README.md` (ขั้นตอน deploy เต็ม)

**สถาปัตยกรรม Worker**:
- 6 action ผ่าน endpoint เดียวกัน `POST /ai/<action>`: `caption` (FR-1.2), `translate` (FR-1.3),
  `seo` (FR-1.4), `story-suggestion` (FR-1.5), `rewrite-description`/`summarize-pending` (ของเดิม
  ฝั่งนิสิต/อาจารย์ ย้ายมาเรียกผ่าน Worker แทน) — prompt ของทุก action ประกอบขึ้นฝั่งเซิร์ฟเวอร์จาก
  field ข้อมูลดิบเท่านั้น ไม่รับ prompt สำเร็จรูปจาก client
- ทุก request ต้องแนบ Firebase ID token — verify เองด้วย Web Crypto API (RS256, เช็ค signature ผ่าน
  JWKS ของ Firebase, `exp`/`aud`/`iss`) เพราะ Firebase Admin SDK เป็น Node-only ใช้บน Workers ไม่ได้
- `summarize-pending` เช็ค role เพิ่มว่าต้องเป็น `teacher` เท่านั้น โดยอ่าน `users/{uid}` ผ่าน Firestore
  REST API ด้วย ID token ของผู้เรียกเอง (ใช้สิทธิ์ self-read ที่มีอยู่แล้วใน `firestore.rules` ไม่ต้องมี
  service account เพิ่มเลย)
- log ทุกครั้งลง `AiAssistLogs` ด้วยวิธีเดียวกัน (Firestore REST + ID token ของผู้เรียก) แทนที่ client
  เขียนเอง
- **FR-1.1 (ปรับภาพให้สวย) ไม่ implement ในรอบนี้** — `community-create-content.html` ไม่มีระบบอัปโหลด
  ภาพจริงเลย (ปุ่ม "เลือกไฟล์" เป็น placeholder) การทำ endpoint ปรับภาพจริงต้องมีระบบอัปโหลดภาพก่อน
  (เช่น Firebase Storage) ซึ่งเป็นคนละสโคป — ปุ่มนี้ยังปิดใช้งานถาวรพร้อมข้อความอธิบายเหตุผลชัดเจน

**แก้ไฟล์ client**: `student-publish.html`, `admin-review-student-work.html` (เปลี่ยนจากเรียก OpenRouter
ตรงเป็นเรียกผ่าน Worker), `community-create-content.html` (เปิดใช้งาน 4/5 ปุ่ม AI จริง — คิดแคปชัน/
แนะนำวิธีเล่าเรื่อง/SEO/แปลภาษา, ปุ่มปรับภาพยังปิดถาวร), `tourist-story-detail.html` (เพิ่มปุ่มแปล
ไทย→อังกฤษใหม่ — **บังคับ login ก่อนใช้เสมอ** แม้เนื้อหาต้นฉบับอ่านได้แบบ public เพื่อกันคนนอกเรียกใช้
AI quota ฟรี เป็นการตัดสินใจ implementation ที่ทำเองโดยไม่ต้องถามผู้ใช้เพิ่ม)

**`ai-assist-config.js` ไม่ใช่ secret อีกต่อไป**: เดิมเก็บ OpenRouter API key จริง (client-side secret)
ตอนนี้เก็บแค่ `window.LSH_AI_PROXY_URL` (URL ของ Worker ไม่ใช่ความลับ ป้องกันด้วยการ verify ID token
ในตัว Worker เอง) — ลบออกจาก `.gitignore` และ `firebase.json` hosting.ignore แล้ว, เขียนไฟล์ใหม่ทั้ง
`ai-assist-config.js`/`.example.js` ให้ตรงกับรูปแบบใหม่ (placeholder URL เดียวกันทั้งคู่ เพราะไม่มี
secret ให้แยกอีกต่อไป)

**พบและแก้บั๊กระหว่างทดสอบ**: การเขียน log แบบ fire-and-forget (`logAiAssistUse`) ไม่ได้ห่อด้วย
`ctx.waitUntil()` — Cloudflare Workers อาจฆ่า promise ที่ยังค้างอยู่ทันทีที่ response ถูกส่งกลับไปแล้ว
ถ้าไม่ทำแบบนี้ (พบจาก best practice ของ Cloudflare เอง ไม่ใช่จากการ reproduce บั๊กจริงใน local `wrangler
dev` — local mode อาจไม่ได้บังคับ isolate teardown เข้มงวดเท่า production) แก้โดยเพิ่ม `ctx` เป็น
parameter ที่ 3 ของ `fetch()` handler แล้วห่อทุกจุดที่เรียก `logAiAssistUse` ด้วย `ctx.waitUntil(...)`

**แก้ `LSH/firestore.rules`**: เปิด `AiAssistLogs.create` ให้ผู้ใช้ที่ login แล้ว**ทุก role**เขียน log
ของตัวเองได้ (เดิมจำกัดแค่นิสิต/อาจารย์ — ตอนนี้ปุ่ม AI ขยายไปฝั่งชุมชน/นักท่องเที่ยวด้วยแล้ว) — **ยัง
ไม่ deploy** รอผู้ประสานงาน (เหมือน Part 1/2)

**ทดสอบผ่าน local `wrangler dev` + headless Chromium จริง** (ไม่ใช้ OpenRouter key จริง — ทดสอบ
auth/routing/error-handling เท่านั้น เพราะเครื่องนี้ไม่มี key จริง):
- Auth reject path: ไม่แนบ token → 401 "ต้อง login ก่อน", token ปลอม → 401 "ยืนยันตัวตนไม่สำเร็จ"
- Token จริงจากบัญชีสาธิต (teacher u004, community/tourist test account ที่สร้างไว้ตอนทดสอบ Part 1/2):
  ผ่าน auth verification ครบ ไปถึงขั้นเรียก OpenRouter จริง (fail เฉพาะเพราะ placeholder key — "User not
  found." จาก OpenRouter เอง ไม่ใช่ error จากฝั่งเรา) — role gate ของ `summarize-pending` ทำงานถูกต้อง
  (teacher ผ่าน, community โดน 403 "ใช้ได้เฉพาะบทบาท teacher เท่านั้น")
- CORS preflight (`OPTIONS`) ตอบถูกต้องสำหรับทั้ง production origin และ `localhost` ทุก port
- ปุ่ม AI ทั้ง 4 ปุ่มใน `community-create-content.html` + ปุ่มแปลใน `tourist-story-detail.html`: ทดสอบ
  ผ่าน browser จริง (local http-server ชี้ `ai-assist-config.js` ไปที่ `wrangler dev` local ชั่วคราว
  แล้ว revert กลับเป็น placeholder ก่อน commit) — ปุ่มเรียก Worker ถูก endpoint, แสดง error message ที่
  เข้าใจง่ายเมื่อ AI ตอบไม่สำเร็จ (ไม่ใช่ error ดิบ), guest เห็นปุ่มแปลถูก disable + ข้อความอธิบายถูกต้อง,
  หลัง login ปุ่มเปิดใช้งานถูกต้อง — ไม่มี JS error ใดๆ ตลอดการทดสอบ
- ยืนยันด้วยว่าการเขียน `AiAssistLogs` จาก community/tourist token ยังถูก**ปฏิเสธ**ตาม rule ที่ deploy
  อยู่จริงตอนนี้ (ของเดิม จำกัดแค่นิสิต/อาจารย์) ตรงตามคาด — จะเขียนได้เมื่อผู้ประสานงาน deploy rules
  ใหม่ที่แก้ไว้ในรอบนี้แล้วเท่านั้น

**อัปเดตสถานะ**: BL-002/003/004/005 → เสร็จแล้ว (BL-001 ยังไม่เริ่ม พร้อมเหตุผล) ใน
[[../01-requirements/03-task/product-backlog|product-backlog]] (แก้ไปพร้อมกับหมายเหตุ "ยังไม่ deploy
rules" ที่ล้าหลังของ BL-006/022/023 จาก Part 1 ให้ตรงกับความจริงด้วยในตัว), เพิ่ม component + Decision
Log ใน [[../02-design/02-technical/architecture|architecture.md]], เพิ่มหัวข้อ "AI Backend Proxy" ใน
[[../../CLAUDE|CLAUDE.md]] พร้อมขั้นตอน deploy เต็ม, อัปเดต `spec.md` ทุกจุดที่เกี่ยวกับสถานะ AI

**สิ่งที่ผู้ใช้ต้องทำเองก่อนใช้งานจริงได้** (agent/ผู้ประสานงานทำแทนไม่ได้ ต้อง login ด้วยบัญชี
Cloudflare ของผู้ใช้เอง): `wrangler login` → `wrangler secret put OPENROUTER_API_KEY` → `wrangler
deploy` → เอา URL ที่ได้ไปตั้งใน `ai-assist-config.js` แทน placeholder → deploy hosting ใหม่ (ดู
`cf-worker/README.md` สำหรับคำสั่งเต็ม)

**Part 3/5 เสร็จสมบูรณ์ในส่วนที่ทำได้โดยไม่ต้อง deploy จริง** — เหลือ 2 อย่างที่ผู้ประสานงาน/ผู้ใช้ต้อง
ทำต่อ: (1) ผู้ประสานงาน deploy `firestore.rules` ที่แก้ไว้ (2) ผู้ใช้ deploy Cloudflare Worker เอง

### 2026-09-23 — Access Log 90 วัน (BL-014) — Part 5/5 (ส่วนสุดท้าย) ของแผน "สร้างระบบตาม spec.md ให้ครบ"

รอบนี้ทำเฉพาะ **Access Log** (Part 4 = notification service ถูกข้ามไปแล้วตามที่ผู้ใช้ตกลง) — ต่อ
Worker เดียวกับ Part 3 (`cf-worker/`) แทนที่จะสร้าง Worker แยก เพราะแก้ปัญหาเดียวกัน (ต้องมี server
ที่เห็น IP จริง/verify token ได้)

**เพิ่ม endpoint `POST /log-access`** ใน `cf-worker/src/index.js` — ต่างจาก endpoint `/ai/*` เดิม
ตรงที่**ไม่บังคับต้องมี Firebase ID token** (ต้อง log ได้แม้ผู้เข้าชมไม่เคย login เลย ตามข้อบังคับ
พ.ร.บ. คอมพิวเตอร์ที่ครอบคลุมผู้ใช้งานทุกคน) อ่าน `CF-Connecting-IP`/`User-Agent` จาก request header
เอง (client ปลอมไม่ได้), verify ID token ถ้าแนบมา (ไม่บังคับ) เพื่อแนบ `user_account_id` ถ้ามี

**การตัดสินใจสำคัญที่สุดของรอบนี้ — วิธี enforce สิทธิ์เขียน `AccessLogs`**: เนื่องจากผู้เรียกอาจไม่มี
ID token เลย (anonymous) จึงใช้ ID token ของผู้เรียกเขียนแบบ endpoint อื่นไม่ได้ ตัดสินใจใช้
**Google service account ผ่าน OAuth2 JWT-bearer flow** (เซ็น JWT ด้วย Web Crypto `RSASSA-PKCS1-v1_5`
เอง ไม่มี library ช่วย เพราะ Node.js `google-auth-library` ใช้บน Cloudflare Workers ไม่ได้ — แลกเป็น
access token ที่ `oauth2.googleapis.com/token` แล้วเขียน Firestore REST API ด้วย token นั้น) วิธีนี้
**บายพาส `firestore.rules` ไปเลย** เหมือนที่ `firebase-admin`/`LSH/scripts/seed-firestore.js` ใช้อยู่
แล้ว จึงปิด `AccessLogs.create` เป็น `if false` สำหรับ client ปกติทุกคน (กันไม่ให้เขียนตรงได้นอกจาก
Worker นี้เท่านั้น) เปิด `read` เฉพาะ role=`teacher` (Data Controller ตาม Business Rule ที่ปิดแล้ว)
— ต้องมี secret ใหม่ `FIREBASE_SERVICE_ACCOUNT_JSON` (แนะนำสร้างใหม่จำกัดสิทธิ์แค่ "Cloud Datastore
User" ตาม least privilege ไม่ใช้ตัวเดิมที่ seed script ใช้ซึ่งอาจมีสิทธิ์กว้างกว่า)

**Retention 90 วันด้วย Firestore TTL policy** (ไม่ใช่ Cloud Functions/scheduled job) — พบระหว่างทำว่า
TTL ของ Firestore ลบตาม "ค่าที่เก็บใน field ตรงๆ" (ต้องเป็นเวลาหมดอายุจริง ไม่ใช่ระยะห่าง) จึงเพิ่ม
field แยก `expires_at` (= `timestamp` + 90 วัน) ไว้ให้ TTL policy อ่านโดยเฉพาะ แทนที่จะเอา `timestamp`
(เวลาที่เข้าใช้งานจริงตาม Business Rule ที่ใช้แสดงผลด้วย) ไปทำ TTL ตรงๆ ซึ่งจะผิดความหมาย — ปรับ
[[../02-design/02-technical/detailed-design|detailed-design.md]] § Sequence #7 จาก "retention job แบบ
loop ตรวจสอบเป็นรอบ" (ออกแบบไว้ก่อนรู้ตัวเลือก stack) เป็น Firestore TTL policy ให้ตรงกับ implementation จริง

**เพิ่ม `access-log.js`** — โมดูลเล็กๆ ที่ทุกหน้าใน `prototype-v2/` (ครบทั้ง 12 หน้า) เรียกตอนโหลด
(`fetch(..., {keepalive:true})` ไม่รอผล ไม่บล็อก UI) ยิง action ที่ไม่มีก็ยัง log ได้ (ไม่ throw) —
**ตัดสินใจว่าไม่ผูกกับ consent banner**: access log ตามพ.ร.บ. คอมพิวเตอร์เป็นข้อบังคับกฎหมายที่ทำกับ
ทุกคนเสมอ (FR-1 ของสเปคไม่มีเงื่อนไขผูกกับ Consent) ต่างจาก Google Analytics/IP tracking เพื่อการตลาด
ที่ต้องขอ Consent ก่อน (FR-2/3) จึงยิงทันทีไม่รอ banner ตอบก่อน — บันทึกการตีความนี้ไว้ให้ชัดเจนเผื่อ
มีคนสงสัยภายหลังว่าทำไมไม่เช็ค consent ก่อน log

**เพิ่มหน้าดู Access Log ให้อาจารย์** ใน `admin-review-student-work.html` (ไม่แยกหน้าใหม่ — ใช้
pattern เดียวกับ Part 1 ที่รวมการอนุมัติทุกอย่างไว้จุดเดียว) แสดง 50 รายการล่าสุด (เวลา/action/uid/IP)
เรียงตาม `timestamp` ล่าสุดก่อน ไม่ทำ pagination เพราะเป็นแค่มุมมองตรวจสอบเบื้องต้น ไม่ใช่เครื่องมือ
audit เต็มรูปแบบ

**ทดสอบผ่าน local `wrangler dev` จริง**:
- ยิง `/log-access` โดยไม่มี token / token ปลอม / ไม่มี `action` — ตอบ `{ok:true}` เร็ว (~5ms) ทุกกรณี
  ตามที่ตั้งใจ (ไม่เคยปฏิเสธ request นี้เลยไม่ว่ากรณีใด) ตรวจ log ฝั่ง server ยืนยันว่า background write
  ถูกเรียกจริงและ error แบบ "ยังไม่ได้ตั้งค่า FIREBASE_SERVICE_ACCOUNT_JSON" ถูก catch ไว้ไม่หลุดไปหา client
- **สร้าง service account ปลอมขึ้นมาทดสอบเฉพาะกิจ** (RSA keypair จริงด้วย `openssl`, ไม่ใช่ของจริงที่
  ผูกกับ Google Cloud project ใดๆ) ใส่ใน `.dev.vars` ชั่วคราวแล้วลบทิ้งหลังทดสอบเสร็จ — ยิง request ซ้ำ
  ได้ error `"Invalid grant: account not found"` จาก `oauth2.googleapis.com` ตรงๆ ซึ่ง**ยืนยันว่า JWT
  ที่เซ็นเองด้วย Web Crypto ถูกต้องสมบูรณ์ทุกขั้นตอน** (encode/sign/ส่งไปหา Google สำเร็จ) มีแค่บัญชีที่
  ไม่มีอยู่จริงเท่านั้นที่ทำให้ไม่ผ่าน — เป็นการทดสอบที่ใกล้เคียง end-to-end ที่สุดเท่าที่ทำได้โดยไม่มี
  บัญชี Google Cloud จริง
- ทดสอบผ่าน headless Chromium (Playwright ตรง เหมือน Part 2/3 เพราะ MCP ยังไม่กลับมา) ครบทั้ง 12 หน้า
  ของ `prototype-v2/` หลังเพิ่ม `access-log.js`/`ai-assist-config.js` เข้าไป — **ไม่มี JS error เลยสักหน้า**
- login อาจารย์จริงแล้วเช็คส่วน "Access Log" หน้าใหม่ — ขึ้น empty-state ที่ถูกต้อง (permission-denied
  ตามคาด เพราะ `firestore.rules` ที่แก้ยังไม่ได้ deploy ในรอบนี้) ไม่มี JS error หลุดออกมา

**อัปเดตเอกสาร**: [[../02-design/02-technical/architecture|architecture.md]] § Mapping (เพิ่ม
`AccessLogs`), [[../01-requirements/03-task/product-backlog|product-backlog]] (BL-014 → เสร็จแล้ว),
`cf-worker/README.md` (endpoint ใหม่, service account setup, TTL policy setup), `CLAUDE.md` (หัวข้อ
"Access Log" ใหม่ + อัปเดต collection list), `spec.md`

**สิ่งที่ผู้ใช้ต้องทำเองก่อนใช้งานจริงได้** (เหมือน Part 3 — ต้องใช้บัญชี Cloudflare/Firebase Console
ของผู้ใช้เอง): `wrangler secret put FIREBASE_SERVICE_ACCOUNT_JSON` (ต่อจาก `OPENROUTER_API_KEY` เดิม
ถ้ายังไม่ deploy Worker จาก Part 3) → `wrangler deploy` → ตั้งค่า Firestore TTL policy ผ่าน Firebase
Console บน field `expires_at` ของ collection `AccessLogs` (ต้องมีเอกสารอย่างน้อย 1 ชิ้นก่อน Console
ถึงจะเห็น collection — เข้าเว็บสักครั้งหลัง deploy) — ดูขั้นตอนเต็มที่ `cf-worker/README.md`

**เหลือให้ผู้ประสานงานทำต่อ**: deploy `firestore.rules` ที่แก้ไว้ (เพิ่ม rule `AccessLogs`) — ยังไม่ได้
deploy ในรอบนี้ (fork ตามกฎเดิมของ Part 1-3 คือแก้ไฟล์ไว้ให้ผู้ประสานงานรีวิว+deploy เอง)

**Part 5/5 เสร็จสมบูรณ์ในส่วนที่ทำได้โดยไม่ต้อง deploy จริง — ครบทั้ง 5 ส่วนของแผน "สร้างระบบตาม
spec.md ให้ครบ" แล้ว** (ชุมชน, นักท่องเที่ยว, AI backend, [ข้าม notification], Access Log) เหลือ
ขั้นตอน deploy จริงที่ต้องทำโดยผู้ประสานงาน (`firestore.rules`) และผู้ใช้ (`wrangler` ทั้งหมด, ตั้งค่า
TTL policy) ตามที่ระบุไว้ในแต่ละ Part
