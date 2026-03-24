/* ═══════════════════════════════════════════════
   NEXUS — AI Directory · theme.js
   Gerenciamento de Tema Claro/Escuro
   ═══════════════════════════════════════════════ */

'use strict';

function initTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Aplicar tema salvo
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    } else {
        document.body.classList.remove('light');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    }

    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = isLight ? '<i class="fas fa-moon"></i> Modo Escuro' : '<i class="fas fa-sun"></i> Modo Claro';
    });
}
