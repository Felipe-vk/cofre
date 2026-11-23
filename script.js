// 1. CENÁRIOS: três locais inspirados no RE2; a senha continua aleatória.
const fases = [
    {
        nome: 'SALA DE ESPERA',
        sub: 'R.P.D. / EAST WING',
        area: 'R.P.D.',
        sala: 'SALA DE ESPERA',
        andar: '2º ANDAR',
        rodape: 'R.P.D. // WAITING ROOM SAFE',
        descricao: 'Cofre inspirado na Waiting Room do RE2, com clima chuvoso e vista lateral da R.P.D.',
        referencia: 'Cofre da Waiting Room (2º andar): esquerda 6, direita 2, esquerda 11. Essa é apenas uma referência ao RE2 Remake; a senha jogável é sorteada entre 1 e 50.',
        fechado: 'imagens/waiting-room-base.webp',
        aberto: 'imagens/waiting-room-aberto.png',
        roda: { sprite: 'imagens/disco-fotografico-50-posicoes.png' }
    },
    {
        nome: 'WEST OFFICE',
        sub: 'R.P.D. / 1º ANDAR',
        area: 'R.P.D.',
        sala: 'WEST OFFICE',
        andar: '1º ANDAR',
        rodape: 'R.P.D. // WEST OFFICE SAFE',
        descricao: 'Fase inspirada no cofre do West Office, cercado por mesas, arquivos e iluminação quente de escritório.',
        referencia: 'Cofre do West Office (1º andar): esquerda 9, direita 15, esquerda 7 no RE2. Aqui a senha é diferente e sorteada de 1 a 50.',
        fechado: 'imagens/west-office-base.webp',
        aberto: 'imagens/west-office-aberto.png',
        roda: { sprite: 'imagens/disco-fotografico-50-posicoes.png' }
    },
    {
        nome: 'TREATMENT POOL',
        sub: 'SEWERS / TREATMENT ROOM',
        area: 'SEWERS',
        sala: 'TREATMENT POOL ROOM',
        andar: 'SUBSOLO',
        rodape: 'SEWERS // TREATMENT POOL SAFE',
        descricao: 'A última fase leva você ao Treatment Pool Room, inspirado no cofre dos esgotos do RE2.',
        referencia: 'Cofre do Treatment Pool Room (esgotos): esquerda 2, direita 12, esquerda 8 no RE2. Essa combinação é um detalhe de referência, não a senha do minijogo.',
        fechado: 'imagens/treatment-room-base.webp',
        aberto: 'imagens/treatment-room-aberto.png',
        roda: { sprite: 'imagens/disco-fotografico-50-posicoes.png' }
    }
];

let faseAtual = 0;
let senha = numeroAleatorio();
let tentativas = 0;
const limite = RegrasCofre.LIMITE;
let iniciou = false;
let terminou = false;
let somLigado = true;
let avancarAoReiniciar = false;
let tempoModal;
let tempoGiro;
let animacaoChuva;
let ultimoTempoChuva = 0;
let proximoRelampago = 0;
let arrastoTotal = 0;
let rodaAtiva = null;
let inspecaoAberta = false;
let transicaoEmAndamento = false;
let temposPendentes = [];
const fasesVencidas = new Set();
// O histórico é zerado em cada nova partida e nunca revela a senha secreta.
let historicoPalpites = [];

function agendar(acao, espera) {
    const identificador = setTimeout(acao, espera);
    temposPendentes.push(identificador);
    return identificador;
}
function limparTempos() {
    temposPendentes.forEach(clearTimeout);
    temposPendentes = [];
}

const grausPorNumero = 360 / 50;
let anguloRoda = 0;
let anguloRenderizado = 0;
let animacaoEncaixe = null;
let ultimoPasso = 0;
let arrastandoRoda = false;
let anguloAnteriorPonteiro = 0;
let scrollAcumulado = 0;
let ultimoSomDaRoda = 0;

