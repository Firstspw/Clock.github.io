document.addEventListener("DOMContentLoaded", () => {
    const clockEl = document.getElementById("clock");
    const video = document.getElementById("bg-video");
    const toggleBtn = document.getElementById("music-toggle");

    const volumeBar = document.getElementById("volume-bar");
    const volumeFill = document.getElementById("volume-fill");
    const volumePercent = document.getElementById("volume-percent");

    let currentVolume = parseFloat(localStorage.getItem("videoVolume")) || 0.5;
    let isMuted = localStorage.getItem("videoMuted") === "true";
    let isDragging = false;
    let lastDigits = [];

    // ตั้งค่าตามที่เคยบันทึกไว้
    video.volume = currentVolume;
    video.muted = isMuted;
    updateVolumeUI(currentVolume);
    updateToggleIcon();

    // พยายามเล่นวิดีโอ ตามสถานะ muted
    video.play().then(() => {
        console.log("Video autoplayed");
    }).catch((err) => {
        // ถ้าเล่นไม่ได้เพราะไม่ mute → ลอง mute แล้วเล่นใหม่
        if (!video.muted) {
            video.muted = true;
            video.play();
            updateToggleIcon();
        }
    });

    // ปุ่ม toggle เปิด/ปิดเสียง
    toggleBtn.addEventListener("click", () => {
        if (video.muted || video.volume === 0) {
            // เปิดเสียง
            if (video.volume === 0) {
                setVolume(0.25);
            }
            video.muted = false;
        } else {
            video.muted = true;
        }
        localStorage.setItem("videoMuted", video.muted);
        updateToggleIcon();
    });

    function updateToggleIcon() {
        toggleBtn.textContent = (video.muted || video.volume === 0) ? "🔇" : "🔈";
    }

    // ปรับระดับเสียง
    volumeBar.addEventListener("click", (e) => {
        const percent = getVolumePercent(e);
        setVolume(percent);
    });

    volumeBar.addEventListener("mousedown", () => isDragging = true);
    document.addEventListener("mouseup", () => isDragging = false);
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const percent = getVolumePercent(e);
            setVolume(percent);
        }
    });

    volumeBar.addEventListener("touchstart", () => isDragging = true);
    document.addEventListener("touchend", () => isDragging = false);
    document.addEventListener("touchmove", (e) => {
        if (isDragging && e.touches.length) {
            const percent = getVolumePercent(e.touches[0]);
            setVolume(percent);
        }
    });

    function setVolume(percent) {
        currentVolume = percent;
        video.volume = percent;
        video.muted = false;
        localStorage.setItem("videoVolume", percent);
        localStorage.setItem("videoMuted", "false");
        updateVolumeUI(percent);
        updateToggleIcon();
    }

    function getVolumePercent(e) {
        const rect = volumeBar.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const percent = 1 - y / rect.height;
        return Math.min(Math.max(percent, 0), 1);
    }

    function updateVolumeUI(percent) {
        volumeFill.style.height = `${percent * 100}%`;
        volumePercent.textContent = `${Math.round(percent * 100)}%`;
    }

    // ฟังก์ชันนาฬิกา
    function createDigit(char, isColon = false) {
        const container = document.createElement("div");
        if (isColon) {
            container.className = "colon";
            container.textContent = ":";
        } else {
            container.className = "digit";
            const span = document.createElement("span");
            span.textContent = char;
            span.className = "current";
            container.appendChild(span);
        }
        return container;
    }

    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('th-TH', {
            timeZone: 'Asia/Bangkok',
            hour12: false
        });

        if (lastDigits.length === 0) {
            for (let i = 0; i < timeStr.length; i++) {
                const isColon = timeStr[i] === ":";
                const digit = createDigit(timeStr[i], isColon);
                clockEl.appendChild(digit);
                lastDigits.push(timeStr[i]);
            }
        } else {
            for (let i = 0; i < timeStr.length; i++) {
                if (timeStr[i] === lastDigits[i]) continue;

                const container = clockEl.children[i];
                if (timeStr[i] === ":") continue;

                const oldSpan = container.querySelector(".current");
                const newSpan = document.createElement("span");
                newSpan.textContent = timeStr[i];
                newSpan.className = "new";
                container.appendChild(newSpan);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        container.classList.add("animate");
                        newSpan.classList.remove("new");
                        newSpan.classList.add("current");
                        oldSpan.classList.remove("current");
                    });
                });

                setTimeout(() => {
                    if (container.contains(oldSpan)) container.removeChild(oldSpan);
                    container.classList.remove("animate");
                }, 600);

                lastDigits[i] = timeStr[i];
            }
        }
    }
    // ฟังก์ชันอัปเดตเวลา
    setInterval(updateClock, 1000);
    updateClock();

    // NEW — เคลียร์เลขเก่าหลัง resize หรือหมุนจอ
    window.addEventListener("resize", resetClock);
    window.addEventListener("orientationchange", resetClock);

    function resetClock() {
        clockEl.innerHTML = "";
        lastDigits = [];
        updateClock();
    }

    setInterval(updateClock, 1000);
    updateClock();
});