# Local Story Hub — สรุปสถานะ Module ปัจจุบัน (spec.md)

> เอกสารนี้เป็น **สรุปภาพรวม** ที่ประมวลจากเอกสารที่มีอยู่แล้วในโปรเจกต์ (ไม่มีไฟล์ชื่อ `SCOPE.md` ในโปรเจกต์นี้โดยตรง — เนื้อหา "ขอบเขต (Scope)" อยู่ในไฟล์ `docs/01-requirements/01-spec/local-story-hub.md` แทน) และจากซอร์สโค้ด prototype จริงใน `docs/02-design/01-prototypes/` รวมถึง `docs/02-design/02-technical/architecture.md`, `ACL.md`, และ `CLAUDE.md`
>
> วันที่สรุป: 2026-09-22 (อัปเดตส่วนชุมชน + แก้ไขหัวข้อ Open Questions ที่ล้าหลัง + อัปเดตส่วนนักท่องเที่ยว + อัปเดต AI backend proxy + อัปเดต Access Log/BL-014 2026-09-23) — ตัวเอกสารต้นทางบางไฟล์อาจอัปเดตหลังจากนี้ ให้ใช้ไฟล์ต้นทางเป็น source of truth เสมอ

---

## 1. หน้าจอที่มีอยู่ (Screens)

### 1.1 Prototype v2 — ใช้งานได้จริง เชื่อม Firestore project `lsh-nammon` จริง (deploy แล้วที่ `lsh-nammon.web.app`)

อยู่ที่ `docs/02-design/01-prototypes/prototype-v2/` — ครอบคลุมเฉพาะ persona **นิสิต** + **อาจารย์** + **บุคคลทั่วไป (ไม่ login)** เท่านั้น:

| หน้าจอ | ไฟล์ | ผู้ใช้เป้าหมาย | สถานะ |
|---|---|---|---|
| สมัครสมาชิก + ส่งผลงานขออนุมัติ | `student-publish.html` | นิสิต | ใช้งานจริง (login จริงด้วย Firebase Auth, มีปุ่ม AI ช่วยร่างคำอธิบายผลงาน — **อัปเดต 2026-09-23**: เรียกผ่าน Cloudflare Worker proxy แล้ว ไม่เรียก OpenRouter ตรงจาก browser อีกต่อไป) |
| ตรวจสอบ/อนุมัติผลงาน + อนุมัติบัญชีผู้ใช้ใหม่ | `admin-review-student-work.html` | อาจารย์ (`role: teacher`) | ใช้งานจริง (มีปุ่ม AI สรุปภาพรวมผลงานที่รอพิจารณา — **อัปเดต 2026-09-23**: เรียกผ่าน Cloudflare Worker proxy แล้ว พร้อม role gate เฉพาะ teacher) |
| ดู/ค้นหาผลงานที่เผยแพร่แล้ว | `published-works.html` | บุคคลทั่วไป (ไม่ต้อง login) | ใช้งานจริง — public read |
| หน้ารวม | `index.html` | — | จุดเข้าใช้งาน |
| สมัคร/เข้าสู่ระบบชุมชน + จัดการคอนเทนต์ + ขอแก้ไข | `community-register.html`, `community-dashboard.html`, `community-create-content.html`, `community-request-edit.html` | ชุมชน | **เพิ่ม 2026-09-23** — ใช้งานจริง (login จริงด้วย Firebase Auth, เชื่อม Firestore จริง collection `CommunityContent`/`ContentEditRequests`) — `firestore.rules` deploy แล้ว ทดสอบ end-to-end ผ่าน browser จริงครบ flow แล้ว (ดู `05-log/index.md` 2026-09-23) — ปุ่ม AI 4/5 ปุ่ม (คิดแคปชัน/แนะนำวิธีเล่าเรื่อง/SEO/แปลภาษา) เชื่อม Cloudflare Worker proxy แล้ว รอผู้ประสานงาน deploy Worker จริง (ดู `cf-worker/README.md`); เหลือปรับภาพ (BL-001) ที่ยังไม่ทำเพราะไม่มีระบบอัปโหลดภาพจริง |
| อนุมัติบัญชีชุมชน + คำขอแก้ไขข้อมูลชุมชน | `admin-review-student-work.html` (ขยายจากเดิม) | อาจารย์ | **เพิ่ม 2026-09-23** — รวมอยู่ในหน้าเดียวกับการอนุมัติผลงานนิสิต/บัญชีนิสิต |
| สมัคร/เข้าสู่ระบบนักท่องเที่ยว | `tourist-login.html` | นักท่องเที่ยว | **เพิ่ม 2026-09-23** — login จริงด้วย Firebase Auth, เก็บโปรไฟล์ใน collection `touristAccounts` (แยกจาก `users`) — สมัครเสร็จใช้งานได้ทันที ไม่ต้องรออนุมัติ |
| หน้าแรก + Consent | `tourist-home-consent.html` | นักท่องเที่ยว/บุคคลทั่วไป | **เพิ่ม 2026-09-23** — การ์ดตัวอย่างดึงเนื้อหาเผยแพร่แล้วจริง, consent banner เขียน Firestore จริง (collection `ConsentRecords`) |
| ค้นหาแหล่งท่องเที่ยวชุมชน | `tourist-search-results.html` | นักท่องเที่ยว/บุคคลทั่วไป | **เพิ่ม 2026-09-23** — query จริงรวมจาก `LSHRequests`(นิสิต) + `CommunityContent`(ชุมชน) ค้นหา/กรองแบบ live |
| รายละเอียดเรื่องราว + รีวิว + บันทึกสถานที่โปรด + แปลภาษา | `tourist-story-detail.html` | นักท่องเที่ยว/บุคคลทั่วไป | **เพิ่ม 2026-09-23** — เขียนรีวิว (`Reviews`)/บันทึกสถานที่โปรด (`Bookmarks`) ต้อง login ก่อนเสมอ อ่านได้โดยไม่ต้อง login — ปุ่มแปลไทย→อังกฤษ (FR-2.2) เชื่อม Cloudflare Worker proxy แล้ว **บังคับ login ก่อนใช้เสมอ** (กันคนนอกเรียก AI ฟรี แม้เนื้อหาต้นฉบับอ่านได้แบบ public) รอผู้ประสานงาน deploy Worker จริง |

