/* ═══════════════════════════════════════════════
   NEXUS — AI Directory · ui.js
   Renderização de Resultados e Estados
   ═══════════════════════════════════════════════ */

'use strict';

const catColors = {
    TEXTO: '#5ab4f5',
    IMAGEM: '#b45af5',
    'VÍDEO': '#f5a45a',
    'ÁUDIO': '#5af5d8',
    'CÓDIGO': '#c8f55a',
    DESIGN: '#f55ab4',
    'APRESENTAÇÃO': '#e2ba09',
    'AUTOMAÇÃO': '#f55a5a',
    'NEGÓCIOS': '#a0f55a',
    'EDUCAÇÃO': '#5a7cf5',
};

function renderResults(tools) {
    const resultsGrid = document.getElementById('resultsGrid');
    
    // Usar DocumentFragment para evitar múltiplos reflows
    const fragment = document.createDocumentFragment();
    
    tools.forEach((tool, i) => {
        const delay = Math.min(i * 0.04, 0.6).toFixed(2);
        const catColor = catColors[tool.category] || '#888';
        const tagsArray = tool.tags ? tool.tags.split(' ').slice(0, 2) : [];
        const row = document.createElement('a');
        row.href = tool.url;
        row.target = '_blank';
        row.rel = 'noopener noreferrer';
        row.className = 'tool-row';
        row.style.animationDelay = delay + 's';
        row.innerHTML = `
      <div class="tool-left">
        <div class="tool-badges">
          <span class="badge badge-category"
            style="color:${catColor};border-color:${catColor}33;background:${catColor}10">
            ${tool.category}
          </span>
          <span class="badge badge-${tool.pricing}">${tool.pricing}</span>
        </div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.desc}</div>
          ${tagsArray.length > 0 ? `<div class="tool-tags">${tagsArray.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
      </div>
      <div class="tool-right">
        <span class="arrow">↗</span>
      </div>`;
        fragment.appendChild(row);
    });
    
    // Limpar e adicionar todos os elementos de uma vez
    resultsGrid.innerHTML = '';
    resultsGrid.appendChild(fragment);
}

function showWelcome() {
    const welcomeState = document.getElementById('welcomeState');
    const emptyState = document.getElementById('emptyState');
    const resultsHeader = document.getElementById('resultsHeader');
    const resultsGrid = document.getElementById('resultsGrid');

    welcomeState.classList.remove('hidden');
    emptyState.classList.remove('visible');
    resultsHeader.classList.remove('visible');
    resultsGrid.innerHTML = '';

    // Mostrar categorias populares
    showPopularCategories();
}

function showPopularCategories() {
    const categorySuggestions = document.getElementById('categorySuggestions');
    if (!categorySuggestions) return;

    // Contar ferramentas por categoria dinamicamente
    const categCount = {};
    aiDatabase.forEach(tool => {
        categCount[tool.category] = (categCount[tool.category] || 0) + 1;
    });

    // Categorias com ícones FontAwesome, ordenadas por quantidade
    const allCategories = [
        { name: 'TEXTO', icon: '<i class="fas fa-pen-fancy"></i>' },
        { name: 'IMAGEM', icon: '<i class="fas fa-image"></i>' },
        { name: 'CÓDIGO', icon: '<i class="fas fa-code"></i>' },
        { name: 'VÍDEO', icon: '<i class="fas fa-film"></i>' },
        { name: 'ÁUDIO', icon: '<i class="fas fa-volume-high"></i>' },
        { name: 'DESIGN', icon: '<i class="fas fa-palette"></i>' },
        { name: 'AUTOMAÇÃO', icon: '<i class="fas fa-cogs"></i>' },
        { name: 'EDUCAÇÃO', icon: '<i class="fas fa-graduation-cap"></i>' },
    ];

    // Mostrar apenas as com mais ferramentas (top 8)
    const topCategories = allCategories
        .filter(cat => categCount[cat.name])
        .map(cat => ({ ...cat, count: categCount[cat.name] }));

    categorySuggestions.innerHTML = topCategories.map(cat => `
        <button class="category-card" data-filter="${cat.name}">
            <div class="category-icon">${cat.icon}</div>
            <div class="category-name">${cat.name}</div>
            <div class="category-count">${cat.count}+ ferramentas</div>
        </button>
    `).join('');

    // Bindar cliques nas categorias
    categorySuggestions.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const filterName = card.dataset.filter;
            setFilter(filterName, filterDB, showWelcome, renderResults);
            // Highlight do filtro no topo
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filterName);
            });
        });
    });
}
