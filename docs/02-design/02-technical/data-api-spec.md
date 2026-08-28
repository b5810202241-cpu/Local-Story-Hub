# Database Schema & API Spec (Conceptual)

- **สถานะ**: Draft — conceptual เท่านั้น ยังไม่ผูกมัดกับ technical stack (ยี่ห้อฐานข้อมูล/รูปแบบ API เฉพาะ framework) ใด ๆ
- **อ้างอิงจาก**: [[../../01-requirements/01-spec/local-story-hub|local-story-hub]], [[../../01-requirements/01-spec/20260822-01-it-log-pdpa-consent|20260822-01-it-log-pdpa-consent]], [[../../01-requirements/03-task/feature-list|feature-list]], [[architecture|architecture]]

## Decision Log

- **2026-08-28** — นักท่องเที่ยวต้องมีบัญชีผู้ใช้ (login เต็มรูปแบบ) จึงจะเขียนรีวิว/บันทึกสถานที่โปรดได้ (ผู้ใช้ยืนยันเอง หลังถูกถามพร้อม 3 ทางเลือกในระหว่างการออกแบบเอกสารนี้ — ทางเลือกอื่นที่พิจารณาแล้วไม่เลือก: ไม่ต้องมีบัญชี/anonymous, Hybrid)
  > **ผลกระทบที่ต้องตามแก้**: [[../01-prototypes/prototype-v1/README|prototype-v1]] ปัจจุบันออกแบบฝั่งนักท่องเที่ยวแบบไม่มี login (ใช้ `localStorage` ต่ออุปกรณ์) — ไม่ตรงกับการตัดสินใจนี้อีกต่อไป ต้องอัปเดต prototype (เพิ่มหน้า login/register) และอาจกระทบ [[../../03-testing/01-test-plan/test-plan|test-plan]] (TC-001–TC-008) ในภายหลัง ยังไม่ได้แก้ในรอบนี้
- **2026-08-28** — รวม UserAccount เป็น entity เดียว (มี field `role`) แทนการแยก 3 entity ตามกลุ่มผู้ใช้ เพื่อลดความซ้ำซ้อนของ schema — เป็นการเลือกรูปแบบ normalization ไม่ใช่การตัดสินใจเชิง requirement จึงไม่ได้ถามผู้ใช้ก่อน

## Database Schema

### ภาพรวม ER Diagram

```mermaid
erDiagram
  COMMUNITY ||--o{ USER_ACCOUNT : "has managers (role=community)"
  COMMUNITY ||--o{ CONTENT : has
  COMMUNITY ||--o{ REVIEW : receives
  COMMUNITY ||--o{ BOOKMARK : "saved as"
  COMMUNITY ||--o{ STUDENT_WORK : "linked to"
  USER_ACCOUNT ||--o{ CONTENT : "creates (via community)"
  USER_ACCOUNT ||--o{ REVIEW : writes
  USER_ACCOUNT ||--o{ BOOKMARK : saves
  USER_ACCOUNT ||--o{ STUDENT_WORK : authors
  USER_ACCOUNT ||--o{ CONSENT_RECORD : gives
  USER_ACCOUNT ||--o{ ACCESS_LOG : generates
```

### UserAccount

บัญชีผู้ใช้แบบเดียวสำหรับทั้ง 3 กลุ่ม แยกด้วย `role` — รวม entity เพื่อลดความซ้ำซ้อน (ดู Decision Log)

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| role | ตัวเลือก (community / tourist / student) | ใช่ | กำหนดสิทธิ์และหน้าที่ |
| community_id | อ้างอิงไปยัง Community | เฉพาะ role=community | บัญชีนี้เป็นผู้จัดการชุมชนไหน — รายละเอียดสิทธิ์ยังเป็น Open Question (ดู open-questions) |
| display_name | ข้อความ | ใช่ | |
| email / credential | ข้อความ | ใช่ | ใช้สำหรับ login — วิธีจริง (email/password, OAuth ฯลฯ) เป็นเรื่อง technical stack ไม่ระบุที่นี่ |
| created_at | วันที่-เวลา | ใช่ | |

### Community

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| name | ข้อความ | ใช่ | ชื่อชุมชน |
| description | ข้อความ | ไม่ | |
| province | ข้อความ | ไม่ | |
| created_at | วันที่-เวลา | ใช่ | |

### Content

