/* ═══════════════════════════════════════════════
   NEXUS — AI Directory · main.js
   Orquestração Principal e Inicialização
   ═══════════════════════════════════════════════ */

'use strict';

// ─── UTILIDADES ───────────────────────────────────────
function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// ─── INICIALIZAÇÃO ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const kbdHint = document.getElementById('kbdHint');
    const filtersContainer = document.getElementById('filtersContainer');

    // Iniciar tema
    initTheme();

    // Ativar botão TUDO por padrão
    const tudoBtn = document.querySelector('[data-filter="TUDO"]');
    if (tudoBtn) tudoBtn.classList.add('active');

    // Iniciar atalhos de teclado
    initKeyboard(searchInput, () => clearSearch(showWelcome));

    const debouncedSearch = debounce(() => {
        currentQuery = window.SecurityModule.sanitizeInput(searchInput.value);
        const hasVal = currentQuery.trim() !== '';
        clearBtn.classList.toggle('visible', hasVal);
        kbdHint.style.display = hasVal ? 'none' : '';
        filterDB(showWelcome, renderResults);
    }, 150);

    searchInput.addEventListener('input', debouncedSearch);

    // Delegação de clique nos filtros
    filtersContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        setFilter(btn.dataset.filter, filterDB, showWelcome, renderResults);
    });

    // Evento de limpeza de busca
    clearBtn.addEventListener('click', () => clearSearch(showWelcome));

    // Quick search pills
    document.addEventListener('click', (e) => {
        const pill = e.target.closest('.quick-search-pill');
        if (!pill) return;
        const searchTerm = window.SecurityModule.sanitizeInput(pill.dataset.search);
        searchInput.value = searchTerm;
        currentQuery = searchTerm;
        clearBtn.classList.add('visible');
        kbdHint.style.display = 'none';
        filterDB(showWelcome, renderResults);
        searchInput.focus();
    });

    // Mostrar welcome inicial
    showWelcome();
});
