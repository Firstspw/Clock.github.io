const video = document.getElementById('bg-video');
const muteBtn = document.getElementById('muteButton');
const startBtn = document.getElementById('startButton');
const introScreen = document.getElementById('introScreen');
let isMuted = true;

// ตอนแรก mute ไว้ก่อน
video.muted = true;
muteBtn.textContent = '🔇';

// เมื่อกดอนุญาต
startBtn.addEventListener('click', () => {
  video.muted = false;
  video.play();
  muteBtn.textContent = '🔊';

  // ค่อยๆ หาย intro
  introScreen.classList.add('fade-out');

  // ปิดการมองเห็นหลัง transition
  setTimeout(() => {
    introScreen.style.display = 'none';
  }, 1000);
});

// ปุ่ม mute/unmute
muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  video.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
});