const telaInicial = document.getElementById('telaInicial');
const jogo = document.getElementById('jogo');
const formSenha = document.getElementById('formSenha');
const campoSenha = document.getElementById('campoSenha');
const botaoTentar = document.getElementById('botaoTentar');
const botaoNova = document.getElementById('botaoNova');
const botaoTrocarFase = document.getElementById('botaoTrocarFase');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const botaoEntrar = document.getElementById('botaoEntrar');
const botaoSom = document.getElementById('botaoSom');
const mensagem = document.getElementById('mensagem');
const contador = document.getElementById('contador');
const miniContador = document.getElementById('miniContador');
const marcadores = document.querySelectorAll('#marcadores span');
const aviso = document.getElementById('aviso');
const historico = document.getElementById('historico');
const historicoLista = document.getElementById('historicoLista');
const historicoResumo = document.getElementById('historicoResumo');
const historicoFaixa = document.getElementById('historicoFaixa');
const dicaCampo = document.getElementById('dicaCampo');
const aberturaCena = document.getElementById('aberturaCena');
const aberturaTexto = document.getElementById('aberturaTexto');
const seloCampanha = document.getElementById('seloCampanha');
const overview = document.getElementById('overview');
const mioloRoda = document.getElementById('mioloRoda');
const rodaAmpliada = document.getElementById('rodaAmpliada');
const miolosRoda = document.querySelectorAll('.miolo-roda');
const botaoInspecionar = document.getElementById('botaoInspecionar');
const inspecao = document.getElementById('inspecao');
const numeroInspecao = document.getElementById('numeroInspecao');
const fecharInspecaoBotao = document.getElementById('fecharInspecao');
const inspecaoConfirmar = document.getElementById('inspecaoConfirmar');
const mascaraAbertura = document.getElementById('mascaraAbertura');
const transicaoFase = document.getElementById('transicaoFase');
const relampago = document.getElementById('relampago');
const numeroRoda = document.getElementById('numeroRoda');
const girarEsquerda = document.getElementById('girarEsquerda');
const girarDireita = document.getElementById('girarDireita');
const imagemFechada = document.getElementById('imagemFechada');
const imagemAberta = document.getElementById('imagemAberta');
const ambiente = document.getElementById('somAmbiente');
const rainCanvas = document.getElementById('rainCanvas');
const rainContext = rainCanvas.getContext('2d');

const textoArea = document.getElementById('textoArea');
const textoSala = document.getElementById('textoSala');
const textoAndar = document.getElementById('textoAndar');
const faseBadgeNumero = document.getElementById('faseBadgeNumero');
const faseBadgeTotal = document.getElementById('faseBadgeTotal');
const nomeFasePainel = document.getElementById('nomeFasePainel');
const descricaoFase = document.getElementById('descricaoFase');
const referenciaReal = document.getElementById('referenciaReal');
const localFasePainel = document.getElementById('localFasePainel');
const progressoFase = document.getElementById('progressoFase');
const indiceFaseLegenda = document.getElementById('indiceFaseLegenda');
const nomeFaseLegenda = document.getElementById('nomeFaseLegenda');
const subFaseLegenda = document.getElementById('subFaseLegenda');
const rodapeEsquerda = document.getElementById('rodapeEsquerda');

function podeFocarCampo() {
    return window.innerWidth > 780 && !window.matchMedia('(pointer: coarse)').matches;
}

function numeroAleatorio() {
    return RegrasCofre.sortearSenha();
}

