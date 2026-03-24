
'use strict';

function initKeyboard(searchInput, clearSearchFn) {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            clearSearchFn();
            searchInput.blur();
        }
    });
}
