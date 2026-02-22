// ===== NAV SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('section, .usp-card, .review-card, .step, .price-card, .contact-card');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('reveal', 'visible');
            }, i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));

        // Toggle current
        if (!isActive) item.classList.add('active');
    });
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const isDecimal = el.dataset.decimal === 'true';
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const current = target * eased;

                el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();

                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ===== STICKY CTA =====
const stickyCta = document.getElementById('stickyCta');
const heroSection = document.querySelector('.hero');

const stickyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });
}, { threshold: 0 });

stickyObserver.observe(heroSection);

// ===== NUDGE TOAST =====
const nudgeToast = document.getElementById('nudgeToast');
const viewers = [8, 12, 15, 10, 7, 14, 11, 9, 13];

function showNudge() {
    const count = viewers[Math.floor(Math.random() * viewers.length)];
    nudgeToast.innerHTML = `<span>👀 지금 <strong>${count}명</strong>이 이 페이지를 보고 있습니다</span>`;
    nudgeToast.classList.add('show');

    setTimeout(() => {
        nudgeToast.classList.remove('show');
    }, 4000);
}

// Show nudge after 8 seconds, then every 25 seconds
setTimeout(showNudge, 8000);
setInterval(showNudge, 25000);

// ===== OFFER TIMER =====
function updateTimer() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const diff = endOfMonth - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
}

updateTimer();
setInterval(updateTimer, 60000);

// ===== PORTFOLIO CAROUSEL =====
(function () {
    const grid = document.getElementById('portfolioGrid');
    const dotsContainer = document.getElementById('portfolioDots');
    if (!grid || !dotsContainer) return;

    const items = Array.from(grid.querySelectorAll('.portfolio-item'));

    // 1) Build dots
    items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'portfolio-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `사진 ${i + 1}`);
        dot.addEventListener('click', () => {
            items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.portfolio-dot'));

    // 2) Scroll-in fade animation via IntersectionObserver
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 60);
            }
        });
    }, { threshold: 0.15, root: grid });

    items.forEach(item => fadeObserver.observe(item));

    // Also trigger visible for items already in view on load
    setTimeout(() => {
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.left < window.innerWidth && rect.right > 0) {
                item.classList.add('visible');
            }
        });
    }, 200);

    // 3) Update active dot on scroll
    grid.addEventListener('scroll', () => {
        const scrollLeft = grid.scrollLeft;
        const itemW = items[0].offsetWidth + 20; // width + gap
        const idx = Math.round(scrollLeft / itemW);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }, { passive: true });

    // 4) Mouse drag to scroll
    let isDragging = false, startX = 0, scrollStart = 0;

    grid.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.pageX - grid.offsetLeft;
        scrollStart = grid.scrollLeft;
        grid.classList.add('is-dragging');
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - grid.offsetLeft;
        const walk = (x - startX) * 1.2;
        grid.scrollLeft = scrollStart - walk;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        grid.classList.remove('is-dragging');
    });

    grid.addEventListener('mouseleave', () => {
        isDragging = false;
        grid.classList.remove('is-dragging');
    });
})();
