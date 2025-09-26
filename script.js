const LEVELS = [
  "Приятное общение",
  "Дружба",
  "Симпатия",
  "Любовь",
  "Ваня + Настя"
];

const ticksGroup  = document.getElementById("ticks");
const labelsGroup = document.getElementById("labels");
const needle      = document.getElementById("needle");
const levelText   = document.getElementById("levelText");
const btnMeasure  = document.getElementById("btnMeasure");
const song        = document.getElementById("song");

const CENTER={x:0,y:120}, R=150, START=-90, END=90, SPAN=END-START;
const toRad = d => d*Math.PI/180;
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

function drawScale() {
  ticksGroup.innerHTML = "";
  labelsGroup.innerHTML = "";
  for (let i=0;i<LEVELS.length;i++) {
    const t=i/(LEVELS.length-1);
    const ang=START+t*SPAN;
    const rad=toRad(ang);

    const x1=CENTER.x+R*Math.cos(rad),
          y1=CENTER.y+R*Math.sin(rad),
          x2=CENTER.x+(R-14)*Math.cos(rad),
          y2=CENTER.y+(R-14)*Math.sin(rad);

    const line=document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1",x1); line.setAttribute("y1",y1);
    line.setAttribute("x2",x2); line.setAttribute("y2",y2);
    ticksGroup.appendChild(line);

    const lx=CENTER.x+(R-38)*Math.cos(rad),
          ly=CENTER.y+(R-38)*Math.sin(rad);
    const text=document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x",lx); text.setAttribute("y",ly);
    text.setAttribute("text-anchor","middle");
    text.textContent=LEVELS[i];
    labelsGroup.appendChild(text);
  }
}
drawScale();

let currentAngle=START;

function highlightByAngle(angleDeg){
  const part=clamp((angleDeg-START)/SPAN,0,1);
  const idx=Math.round(part*(LEVELS.length-1));
  const texts=labelsGroup.querySelectorAll("text");
  texts.forEach(t=>t.classList.remove("active"));
  if(texts[idx]) texts[idx].classList.add("active");
  levelText.textContent=texts[idx]?texts[idx].textContent:"Готовы?";
}

function animateTo(angle,duration=1200){
  const start=currentAngle, delta=angle-start, t0=performance.now();
  return new Promise(resolve=>{
    function step(t){
      const p=Math.min(1,(t-t0)/duration);
      const ease=1-Math.pow(1-p,3);
      const a=start+delta*ease;
      needle.setAttribute("transform",`rotate(${a})`);
      highlightByAngle(a);
      if(p<1) requestAnimationFrame(step);
      else { currentAngle=angle; resolve(); }
    }
    requestAnimationFrame(step);
  });
}

async function stormyThenFinal(){
  btnMeasure.disabled=true;
  levelText.textContent="Измеряем...";
  try{ song.currentTime=0; song.play(); }catch(e){}

  const total=5000, t0=performance.now();
  let aPrev=START;

  function frame(now){
    const elapsed=now-t0, p=clamp(elapsed/total,0,1);
    const mean=START+(SPAN*0.9)*(1-Math.pow(1-p,2));
    const amp=10*(1-p)+3*p;
    const sin=Math.sin(now/120)*amp;
    const rand=(Math.random()-0.5)*amp*0.4;
    const ang=clamp(mean+sin+rand,START,END);
    const a=aPrev+(ang-aPrev)*0.35;
    aPrev=a;

    needle.setAttribute("transform",`rotate(${a})`);
    highlightByAngle(a);

    if(elapsed<total) requestAnimationFrame(frame);
    else animateTo(END-2,1500).then(()=>{
      levelText.textContent=LEVELS[LEVELS.length-1];
      btnMeasure.disabled=false;
    });
  }
  requestAnimationFrame(frame);
}

btnMeasure.addEventListener("click", stormyThenFinal);

// Начальное состояние
needle.setAttribute("transform",`rotate(${START})`);
highlightByAngle(START);
