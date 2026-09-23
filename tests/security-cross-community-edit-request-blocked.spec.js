// เทสต์ความปลอดภัย 3: "login ด้วยบัญชีชุมชนที่สอง แล้วเปิดคำขอแก้ไขคอนเทนต์ (ที่ยังไม่พิจารณา) ของ
// ชุมชนแรก ต้องเปิดไม่ได้" — เหมือนกับ security-cross-user-pending-work-blocked.spec.js แต่เป็น
// collection ContentEditRequests แทน LSHRequests (พบว่ามี rule pattern เดียวกัน —
// `allow read: if request.auth != null;` เปิดให้ผู้ใช้ login คนไหนก็ได้อ่านคำขอแก้ไขของชุมชนอื่น
// ได้หมด ไม่จำกัดว่าต้องเป็นเจ้าของ/teacher — ดู CLAUDE.md § เทสต์ความปลอดภัยอัตโนมัติ)
//
// ไม่มีหน้า UI ไหนที่พาไปเปิดคำขอแก้ไขของชุมชนอื่นตรงๆ (ต่างจาก LSHRequests ที่มี
// tourist-story-detail.html ที่ตรวจได้) จึงทดสอบที่ระดับ Firestore rule โดยตรงผ่าน page.evaluate
// เรียก getDoc() ด้วย Firebase SDK เดียวกับที่แอปใช้อยู่แล้ว ภายใต้ session ที่ login จริงของบัญชี B
// (ไม่ใช่ JS injection เพื่อ bypass การกระทำผู้ใช้ — เป็นการเช็ค "สิทธิ์จริง" ของ session ที่ login
// จริงผ่าน UI แล้ว ตรงประเด็นที่สุดสำหรับเทสต์ rules)
//
// ผ่านเมื่อ: getDoc() ถูกปฏิเสธด้วย error code 'permission-denied' จริง ไม่ใช่อ่านสำเร็จ

const { test, expect } = require('@playwright/test');
const { getDemoPassword } = require('./helpers/demo-credentials');

const PASSWORD = getDemoPassword();
const TEACHER_EMAIL = 'u004@example.com'; // อีเมลนี้ไม่ใช่ความลับ (อยู่ใน LSH/scripts/seed-firestore.js ที่ commit ไว้แล้ว)
const SHARED_PASSWORD = 'AutoTestCommunity1234!'; // รหัสผ่านบัญชีชุมชนที่สมัครใหม่เอง ไม่ใช่รหัสสาธิตของ u001-u004 จึง hardcode ได้ปกติ

async function registerCommunity(page, name, email) {
  await page.goto('/community-register.html');
  await page.getByRole('button', { name: 'สมัครบัญชีชุมชน' }).click();
  await page.locator('#reg-name').fill(name);
  await page.locator('#reg-email').fill(email);
  await page.locator('#reg-password').fill(SHARED_PASSWORD);
  await page.locator('#reg-contact').fill('AUTOTEST — นายทดสอบ ระบบอัตโนมัติ, โทร. 080-000-0000');
  await page.getByRole('button', { name: 'สมัครบัญชี' }).click();
  await expect(page.getByText('บัญชีของคุณกำลังรอการอนุมัติ')).toBeVisible({ timeout: 15_000 });
  // community-register.html ตั้ง justRegistered = true ก่อน await setDoc() เสร็จ (race condition
  // เดิมของแอป เหมือนที่เคยพบใน tourist-login.html — ดู docs/05-log/index.md) หน้าจึงโชว์ข้อความ
  // "รอการอนุมัติ" ได้ก่อนที่ setDoc() จะเขียนจริงเสร็จ — ถ้า navigate ออกทันทีอาจตัดการเขียนที่ค้าง
  // อยู่กลางทาง (browser ตัดการเชื่อมต่อ WebChannel ของหน้าเดิมทันทีที่ navigate) ทำให้ users doc
  // ไม่ถูกสร้างเลย ต้องรอ buffer ก่อนออกจากหน้าเสมอ
  await page.waitForTimeout(5_000);
}