function tocarSom(nome) {
    if (!somLigado) return;
    const audio = document.getElementById(nome);
    if (!audio) return;
    audio.volume = nome === 'somRoda' ? 0.42 : 0.75;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function somDeFundo() {
    ambiente.volume = 0.48;
    if (somLigado && iniciou) ambiente.play().catch(() => {});
    else ambiente.pause();
}

// 2. INÍCIO E CONTROLES GERAIS
function entrarNoJogo() {
    if (iniciou) return;
    iniciou = true;
    tocarSom('somClique');
    somDeFundo();
    telaInicial.classList.add('saindo');
    jogo.classList.add('aproximando');
    setTimeout(() => {
        telaInicial.hidden = true;
        cancelAnimationFrame(animacaoChuva);
        habilitarJogo(true);
        if (podeFocarCampo()) campoSenha.focus();
    }, 1450);
    acompanharAproximacao(performance.now());
}

function habilitarJogo(podeJogar) {
    campoSenha.disabled = !podeJogar;
    botaoTentar.disabled = !podeJogar;
    botaoNova.disabled = !podeJogar;
    botaoTrocarFase.disabled = !terminou || !avancarAoReiniciar;
    botaoInspecionar.disabled = !podeJogar;
    habilitarRoda(podeJogar);
}

function mostrarMensagem(texto, tipo = '') {
    mensagem.className = 'mensagem';
    mensagem.textContent = texto;
    void mensagem.offsetWidth;
    mensagem.classList.add('mostrar');
    if (tipo) mensagem.classList.add(tipo);
}

function atualizarTentativas() {
    contador.innerHTML = String(tentativas).padStart(2, '0') + ' <small>/ 07</small>';
    if (miniContador) miniContador.innerHTML = 'TENTATIVAS <strong>' + String(tentativas).padStart(2, '0') + ' / 07</strong>'; 
    marcadores.forEach((marcador, indice) => {
        marcador.classList.toggle('usado', indice < tentativas);
        marcador.classList.toggle('perigo', tentativas >= 5 && indice < tentativas);
    });

    const restantes = limite - tentativas;
    jogo.classList.toggle('aviso-critico', !terminou && restantes <= 2 && restantes > 0);
    if (!terminou && restantes === 2) {
        aviso.textContent = 'ATENÇÃO: RESTAM APENAS 2 TENTATIVAS!';
        aviso.hidden = false;
    } else if (!terminou && restantes === 1) {
        aviso.textContent = 'ATENÇÃO: RESTA APENAS 1 TENTATIVA!';
        aviso.hidden = false;
    } else {
        aviso.hidden = true;
    }
}

/**
 * HISTÓRICO DE PALPITES
 * Só usa números já enviados pelo jogador e as pistas recebidas.
 * A faixa é uma ajuda opcional; o registro fica recolhido por padrão.
 */
function atualizarHistorico() {
    historico.hidden = historicoPalpites.length === 0;
    historicoLista.replaceChildren();
    if (historicoPalpites.length === 0) {
        historico.open = false;
        historicoResumo.textContent = '0 / 7';
        return;
    }

    const faixa = RegrasCofre.calcularFaixa(historicoPalpites);
    const quantidade = historicoPalpites.length;
    historicoResumo.textContent = `${String(quantidade).padStart(2,'0')} / 07`;
    const acertou = historicoPalpites.some(registro => registro.pista === 'correto');
    historicoFaixa.textContent = acertou
        ? `SENHA IDENTIFICADA: ${String(faixa.minimo).padStart(2,'0')}`
        : `FAIXA POSSÍVEL: ${String(faixa.minimo).padStart(2,'0')}–${String(faixa.maximo).padStart(2,'0')}`;

    // Exibe a tentativa mais recente primeiro sem perder a numeração real.
    [...historicoPalpites].reverse().forEach((registro, indice) => {
        const numeroDaTentativa = quantidade - indice;
        const item = document.createElement('li');
        item.className = 'historico-item ' + registro.pista;
        const ordem = document.createElement('span');
        ordem.textContent = String(numeroDaTentativa).padStart(2, '0');
        const numero = document.createElement('strong');
        numero.textContent = String(registro.numero).padStart(2, '0');
        const status = document.createElement('span');
        status.textContent = ({maior: 'SENHA MAIOR ↑', menor: 'SENHA MENOR ↓', correto: 'CORRETO ✓'})[registro.pista];
        item.append(ordem, numero, status);
        historicoLista.append(item);
    });
}

function atualizarDicaCampo() {
    const numero = RegrasCofre.validarPalpite(campoSenha.value);
    const jaTentou = numero !== null && historicoPalpites.some(registro => registro.numero === numero);
    dicaCampo.textContent = jaTentou
        ? `O número ${numero} já foi tentado. Repetir também gasta uma tentativa.`
        : 'Digite um número inteiro entre 1 e 50.';
    dicaCampo.classList.toggle('dica-repetida', jaTentou);
}

function carregarFase(indice) {
    faseAtual = (indice + fases.length) % fases.length;
    const fase = fases[faseAtual];
    jogo.dataset.fase = String(faseAtual + 1);
    imagemFechada.src = fase.fechado;
    imagemAberta.src = fase.aberto;
    textoArea.textContent = fase.area;
    textoSala.textContent = fase.sala;
    textoAndar.textContent = fase.andar;
    faseBadgeNumero.textContent = String(faseAtual + 1).padStart(2, '0');
    faseBadgeTotal.textContent = '/' + String(fases.length).padStart(2, '0');
    nomeFasePainel.textContent = fase.nome;
    descricaoFase.textContent = fase.descricao;
    referenciaReal.textContent = fase.referencia;
    localFasePainel.textContent = fase.sub;
    if (progressoFase) progressoFase.textContent = (faseAtual + 1) + ' DE ' + fases.length;
    if (indiceFaseLegenda) indiceFaseLegenda.textContent = String(faseAtual + 1).padStart(2, '0') + ' / ' + String(fases.length).padStart(2, '0');
    nomeFaseLegenda.textContent = fase.nome;
    subFaseLegenda.textContent = fase.sub;
    rodapeEsquerda.textContent = fase.rodape;
    document.querySelector('.inspecao-placa').textContent = fase.nome + ' · 50 POSIÇÕES';
    // Cada foto teve o disco original separado: apenas ele gira, sem dublê.
    rodaAmpliada.style.backgroundImage = 'none';
    rodaAmpliada.querySelector('.miolo-roda').style.backgroundImage = `url('${fase.roda.sprite}')`;
    document.querySelector('.inspecao-mecanismo').style.backgroundImage = 'none';
    // Deixa os arquivos da próxima fase no cache do navegador.
    const seguinte = fases[(faseAtual + 1) % fases.length];
    [seguinte.fechado, seguinte.aberto, seguinte.roda.sprite].forEach(src => {
        const imagem = new Image();
        imagem.src = src;
    });
    posicionarRoda();
}

function posicionarRoda() {
    posicionarRodaAmpliada();
}

function posicionarRodaAmpliada() {
    const local = document.querySelector('.inspecao-mecanismo');
    if (!local) return;
    const largura = local.clientWidth;
    const altura = local.clientHeight;
    if (!largura || !altura) return;
    // Aumento verdadeiro da câmera: textura 1600px, sem esticar o disco pequeno.
    const tamanho = Math.min(Math.max(largura, altura) * .80, Math.min(largura, altura) * .88);
    rodaAmpliada.style.width = tamanho + 'px';
    rodaAmpliada.style.height = tamanho + 'px';
}

function acompanharAproximacao(inicio) {
    posicionarRoda();
    if (performance.now() - inicio < 2800) {
        requestAnimationFrame(() => acompanharAproximacao(inicio));
    }
}

function habilitarRoda(podeGirar) {
    [rodaAmpliada].forEach(elemento => {
        elemento.classList.toggle('desativada', !podeGirar);
        elemento.tabIndex = podeGirar ? 0 : -1;
        elemento.setAttribute('aria-disabled', String(!podeGirar));
    });
    girarEsquerda.disabled = !podeGirar;
    girarDireita.disabled = !podeGirar;
}

// 3. DISCO DE COMBINAÇÃO: 50 posições com ponteiro fixo.
function normalizarPasso(passo) {
    return ((passo % 50) + 50) % 50;
}

function valorDaRoda(passo) {
    const normalizado = normalizarPasso(passo);
    // O disco agora tem numeração crescente no sentido horário,
    // como nos cofres do RE2: ao girar o disco para a direita,
    // o número sob o ponteiro fixo diminui.
    return ((50 - normalizado) % 50) + 1;
}

function passoDoValor(valor) {
    return (51 - valor) % 50;
}

function somDeEngrenagem() {
    if (!somLigado) return;
    const agora = performance.now();
    if (agora - ultimoSomDaRoda < 55) return;
    ultimoSomDaRoda = agora;
    // Cada dente produz um clique ligeiramente diferente; os sons não
    // são cortados quando a roda passa rapidamente para o próximo número.
    const original = document.getElementById('somRoda');
    const clique = original.cloneNode();
    clique.volume = 0.26 + Math.random() * 0.09;
    clique.playbackRate = 0.94 + Math.random() * 0.11;
    clique.play().catch(() => {});
}

function desenharRotacao(angulo) {
    anguloRenderizado = angulo;
    miolosRoda.forEach(miolo => { miolo.style.transform = `rotate(${angulo}deg)`; });
}

function encaixarRotacao(destino) {
    if (animacaoEncaixe !== null) cancelAnimationFrame(animacaoEncaixe);
    animacaoEncaixe = null;
    const origem = anguloRenderizado;
    const distancia = destino - origem;
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzido || Math.abs(distancia) < .001) {
        desenharRotacao(destino);
        return;
    }
    const duracao = Math.max(145, Math.min(420, 160 + Math.abs(distancia) * 1.7));
    const inicio = performance.now();
    const quadro = agora => {
        const t = Math.min(1, (agora - inicio) / duracao);
        // Amortecimento do mecanismo: avanço rápido, chegada suave ao dente.
        const suavizado = 1 - Math.pow(1 - t, 4);
        desenharRotacao(origem + distancia * suavizado);
        if (t < 1) animacaoEncaixe = requestAnimationFrame(quadro);
        else animacaoEncaixe = null;
    };
    animacaoEncaixe = requestAnimationFrame(quadro);
}

