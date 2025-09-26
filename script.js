const btn = document.getElementById("measureBtn");
const needle = document.getElementById("needle");
const result = document.getElementById("result");
const music = document.getElementById("bgMusic");
const mainPhoto = document.querySelector(".main-photo img");

let clickCount = 0;

btn.addEventListener("click", () => {
  // Запускаем музыку
  music.play();

  // Анимация стрелки
  needle.style.transition = "transform 6s ease-in-out";
  needle.style.transform = "rotate(90deg)";

  // Результат
  setTimeout(() => {
    result.textContent = "Ваня + Настя 💖 Судьба!";
  }, 6000);

  // Возврат через 20 сек
  setTimeout(() => {
    needle.style.transition = "transform 2s ease-in-out";
    needle.style.transform = "rotate(-90deg)";
    result.textContent = "";
  }, 20000);
});

// Секретный режим: сердечки после 3 кликов
mainPhoto.addEventListener("click", () => {
  clickCount++;
  if (clickCount === 3) {
    launchHearts();
    clickCount = 0;
  }
});

function launchHearts() {
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.bottom = "0px";
    heart.style.fontSize = "24px";
    heart.style.animation = `floatUp ${2 + Math.random() * 3}s linear`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 5000);
  }
}

// CSS анимация для сердечек
const style = document.createElement("style");
style.innerHTML = `
@keyframes floatUp {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-500px); opacity: 0; }
}`;
document.head.appendChild(style);
