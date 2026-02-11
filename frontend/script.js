document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navigation & Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Navigation Dropdown Logic (Redesigned)
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const navDropdown = document.getElementById('nav-dropdown');
    let isNavOpen = false;

    function toggleNav() {
        isNavOpen = !isNavOpen;
        hamburgerBtn.setAttribute('aria-expanded', isNavOpen);
        navDropdown.setAttribute('aria-hidden', !isNavOpen);

        if (isNavOpen) {
            navDropdown.classList.add('active');
            hamburgerBtn.classList.add('is-active'); // Use class for animation
            // No scroll lock for compact dropdown
        } else {
            navDropdown.classList.remove('active');
            hamburgerBtn.classList.remove('is-active');
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing from document click
            toggleNav();
        });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (isNavOpen && navDropdown && !navDropdown.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            toggleNav();
        }
    });

    // Close on link click
    document.querySelectorAll('.nav-link, .mobile-nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            if (isNavOpen) toggleNav();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isNavOpen) {
            toggleNav();
        }
    });

    // 3. Scroll Reveal
    const revealElements = document.querySelectorAll('.service-card, .step, .glass-card, .section-title, .tech-grid, .metrics-grid, .portfolio-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // 4. Metrics Counter
    const metricsSection = document.getElementById('outcomes');
    const metricValues = document.querySelectorAll('.metric-value');
    let hasAnimatedMetrics = false;

    const metricsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimatedMetrics) {
            hasAnimatedMetrics = true;
            metricValues.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                let startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const percentage = Math.min(progress / duration, 1);
                    const ease = 1 - Math.pow(1 - percentage, 4);

                    const current = Math.floor(ease * target);
                    counter.innerText = current;

                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        counter.innerText = target;
                    }
                }
                window.requestAnimationFrame(step);
            });
        }
    }, { threshold: 0.5 });

    if (metricsSection) {
        metricsObserver.observe(metricsSection);
    }

    // 5. Portfolio Carousel (Drag + Buttons)
    const portfolioRail = document.getElementById('portfolio-rail');
    const btnLeft = document.querySelector('.nav-arrow.left');
    const btnRight = document.querySelector('.nav-arrow.right');

    if (portfolioRail) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Button Click
        if (btnLeft) {
            btnLeft.addEventListener('click', () => {
                portfolioRail.scrollBy({ left: -320, behavior: 'smooth' });
            });
        }
        if (btnRight) {
            btnRight.addEventListener('click', () => {
                portfolioRail.scrollBy({ left: 320, behavior: 'smooth' });
            });
        }

        // Drag to Scroll
        portfolioRail.addEventListener('mousedown', (e) => {
            isDown = true;
            portfolioRail.classList.add('active-drag');
            startX = e.pageX - portfolioRail.offsetLeft;
            scrollLeft = portfolioRail.scrollLeft;
        });

        portfolioRail.addEventListener('mouseleave', () => {
            isDown = false;
            portfolioRail.classList.remove('active-drag');
        });

        portfolioRail.addEventListener('mouseup', () => {
            isDown = false;
            portfolioRail.classList.remove('active-drag');
        });

        portfolioRail.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - portfolioRail.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            portfolioRail.scrollLeft = scrollLeft - walk;
        });
    }

    // 6. Contact Form Placeholder
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Message Sent';
                btn.style.backgroundColor = '#10b981'; // Green
                btn.style.borderColor = '#10b981';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 3000);
            }, 1000);
        });
    }

    // 7. Hero Canvas (Updated Circuit Grid)
    const heroCanvasContainer = document.getElementById('hero-canvas');
    if (heroCanvasContainer) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        heroCanvasContainer.appendChild(canvas);

        let width, height;
        let points = [];
        const maxDist = 120;

        function resize() {
            width = canvas.width = heroCanvasContainer.offsetWidth;
            height = canvas.height = heroCanvasContainer.offsetHeight;
            initPoints();
        }

        class Point {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slower
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = '#facc15';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initPoints() {
            points = [];
            let count = Math.floor(width * height / 12000);
            if (count > 100) count = 100;
            for (let i = 0; i < count; i++) points.push(new Point());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 0.3;

            for (let i = 0; i < points.length; i++) {
                points[i].update();
                points[i].draw();

                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        ctx.globalAlpha = (1 - dist / maxDist) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();

    }

    // 8. Interactive Automation Section Logic
    const stepBtns = document.querySelectorAll('.step-btn');
    const pipelineNodes = document.querySelectorAll('.pipeline-node');
    const detailContents = document.querySelectorAll('.detail-content');
    const automationSection = document.getElementById('automation-interactive');

    if (automationSection && stepBtns.length > 0) {
        stepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const stepIndex = btn.getAttribute('data-step');

                // Update Buttons
                stepBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update Nodes
                pipelineNodes.forEach(node => {
                    node.classList.remove('active');
                    if (node.getAttribute('data-step') === stepIndex) {
                        node.classList.add('active');
                    }
                });

                // Update Details
                detailContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.getAttribute('data-step') === stepIndex) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Optional: Auto-cycle if not interacted with (stops on hover)
        let currentStep = 0;
        let autoCycleInterval;
        let isPaused = false;

        function nextStep() {
            if (isPaused) return;
            currentStep = (currentStep + 1) % stepBtns.length;
            // Simulate click
            const btn = document.querySelector(`.step-btn[data-step="${currentStep}"]`);
            if (btn) btn.click();
        }

        // Start auto-cycle when visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // cycle every 4 seconds
                autoCycleInterval = setInterval(nextStep, 4000);
            } else {
                clearInterval(autoCycleInterval);
            }
        }, { threshold: 0.5 });
        observer.observe(automationSection);

        // Pause on hover
        automationSection.addEventListener('mouseenter', () => isPaused = true);
        automationSection.addEventListener('mouseleave', () => isPaused = false);

        // Pause interacting manually
        stepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                isPaused = true;
                // Keep paused for a bit or permanently? Let's just pause on interaction logic handled by hover, 
                // but explicit click should probably stop auto-cycling logic to avoid annoyance.
                // Relying on hover pause is usually safer for UX.
            });
        });
    }
});
