let dadosTreinos = JSON.parse(localStorage.getItem('dadosTreinos')) || { A: [], B: [], C: [], D: [], E: [] };
let biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || { "Geral": ["Flexão"] };
let historico = JSON.parse(localStorage.getItem('historico')) || {};

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'dia') carregarTreinoDia();
    if(id === 'biblioteca') renderizarBiblioteca();
    if(id === 'calendario') montarCalendario();
}

function mudarLayout(l) {
    document.body.classList.remove('layout-cards', 'layout-list', 'layout-glass');
    document.body.classList.add(l);
    localStorage.setItem('cfg_layout', l);
}

function mudarFonte(f) {
    document.body.classList.remove('font-modern', 'font-sport', 'font-tech');
    document.body.classList.add(f);
    localStorage.setItem('cfg_fonte', f);
}

function aplicarTemaManual() {
    const dest = document.getElementById('cor-destaque').value;
    const fund = document.getElementById('cor-fundo').value;
    const r = document.documentElement.style;
    r.setProperty('--accent-color', dest);
    r.setProperty('--bg-color', fund);
    localStorage.setItem('cfg_destaque', dest);
    localStorage.setItem('cfg_fundo', fund);
}

function atualizarCorTreino(l, c) {
    document.documentElement.style.setProperty(`--color-${l}`, c);
    let cores = JSON.parse(localStorage.getItem('cfg_cores_cal')) || {};
    cores[l] = c;
    localStorage.setItem('cfg_cores_cal', JSON.stringify(cores));
}

function montarCalendario() {
    let grade = document.getElementById('calendario-grade'); grade.innerHTML = '';
    let hoje = new Date();
    document.getElementById('mes-atual').innerText = hoje.toLocaleDateString('pt-BR', {month:'long'});
    let dMes = new Date(hoje.getFullYear(), hoje.getMonth()+1, 0).getDate();
    for(let d=1; d<=dMes; d++) {
        let k = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        let t = historico[k];
        grade.innerHTML += `<div class="calendar-day" style="border:2px solid ${t ? 'var(--color-'+t+')' : '#333'}">${d}</div>`;
    }
}

// Lógica de Treino (Sequência Circular)
function carregarTreinoDia() {
    let idx = parseInt(localStorage.getItem('idx_treino') || 0);
    let l = "ABCDE"[idx];
    document.getElementById('treino-atual-letra').innerText = l;
    let lista = document.getElementById('lista-dia'); lista.innerHTML = '';
    dadosTreinos[l].filter(e => e.nome).forEach(ex => {
        lista.innerHTML += `<div class="lista-item"><strong>${ex.nome}</strong> - ${ex.peso}kg <input type="checkbox" onchange="finalizar()"></div>`;
    });
}

function finalizar() {
    if(!confirm("Concluir treino?")) return;
    let h = new Date().toISOString().split('T')[0];
    let idx = parseInt(localStorage.getItem('idx_treino') || 0);
    historico[h] = "ABCDE"[idx];
    localStorage.setItem('historico', JSON.stringify(historico));
    localStorage.setItem('idx_treino', (idx + 1) % 5); // Volta ao início após o E
    showScreen('dia');
}

window.onload = () => {
    if(localStorage.getItem('cfg_layout')) mudarLayout(localStorage.getItem('cfg_layout'));
    if(localStorage.getItem('cfg_fonte')) mudarFonte(localStorage.getItem('cfg_fonte'));
    const cores = JSON.parse(localStorage.getItem('cfg_cores_cal')) || {};
    Object.keys(cores).forEach(l => atualizarCorTreino(l, cores[l]));
    showScreen('dia');
};
