// Preguntas de opción múltiple
const mcqData = [
  {
    text: "¿Cuál es el principal objetivo del Segment Anything Model?",
    options: [
      "Clasificar imágenes en categorías fijas",
      "Traducir texto a imágenes",
      "Segmentar cualquier objeto en una imagen",
      "Detectar caras humanas exclusivamente"
    ],
    correctIndex: 2
  },
  {
    text: "¿Qué empresa desarrolló SAM?",
    options: ["Google DeepMind","Meta AI","OpenAI","NVIDIA Research"],
    correctIndex: 1
  },
  {
    text: "¿Qué componente de SAM interpreta las indicaciones del usuario?",
    options: ["Image encoder","Prompt encoder","Mask decoder","Dataset SA-1B"],
    correctIndex: 1
  },
  {
    text: "¿Qué dataset masivo fue liberado junto con SAM?",
    options: ["ImageNet","COCO","SA-1B","Pascal VOC"],
    correctIndex: 2
  },
  {
    text: "¿Cuál es una ventaja de SAM?",
    options: [
      "Solo funciona con categorías previamente entrenadas",
      "Requiere entrenamiento cada vez que cambia de objeto",
      "Puede segmentar objetos nunca vistos antes",
      "No permite interacción con el usuario"
    ],
    correctIndex: 2
  }
];

// Emparejamiento
const matchLeft = [
  { id: "L1", label: "1. Image encoder", answer: "B" },
  { id: "L2", label: "2. Prompt encoder", answer: "A" },
  { id: "L3", label: "3. Mask decoder", answer: "C" },
  { id: "L4", label: "4. SA-1B", answer: "D" },
  { id: "L5", label: "5. Interactividad", answer: "E" }
];
const matchRight = [
  { id: "A", text: "A. Interpreta las instrucciones dadas por el usuario." },
  { id: "B", text: "B. Convierte la imagen en un mapa de características." },
  { id: "C", text: "C. Genera la máscara final del objeto segmentado." },
  { id: "D", text: "D. Dataset masivo con más de 1 billón de máscaras." },
  { id: "E", text: "E. Posibilidad de refinar la segmentación con más indicaciones." }
];

// Sonidos
const soundCorrect = new Audio("correct.mp3"); // pon un archivo en tu carpeta
const soundWrong = new Audio("wrong.mp3");     // pon un archivo en tu carpeta
const soundApplause = new Audio("applause.mp3");

