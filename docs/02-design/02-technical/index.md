# 02 - Technical

เก็บเอกสาร **การออกแบบเชิงเทคนิค (Technical Design)** เช่น

- System architecture / โครงสร้างระบบโดยรวม
- Database schema
- API design / data contract
- เทคโนโลยีและไลบรารีที่เลือกใช้ พร้อมเหตุผล

เอกสารในโฟลเดอร์นี้คือพิมพ์เขียวที่ทีมพัฒนาใช้อ้างอิงตอนลงมือเขียนโค้ด และเป็นฐานในการวางแผนทดสอบใน [[../../03-testing/01-test-plan/index|01-test-plan]]

## เอกสารในหมวดนี้

> ทุกไฟล์ในหมวดนี้เป็น **conceptual** — ยังไม่ผูกมัดกับ technical stack เฉพาะเจาะจง

- [[architecture|architecture]] — ภาพรวมระบบไฟล์เดียว: High-Level Architecture (component + data flow), Database Schema (ER Diagram + entity), และ API Spec รวมไว้ในไฟล์เดียวกัน
- [[detailed-design|detailed-design]] — Sequence Flow ของการทำงานสำคัญที่ข้าม component
