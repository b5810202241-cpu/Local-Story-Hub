# Open Questions Tracker

_อัปเดตล่าสุด: 2026-09-22 — ไฟล์นี้ regenerate ทุกครั้งที่รัน ไม่ใช่ log ประวัติ (ดูประวัติการเปลี่ยนแปลงที่ [[../../05-log/index|05-log]])_

> 🎉 **ปิด Open Questions ครบทุกข้อในทั้งโปรเจกต์แล้ว ณ 2026-09-22** — จาก 16 ข้อที่ค้างอยู่ตอนเริ่มวันนี้ (กระจายอยู่ 3 ไฟล์ spec) ปิดไปทั้งหมด (พบข้อที่ไม่เคยติดตามมาก่อนเพิ่ม 1 ข้อระหว่างทางแล้วปิดไปด้วย) **ไม่มี Open Question ค้างอยู่ในไฟล์ spec ใดเลย** — ดู Business Rules ในแต่ละไฟล์ spec สำหรับคำตอบทั้งหมด และดู [[../../05-log/index|05-log]] สำหรับรายละเอียดการตัดสินใจแต่ละข้อ (ตัวเลือกที่เสนอ, เหตุผลที่เลือก)
>
> ไฟล์นี้ยังคงอยู่และจะ regenerate ใหม่ทุกครั้งที่มี Open Question ใหม่เกิดขึ้น (เช่น จากสเปคใหม่ที่เพิ่มเข้ามาในอนาคต) — ไม่ได้ลบทิ้งเพราะยังเป็นเครื่องมือติดตามมาตรฐานของ pipeline

## ✅ สเปคที่ไม่มี Open Question เหลือแล้ว — พร้อมเข้า `02-design` เต็มที่

- **[[../01-spec/local-story-hub|local-story-hub]]** — ปิดครบทุกข้อเมื่อ 2026-09-22 (แพลตฟอร์ม, สิทธิ์การเข้าถึงชุมชน, ขอบเขตระบบจัดการข้อมูล, SEO, ภาษาที่รองรับ, TTS, เชื่อมโยงผลงานนิสิต-ชุมชน, out of scope, NFR)
- **[[../01-spec/20260822-01-it-log-pdpa-consent|20260822-01-it-log-pdpa-consent]]** — ปิดครบทุกข้อเมื่อ 2026-09-22 (Data Controller, Consent granular/เดียว, Log field/สิทธิ์เข้าถึง, tracking tools อื่น, สิทธิ์เจ้าของข้อมูล)
- **[[../01-spec/20260912-01-account-registration-approval|20260912-01-account-registration-approval]]** — ปิดครบทุกข้อเมื่อ 2026-09-12
- **[[../01-spec/20260912-02-public-view-search-published-works|20260912-02-public-view-search-published-works]]** — ปิดครบทุกข้อเมื่อ 2026-09-22 (ขอบเขตการค้นหา, ตำแหน่งหน้าจอ)

## สรุป

- รวม **0 Open Questions** ค้างอยู่ในทั้งโปรเจกต์
- **4 ไฟล์ spec** ปิด Open Question ครบทุกไฟล์แล้ว พร้อมเข้า `02-design` เต็มที่
- **User Journey ทุกไฟล์เป็น Confirmed แล้ว**: `tourist-journey`, `community-content-journey`, `student-content-journey`, `community-account-registration-journey`, `community-content-edit-request-journey`, `student-account-registration-journey`, `public-view-search-journey`
- **Test case ที่เป็น DRAFT**: 0 จาก 36 ข้อ
- **กระทบ scope ใหญ่ (gate-blocking ตาม CLAUDE.md)**: ไม่มี (ปิดครบตั้งแต่ช่วงแรกของวันนี้)

> **หมายเหตุสำหรับรอบถัดไป**: งานค้างที่เคยระบุไว้ในรอบก่อนหน้า (login inconsistency ของนักท่องเที่ยว, ACL.md ไม่ครอบคลุมนักท่องเที่ยวมีบัญชี, ชุมชนแก้ไขข้ามชุมชนได้ไหม, ข้อมูลยืนยันตัวตนชุมชน) ได้รับการจัดการครบแล้วเมื่อ 2026-09-22 — เหลือเพียง **BL-014/BL-017** ที่ต้องรอโค้ดจริงถึงจะมี test case แบบ backend/integration ได้ (ดู [[../../02-design/02-technical/detailed-design|detailed-design.md]] § Open Items)