// Función para barajar
function shuffle(arr){return arr.map(v=>[Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(p=>p[1]);}

// Render preguntas
function renderMCQ(){
  const mcqRoot = document.getElementById('mcq');
  mcqRoot.innerHTML = "";
  mcqData.forEach((q, qi) => {
    const qBox = document.createElement('div');
    qBox.classList.add("question");
    qBox.innerHTML = `<h3>${qi+1}. ${q.text}</h3>`;
    const opts = document.createElement('div');
    shuffle(q.options.map((o,i)=>({o,i}))).forEach(({o,i})=>{
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="q${qi}" value="${i}"> ${o}`;
      label.addEventListener("change",()=>{
        if(i === q.correctIndex){
          label.classList.add("correct-anim");
          soundCorrect.play();
        } else {
          label.classList.add("incorrect-anim");
          soundWrong.play();
        }
      });
      opts.appendChild(label);
    });
    qBox.appendChild(opts);
    mcqRoot.appendChild(qBox);
  });
}

// Render emparejamiento
function renderMatch(){
  const slotsRoot = document.getElementById('slots');
  const tilesRoot = document.getElementById('tiles');
  slotsRoot.innerHTML = "";
  tilesRoot.innerHTML = "";
  matchLeft.forEach(item=>{
    const slot = document.createElement('div');
    slot.className = "slot";
    slot.textContent = item.label;
    slot.dataset.answer = item.answer;
    slot.addEventListener('dragover', e=>e.preventDefault());
    slot.addEventListener('drop', e=>{
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const tile = document.querySelector(`[data-id="${id}"]`);
      slot.appendChild(tile);
      // feedback inmediato
      if(id === item.answer){
        slot.classList.add("correct-anim");
        soundCorrect.play();
      } else {
        slot.classList.add("incorrect-anim");
        soundWrong.play();
      }
    });
    slotsRoot.appendChild(slot);
  });
  shuffle([...matchRight]).forEach(item=>{
    const tile = document.createElement('div');
    tile.className = "tile";
    tile.textContent = item.text;
    tile.draggable = true;
    tile.dataset.id = item.id;
    tile.addEventListener('dragstart', e=>{
      e.dataTransfer.setData("text/plain", item.id);
    });
    tilesRoot.appendChild(tile);
  });
}

// Calificar
document.getElementById('btnCalificar').addEventListener('click', ()=>{
  let score = 0;
  mcqData.forEach((q, qi)=>{
    const checked = document.querySelector(`input[name="q${qi}"]:checked`);
    if(checked && parseInt(checked.value) === q.correctIndex) score++;
  });
  document.querySelectorAll('#slots > div').forEach(slot=>{
    const tile = slot.querySelector('[data-id]');
    if(tile && tile.dataset.id === slot.dataset.answer) score++;
  });

  let message = "";
  if(score >= 9){
    message = "🏆 ¡Eres un experto en SAM! 🎉";
    soundApplause.play();
    launchConfetti();
  } else if(score >= 6){
    message = "💪 ¡Muy bien! Sigue practicando";
  } else {
    message = "😃 ¡Ánimo! Inténtalo de nuevo";
  }

  document.getElementById('score').textContent = `Puntaje: ${score} / 10 — ${message}`;
});

// Reiniciar
document.getElementById('btnReiniciar').addEventListener('click', ()=>{
  renderMCQ();
  renderMatch();
  resetTimer();
  document.getElementById('score').textContent = "Puntaje: — / 10";
});

// Mostrar respuestas
document.getElementById('btnMostrarRespuestas').addEventListener('click', ()=>{
  mcqData.forEach((q, qi)=>{
    document.querySelectorAll(`input[name="q${qi}"]`)[q.correctIndex].checked = true;
  });
  matchLeft.forEach(item=>{
    const slot = [...document.querySelectorAll('#slots > div')].find(s=>s.dataset.answer === item.answer);
    const tile = [...document.querySelectorAll('#tiles > div')].find(t=>t.dataset.id === item.answer);
    if(tile) slot.appendChild(tile);
  });
});

// Temporizador
let timeLeft = 300;
let timerId;
function startTimer(){
  timerId = setInterval(()=>{
    timeLeft--;
    updateTimer();
    if(timeLeft <= 0){
      clearInterval(timerId);
      alert("¡Tiempo terminado!");
    }
  },1000);
}
function updateTimer(){
  const min = String(Math.floor(timeLeft/60)).padStart(2,'0');
  const sec = String(timeLeft%60).padStart(2,'0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
  document.getElementById('progress').style.width = `${(1 - timeLeft/300)*100}%`;
}
function resetTimer(){
  clearInterval(timerId);
  timeLeft = 300;
  updateTimer();
  startTimer();
}

// Confeti básico
function launchConfetti(){
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let pieces = Array.from({length:150},()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*6+2,
    c: `hsl(${Math.random()*360},100%,50%)`,
    s: Math.random()*3+1
  }));
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fillStyle = p.c;
      ctx.fill();
    });
  }
  function update(){
    pieces.forEach(p=>{
      p.y += p.s;
      if(p.y>canvas.height){p.y=0;}
    });
  }
  function loop(){
    draw(); update(); requestAnimationFrame(loop);
  }
  loop();
}

// Inicializar
renderMCQ();
renderMatch();
updateTimer();
startTimer();
