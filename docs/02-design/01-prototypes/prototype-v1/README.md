# Prototype v1

- **สถานะ**: ปิด Open Question ที่เคยกระทบทุกหน้าจอในเวอร์ชันนี้ครบแล้วเมื่อ 2026-09-22 ([[../../../01-requirements/03-task/open-questions|open-questions]] เหลือ 0 ข้อทั้งโปรเจกต์) — `community-dashboard.html`/`community-create-content.html`/`student-publish.html`/`admin-review-student-work.html`/`tourist-home-consent.html`/`tourist-search-results.html`/`tourist-story-detail.html` เป็น mockup รุ่นแรก (`localStorage` เท่านั้น) ที่ถูกแทนที่ด้วยเวอร์ชันจริงแล้ว — ดู [[../prototype-v2/README|prototype-v2]] (นิสิต/อาจารย์/ชุมชน/นักท่องเที่ยว ต่อ Firebase Auth + Firestore จริงทั้งหมดแล้ว ณ 2026-09-23) และ [[../prototype-v3/README|prototype-v3]] (mockup รุ่นสองของชุมชน ก็ superseded เช่นกัน) — ไฟล์ในโฟลเดอร์นี้คงไว้เป็นประวัติ ไม่ได้ลบ
- **อ้างอิงจาก**: [[../DESIGN|DESIGN.md]] (design system), [[../../../01-requirements/03-task/product-backlog|product-backlog]], [[../../../01-requirements/03-task/feature-list|feature-list]]
- **ขอบเขต**: ทั้งระบบ — ครอบคลุมทั้ง 3 persona

เปิดไฟล์ HTML ตรงจากเบราว์เซอร์ได้เลย ไม่ต้อง build (self-contained, โหลดฟอนต์ Sarabun จาก Google Fonts เท่านั้น) — path เต็ม: `docs/02-design/01-prototypes/prototype-v1/`

**Interactive**: ทุกหน้าจอมีพฤติกรรมจริง ไม่ใช่แค่ static mockup —
- Consent (`tourist-home-consent.html`): ปุ่มยินยอมทั้งหมด/ปฏิเสธที่ไม่จำเป็น (แบบเดียว ไม่ใช่ granular — ปิด Open Question แล้ว 2026-09-22 ตัดปุ่ม "ตั้งค่า" แบบ granular เดิมออก) บันทึกลง `localStorage` จริง แล้วสถานะแสดงเป็น badge ที่ header ของทุกหน้าฝั่งนักท่องเที่ยว
- ค้นหา (`tourist-search-results.html`): ช่องค้นหากรองการ์ดผลลัพธ์แบบ live พร้อม empty state
- สมัคร/เข้าสู่ระบบ (`tourist-login.html` — **เพิ่ม 2026-09-22**): สมัครบัญชี + login แบบสาธิต (จำลองด้วย `localStorage`) รองรับ `?redirect=` เพื่อพากลับไปหน้าที่เรียกมาหลัง login สำเร็จ
- รายละเอียดสถานที่ (`tourist-story-detail.html`): สลับภาษาไทย/อังกฤษได้จริง, ปุ่มบันทึกสถานที่โปรด toggle และจำสถานะข้ามการโหลดหน้าใหม่ (`localStorage`), โพสต์รีวิวใหม่ขึ้นในรายการทันทีโดยไม่ reload — **แก้ไข 2026-09-22**: ทั้งบันทึกสถานที่โปรดและเขียนรีวิวต้อง login ก่อนเสมอ (เดิมทำได้โดยไม่ต้อง login ไม่ตรงกับ decision 2026-08-28) ยังไม่ login จะถูกพาไปหน้า `tourist-login.html` ก่อน
- สร้างคอนเทนต์ (`community-create-content.html`): ปุ่ม AI ทุกปุ่มมีผลลัพธ์จริง (ปรับภาพมี loading state, คิดแคปชันสลับข้อความจริง, แนะนำเรื่องเล่า/แปลภาษาแสดงผลลัพธ์), กดเผยแพร่/บันทึกร่างแล้ว**ไปโผล่ในตาราง `community-dashboard.html` จริง** (เชื่อมข้อมูลข้ามหน้าผ่าน `localStorage`)
- เผยแพร่ผลงานนิสิต (`student-publish.html`): ตรวจสอบฟอร์ม (ต้องกรอกชื่อผลงานก่อน) แล้วแสดงหน้าจอสำเร็จจริงเมื่อ "ส่งขออนุมัติ" (ไม่ใช่เผยแพร่ทันที — แก้ไข 2026-09-04) — บันทึกผลงานลง `localStorage` จริง (`lsh_student_works`) ที่ `admin-review-student-work.html` อ่านต่อได้
- ตรวจสอบผลงานนิสิต (`admin-review-student-work.html` — **เพิ่ม 2026-09-04**): อาจารย์เห็นรายการผลงานรออนุมัติจริง (รวมทั้งของที่นิสิตเพิ่งส่งจาก `student-publish.html`), กดอนุมัติแล้วย้ายไปช่อง "ประวัติการตรวจสอบ" ทันที, กดไม่อนุมัติต้องกรอกเหตุผลก่อนจึงยืนยันได้ — ทุกการเปลี่ยนสถานะบันทึกจริงผ่าน `localStorage` เดียวกับหน้าเผยแพร่

