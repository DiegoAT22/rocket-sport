// ═══════════════════════════════════════════════════════════════════════════════
// CONTACTO.JS — Rocket Sport
// ═══════════════════════════════════════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// ─── Hero entrance ────────────────────────────────────────────────────────────
gsap.from('.page-hero-content > *', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 });

// ─── Form container entrance ──────────────────────────────────────────────────
gsap.from('.form-container', {
    scrollTrigger: { trigger: '.contact-section', start: 'top 80%', once: true },
    opacity: 0, y: 60, duration: 0.9, ease: 'power3.out'
});

gsap.from('.contact-channels > *', {
    scrollTrigger: { trigger: '.contact-channels', start: 'top 80%', once: true },
    opacity: 0, x: 40, duration: 0.7, stagger: 0.12, ease: 'power3.out'
});

// ─── Hover glow on channel cards ─────────────────────────────────────────────
document.querySelectorAll('.channel-card').forEach(card => {
    card.addEventListener('mouseenter', () =>
        gsap.to(card, { boxShadow: '0 0 24px rgba(58,143,212,0.35)', duration: 0.3, ease: 'power2.out' })
    );
    card.addEventListener('mouseleave', () =>
        gsap.to(card, { boxShadow: '0 0 0 rgba(58,143,212,0)', duration: 0.35, ease: 'power2.inOut' })
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FORMULARIO — Validación + Envío a WhatsApp
// ═══════════════════════════════════════════════════════════════════════════════
const form = document.getElementById('contactForm');
const WHATSAPP_NO = '5215642377562';

function markError(el) {
    el.classList.add('is-error');
    el.addEventListener('input', () => el.classList.remove('is-error'), { once: true });
}

function validate() {
    let valid = true;

    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const tipo = document.querySelector('input[name="tipo"]:checked');
    const radioGroup = document.getElementById('tipoInstalacion');

    if (!nombre.value.trim()) { markError(nombre); valid = false; }
    if (!telefono.value.trim()) { markError(telefono); valid = false; }
    if (!tipo) {
        radioGroup.classList.add('is-error');
        gsap.fromTo(radioGroup, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.5)' });
        setTimeout(() => radioGroup.classList.remove('is-error'), 2000);
        valid = false;
    }

    return valid;
}

function buildWhatsAppMessage() {
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const tipo = document.querySelector('input[name="tipo"]:checked')?.value || 'Sin especificar';
    const especificaciones = document.getElementById('especificaciones').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    let msg = `Hola Rocket Sport! Me interesa una cotización de cancha de pádel.\n\n`;
    msg += `*Nombre:* ${nombre}\n`;
    msg += `*Teléfono:* ${telefono}\n`;
    if (correo) msg += `*Correo:* ${correo}\n`;
    msg += `*Tipo de instalación:* ${tipo}\n`;
    if (especificaciones) msg += `\n*Especificaciones:* ${especificaciones}\n`;
    if (mensaje) msg += `\n*Notas adicionales:* ${mensaje}\n`;

    return encodeURIComponent(msg);
}

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) return;

    const msg = buildWhatsAppMessage();
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NO}&text=${msg}`;

    window.open(url, '_blank', 'noopener');
});
