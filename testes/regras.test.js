/**
 * Testes do desafio. Execute: node testes/regras.test.js
 * Não exige instalar nenhuma biblioteca.
 */
const assert = require('node:assert/strict');
const RegrasCofre = require('../regras.js');

// Sorteio no intervalo de 1 a 50 e extremos corretos.
assert.equal(RegrasCofre.sortearSenha(() => 0), 1);
assert.equal(RegrasCofre.sortearSenha(() => .99999), 50);
for (let i = 0; i < 50; i++) {
    assert.equal(RegrasCofre.sortearSenha(() => (i + .1) / 50), i + 1);
}
assert.equal(RegrasCofre.LIMITE, 7);

// Valores inválidos não devem ser aceitos como palpites.
for (const entrada of ['', ' ', '-1', '0', '51', '1.5', '1e2', 'abc', '10a', '7,5']) {
    assert.equal(RegrasCofre.validarPalpite(entrada), null, `Inválido: ${entrada}`);
}
assert.equal(RegrasCofre.validarPalpite('01'), 1);
assert.equal(RegrasCofre.validarPalpite(' 50 '), 50);

// Pistas exatamente como o professor exige.
assert.equal(RegrasCofre.comparar(9, 15), 'maior');
assert.equal(RegrasCofre.comparar(19, 15), 'menor');
assert.equal(RegrasCofre.comparar(15, 15), 'correto');

// Histórico e faixa provável em cada etapa.
assert.deepEqual(RegrasCofre.calcularFaixa([]), { minimo: 1, maximo: 50 });
assert.deepEqual(RegrasCofre.calcularFaixa([
    { numero: 20, pista: 'maior' }, { numero: 41, pista: 'menor' }
]), { minimo: 21, maximo: 40 });
assert.deepEqual(RegrasCofre.calcularFaixa([
    { numero: 20, pista: 'maior' }, { numero: 41, pista: 'menor' }, { numero: 32, pista: 'correto' }
]), { minimo: 32, maximo: 32 });

console.log('PASSOU: sorteio, validação, pistas, sete tentativas e histórico.');
