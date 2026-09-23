# Local Story Hub — สรุปสถานะ Module ปัจจุบัน (spec.md)

> เอกสารนี้เป็น **สรุปภาพรวม** ที่ประมวลจากเอกสารที่มีอยู่แล้วในโปรเจกต์ (ไม่มีไฟล์ชื่อ `SCOPE.md` ในโปรเจกต์นี้โดยตรง — เนื้อหา "ขอบเขต (Scope)" อยู่ในไฟล์ `docs/01-requirements/01-spec/local-story-hub.md` แทน) และจากซอร์สโค้ด prototype จริงใน `docs/02-design/01-prototypes/` รวมถึง `docs/02-design/02-technical/architecture.md`, `ACL.md`, และ `CLAUDE.md`
>
> วันที่สรุป: 2026-09-22 (อัปเดตส่วนชุมชน + แก้ไขหัวข้อ Open Questions ที่ล้าหลัง 2026-09-23) — ตัวเอกสารต้นทางบางไฟล์อาจอัปเดตหลังจากนี้ ให้ใช้ไฟล์ต้นทางเป็น source of truth เสมอ

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
| สมัคร/เข้าสู่ระบบชุมชน + จัดการคอนเทนต์ + ขอแก้ไข | `community-register.html`, `community-dashboard.html`, `community-create-content.html`, `community-request-edit.html` | ชุมชน | **เพิ่ม 2026-09-23** — ใช้งานจริง (login จริงด้วย Firebase Auth, เชื่อม Firestore จริง collection `CommunityContent`/`ContentEditRequests`) — `firestore.rules` deploy แล้ว ทดสอบ end-to-end ผ่าน browser จริงครบ flow แล้ว (ดู `05-log/index.md` 2026-09-23) — ปุ่ม AI ปิดใช้งานชั่วคราวรอ Part 3 |
| อนุมัติบัญชีชุมชน + คำขอแก้ไขข้อมูลชุมชน | `admin-review-student-work.html` (ขยายจากเดิม) | อาจารย์ | **เพิ่ม 2026-09-23** — รวมอยู่ในหน้าเดียวกับการอนุมัติผลงานนิสิต/บัญชีนิสิต |

### 1.2 Prototype v1 — mockup เท่านั้น (จำลองข้อมูลด้วย `localStorage`, ไม่เชื่อมฐานข้อมูลจริง)

อยู่ที่ `docs/02-design/01-prototypes/prototype-v1/` — ครอบคลุมทั้ง 3 กลุ่มเป้าหมายในเชิง mockup:

| หน้าจอ | ไฟล์ | ผู้ใช้เป้าหมาย |
|---|---|---|
| หน้าแรก + Consent | `tourist-home-consent.html` | นักท่องเที่ยว |
| ผลการค้นหา | `tourist-search-results.html` | นักท่องเที่ยว |
| รายละเอียดเรื่องราว/สถานที่ | `tourist-story-detail.html` | นักท่องเที่ยว |
| ส่งผลงานขออนุมัติ | `student-publish.html` | นิสิต |
| ตรวจสอบ/อนุมัติผลงาน | `admin-review-student-work.html` | อาจารย์ |

> **หมายเหตุ**: หน้าจอฝั่งชุมชนใน `prototype-v1` (`community-dashboard.html`, `community-create-content.html`) ถูกแทนที่ด้วยเวอร์ชันที่เชื่อม Firebase จริงใน `prototype-v2` แล้ว (ดูตารางด้านบน) — ดูรายละเอียดที่ [[../prototype-v3/README|prototype-v3]] (mockup ที่ถูก superseded)

