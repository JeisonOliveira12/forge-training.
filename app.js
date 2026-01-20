const ICONS = ["🏋️", "💪", "🏃", "🔥", "🎯", "⚡"];
let dadosTreinos = JSON.parse(localStorage.getItem('dadosTreinos')) || { A: [], B: [], C: [], D: [], E: [] };
let biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || { "Geral": ["Flexão", "Abdominal"] };
let historico = JSON.parse(localStorage.getItem('historico')) || {};
let tempoInicioSessao = Date.now();

// FUNÇÃO PARA TROCAR DE TELA
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'dia') carregarTreinoDia();
    if(id === 'biblioteca') renderizarBiblioteca();
    if(id === 'calendario') montarCalendario();
}

// CRONOMETRO FIXO
setInterval(() => {
    let d = new Date(Date.now() - tempoInicioSessao);
    document.getElementById('tempo-total').innerText = 
        String(d.getUTCHours()).padStart(2,'0')+":"+
        String(d.getUTCMinutes()).padStart(2,'0')+":"+
        String(d.getUTCSeconds()).padStart(2,'0');
}, 1000);

// BIBLIOTECA
function adicionarGrupo() {
    let n = document.getElementById('novo-grupo').value;
    if(n) { biblioteca[n] = []; document.getElementById('novo-grupo').value = ''; renderizarBiblioteca(); salvarBib(); }
}
function adicionarExercicioGrupo(g) {
    let ex = prompt("Nome do exercício:");
    if(ex) { biblioteca[g].push(ex); renderizarBiblioteca(); salvarBib(); }
}
function renderizarBiblioteca() {
    let c = document.getElementById('lista-grupos'); c.innerHTML = '';
    for(let g in biblioteca) {
        c.innerHTML += `<div class="grupo-container">
            <div class="grupo-titulo"><strong>${g}</strong> <button onclick="adicionarExercicioGrupo('${g}')">+</button></div>
            ${biblioteca[g].map(e => `<div style="padding:5px; border-bottom:1px solid #444">${e}</div>`).join('')}
        </div>`;
    }
}
function salvarBib() { localStorage.setItem('biblioteca', JSON.stringify(biblioteca)); }

// EDITAR TREINOS
function openTreino(l) {
    let cont = document.getElementById('treino-container');
    if(!dadosTreinos[l].length) dadosTreinos[l] = Array.from({length:5}, () => ({icon:"🏋️", nome:"", peso:"", feito:false}));
    
    let opcoes = `<option value="">-- Selecione da Biblioteca --</option>`;
    for(let g in biblioteca) {
        opcoes += `<optgroup label="${g}">${biblioteca[g].map(e => `<option value="${e}">${e}</option>`).join('')}</optgroup>`;
    }

    cont.innerHTML = `<h3>Editando Treino ${l}</h3>`;
    dadosTreinos[l].forEach((ex, i) => {
        cont.innerHTML += `<div class="lista-item">
            <div style="display:flex; gap:5px; margin-bottom:5px">
                <select onchange="atualizar('${l}',${i},'icon',this.value)" style="width:60px">${ICONS.map(ic => `<option ${ex.icon==ic?'selected':''}>${ic}</option>`).join('')}</select>
                <select onchange="atualizar('${l}',${i},'nome',this.value)"><option>${ex.nome || 'Escolha o exercício'}</option>${opcoes}</select>
            </div>
            <input placeholder="Peso (Kg)" value="${ex.peso}" oninput="atualizar('${l}',${i},'peso',this.value)">
        </div>`;
    });
}
function atualizar(l, i, f, v) { dadosTreinos[l][i][f] = v; localStorage.setItem('dadosTreinos', JSON.stringify(dadosTreinos)); }

function carregarTreinoDia() {
    let l = "ABCDE"[parseInt(localStorage.getItem('idx') || 0)];
    document.getElementById('treino-atual-letra').innerText = l;
    let lista = document.getElementById('lista-dia'); lista.innerHTML = '';
    let validos = dadosTreinos[l].filter(e => e.nome);
    validos.forEach((ex, i) => {
        lista.innerHTML += `<div class="lista-item">
            <span>${ex.icon}</span> <strong>${ex.nome}</strong> - ${ex.peso}kg 
            <input type="checkbox" onchange="marcarConcluido('${l}')">
        </div>`;
    });
}

function marcarConcluido(l) {
    let h = new Date().toISOString().split('T')[0]; historico[h] = l;
    localStorage.setItem('historico', JSON.stringify(historico));
    localStorage.setItem('idx', (parseInt(localStorage.getItem('idx') || 0) + 1) % 5);
    alert("Treino salvo no histórico!");
    showScreen('dia');
}

function montarCalendario() {
    let grade = document.getElementById('calendario-grade'); grade.innerHTML = '';
    let hoje = new Date();
    document.getElementById('mes-atual').innerText = hoje.toLocaleDateString('pt-BR', {month:'long', year:'numeric'});
    let dMes = new Date(hoje.getFullYear(), hoje.getMonth()+1, 0).getDate();
    for(let d=1; d<=dMes; d++) {
        let k = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        let t = historico[k];
        grade.innerHTML += `<div class="calendar-day ${t?'treino-'+t:''}" style="border:1px solid ${t?'var(--color-'+t+')':'#333'}">${d}</div>`;
    }
}

function mudarLayout(l) { document.body.className = document.body.className.replace(/layout-\w+/g, '') + ' ' + l; }
function mudarFonte(f) { document.body.className = document.body.className.replace(/font-\w+/g, '') + ' ' + f; }
function toggleDescanso(v) { document.getElementById('timer-descanso-ui').style.display = v?'block':'none'; document.getElementById('descanso-config').style.display = v?'block':'none'; }

window.onload = () => {
    renderizarBiblioteca();
    showScreen('dia');
};
