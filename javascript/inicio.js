// ═══════════════════════════════════════════════════════════════════════════════
// INICIO.JS — Rocket Sport
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
// FRAME ANIMATION — Cancha (frame27)
// ═══════════════════════════════════════════════════════════════════════════════
const img = document.querySelector('img[alt="Cancha"]');
const mainScroll = document.getElementById('inicio-scroll');
const MAX_FRAMES = 126;

// Precargar frames
for (let i = 1; i <= MAX_FRAMES; i++) {
    const p = new Image();
    p.src = `../frame27/ezgif-frame-${i.toString().padStart(3, '0')}.png`;
}

let mainTop = mainScroll ? mainScroll.offsetTop : 0;
let maxScroll = mainScroll ? mainScroll.offsetHeight - window.innerHeight : 1;

window.addEventListener('resize', () => {
    if (!mainScroll) return;
    mainTop = mainScroll.offsetTop;
    maxScroll = mainScroll.offsetHeight - window.innerHeight;
}, { passive: true });

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE OVERLAY — kinetic animation
// ═══════════════════════════════════════════════════════════════════════════════
const timelineOverlay = document.getElementById('timelineOverlay');
const timelineItems = document.querySelectorAll('.timeline-item');
const TIMELINE_START = 0.93;
let timelineVisible = false;
let timelineAnimating = false;

gsap.defaults({ ease: 'power3.out', duration: 0.6 });

function openTimeline() {
    if (timelineAnimating) return;
    timelineAnimating = true;
    timelineVisible = true;

    const tl = gsap.timeline({ onComplete: () => { timelineAnimating = false; } });

    tl.set(timelineOverlay, { visibility: 'visible', opacity: 1 })
        .call(() => timelineOverlay.classList.add('is-visible'))
        .fromTo('.tl-backdrop-panel',
            { xPercent: 110 },
            { xPercent: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
        )
        .fromTo(timelineItems,
            { opacity: 0, x: 60, rotation: 8, scale: 0.9 },
            {
                opacity: 1, x: 0, rotation: 0, scale: 1,
                duration: 0.55, stagger: 0.08, ease: 'back.out(1.4)',
                onStart: () => timelineItems.forEach(item => item.classList.add('is-revealed'))
            },
            '<+=0.1'
        );

    // Animate connector line via injected style
    const s = document.createElement('style');
    s.id = 'tl-connector-anim';
    s.textContent = `.timeline-overlay.is-visible::before {
        opacity:1!important; transform:scaleY(1)!important;
        transition:opacity 0.4s ease 0.25s,transform 0.5s cubic-bezier(0.65,0.05,0,1) 0.25s;
    }`;
    document.getElementById('tl-connector-anim')?.remove();
    document.head.appendChild(s);
}

function closeTimeline() {
    if (timelineAnimating) return;
    timelineAnimating = true;
    timelineVisible = false;

    const tl = gsap.timeline({
        onComplete: () => {
            timelineAnimating = false;
            gsap.set(timelineOverlay, { visibility: 'hidden', opacity: 0 });
            timelineOverlay.classList.remove('is-visible');
        }
    });

    tl.to(timelineItems, {
        opacity: 0, x: 50, rotation: 5, scale: 0.95,
        duration: 0.35, stagger: 0.05, ease: 'power2.in',
        onComplete: () => timelineItems.forEach(item => item.classList.remove('is-revealed'))
    })
        .to('.tl-backdrop-panel', { xPercent: 110, duration: 0.4, stagger: 0.08, ease: 'power2.in' }, '<+=0.1');

    document.getElementById('tl-connector-anim')?.remove();
}

// ─── Scroll handler ────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    if (!mainScroll || !img) return;

    const scrollPosition = window.scrollY - mainTop;
    let scrollFraction = scrollPosition / maxScroll;
    scrollFraction = Math.max(0, Math.min(1, scrollFraction));

    // Frame mapping
    let frameIndex = 1;
    if (scrollFraction < 0.15) {
        frameIndex = Math.floor(1 + (scrollFraction / 0.15) * (15 - 1));
    } else if (scrollFraction < 0.85) {
        frameIndex = Math.floor(15 + ((scrollFraction - 0.15) / 0.70) * (97 - 15));
    } else {
        frameIndex = Math.floor(97 + ((scrollFraction - 0.85) / 0.15) * (MAX_FRAMES - 97));
    }
    frameIndex = Math.max(1, Math.min(MAX_FRAMES, frameIndex));
    img.src = `../frame27/ezgif-frame-${frameIndex.toString().padStart(3, '0')}.png`;

    // Timeline visibility
    if (scrollFraction >= TIMELINE_START) {
        if (!timelineVisible && !timelineAnimating) openTimeline();
    } else {
        if (timelineVisible && !timelineAnimating) closeTimeline();
    }
}, { passive: true });

