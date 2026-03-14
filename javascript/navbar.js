// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR.JS — Rocket Sport
// Reutilizable en todas las páginas. Un solo archivo, funciona en todas.
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─── Insertar el HTML del navbar dinámicamente ────────────────────────────
    function buildNavbarHTML() {
        const currentPage = window.location.pathname.split('/').pop() || 'inicio.html';

        const pages = [
            { file: 'inicio.html', label: 'Inicio' },
            { file: 'especificaciones.html', label: 'Especificaciones' },
            { file: 'colores.html', label: 'Colores de Pasto' },
            { file: 'galeria.html', label: 'Galería' },
            { file: 'contacto.html', label: 'Contacto' },
        ];

        // Determinar ruta base relativa al archivo actual
        const isInHtml = window.location.pathname.includes('/html/');
        const basePath = isInHtml ? '' : 'html/';
        const imgBase = isInHtml ? '../imagenes/' : 'imagenes/';

        // Generar links del navbar
        const linksHTML = pages.map(p => {
            const isActive = currentPage === p.file;
            const cls = `rs-nav-link${isActive ? ' rs-nav-link--active' : ''}`;
            return `<li><a href="${basePath}${p.file}" class="${cls}">${p.label}</a></li>`;
        }).join('');

        // Generar links del drawer
        const drawerLinksHTML = pages.map(p => {
            const isActive = currentPage === p.file;
            const cls = `rs-drawer-link${isActive ? ' rs-drawer-link--active' : ''}`;
            return `<a href="${basePath}${p.file}" class="${cls}">${p.label}</a>`;
        }).join('');

        return `
<nav class="rs-navbar" id="rsNavbar" role="navigation" aria-label="Navegación principal">
    <a href="${basePath}inicio.html" class="rs-nav-logo" aria-label="Rocket Sport — Inicio">
        <img src="${imgBase}logo_bien_recortado.png" alt="Logo Rocket Sport">
    </a>

    <ul class="rs-nav-links" role="list">
        ${linksHTML}
    </ul>

    <a href="https://api.whatsapp.com/send?phone=5215642377562"
       target="_blank"
       rel="noopener noreferrer"
       class="rs-nav-cta"
       id="rsNavCta">
        Cotizar
    </a>

    <button class="rs-hamburger" id="rsHamburger" aria-label="Abrir menú" aria-expanded="false" aria-controls="rsDrawer">
        <span></span>
        <span></span>
        <span></span>
    </button>
</nav>

<!-- Backdrop del drawer -->
<div class="rs-drawer-backdrop" id="rsDrawerBackdrop" aria-hidden="true"></div>

<!-- Drawer lateral -->
<nav class="rs-drawer" id="rsDrawer" aria-label="Menú móvil">
    ${drawerLinksHTML}
    <a href="https://api.whatsapp.com/send?phone=5215642377562"
       target="_blank"
       rel="noopener noreferrer"
       class="rs-drawer-cta">
        Solicitar Cotización
    </a>
</nav>
`;
    }

    // ─── Inyectar navbar en el DOM ────────────────────────────────────────────
    function injectNavbar() {
        const container = document.createElement('div');
        container.innerHTML = buildNavbarHTML();
        // Insertar todos los nodos al comienzo del body
        while (container.firstChild) {
            document.body.insertBefore(container.firstChild, document.body.firstChild);
        }
    }

    // ─── Lógica de Scroll (clase is-scrolled) ─────────────────────────────────
    function initScrollBehavior() {
        const navbar = document.getElementById('rsNavbar');
        if (!navbar) return;

        let lastScrollY = window.scrollY;

        function updateNavbar() {
            const scrolled = window.scrollY > 30;
            navbar.classList.toggle('is-scrolled', scrolled);
            lastScrollY = window.scrollY;
        }

        // Throttle via requestAnimationFrame
        let rafPending = false;
        window.addEventListener('scroll', () => {
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    updateNavbar();
                    rafPending = false;
                });
            }
        }, { passive: true });

        // Estado inicial
        updateNavbar();
    }

    // ─── Lógica del Hamburger + Drawer ────────────────────────────────────────
    function initDrawer() {
        const hamburger = document.getElementById('rsHamburger');
        const drawer = document.getElementById('rsDrawer');
        const backdrop = document.getElementById('rsDrawerBackdrop');

        if (!hamburger || !drawer || !backdrop) return;

        let isOpen = false;

        function openDrawer() {
            isOpen = true;
            hamburger.classList.add('is-open');
            hamburger.setAttribute('aria-expanded', 'true');
            drawer.classList.add('is-open');
            backdrop.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            isOpen = false;
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            drawer.classList.remove('is-open');
            backdrop.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', () => {
            isOpen ? closeDrawer() : openDrawer();
        });

        // Cerrar al hacer click en el backdrop
        backdrop.addEventListener('click', closeDrawer);

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) closeDrawer();
        });

        // Cerrar al hacer click en un link del drawer (navegación)
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeDrawer);
        });
    }

    // ─── Timeline Overlay Toggle (funciona en todas las páginas) ─────────────
    function initTimelineToggle() {
        const toggle = document.getElementById('timelineToggle');
        const overlay = document.getElementById('timelineOverlay');
        if (!toggle || !overlay) return;

        let collapsed = false;
        toggle.addEventListener('click', () => {
            collapsed = !collapsed;
            overlay.classList.toggle('is-collapsed', collapsed);
            toggle.textContent = collapsed ? '◀' : '▶';
        });
    }

    // ─── Inicialización principal ─────────────────────────────────────────────
    function init() {
        injectNavbar();
        initScrollBehavior();
        initDrawer();
        initTimelineToggle();
    }

    // ─── Ejecutar cuando el DOM esté listo ───────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
