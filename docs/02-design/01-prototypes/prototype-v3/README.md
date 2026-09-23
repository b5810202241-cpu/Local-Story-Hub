# Prototype v3 — ฝั่งชุมชน (Community)

> **⚠️ Superseded (2026-09-23)** — mockup `localStorage` เวอร์ชันนี้ถูกแทนที่ด้วยการ implement จริงที่เชื่อม Firebase Auth + Firestore แล้ว ที่ [[../prototype-v2/README|prototype-v2]] (`community-register.html`, `community-dashboard.html`, `community-create-content.html`, `community-request-edit.html` + ส่วนอนุมัติใน `admin-review-student-work.html`) — เก็บไฟล์นี้ไว้เป็นประวัติการออกแบบ mockup เท่านั้น ตามกฎ "ห้ามลบเอกสารโดยตรง" ของโปรเจกต์ **ไม่ต้อง implement เพิ่มในโฟลเดอร์นี้อีก**

เวอร์ชันนี้เจาะจงเฉพาะฝั่ง **ชุมชน** ต่อยอดจาก Business Rules ที่ปิด Open Question เมื่อ 2026-09-22
(แพลตฟอร์ม=Website, สิทธิ์การเข้าถึงข้อมูลชุมชนแบบใช้ร่วมกัน, ขอบเขตระบบจัดการข้อมูล=เฉพาะคอนเทนต์)
และงาน `architecture-design`/`data-api-design`/ACL/`user-journey` ฝั่งชุมชนที่ทำไปก่อนหน้า — แยก
เป็น version ใหม่ (ไม่แก้ `prototype-v1`/`prototype-v2` เดิม) เพราะเป็นรอบการตัดสินใจชุดใหม่ทั้งหมด

**จำลองข้อมูลด้วย `localStorage`** (ไม่เชื่อม Firestore จริง) เพราะยังไม่มี collection จริงรองรับ
entity `Community`/`Content`/`ContentEditRequest` — คนละแนวทางจาก `prototype-v2` ที่ต่อ Firestore
จริงเฉพาะฝั่งนิสิต/อาจารย์

## หน้าจอ

| ไฟล์ | อ้างอิงจาก | พฤติกรรม Interactive |
|---|---|---|
| `community-register.html` | [[../community-account-registration-journey\|community-account-registration-journey]], BL-022 | ฟอร์ม validate ก่อนส่ง (ชื่อ/อีเมล/ข้อมูลยืนยันตัวตน — ชื่อผู้ติดต่อ+เบอร์โทร ไม่ต้องแนบเอกสาร ตัดสินใจ 2026-09-22), บันทึกสถานะ "รออนุมัติ" ผ่าน `localStorage`, ส่วนเข้าสู่ระบบ (demo) เลือกบัญชีแล้วบล็อก/แจ้งเหตุผลตามสถานะจริง |
| `community-dashboard.html` | [[../community-content-journey\|community-content-journey]] step 1, BL-006 | แสดงคอนเทนต์ของชุมชนตนเอง + ชุมชนอื่น (read-only, shared data), ค้นหา/กรองแบบ live ทั้ง 2 ตาราง, ปุ่ม "ขอแก้ไข" ปรากฏเฉพาะคอนเทนต์ที่เผยแพร่แล้วและไม่มีคำขอค้าง |
| `community-create-content.html` | [[../community-content-journey\|community-content-journey]], BL-001–005 | ปุ่ม AI ทุกปุ่มมีผลลัพธ์จริง (ปรับภาพ/แคปชัน/แนะนำเรื่อง/SEO/แปลภาษา — ทั้ง SEO และแปลภาษาปิด Open Question แล้ว 2026-09-22 ไม่มี badge DRAFT อีกต่อไป), เผยแพร่/บันทึกร่างจริงผ่าน `localStorage` แล้วพากลับ dashboard |
| `community-request-edit.html` | [[../community-content-edit-request-journey\|community-content-edit-request-journey]], BL-023 | ตรวจสิทธิ์จริง (ต้องเป็นเจ้าของ + สถานะเผยแพร่แล้ว), แสดงค่าเดิมคู่กับฟอร์มแก้ไข, validate ต้องมีการเปลี่ยนแปลงจริงก่อนส่ง, บันทึกเป็นคำขอสถานะ "รอพิจารณา" โดยคอนเทนต์จริงยังไม่เปลี่ยน |
| `admin-review-community.html` | [[../community-account-registration-journey\|community-account-registration-journey]], [[../community-content-edit-request-journey\|community-content-edit-request-journey]], [[../../02-technical/ACL\|ACL]] | แบนเนอร์แจ้งเตือนจำลอง, อนุมัติ/ไม่อนุมัติบัญชีชุมชนใหม่ (บังคับกรอกเหตุผลเมื่อไม่อนุมัติ), อนุมัติ/ไม่อนุมัติคำขอแก้ไขพร้อมแสดง diff เดิม-ใหม่ (อนุมัติแล้ว apply เข้าคอนเทนต์จริงทันที), ตารางประวัติทั้งสองประเภท |

