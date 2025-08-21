// ======================
// Preguntas SAM
// ======================
const mcqData = [
  {text:"¿Cuál es el principal objetivo del Segment Anything Model?",options:["Clasificar imágenes","Traducir texto a imágenes","Segmentar cualquier objeto","Detectar caras"],correct:2},
  {text:"¿Qué empresa desarrolló SAM?",options:["Google","Meta AI","OpenAI","NVIDIA"],correct:1},
  {text:"¿Qué componente de SAM interpreta las indicaciones?",options:["Image encoder","Prompt encoder","Mask decoder","SA-1B"],correct:1},
  {text:"¿Qué dataset masivo fue liberado junto con SAM?",options:["ImageNet","COCO","SA-1B","Pascal VOC"],correct:2},
  {text:"¿Cuál es una ventaja de SAM?",options:["Solo categorías entrenadas","Requiere reentrenar","Segmenta objetos nuevos","No permite interacción"],correct:2}
];

// ======================
// Snake Game
// ======================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let box = 20;
let snake = [{x:9*box, y:10*box}];
let direction;
let food = {x:Math.floor(Math.random()*20)*box, y:Math.floor(Math.random()*20)*box};
let score=0;
let eaten=0; // cuenta manzanas para preguntas
let game;
let lives=3;

// sonidos (puedes cambiarlos por archivos locales correct.mp3, wrong.mp3, gameover.mp3)
const soundCorrect=new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_70b95f01a4.mp3?filename=correct-2-46134.mp3");
const soundWrong=new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_4443e0da1d.mp3?filename=error-2-46134.mp3");
const soundGameOver=new Audio("https://cdn.pixabay.com/download/audio/2021/09/28/audio_0e5cf72e57.mp3?filename=game-over-arcade-6435.mp3");

// Control
document.addEventListener("keydown",dir);
function dir(e){
  if(e.key==="ArrowLeft" && direction!=="RIGHT") direction="LEFT";
  else if(e.key==="ArrowUp" && direction!=="DOWN") direction="UP";
  else if(e.key==="ArrowRight" && direction!=="LEFT") direction="RIGHT";
  else if(e.key==="ArrowDown" && direction!=="UP") direction="DOWN";
}

// Dibujar juego
function draw(){
  ctx.clearRect(0,0,400,400);

  // dibuja snake
  for(let i=0;i<snake.length;i++){
    ctx.fillStyle=(i===0)?"#fca311":"#e5e5e5";
    ctx.fillRect(snake[i].x,snake[i].y,box,box);
    ctx.strokeStyle="black";
    ctx.strokeRect(snake[i].x,snake[i].y,box,box);
  }

  // dibuja comida
  ctx.fillStyle="red";
  ctx.fillRect(food.x,food.y,box,box);

  // cabeza
  let snakeX=snake[0].x;
  let snakeY=snake[0].y;

  if(direction==="LEFT") snakeX-=box;
  if(direction==="UP") snakeY-=box;
  if(direction==="RIGHT") snakeX+=box;
  if(direction==="DOWN") snakeY+=box;

  // comer
  if(snakeX===food.x && snakeY===food.y){
    score++;
    eaten++;
    document.getElementById("score").textContent="Puntaje: "+score;
    food={x:Math.floor(Math.random()*20)*box, y:Math.floor(Math.random()*20)*box};
    if(eaten%5===0){ pauseGame(); showQuestion(); }
  } else {
    snake.pop();
  }

  let newHead={x:snakeX,y:snakeY};

  // choque
  if(snakeX<0 || snakeY<0 || snakeX>=canvas.width || snakeY>=canvas.height || collision(newHead,snake)){
    endGame();
  }

  snake.unshift(newHead);
}
function collision(head,array){return array.some(seg=>seg.x===head.x && seg.y===head.y);}
game=setInterval(draw,150);

// ======================
// Modal Preguntas
// ======================
const quizModal=document.getElementById("quizModal");
const qText=document.getElementById("questionText");
const qOpts=document.getElementById("options");

function showQuestion(){
  clearInterval(game); // pausa
  const q=mcqData[Math.floor(Math.random()*mcqData.length)];
  qText.textContent=q.text;
  qOpts.innerHTML="";
  q.options.forEach((opt,i)=>{
    let btn=document.createElement("button");
    btn.textContent=opt;
    btn.onclick=()=>{
      if(i===q.correct){
        btn.className="correct";
        soundCorrect.play();
        setTimeout(()=>{quizModal.style.display="none"; game=setInterval(draw,150);},1000);
      } else {
        btn.className="incorrect";
        soundWrong.play();
        loseLife();
        setTimeout(()=>{quizModal.style.display="none"; game=setInterval(draw,150);},1000);
      }
    };
    qOpts.appendChild(btn);
  });
  quizModal.style.display="flex";
}
function pauseGame(){ clearInterval(game); }

// ======================
// Vidas y fin de juego
// ======================
function loseLife(){
  lives--;
  document.getElementById("lives").textContent="❤️".repeat(lives);
  document.getElementById("lives").classList.add("blink");
  setTimeout(()=>document.getElementById("lives").classList.remove("blink"),1000);
  if(lives<=0) endGame();
}
function endGame(){
  clearInterval(game);
  soundGameOver.play();
  alert("¡Game Over! Tu puntaje fue: "+score);
  location.reload();
}