### 1.2 Prototype v1 — mockup เท่านั้น (จำลองข้อมูลด้วย `localStorage`, ไม่เชื่อมฐานข้อมูลจริง) — **superseded ครบทุกหน้าแล้ว**

อยู่ที่ `docs/02-design/01-prototypes/prototype-v1/` — เดิมครอบคลุมทั้ง 3 กลุ่มเป้าหมายในเชิง mockup แต่ทุกหน้าถูกแทนที่ด้วยเวอร์ชันจริงใน `prototype-v2` แล้ว (คงไฟล์ไว้เป็นประวัติ ไม่ได้ลบ) — ดูตารางด้านบนสำหรับหน้าจอจริงที่ใช้แทน

**สรุป**: หน้าจอฝั่ง **นิสิต/อาจารย์/บุคคลทั่วไป/ชุมชน/นักท่องเที่ยว** implement จริงครบทั้งหมดแล้ว (2026-09-23) รวมถึงปุ่ม AI เกือบทั้งหมดเชื่อม **Cloudflare Worker proxy** (`cf-worker/`) แล้ว (เปลี่ยนจากแผนเดิม Cloud Functions/Blaze เพราะผู้ใช้ไม่ต้องการผูกบัตรเครดิต) — ทดสอบ auth/routing ผ่าน local `wrangler dev` ครบแล้ว **แต่ยังไม่ได้ deploy Worker จริงขึ้น Cloudflare** (ต้องผู้ใช้ทำ `wrangler login` เอง — ดู `cf-worker/README.md`) จนกว่าจะ deploy ปุ่ม AI ทุกปุ่มจะขึ้นข้อความ "AI backend ยังไม่พร้อมใช้งาน" เสมอ — เหลือแค่ปุ่มปรับภาพ (BL-001) ที่ยังไม่ implement เพราะไม่มีระบบอัปโหลดภาพจริง

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
| `touristAccounts` *(เพิ่ม 2026-09-22/23)* | บัญชีนักท่องเที่ยว (`displayName`, `email`, `role: 'tourist'`, `createdAt`) — **แยก collection จาก `users`** เพราะไม่มีสถานะ pending/approved |
| `Reviews` *(เพิ่ม 2026-09-23)* | รีวิวของนักท่องเที่ยว (`contentId`, `contentType`: `student`/`community`, `contentTitle`, `touristId/Name`, `text`, `createdAt`) — อ่าน public ได้ เขียนต้อง login |
| `Bookmarks` *(เพิ่ม 2026-09-23)* | สถานที่โปรด (doc id = `{touristId}_{contentType}_{contentId}`, field เดียวกับ Reviews) — อ่าน/ลบได้เฉพาะเจ้าของ |
| `ConsentRecords` *(เพิ่ม 2026-09-22/23)* | หลักฐานการยินยอม PDPA (`user_account_id` — null ได้, `analytics_consent`/`marketing_consent` เท่ากันเสมอ, `timestamp`) — เขียนได้แม้ไม่ login |
| `ContentTypes` | ประเภทผลงาน (VOD / album photo / Storytelling) — **ไม่มีที่มาจาก requirement ใดๆ เลย เป็นข้อมูลเฉพาะกิจ** |
| `LSHRequests` | ผลงานที่นิสิตส่ง (`title`, `Content`, `status`, `requesterId/Name`, `approverId/Name`, `community`, `rejectionReason`, `aiAssisted`, `aiSuggestionText`, `createdAt`) — คือ `StudentWork` เชิงแนวคิด แต่คนละชื่อ field/ภาษา |
| `AiSummaries` | ผลสรุปภาพรวมจาก AI ที่อาจารย์ใช้ดูก่อนตรวจงาน (เพิ่ม 2026-09-19) |
| `AiAssistLogs` | log ทุกครั้งที่มีการเรียกใช้ AI ช่วยงาน — **อัปเดต 2026-09-23**: เดิมเขียนได้เฉพาะนิสิต/อาจารย์ ตอนนี้เปิดให้ role ที่ login แล้วทุกแบบ (ชุมชน/นักท่องเที่ยวด้วย) เพราะปุ่ม AI ขยายไปทั้งสองฝั่งแล้ว — เขียนจาก Cloudflare Worker ผ่าน Firestore REST API แทนที่ client เขียนเองโดยตรง |
| `AccessLogs` *(เพิ่ม 2026-09-23, BL-014)* | Access Log ตามพ.ร.บ. คอมพิวเตอร์ (`timestamp`, `ip_address`, `user_agent`, `user_account_id` — null ได้, `action`, `expires_at` สำหรับ TTL policy) — เขียนจาก Cloudflare Worker ด้วย **service account** (bypass `firestore.rules`) เพราะต้อง log ได้แม้ไม่ login เลย อ่านได้เฉพาะ role=`teacher` เก็บ 90 วันด้วย Firestore TTL policy |