## จุดที่ยังเป็น DRAFT

**ไม่มี** — จุดที่เคยเป็น DRAFT ในหน้าสร้างคอนเทนต์ (คำแนะนำ SEO step 4, การแปลภาษาอังกฤษ step 5) ปิด Open Question ครบแล้วเมื่อ 2026-09-22 (SEO = แนะนำ keyword ภายในระบบเท่านั้น ไม่เชื่อม search engine จริง, แปลภาษา = ข้อความอย่างเดียว ไม่มีเสียงพากย์/TTS) — ลบ badge DRAFT ออกจาก `community-create-content.html` แล้วเมื่อ 2026-09-23 (พบว่ายังหลงเหลืออยู่ตอนตรวจสอบความสอดคล้องกับการตัดสินใจล่าสุด ทั้งที่ Business Rule ปิดไปตั้งแต่วันเดียวกับที่สร้าง prototype นี้)

จุดอื่นทั้งหมด (สมัคร/อนุมัติบัญชีชุมชน, สิทธิ์เข้าถึงข้อมูลแบบ shared, คำขอแก้ไข→อนุมัติ) เป็น **Confirmed** ตาม Business Rules ที่ปิดแล้ว 2026-09-22 — รวมถึง 2 ข้อที่เคยเป็นข้อสันนิษฐานของ prototype นี้ (ปิดเพิ่มเติมวันเดียวกัน): ชุมชนแก้ไขได้เฉพาะคอนเทนต์ของตนเองเท่านั้น (ไม่รองรับข้ามชุมชน), และข้อมูลยืนยันตัวตนตอนสมัครใช้แค่ข้อมูลพื้นฐาน (ชื่อผู้ติดต่อ+เบอร์โทร) ไม่ต้องแนบเอกสาร

**การแก้ไข/ยกเลิกคำขอแก้ไขก่อนอาจารย์พิจารณา (ปิด 2026-09-23)**: ยืนยันแล้วว่าชุมชนแก้ไข/ยกเลิกคำขอที่ส่งไปแล้วไม่ได้ขณะสถานะ "รอพิจารณา" — `community-dashboard.html` แสดงแค่ badge สถานะ "มีคำขอแก้ไขรอพิจารณา" โดยไม่มีปุ่มแก้ไข/ยกเลิกใดๆ อยู่แล้ว ตรงกับ decision นี้โดยไม่ต้องแก้โค้ดเพิ่ม

## ทดสอบแล้วผ่าน Browser จริง (2026-09-22)

รันผ่าน local static server ชี้ไปที่โฟลเดอร์นี้ ทดสอบ flow เต็ม: สมัครบัญชี → ถูกบล็อกตอน login เพราะยังรออนุมัติ → อาจารย์อนุมัติบัญชี → login สำเร็จ → สร้าง+เผยแพร่คอนเทนต์ → เห็นคอนเทนต์ชุมชนอื่นแบบ read-only + ค้นหาแบบ live ทำงานถูกต้อง → ส่งคำขอแก้ไขคอนเทนต์ตนเอง → อาจารย์เห็น diff เดิม/ใหม่ถูกต้อง → อนุมัติ → คอนเทนต์จริงเปลี่ยนตามที่ขอ → ทดสอบเคสปฏิเสธ (ขอแก้ไขคอนเทนต์ชุมชนอื่นถูกบล็อกจริง, ฟอร์มสมัครบัญชี validate ช่องว่าง/อีเมลผิดรูปแบบถูกต้อง)

## เปิดดูอย่างไร

เปิดจากเบราว์เซอร์ตรง ๆ ไม่ได้ (ใช้ `localStorage` ต้องรันผ่าน HTTP) — รัน local static server ที่โฟลเดอร์นี้ก่อน เช่น `npx http-server -p 8743` แล้วเปิด `http://127.0.0.1:8743/community-register.html`
