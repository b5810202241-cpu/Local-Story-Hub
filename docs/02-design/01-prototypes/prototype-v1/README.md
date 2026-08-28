# Prototype v1

- **สถานะ**: DRAFT — บางหน้าจอมีจุดที่ขึ้นกับ Open Question ยังไม่ปิด (ดูรายละเอียดที่ [[../../../01-requirements/03-task/open-questions|open-questions]])
- **อ้างอิงจาก**: [[../DESIGN|DESIGN.md]] (design system), [[../../../01-requirements/03-task/product-backlog|product-backlog]], [[../../../01-requirements/03-task/feature-list|feature-list]]
- **ขอบเขต**: ทั้งระบบ — ครอบคลุมทั้ง 3 persona

เปิดไฟล์ HTML ตรงจากเบราว์เซอร์ได้เลย ไม่ต้อง build (self-contained, โหลดฟอนต์ Sarabun จาก Google Fonts เท่านั้น) — path เต็ม: `docs/02-design/01-prototypes/prototype-v1/`

## หน้าจอในเวอร์ชันนี้

### นักท่องเที่ยว — อ้างอิงจาก [[../tourist-journey|tourist-journey]]

| ไฟล์ | อ้างอิง | หมายเหตุ |
|---|---|---|
| `tourist-home-consent.html` | FR-2, FR-3 ([[../../../01-requirements/01-spec/20260822-01-it-log-pdpa-consent\|20260822-01-it-log-pdpa-consent]]) | DRAFT — รูปแบบ Consent ยังไม่ปิด |
| `tourist-search-results.html` | FR-2.1 ([[../../../01-requirements/01-spec/local-story-hub\|local-story-hub]]) | — |
| `tourist-story-detail.html` | FR-2.2–2.5 | DRAFT — ภาษา/TTS ยังไม่ปิด |

### ชุมชน — อ้างอิงจาก [[../community-content-journey|community-content-journey]]

| ไฟล์ | อ้างอิง | หมายเหตุ |
|---|---|---|
| `community-dashboard.html` | FR-1.6 | DRAFT — ขอบเขตระบบจัดการข้อมูลยังไม่ปิด |
| `community-create-content.html` | FR-1.1–1.5, FR-1.7 | DRAFT — SEO และรูปแบบแปลภาษายังไม่ปิด |

### นิสิตนิเทศศาสตร์ — อ้างอิงจาก [[../student-content-journey|student-content-journey]]

| ไฟล์ | อ้างอิง | หมายเหตุ |
|---|---|---|
| `student-publish.html` | FR-3.1 | DRAFT — วิธีเชื่อมโยงกับชุมชนยังไม่ปิด (การอนุมัติก่อนเผยแพร่ตอบแล้ว — ไม่ต้องอนุมัติ) |

## Design tokens ที่ใช้

สี (earth tone), Sarabun เป็นฟอนต์เดียวทั้งระบบ (body ฐาน 18px), ปุ่มขั้นต่ำ 48px, มุมโค้งน้อย/ไม่ใช้เงาเป็นหลัก, Consent banner ปุ่มยินยอม/ปฏิเสธน้ำหนักเท่ากัน — ตามที่ระบุใน [[../DESIGN|DESIGN.md]] ทุกจุด
