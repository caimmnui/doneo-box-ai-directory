/* ═══════════════════════════════════════════════
   DONEO BOX — AI Directory · security.js
   Proteção Avançada contra Clonagem e Inspeção
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    const SecurityModule = {
        // 1. Sanitização de Input (XSS)
        sanitizeInput: (str) => {
            if (!str) return '';
            return str.replace(/[&<>"']/g, m => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            })[m]);
        },

        // 2. Limite de requisições de busca
        searchLimiter: {
            lastSearch: 0,
            isAllowed: function () {
                const now = Date.now();
                if (now - this.lastSearch < 300) return false;
                this.lastSearch = now;
                return true;
            }
        },

        // 3. O "Debugger Loop" - Trava o navegador de quem tentar inspecionar
        antiDebug: () => {
            const start = Date.now();
            // Esta função cria uma pausa se o DevTools estiver aberto
            debugger;
            const end = Date.now();
            if (end - start > 100) {
                // Se demorar mais de 100ms, o DevTools provavelmente está aberto
                window.location.href = "about:blank"; // Redireciona para página em branco
            }
        },

        // 4. Bloqueio de Teclas e Clique Direito
        initProtections: () => {
            // Bloqueia clique direito
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Bloqueia atalhos comuns
            document.addEventListener('keydown', e => {
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
                    (e.ctrlKey && e.key === 'u')
                ) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    };

    // Inicia proteções
    SecurityModule.initProtections();

    // Executa o anti-debugger em intervalos aleatórios
    setInterval(SecurityModule.antiDebug, 2000);

    window.SecurityModule = SecurityModule;
})();