เรื่องราว/คอนเทนต์ของชุมชน (FR-1.1–1.5)

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| community_id | อ้างอิงไปยัง Community | ใช่ | |
| title | ข้อความ | ใช่ | |
| body_th | ข้อความยาว | ใช่ | เนื้อหาต้นฉบับภาษาไทย |
| body_en | ข้อความยาว | ไม่ | ผลลัพธ์จากการแปลด้วย AI (FR-1.3) — รูปแบบ (ข้อความ/เสียงพากย์) ยังเป็น Open Question |
| image_original_ref | อ้างอิงไฟล์ | ไม่ | |
| image_enhanced_ref | อ้างอิงไฟล์ | ไม่ | ผลลัพธ์จาก AI ปรับภาพ (FR-1.1) |
| caption | ข้อความ | ไม่ | จาก AI (FR-1.2) |
| seo_keywords | รายการข้อความ | ไม่ | จาก AI (FR-1.4) — เชื่อม search engine จริงหรือแนะนำภายในระบบยังเป็น Open Question |
| status | ตัวเลือก (draft / published) | ใช่ | |
| created_at / updated_at | วันที่-เวลา | ใช่ | |

### Review

รีวิวจากนักท่องเที่ยว (FR-2.4) — **ต้องมี UserAccount role=tourist** ตาม Decision Log

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| community_id | อ้างอิงไปยัง Community | ใช่ | |
| user_account_id | อ้างอิงไปยัง UserAccount (role=tourist) | ใช่ | |
| text | ข้อความ | ใช่ | |
| created_at | วันที่-เวลา | ใช่ | |

### Bookmark

สถานที่โปรดที่นักท่องเที่ยวบันทึกไว้ (FR-2.5) — ต้องมี UserAccount role=tourist

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| user_account_id | อ้างอิงไปยัง UserAccount (role=tourist) | ใช่ | |
| community_id | อ้างอิงไปยัง Community | ใช่ | |
| created_at | วันที่-เวลา | ใช่ | |

### StudentWork

ผลงานของนิสิตนิเทศศาสตร์ (FR-3.1)

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| user_account_id | อ้างอิงไปยัง UserAccount (role=student) | ใช่ | |
| community_id | อ้างอิงไปยัง Community | ใช่ | วิธีเชื่อมโยงผลงานกับชุมชนยังเป็น Open Question — ที่นี่จำลองเป็นการเลือกชุมชนตรง ๆ ตาม prototype-v1 |
| title | ข้อความ | ใช่ | |
| description | ข้อความ | ไม่ | |
| media_ref | อ้างอิงไฟล์ | ไม่ | |
| status | ตัวเลือก (published เท่านั้น) | ใช่ | เผยแพร่ทันทีเสมอ ไม่มีสถานะรออนุมัติ (Business Rule ที่ยืนยันแล้วใน local-story-hub.md) |
| created_at | วันที่-เวลา | ใช่ | |

### ConsentRecord

หลักฐานการให้ความยินยอม (BL-015, BL-016, BL-017)

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| user_account_id | อ้างอิงไปยัง UserAccount | ไม่ | Consent เกิดขึ้นได้ก่อน login (ผู้เข้าเว็บครั้งแรกยังไม่มีบัญชี) จึงเป็น field ไม่บังคับ |
| analytics_consent | จริง/เท็จ | ใช่ | |
| marketing_consent | จริง/เท็จ | ใช่ | ชื่อ field ชั่วคราว ครอบคลุม IP/tracking อื่นตามสเปค — รูปแบบ granular เต็มรูปแบบยังเป็น Open Question |
| timestamp | วันที่-เวลา | ใช่ | |

### AccessLog

บันทึกการเข้าใช้งานตามพ.ร.บ. คอมพิวเตอร์ (BL-014) — เก็บอย่างน้อย 90 วัน

| Field | ประเภท | บังคับ | คำอธิบาย |
|---|---|---|---|
| id | รหัสอ้างอิง | ใช่ | |
| timestamp | วันที่-เวลา | ใช่ | |
| ip_address | ข้อความ | ใช่ | |
| user_account_id | อ้างอิงไปยัง UserAccount | ไม่ | ผู้เข้าชมที่ยังไม่ login จะไม่มีค่านี้ |
| action | ข้อความ | ใช่ | |

> **หมายเหตุ**: field ของ AccessLog ยังไม่ครบถ้วนตามเจตนา — รายละเอียดที่ต้องเก็บ (user-agent ครบหรือไม่, ที่เก็บ, ผู้มีสิทธิ์เข้าถึง) ยังเป็น Open Question (ดู [[../../01-requirements/03-task/open-questions|open-questions]])

## API Spec

