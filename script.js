const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarPausarBt = document.querySelector('#start-pause span');
const imagemCF = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const musicaInicio = new Audio('/sons/play.wav');
const musicaPause = new Audio('/sons/pause.mp3');
const musicaFim = new Audio('/sons/beep.mp3');
musica.loop = true;

let tempoDecorridoSeg = 1500;
let intervaloId = null;

mostrarTempo();
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBt.addEventListener('click', () => {
    tempoDecorridoSeg = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoSeg = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoDecorridoSeg = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

function alterarContexto(contexto) {
    mostrarTempo();

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);

    switch(contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>`
        break;

        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>`
        break;

        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar a superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>`
        break;
    }

    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    });
}

startPauseBt.addEventListener('click', iniciarPausarTempo)

    const contagemRegressiva = () => {
        if(tempoDecorridoSeg <= 0) {
            musicaFim.play();
            alert('Tempo Finalizado!');
            const focoAtivo = html.getAttribute('data-contexto') == 'foco';
            if (focoAtivo) {
                const evento = new CustomEvent('FocoFinalizado');
                document.dispatchEvent(evento);
            }
            zerarTempo();
            return;
        }
        tempoDecorridoSeg -= 1;
        mostrarTempo();
    }

function iniciarPausarTempo() {
    if(intervaloId) {
        zerarTempo();
        musicaPause.play();
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000);
    musicaInicio.play();
    mudarIcone('pause');
    iniciarPausarBt.textContent = "Pausar";
}

function zerarTempo() {
    clearInterval(intervaloId);
    iniciarPausarBt.textContent = "Começar";
    mudarIcone('play_arrow');
    intervaloId = null;
}

function mudarIcone(icone) {
    imagemCF.setAttribute('src', `/imagens/${icone}.png`)
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoSeg * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}