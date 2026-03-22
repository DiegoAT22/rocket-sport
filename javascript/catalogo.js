// ═══════════════════════════════════════════════════════════════════════════════
// CATALOGO.JS — Rocket Sport
// ═══════════════════════════════════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// ─── HERO: Animación de entrada ───────────────────────────────────────────────
function initHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
        .to('#heroLine1', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .to('#heroLine2', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .call(() => {
            const accent = document.querySelector('.hero-title-accent');
            if (accent) accent.style.animationPlayState = 'running';
        })
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to('#heroCta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.35');
}

window.addEventListener('DOMContentLoaded', initHeroAnimation);

// ═══════════════════════════════════════════════════════════════════════════════
// FRAME ANIMATION — Lámpara (frames_lamaparaR)
// ═══════════════════════════════════════════════════════════════════════════════
const img = document.querySelector('img[alt="Lampara"]');
const mainScroll = document.getElementById('catalogo-scroll');
const MAX_FRAMES = 90;

// Precargar frames
for (let i = 1; i <= MAX_FRAMES; i++) {
    const p = new Image();
    p.src = `../frames_lamaparaR/ezgif-frame-${i.toString().padStart(3, '0')}.png`;
}

let mainTop = mainScroll ? mainScroll.offsetTop : 0;
let maxScroll = mainScroll ? mainScroll.offsetHeight - window.innerHeight : 1;

window.addEventListener('resize', () => {
    if (!mainScroll) return;
    mainTop = mainScroll.offsetTop;
    maxScroll = mainScroll.offsetHeight - window.innerHeight;
}, { passive: true });

// ─── Scroll handler ────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    if (!mainScroll || !img) return;

    const scrollPosition = window.scrollY - mainTop;
    let scrollFraction = scrollPosition / maxScroll;
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));

    // Frame mapping: inicio lento, medio rápido, final lento
    let frameIndex = 1;
    if (scrollFraction < 0.15) {
        frameIndex = Math.floor(1 + (scrollFraction / 0.15) * (12 - 1));
    } else if (scrollFraction < 0.85) {
        frameIndex = Math.floor(12 + ((scrollFraction - 0.15) / 0.70) * (78 - 12));
    } else {
        frameIndex = Math.floor(78 + ((scrollFraction - 0.85) / 0.15) * (MAX_FRAMES - 78));
    }
    frameIndex = Math.max(1, Math.min(MAX_FRAMES, frameIndex));
    img.src = `../frames_lamaparaR/ezgif-frame-${frameIndex.toString().padStart(3, '0')}.png`;
}, { passive: true });

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL — Tarjetas de productos
// ═══════════════════════════════════════════════════════════════════════════════
document.querySelectorAll('.producto-card').forEach((card, i) => {
    const fromLeft = !card.classList.contains('producto-card--reverse');
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.05
                });
            }
        },
        opacity: 1,
        y: 0,
        duration: 0
    });

    // Estado inicial con ligera dirección
    gsap.set(card, { opacity: 0, y: 40 });
});

// Intro y CTA
gsap.from('.catalogo-intro-content', {
    scrollTrigger: { trigger: '.catalogo-intro', start: 'top 75%', once: true },
    y: 50, opacity: 0, duration: 0.9, ease: 'power3.out'
});

gsap.from('.catalogo-cta-content', {
    scrollTrigger: { trigger: '.catalogo-cta-section', start: 'top 75%', once: true },
    y: 50, opacity: 0, duration: 0.9, ease: 'power3.out'
});

// ═══════════════════════════════════════════════════════════════════════════════
// HOVER GLOW — Tarjetas
// ═══════════════════════════════════════════════════════════════════════════════
document.querySelectorAll('.producto-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            boxShadow: '0 0 40px rgba(58,143,212,0.25), 0 0 80px rgba(58,143,212,0.08)',
            duration: 0.4, ease: 'power2.out'
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            boxShadow: '0 0 0px rgba(58,143,212,0)',
            duration: 0.4, ease: 'power2.inOut'
        });
    });
});

// Arrow animation on CTA buttons
document.querySelectorAll('.rs-btn').forEach(btn => {
    const arrow = btn.querySelector('.rs-btn-arrow');
    if (!arrow) return;
    btn.addEventListener('mouseenter', () => gsap.to(arrow, { x: 6, duration: 0.3 }));
    btn.addEventListener('mouseleave', () => gsap.to(arrow, { x: 0, duration: 0.3 }));
});