⚠️ **ไม่ตรงกัน 1:1** — เช่น role อาจารย์จริงคือ `teacher` (ไม่ใช่ `admin` แบบ conceptual), field ชื่อคนละภาษา/คนละ convention (denormalized vs reference) ดูตาราง mapping เต็มได้ที่ `architecture.md` § "Mapping กับข้อมูลจริงใน Firestore"

---

## 3. บทบาทผู้ใช้ (User Roles)

### ตามสเปคต้นทาง (3 กลุ่มเป้าหมายหลัก + 1 บทบาทดูแลระบบที่เพิ่มภายหลัง)

| บทบาท | คำอธิบาย | สถานะการ implement |
|---|---|---|
| **ชุมชน** (`community`) | เจ้าของเรื่องราว/แหล่งท่องเที่ยว | **ใช้งานจริง** (เพิ่ม 2026-09-23) — สมัครบัญชีเองได้ (self-registration) ต้องรออนุมัติจากอาจารย์ก่อนเหมือนนิสิต, สร้าง/เผยแพร่คอนเทนต์ได้ทันที, แก้ไขคอนเทนต์ที่เผยแพร่แล้วต้องขออนุมัติก่อน — ปุ่ม AI 4/5 ปุ่มเชื่อม Cloudflare Worker proxy แล้ว (รอ deploy Worker จริง), เหลือปรับภาพ (BL-001) ที่ยังไม่ทำ, ทดสอบ end-to-end บน production ผ่านครบแล้ว |
| **นักท่องเที่ยว** (`tourist`) | ผู้สืบค้น/วางแผนท่องเที่ยว, เขียนรีวิว, บันทึกสถานที่โปรด | **ใช้งานจริง** (เพิ่ม 2026-09-23) — สมัครบัญชีเองได้ ใช้งานได้ทันทีไม่ต้องรออนุมัติ (ต่างจากนิสิต/ชุมชน), ค้นหา/อ่านเรื่องราวไม่ต้อง login, เขียนรีวิว/บันทึกสถานที่ต้อง login, แปลภาษาอังกฤษเชื่อม Cloudflare Worker proxy แล้ว (บังคับ login ก่อนใช้ รอ deploy Worker จริง) — ยังไม่มีข้อมูลพิกัด/เส้นทางจริง (BL-010) |
| **นิสิตนิเทศศาสตร์** (`student`) | ส่งผลงานคอนเทนต์เพื่อขออนุมัติเผยแพร่ | **ใช้งานจริง** — สมัครบัญชีเองได้ (self-registration), ต้องรออนุมัติก่อนใช้งาน |
| **อาจารย์** (`role: teacher` ใน Firestore จริง / `admin` ในเอกสารเชิงแนวคิด) | ตรวจสอบ/อนุมัติผลงานนิสิต, อนุมัติบัญชีนิสิตใหม่ | **ใช้งานจริง** — บัญชี provision โดย admin เท่านั้น ไม่มี self-registration |
| **บุคคลทั่วไป** (ไม่ login) | ดู/ค้นหาผลงานนิสิตที่เผยแพร่แล้วเท่านั้น | **ใช้งานจริง** (เพิ่ม 2026-09-12) — แคบกว่า "นักท่องเที่ยว" เต็มรูปแบบ (ไม่มีสิทธิ์รีวิว/บันทึกสถานที่) |