function aplicarAngulo(novoAngulo, fazerSom = false, preencherCampo = true) {
    anguloRoda = novoAngulo;
    if (arrastandoRoda) {
        if (animacaoEncaixe !== null) cancelAnimationFrame(animacaoEncaixe);
        animacaoEncaixe = null;
        desenharRotacao(novoAngulo);
    } else {
        encaixarRotacao(novoAngulo);
    }
    const passo = Math.round(anguloRoda / grausPorNumero);
    const mudou = passo !== ultimoPasso;
    ultimoPasso = passo;
    const valor = valorDaRoda(passo);

    numeroRoda.textContent = String(valor).padStart(2, '0');
    numeroInspecao.textContent = String(valor).padStart(2, '0');
    [rodaAmpliada].forEach(elemento => {
        elemento.setAttribute('aria-valuenow', String(valor));
        elemento.setAttribute('aria-valuetext', 'Número ' + valor + ' de 50');
    });
    if (preencherCampo) campoSenha.value = valor;
    if (mudou && fazerSom) {
        somDeEngrenagem();
        if (navigator.vibrate && inspecaoAberta) navigator.vibrate(5);
    }
}

function girarPassos(quantidade) {
    if (!iniciou || terminou || campoSenha.disabled) return;
    aplicarAngulo((ultimoPasso + quantidade) * grausPorNumero, true);
}

