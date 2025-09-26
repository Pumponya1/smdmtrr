const btn = document.getElementById("startBtn");
const needle = document.getElementById("needle");
const result = document.getElementById("result");
const music = document.getElementById("bgMusic");

const levels = [
  "Приятное общение ✨",
  "Симпатия 😊",
  "Влюблённость 💕",
  "Любовь ❤️",
  "Ваня + Настя 💖 Судьба!"
];

// углы (для маленькой стрелки)
const angles = [-90, -45, 0, 45, 90];

const texts = document.querySelectorAll(".label");

btn.addEventListener("click", () => {
  if (music.paused) music.play();

  const rand = Math.floor(Math.random() * levels.length);
  const finalAngle = angles[rand];

  texts.forEach(t => t.classList.remove("active"));

  let t = 0;
  const interval = setInterval(() => {
    const jitter = finalAngle + (Math.random() * 20 - 10);
    needle.setAttribute("transform", `rotate(${jitter} 250 250)`);
    t += 200;
    if (t > 7000) {
      clearInterval(interval);
      needle.setAttribute("transform", `rotate(${finalAngle} 250 250)`);
      result.textContent = levels[rand];
      texts[rand].classList.add("active");
    }
  }, 200);

  setTimeout(() => {
    needle.setAttribute("transform", "rotate(-90 250 250)");
    result.textContent = "";
    texts.forEach(t => t.classList.remove("active"));
  }, 20000);
});

// секретный режим
let clicks = 0;
document.querySelector(".avatar img").addEventListener("click", () => {
  clicks++;
  if (clicks === 3) {
    spawnHearts();
    clicks = 0;
  }
});

function spawnHearts() {
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * 100 + "vw";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }
}
