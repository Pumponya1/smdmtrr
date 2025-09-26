// === Константы шкалы ===
const LEVELS = [
  "Приятное общение",
  "Дружба",
  "Симпатия",
  "Любовь",
  "Ваня + Настя"
];

const svg = document.getElementById("loveGauge");
const ticksGroup  = document.getElementById("ticks");
const labelsGroup = document.getElementById("labels");
const needle      = document.getElementById("needle");
const levelText   = document.getElementById("levelText");
const btnMeasure  = document.getElementById("btnMeasure");
const song        = document.getElementById("song");

// Геометрия полудуги
const CENTER = { x: 0, y: 120 };
const R      = 140;
const START  = -90;
const END    =  90;
const SPAN   = END - START;

const toRad = d => d * Math.PI / 180;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Подготовка: засечки + подписи (строго 5 штук, как на твоём скетче)
function drawScale() {
  ticksGroup.innerHTML = "";
  labelsGroup.innerHTML = "";

  for (let i = 0; i < LEVELS.length; i++) {
    const t   = i / (LEVELS.length - 1);
    const ang = START + t * SPAN;
    const rad = toRad(ang);

    // Засечка
    const x1 = CENTER.x +  R      * Math.cos(rad);
    const y1 = CENTER.y +  R      * Math.sin(rad);
    const x2 = CENTER.x + (R - 14) * Math.cos(rad);
    const y2 = CENTER.y + (R - 14) * Math.sin(rad);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    ticksGroup.appendChild(line);

    // Подпись — горизонтальная, чуть внутрь от дуги
    const lx = CENTER.x + (R - 40) * Math.cos(rad);
    const ly = CENTER.y + (R - 40) * Math.sin(rad);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", lx);
    text.setAttribute("y", ly);
    text.setAttribute("text-anchor", "middle");
    text.textContent = LEVELS[i];
    labelsGroup.appendChild(text);
  }
}
drawScale();

// Подсветка ближайшего уровня
function highlightByAngle(angleDeg){
  const part = clamp((angleDeg - START) / SPAN, 0, 1);
  const idx  = Math.round(part * (LEVELS.length - 1));
  const texts = labelsGroup.querySelectorAll("text");
  texts.forEach(t => t.classList.remove("active"));
  if (texts[idx]) texts[idx].classList.add("active");
  levelText.textContent = texts[idx] ? texts[idx].textContent : "Готовы?";
}

// Анимация стрелки в финал
let currentAngle = START;
function animateTo(angle, duration = 1200){
  const start = currentAngle;
  const delta = angle - start;
  const t0 = performance.now();

  return new Promise(resolve=>{
    funct
