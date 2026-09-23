// เทสต์ความปลอดภัย 1/2: "ไม่ login แล้วเปิดหน้ารายการ ต้องอ่านข้อมูลไม่ได้"
// ผ่านเมื่อ: เข้าไม่ได้ (admin-review-student-work.html แสดงแค่ฟอร์ม login, page-view ที่รวม
// ผลงานทุกสถานะของทุกนิสิตไม่ถูกแสดง, และไม่มี startListening() ทำงานเลยเพราะไม่มี user —
// จึงไม่มี .card element ใดๆ หลุดออกมาให้เห็นก่อน/หลัง gate)
// context ของแต่ละ test ใน Playwright เป็นของใหม่เสมอ (ไม่มี cookie/localStorage ค้าง) จึงเทียบเท่า
// "ไม่ได้ล็อกอิน" อยู่แล้ว

const { test, expect } = require('@playwright/test');

test('ไม่ login แล้วเปิดหน้ารีวิวผลงานของอาจารย์ ต้องอ่านข้อมูลไม่ได้', async ({ page }) => {
  await page.goto('/admin-review-student-work.html');

  await expect(page.locator('#login-view')).toBeVisible();
  await expect(page.locator('#page-view')).toBeHidden();
  await expect(page.locator('#deny-view')).toBeHidden();

  // ยืนยันว่าไม่มีการ์ดผลงาน/บัญชี/คำขอแก้ไขใดๆ หลุดออกมาให้เห็นก่อนเด้ง (ไม่รั่วข้อมูล) — เช็คที่
  // container ที่ถูกเติมข้อมูลจริงโดยตรง (ไม่ใช้ selector `.card` แบบกว้างทั้งหน้า เพราะหน้านี้มี
  // `#ai-summary-result` เป็น .card เปล่าที่อยู่ในโค้ด HTML แบบ static อยู่แล้วโดยไม่เกี่ยวกับข้อมูล
  // รั่วเลย — ใช้แล้วเจอ false positive มาก่อน) ยืนยันว่าไม่มี data ถูก render ตั้งแต่ต้น เพราะ
  // startListening()/startListeningAccounts()/startListeningEdits()/startListeningAccessLog()
  // ถูกเรียกเฉพาะตอน role === 'teacher' เท่านั้น
  await expect(page.locator('#pending-list')).toBeEmpty();
  await expect(page.locator('#pending-accounts-list')).toBeEmpty();
  await expect(page.locator('#pending-edits-list')).toBeEmpty();
  await expect(page.locator('#reviewed-body')).toBeEmpty();
  await expect(page.locator('#edits-reviewed-body')).toBeEmpty();
  await expect(page.locator('#access-log-body')).toBeEmpty();
});