รูปแบบ operation เชิงแนวคิด (ไม่ผูกมัดกับ REST/GraphQL หรือ framework ใด) — คอลัมน์ "อ้างอิง" คือ journey step / FR / BL ที่ทำให้เกิด operation นี้

### UserAccount

| Operation | Input | Output | อ้างอิง |
|---|---|---|---|
| สมัครบัญชี | role, display_name, email/credential | user_account | ผลจาก Decision Log วันนี้ (ยังไม่มี FR ต้นฉบับระบุตรง ๆ) |
| เข้าสู่ระบบ | email/credential | session/token (แนวคิด) | เช่นเดียวกับข้างต้น |

### Community / Content

| Operation | Input | Output | อ้างอิง |
|---|---|---|---|
| ค้นหา/แสดงรายการชุมชน | คำค้นหา (ไม่บังคับ) | รายการ community | FR-2.1, tourist-journey step 3 |
| ดูรายละเอียดชุมชน + เนื้อหา | community_id | community, content ที่เผยแพร่แล้ว | FR-2.2, FR-2.3 |
| ดูหน้าจัดการข้อมูลของชุมชนตนเอง | user_account (role=community) | รายการ content ของชุมชนนั้น | FR-1.6, community-content-journey step 1 |
| สร้างคอนเทนต์ฉบับร่าง | community_id, ข้อมูลเบื้องต้น | content (draft) | FR-1.6 |
| ให้ AI ปรับภาพ | content_id, image | image_enhanced_ref | FR-1.1 |
| ให้ AI คิดแคปชัน | content_id, keyword | caption | FR-1.2 |
| ให้ AI แนะนำวิธีเล่าเรื่อง | content_id, หัวข้อ | คำแนะนำ | FR-1.5 |
| ให้ AI แนะนำ SEO | content_id | seo_keywords | FR-1.4 |
| ให้ AI แปลภาษา | content_id | body_en | FR-1.3 |
| เผยแพร่คอนเทนต์ | content_id | content (status=published) | FR-1.6/1.7 |

### Review / Bookmark

| Operation | Input | Output | อ้างอิง |
|---|---|---|---|
| เขียนรีวิว | community_id, user_account (role=tourist), text | review | FR-2.4 |
| ดูรีวิวของชุมชน | community_id | รายการ review | FR-2.4 |
| บันทึก/ยกเลิกบันทึกสถานที่โปรด | community_id, user_account (role=tourist) | bookmark | FR-2.5 |
| ดูรายการสถานที่โปรดของตนเอง | user_account | รายการ bookmark | FR-2.5 |

### StudentWork

| Operation | Input | Output | อ้างอิง |
|---|---|---|---|
| อัปโหลด+เผยแพร่ผลงานทันที | user_account (role=student), community_id, ข้อมูลผลงาน | student_work (published) | FR-3.1, student-content-journey |
| ดูผลงานนิสิตที่เกี่ยวข้องกับชุมชน | community_id | รายการ student_work | FR-3.1 |

### Consent / Log

| Operation | Input | Output | อ้างอิง |
|---|---|---|---|
| แสดงข้อความ Consent ปัจจุบัน | — | นโยบายปัจจุบัน | BL-015 |
| บันทึกการยินยอม/ปฏิเสธ | analytics_consent, marketing_consent | consent_record | BL-015, BL-016, BL-017 |
| บันทึก access log | (อัตโนมัติทุกคำขอ ไม่มี public API) | access_log | BL-014 |

## Open Items ที่กระทบเอกสารนี้

ดูรายละเอียดเต็มที่ [[../../01-requirements/03-task/open-questions|open-questions]] — ที่กระทบ schema/API โดยตรง:

1. **บทบาทผู้ใช้และสิทธิ์การเข้าถึงของแต่ละชุมชน** — กระทบว่า `UserAccount` (role=community) ควรมีกี่ระดับสิทธิ์
2. **ขอบเขตของ "ระบบจัดการข้อมูล"** — กระทบว่า Content entity ต้องมี field เพิ่มอะไรอีกหรือไม่
3. **รูปแบบ Consent (granular/เดียว)** — กระทบโครงสร้าง field ของ ConsentRecord
4. **รายละเอียด Log ที่ต้องเก็บ** — กระทบ field ของ AccessLog
5. **เชื่อมโยงผลงานนิสิตกับชุมชน** — ตอนนี้จำลองเป็น FK ตรง ๆ ตาม prototype-v1 อาจต้องปรับถ้าคำตอบจริงซับซ้อนกว่านี้