function sincronizarCampoComRoda() {
    const texto = campoSenha.value.trim();
    const valor = Number(texto);
    if (!/^\d+$/.test(texto) || !Number.isInteger(valor) || valor < 1 || valor > 50) return;
    const posicaoAtual = normalizarPasso(ultimoPasso);
    const posicaoDestino = passoDoValor(valor);
    let diferenca = posicaoDestino - posicaoAtual;
    if (diferenca > 25) diferenca -= 50;
    if (diferenca < -25) diferenca += 50;
    aplicarAngulo((ultimoPasso + diferenca) * grausPorNumero, false, false);
}

function anguloDoPonteiro(evento, elemento) {
    const retangulo = elemento.getBoundingClientRect();
    const meioX = retangulo.left + retangulo.width / 2;
    const meioY = retangulo.top + retangulo.height / 2;
    return Math.atan2(evento.clientY - meioY, evento.clientX - meioX) * 180 / Math.PI;
}

function iniciarArrasto(evento) {
    if (!iniciou || terminou || campoSenha.disabled || evento.button > 0 || transicaoEmAndamento) return;
    if (inspecaoAberta && evento.currentTarget !== rodaAmpliada) return;
    evento.preventDefault();
    arrastandoRoda = true;
    rodaAtiva = evento.currentTarget;
    arrastoTotal = 0;
    rodaAtiva.classList.add('arrastando');
    anguloAnteriorPonteiro = anguloDoPonteiro(evento, rodaAtiva);
    rodaAtiva.setPointerCapture(evento.pointerId);
}

function moverArrasto(evento) {
    if (!arrastandoRoda || rodaAtiva !== evento.currentTarget) return;
    const anguloAtual = anguloDoPonteiro(evento, rodaAtiva);
    let diferenca = anguloAtual - anguloAnteriorPonteiro;
    if (diferenca > 180) diferenca -= 360;
    if (diferenca < -180) diferenca += 360;
    arrastoTotal += Math.abs(diferenca);
    anguloAnteriorPonteiro = anguloAtual;
    aplicarAngulo(anguloRoda + diferenca, true);
}

function terminarArrasto() {
    if (!arrastandoRoda) return;
    arrastandoRoda = false;
    rodaAtiva.classList.remove('arrastando');
    rodaAtiva = null;
    aplicarAngulo(ultimoPasso * grausPorNumero);
}

function abrirInspecao() {
    if (!iniciou || terminou || transicaoEmAndamento || campoSenha.disabled || inspecaoAberta) return;
    inspecaoAberta = true;
    inspecao.hidden = false;
    posicionarRodaAmpliada();
    tocarSom('somClique');
    rodaAmpliada.focus();
}

