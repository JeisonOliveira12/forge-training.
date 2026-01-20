/* =========================
   VARIÁVEIS GLOBAIS DE TEMA
   ========================= */
:root {
  --bg-color: #0f0f0f;
  --card-color: #1a1a1a;
  --text-color: #eaeaea;
  --muted-text: #9a9a9a;
  --border-color: #333;
  --accent-color: #ff6a00;

  /* cores dos treinos */
  --color-A: #ff6a00;
  --color-B: #00c2ff;
  --color-C: #7dff00;
  --color-D: #ff005c;
  --color-E: #b400ff;
}

/* =========================
   RESET BÁSICO
   ========================= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
}

/* =========================
   HEADER E NAVEGAÇÃO
   ========================= */
header {
  padding: 14px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-color);
}

header h1 {
  font-size: 1.3rem;
  letter-spacing: 1px;
}

nav {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-color);
}

nav button {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  color: var(--muted-text);
  font-weight: bold;
}

nav button:active {
  background: var(--border-color);
  color: var(--text-color);
}

/* =========================
   TELAS
   ========================= */
main {
  padding: 14px;
}

.screen {
  display: none;
}

.screen.active {
  display: block;
}

h2 {
  margin-bottom: 12px;
  font-size: 1.1rem;
  border-left: 4px solid var(--accent-color);
  padding-left: 8px;
}

/* =========================
   CARDS / CAIXAS
   ========================= */
.config-box,
.lista-item,
#treino-container,
#lista-dia,
#calendario-container {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}

/* =========================
   BOTÕES
   ========================= */
.btn-acao {
  background: var(--accent-color);
  border: none;
  color: #000;
  padding: 6px 10px;
  border-radius: 4px;
  font-weight: bold;
}

/* =========================
   TREINO DO DIA
   ========================= */
.lista-item small {
  color: var(--muted-text);
}

/* =========================
   PROGRESSO
   ========================= */
progress {
  width: 100%;
  height: 18px;
}

/* =========================
   CALENDÁRIO
   ========================= */
#calendario-grade {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.calendar-day {
  position: relative;
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  background: var(--bg-color);
}

.calendar-day.has-treino {
  font-weight: bold;
}

/* =========================
   FONTES E LAYOUTS
   ========================= */
.font-modern { font-family: system-ui; }
.font-sport { font-family: Arial, sans-serif; }
.font-tech { font-family: monospace; }

.layout-cards .config-box { border-radius: 10px; }
.layout-list .config-box { border-radius: 0; }
.layout-glass .config-box {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(6px);
}
