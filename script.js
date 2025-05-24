// ให้เสียงเล่นโดยอัตโนมัติเมื่อเปิดหน้าเว็บ
const video = document.getElementById('bg-video');
const muteBtn = document.getElementById('muteButton');
let isMuted = false; // เริ่มต้นเสียงเปิด

// ให้เสียงเล่นทันทีที่หน้าเว็บโหลด
window.addEventListener('load', () => {
  video.muted = isMuted; // กำหนดค่า mute หรือ unmute
});

// ฟังก์ชันสำหรับปุ่ม mute/unmute
muteBtn.addEventListener('click', () => {
  // เปลี่ยนสถานะเสียง
  isMuted = !isMuted;
  video.muted = isMuted; // ปรับเสียงของวิดีโอ
  muteBtn.textContent = isMuted ? '🔇' : '🔊'; // เปลี่ยนสัญลักษณ์ปุ่ม
});
