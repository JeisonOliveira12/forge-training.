const ICONS = ["🏋️", "💪", "🏃", "🔥", "🎯", "⚡"];
let dadosTreinos = JSON.parse(localStorage.getItem('dadosTreinos')) || { A: [], B: [], C: [], D: [], E: [] };
let biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || { "Peito": ["Supino"], "Pernas": ["Agachamento"] };
let historico = JSON.parse(localStorage.getItem('historico')) || {};
let tempoInicioSessao = Date.now();

// Navegação
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'dia') carregarTreinoDia();
    if(id === 'biblioteca') renderizarBiblioteca();
}

// Biblioteca
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
        c.innerHTML += `<div class="grupo-container"><div class="grupo-titulo">${g} <button onclick="adicionarExercicioGrupo('${g}')">+</button></div>
        ${biblioteca[g].map(e => `<div>${e}</div>`).join('')}</div>`;
    }
}
function salvarBib() { localStorage.setItem('biblioteca', JSON.stringify(biblioteca)); }

// Edição de Treinos com Biblioteca
function openTreino(l) {
    let cont = document.getElementById('treino-container');
    if(!dadosTreinos[l].length) dadosTreinos[l] = Array.from({length:5}, () => ({icon:"🏋️", nome:"", serie:"", rep:"", peso:"", feito:false}));
    
    let opcoes = `<option value="">-- Selecione --</option>`;
    for(let g in biblioteca) {
        opcoes += `<optgroup label="${g}">${biblioteca[g].map(e => `<option value="${e}">${e}</option>`).join('')}</optgroup>`;
    }

    cont.innerHTML = `<h3>Treino ${l}</h3>`;
    dadosTreinos[l].forEach((ex, i) => {
        cont.innerHTML += `<div class="lista-item">
            <select onchange="atualizar('${l}',${i},'icon',this.value)">${ICONS.map(ic => `<option ${ex.icon==ic?'selected':''}>${ic}</option>`).join('')}</select>
            <select onchange="atualizar('${l}',${i},'nome',this.value)"><option>${ex.nome || 'Exercício'}</option>${opcoes}</select>
            <input placeholder="Kg" value="${ex.peso}" oninput="atualizar('${l}',${i},'peso',this.value)" style="width:40px">
        </div>`;
    });
}
function atualizar(l, i, f, v) { dadosTreinos[l][i][f] = v; localStorage.setItem('dadosTreinos', JSON.stringify(dadosTreinos)); }

// Lógica de hoje e Calendário
function carregarTreinoDia() {
    let l = "ABCDE"[parseInt(localStorage.getItem('idx') || 0)];
    document.getElementById('treino-atual-letra').innerText = l;
    let lista = document.getElementById('lista-dia'); lista.innerHTML = '';
    dadosTreinos[l].filter(e => e.nome).forEach((ex, i) => {
        lista.innerHTML += `<div class="lista-item"><span>${ex.icon}</span> ${ex.nome} <input type="checkbox" onchange="finalizar('${l}')"></div>`;
    });
}

function finalizar(l) {
    let h = new Date().toISOString().split('T')[0]; historico[h] = l;
    localStorage.setItem('historico', JSON.stringify(historico));
    localStorage.setItem('idx', (parseInt(localStorage.getItem('idx') || 0) + 1) % 5);
    alert("Treino Concluído!");
}

// Configurações
function mudarLayout(l) { document.body.className = document.body.className.replace(/layout-\w+/g, '') + ' ' + l; }
function mudarFonte(f) { document.body.className = document.body.className.replace(/font-\w+/g, '') + ' ' + f; }
function atualizarCorTreino(l, c) { document.documentElement.style.setProperty(`--color-${l}`, c); }
function toggleDescanso(v) { document.getElementById('timer-descanso-ui').style.display = v?'block':'none'; }

// Cronômetro Sessão
setInterval(() => {
    let d = new Date(Date.now() - tempoInicioSessao);
    document.getElementById('header-timer').innerText = d.getUTCHours().toString().padStart(2,'0')+":"+d.getUTCMinutes().toString().padStart(2,'0')+":"+d.getUTCSeconds().toString().padStart(2,'0');
}, 1000);

window.onload = () => showScreen('dia');
