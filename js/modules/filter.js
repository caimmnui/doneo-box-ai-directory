

'use strict';

let currentFilter = 'TUDO';
let currentQuery = '';

function filterDB(showWelcomeFn, renderResultsFn) {
    if (!window.SecurityModule.searchLimiter.isAllowed()) {
        return;
    }

    const rawQ = currentQuery.trim().toLowerCase();
    const q = window.SecurityModule.sanitizeInput(rawQ);
    const terms = q ? expandQuery(q) : [];

    const resultsGrid = document.getElementById('resultsGrid');
    const welcomeState = document.getElementById('welcomeState');
    const emptyState = document.getElementById('emptyState');
    const resultsHeader = document.getElementById('resultsHeader');
    const countNum = document.getElementById('countNum');
    const resultsQuery = document.getElementById('resultsQuery');

    if (!q && currentFilter === 'TUDO') {
        showWelcomeFn();
        return;
    }

    welcomeState.style.display = 'none';

    let results = aiDatabase.filter(tool => {
        const catOk = currentFilter === 'TUDO' || tool.category === currentFilter;
        if (!catOk) return false;
        if (!terms.length) return true;
        return scoreMatch(tool, terms) > 0;
    });

    if (terms.length) {
        results.sort((a, b) => scoreMatch(b, terms) - scoreMatch(a, terms));
    }

    countNum.textContent = results.length;
    resultsQuery.textContent = q ? `"${window.SecurityModule.sanitizeInput(q)}"` : '';
    resultsHeader.classList.toggle('visible', true);

    const isEmpty = results.length === 0;
    emptyState.classList.toggle('visible', isEmpty);
    if (isEmpty) { resultsGrid.innerHTML = ''; return; }
    emptyState.classList.remove('visible');

    renderResultsFn(results);
}

function setFilter(cat, filterDB_fn, showWelcomeFn, renderResultsFn) {
    const validCategories = ['TUDO', 'TEXTO', 'IMAGEM', 'VÍDEO', 'ÁUDIO', 'CÓDIGO', 'DESIGN', 'APRESENTAÇÃO', 'AUTOMAÇÃO', 'NEGÓCIOS', 'EDUCAÇÃO'];
    if (!validCategories.includes(cat)) {
        cat = 'TUDO';
    }
    
    currentFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === cat);
    });
    filterDB(showWelcomeFn, renderResultsFn);
}

function clearSearch(showWelcomeFn) {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const kbdHint = document.getElementById('kbdHint');

    searchInput.value = '';
    currentQuery = '';
    currentFilter = 'TUDO';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    clearBtn.classList.remove('visible');
    kbdHint.style.display = '';
    showWelcomeFn();
}
