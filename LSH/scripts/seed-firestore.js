const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    `ไม่พบไฟล์ service account key ที่ ${serviceAccountPath}\n` +
    'ดาวน์โหลดจาก Firebase Console > Project Settings > Service Accounts > Generate new private key ' +
    'แล้ววางไว้ที่ path ด้านบนก่อนรันสคริปต์นี้'
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

const daysAgo = (n) =>
  admin.firestore.Timestamp.fromDate(new Date(Date.now() - n * 24 * 60 * 60 * 1000));

const users = [
  { id: 'u001', name: 'แสนสวย ร่ำรวยเสน่ห์', email: 'u001@example.com', role: 'student' },
  { id: 'u002', name: 'มิลเลียน น่ารัก', email: 'u002@example.com', role: 'student' },
  { id: 'u003', name: 'แซมมี่ จัง', email: 'u003@example.com', role: 'student' },
  { id: 'u004', name: 'อ.ที่ปรึกษา LSH', email: 'u004@example.com', role: 'teacher' },
];

const contentTypes = [
  { id: 'ct001', name: 'VOD' },
  { id: 'ct002', name: 'album photo' },
  { id: 'ct003', name: 'Storytelling' },
];

const lshRequests = [
  {
    id: 'req001',
    title: 'คลิป VOD แนะนำตัว',
    Content: 'วิดีโอแนะนำตัวเองสำหรับกิจกรรม LSH',
    status: 'รอพิจารณา',
    requesterId: 'u001',
    requesterName: 'แสนสวย ร่ำรวยเสน่ห์',
    approverId: null,
    approverName: null,
    LSHTypeId: 'ct001',
    LSHTypeName: 'VOD',
    createdAt: daysAgo(1),
  },
  {
    id: 'req002',
    title: 'อัลบั้มภาพกิจกรรมค่าย',
    Content: 'รวมภาพถ่ายกิจกรรมค่ายอาสา',
    status: 'รอพิจารณา',
    requesterId: 'u002',
    requesterName: 'มิลเลียน น่ารัก',
    approverId: null,
    approverName: null,
    LSHTypeId: 'ct002',
    LSHTypeName: 'album photo',
    createdAt: daysAgo(2),
  },
  {
    id: 'req003',
    title: 'เล่าเรื่องประสบการณ์ฝึกงาน',
    Content: 'บทความเล่าประสบการณ์การฝึกงาน',
    status: 'รอพิจารณา',
    requesterId: 'u003',
    requesterName: 'แซมมี่ จัง',
    approverId: null,
    approverName: null,
    LSHTypeId: 'ct003',
    LSHTypeName: 'Storytelling',
    createdAt: daysAgo(3),
  },
  {
    id: 'req004',
    title: 'อัลบั้มภาพงานปัจฉิม',
    Content: 'ภาพถ่ายกิจกรรมงานปัจฉิมนิเทศ',
    status: 'อนุมัติ',
    requesterId: 'u001',
    requesterName: 'แสนสวย ร่ำรวยเสน่ห์',
    approverId: 'u004',
    approverName: 'อ.ที่ปรึกษา LSH',
    LSHTypeId: 'ct002',
    LSHTypeName: 'album photo',
    createdAt: daysAgo(4),
  },
  {
    id: 'req005',
    title: 'เล่าเรื่องการเดินทาง',
    Content: 'บทความเล่าเรื่องการเดินทางท่องเที่ยว',
    status: 'ไม่อนุมัติ',
    requesterId: 'u002',
    requesterName: 'มิลเลียน น่ารัก',
    approverId: 'u004',
    approverName: 'อ.ที่ปรึกษา LSH',
    LSHTypeId: 'ct003',
    LSHTypeName: 'Storytelling',
    createdAt: daysAgo(5),
  },
];

async function seed() {
  const batch = db.batch();

  for (const { id, ...data } of users) {
    batch.set(db.collection('users').doc(id), data);
  }
  for (const { id, ...data } of contentTypes) {
    batch.set(db.collection('ContentTypes').doc(id), data);
  }
  for (const { id, ...data } of lshRequests) {
    batch.set(db.collection('LSHRequests').doc(id), data);
  }

  await batch.commit();

  console.log(`เขียนข้อมูลสำเร็จ: users (${users.length}), ContentTypes (${contentTypes.length}), LSHRequests (${lshRequests.length})`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('เกิดข้อผิดพลาดระหว่าง seed ข้อมูล:', err);
    process.exit(1);
  });