function fecharInspecao(devolverFoco = true) {
    if (!inspecaoAberta) return;
    inspecaoAberta = false;
    inspecao.hidden = true;
    if (devolverFoco && !botaoInspecionar.disabled) botaoInspecionar.focus();
}

function girarDisco() {
    clearTimeout(tempoGiro);
    [rodaAmpliada].forEach(elemento => {
        elemento.classList.remove('checando');
        void elemento.offsetWidth;
        elemento.classList.add('checando');
    });
    tempoGiro = setTimeout(() => [rodaAmpliada].forEach(elemento => elemento.classList.remove('checando')), 620);
}

// 4. RESULTADOS E PROGRESSÃO ENTRE FASES
function encerrarPartida(venceu) {
    terminou = true;
    campoSenha.disabled = true;
    botaoTentar.disabled = true;
    botaoInspecionar.disabled = true;
    habilitarRoda(false);
    fecharInspecao(false);
    aviso.hidden = true;
    jogo.classList.remove('aviso-critico');

    if (venceu) {
        avancarAoReiniciar = true;
        fasesVencidas.add(faseAtual);
        botaoTrocarFase.disabled = false;
        mostrarMensagem('Cofre desbloqueado!', 'correto');
        jogo.classList.add('mecanismo-em-abertura');
        tocarSom('somDesbloqueio');

        // Primeiro o mecanismo destrava; em seguida vemos o cofre realmente aberto.
        agendar(() => mascaraAbertura.classList.add('fechando'), 260);
        agendar(() => {
            jogo.classList.add('abriu');
            mascaraAbertura.classList.remove('fechando');
            mascaraAbertura.classList.add('revelando');
            tocarSom('somPorta');
        }, 800);
        agendar(() => {
            aberturaTexto.textContent = 'COFRE DESBLOQUEADO';
            aberturaCena.hidden = false;
            aberturaCena.classList.add('ativo');
        }, 1250);
        // O jogador consegue apreciar o cenário aberto antes da mensagem final.
        agendar(() => {
            aberturaCena.classList.remove('ativo');
            aberturaCena.hidden = true;
            mostrarFinal(true);
        }, 2950);
    } else {
        avancarAoReiniciar = false;
        jogo.classList.add('derrotado');
        mostrarMensagem('ACESSO NEGADO', 'invalido');
        tocarSom('somNegado');
        agendar(() => mostrarFinal(false), 960);
    }
}

function mostrarFinal(venceu) {
    const ultimaFase = faseAtual === fases.length - 1;
    const campanhaCompleta = venceu && ultimaFase && fasesVencidas.size === fases.length;
    document.getElementById('simboloFinal').textContent = venceu ? '✓' : '×';
    document.getElementById('cabecalhoFinal').textContent = campanhaCompleta
        ? 'TODOS OS COFRES ABERTOS' : (venceu ? 'ACESSO AUTORIZADO' : 'ACESSO NEGADO');
    // A frase COFRE DESBLOQUEADO! permanece em toda vitória: é uma regra do professor.
    seloCampanha.hidden = !campanhaCompleta;
    document.getElementById('tituloFinal').textContent = venceu
        ? 'COFRE DESBLOQUEADO!' : 'ACESSO NEGADO';
    document.getElementById('textoFinal').textContent = venceu
        ? 'Você abriu o cofre da fase ' + String(faseAtual + 1).padStart(2, '0') + ' em ' + tentativas + (tentativas === 1 ? ' tentativa.' : ' tentativas.') + (campanhaCompleta ? ' Todos os setores foram concluídos.' : '')
        : 'Você utilizou todas as 7 tentativas. O cofre permanece fechado. Tente de novo nesta fase.';
    document.getElementById('finalFase').textContent = String(faseAtual + 1).padStart(2,'0') + ' / ' + String(fases.length).padStart(2,'0');
    document.getElementById('finalTentativas').textContent = String(tentativas).padStart(2,'0') + ' / 07';
    document.getElementById('finalStatus').textContent = venceu ? 'ABERTO' : 'BLOQUEADO';
    document.getElementById('trilhaFases').innerHTML = fases.map((fase, indice) =>
        '<span class="' + (fasesVencidas.has(indice) ? 'concluida' : (indice === faseAtual ? 'foco' : '')) + '"></span>'
    ).join('');
    botaoReiniciar.innerHTML = venceu
        ? (ultimaFase ? 'REINICIAR CAMPANHA <span>↻</span>' : 'PRÓXIMA FASE <span>➜</span>')
        : 'TENTAR DE NOVO <span>↻</span>';
    overview.classList.toggle('derrota', !venceu);
    overview.hidden = false;
    botaoReiniciar.focus();
}