async function approveCommunityAccount(page, name) {
  await page.goto('/admin-review-student-work.html');
  await page.locator('#login-email').fill(TEACHER_EMAIL);
  await page.locator('#login-password').fill(PASSWORD);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  const card = page.locator('.card', { hasText: name });
  await expect(card).toBeVisible({ timeout: 20_000 });

  // ดึง uid จาก onclick="approveAccount('<uid>')" ของปุ่มไว้ก่อนกด — ใช้ยืนยัน write จริงในขั้นถัดไป
  const approveBtn = card.getByRole('button', { name: 'อนุมัติ', exact: true });
  const onclickAttr = await approveBtn.getAttribute('onclick');
  const uid = onclickAttr.match(/approveAccount\('([^']+)'\)/)[1];

  await approveBtn.click();
  await expect(card).toBeHidden({ timeout: 15_000 });

  // การ์ดหายจาก onSnapshot ทันทีอาจเป็นแค่ local cache optimistic update — เคยลองยืนยันด้วยการ
  // reload หน้า query (`where('status','==','รออนุมัติ')`) แล้วพบว่า onSnapshot ของ query แบบมี
  // filter นี้ค้าง "from cache" อยู่นานผิดปกติ (สังเกตว่า reload ซ้ำกี่ครั้งก็ไม่เห็นข้อมูลสดจาก
  // เซิร์ฟเวอร์เลยแม้รอ 20s) จึงเปลี่ยนมาเช็คแบบตรงที่สุดแทน: getDoc() เอกสาร users/{uid} ตรงๆ
  // (ไม่ผ่าน query/cache ของหน้า UI เลย) เพื่อยืนยัน status จริงบนเซิร์ฟเวอร์
  await expect(async () => {
    const result = await page.evaluate(async (targetUid) => {
      const { getApps } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      const { getFirestore, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const app = getApps()[0];
      const db = getFirestore(app);
      const snap = await getDoc(doc(db, 'users', targetUid));
      return snap.exists() ? snap.data().status : null;
    }, uid);
    expect(result).toBe('อนุมัติแล้ว');
  }).toPass({ timeout: 15_000 });

  await page.getByRole('button', { name: 'ออกจากระบบ' }).click();
  await page.waitForSelector('#login-email', { state: 'visible', timeout: 15_000 });
}

// getDoc() ใน approveCommunityAccount ยืนยันแล้วว่า status เปลี่ยนบน server จริง แต่บางครั้ง login
// ครั้งถัดไปของ "บัญชีเดียวกันนั้นเอง" (ผ่าน onAuthStateChanged → getDoc ของหน้า login) ยังเจอ
// "รอการอนุมัติ" อยู่ — ไม่พบสาเหตุแน่ชัด (ไม่ใช่ local cache เพราะไม่ได้เปิด persistence ในแอปนี้เลย)
// จึงเผื่อไว้ด้วยการ retry login ทั้งก้อน (goto ใหม่ + กรอก + กด) แทนที่จะเชื่อครั้งเดียว
async function loginAsCommunityRetrying(page, email) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    await page.goto('/community-register.html');
    await page.locator('#login-email').fill(email);
    await page.locator('#login-password').fill(SHARED_PASSWORD);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    try {
      await page.waitForURL('**/community-dashboard.html', { timeout: 10_000 });
      return;
    } catch (e) {
      if (attempt === 4) throw e;
      await page.waitForTimeout(3_000);
    }
  }
}

