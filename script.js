const btn = document.getElementById("startBtn");
const needle = document.getElementById("needle");
const result = document.getElementById("result");

const levels = [
  "Приятное общение ✨",
  "Симпатия 😊",
  "Влюблённость 💕",
  "Любовь ❤️",
  "Ваня + Настя 💖 Судьба!"
];

// Углы для стрелки (-90° = влево, +90° = вправо)
const angles = [-90, -45, 0, 45, 90];

btn.addEventListener("click", () => {
  const rand = Math.floor(Math.random() * levels.length);
  const angle = angles[rand];

  // сброс
  needle.style.transition = "transform 0s";
  needle.style.transform = "rotate(-90deg)";

  setTimeout(() => {
    needle.style.transition = "transform 6s ease-in-out";
    needle.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => {
      result.textContent = levels[rand];
    }, 6000);

    // возврат стрелки назад через 20с
    setTimeout(() => {
      needle.style.transition = "transform 3s ease-in-out";
      needle.style.transform = "rotate(-90deg)";
      result.textContent = "";
    }, 20000);
  }, 100);
});

// 🔐 секретный режим
let clicks = 0;
document.querySelector(".avatar img").addEventListener("click", () => {
  clicks++;
  if (clicks === 3) {
    spawnHearts();
    clicks = 0;
  }
});

// сердечки
function spawnHearts() {
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * 100 + "vw";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }
}