## หน้าจอในเวอร์ชันนี้

### นักท่องเที่ยว — อ้างอิงจาก [[../tourist-journey|tourist-journey]]

| ไฟล์ | อ้างอิง | หมายเหตุ |
|---|---|---|
| `tourist-home-consent.html` | FR-2, FR-3 ([[../../../01-requirements/01-spec/20260822-01-it-log-pdpa-consent\|20260822-01-it-log-pdpa-consent]]) | ปิด Open Question แล้ว 2026-09-22 (Consent แบบเดียว) |
| `tourist-search-results.html` | FR-2.1 ([[../../../01-requirements/01-spec/local-story-hub\|local-story-hub]]) | — |
| `tourist-login.html` | FR-2.4, FR-2.5 (login เต็มรูปแบบตาม Decision Log 2026-08-28) | **เพิ่ม 2026-09-22** |
| `tourist-story-detail.html` | FR-2.2–2.5 | ปิด Open Question ภาษา/TTS แล้ว 2026-09-22 (รองรับเฉพาะไทย-อังกฤษ, ข้อความแปลอย่างเดียวไม่มีเสียงพากย์) · **แก้ไข 2026-09-22**: รีวิว/บันทึกสถานที่ต้อง login ก่อนเสมอ |

### ชุมชน — อ้างอิงจาก [[../community-content-journey|community-content-journey]]

| ไฟล์ | อ้างอิง | หมายเหตุ |
|---|---|---|
| `community-dashboard.html` | FR-1.6 | ปิด Open Question แล้ว 2026-09-22 (ขอบเขต = เฉพาะคอนเทนต์) — เป็น mockup รุ่นแรก **ไม่ได้อัปเดตให้ตรงกับ decision** เรื่อง shared data/สมัคร-อนุมัติบัญชีชุมชน/คำขอแก้ไข ดูเวอร์ชันที่ตรงกันที่ [[../prototype-v3/README|prototype-v3]] แทน |
| `community-create-content.html` | FR-1.1–1.5, FR-1.7 | ปิด Open Question แล้ว 2026-09-22 (SEO = แนะนำ keyword ในระบบเท่านั้น, แปลภาษา = ข้อความอย่างเดียวไม่มี TTS) — ดูเวอร์ชันล่าสุดที่ตรงกับ decision ที่ [[../prototype-v3/README|prototype-v3]] |

### นิสิตนิเทศศาสตร์ — อ้างอิงจาก [[../student-content-journey|student-content-journey]]

| ไฟล์ | อ้างอิง | หมายเหตุ |
|---|---|---|
| `student-publish.html` | FR-3.1 | ปิด Open Question แล้ว 2026-09-22 (เชื่อมโยงชุมชน = เลือกจาก dropdown) · **แก้ไข 2026-09-04**: ตอนนี้ต้องผ่านการอนุมัติจากอาจารย์ก่อนเผยแพร่ (กลับคำตัดสินใจเดิม) — เวอร์ชันนี้ยังใช้ `localStorage` จำลอง ดูเวอร์ชันที่ต่อ Firestore จริงที่ [[../prototype-v2/README|prototype-v2]] |
| `admin-review-student-work.html` | FR-3.1, BL-018 | **เพิ่ม 2026-09-04** — ปิด Open Question แล้ว 2026-09-22 (จำนวนครั้งส่งใหม่ = ไม่จำกัด) — เวอร์ชันนี้ยังใช้ `localStorage` จำลอง ดูเวอร์ชันที่ต่อ Firestore จริงที่ [[../prototype-v2/README|prototype-v2]] |

## Design tokens ที่ใช้

สี (earth tone), Sarabun เป็นฟอนต์เดียวทั้งระบบ (body ฐาน 18px), ปุ่มขั้นต่ำ 48px, มุมโค้งน้อย/ไม่ใช้เงาเป็นหลัก, Consent banner ปุ่มยินยอม/ปฏิเสธน้ำหนักเท่ากัน — ตามที่ระบุใน [[../DESIGN|DESIGN.md]] ทุกจุด