test('login บัญชีชุมชนที่สอง แล้วอ่านคำขอแก้ไขคอนเทนต์ของชุมชนแรก (รอพิจารณา) ต้องอ่านไม่ได้', async ({ page }) => {
  const runId = Date.now();
  const communityAName = `AUTOTEST-SECURITY-A-${runId}`;
  const communityBName = `AUTOTEST-SECURITY-B-${runId}`;
  const communityAEmail = `autotest-security-a-${runId}@lsh-nammon.test`;
  const communityBEmail = `autotest-security-b-${runId}@lsh-nammon.test`;
  const contentTitle = `[AUTOTEST-SECURITY-${runId}] คอนเทนต์ต้นฉบับของชุมชน A`;
  const secretProposedTitle = `[AUTOTEST-SECURITY-${runId}] ข้อเสนอแก้ไขลับ ห้ามชุมชน B เห็น`;

  // ── สมัคร + อนุมัติชุมชน A และ B ──
  await registerCommunity(page, communityAName, communityAEmail);
  await approveCommunityAccount(page, communityAName);
  await registerCommunity(page, communityBName, communityBEmail);
  await approveCommunityAccount(page, communityBName);

  // ── ชุมชน A สร้างคอนเทนต์ แล้วส่งคำขอแก้ไข (ทิ้งไว้สถานะ "รอพิจารณา") ──
  await loginAsCommunityRetrying(page, communityAEmail);

  await page.goto('/community-create-content.html');
  await page.locator('#content-title').fill(contentTitle);
  await page.locator('#caption').fill('เนื้อหาต้นฉบับ — สร้างโดยเทสต์ความปลอดภัย ลบทิ้งได้');
  await page.getByRole('button', { name: 'เผยแพร่คอนเทนต์' }).click();
  await page.waitForURL('**/community-dashboard.html', { timeout: 15_000 });

  const row = page.locator('#own-rows tr', { hasText: contentTitle });
  await expect(row).toBeVisible({ timeout: 15_000 });
  await row.getByRole('link', { name: 'ขอแก้ไข' }).click();
  await page.waitForURL('**/community-request-edit.html*', { timeout: 15_000 });

  await page.locator('#new-title').fill(secretProposedTitle);
  await page.getByRole('button', { name: 'ส่งคำขอแก้ไข' }).click();
  await page.waitForURL('**/community-dashboard.html', { timeout: 15_000 });

  // editsQuery เป็น onSnapshot คนละตัวกับ ownQuery ใน community-dashboard.html อาจ fire ช้ากว่า
  // เล็กน้อย (attribute data-edit-id เพิ่งถูกเติมทีหลัง row ปรากฏ) จึง poll รอจนกว่าจะไม่ null
  const rowAfter = page.locator('#own-rows tr', { hasText: contentTitle });
  await expect(rowAfter).toBeVisible({ timeout: 15_000 });
  let editRequestId = null;
  await expect(async () => {
    editRequestId = await rowAfter.getAttribute('data-edit-id');
    expect(editRequestId).toBeTruthy();
  }).toPass({ timeout: 15_000 });

  await page.getByRole('button', { name: 'ออกจากระบบ' }).click();
  await page.waitForSelector('#login-email', { state: 'visible', timeout: 15_000 });

  // ── ชุมชน B login แล้วพยายามอ่านคำขอแก้ไขของ A ตรงๆ ผ่าน Firestore SDK เดียวกับที่แอปใช้ ──
  await loginAsCommunityRetrying(page, communityBEmail);

  const result = await page.evaluate(async (docId) => {
    const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getFirestore, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const app = getApps()[0] || initializeApp(window.LSH_FIREBASE_CONFIG);
    const db = getFirestore(app);
    try {
      const snap = await getDoc(doc(db, 'ContentEditRequests', docId));
      return { ok: true, exists: snap.exists(), data: snap.exists() ? snap.data() : null };
    } catch (e) {
      return { ok: false, code: e.code, message: e.message };
    }
  }, editRequestId);

  expect(
    result.ok,
    'คาดว่าจะถูกปฏิเสธด้วย permission-denied — ถ้า ok:true แปลว่าชุมชน B อ่านคำขอแก้ไขของชุมชน A ได้จริง (รั่วที่ชั้นสิทธิ์) ต้องไปแก้ LSH/firestore.rules: ' +
      JSON.stringify(result)
  ).toBe(false);
  expect(result.code).toBe('permission-denied');
});
