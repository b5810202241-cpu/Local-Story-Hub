# 01 - Prototypes

เก็บ **ต้นแบบหน้าตาของระบบ (UI/UX Prototype)** เช่น

- Wireframe / mockup ของแต่ละหน้าจอ
- User flow และ navigation flow
- Design system เบื้องต้น เช่น สี ฟอนต์ คอมโพเนนต์หลัก

ใช้สำหรับสื่อสารและตกลงหน้าตาของระบบก่อนลงมือพัฒนาจริง โดยอ้างอิงความต้องการจาก [[../../01-requirements/01-spec/index|01-spec]] และส่งต่อรายละเอียดเชิงระบบให้ [[../02-technical/index|02-technical]]

## เอกสารในหมวดนี้

- [[DESIGN|DESIGN.md]] — Design System (Brand Identity, Design Tokens, UI Components) แนวทาง earth tone / minimalist / Muji-inspired

> สถานะ (Confirmed/DRAFT) ระบุไว้ต่อท้ายแต่ละ journey ด้านล่าง — journey ที่ยังเป็น DRAFT (บางส่วนหรือทั้งหมด) ขึ้นกับ Open Question ที่ยังไม่ปิด (ดู [[../../01-requirements/03-task/open-questions|open-questions]]) ต้องยืนยันกับผู้มีส่วนได้ส่วนเสียก่อนถือเป็นเวอร์ชันสุดท้าย

- [[tourist-journey|tourist-journey]] — นักท่องเที่ยว: ค้นหาและวางแผนเที่ยวชุมชน (Confirmed — เพิ่ม 2026-09-22 ปิด Open Question ครบทุกจุดแล้ว มีความไม่สอดคล้องเรื่อง login ค้างแยกต่างหาก)
- [[community-content-journey|community-content-journey]] — ชุมชน: สร้างและเผยแพร่คอนเทนต์ด้วย AI (Confirmed — เพิ่ม 2026-09-22 ปิด Open Question ครบทุกจุดแล้ว)
- [[community-account-registration-journey|community-account-registration-journey]] — ชุมชน: สมัคร/อนุมัติบัญชีชุมชนใหม่ (Confirmed — เพิ่ม 2026-09-22)
- [[community-content-edit-request-journey|community-content-edit-request-journey]] — ชุมชน: ขอแก้ไขข้อมูล/คอนเทนต์ที่เผยแพร่แล้ว ต้องผ่านอนุมัติ (Confirmed — เพิ่ม 2026-09-22)
- [[student-content-journey|student-content-journey]] — นิสิตนิเทศศาสตร์: สร้างและเผยแพร่ผลงานสนับสนุนชุมชน (Confirmed — ปิด Open Question ครบทุกจุดแล้วเมื่อ 2026-09-22)
- [[student-account-registration-journey|student-account-registration-journey]] — นิสิต: สมัคร/อนุมัติบัญชีผู้ใช้ใหม่ (Confirmed — เพิ่ม 2026-09-22 ปิดช่องว่างที่ implement จริงแล้วใน prototype-v2 แต่ไม่เคยมี journey รองรับ)
- [[public-view-search-journey|public-view-search-journey]] — บุคคลทั่วไป (ไม่ login): ดู/ค้นหาผลงานนิสิตที่เผยแพร่แล้ว (Confirmed — ปิด Open Question ครบทุกจุดแล้วเมื่อ 2026-09-22)
- [[prototype-v1/README|prototype-v1]] — Prototype HTML ทั้งระบบ (6 หน้าจอ, 3 persona) สร้างจาก DESIGN.md + journey ทั้งหมดข้างต้น
- [[prototype-v2/README|prototype-v2]] — ต่อยอดจาก v1 เฉพาะ 2 หน้าจอฝั่งนิสิต/อาจารย์ (`student-publish.html`, `admin-review-student-work.html`) เปลี่ยนจาก `localStorage` เป็นเชื่อม Firestore project `lsh-nammon` จริง
- [[prototype-v3/README|prototype-v3]] — เฉพาะฝั่งชุมชน (5 หน้าจอ) ตาม Business Rules ที่ปิด Open Question เมื่อ 2026-09-22 — ยังใช้ `localStorage` จำลอง (ยังไม่มี collection จริงรองรับ)
