// ================== CONTROLE DE TELAS ==================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

// ================== DADOS BASE ==================
const TREINOS = ['A', 'B', 'C', 'D', 'E'];
let quantidadeTreinos = 3; // pode ser 2 a 5

function treinoVazio() {
  return Array.from({ length: 10 }, () => ({
    nome: '',
    serie: '',
    repeticao: '',
    peso: '',
    feito: false
  }));
}

// ================== STORAGE ==================
function salvar(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function carregar(key, padrao) {
  return JSON.parse(localStorage.getItem(key)) || padrao;
}

let dadosTreinos = carregar('dadosTreinos', {
  A: treinoVazio(),
  B: treinoVazio(),
  C: treinoVazio(),
  D: treinoVazio(),
  E: treinoVazio()
});

let indiceTreinoAtual = carregar('indiceTreinoAtual', 0);
let historico = carregar('historico', {});

// ================== TREINOS ==================
function openTreino(letra) {
  const container = document.getElementById('treino-container');
  container.innerHTML = `<h3>Treino ${letra}</h3>`;

  dadosTreinos[letra].forEach((ex, i) => {
    container.innerHTML += `
      <div style="margin-bottom:8px">
        <input placeholder="Exercício" value="${ex.nome}"
          oninput="atualizar('${letra}',${i},'nome',this.value)">
        <input placeholder="Série" value="${ex.serie}"
          oninput="atualizar('${letra}',${i},'serie',this.value)">
        <input placeholder="Reps" value="${ex.repeticao}"
          oninput="atualizar('${letra}',${i},'repeticao',this.value)">
        <input placeholder="Peso" value="${ex.peso}"
          oninput="atualizar('${letra}',${i},'peso',this.value)">
      </div>
    `;
  });
}

function atualizar(letra, i, campo, valor) {
  dadosTreinos[letra][i][campo] = valor;
  salvar('dadosTreinos', dadosTreinos);
}

// ================== TREINO DO DIA ==================
function carregarTreinoDia() {
  const letra = TREINOS[indiceTreinoAtual];
  document.getElementById('treino-atual').innerText = letra;

  const lista = document.getElementById('lista-dia');
  lista.innerHTML = '';

  const treino = dadosTreinos[letra];
  let feitos = 0;
  let validos = 0;

  treino.forEach((ex, i) => {
    if (ex.nome.trim() !== '') {
      validos++;
      if (ex.feito) feitos++;

      lista.innerHTML += `
        <label>
          <input type="checkbox" ${ex.feito ? 'checked' : ''}
            onchange="concluirExercicio('${letra}',${i},this.checked)">
          ${ex.nome} (${ex.serie}x${ex.repeticao} - ${ex.peso})
        </label><br>
      `;
    }
  });

  let percentual = validos === 0 ? 0 : Math.round((feitos / validos) * 100);
  document.getElementById('progresso-dia').value = percentual;
  document.getElementById('percentual').innerText = percentual + '%';

  if (percentual === 100 && validos > 0) {
    finalizarTreino(letra);
  }
}

function concluirExercicio(letra, i, status) {
  dadosTreinos[letra][i].feito = status;
  salvar('dadosTreinos', dadosTreinos);
  carregarTreinoDia();
}

function finalizarTreino(letra) {
  const status = document.getElementById('status-final');
  status.style.display = 'block';
  status.innerText = 'TREINO CONCLUÍDO';

  const hoje = new Date().toISOString().split('T')[0];
  historico[hoje] = letra;
  salvar('historico', historico);

  indiceTreinoAtual = (indiceTreinoAtual + 1) % quantidadeTreinos;
  salvar('indiceTreinoAtual', indiceTreinoAtual);

  setTimeout(() => {
    status.style.display = 'none';
    dadosTreinos[letra].forEach(ex => ex.feito = false);
    salvar('dadosTreinos', dadosTreinos);
    carregarTreinoDia();
    montarCalendario();
  }, 1200);
}

// ================== CALENDÁRIO ==================
function montarCalendario() {
  const cont = document.getElementById('calendario-container');
  cont.innerHTML = '';

  Object.keys(historico).forEach(data => {
    cont.innerHTML += `<p>${data} → Treino ${historico[data]}</p>`;
  });

  document.getElementById('total-treinos').innerText =
    Object.keys(historico).length;
}

// ================== INICIALIZAÇÃO ==================
showScreen('treinos');
carregarTreinoDia();
montarCalendario();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registrado!', reg))
      .catch(err => console.error('Erro ao registrar Service Worker', err));
  });
}