**สรุป**: หน้าจอฝั่ง **นักท่องเที่ยว** ยังเป็นแค่ mockup ที่ยังไม่เชื่อมฐานข้อมูลจริง (จะทำใน Part 2 ถัดไป) — ฝั่ง **นิสิต/อาจารย์/บุคคลทั่วไป/ชุมชน** implement จริงแล้วจนถึงตอนนี้ (2026-09-23)

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
| `users` | บัญชีผู้ใช้จริง (`name`, `email`, `role`) — นิสิต+ชุมชน (role `student`/`community`) มีเพิ่ม `status`, `approverId`, `approverName`, `rejectionReason`; เฉพาะชุมชนมีเพิ่ม `contactInfo` (ข้อมูลยืนยันตัวตน — เพิ่ม 2026-09-23) |
| `CommunityContent` *(เพิ่ม 2026-09-23)* | คอนเทนต์ของชุมชน (`title`, `bodyTh`, `caption`, `communityId/Name`, `status`: `เผยแพร่แล้ว` เท่านั้น — สร้างแล้วเผยแพร่ทันที ไม่มีสถานะฉบับร่าง, `createdAt`, `updatedAt`) |
| `ContentEditRequests` *(เพิ่ม 2026-09-23)* | คำขอแก้ไขคอนเทนต์ที่เผยแพร่แล้ว (`contentId`, `proposedChanges`, `originalValues`, `status`: `รอพิจารณา`/`อนุมัติ`/`ไม่อนุมัติ`, `rejectionReason`, `approverId/Name`) |
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
| **ชุมชน** (`community`) | เจ้าของเรื่องราว/แหล่งท่องเที่ยว | **ใช้งานจริง** (เพิ่ม 2026-09-23) — สมัครบัญชีเองได้ (self-registration) ต้องรออนุมัติจากอาจารย์ก่อนเหมือนนิสิต, สร้าง/เผยแพร่คอนเทนต์ได้ทันที, แก้ไขคอนเทนต์ที่เผยแพร่แล้วต้องขออนุมัติก่อน — ปุ่ม AI ยังปิดใช้งานชั่วคราว, ทดสอบ end-to-end บน production ผ่านครบแล้ว |
| **นักท่องเที่ยว** (`tourist`) | ผู้สืบค้น/วางแผนท่องเที่ยว, เขียนรีวิว, บันทึกสถานที่โปรด | มีแค่ mockup (prototype-v1), ยังไม่มีระบบบัญชีจริง |
| **นิสิตนิเทศศาสตร์** (`student`) | ส่งผลงานคอนเทนต์เพื่อขออนุมัติเผยแพร่ | **ใช้งานจริง** — สมัครบัญชีเองได้ (self-registration), ต้องรออนุมัติก่อนใช้งาน |
| **อาจารย์** (`role: teacher` ใน Firestore จริง / `admin` ในเอกสารเชิงแนวคิด) | ตรวจสอบ/อนุมัติผลงานนิสิต, อนุมัติบัญชีนิสิตใหม่ | **ใช้งานจริง** — บัญชี provision โดย admin เท่านั้น ไม่มี self-registration |
| **บุคคลทั่วไป** (ไม่ login) | ดู/ค้นหาผลงานนิสิตที่เผยแพร่แล้วเท่านั้น | **ใช้งานจริง** (เพิ่ม 2026-09-12) — แคบกว่า "นักท่องเที่ยว" เต็มรูปแบบ (ไม่มีสิทธิ์รีวิว/บันทึกสถานที่) |

> รายละเอียดสิทธิ์แบบละเอียด (ทำได้/ทำไม่ได้ต่อบทบาท) อยู่ที่ `docs/02-design/02-technical/ACL.md`

---

## 4. สิ่งที่ยัง**ไม่ได้ทำ** ใน Module นี้ (Not Done / Out of Scope)

เอกสาร requirement ต้นฉบับ**ไม่ได้ระบุรายการ "Out of scope" ไว้อย่างชัดเจน** (ยังเป็น Open Question ที่ค้างอยู่) แต่จากการตรวจโค้ด/เอกสารจริง สรุปสิ่งที่ยังไม่ทำได้ดังนี้:

