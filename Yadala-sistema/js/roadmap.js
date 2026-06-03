/* ============================================
   YADALA SISTEMA — Roadmap JS
   Persistencia, progreso, interacción
   ============================================ */

const STORAGE_KEY = 'yadala_roadmap_v1';

// Estado inicial
let state = {
  tasks: {},
  lastUpdated: null
};

// Cargar estado guardado
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = JSON.parse(saved);
    }
  } catch (e) {
    console.log('Estado nuevo iniciado');
  }
}

// Guardar estado
function saveState() {
  state.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Toggle tarea
function toggleTask(taskId) {
  state.tasks[taskId] = !state.tasks[taskId];
  saveState();
  renderTask(taskId);
  updateAllProgress();
}

// Renderizar estado visual de una tarea
function renderTask(taskId) {
  const item = document.querySelector(`[data-task="${taskId}"]`);
  if (!item) return;

  const check = item.querySelector('.task-check');
  const name = item.querySelector('.task-name');
  const done = state.tasks[taskId];

  check.classList.toggle('done', done);
  name.classList.toggle('done', done);
}

// Toggle bloque abierto/cerrado
function toggleBlock(blockId) {
  const body = document.getElementById(`body-${blockId}`);
  const chev = document.getElementById(`chev-${blockId}`);
  const isOpen = body.classList.toggle('open');
  chev.textContent = isOpen ? '▲' : '▼';
}

// Actualizar progreso de todos los bloques
function updateAllProgress() {
  const blocks = document.querySelectorAll('[data-block]');
  const blockIds = [...new Set([...blocks].map(b => b.dataset.block))];

  let totalDone = 0;
  let totalAll = 0;

  blockIds.forEach(blockId => {
    const blockTasks = document.querySelectorAll(`[data-task][data-block="${blockId}"]`);
    let done = 0;
    blockTasks.forEach(t => {
      if (state.tasks[t.dataset.task]) done++;
    });

    totalDone += done;
    totalAll += blockTasks.length;

    const pct = blockTasks.length ? Math.round((done / blockTasks.length) * 100) : 0;
    const bar = document.getElementById(`bar-${blockId}`);
    const pctEl = document.getElementById(`pct-${blockId}`);
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
  });

  // Global
  const globalPct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;
  const globalBar = document.getElementById('global-bar');
  const globalPctEl = document.getElementById('pct-global');
  const doneEl = document.getElementById('done-count');
  const totalEl = document.getElementById('total-count');

  if (globalBar) globalBar.style.width = globalPct + '%';
  if (globalPctEl) globalPctEl.textContent = globalPct + '%';
  if (doneEl) doneEl.textContent = totalDone;
  if (totalEl) totalEl.textContent = totalAll;
}

// Resetear todo
function resetAll() {
  if (confirm('¿Resetear todo el progreso?')) {
    state = { tasks: {}, lastUpdated: null };
    saveState();
    location.reload();
  }
}

// Exportar progreso como texto
function exportProgress() {
  const tasks = document.querySelectorAll('[data-task]');
  let output = '# Yadala Roadmap — Progreso\n';
  output += `Fecha: ${new Date().toLocaleDateString('es-ES')}\n\n`;

  let currentBlock = '';
  tasks.forEach(t => {
    const block = t.dataset.block;
    if (block !== currentBlock) {
      output += `\n## Bloque ${block}\n`;
      currentBlock = block;
    }
    const done = state.tasks[t.dataset.task] ? '✅' : '⬜';
    const name = t.querySelector('.task-name').textContent;
    output += `${done} ${name}\n`;
  });

  const blob = new Blob([output], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `yadala-progreso-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Renderizar estado de todas las tareas
  document.querySelectorAll('[data-task]').forEach(item => {
    renderTask(item.dataset.task);
  });

  updateAllProgress();

  // Abrir bloque 1 por defecto
  const body0 = document.getElementById('body-B1');
  const chev0 = document.getElementById('chev-B1');
  if (body0) {
    body0.classList.add('open');
    if (chev0) chev0.textContent = '▲';
  }
});