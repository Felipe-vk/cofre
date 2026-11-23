/**
 * REGRAS DO COFRE — funções pequenas, sem interface e fáceis de testar.
 * A interface (script.js) chama estas funções para sortear e comparar.
 */
const RegrasCofre = (() => {
    const MIN = 1;
    const MAX = 50;
    const LIMITE = 7;

    function sortearSenha(aleatorio = Math.random) {
        return Math.floor(aleatorio() * MAX) + MIN;
    }

    function validarPalpite(texto) {
        const valor = String(texto).trim();
        if (!/^\d+$/.test(valor)) return null;
        const numero = Number(valor);
        return Number.isInteger(numero) && numero >= MIN && numero <= MAX ? numero : null;
    }

    // Retorna a pista que o jogador deve receber.
    function comparar(palpite, segredo) {
        if (palpite === segredo) return 'correto';
        return palpite < segredo ? 'maior' : 'menor';
    }

    // A faixa considera apenas os palpites e suas pistas, não revela a senha.
    function calcularFaixa(registros) {
        let minimo = MIN;
        let maximo = MAX;
        for (const { numero, pista } of registros) {
            if (pista === 'maior') minimo = Math.max(minimo, numero + 1);
            if (pista === 'menor') maximo = Math.min(maximo, numero - 1);
            if (pista === 'correto') minimo = maximo = numero;
        }
        return { minimo, maximo };
    }

    return Object.freeze({ MIN, MAX, LIMITE, sortearSenha, validarPalpite, comparar, calcularFaixa });
})();

// Exportar também para o teste automático no Node.js, sem afetar o navegador.
if (typeof module !== 'undefined' && module.exports) module.exports = RegrasCofre;