// ─── Timeline toggle button ────────────────────────────────────────────────────
document.getElementById('timelineToggle')?.addEventListener('click', () => {
    timelineOverlay.classList.toggle('is-collapsed');
});

// ═══════════════════════════════════════════════════════════════════════════════
// CARRUSEL DE MEDIOS
// ═══════════════════════════════════════════════════════════════════════════════
const carruselTrack = document.getElementById('carruselTrack');
const carruselPrev = document.getElementById('carruselPrev');
const carruselNext = document.getElementById('carruselNext');
const carruselDotsContainer = document.getElementById('carruselDots');
const slides = document.querySelectorAll('.carrusel-slide');
let currentSlide = 0;

slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `carrusel-dot${i === 0 ? ' active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    carruselDotsContainer.appendChild(dot);
});

function goToSlide(index) {
    currentSlide = index;
    carruselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.carrusel-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (video && i !== currentSlide) video.pause();
    });
}

carruselPrev?.addEventListener('click', () => goToSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1));
carruselNext?.addEventListener('click', () => goToSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0));

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL — GSAP ScrollTrigger
// ═══════════════════════════════════════════════════════════════════════════════

// Separador
gsap.from('.sep-left .sep-card', { scrollTrigger: { trigger: '.section-separator', start: 'top 65%', once: true }, y: 50, opacity: 0, duration: 0.7, stagger: 0.12 });
gsap.from('.sep-center', { scrollTrigger: { trigger: '.sep-center', start: 'top 75%', once: true }, y: 60, opacity: 0, scale: 0.95, duration: 0.9 });
gsap.from('.sep-right .sep-card', { scrollTrigger: { trigger: '.section-separator', start: 'top 65%', once: true }, y: 50, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.3 });

// Discover cards
gsap.from('.discover-card', {
    scrollTrigger: { trigger: '.discover-grid', start: 'top 80%', once: true },
    y: 50, opacity: 0, duration: 0.7, stagger: 0.1
});

// Final section
gsap.from('.seccion-final .final-titulo, .seccion-final .carrusel-container, .seccion-final .final-ubicacion', {
    scrollTrigger: { trigger: '.seccion-final', start: 'top 75%', once: true },
    y: 50, opacity: 0, duration: 0.8, stagger: 0.15
});


// ═══════════════════════════════════════════════════════════════════════════════
// CONTADORES animados
// ═══════════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════════
// HOVER GLOW — sep-cards + discover-cards
// ═══════════════════════════════════════════════════════════════════════════════
function addGlowHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, { boxShadow: '0 0 30px rgba(58,143,212,0.4),0 0 60px rgba(58,143,212,0.15)', scale: 1.025, duration: 0.35, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { boxShadow: '0 0 0px rgba(58,143,212,0)', scale: 1, duration: 0.4, ease: 'power2.inOut' });
        });
    });
}

addGlowHover('.sep-card');
addGlowHover('.discover-card');

// Arrow animation on discover cards
document.querySelectorAll('.discover-card').forEach(card => {
    const arrow = card.querySelector('.discover-card-arrow');
    if (!arrow) return;
    card.addEventListener('mouseenter', () => gsap.to(arrow, { x: 6, duration: 0.3 }));
    card.addEventListener('mouseleave', () => gsap.to(arrow, { x: 0, duration: 0.3 }));
});