### 4.1 ฟีเจอร์ที่ยังไม่ implement จริง (มีแค่เอกสาร/mockup)
- **AI ทั้งหมดฝั่งชุมชน** (FR-1.1–1.5): ปรับภาพ, คิดแคปชัน, แปลภาษา, แนะนำ SEO, แนะนำวิธีเล่าเรื่อง — ปุ่มมีอยู่จริงใน `community-create-content.html` แต่ปิดใช้งาน (placeholder) ยังไม่เชื่อม AI service จริง เพราะต้องรออัปเกรด Firebase เป็นแผน Blaze ก่อนทำ Cloud Functions proxy (สโคป Part 3)
- **การสืบค้น/วางแผนท่องเที่ยว, หมุดหมายเดินทาง** (FR-2.1–2.3) — mockup เท่านั้น
- **เขียนรีวิว / บันทึกสถานที่โปรด** (FR-2.4–2.5) — mockup เท่านั้น ไม่มีระบบบัญชีนักท่องเที่ยวจริง
- **Notification Service ส่งอีเมลจริง** — ปัจจุบันจำลองด้วยแบนเนอร์แจ้งเตือนในหน้าอาจารย์เท่านั้น ยังไม่มีบริการส่งอีเมลจริง
- **Consent & Log Service ที่ครบระบบ** (บันทึก consent, access log 90 วัน) — ยังไม่ implement เป็นโค้ดจริง มีแค่ระบุไว้ใน spec/architecture

### 4.2 สิ่งที่ทำแบบจำกัด/ชั่วคราวเท่านั้น
- **ปุ่ม AI ช่วยงาน 2 จุด** ใน prototype-v2 (ช่วยร่างคำอธิบายผลงาน, สรุปภาพรวมงานรอพิจารณา) เป็น **local demo เท่านั้น** — เรียก OpenRouter API ตรงจาก browser (มี API key ฝัง client-side) **ยังไม่เหมาะ deploy ใช้งานจริง** ต้องย้ายไปเรียกผ่าน backend/serverless proxy ก่อน
- **ระบบ login เป็นบัญชีสาธิต (demo)** — 4 บัญชีทดสอบ (u001-u004) ใช้รหัสผ่านเดียวกันทุกบัญชี **ยังไม่ได้ลบทิ้งก่อนขึ้นระบบจริง**
- **บัญชีอาจารย์ยัง provision โดย admin เท่านั้น** ไม่มีระบบสมัคร/อนุมัติบัญชีอาจารย์แบบเดียวกับนิสิต

### 4.3 Open Questions — **ปิดครบทุกข้อแล้วตั้งแต่ 2026-09-22/23** (หัวข้อนี้เคยล้าหลัง แก้ให้ตรงกับ `open-questions.md` แล้ว 2026-09-23)
ทุกข้อที่เคยค้าง (แพลตฟอร์ม, สิทธิ์การเข้าถึงชุมชน, ขอบเขตระบบจัดการข้อมูล, SEO, ภาษา/TTS, จำนวนครั้งส่งผลงานใหม่, NFR, Data Controller, consent granularity ฯลฯ) ถูกตอบและบันทึกเป็น Business Rules ในไฟล์ spec ต้นทางแล้วทั้งหมด — ดู `docs/01-requirements/03-task/open-questions.md` (สถานะ **0 ข้อค้าง**) และ `docs/01-requirements/01-spec/local-story-hub.md` § Business Rules สำหรับคำตอบแต่ละข้อ

สิ่งที่เหลืออยู่จริงตอนนี้ไม่ใช่ Open Question แล้ว แต่เป็น**งาน implementation ที่ยังไม่ทำ** (ดู § 4.1/4.2 ด้านบน) — อย่าสับสนสองอย่างนี้

---

## แหล่งอ้างอิงที่ใช้สรุปเอกสารนี้

- `docs/01-requirements/01-spec/local-story-hub.md` — สเปคหลัก + ขอบเขต (Scope) + Open Questions
- `docs/02-design/02-technical/architecture.md` — Component, Data Flow, Database Schema, API Spec
- `docs/02-design/02-technical/ACL.md` — ตารางสิทธิ์ตามบทบาท
- `docs/02-design/01-prototypes/prototype-v1/README.md`, `prototype-v2/README.md` — รายละเอียดหน้าจอ/การ implement จริง
- `docs/01-requirements/03-task/feature-list.md`, `open-questions.md`
- `CLAUDE.md` (root) — สถานะโปรเจกต์ปัจจุบัน, Firestore collections จริง
