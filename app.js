const TREINOS = ['A', 'B', 'C', 'D', 'E'];
const TEMAS = {
    industrial: { accent: '#ff8c00', bg: '#0a0e14', card: '#161b22', text: '#e0e0e0' },
    neon: { accent: '#39FF14', bg: '#000000', card: '#111111', text: '#ffffff' },
    royal: { accent: '#d4af37', bg: '#2c0000', card: '#3d0000', text: '#f5f5f5' }
};

const salvar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));
const carregar = (chave, padrao) => {
    const dado = localStorage.getItem(chave);
    return dado ? JSON.parse(dado) : padrao;
};

const treinoVazio = () => Array.from({ length: 10 }, () => ({ nome: '', serie: '', repeticao: '', peso: '', feito: false }));
let dadosTreinos = carregar('dadosTreinos', { A: treinoVazio(), B: treinoVazio(), C: treinoVazio(), D: treinoVazio(), E: treinoVazio() });
let indiceTreinoAtual = carregar('indiceTreinoAtual', 0);
let historico = carregar('historico', {});
let dataVisualizacao = new Date();

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if(screenId === 'dia') carregarTreinoDia();
    if(screenId === 'calendario') montarCalendario();
}

// --- LÓGICA DE TEMAS ---
function mudarTema(nome) {
    const customDiv = document.getElementById('custom-colors');
    if (nome === 'custom') {
        customDiv.style.display = 'block';
        const c = carregar('tema_custom', { accent: '#ff8c00', bg: '#0a0e14' });
        aplicarVariaveis(c.accent, c.bg, '#1a1a1a', '#ffffff');
    } else {
        if(customDiv) customDiv.style.display = 'none';
        const t = TEMAS[nome];
        aplicarVariaveis(t.accent, t.bg, t.card, t.text);
    }
    salvar('tema_escolhido', nome);
}

function aplicarCorManual() {
    const accent = document.getElementById('color-accent').value;
    const bg = document.getElementById('color-bg').value;
    aplicarVariaveis(accent, bg, '#1a1a1a', '#ffffff');
    salvar('tema_custom', { accent, bg });
}

function aplicarVariaveis(accent, bg, card, text) {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', accent);
    root.style.setProperty('--bg-color', bg);
    root.style.setProperty('--card-bg', card);
    root.style.setProperty('--text-color', text);
}

// --- RESTANTE DAS FUNÇÕES ---
function salvarConfig() {
    const qtd = document.getElementById('select-qtd').value;
    salvar('qtd_treinos', qtd);
    aplicarQuantidade(qtd);
}

function aplicarQuantidade(qtd) {
    TREINOS.forEach((letra, index) => {
        const btn = document.getElementById(`btn-${letra}`);
        if (btn) btn.style.display = (index < qtd) ? 'inline-block' : 'none';
    });
}

function openTreino(letra) {
  const container = document.getElementById('treino-container');
  container.innerHTML = `<h3>Treino ${letra}</h3>`;
  dadosTreinos[letra].forEach((ex, i) => {
    container.innerHTML += `
      <div style="margin-bottom:8px">
        <input placeholder="Exercicio" value="${ex.nome}" oninput="atualizar('${letra}',${i},'nome',this.value)">
        <input placeholder="S" value="${ex.serie}" oninput="atualizar('${letra}',${i},'serie',this.value)">
        <input placeholder="R" value="${ex.repeticao}" oninput="atualizar('${letra}',${i},'repeticao',this.value)">
        <input placeholder="Kg" value="${ex.peso}" oninput="atualizar('${letra}',${i},'peso',this.value)">
      </div>`;
  });
}

function atualizar(letra, i, campo, valor) {
  dadosTreinos[letra][i][campo] = valor;
  salvar('dadosTreinos', dadosTreinos);
}

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
        <label style="display:block; margin:10px 0; background:var(--card-bg); padding:10px; border-radius:8px;">
          <input type="checkbox" style="width:20px" ${ex.feito ? 'checked' : ''} onchange="concluirExercicio('${letra}',${i},this.checked)">
          ${ex.nome} (${ex.serie}x${ex.repeticao} - ${ex.peso}kg)
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
  status.style.display = 'block'; status.innerText = 'TREINO CONCLUÍDO!';
  const agora = new Date();
  const hoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
  historico[hoje] = letra;
  salvar('historico', historico);
  indiceTreinoAtual = (indiceTreinoAtual + 1) % qtd;
  salvar('indiceTreinoAtual', indiceTreinoAtual);
  setTimeout(() => {
    status.style.display = 'none';
    dadosTreinos[letra].forEach(ex => ex.feito = false);
    salvar('dadosTreinos', dadosTreinos);
    carregarTreinoDia();
  }, 1500);
}

function mudarMes(direcao) {
    dataVisualizacao.setMonth(dataVisualizacao.getMonth() + direcao);
    montarCalendario();
}

function montarCalendario() {
    const grade = document.getElementById('calendario-grade');
    const labelMes = document.getElementById('mes-atual');
    if(!grade) return;
    grade.innerHTML = '';
    const ano = dataVisualizacao.getFullYear();
    const mes = dataVisualizacao.getMonth();
    labelMes.innerText = dataVisualizacao.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const pDia = new Date(ano, mes, 1).getDay();
    const dMes = new Date(ano, mes + 1, 0).getDate();
    const conts = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    for (let i = 0; i < pDia; i++) grade.innerHTML += `<div></div>`;
    for (let dia = 1; dia <= dMes; dia++) {
        const dk = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const t = historico[dk] || "";
        if (t && conts[t] !== undefined) conts[t]++;
        grade.innerHTML += `<div class="calendar-day ${t?'has-training':''}" onclick="editarDia('${dk}')"><span>${dia}</span><small>${t}</small></div>`;
    }
    document.getElementById('total-treinos').innerText = Object.keys(historico).length;
    TREINOS.forEach(l => { const el = document.getElementById(`count-${l}`); if(el) el.innerText = conts[l]; });
}

function editarDia(data) {
    const n = prompt(`Treino para ${data}:`, historico[data] || "");
    if (n !== null) {
        const valor = n.toUpperCase().trim();
        if (valor === "") delete historico[data];
        else historico[data] = valor;
        salvar('historico', historico);
        montarCalendario();
    }
}

function resetarMes() {
    if (confirm("Resetar este mês?")) {
        const pref = `${dataVisualizacao.getFullYear()}-${String(dataVisualizacao.getMonth() + 1).padStart(2, '0')}`;
        Object.keys(historico).forEach(d => { if(d.startsWith(pref)) delete historico[d]; });
        salvar('historico', historico);
        montarCalendario();
    }
}

window.onload = () => {
    const q = carregar('qtd_treinos', 5);
    if(document.getElementById('select-qtd')) document.getElementById('select-qtd').value = q;
    aplicarQuantidade(q);
    
    // Carregar Tema
    const tSalvo = carregar('tema_escolhido', 'industrial');
    mudarTema(tSalvo);
    if(document.getElementById('select-tema')) document.getElementById('select-tema').value = tSalvo;

    showScreen('dia');
};
