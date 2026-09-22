// prototype-v4 (backend นักท่องเที่ยว) ใช้ Firebase project เดียวกับ prototype-v2 (lsh-nammon)
// ไฟล์ HTML ในโฟลเดอร์นี้ (tourist-login.html, tourist-search-results.html,
// tourist-story-detail.html, tourist-home-consent.html) โหลดค่า config จริงโดยตรงจาก
// "../prototype-v2/firebase-config.js" ผ่าน <script src="..."> — ไม่สร้างไฟล์ secret ซ้ำใน
// โฟลเดอร์นี้ เพราะเป็น Firebase project เดียวกัน (ดูเหตุผลเต็มใน README/รายงานของ agent ที่สร้าง
// โฟลเดอร์นี้)
//
// ไฟล์นี้เป็นแค่ template/เอกสารอ้างอิงเผื่ออนาคตต้องแยก config เฉพาะของ v4 เอง (เช่น ถ้าย้ายไป
// Firebase project อื่น) — คัดลอกรูปแบบมาจาก prototype-v2/firebase-config.example.js ทุกประการ
// ถ้าต้องใช้จริง: คัดลอกไฟล์นี้เป็น firebase-config.js (จะถูก .gitignore เหมือนกับของ v2) แล้วแก้
// <script src="../prototype-v2/firebase-config.js"> ในไฟล์ HTML ให้ชี้มาที่ "firebase-config.js"
// (ไฟล์ในโฟลเดอร์นี้เอง) แทน

window.LSH_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
