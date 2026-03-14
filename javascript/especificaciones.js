// ═══════════════════════════════════════════════════════════════════════════════
// ESPECIFICACIONES.JS — Rocket Sport
// ═══════════════════════════════════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// ─── Contadores de precio ─────────────────────────────────────────────────────
document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.getAttribute('data-counter'));
    const counter = { val: 0 };
    ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
            gsap.to(counter, {
                val: target, duration: 2, ease: 'power2.out',
                onUpdate: () => { el.textContent = Math.floor(counter.val).toLocaleString('en-US'); }
            });
        }
    });
});

// ─── Hero entrance ────────────────────────────────────────────────────────────
gsap.from('.page-hero-content > *', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 });

// ─── Price banner ─────────────────────────────────────────────────────────────
gsap.from('.price-col', {
    scrollTrigger: { trigger: '.price-banner', start: 'top 80%', once: true },
    opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: 'power3.out'
});

// ─── Spec cards ───────────────────────────────────────────────────────────────
gsap.from('.spec-card', {
    scrollTrigger: { trigger: '.specs-grid', start: 'top 80%', once: true },
    opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power3.out'
});

// ─── Dimensions diagram ───────────────────────────────────────────────────────
gsap.from('.dimensions-diagram', {
    scrollTrigger: { trigger: '.dimensions-section', start: 'top 80%', once: true },
    opacity: 0, y: 60, duration: 0.9, ease: 'power3.out'
});

gsap.from('.court-measure', {
    scrollTrigger: { trigger: '.court-measures', start: 'top 85%', once: true },
    opacity: 0, y: 30, scale: 0.9, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)'
});

// ─── Benefits ─────────────────────────────────────────────────────────────────
gsap.from('.benefit-card', {
    scrollTrigger: { trigger: '.benefits-grid', start: 'top 80%', once: true },
    opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power3.out'
});

// ─── CTA ──────────────────────────────────────────────────────────────────────
gsap.from('.spec-cta-content > *', {
    scrollTrigger: { trigger: '.spec-cta-section', start: 'top 80%', once: true },
    opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out'
});

// ─── Hover glow on spec cards ─────────────────────────────────────────────────
document.querySelectorAll('.spec-card, .benefit-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, { boxShadow: '0 0 30px rgba(58,143,212,0.4),0 0 60px rgba(58,143,212,0.15)', duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { boxShadow: '0 0 0 rgba(58,143,212,0)', duration: 0.4, ease: 'power2.inOut' });
    });
});
