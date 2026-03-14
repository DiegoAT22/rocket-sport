// ═══════════════════════════════════════════════════════════════════════════════
// GALERIA.JS — Rocket Sport
// ═══════════════════════════════════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// ─── Hero entrance ────────────────────────────────────────────────────────────
gsap.from('.page-hero-content > *', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 });

// ─── Video cards ──────────────────────────────────────────────────────────────
gsap.from('.vid-card', {
    scrollTrigger: { trigger: '.vid-grid', start: 'top 80%', once: true },
    opacity: 0, y: 50, duration: 0.7, stagger: 0.15, ease: 'power3.out'
});

// ─── Gallery items ────────────────────────────────────────────────────────────
gsap.from('.gallery-item', {
    scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%', once: true },
    opacity: 0, scale: 0.95, duration: 0.7, stagger: 0.1, ease: 'power3.out'
});

// ─── CTA ──────────────────────────────────────────────────────────────────────
gsap.from('.spec-cta-content > *', {
    scrollTrigger: { trigger: '.spec-cta-section', start: 'top 80%', once: true },
    opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out'
});

// ─── Hover glow on video cards ────────────────────────────────────────────────
document.querySelectorAll('.vid-card').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { boxShadow: '0 0 30px rgba(58,143,212,0.4),0 0 60px rgba(58,143,212,0.15)', duration: 0.35, ease: 'power2.out' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { boxShadow: '0 0 0 rgba(58,143,212,0)', duration: 0.4, ease: 'power2.inOut' }));
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTBOX — Vanilla JS, sin librerías externas
// ═══════════════════════════════════════════════════════════════════════════════
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
let currentIndex = 0;

const images = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxImg.setAttribute('alt', `Cancha ${currentIndex + 1}`);
}

function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
}

function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = images[currentIndex];
        lightboxImg.style.transition = 'opacity 0.3s ease';
        lightboxImg.style.opacity = '1';
    }, 150);
}

function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = images[currentIndex];
        lightboxImg.style.transition = 'opacity 0.3s ease';
        lightboxImg.style.opacity = '1';
    }, 150);
}

// Bind gallery items
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(index); });
});

// Controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);

// Close on backdrop click
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});
