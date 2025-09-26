/* === быстрые утилиты геометрии === */
const deg2rad = d => (Math.PI / 180) * d;
const polar = (cx, cy, r, angDeg) => ({
  x: cx + r * Math.cos(deg2rad(angDeg)),
  y: cy + r * Math.sin(deg2rad(angDeg)),
});

/* базовые параметры спидометра — держим в одном месте */
const C = { cx: 300, cy: 280, R: 200, start: -110, end: 110 };

const meter   = document.getElementById('meter');
const labelsG = document.getElementById('labels');
const needle  = document.getElementById('needle');
const btn     = document.getElementById('measureBtn');
const result  = document.getElementById('result');
const music   = document.getElementById('bgMusic');
const orbitEl = document.getElementById('orbit');
const mainPhoto = document.getElementById('mainPhoto');

/* --- 1) Рисуем подписи радиально (перпендикулярно дуге) --- */
const texts = [
  "Приятное общение",
  "Симпатия",
  "Влюблённость",
  "Любовь",
  "Ваня + Настя 💖"
];

// пять равных секторов по дуге
const steps = texts.length;
for (let i = 0; i < steps; i++) {
  const t = (i + 0.5) / steps;                        // центр сектора
  const ang = C.start + (C.end - C.start) * t;
  const p = polar(C.cx, C.cy, C.R - 26, ang);

  const node = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  node.setAttribute('x', p.x.toFixed(1));
  node.setAttribute('y', p.y.toFixed(1));
  node.setAttribute('text-anchor', 'middle');
  node.setAttribute('dominant-baseline', 'middle');
  node.setAttribute('transform', `rotate(${ang} ${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  node.textContent = texts[i];
  if (i === steps - 1) node.classList.add('final');
  labelsG.appendChild(node);
}

/* --- 2) Расставляем кружки строго по орбите над шкалой --- */
(() => {
  const names = (orbitEl.dataset.images || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  // Выводим симметрично по полуокружности сверху: углы от -160 до -20
  const N = Math.min(names.length, 8);  // максимум 8 как ты просил
  const from = -160, to = -20;
  for (let i = 0; i < N; i++) {
    const t = (N === 1) ? 0.5 : i / (N - 1);
    const ang = from + (to - from) * t;
    const r = 175; // радиус орбиты картинок
    const {x, y} = polar(C.cx, C.cy, r, ang);

    const d = document.createElement('div');
    d.className = 'orb';
    d.style.left = (x - 36) + 'px';
    d.style.top  = (y - 36 - 90) + 'px'; // чуть выше шкалы
    const img = document.createElement('img');
    img.src = 'images/' + names[i];
    img.alt = '';
    d.appendChild(img);
    orbitEl.appendChild(d);
  }
})();

/* --- 3) Кнопка: анимация стрелки + музыка + итог --- */
let busy = false;
btn.addEventListener('click', () => {
  if (busy) return;
  busy = true;

  // музыка — строго по клику
  music.currentTime = 0;
  music.play().catch(()=>{});

  // подсветка финальной подписи появится в конце
  const finalText = labelsG.querySelector('text.final');

  // анимация «разгон — лёгкие колебания — финиш»
  needle.classList.remove('reset');
  void needle.offsetWidth; // перезапуск анимации
  needle.classList.add('run');

  // финальная подпись и сообщение после анимации (~6.5s)
  setTimeout(() => {
    result.textContent = "Ваня + Настя 💖 Судьба!";
    finalText.classList.add('active');
  }, 6600);

  // возврат через 20 сек
  setTimeout(() => {
    needle.classList.remove('run');
    needle.style.transition = 'transform 1.8s ease-in-out';
    needle.style.transform  = `rotate(${C.start}deg)`;
    result.textContent = '';
    labelsG.querySelectorAll('text').forEach(t => t.classList.remove('active'));
    setTimeout(()=>{ needle.style.transition = ''; }, 2000);
    busy = false;
  }, 20000);
});

/* --- 4) Пасхалка: 3 клика по аватарке = салют сердечек --- */
let clicks = 0, timer;
mainPhoto.addEventListener('click', () => {
  clicks++;
  clearTimeout(timer);
  timer = setTimeout(()=> clicks = 0, 600);
  if (clicks >= 3){
    clicks = 0;
    heartsBurst();
  }
});

function heartsBurst(){
  const count = 24;
  for (let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = Math.random() < .5 ? '💖' : '❤️';
    const x = (window.innerWidth/2) + (Math.random()*140 - 70);
    h.style.left = x + 'px';
    h.style.setProperty('--dx', (Math.random()*160-80)+'px');
    h.style.animationDuration = (2 + Math.random()*2.5) + 's';
    document.body.appendChild(h);
    setTimeout(()=> h.remove(), 4000);
  }
}
