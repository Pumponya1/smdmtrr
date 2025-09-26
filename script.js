const LEVELS = [
  "Приятное общение",
  "Дружеская симпатия",
  "Взаимная тяга",
  "Влюблённость",
  "Любовь",
  "Выше любви ☀️"
];
const TOP_LABEL = "Ваня + Настя";

const ticksGroup = document.getElementById("ticks");
const labelsGroup = document.getElementById("labels");
const needle = document.getElementById("needle");
const levelText = document.getElementById("levelText");
const btnMeasure = document.getElementById("btnMeasure");
const btnAgain = document.getElementById("btnAgain");
const song = document.getElementById("song");

const CENTER={x:0,y:120}, R=140, START=-90, END=90;
const toRad=d=>d*Math.PI/180;

// Отрисовка шкалы
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
    txt.textContent=(i===LEVELS.length-1)?TOP_LABEL:LEVELS[i];
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
function animateTo(angle,label){
  const start=currentAngle, delta=angle-start, t0=performance.now();
  function step(t){
    const p=Math.min(1,(t-t0)/1200), ease=1-Math.pow(1-p,3);
    const a=start+delta*ease;
    needle.setAttribute("transform",`rotate(${a})`);
    if(p<1) requestAnimationFrame(step);
    else{ currentAngle=angle; levelText.textContent=label; burstHearts(); }
  }
  requestAnimationFrame(step);
}

// Сердечки
function burstHearts(){
  for(let i=0;i<10;i++){
    const el=document.createElement("div");
    el.textContent="❤";
    el.style.position="fixed";
    el.style.left="50%"; el.style.top="60%";
    el.style.fontSize="22px"; el.style.color="#ff6f91";
    el.style.pointerEvents="none";
    document.body.appendChild(el);
    const dx=(Math.random()*2-1)*120;
    const dy=- (100+Math.random()*120);
    el.animate([
      {transform:"translate(0,0)",opacity:1},
      {transform:`translate(${dx}px,${dy}px)`,opacity:0}
    ],{duration:1500,easing:"ease-out"}).onfinish=()=>el.remove();
  }
}

// Кнопки
btnMeasure.addEventListener("click",()=>{
  const angle=END-2; 
  animateTo(angle,"Самый высокий уровень: "+TOP_LABEL+" 💖");
  song.currentTime=0; song.play();
});
btnAgain.addEventListener("click",()=>{
  const ix=Math.floor(Math.random()*LEVELS.length);
  const t=ix/(LEVELS.length-1);
  const ang=START+t*(END-START);
  const label=(ix===LEVELS.length-1)?TOP_LABEL:LEVELS[ix];
  animateTo(ang,label);
});
