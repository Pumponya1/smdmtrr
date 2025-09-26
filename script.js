// Подписи уровней
const LEVELS = [
  "Приятное общение",
  "Дружба",
  "Симпатия",
  "Любовь",
  "Ваня + Настя"
];

const ticksGroup = document.getElementById("ticks");
const labelsGroup = document.getElementById("labels");
const needle = document.getElementById("needle");
const levelText = document.getElementById("levelText");
const btnMeasure = document.getElementById("btnMeasure");
const song = document.getElementById("song");

const CENTER={x:0,y:120}, R=140, START=-90, END=90;
const toRad=d=>d*Math.PI/180;

// Рисуем шкалу
function draw(){
  ticksGroup.innerHTML=""; labelsGroup.innerHTML="";
  for(let i=0;i<LEVELS.length;i++){
    const t=i/(LEVELS.length-1);
    const ang=START+t*(END-START); const rad=toRad(ang);
    const x=CENTER.x+(R-36)*Math.cos(rad);
    const y=CENTER.y+(R-36)*Math.sin(rad);

    const txt=document.createElementNS("http://www.w3.org/2000/svg","text");
    txt.setAttribute("x",x); txt.setAttribute("y",y);
    txt.setAttribute("text-anchor","middle");
    txt.textContent=LEVELS[i];
    labelsGroup.appendChild(txt);

    const lx1=CENTER.x+R*Math.cos(rad), ly1=CENTER.y+R*Math.sin(rad);
    const lx2=CENTER.x+(R-12)*Math.cos(rad), ly2=CENTER.y+(R-12)*Math.sin(rad);
    const line=document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1",lx1); line.setAttribute("y1",ly1);
    line.setAttribute("x2",lx2); line.setAttribute("y2",ly2);
    line.setAttribute("class","major");
    ticksGroup.appendChild(line);
  }
}
draw();

let currentAngle=START;

function stormyAnimation(){
  const totalDuration=5000; // 5 секунд
  const startTime=performance.now();
  const finalAngle=END-2;

  function step(now){
    const elapsed=now-startTime;

    if(elapsed<totalDuration){
      // дергание: случайный угол в пределах диапазона
      const randAng=START+Math.random()*(END-START);
      needle.setAttribute("transform",`rotate(${randAng})`);

      // Подсветка уровня
      highlightLevel(randAng);

      requestAnimationFrame(step);
    } else {
      // финал: уход в конец
      animateTo(finalAngle, LEVELS[LEVELS.length-1]);
    }
  }
  requestAnimationFrame(step);
}

function animateTo(angle,label){
  const start=currentAngle, delta=angle-start, t0=performance.now();
  function anim(t){
    const p=Math.min(1,(t-t0)/1200);
    const ease=1-Math.pow(1-p,3);
    const a=start+delta*ease;
    needle.setAttribute("transform",`rotate(${a})`);
    if(p<1) requestAnimationFrame(anim);
    else {
      currentAngle=angle;
      levelText.textContent=label;
      highlightFinal();
    }
  }
  requestAnimationFrame(anim);
}

function highlightLevel(angle){
  const texts=labelsGroup.querySelectorAll("text");
  texts.forEach(t=>t.classList.remove("active"));
  const part=(angle-START)/(END-START);
  const idx=Math.round(part*(LEVELS.length-1));
  if(texts[idx]) texts[idx].classList.add("active");
}

function highlightFinal(){
  const texts=labelsGroup.querySelectorAll("text");
  texts.forEach(t=>t.classList.remove("active"));
  texts[texts.length-1].classList.add("active");
}

// Кнопка
btnMeasure.addEventListener("click",()=>{
  levelText.textContent="Измеряем...";
  song.currentTime=0; song.play();
  stormyAnimation();
});
