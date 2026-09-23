// เทสต์ความปลอดภัย 2/2: "login ด้วยบัญชีที่สอง แล้วเปิดผลงาน (ที่ยังไม่อนุมัติ) ของบัญชีแรก ต้องเปิดไม่ได้"
//
// ผ่านเมื่อ: เข้าไม่ได้ทั้งสองระดับ —
//   (1) ระดับ UI: ไม่มีชื่อ/เนื้อหาผลงานของบัญชี A รั่วออกมาให้บัญชี B เห็นเลย
//   (2) ระดับ Firestore rules: การอ่านเอกสารต้องถูก "ปฏิเสธจริง" (permission-denied) ไม่ใช่แค่ client
//       ฝั่ง B อ่านสำเร็จแล้วซ่อนด้วย JS เฉยๆ — เช็คระดับนี้เพิ่มเพราะ LSHRequests.rules เดิมเปิด
//       read ให้ "ผู้ใช้ที่ login แล้วคนไหนก็ได้" (request.auth != null) ไม่ได้จำกัดว่าต้องเป็น
//       เจ้าของหรือ role=teacher — ถ้าเทสต์นี้ไม่ผ่านที่ระดับ (2) แปลว่าข้อมูลรั่วจริงที่ชั้นสิทธิ์
//       ต้องไปแก้ LSH/firestore.rules ห้ามแก้เทสต์นี้ให้ผ่านง่ายๆ แทน
//
// ใช้บัญชีสาธิตที่มีอยู่แล้ว (u002 = บัญชี A, u003 = บัญชี B) แทนการสมัครใหม่ เพราะบัญชีนิสิตใหม่
// ต้องรอครูอนุมัติก่อนถึงจะส่งผลงานได้ (BL-019) — อีเมล u001-u004@example.com ไม่ใช่ความลับ (อยู่ใน
// LSH/scripts/seed-firestore.js ที่ commit ไว้แล้ว) ส่วนรหัสผ่านอ่านจาก LSH/DEMO_CREDENTIALS.md
// (gitignored) ผ่าน helper ห้าม hardcode ในไฟล์นี้

const { test, expect } = require('@playwright/test');
const { getDemoPassword } = require('./helpers/demo-credentials');

const PASSWORD = getDemoPassword();
const STUDENT_A_EMAIL = 'u002@example.com';
const STUDENT_B_EMAIL = 'u003@example.com';

test('login บัญชีที่สอง แล้วเปิดผลงาน (ยังไม่อนุมัติ) ของบัญชีแรก ต้องเปิดไม่ได้', async ({ page }) => {
  const runId = Date.now();
  const secretTitle = `[AUTOTEST-SECURITY-${runId}] ผลงานลับของบัญชี A ห้ามบัญชี B เห็น`;

  // ── บัญชี A (u002) ส่งผลงานใหม่ ทิ้งไว้สถานะ "รอพิจารณา" (ไม่อนุมัติ ไม่ปฏิเสธ) ──
  await page.goto('/student-publish.html');
  await page.locator('#login-email').fill(STUDENT_A_EMAIL);
  await page.locator('#login-password').fill(PASSWORD);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.waitForSelector('#submit-btn', { state: 'visible', timeout: 15_000 });

  await page.locator('#title').fill(secretTitle);
  await page.locator('#desc').fill('เนื้อหาลับที่บัญชี B ต้องอ่านไม่ได้ — สร้างโดยเทสต์ความปลอดภัย ลบทิ้งได้');
  await page.getByRole('button', { name: 'ส่งขออนุมัติเพื่อเผยแพร่' }).click();
  await page.waitForURL('**/admin-review-student-work.html', { timeout: 15_000 });

  // กลับไปหน้านิสิตเพื่ออ่าน id ของผลงานที่เพิ่งส่ง จาก "ผลงานที่เคยส่งของคุณ" ของตัวเอง (เจ้าของ
  // อ่าน id งานตัวเองได้ปกติอยู่แล้ว ไม่ใช่การ bypass สิทธิ์)
  await page.goto('/student-publish.html');
  await page.waitForSelector('#my-submissions-list', { state: 'visible', timeout: 15_000 });
  const row = page.locator('.submission-item', { hasText: secretTitle });
  await expect(row).toBeVisible({ timeout: 15_000 });
  const workId = await row.getAttribute('data-id');
  expect(workId, 'ต้องอ่าน id ของผลงานที่เพิ่งสร้างได้').toBeTruthy();

  await page.getByRole('button', { name: 'ออกจากระบบ' }).click();
  await page.waitForSelector('#login-email', { state: 'visible', timeout: 15_000 });

  // ── บัญชี B (u003) พยายามเปิดผลงานของ A ตรงๆ ผ่าน URL ──
  const consoleMessages = [];
  page.on('console', (msg) => consoleMessages.push(msg.text()));

  await page.goto('/student-publish.html');
  await page.locator('#login-email').fill(STUDENT_B_EMAIL);
  await page.locator('#login-password').fill(PASSWORD);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.waitForSelector('#submit-btn', { state: 'visible', timeout: 15_000 });

  await page.goto('/tourist-story-detail.html?type=student&id=' + workId);
  await page.waitForTimeout(3_000); // ให้เวลา Firestore read + render เสร็จก่อนตรวจ

  // (1) ระดับ UI: ต้องไม่มีชื่อ/เนื้อหาผลงานของ A รั่วออกมาให้เห็นเลย
  await expect(page.getByText(secretTitle)).toHaveCount(0);

  // (2) ระดับ Firestore rules: ต้องเจอ error "ปฏิเสธสิทธิ์" จริง ไม่ใช่แค่หน้าเว็บซ่อนเฉยๆ —
  // ถ้า console ไม่มี error แบบนี้เลย แปลว่า Firestore อนุญาตให้ B อ่านเอกสารของ A สำเร็จจริง
  // (รั่วที่ชั้นสิทธิ์) แค่ JS หน้าเว็บบังเอิญไม่แสดงผลลัพธ์ให้เห็นเท่านั้น
  const deniedAtRulesLevel = consoleMessages.some(
    (m) => m.includes('permission') || m.includes('insufficient') || m.includes('PERMISSION_DENIED')
  );
  expect(
    deniedAtRulesLevel,
    'คาดว่าจะเจอ permission-denied ใน console — ถ้าไม่เจอแปลว่า Firestore rules อนุญาตให้อ่านเอกสารของคนอื่นได้จริง (รั่วที่ชั้นสิทธิ์ ไม่ใช่แค่ UI ซ่อน) ต้องไปแก้ LSH/firestore.rules'
  ).toBe(true);
});