function tentarAbrir(evento) {
    evento.preventDefault();
    if (!iniciou || terminou || campoSenha.disabled) return;

    const numero = RegrasCofre.validarPalpite(campoSenha.value);
    if (numero === null) {
        mostrarMensagem('Digite um número inteiro de 1 a 50.', 'invalido');
        tocarSom('somErro');
        return; // Entradas inválidas não consomem uma das sete chances.
    }

    tentativas++;
    const pista = RegrasCofre.comparar(numero, senha);
    historicoPalpites.push({ numero, pista });
    atualizarHistorico();
    girarDisco();
    tocarSom('somTentativa');

    if (pista === 'correto') {
        atualizarTentativas();
        encerrarPartida(true);
    } else if (tentativas === limite) {
        atualizarTentativas();
        encerrarPartida(false);
    } else {
        mostrarMensagem(pista === 'maior' ? 'A senha é maior!' : 'A senha é menor!');
        atualizarTentativas();
    }

    if (!terminou) {
        campoSenha.value = '';
        atualizarDicaCampo();
        if (podeFocarCampo()) campoSenha.focus();
    }
}

function prepararEstadoInicial() {
    clearTimeout(tempoModal);
    clearTimeout(tempoGiro);
    limparTempos();
    fecharInspecao(false);
    senha = numeroAleatorio();
    tentativas = 0;
    terminou = false;
    avancarAoReiniciar = false;
    campoSenha.value = '';
    historicoPalpites = [];
    atualizarHistorico();
    atualizarDicaCampo();
    aberturaCena.hidden = true;
    aberturaCena.classList.remove('ativo');
    overview.hidden = true;
    jogo.classList.remove('abriu', 'derrotado', 'aviso-critico', 'mecanismo-em-abertura');
    mascaraAbertura.classList.remove('fechando', 'revelando');
    rodaAmpliada.classList.remove('checando','arrastando');
    arrastandoRoda = false;
    rodaAtiva = null;
    ultimoPasso = 0;
    anguloRoda = 0;
    if (animacaoEncaixe !== null) cancelAnimationFrame(animacaoEncaixe);
    animacaoEncaixe = null;
    desenharRotacao(0);
    miolosRoda.forEach(miolo => { miolo.style.transition = 'none'; });
    aplicarAngulo(0, false, false);
    requestAnimationFrame(() => { miolosRoda.forEach(miolo => { miolo.style.transition = ''; }); });
    habilitarJogo(iniciou && !transicaoEmAndamento);
    mostrarMensagem('Aguardando combinação...');
    atualizarTentativas();
    posicionarRoda();
}

function reiniciarFaseAtual() {
    if (transicaoEmAndamento) return;
    prepararEstadoInicial();
    tocarSom('somClique');
    if (iniciou && podeFocarCampo()) campoSenha.focus();
}

function proximaFase() {
    if (transicaoEmAndamento || !terminou || !avancarAoReiniciar) return;
    transicaoEmAndamento = true;
    const proximoIndice = (faseAtual + 1) % fases.length;
    const proxima = fases[proximoIndice];
    const novoCiclo = proximoIndice === 0;
    document.getElementById('transicaoNumero').textContent = String(proximoIndice + 1).padStart(2,'0') + ' — ' + String(fases.length).padStart(2,'0');
    document.getElementById('transicaoTitulo').textContent = proxima.nome;
    document.getElementById('transicaoSubtitulo').textContent = proxima.area + '  /  ' + proxima.andar;
    document.getElementById('transicaoBarras').innerHTML = fases.map((fase, indice) =>
        '<span class="' + (indice === proximoIndice ? 'atual' : '') + '"></span>'
    ).join('');
    overview.hidden = true;
    transicaoFase.hidden = false;
    transicaoFase.classList.remove('saindo');
    void transicaoFase.offsetWidth;
    transicaoFase.classList.add('visivel');
    tocarSom('somClique');
    setTimeout(() => {
        if (novoCiclo) fasesVencidas.clear();
        carregarFase(proximoIndice);
        prepararEstadoInicial();
    }, 650);
    setTimeout(() => transicaoFase.classList.add('saindo'), 1750);
    setTimeout(() => {
        transicaoFase.hidden = true;
        transicaoFase.classList.remove('visivel','saindo');
        transicaoEmAndamento = false;
        habilitarJogo(true);
        if (podeFocarCampo()) campoSenha.focus();
    }, 2350);
}

