function start() {
  $("#inicio").hide();
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
  $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");
    
  const jogo = {}
  const TECLA = { W: 38, S: 40, D: 68 }

  const somDisparo = document.getElementById("somDisparo");
  const somExplosao = document.getElementById("somExplosao");
  const musica = document.getElementById("musica");
  const somGameover = document.getElementById("somGameover");
  const somPerdido = document.getElementById("somPerdido");
  const somResgate = document.getElementById("somResgate");

  let velocidade = 5;
  let posicaoY = parseInt(Math.random() * 334);
  let podeAtirar = true;
  let fimdejogo = false;
  let pontos = 0;
  let salvos = 0;
  let perdidos = 0;
  let energiaAtual = 3;
  let tempoDisparo = null;

  jogo.timer = setInterval(loop, 30);
  jogo.pressionou = [];

  musica.addEventListener("ended", () => { 
    musica.currentTime = 0;
    musica.play();
  }, false);
  musica.play();

  $(document).keydown(e => jogo.pressionou[e.which] = true);
  $(document).keyup(e => jogo.pressionou[e.which] = false);
  
  function loop() {
    moveFundo();
    moveJogador();
    moveInimigo1();
    moveInimigo2();
    moveAmigo();
    colisao();
    placar();
    energia();
  }
  
  function moveFundo() {
    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda-1);
  }

  function moveJogador() {
    if (jogo.pressionou[TECLA.W]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo - 10);

      if (topo<=0) {
          $("#jogador").css("top", topo + 10);
      }
    }

    if (jogo.pressionou[TECLA.S]) {
        var topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top", topo + 10);

        if (topo>=434) {	
            $("#jogador").css("top", topo - 10);		
        }
    }
    
    if (jogo.pressionou[TECLA.D]) {
        disparo();
    }
  }

  function moveInimigo1() {
      posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX - velocidade);
    $("#inimigo1").css("top", posicaoY);
        
    if (posicaoX<=0) {
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);           
    }
  }

  function moveInimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX - 3);
      
    if (posicaoX<=0) {
      $("#inimigo2").css("left", 775);		
    }
  }

  function moveAmigo() {
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX + 1);

    if (posicaoX > 906) {
      $("#amigo").css("left", 0);
    }
  }

  function disparo() {
    if (podeAtirar == true) {
      somDisparo.play();
      podeAtirar = false;
      topo = parseInt($("#jogador").css("top"))
      posicaoX = parseInt($("#jogador").css("left"))
      tiroX = posicaoX + 190;
      topoTiro = topo + 37;
      $("#fundoGame").append("<div id='disparo'></div");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      tempoDisparo = window.setInterval(executaDisparo, 15);
    }
    
    function executaDisparo() {
      posicaoX = parseInt($("#disparo").css("left"));
      $("#disparo").css("left", posicaoX + 15);
      
      if (posicaoX > 900) {
        window.clearInterval(tempoDisparo);
        tempoDisparo = null;
        $("#disparo").remove();
        podeAtirar = true;
      }
    }
  }

  function colisao() {
    const colisao1 = ($("#jogador").collision($("#inimigo1")));
    const colisao2 = ($("#jogador").collision($("#inimigo2")));
    const colisao3 = ($("#disparo").collision($("#inimigo1")));
    const colisao4 = ($("#disparo").collision($("#inimigo2")));
    const colisao5 = ($("#jogador").collision($("#amigo")));
    const colisao6 = ($("#inimigo2").collision($("#amigo")));
    
    if (colisao1.length > 0) {
      energiaAtual--;
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }

    if (colisao2.length > 0) {
      energiaAtual--;
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X, inimigo2Y);

      $("#inimigo2").remove();
      reposicionaInimigo2();
    }

    if (colisao3.length > 0) {
      velocidade = velocidade + 0.3;
      pontos = pontos + 100;
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));		
      explosao1(inimigo1X, inimigo1Y);
    
      $("#disparo").css("left", 950);
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }

    if (colisao4.length > 0) {
      pontos = pontos + 50;
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();

      explosao2(inimigo2X, inimigo2Y);
      $("#disparo").css("left", 950);
      reposicionaInimigo2();
    }

    if (colisao5.length > 0) {
      salvos++;
      somResgate.play();
      reposicionaAmigo();
      $("#amigo").remove();
    }

    if (colisao6.length > 0) {
      perdidos++;
      amigoX = parseInt($("#amigo").css("left"));
      amigoY = parseInt($("#amigo").css("top"));
      
      explosao3(amigoX, amigoY);
      $("#amigo").remove();
      reposicionaAmigo();
    }
  }

  function explosao1(inimigo1X, inimigo1Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(./src/assets/images/explosao.png)");

    const div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({ width: 200, opacity: 0 }, "slow");
    
    let tempoExplosao = window.setInterval(removeExplosao, 1000);
    
    function removeExplosao() {
        div.remove();
        window.clearInterval(tempoExplosao);
        tempoExplosao = null;
    }
  }

  function reposicionaInimigo2() {
    let tempoColisao4 = window.setInterval(reposiciona4, 5000);

    function reposiciona4() {
      window.clearInterval(tempoColisao4);
      tempoColisao4 = null;

      if (fimdejogo == false) {
        $("#fundoGame").append("<div id=inimigo2></div");
      }
    }	
  }

  function explosao2(inimigo2X, inimigo2Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url(./src/assets/images/explosao.png)");

    const div2 = $("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");
    
    let tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
    
    function removeExplosao2() {
        div2.remove();
        window.clearInterval(tempoExplosao2);
        tempoExplosao2 = null;
    }
  }

  function reposicionaAmigo() {
    let tempoAmigo = window.setInterval(reposiciona6, 6000);
    
    function reposiciona6() {
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;
      
      if (fimdejogo == false) {
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      }
    }
  }

  function explosao3(amigoX, amigoY) {
      somPerdido.play();
      $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
      $("#explosao3").css("top",amigoY);
      $("#explosao3").css("left",amigoX);

      let tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

      function resetaExplosao3() {
        $("#explosao3").remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3 = null;
      }
  }

  function placar() {
    $("#placar").html(`<h2> Pontos:  ${pontos}  Salvos: ${salvos} Perdidos: ${perdidos}</h2>`);
  }

  function energia() {
    if (energiaAtual == 3) {
      $("#energia").css("background-image", "url(./src/assets/images/energia3.png)");
    }

    if (energiaAtual == 2) {
      $("#energia").css("background-image", "url(./src/assets/images/energia2.png)");
    }

    if (energiaAtual == 1) {
      $("#energia").css("background-image", "url(./src/assets/images/energia1.png)");
    }

    if (energiaAtual == 0) {
      $("#energia").css("background-image", "url(./src/assets/images/energia0.png)");
      gameOver();
    }
  }

  function gameOver() {
    fimdejogo = true;
    musica.pause();
    somGameover.play();
    window.clearInterval(jogo.timer);
    jogo.timer = null;
    
    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();
    $("#fundoGame").append("<div id='fim'></div>");
    $("#fim").html(`<h1> Game Over </h1><p>Sua pontuação foi: ${pontos}</p> <div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>`);
  }

}

function reiniciaJogo() {
  somGameover.pause();
  $("#fim").remove();
  start();
}
