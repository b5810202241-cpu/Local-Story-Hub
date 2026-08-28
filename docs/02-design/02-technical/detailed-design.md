# Detailed Design (Conceptual)

- **สถานะ**: Draft — conceptual เท่านั้น ยังไม่ผูกมัดกับ technical stack ใด ๆ
- **อ้างอิงจาก**: [[architecture|architecture]], [[data-api-spec|data-api-spec]], [[../01-prototypes/tourist-journey|tourist-journey]], [[../01-prototypes/community-content-journey|community-content-journey]], [[../01-prototypes/student-content-journey|student-content-journey]]

## Decision Log

- **2026-08-28** — ถ้า AI Content Service ประมวลผลไม่สำเร็จ ระบบ**แจ้ง error ทันทีให้ผู้ใช้กดลองใหม่เอง** (ไม่มี retry อัตโนมัติ, ไม่ทำต่อเหมือนไม่มีอะไรเกิดขึ้น) — ผู้ใช้ยืนยันเอง หลังถูกถามพร้อม 3 ทางเลือก (อีก 2 ทางที่พิจารณาแล้วไม่เลือก: retry อัตโนมัติ 1-2 ครั้ง, ทำต่อเหมือนเดิมโดยไม่เตือน) เหตุผล: ง่ายที่สุด ตรงกับหลัก Synchronous ที่เลือกไว้ใน [[architecture|architecture]]

> **⚠️ ความไม่สอดคล้องที่ยังไม่ได้แก้**: Sequence "นักท่องเที่ยวเขียนรีวิว" ด้านล่างออกแบบตามการตัดสินใจใน [[data-api-spec|data-api-spec]] ว่านักท่องเที่ยวต้องมีบัญชี (login) แต่ [[../01-prototypes/tourist-journey|tourist-journey]] และ [[../01-prototypes/prototype-v1/README|prototype-v1]] ที่มีอยู่ยังออกแบบแบบไม่มี login (ใช้ `localStorage`) — ยังไม่ได้อัปเดตสองไฟล์นั้นให้ตรงกัน (บันทึกไว้ตั้งแต่รอบที่แล้วใน `05-log`)

## Sequence Flow

### 1. PDPA Consent (ผูกกับทุกครั้งที่เข้าเว็บครั้งแรก)

```mermaid
sequenceDiagram
  participant Client
  participant ConsentLog as Consent & Log Service
  participant DB as Database
  participant Analytics as External: Web Analytics

  Client->>ConsentLog: เข้าเว็บ/แอปครั้งแรก (ยังไม่เคยตอบ Consent)
  ConsentLog-->>Client: แสดง Consent Notice
  Client->>ConsentLog: เลือกยินยอม/ปฏิเสธ (analytics_consent, marketing_consent)
  ConsentLog->>DB: บันทึก ConsentRecord
  alt ยินยอม analytics
    ConsentLog->>Analytics: เปิดใช้งาน tracking
  else ปฏิเสธ
    ConsentLog-->>Client: ไม่เก็บ/ใช้ข้อมูลผ่าน tracking ที่ไม่จำเป็น
  end
```

**อ้างอิง**: tourist-journey step 1–2 · FR-2, FR-3 ([[../../01-requirements/01-spec/20260822-01-it-log-pdpa-consent|20260822-01-it-log-pdpa-consent]]) · BL-015, BL-016 · API: "แสดงข้อความ Consent ปัจจุบัน", "บันทึกการยินยอม/ปฏิเสธ" ([[data-api-spec|data-api-spec]])

### 2. นักท่องเที่ยวค้นหาและอ่านเรื่องราวชุมชน

```mermaid
sequenceDiagram
  participant Client
  participant API
  participant DB as Database

  Client->>API: ค้นหาแหล่งท่องเที่ยว (คำค้นหา)
  API->>DB: query Community + Content ที่เผยแพร่แล้ว
  DB-->>API: ผลลัพธ์
  API-->>Client: รายการชุมชน/เรื่องราว
  Note over API,DB: ทุกคำขอผ่าน API ถูกบันทึกลง AccessLog โดยอัตโนมัติ (BL-014) — ไม่วาดซ้ำทุก diagram เพื่อความกระชับ
```

**อ้างอิง**: tourist-journey step 3–4 · FR-2.1, FR-2.2 · API: "ค้นหา/แสดงรายการชุมชน", "ดูรายละเอียดชุมชน + เนื้อหา" ([[data-api-spec|data-api-spec]])

