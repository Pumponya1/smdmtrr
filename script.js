const measureBtn = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const resultText = document.getElementById('resultText');
const bgMusic = document.getElementById('bgMusic');

const levels = [
  { name: 'Приятное общение ✨', angle: -90 + (0 *  (180 / 4)) },
  { name: 'Симпатия 😊', angle: -90 + (1 * (180 / 4)) },
  { name: 'Влюблённость 💕', angle: -90 + (2 * (180 / 4)) },
  { name: 'Любовь ❤️', angle: -90 + (3 * (180 / 4)) },
  { name: 'Ваня + Настя 💖 Судьба!', angle: -90 + (4 * (180 / 4)) },
];

let isRunning = false;

function startMeasure() {
  if (isRunning) return;
  isRunning = true;

  // Запустить музыку, если еще не играет
  if (bgMusic.paused) {
    bgMusic.play().catch(err => {
      // если автозапуск запрещен, не страшно
      console.log('Music play failed:', err);
    });
  }

  // случайный уровень
  const idx = Math.floor(Math.random() * levels.length);
  const level = levels[idx];

  // анимация: изначальный угол — -90, до целевого
  const fromAngle = -90;
  const toAngle = level.angle;

  const duration = 5000 + Math.random() * 2000; // 5–7 секунд
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const t = Math.min(elapsed / duration, 1);
    // ease-in-out
    const ease = t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;

    const currentAngle = fromAngle + (toAngle - fromAngle) * ease;
    needle.setAttribute('transform', `rotate(${currentAngle}, 250, 230)`);

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      // остановились
      resultText.textContent = level.name;
      isRunning = false;
      // через 20 секунд вернуть стрелку на -90
      setTimeout(() => {
        needle.setAttribute('transform', `rotate(-90, 250, 230)`);
        resultText.textContent = '';
      }, 20000);
    }
  }

  requestAnimationFrame(animate);
}

measureBtn.addEventListener('click', startMeasure);

// (по желанию: секретный режим кликом по фото — добавление сердечек)
