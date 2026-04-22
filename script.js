const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score"); /* pontuação */
const livesEl = document.getElementById("lives"); /* vidas */
const endScreen = document.getElementById("endScreen");
const fade = document.getElementById("fade");
const faseTexto = document.getElementById("faseTexto");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

let playerX = 200;
let score = 0;
let lives = 3;
let fase = 1; /* fase */
let gameAtivo = false;
let emTransicao = false;

/* BOTÃO INICIAR */
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameAtivo = true;

  atualizarFase();
  mostrarTextoFase(); /* exibe o nome da fase */

  setInterval(criarTag, 1000);
});

/* FASES */
const fases = {
  1: {
    corretas: ["<h1>", "<p>", "<div>", "<header>"],
    erradas: ["color", "margin"]
  },
  2: {
    corretas: ["color", "margin", "padding"],
    erradas: ["<h1>", "function"]
  },
  3: {
    corretas: ["function", "onclick", "alert"],
    erradas: ["<div>", "color"]
  }
};

/* ATUALIZA FASE */
function atualizarFase() {
  if (fase === 1) {
    game.style.backgroundImage = "url('img/cenario_html.png')";
    player.style.backgroundImage = "url('img/skin_html(1).png')";
  }

  if (fase === 2) {
    game.style.backgroundImage = "url('img/cenario_css.png')";
    player.style.backgroundImage = "url('img/skin_css(1).png')";
  }

  if (fase === 3) {
    game.style.backgroundImage = "url('img/cenario_js.png')";
    player.style.backgroundImage = "url('img/skin_js.png')";
  }
}

/* TEXTO DA FASE */
function mostrarTextoFase() {
  let texto = "";

  faseTexto.classList.remove("fase-html", "fase-css", "fase-js");

  if (fase === 1) {
    texto = "FASE 1 - HTML";
    faseTexto.classList.add("fase-html");
  }

  if (fase === 2) {
    texto = "FASE 2 - CSS";
    faseTexto.classList.add("fase-css");
  }

  if (fase === 3) {
    texto = "FASE 3 - JavaScript";
    faseTexto.classList.add("fase-js");
  }

  faseTexto.innerText = texto;
  faseTexto.classList.add("ativo");

  setTimeout(() => {
    faseTexto.classList.remove("ativo");
  }, 1500);
}

/* TROCA DE FASE COM PAUSA */
function trocarFaseComFade(novaFase) {
  emTransicao = true;

  // remove TODAS as tags da tela
  document.querySelectorAll(".tag").forEach(tag => tag.remove());

  fade.style.opacity = 1;

  setTimeout(() => {
    fase = novaFase;
    atualizarFase();
    mostrarTextoFase();

    fade.style.opacity = 0;

    // ⏳ TEMPO DE PAUSA ENTRE FASES
    setTimeout(() => {
      emTransicao = false;
    }, 2000);

  }, 500);
}

/* MOVIMENTO */
document.addEventListener("keydown", (e) => {
  if (!gameAtivo) return;

  if (e.key === "ArrowRight") playerX += 15;
  if (e.key === "ArrowLeft") playerX -= 15;

  playerX = Math.max(0, Math.min(420, playerX));
  player.style.left = playerX + "px";
});

/* CRIAR TAG */
function criarTag() { /* gera e movimenta os elementos */
  if (!gameAtivo || emTransicao) return;

  const faseAtual = fases[fase];
  const isCorrect = Math.random() > 0.4;

  const texto = isCorrect
    ? faseAtual.corretas[Math.floor(Math.random() * faseAtual.corretas.length)]
    : faseAtual.erradas[Math.floor(Math.random() * faseAtual.erradas.length)];

  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.innerText = texto;

  tag.style.left = Math.random() * 440 + "px";
  tag.style.top = "0px";

  game.appendChild(tag);

  let y = 0;

  const intervalo = setInterval(() => {
    if (!gameAtivo || emTransicao) {
      clearInterval(intervalo);
      tag.remove();
      return;
    }

    y += 3;
    tag.style.top = y + "px";

    const tagRect = tag.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // colisão
    if (
      tagRect.bottom > playerRect.top &&
      tagRect.left < playerRect.right &&
      tagRect.right > playerRect.left
    ) {
      if (isCorrect) score++;
      else lives--;

      scoreEl.innerText = score;
      livesEl.innerText = lives;

      tag.remove();
      clearInterval(intervalo);
    }

    // saiu da tela
    if (y > 360) {
      tag.remove();
      clearInterval(intervalo);
    }

    // troca de fase
    if (score >= 10 && fase === 1) {
      trocarFaseComFade(2); /* muda de fase, aplica o fade e ativa a pausa*/
    }

    if (score >= 20 && fase === 2) {
      trocarFaseComFade(3);
    }

    // vitória
    if (score >= 30) {
      gameAtivo = false;
      mostrarVitoria(); /* finalizam o jogo */
      clearInterval(intervalo);
    }

    // derrota
    if (lives <= 0) {
      gameAtivo = false;
      mostrarDerrota(); /* finalizam o jogo */
      clearInterval(intervalo);
    }

  }, 30);
}

/* TELAS FINAIS */
function mostrarVitoria() {
  endScreen.style.display = "flex";
  endScreen.innerHTML = `
    <img src="img/imagem.png" style="width:100%; height:100%; object-fit:cover;">
    <button class="btn-restart" onclick="location.reload()">Jogar novamente</button>
  `;
}

function mostrarDerrota() {
  endScreen.style.display = "flex";
  endScreen.innerHTML = `
    <h1>💀 Game Over</h1>
    <button onclick="location.reload()">Tentar novamente</button>
  `;
}