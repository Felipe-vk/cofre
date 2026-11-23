/** Efeito de chuva e iluminação da tela inicial. */
// 5. CHUVA DO MENU: efeito offline em Canvas.
function iniciarChuva() {
    // Chuva original desenhada em canvas: planos de profundidade, gotas
    // na lente, respingos no asfalto e variações de vento. Sem GIF ou internet.
    const longe = [];
    const meio = [];
    const perto = [];
    const lente = [];
    const respingos = [];
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let largura = window.innerWidth;
    let altura = window.innerHeight;
    let proximoFlash = performance.now() + 9000;
    let inicioFlash = -5000;
    let tempoAnterior = 0;

    function criarGota(plano, inicial = false) {
        const faixas = [
            {vel: 260, tam: 11, esp: .45, op: .10},
            {vel: 550, tam: 27, esp: .8, op: .18},
            {vel: 900, tam: 46, esp: 1.3, op: .15}
        ];
        const tipo = faixas[plano];
        return {
            x: Math.random() * (largura + 140) - 45,
            y: inicial ? Math.random() * altura : -20 - Math.random() * 160,
            velocidade: tipo.vel * (.60 + Math.random() * .8),
            tamanho: tipo.tam * (.7 + Math.random() * 1.0),
            espessura: tipo.esp * (.6 + Math.random() * .7),
            opacidade: tipo.op * (.55 + Math.random() * .9),
            plano
        };
    }

    function criarGotaDeVidro(inicial = false) {
        return {
            x: Math.random() * largura,
            y: inicial ? Math.random() * altura : -30,
            raio: 1.5 + Math.random() * 2.7,
            velocidade: 2 + Math.random() * 20,
            deriva: -.22 + Math.random() * .44,
            rastro: 8 + Math.random() * 38,
            opacidade: .07 + Math.random() * .16,
            parada: Math.random() * 2.8,
            vida: 3 + Math.random() * 9
        };
    }

    function criarRespingo(inicial = false) {
        return {
            x: Math.random() * largura,
            y: altura * (.73 + Math.random() * .26),
            r: inicial ? Math.random() * 15 : 0,
            max: 7 + Math.random() * 15,
            velocidade: 7 + Math.random() * 9,
            opacidade: .07 + Math.random() * .14,
            atraso: inicial ? 0 : Math.random() * 1.2
        };
    }

    function redimensionar() {
        largura = window.innerWidth;
        altura = window.innerHeight;
        const densidade = Math.min(window.devicePixelRatio || 1, 1.65);
        rainCanvas.width = Math.round(largura * densidade);
        rainCanvas.height = Math.round(altura * densidade);
        rainCanvas.style.width = largura + 'px';
        rainCanvas.style.height = altura + 'px';
        rainContext.setTransform(densidade, 0, 0, densidade, 0, 0);
        longe.length = 0;
        meio.length = 0;
        perto.length = 0;
        lente.length = 0;
        respingos.length = 0;
        const n = Math.min(225,Math.max(75,Math.floor(largura / 8)));
        for (let i=0; i<n; i++) longe.push(criarGota(0,true));
        for (let i=0; i<Math.floor(n*.35); i++) meio.push(criarGota(1,true));
        for (let i=0; i<Math.floor(n*.085); i++) perto.push(criarGota(2,true));
        for (let i=0; i<Math.min(48,Math.floor(largura/35)); i++) lente.push(criarGotaDeVidro(true));
        for (let i=0; i<Math.min(48,Math.floor(largura/31)); i++) respingos.push(criarRespingo(true));
    }

    function brilhoDaRua(x,y) {
        // Reflexos mais fortes junto aos postes, não chuva branca homogênea.
        const pontos = [[.14,.37,.13],[.59,.73,.12],[.77,.72,.15]];
        let brilho = 0;
        for (const [lx,ly,amplitude] of pontos) {
            const dx=(x/largura-lx)*2.1;
            const dy=(y/altura-ly)*1.9;
            brilho += amplitude*Math.exp(-(dx*dx+dy*dy)*8);
        }
        return brilho;
    }

    function desenharPlano(gotas,dt,vento) {
        for (const gota of gotas) {
            if (!movimentoReduzido) {
                gota.x += (vento * (gota.plano + 1)*.33 - 24)*dt;
                gota.y += gota.velocidade*dt;
            }
            if (gota.y > altura + 55 || gota.x < -80 || gota.x > largura + 90) {
                Object.assign(gota,criarGota(gota.plano));
            }
            const inclinacao = (vento*.02 + .035)*gota.tamanho;
            rainContext.beginPath();
            rainContext.lineCap = gota.plano === 2 ? 'round' : 'butt';
            rainContext.lineWidth = gota.espessura;
            const a = Math.min(.5,gota.opacidade + brilhoDaRua(gota.x,gota.y));
            rainContext.strokeStyle = `rgba(182,206,216,${a.toFixed(3)})`;
            rainContext.moveTo(gota.x,gota.y);
            rainContext.lineTo(gota.x-inclinacao,gota.y-gota.tamanho);
            rainContext.stroke();
        }
    }

    function desenharLente(dt) {
        for (const gota of lente) {
            if (!movimentoReduzido) {
                gota.parada -= dt;
                if (gota.parada < 0) {
                    gota.y += gota.velocidade*dt;
                    gota.x += gota.deriva*gota.velocidade*dt;
                    gota.vida -= dt;
                }
            }
            if (gota.y > altura+15 || gota.vida < 0) Object.assign(gota,criarGotaDeVidro());
            const x=gota.x, y=gota.y, r=gota.raio, o=gota.opacidade;
            // Filme molhado escuro + borda que captura a luz, como uma lente.
            rainContext.beginPath();
            rainContext.moveTo(x,y-gota.rastro);
            rainContext.lineTo(x,y);
            rainContext.strokeStyle=`rgba(204,226,230,${(o*.24).toFixed(3)})`;
            rainContext.lineWidth=Math.max(.5,r*.25);
            rainContext.stroke();
            rainContext.beginPath();
            rainContext.ellipse(x,y,r*.95,r*1.4,-.16,0,Math.PI*2);
            rainContext.fillStyle=`rgba(11,20,27,${(o*.68).toFixed(3)})`;
            rainContext.fill();
            rainContext.beginPath();
            rainContext.ellipse(x-r*.23,y-r*.32,r*.47,r*.64,-.3,0,Math.PI*2);
            rainContext.fillStyle=`rgba(229,241,240,${(o*.93).toFixed(3)})`;
            rainContext.fill();
            rainContext.beginPath();
            rainContext.ellipse(x+r*.17,y+r*.3,r*.32,r*.48,.2,0,Math.PI*2);
            rainContext.strokeStyle=`rgba(196,214,216,${(o*.54).toFixed(3)})`;
            rainContext.lineWidth=.6;
            rainContext.stroke();
        }
    }

    function desenharRespingo(dt) {
        for (const r of respingos) {
            if (!movimentoReduzido) {
                r.atraso-=dt;
                if (r.atraso > 0) continue;
                r.r+=r.velocidade*dt;
            }
            if (r.r > r.max) Object.assign(r,criarRespingo());
            const alpha=r.opacidade*(1-r.r/r.max);
            if (alpha<=0) continue;
            rainContext.beginPath();
            rainContext.ellipse(r.x,r.y,r.r,r.r*.20,0,0,Math.PI*2);
            rainContext.strokeStyle=`rgba(182,211,221,${alpha.toFixed(3)})`;
            rainContext.lineWidth=.8;
            rainContext.stroke();
        }
    }

    function animar(tempo) {
        const dt=Math.min((tempo-(tempoAnterior||tempo))/1000,.042);
        tempoAnterior=tempo;
        rainContext.clearRect(0,0,largura,altura);
        const vento=-16+13*Math.sin(tempo/6000)+7*Math.sin(tempo/2400);
        desenharPlano(longe,dt,vento);
        desenharPlano(meio,dt,vento);
        desenharPlano(perto,dt,vento);
        desenharRespingo(dt);
        desenharLente(dt);
        if (!movimentoReduzido) {
            if (tempo > proximoFlash) {
                inicioFlash=tempo;
                proximoFlash=tempo + 14500 + Math.random()*18000;
            }
            const elapsed=tempo-inicioFlash;
            // Relâmpago discreto de dois pulsos, sem piscar constantemente.
            relampago.classList.toggle('ativo',(elapsed>=0&&elapsed<75)||(elapsed>160&&elapsed<218));
            if (!telaInicial.hidden) animacaoChuva=requestAnimationFrame(animar);
        }
    }
    redimensionar();
    window.addEventListener('resize',redimensionar);
    animacaoChuva=requestAnimationFrame(animar);
}

