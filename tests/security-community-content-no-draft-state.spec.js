// เทสต์ความปลอดภัย 4: CommunityContent.read เช็คเงื่อนไขเดียวกับ LSHRequests/ContentEditRequests
// ที่เคยพบว่ารั่ว (`allow read: if request.auth != null || resource.data.status == 'เผยแพร่แล้ว';`
// — "login แล้วคนไหนก็ได้" อ่านได้ ไม่จำกัดเจ้าของ/teacher) แต่ **ต่างจากสองตัวก่อนหน้า**:
// ตรวจ `LSH/firestore.rules` แล้วพบว่า `create` บังคับ `status == 'เผยแพร่แล้ว'` เสมอ และ `update`
// จำกัดแค่ field `['title','bodyTh','caption','updatedAt']` (ไม่มี `status` อยู่ใน field ที่แก้ได้)
// — แปลว่า**ไม่มีทางที่เอกสารในคอลเลกชันนี้จะมีสถานะอื่นนอกจาก "เผยแพร่แล้ว" ได้เลยผ่านแอป** จึงไม่มี
// ข้อมูล "ส่วนตัว/ร่าง" ให้รั่วจริงในทางปฏิบัติตอนนี้ (rule read ที่ดูกว้างเกินไปจึงยังปลอดภัยอยู่ —
// ปลอดภัยเพราะ invariant นี้ ไม่ใช่เพราะ read rule เอง)
//
// เทสต์นี้จึงล็อก invariant ที่ทำให้ read rule ปัจจุบันปลอดภัยไว้แทน (ไม่ใช่เทสต์ "เปิดอ่านไม่ได้" แบบ
// สองตัวก่อนหน้า เพราะไม่มี state ส่วนตัวให้ทดสอบจริง): ถ้าวันไหนมีใครเพิ่ม field/path ที่ทำให้สร้าง
// เอกสารสถานะอื่นได้ (เช่น "ร่าง") เทสต์นี้จะพังทันที เป็นสัญญาณเตือนว่าต้องกลับไปแก้ CommunityContent.read
// ให้แคบลงแบบเดียวกับที่แก้ LSHRequests ไปแล้ว (ดู CLAUDE.md § เทสต์ความปลอดภัยอัตโนมัติ)
//
// ผ่านเมื่อ: พยายาม create เอกสารด้วย status อื่นที่ไม่ใช่ "เผยแพร่แล้ว" ต้องถูกปฏิเสธเสมอ

const { test, expect } = require('@playwright/test');
const { getDemoPassword } = require('./helpers/demo-credentials');

const PASSWORD = getDemoPassword();
const TEACHER_EMAIL = 'u004@example.com';
const SHARED_PASSWORD = 'AutoTestCommunity1234!';

