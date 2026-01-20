// ================== CONFIGURAÇÕES E CICLO ==================
const TREINOS = ['A', 'B', 'C', 'D', 'E'];

// Funções de Persistência
const salvar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));
const carregar = (chave, padrao) => {
  const dado = localStorage.getItem(chave);
  return dado ? JSON.parse(dado) : padrao;
};

// Inicialização de Dados
const treinoVazio = () => Array.from({ length: 10 }, () => ({ nome: '', serie: '', repeticao: '', peso: '', feito: false }));
let dadosTreinos = carregar('dadosTreinos', { A: treinoVazio(), B: treinoVazio(), C: treinoVazio(), D: treinoVazio(), E: treinoVazio() });
let indiceTreinoAtual = carregar('indiceTreinoAtual', 0);
let historico = carregar('historico', {});

// Função para mostrar telas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if(screenId === 'dia') carregarTreinoDia();
    if(screenId === 'calendario') montarCalendario();
}

// Lógica de Quantidade de Treinos
function salvarConfig() {
    const qtd = document.getElementById('select-qtd').value;
    localStorage.setItem('qtd_treinos', qtd);
    aplicarQuantidade(qtd);
}

function aplicarQuantidade(qtd) {
    TREINOS.forEach((letra, index) => {
        const btn = document.getElementById(`btn-${letra}`);
        if (btn) btn.style.display = (index < qtd) ? 'inline-block' : 'none';
    });
    // Se o índice atual ficou fora do novo limite, reseta para o A (0)
    if (indiceTreinoAtual >= qtd) {
        indiceTreinoAtual = 0;
        salvar('indiceTreinoAtual', 0);
    }
}

// ================== GERENCIAMENTO DE TREINOS ==================
function openTreino(letra) {
  const container = document.getElementById('treino-container');
  container.innerHTML = `<h3>Treino ${letra}</h3>`;
  dadosTreinos[letra].forEach((ex, i) => {
    container.innerHTML += `
      <div style="margin-bottom:8px">
        <input placeholder="Exercicio" value="${ex.nome}" oninput="atualizar('${letra}',${i},'nome',this.value)">
        <input placeholder="S" value="${ex.serie}" style="width:30px" oninput="atualizar('${letra}',${i},'serie',this.value)">
        <input placeholder="R" value="${ex.repeticao}" style="width:30px" oninput="atualizar('${letra}',${i},'repeticao',this.value)">
        <input placeholder="Kg" value="${ex.peso}" style="width:40px" oninput="atualizar('${letra}',${i},'peso',this.value)">
      </div>`;
  });
}

function atualizar(letra, i, campo, valor) {
  dadosTreinos[letra][i][campo] = valor;
  salvar('dadosTreinos', dadosTreinos);
}

// ================== TREINO DO DIA E REINÍCIO ==================
function carregarTreinoDia() {
  const qtdAtual = carregar('qtd_treinos', 5);
  const letra = TREINOS[indiceTreinoAtual];
  document.getElementById('treino-atual').innerText = letra;

  const lista = document.getElementById('lista-dia');
  lista.innerHTML = '';
  let feitos = 0, validos = 0;

  dadosTreinos[letra].forEach((ex, i) => {
    if (ex.nome.trim() !== '') {
      validos++;
      if (ex.feito) feitos++;
      lista.innerHTML += `
        <label style="display:block; margin:10px 0;">
          <input type="checkbox" ${ex.feito ? 'checked' : ''} onchange="concluirExercicio('${letra}',${i},this.checked)">
          ${ex.nome} (${ex.serie}x${ex.repeticao} - ${ex.peso})
        </label>`;
    }
  });

  let percentual = validos === 0 ? 0 : Math.round((feitos / validos) * 100);
  document.getElementById('progresso-dia').value = percentual;
  document.getElementById('percentual').innerText = percentual + '%';

  if (percentual === 100 && validos > 0) finalizarTreino(letra, qtdAtual);
}

function concluirExercicio(letra, i, status) {
  dadosTreinos[letra][i].feito = status;
  salvar('dadosTreinos', dadosTreinos);
  carregarTreinoDia();
}

function finalizarTreino(letra, qtd) {
  const status = document.getElementById('status-final');
  status.style.display = 'block';
  status.innerText = 'TREINO CONCLUÍDO!';

  const hoje = new Date().toLocaleDateString();
  historico[hoje] = letra;
  salvar('historico', historico);

  // REGRA PERSONALIZADA: Volta ao início (A) após o limite escolhido
  indiceTreinoAtual = (indiceTreinoAtual + 1) % qtd;
  salvar('indiceTreinoAtual', indiceTreinoAtual);

  setTimeout(() => {
    status.style.display = 'none';
    dadosTreinos[letra].forEach(ex => ex.feito = false);
    salvar('dadosTreinos', dadosTreinos);
    carregarTreinoDia();
  }, 1500);
}

function montarCalendario() {
  const cont = document.getElementById('calendario-container');
  cont.innerHTML = '';
  Object.keys(historico).forEach(data => {
    cont.innerHTML += `<p>${data} → Treino ${historico[data]}</p>`;
  });
  document.getElementById('total-treinos').innerText = Object.keys(historico).length;
}

// Inicialização
window.onload = () => {
    const salva = carregar('qtd_treinos', 5);
    const select = document.getElementById('select-qtd');
    if(select) select.value = salva;
    aplicarQuantidade(salva);
    carregarTreinoDia();
};
