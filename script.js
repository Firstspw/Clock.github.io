document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('bg-video');
  const muteBtn = document.getElementById('muteButton');
  const startOverlay = document.getElementById('startOverlay');
  const startText = document.getElementById('startText');
  const mainContent = document.getElementById('mainContent');
  let isMuted = false;

  // เมื่อคลิกข้อความเริ่มต้น
  startText.addEventListener('click', async () => {
    try {
      video.muted = false;
      await video.play();
    } catch (err) {
      console.warn('Autoplay failed, trying again muted...', err);
      video.muted = true;
      video.play();
    }

    // หลังหน้าดำ fade out ค่อยแสดงเนื้อหา
    setTimeout(() => {
      startOverlay.style.display = 'none';
      mainContent.classList.add('show');
    }, 1000);

    startOverlay.classList.add('fade-out');

    setTimeout(() => {
      startOverlay.style.display = 'none';
    }, 1000);
  });

  // ปุ่มปิดเสียง
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    video.muted = isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  });

  // ตรวจสอบการเล่นซ้ำถ้าไม่ทำงาน
  video.addEventListener('error', () => {
    console.error('Video error occurred. Retrying...');
    video.load();
    video.play().catch(err => console.error('Retry failed:', err));
  });
});

const glow = document.getElementById("cursor-glow");

document.addEventListener("mousemove", (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;

  // ใบไม้แบบสุ่มเล็กน้อย ไม่ทับซ้อนมาก
  if (Math.random() < 0.1) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = e.clientX + Math.random() * 20 - 10 + "px";
    leaf.style.top = e.clientY + "px";
    document.body.appendChild(leaf);

    // ลบหลังจากตก
    setTimeout(() => {
      document.body.removeChild(leaf);
    }, 1000);
  }
});