test('CommunityContent สร้างเอกสารสถานะอื่นที่ไม่ใช่ "เผยแพร่แล้ว" ต้องถูกปฏิเสธเสมอ (invariant ที่ทำให้ read rule กว้างยังปลอดภัย)', async ({ page }) => {
  const runId = Date.now();
  const communityName = `AUTOTEST-SECURITY-DRAFT-${runId}`;
  const communityEmail = `autotest-security-draft-${runId}@lsh-nammon.test`;

  // ── สมัคร + อนุมัติบัญชีชุมชนทดสอบ ──
  await page.goto('/community-register.html');
  await page.getByRole('button', { name: 'สมัครบัญชีชุมชน' }).click();
  await page.locator('#reg-name').fill(communityName);
  await page.locator('#reg-email').fill(communityEmail);
  await page.locator('#reg-password').fill(SHARED_PASSWORD);
  await page.locator('#reg-contact').fill('AUTOTEST — นายทดสอบ ระบบอัตโนมัติ, โทร. 080-000-0000');
  await page.getByRole('button', { name: 'สมัครบัญชี' }).click();
  await expect(page.getByText('บัญชีของคุณกำลังรอการอนุมัติ')).toBeVisible({ timeout: 15_000 });
  // community-register.html ตั้ง justRegistered = true ก่อน await setDoc() เสร็จ (race condition
  // เดิมของแอป) หน้าจึงโชว์ "รอการอนุมัติ" ได้ก่อนเขียนจริงเสร็จ — ถ้า navigate ออกทันทีอาจตัดการ
  // เขียนที่ค้างอยู่กลางทาง ต้องรอ buffer ก่อน navigate ออกเสมอ
  await page.waitForTimeout(5_000);

  await page.goto('/admin-review-student-work.html');
  await page.locator('#login-email').fill(TEACHER_EMAIL);
  await page.locator('#login-password').fill(PASSWORD);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  const card = page.locator('.card', { hasText: communityName });
  await expect(card).toBeVisible({ timeout: 20_000 });

  // ดึง uid จาก onclick="approveAccount('<uid>')" ของปุ่มไว้ก่อนกด — ใช้ยืนยัน write จริงในขั้นถัดไป
  const approveBtn = card.getByRole('button', { name: 'อนุมัติ', exact: true });
  const onclickAttr = await approveBtn.getAttribute('onclick');
  const uid = onclickAttr.match(/approveAccount\('([^']+)'\)/)[1];

  await approveBtn.click();
  await expect(card).toBeHidden({ timeout: 15_000 });

  // การ์ดหายจาก onSnapshot ทันทีอาจเป็นแค่ local cache optimistic update — query แบบมี filter
  // (`where('status','==','รออนุมัติ')`) พบว่า onSnapshot ค้าง "from cache" อยู่นานผิดปกติแม้ reload
  // แล้วก็ตาม จึงเช็คแบบตรงที่สุดแทน: getDoc() เอกสาร users/{uid} ตรงๆ ไม่ผ่าน query/cache ของ UI เลย
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

  // ── login ชุมชนที่อนุมัติแล้ว แล้วพยายาม create CommunityContent สถานะ "ร่าง" ตรงๆ ผ่าน Firestore SDK ──
  await page.goto('/community-register.html'); // ต้อง navigate มาหน้า login ของชุมชนก่อน (ต่างจาก admin-review-student-work.html ที่เพิ่งใช้ login อาจารย์)
  await page.locator('#login-email').fill(communityEmail);
  await page.locator('#login-password').fill(SHARED_PASSWORD);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.waitForURL('**/community-dashboard.html', { timeout: 15_000 });

  const result = await page.evaluate(async () => {
    const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const app = getApps()[0] || initializeApp(window.LSH_FIREBASE_CONFIG);
    const db = getFirestore(app);
    const auth = getAuth(app);
    // auth.currentUser อาจยังเป็น null ชั่วขณะทันทีหลัง navigate แม้ redirect ไปหน้านี้ได้แล้วก็ตาม
    // (เป็นคนละ Firebase Auth instance state sync กับที่หน้าเว็บใช้ตอน redirect) ต้องรอให้ auth state
    // พร้อมจริงก่อน ไม่งั้น .uid จะ throw TypeError ธรรมดา (ไม่มี .code) แทนที่จะเป็น FirebaseError จริง
    const user = auth.currentUser || await new Promise((resolve) => {
      const unsub = auth.onAuthStateChanged((u) => { unsub(); resolve(u); });
    });
    try {
      await addDoc(collection(db, 'CommunityContent'), {
        title: 'AUTOTEST-SECURITY ควรถูกปฏิเสธ — ห้ามเขียนสำเร็จ',
        bodyTh: 'พยายามสร้างสถานะร่างตรงๆ',
        caption: '',
        communityId: user ? user.uid : null,
        communityName: 'ทดสอบ',
        status: 'ร่าง', // ไม่ใช่ 'เผยแพร่แล้ว' — ต้องถูก rule ปฏิเสธ
        createdAt: new Date().toISOString(),
        updatedAt: null,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, code: e.code, message: e.message };
    }
  });

  expect(
    result.ok,
    'คาดว่าจะถูกปฏิเสธด้วย permission-denied — ถ้า ok:true แปลว่าตอนนี้สร้างเอกสารสถานะอื่นที่ไม่ใช่ "เผยแพร่แล้ว" ได้แล้ว ทำให้ CommunityContent.read rule ที่กว้างอยู่ตอนนี้ (`request.auth != null`) กลายเป็นช่องโหว่จริงทันที ต้องไปแก้ CommunityContent.read ให้แคบลงแบบเดียวกับ LSHRequests: ' +
      JSON.stringify(result)
  ).toBe(false);
  expect(result.code).toBe('permission-denied');
});
