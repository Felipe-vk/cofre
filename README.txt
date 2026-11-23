COFRE SECRETO — RESIDENT EVIL 2 | EDIÇÃO FINAL ESCOLAR
=======================================================
Minijogo feito em HTML5, CSS3 e JavaScript. Funciona OFFLINE.
Projeto de fã inspirado nos ambientes de Resident Evil 2. Não é oficial.

COMO ABRIR
1. Extraia o ZIP inteiro para uma pasta.
2. Abra o arquivo index.html no Chrome, Edge ou Firefox.
3. Pressione uma tecla ou clique na tela inicial.
4. Para editar, abra a pasta inteira no Visual Studio Code.
Não precisa instalar biblioteca, servidor, extensão ou programa extra.

COMO JOGAR
O computador sorteia uma senha de 1 a 50 para cada fase.
Você tem 7 tentativas válidas para descobrir esse número.
- Clique em INSPECIONAR O DISCO para girar a roda ampliada.
- A posição sob a seta é exatamente a que aparece no visor.
- Clique em USAR ESTE NÚMERO para preencher o campo do painel.
- Pressione TENTAR ABRIR (ou Enter) para conferir a senha.
- O jogo avisa: A senha é maior! ou A senha é menor!
- O REGISTRO DE TENTATIVAS mostra palpites anteriores e faixa possível.
- Números inválidos não gastam tentativas; repetir um palpite válido gasta.
- Ao acertar, o cofre abre, toca um som e surge COFRE DESBLOQUEADO!
- Depois da vitória, você pode ir à próxima fase.
- Se errar 7 vezes, aparece ACESSO NEGADO e o botão para reiniciar.

CONTROLES DA INSPEÇÃO
Mouse ou toque: arraste o disco para girar e solte para encaixar.
Scroll: move uma posição por vez.
A / seta esquerda: gira fisicamente para a esquerda (número aumenta).
D / seta direita: gira fisicamente para a direita (número diminui).
Esc: fecha a inspeção.
Atenção: girar o disco não consome nenhuma tentativa.

AS TRÊS FASES
1. Sala de Espera (Waiting Room), R.P.D., 2º andar.
2. West Office, R.P.D., 1º andar.
3. Treatment Pool Room, esgotos.
Os cenários são artes originais inspiradas em RE2, não capturas do jogo.
As combinações do RE2 aparecem no ARQUIVO R.P.D. apenas como referências.
A senha do minijogo continua aleatória de 1 a 50 em todas as fases.

O QUE MELHOROU NESTA EDIÇÃO
1. Registro opcional de tentativas, com palpites e pistas sem spoiler.
   A faixa provável diminui conforme você recebe as pistas.
2. Vitória mais cinematográfica: mecanismo, efeito sonoro de ferrolho,
   cofre aberto e só depois a caixa de sucesso.
3. Inspeção mais precisa, com setas e instruções que descrevem o giro real.
4. Arquivo R.P.D. recolhível, interface mais limpa e contador/pistas
   visíveis mais cedo no celular.
5. Programação separada para facilitar a leitura e os testes.

ORGANIZAÇÃO DOS ARQUIVOS
index.html     Estrutura da tela, formulário, menus e modais.
style.css      Identidade visual original do jogo.
polimento.css  Ajustes finais de interface, histórico e responsividade.
regras.js      Sorteio, validação, dicas e cálculo da faixa (puro JS).
script.js      Fases, tentativas, disco, vitória e controles.
chuva.js       Animação original de chuva da tela inicial em Canvas.
imagens/       Cenários, disco em inspeção e fotografias de referência.
sons/          Efeitos locais, incluindo o som novo do ferrolho.
testes/        Testes das funções da atividade (sem dependências).

COMO EXPLICAR O CÓDIGO AO PROFESSOR
- O sorteio está em regras.js > sortearSenha():
  Math.floor(Math.random() * 50) + 1 (equivalente à fórmula usada).
- A validação está em regras.js > validarPalpite().
- A pista de maior/menor está em regras.js > comparar().
- O contador e as 7 tentativas ficam em script.js > tentarAbrir().
- O resultado final e o modal ficam em script.js > encerrarPartida()
  e mostrarFinal().
- Os botões de reiniciar e avançar ficam em script.js > reiniciarFaseAtual()
  e proximaFase().
- Inspecionar o disco usa CSS/JavaScript, mas NÃO substitui o input
  e o botão numérico exigidos na atividade.

TESTES
O projeto foi verificado no Chromium com telas de computador e celular.
Testados: validação, mensagens, 7 tentativas, avisos das 2 últimas,
histórico, derrota, reinício, vitória na 7ª tentativa, 3 fases e
alinhamento do disco em todas as 50 posições.
Para repetir os testes de regras, quem tiver Node.js instalado pode usar:
  node testes/regras.test.js
Para jogar, Node.js NÃO é necessário.

DICA
Mantenha a estrutura de pastas do ZIP ao abrir o index.html.
Não renomeie arquivos dentro de imagens/ e sons/ sem alterar os caminhos
referentes no HTML, CSS e JavaScript.
