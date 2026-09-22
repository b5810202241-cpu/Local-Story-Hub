# Local Story Hub — สรุปสถานะ Module ปัจจุบัน (spec.md)

> เอกสารนี้เป็น **สรุปภาพรวม** ที่ประมวลจากเอกสารที่มีอยู่แล้วในโปรเจกต์ (ไม่มีไฟล์ชื่อ `SCOPE.md` ในโปรเจกต์นี้โดยตรง — เนื้อหา "ขอบเขต (Scope)" อยู่ในไฟล์ `docs/01-requirements/01-spec/local-story-hub.md` แทน) และจากซอร์สโค้ด prototype จริงใน `docs/02-design/01-prototypes/` รวมถึง `docs/02-design/02-technical/architecture.md`, `ACL.md`, และ `CLAUDE.md`
>
> วันที่สรุป: 2026-09-22 — ตัวเอกสารต้นทางบางไฟล์อาจอัปเดตหลังจากนี้ ให้ใช้ไฟล์ต้นทางเป็น source of truth เสมอ

---

## 1. หน้าจอที่มีอยู่ (Screens)

### 1.1 Prototype v2 — ใช้งานได้จริง เชื่อม Firestore project `lsh-nammon` จริง (deploy แล้วที่ `lsh-nammon.web.app`)

อยู่ที่ `docs/02-design/01-prototypes/prototype-v2/` — ครอบคลุมเฉพาะ persona **นิสิต** + **อาจารย์** + **บุคคลทั่วไป (ไม่ login)** เท่านั้น:

| หน้าจอ | ไฟล์ | ผู้ใช้เป้าหมาย | สถานะ |
|---|---|---|---|
| สมัครสมาชิก + ส่งผลงานขออนุมัติ | `student-publish.html` | นิสิต | ใช้งานจริง (login จริงด้วย Firebase Auth, มีปุ่ม AI ช่วยร่างคำอธิบายผลงาน) |
| ตรวจสอบ/อนุมัติผลงาน + อนุมัติบัญชีผู้ใช้ใหม่ | `admin-review-student-work.html` | อาจารย์ (`role: teacher`) | ใช้งานจริง (มีปุ่ม AI สรุปภาพรวมผลงานที่รอพิจารณา) |
| ดู/ค้นหาผลงานที่เผยแพร่แล้ว | `published-works.html` | บุคคลทั่วไป (ไม่ต้อง login) | ใช้งานจริง — public read |
| หน้ารวม | `index.html` | — | จุดเข้าใช้งาน |

### 1.2 Prototype v1 — mockup เท่านั้น (จำลองข้อมูลด้วย `localStorage`, ไม่เชื่อมฐานข้อมูลจริง)

อยู่ที่ `docs/02-design/01-prototypes/prototype-v1/` — ครอบคลุมทั้ง 3 กลุ่มเป้าหมายในเชิง mockup:

| หน้าจอ | ไฟล์ | ผู้ใช้เป้าหมาย |
|---|---|---|
| หน้าแรก + Consent | `tourist-home-consent.html` | นักท่องเที่ยว |
| ผลการค้นหา | `tourist-search-results.html` | นักท่องเที่ยว |
| รายละเอียดเรื่องราว/สถานที่ | `tourist-story-detail.html` | นักท่องเที่ยว |
| แดชบอร์ดชุมชน | `community-dashboard.html` | ชุมชน |
| สร้างคอนเทนต์ (พร้อมปุ่ม AI: ปรับภาพ/แคปชัน/แปล/SEO/แนะนำ) | `community-create-content.html` | ชุมชน |
| ส่งผลงานขออนุมัติ | `student-publish.html` | นิสิต |
| ตรวจสอบ/อนุมัติผลงาน | `admin-review-student-work.html` | อาจารย์ |

**สรุป**: หน้าจอฝั่ง **นักท่องเที่ยว** และ **ชุมชน** ยังเป็นแค่ mockup ที่ยังไม่เชื่อมฐานข้อมูลจริง มีแค่ฝั่ง **นิสิต/อาจารย์/บุคคลทั่วไป** เท่านั้นที่ implement จริงจนถึงตอนนี้

---

## 2. โครงสร้างข้อมูล (Data Structures)

โปรเจกต์นี้มี **2 ชุด schema คู่ขนานกัน** ที่ผู้ใช้ตัดสินใจแล้ว (2026-09-11) ว่า **ยังไม่รวมเป็นชุดเดียวกัน**:

### 2.1 Entity เชิงแนวคิด (conceptual — ยังไม่ผูก tech stack) — `architecture.md`