> รายละเอียดสิทธิ์แบบละเอียด (ทำได้/ทำไม่ได้ต่อบทบาท) อยู่ที่ `docs/02-design/02-technical/ACL.md`

---

## 4. สิ่งที่ยัง**ไม่ได้ทำ** ใน Module นี้ (Not Done / Out of Scope)

เอกสาร requirement ต้นฉบับ**ไม่ได้ระบุรายการ "Out of scope" ไว้อย่างชัดเจน** (ยังเป็น Open Question ที่ค้างอยู่) แต่จากการตรวจโค้ด/เอกสารจริง สรุปสิ่งที่ยังไม่ทำได้ดังนี้:

### 4.1 ฟีเจอร์ที่ยังไม่ implement จริง (มีแค่เอกสาร/mockup)
- **AI ปรับภาพให้สวย** (FR-1.1, BL-001) — ยังไม่ implement เพราะไม่มีระบบอัปโหลดภาพจริงเลย (คนละสโคปจาก AI backend proxy)
- **วางแผนเส้นทาง/หมุดหมายเดินทางแบบมีพิกัดจริง** (FR-2.3, BL-010) — ยังไม่มี field ตำแหน่งในสคีมา `LSHRequests`/`CommunityContent` เลย ตอนนี้ลิงก์ไป Google Maps ค้นหาด้วยชื่อชุมชนแทนไปพลางก่อน
- **Notification Service ส่งอีเมลจริง** — ปัจจุบันจำลองด้วยแบนเนอร์แจ้งเตือนในหน้าอาจารย์เท่านั้น ยังไม่มีบริการส่งอีเมลจริง (ตัดสินใจข้ามไปก่อนตามที่ผู้ใช้ยืนยัน)

### 4.2 สิ่งที่ทำแบบจำกัด/ชั่วคราวเท่านั้น
- **AI backend proxy (Cloudflare Worker) สร้างเสร็จแล้วแต่ยังไม่ deploy จริง** (2026-09-23) — ปุ่ม AI ที่เหลือทั้งหมด (คิดแคปชัน/แนะนำวิธีเล่าเรื่อง/SEO/แปลภาษา/ช่วยร่างคำอธิบายผลงานนิสิต/สรุปภาพรวมงานของอาจารย์) เรียกผ่าน `cf-worker/` แล้ว ไม่เรียก OpenRouter ตรงจาก browser อีกต่อไป (key อยู่เป็น Cloudflare secret เท่านั้น) — **แต่ผู้ใช้ต้อง `wrangler login` + `wrangler secret put` + `wrangler deploy` เองก่อน** (ดู `cf-worker/README.md`) ก่อนหน้านั้นทุกปุ่มจะแสดง "AI backend ยังไม่พร้อมใช้งาน" เสมอ
- **Access Log เก็บ 90 วันแบบอัตโนมัติ (BL-014) เขียนโค้ดเสร็จแล้วแต่ยังไม่ deploy จริง** (2026-09-23) — ทุกหน้ายิง log ผ่าน `cf-worker/` endpoint `/log-access` แล้ว (ด้วยสิทธิ์ service account เพื่อ log ได้แม้ไม่ login) เก็บ 90 วันด้วย Firestore TTL policy (ไม่ใช่ Cloud Functions) — **ต้อง deploy Worker + ตั้งค่า secret `FIREBASE_SERVICE_ACCOUNT_JSON` + ตั้งค่า TTL policy ผ่าน Firebase Console เอง** (ดู `cf-worker/README.md`) ก่อนหน้านั้น log จะไม่ถูกบันทึกจริง (เขียนล้มเหลวเงียบๆ ไม่กระทบผู้ใช้)
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
- `cf-worker/README.md` — AI backend proxy (Cloudflare Worker), endpoint ทั้งหมด, ขั้นตอน deploy
- `CLAUDE.md` (root) — สถานะโปรเจกต์ปัจจุบัน, Firestore collections จริง
