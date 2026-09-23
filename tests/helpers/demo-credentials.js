// อ่านรหัสผ่านสาธิต (ใช้ร่วมกันทุกบัญชี u001-u004) จาก LSH/DEMO_CREDENTIALS.md ที่ root ของ repo —
// ไฟล์นี้ถูก .gitignore ไว้ (ไม่ขึ้น GitHub) จึงต้องอ่านจาก local filesystem ตอนรันเทสต์เท่านั้น
// ห้าม hardcode รหัสผ่านไว้ในไฟล์ .spec.js ที่ commit เด็ดขาด (กฎ CLAUDE.md ห้ามใส่ความลับในไฟล์ที่ push
// ขึ้น GitHub) — อีเมล u001-u004@example.com ไม่ใช่ความลับ (มีอยู่แล้วใน LSH/scripts/seed-firestore.js
// ที่ commit ไว้) จึง hardcode ในสเปคได้ตามปกติ

const fs = require('fs');
const path = require('path');

function getDemoPassword() {
  const filePath = path.join(__dirname, '..', '..', 'LSH', 'DEMO_CREDENTIALS.md');
  if (!fs.existsSync(filePath)) {
    throw new Error(
      'ไม่พบ LSH/DEMO_CREDENTIALS.md — ไฟล์นี้ต้องมีในเครื่องก่อนรันเทสต์ที่ต้อง login ' +
      '(ไฟล์ gitignored ไว้ ไม่ได้ push ขึ้น GitHub ด้วยเหตุผลด้านความปลอดภัย — สร้างเองตามรูปแบบที่ CLAUDE.md อธิบายไว้)'
    );
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/\*\*`([^`]+)`\*\*/);
  if (!match) {
    throw new Error('อ่านรหัสผ่านจาก LSH/DEMO_CREDENTIALS.md ไม่สำเร็จ — รูปแบบไฟล์อาจเปลี่ยนไป');
  }
  return match[1];
}

module.exports = { getDemoPassword };