- **UserAccount** — บัญชีผู้ใช้เดียวสำหรับทั้ง 4 role (`community` / `tourist` / `student` / `admin`)
- **Community** — ข้อมูลชุมชน
- **Content** — เรื่องราว/คอนเทนต์ของชุมชน (รองรับผลลัพธ์จาก AI: แปลภาษา, ปรับภาพ, แคปชัน, SEO keyword)
- **Review** — รีวิวจากนักท่องเที่ยว
- **Bookmark** — สถานที่โปรดที่นักท่องเที่ยวบันทึกไว้
- **StudentWork** — ผลงานของนิสิตนิเทศศาสตร์ (มี status: pending_approval / published / rejected)
- **ConsentRecord** — หลักฐานการให้ความยินยอม (PDPA)
- **AccessLog** — บันทึกการเข้าใช้งานตาม พ.ร.บ. คอมพิวเตอร์ (เก็บอย่างน้อย 90 วัน)

### 2.2 Collection ที่มีอยู่จริงใน Firestore (`lsh-nammon`) — ใช้งานจริงโดย prototype v2

| Collection | คำอธิบาย |
|---|---|
| `users` | บัญชีผู้ใช้จริง (`name`, `email`, `role`, และเฉพาะนิสิต: `status`, `approverId`, `approverName`, `rejectionReason`) |
| `ContentTypes` | ประเภทผลงาน (VOD / album photo / Storytelling) — **ไม่มีที่มาจาก requirement ใดๆ เลย เป็นข้อมูลเฉพาะกิจ** |
| `LSHRequests` | ผลงานที่นิสิตส่ง (`title`, `Content`, `status`, `requesterId/Name`, `approverId/Name`, `community`, `rejectionReason`, `aiAssisted`, `aiSuggestionText`, `createdAt`) — คือ `StudentWork` เชิงแนวคิด แต่คนละชื่อ field/ภาษา |
| `AiSummaries` | ผลสรุปภาพรวมจาก AI ที่อาจารย์ใช้ดูก่อนตรวจงาน (เพิ่ม 2026-09-19) |
| `AiAssistLogs` | log ทุกครั้งที่มีการเรียกใช้ AI ช่วยงาน |

⚠️ **ไม่ตรงกัน 1:1** — เช่น role อาจารย์จริงคือ `teacher` (ไม่ใช่ `admin` แบบ conceptual), field ชื่อคนละภาษา/คนละ convention (denormalized vs reference) ดูตาราง mapping เต็มได้ที่ `architecture.md` § "Mapping กับข้อมูลจริงใน Firestore"

---

## 3. บทบาทผู้ใช้ (User Roles)

### ตามสเปคต้นทาง (3 กลุ่มเป้าหมายหลัก + 1 บทบาทดูแลระบบที่เพิ่มภายหลัง)

| บทบาท | คำอธิบาย | สถานะการ implement |
|---|---|---|
| **ชุมชน** (`community`) | เจ้าของเรื่องราว/แหล่งท่องเที่ยว | มีแค่ mockup (prototype-v1), สิทธิ์การเข้าถึงยังเป็น Open Question |
| **นักท่องเที่ยว** (`tourist`) | ผู้สืบค้น/วางแผนท่องเที่ยว, เขียนรีวิว, บันทึกสถานที่โปรด | มีแค่ mockup (prototype-v1), ยังไม่มีระบบบัญชีจริง |
| **นิสิตนิเทศศาสตร์** (`student`) | ส่งผลงานคอนเทนต์เพื่อขออนุมัติเผยแพร่ | **ใช้งานจริง** — สมัครบัญชีเองได้ (self-registration), ต้องรออนุมัติก่อนใช้งาน |
| **อาจารย์** (`role: teacher` ใน Firestore จริง / `admin` ในเอกสารเชิงแนวคิด) | ตรวจสอบ/อนุมัติผลงานนิสิต, อนุมัติบัญชีนิสิตใหม่ | **ใช้งานจริง** — บัญชี provision โดย admin เท่านั้น ไม่มี self-registration |
| **บุคคลทั่วไป** (ไม่ login) | ดู/ค้นหาผลงานนิสิตที่เผยแพร่แล้วเท่านั้น | **ใช้งานจริง** (เพิ่ม 2026-09-12) — แคบกว่า "นักท่องเที่ยว" เต็มรูปแบบ (ไม่มีสิทธิ์รีวิว/บันทึกสถานที่) |

> รายละเอียดสิทธิ์แบบละเอียด (ทำได้/ทำไม่ได้ต่อบทบาท) อยู่ที่ `docs/02-design/02-technical/ACL.md`

---

## 4. สิ่งที่ยัง**ไม่ได้ทำ** ใน Module นี้ (Not Done / Out of Scope)

เอกสาร requirement ต้นฉบับ**ไม่ได้ระบุรายการ "Out of scope" ไว้อย่างชัดเจน** (ยังเป็น Open Question ที่ค้างอยู่) แต่จากการตรวจโค้ด/เอกสารจริง สรุปสิ่งที่ยังไม่ทำได้ดังนี้:

### 4.1 ฟีเจอร์ที่ยังไม่ implement จริง (มีแค่เอกสาร/mockup)
- **AI ทั้งหมดฝั่งชุมชน** (FR-1.1–1.5): ปรับภาพ, คิดแคปชัน, แปลภาษา, แนะนำ SEO, แนะนำวิธีเล่าเรื่อง — มีปุ่มใน prototype-v1 เท่านั้น ไม่เชื่อม AI service จริง
- **ระบบจัดการข้อมูลของชุมชน** (FR-1.6) และ **แดชบอร์ดชุมชน** — mockup เท่านั้น
- **การสืบค้น/วางแผนท่องเที่ยว, หมุดหมายเดินทาง** (FR-2.1–2.3) — mockup เท่านั้น
- **เขียนรีวิว / บันทึกสถานที่โปรด** (FR-2.4–2.5) — mockup เท่านั้น ไม่มีระบบบัญชีนักท่องเที่ยวจริง
- **Notification Service ส่งอีเมลจริง** — ปัจจุบันจำลองด้วยแบนเนอร์แจ้งเตือนในหน้าอาจารย์เท่านั้น ยังไม่มีบริการส่งอีเมลจริง
- **Consent & Log Service ที่ครบระบบ** (บันทึก consent, access log 90 วัน) — ยังไม่ implement เป็นโค้ดจริง มีแค่ระบุไว้ใน spec/architecture

### 4.2 สิ่งที่ทำแบบจำกัด/ชั่วคราวเท่านั้น
- **ปุ่ม AI ช่วยงาน 2 จุด** ใน prototype-v2 (ช่วยร่างคำอธิบายผลงาน, สรุปภาพรวมงานรอพิจารณา) เป็น **local demo เท่านั้น** — เรียก OpenRouter API ตรงจาก browser (มี API key ฝัง client-side) **ยังไม่เหมาะ deploy ใช้งานจริง** ต้องย้ายไปเรียกผ่าน backend/serverless proxy ก่อน
- **ระบบ login เป็นบัญชีสาธิต (demo)** — 4 บัญชีทดสอบ (u001-u004) ใช้รหัสผ่านเดียวกันทุกบัญชี **ยังไม่ได้ลบทิ้งก่อนขึ้นระบบจริง**
- **บัญชีอาจารย์ยัง provision โดย admin เท่านั้น** ไม่มีระบบสมัคร/อนุมัติบัญชีอาจารย์แบบเดียวกับนิสิต

### 4.3 Open Questions ที่ยังไม่ปิด (กระทบ scope โดยตรง — ต้องถามอาจารย์ที่ปรึกษา/ตัวแทนชุมชนก่อนออกแบบต่อ)
- แพลตฟอร์มสุดท้ายจะเป็น Website, Application มือถือ, หรือทั้งสองอย่าง
- สิทธิ์การเข้าถึงของแต่ละชุมชน (multi-tenant) และการยืนยันตัวตนชุมชนเพื่อกันมิจฉาชีพแอบอ้าง
- ขอบเขตจริงของ "ระบบจัดการข้อมูลชุมชน" (จัดการข้อมูลประเภทใดได้บ้าง)
- SEO ต้องเชื่อม search engine จริงหรือแค่แนะนำ keyword ภายในระบบ
- ภาษาที่รองรับ (ไทย-อังกฤษเท่านั้น หรือมากกว่านั้น), ต้องมี text-to-speech หรือข้อความแปลอย่างเดียว
- จำนวนครั้งที่นิสิตส่งผลงานใหม่ได้หลังไม่ผ่านอนุมัติ (สมมติไว้ชั่วคราวว่าไม่จำกัด)
- Non-functional requirements: performance, จำนวนผู้ใช้ที่รองรับ, ความปลอดภัยของข้อมูล, data privacy/PDPA แบบละเอียด (granular consent, ระยะเวลา/สิทธิ์เข้าถึง log ฯลฯ)

รายการเต็มดูได้ที่ `docs/01-requirements/03-task/open-questions.md` และท้ายไฟล์ `docs/01-requirements/01-spec/local-story-hub.md`

---

## แหล่งอ้างอิงที่ใช้สรุปเอกสารนี้

- `docs/01-requirements/01-spec/local-story-hub.md` — สเปคหลัก + ขอบเขต (Scope) + Open Questions
- `docs/02-design/02-technical/architecture.md` — Component, Data Flow, Database Schema, API Spec
- `docs/02-design/02-technical/ACL.md` — ตารางสิทธิ์ตามบทบาท
- `docs/02-design/01-prototypes/prototype-v1/README.md`, `prototype-v2/README.md` — รายละเอียดหน้าจอ/การ implement จริง
- `docs/01-requirements/03-task/feature-list.md`, `open-questions.md`
- `CLAUDE.md` (root) — สถานะโปรเจกต์ปัจจุบัน, Firestore collections จริง