### 3. นักท่องเที่ยวเขียนรีวิว (ต้อง login)

```mermaid
sequenceDiagram
  participant Client
  participant API
  participant DB as Database

  Client->>API: ขอเขียนรีวิว (community_id, text)
  API->>API: ตรวจสอบ session/login (UserAccount role=tourist)
  alt ยังไม่ login
    API-->>Client: แจ้งให้เข้าสู่ระบบ/สมัครบัญชีก่อน
  else login แล้ว
    API->>DB: บันทึก Review (user_account_id, community_id, text)
    DB-->>API: บันทึกสำเร็จ
    API-->>Client: แสดงรีวิวใหม่
  end
```

**อ้างอิง**: tourist-journey step 6 (DRAFT — journey เดิมไม่มีขั้นตอน login ดูคำเตือนด้านบน) · FR-2.4 · API: "เขียนรีวิว" ([[data-api-spec|data-api-spec]])

### 4. ชุมชนขอให้ AI ปรับภาพ (Synchronous)

```mermaid
sequenceDiagram
  participant Client
  participant API
  participant AIService as AI Content Service

  Client->>API: อัปโหลดภาพ + ขอให้ AI ปรับภาพ
  API->>AIService: ส่งภาพเพื่อประมวลผล (synchronous — รอผลทันที)
  alt ประมวลผลสำเร็จ
    AIService-->>API: ภาพที่ปรับแล้ว (image_enhanced_ref)
    API-->>Client: แสดงผลลัพธ์ให้ตรวจสอบก่อนใช้จริง
  else ไม่สำเร็จ
    AIService-->>API: แจ้งข้อผิดพลาด
    API-->>Client: แจ้ง error ทันที ให้ผู้ใช้กดลองใหม่เอง (ดู Decision Log)
  end
```

**อ้างอิง**: community-content-journey step 2 · FR-1.1 · API: "ให้ AI ปรับภาพ" ([[data-api-spec|data-api-spec]]) — รูปแบบเดียวกันนี้ใช้กับ AI operation อื่นในหมวดเดียวกัน (คิดแคปชัน FR-1.2, แนะนำเรื่องเล่า FR-1.5, แนะนำ SEO FR-1.4, แปลภาษา FR-1.3) จึงไม่วาดซ้ำทุก operation

### 5. ชุมชนเผยแพร่คอนเทนต์

```mermaid
sequenceDiagram
  participant Client
  participant API
  participant DB as Database

  Client->>API: กดเผยแพร่คอนเทนต์ (content_id)
  API->>DB: อัปเดต Content.status = published
  DB-->>API: สำเร็จ
  API-->>Client: ยืนยันเผยแพร่แล้ว
```

**อ้างอิง**: community-content-journey step 7 · FR-1.6, FR-1.7 · API: "เผยแพร่คอนเทนต์" ([[data-api-spec|data-api-spec]])

### 6. นิสิตเผยแพร่ผลงานทันที (ไม่ต้องอนุมัติ)

```mermaid
sequenceDiagram
  participant Client
  participant API
  participant DB as Database

  Client->>API: อัปโหลดผลงาน + เลือกชุมชนที่เกี่ยวข้อง
  API->>DB: บันทึก StudentWork (status=published)
  Note over API,DB: เผยแพร่ทันทีเสมอ ไม่มีขั้นตอนรออนุมัติ (Business Rule ที่ยืนยันแล้วใน local-story-hub.md)
  DB-->>API: สำเร็จ
  API-->>Client: แสดงผลงานที่เผยแพร่แล้ว
```

**อ้างอิง**: student-content-journey step 1–3 · FR-3.1 · API: "อัปโหลด+เผยแพร่ผลงานทันที" ([[data-api-spec|data-api-spec]])

## Open Items ที่กระทบเอกสารนี้

1. **ความไม่สอดคล้องเรื่อง login ของนักท่องเที่ยว** (ดูคำเตือนด้านบน) — ต้องอัปเดต journey + prototype ให้ตรงกับ sequence #3
2. **บทบาทผู้ใช้และสิทธิ์การเข้าถึงของแต่ละชุมชน** (Open Question เดิม) — อาจต้องเพิ่มขั้นตอนตรวจสิทธิ์ในหลาย sequence เมื่อคำตอบชัดเจนขึ้น
3. รายละเอียดเพิ่มเติมอื่น ๆ ดูที่ [[../../01-requirements/03-task/open-questions|open-questions]]