function acaoBotaoModal() {
    overview.hidden = true;
    if (avancarAoReiniciar) proximaFase();
    else reiniciarFaseAtual();
}

// 6. EVENTOS DE INTERAÇÃO: botões, teclado, mouse e toque.
formSenha.addEventListener('submit', tentarAbrir);
botaoNova.addEventListener('click', reiniciarFaseAtual);
botaoTrocarFase.addEventListener('click', proximaFase);
botaoReiniciar.addEventListener('click', acaoBotaoModal);
botaoEntrar.addEventListener('click', entrarNoJogo);
girarEsquerda.addEventListener('click', () => girarPassos(-1));
girarDireita.addEventListener('click', () => girarPassos(1));
campoSenha.addEventListener('input', () => {
    sincronizarCampoComRoda();
    atualizarDicaCampo();
});

botaoInspecionar.addEventListener('click', abrirInspecao);
fecharInspecaoBotao.addEventListener('click', () => fecharInspecao());
document.getElementById('inspecaoFundo').addEventListener('click', () => fecharInspecao());
inspecaoConfirmar.addEventListener('click', () => fecharInspecao());
document.getElementById('inspecaoMenos').addEventListener('click', () => girarPassos(-1));
document.getElementById('inspecaoMais').addEventListener('click', () => girarPassos(1));

[rodaAmpliada].forEach(elemento => {
    elemento.addEventListener('pointerdown', iniciarArrasto);
    elemento.addEventListener('pointermove', moverArrasto);
    elemento.addEventListener('pointerup', terminarArrasto);
    elemento.addEventListener('pointercancel', terminarArrasto);
    elemento.addEventListener('lostpointercapture', terminarArrasto);
    elemento.addEventListener('wheel', evento => {
        if (!iniciou || terminou || campoSenha.disabled) return;
        evento.preventDefault();
        scrollAcumulado += evento.deltaY;
        if (Math.abs(scrollAcumulado) >= 24) {
            const quantidade = scrollAcumulado > 0 ? 1 : -1;
            girarPassos(quantidade);
            scrollAcumulado = 0;
        }
    }, { passive: false });
});

imagemFechada.addEventListener('load', posicionarRoda);
imagemAberta.addEventListener('load', posicionarRoda);
window.addEventListener('resize', posicionarRoda);
window.addEventListener('resize', posicionarRodaAmpliada);

botaoSom.addEventListener('click', () => {
    somLigado = !somLigado;
    botaoSom.textContent = somLigado ? 'ÁUDIO: LIGADO' : 'ÁUDIO: DESLIGADO';
    botaoSom.setAttribute('aria-pressed', String(somLigado));
    botaoSom.setAttribute('aria-label', somLigado ? 'Desativar áudio' : 'Ativar áudio');
    somDeFundo();
    tocarSom('somClique');
});

document.addEventListener('keydown', (evento) => {
    if (!iniciou) {
        entrarNoJogo();
        return;
    }
    if (inspecaoAberta) {
        if (evento.key === 'Escape') {
            evento.preventDefault();
            fecharInspecao();
            return;
        }
        if (evento.key === 'Enter' && document.activeElement === rodaAmpliada) {
            evento.preventDefault();
            fecharInspecao();
            return;
        }
    }
    if (!overview.hidden) {
        if (evento.key === 'Enter' && document.activeElement !== botaoReiniciar) {
            evento.preventDefault();
            acaoBotaoModal();
        }
        return;
    }
    if (terminou || campoSenha.disabled || transicaoEmAndamento) return;
    const tecla = evento.key.toLowerCase();
    if (tecla === 'a' || tecla === 'arrowleft') {
        evento.preventDefault();
        girarPassos(-1);
    } else if (tecla === 'd' || tecla === 'arrowright') {
        evento.preventDefault();
        girarPassos(1);
    }
});

telaInicial.addEventListener('pointerdown', entrarNoJogo, { once: true });

carregarFase(0);
prepararEstadoInicial();
iniciarChuva();
