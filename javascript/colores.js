// ═══════════════════════════════════════════════════════════════════════════════
// COLORES.JS — Rocket Sport
// Lógica: click en color-card → revela el comparador con animación GSAP
// ═══════════════════════════════════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// ─── Hero entrance ────────────────────────────────────────────────────────────
gsap.from('.page-hero-content > *', {
    opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3
});

// ─── Intro ────────────────────────────────────────────────────────────────────
gsap.from('.colors-intro-content', {
    scrollTrigger: { trigger: '.colors-intro', start: 'top 80%', once: true },
    opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
});

// ─── Color cards reveal ───────────────────────────────────────────────────────
gsap.from('.color-card', {
    scrollTrigger: { trigger: '.colors-grid', start: 'top 80%', once: true },
    opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power3.out'
});

// ─── CTA ──────────────────────────────────────────────────────────────────────
gsap.from('.spec-cta-content > *', {
    scrollTrigger: { trigger: '.spec-cta-section', start: 'top 80%', once: true },
    opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out'
});

// ─── Hover glow en color cards ────────────────────────────────────────────────
document.querySelectorAll('.color-card').forEach(card => {
    const glowColor = card.dataset.glow || 'rgba(58,143,212,0.4)';
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            boxShadow: `0 0 30px ${glowColor}55, 0 0 60px ${glowColor}22`,
            duration: 0.35, ease: 'power2.out'
        });
    });
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('is-selected')) {
            gsap.to(card, { boxShadow: '0 0 0px rgba(0,0,0,0)', duration: 0.4, ease: 'power2.inOut' });
        }
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// REVEAL DEL COMPARADOR AL SELECCIONAR UN COLOR
// ═══════════════════════════════════════════════════════════════════════════════

const comparadorSection = document.getElementById('comparadorSection');
let comparadorVisible = false;

document.querySelectorAll('.color-card').forEach(card => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
        const colorName = card.querySelector('.color-name')?.textContent || 'Azul';
        const colorHex = card.dataset.colorHex || '#1a4fa0';
        const badgeType = card.dataset.badge || 'stock';
        const badgeText = card.dataset.badgeText || 'Disponible inmediato';

        // ── 1. Marcar card seleccionada ────────────────────────────────────────
        document.querySelectorAll('.color-card').forEach(c => {
            c.classList.remove('is-selected');
            gsap.to(c, { boxShadow: '0 0 0px rgba(0,0,0,0)', duration: 0.3 });
        });
        card.classList.add('is-selected');
        const glowColor = card.dataset.glow || 'rgba(58,143,212,0.4)';
        gsap.to(card, {
            boxShadow: `0 0 40px ${glowColor}77, 0 0 80px ${glowColor}33`,
            duration: 0.4
        });

        // ── 2. Pre-cargar el color seleccionado en la mitad IZQUIERDA ──────────
        const grassBgL = document.getElementById('grassBgL');
        const nameL = document.getElementById('nameL');
        const badgeL = document.getElementById('badgeL');

        if (grassBgL) {
            grassBgL.setAttribute('fill', colorHex);
            if (nameL) nameL.textContent = colorName;
            if (badgeL) {
                badgeL.textContent = badgeText;
                badgeL.dataset.type = badgeType;
            }
            // Marcar botón correspondiente del lado L como activo
            document.querySelectorAll('.comp-btn[data-side="L"]').forEach(btn => {
                btn.classList.toggle('is-active', btn.dataset.color === colorHex);
            });
        }

        // ── 3. Reveal del comparador ───────────────────────────────────────────
        if (!comparadorVisible) {
            comparadorVisible = true;
            comparadorSection.classList.remove('is-hidden');

            gsap.set(comparadorSection, { display: 'block' });

            gsap.fromTo(comparadorSection,
                { opacity: 0, y: 60, height: 0, overflow: 'hidden' },
                {
                    opacity: 1, y: 0, height: 'auto', overflow: 'visible',
                    duration: 0.9, ease: 'power3.out',
                    onComplete: () => {
                        comparadorSection.style.overflow = '';
                        comparadorSection.style.height = '';
                    }
                }
            );

            gsap.fromTo('.comparador-header > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
            );
            gsap.fromTo('.comparador-split',
                { opacity: 0, scale: 0.96 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
            );
            gsap.fromTo('.comp-btn',
                { scale: 0, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 0.45,
                    stagger: { each: 0.05, from: 'center' },
                    ease: 'back.out(1.7)',
                    delay: 0.7
                }
            );

            setTimeout(() => {
                comparadorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);

        } else {
            // Ya visible — solo hacer scroll y flash de confirmación
            comparadorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (grassBgL) {
                gsap.fromTo(grassBgL,
                    { opacity: 0.3 },
                    { opacity: 1, duration: 0.5, ease: 'power2.out' }
                );
            }
        }
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARADOR — lógica interna de los botones de color
// ═══════════════════════════════════════════════════════════════════════════════
(function initComparador() {

    const grassBgL = document.getElementById('grassBgL');
    const grassBgR = document.getElementById('grassBgR');
    const nameL = document.getElementById('nameL');
    const nameR = document.getElementById('nameR');
    const badgeL = document.getElementById('badgeL');
    const badgeR = document.getElementById('badgeR');

    if (!grassBgL || !grassBgR) return;

    function changeHalf(side, btn) {
        const grassBg = side === 'L' ? grassBgL : grassBgR;
        const nameEl = side === 'L' ? nameL : nameR;
        const badge = side === 'L' ? badgeL : badgeR;

        document.querySelectorAll(`.comp-btn[data-side="${side}"]`)
            .forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        grassBg.style.transition = 'opacity 0.2s ease';
        grassBg.style.opacity = '0';

        setTimeout(() => {
            grassBg.setAttribute('fill', btn.dataset.color);
            nameEl.textContent = btn.dataset.name;
            badge.textContent = btn.dataset.badgeText;
            badge.dataset.type = btn.dataset.badge;
            grassBg.style.opacity = '1';
        }, 200);
    }

    document.querySelectorAll('.comp-btn').forEach(btn => {
        btn.addEventListener('click', () => changeHalf(btn.dataset.side, btn));
    });

    // Hover glow en botones
    document.querySelectorAll('.comp-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('is-active'))
                gsap.to(btn, { boxShadow: '0 0 18px rgba(255,255,255,0.25)', duration: 0.25 });
        });
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('is-active'))
                gsap.to(btn, { boxShadow: '0 0 0px rgba(255,255,255,0)', duration: 0.3 });
        });
    });

})();
