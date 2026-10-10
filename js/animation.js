// ============================================
// ANIMATIONS & INTERACTIVE FX
// Farm to Fork Collective
// ============================================

// Confetti Particle Effect for Success Actions (Checkout, Join Kitchen, etc.)
function triggerConfetti() {
    const confettiCount = 50;
    const colors = ['#2E7D32', '#4CAF50', '#FF6F00', '#FFB300', '#2196F3', '#E91E63'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: ${Math.random() * 8 + 6}px;
            height: ${Math.random() * 8 + 6}px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            opacity: 1;
            z-index: 99999;
            pointer-events: none;
            transform: rotate(${Math.random() * 360}deg);
            transition: transform 2.5s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 2.5s ease-out;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.style.transform = `translate(${Math.random() * 160 - 80}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
            confetti.style.opacity = '0';
        }, 20);

        setTimeout(() => confetti.remove(), 2600);
    }
}

// Ripple effect on buttons
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-primary, .btn-secondary, .btn-signup, .filter-btn');
    if (btn) {
        const circle = document.createElement('span');
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const ripple = btn.getElementsByClassName('ripple')[0];
        if (ripple) ripple.remove();

        btn.appendChild(circle);
    }
});

// Smooth reveal for dynamic cards
function revealNewElements() {
    if (typeof initScrollAnimations === 'function') {
        initScrollAnimations();
    }
}