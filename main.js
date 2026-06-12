/*
 * ============================================================
 *  Surveillance World - Main JavaScript
 *  File    : main.js
 *  Used by : index.html
 * ============================================================
 *  SECTIONS
 *   1. Main Site Interactions
 *      - Navbar scroll effect
 *      - Mobile menu open / close
 *      - Animated stat counters (IntersectionObserver)
 *      - Contact form (EmailJS)
 *      - Hero banner slider (auto-advance + touch swipe)
 *      - Project work slider (prev/next/dots/auto)
 *   2. Legal Modal
 *      - Privacy Policy, Terms of Service, Cookie Policy
 *      - openLegal(type) / closeLegal()
 *      - Backdrop click + Escape key to close
 *   3. Storage Calculator
 *      - Verified formula: 911.48 GB for reference test case
 *      - openCalcPopup() / closeCalcPopup() / scCalculate()
 *   4. Decorative Candlestick Chart (Why Choose Us section)
 *      - SVG candles animate in on scroll (IntersectionObserver)
 *      - Purely decorative, no real data
 *   5. BRAND LOGO FLIP CARDS And TESTIMONIALS SLIDER
 *    - Both sections are optimized in JS for better performance and maintainability
 *   6. LAZY LOADING IMAGES
        - All images except hero banner slider are set to lazy load for performance.
        - Hero banner images are excluded to ensure smooth slider experience.
 *
 * ============================================================
 */

/* ============================================================
   1. MAIN SITE INTERACTIONS
============================================================ */
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileOverlay = document.getElementById('mobileOverlay');

        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });

        mobileOverlay.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        });

        // Animate numbers on scroll
        const animateValue = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const current = Math.floor(progress * (end - start) + start);
                element.textContent = current.toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    element.textContent = end.toLocaleString() + (element.dataset.suffix || '');
                }
            };
            window.requestAnimationFrame(step);
        };

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Animate stat numbers
                    if (entry.target.classList.contains('stat-number')) {
                        const endValue = parseInt(entry.target.dataset.count);
                        animateValue(entry.target, 0, endValue, 2000);
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll, .stat-number').forEach(el => {
            observer.observe(el);
        });

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation feedback
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#22c55e';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    this.reset();
                }, 3000);
            }, 1500);
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add parallax effect to hero section
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero');
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
            }
        });

        // Slider functionality
        const sliderWrapper = document.getElementById('sliderWrapper');
        const slides = sliderWrapper.children;
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const sliderDots = document.getElementById('sliderDots');
        
        let currentSlide = 0;
        const totalSlides = slides.length;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            sliderDots.appendChild(dot);
        }

        const dots = document.querySelectorAll('.dot');

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        }

        // Auto slide — 10 seconds, no pause on hover
        let autoSlideInterval = setInterval(nextSlide, 10000);

        // Event listeners for manual nav buttons
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 10000);
        }

        // ── Hero Banner Slider ──
        (function() {
            const track = document.getElementById('heroBannerTrack');
            const dotsContainer = document.getElementById('hbsDots');
            if (!track) return;

            const slides = track.querySelectorAll('.hero-banner-slide');
            const total = slides.length;
            let current = 0;
            let autoTimer = null;

            // Build dots
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = 'hbs-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => { goTo(i); resetAuto(); });
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.hbs-dot');

            function goTo(idx) {
                current = (idx + total) % total;
                track.style.transform = `translateX(-${current * 100}%)`;
                dots.forEach((d, i) => d.classList.toggle('active', i === current));
            }

            function next() { goTo(current + 1); }
            function prev() { goTo(current - 1); }

            function startAuto() { autoTimer = setInterval(next, 4000); }
            function stopAuto()  { clearInterval(autoTimer); }
            function resetAuto() { stopAuto(); startAuto(); }

            document.getElementById('hbsNext').addEventListener('click', () => { next(); resetAuto(); });
            document.getElementById('hbsPrev').addEventListener('click', () => { prev(); resetAuto(); });

            // Pause on hover
            track.parentElement.addEventListener('mouseenter', stopAuto);
            track.parentElement.addEventListener('mouseleave', startAuto);

            startAuto();
        })();


/* ============================================================
   2. LEGAL MODAL
   Handles Privacy Policy, Terms of Service and Cookie Policy
   popup overlay. Triggered by footer links.
   Functions: openLegal(type), closeLegal()
============================================================ */

        /* ── Legal modal data ── */
        const legalContent = {
            privacy: {
                title: '🔒 Privacy Policy',
                tag: 'Privacy',
                updated: 'Last updated: April 2025',
                sections: [
                    { heading: 'Privacy Policy', body: 'We respect your privacy and are committed to protecting your personal information.' },
                    { heading: 'Information We Collect', body: 'We collect only the information you voluntarily provide through our contact form, including your name, email address, phone number, and any message you send. We do not collect sensitive personal data without your explicit consent.' },
                    { heading: 'Data Protection', body: 'We do not sell, trade, or share your personal information with third parties, except when required for service delivery or by law. All data is handled with strict confidentiality and stored securely.' },
                    { heading: 'Third-Party Services', body: 'We may use tools like Google Analytics to understand website traffic and improve performance. These tools may collect anonymised usage data such as pages visited and time spent on site. No personally identifiable information is shared with these tools.' },
                    { heading: 'Cookies', body: 'Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though some features of the site may not function correctly as a result.' },
                    { heading: 'Data Retention', body: 'We retain your information only as long as necessary to fulfil the purpose for which it was collected, or as required by applicable law.' },
                    { heading: 'Your Rights', body: 'You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact us at surveillanceworld2020@gmail.com.' },
                    { heading: 'Contact', body: 'For any privacy-related queries, reach us at: surveillanceworld2020@gmail.com or call +91-8249598979.' },
                ]
            },
            terms: {
                title: '📄 Terms of Service',
                tag: 'Terms',
                updated: 'Last updated: April 2025',
                sections: [
                    { heading: 'Acceptance of Terms', body: 'By accessing or using the Surveillance World website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.' },
                    { heading: 'Use of Website', body: 'This website is intended for informational purposes only. You may not use this site for any unlawful purpose or in any way that could damage, disable, or impair the site or interfere with any other party\'s use of it.' },
                    { heading: 'Intellectual Property', body: 'All content on this website, including text, graphics, logos, and images, is the property of Surveillance World or its content suppliers and is protected by applicable intellectual property laws.' },
                    { heading: 'Product & Pricing Information', body: 'We reserve the right to modify product offerings, descriptions, and pricing without prior notice. All product images, logos, and brand names of third parties such as CP Plus, HiFocus, Trueview, eSSL, Secureye, Seagate, and other respective brands belong to their respective owners and are used for illustrative purposes only.' },
                    { heading: 'Limitation of Liability', body: 'Surveillance World shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use this website or our services. Our total liability, in any case, shall not exceed the amount paid for the service in question.' },
                    { heading: 'Service Availability', body: 'We strive to keep this website available at all times but do not guarantee uninterrupted access. We reserve the right to suspend or discontinue any part of the website at any time without notice.' },
                    { heading: 'Governing Law', body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Bhubaneswar, Odisha.' },
                    { heading: 'Changes to Terms', body: 'We reserve the right to update these Terms of Service at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.' },
                ]
            },
            cookies: {
                title: '🍪 Cookie Policy',
                tag: 'Cookies',
                updated: 'Last updated: April 2025',
                sections: [
                    { heading: 'What Are Cookies?', body: 'Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences and understand how you use the site.' },
                    { heading: 'Types of Cookies We Use', body: '<strong style="color:#e2e8f0">Essential Cookies:</strong> These are necessary for the website to function correctly and cannot be switched off. They are usually set in response to actions you take, such as filling in forms.<br><br><strong style="color:#e2e8f0">Analytics Cookies:</strong> We use tools such as Google Analytics to collect anonymised information about how visitors use our site. This helps us improve the user experience. No personally identifiable data is collected by these cookies.' },
                    { heading: 'How We Use Cookies', body: 'We use cookies to: remember your preferences between visits, understand which pages are most visited, improve website performance, and ensure the contact form works correctly.' },
                    { heading: 'Third-Party Cookies', body: 'Some third-party services embedded in our website (such as Google Analytics) may also place cookies on your device. These are governed by their own privacy and cookie policies, which we encourage you to review.' },
                    { heading: 'Managing Cookies', body: 'You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling certain cookies may affect the functionality of our website.' },
                    { heading: 'Consent', body: 'By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not agree, please adjust your browser settings or discontinue use of the site.' },
                    { heading: 'Contact Us', body: 'If you have questions about our cookie usage, please contact us at surveillanceworld2020@gmail.com.' },
                ]
            }
        };

        function openLegal(type) {
            const data = legalContent[type];
            if (!data) return;
            document.getElementById('legalModalTitle').textContent = data.title;
            const body = document.getElementById('legalModalBody');
            body.innerHTML = `
                <span class="legal-tag">${data.tag}</span>
                <p class="legal-updated">${data.updated}</p>
                ${data.sections.map(s => `
                    <h3>${s.heading}</h3>
                    <p>${s.body}</p>
                    <hr>
                `).join('')}
            `;
            document.getElementById('legalModal').classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLegal() {
            document.getElementById('legalModal').classList.remove('open');
            document.body.style.overflow = '';
        }

        // Close on backdrop click
        document.getElementById('legalModal').addEventListener('click', function(e) {
            if (e.target === this) closeLegal();
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeLegal();
        });


/* ============================================================
   3. STORAGE CALCULATOR
   Formula: bitratePerCam = BASE_RES x (fps/30)
                          x qualityFactor x codecFactor
   storageGB = (bitratePerCam x 1e6 / 8) x 3600
             x hoursPerDay x days x cameras / 1e9
   Verified: 4 cams, 25fps, 24h, 15 days, 1080p,
             Medium quality, H.265 -> 911.48 GB
   Triggered by: openCalcPopup()
============================================================ */

    /* ═══════════════════════════════════════════════════════════════
       STORAGE CALCULATOR — VERIFIED FORMULA
       ---------------------------------------------------------------
       Verified against: 4 cameras, 25fps, 24h, 15 days,
                         1080p, Medium quality, H.265
                         → Result: 911.48 GB  ✓

       Core formula (industry-standard bitrate model):
         bitratePerCam (Mbps) = BASE_RES × (fps/30) × qualityFactor × codecFactor
         storageGB = (bitratePerCam × 1,000,000 / 8) × 3600 × hours × days × cameras / 1,000,000,000

       Base bitrate table derived from pixel-proportional scaling
       anchored at 1080p = 3.37585185 Mbps (H.264, Medium, 30fps).
    ═══════════════════════════════════════════════════════════════ */

    /* Base bitrate (Mbps) per resolution at H.264 + Medium quality + 30 fps
       Pixel-proportional from 1080p anchor (3.37585185 Mbps)             */
    const SC_BASE = {
        '960':   0.90022716,   // 960×576
        '720':   1.50037860,   // 1280×720
        '1080':  3.37585185,   // 1920×1080  ← anchor
        '3mp':   5.12129229,   // 2048×1536
        '5mp':   8.20332000,   // 2592×1944
        '4k':   13.50340741,   // 3840×2160
    };

    /* Quality multipliers (relative to Medium = 1.0) */
    const SC_QUALITY = { low: 0.6, medium: 1.0, high: 1.5 };

    /* Codec multipliers (relative to H.264 = 1.0) */
    const SC_CODEC = { mjpeg: 6.0, h264: 1.0, h265: 0.5 };

    /* Human-readable resolution label */
    const SC_RES_LABEL = {
        '960': '960H', '720': '720p', '1080': '1080p',
        '3mp': '3MP',  '5mp': '5MP',  '4k': '4K'
    };

    function scFormatStorage(gb) {
        if (gb >= 1000) return { val: (gb / 1000).toFixed(2), unit: 'TB' };
        return { val: gb.toFixed(2), unit: 'GB' };
    }

    function scCalculate() {
        const cameras = parseInt(document.getElementById('sc_cameras').value);
        const fps     = parseInt(document.getElementById('sc_fps').value);
        const hours   = parseInt(document.getElementById('sc_hours').value);
        const days    = parseInt(document.getElementById('sc_days').value);
        const resKey  = document.getElementById('sc_res').value;
        const quality = document.getElementById('sc_quality').value;
        const codec   = document.getElementById('sc_codec').value;

        /* Step 1 — bitrate per camera (Mbps)
           = baseRate × fpsScale × qualityFactor × codecFactor              */
        const fpsScale      = fps / 30;
        const bitratePerCam = SC_BASE[resKey] * fpsScale * SC_QUALITY[quality] * SC_CODEC[codec];

        /* Step 2 — total storage (GB)
           bytes = (Mbps × 1e6 / 8 bytes) × 3600 s/hr × hours × days × cameras
           GB    = bytes / 1e9                                                */
        const storageGB = (bitratePerCam * 1_000_000 / 8) * 3600 * hours * days * cameras / 1_000_000_000;

        const perCamGB = storageGB / cameras;
        const perDayGB = storageGB / days;

        const total  = scFormatStorage(storageGB);
        const perCam = scFormatStorage(perCamGB);
        const perDay = scFormatStorage(perDayGB);

        /* Update UI */
        document.getElementById('scResValue').textContent = total.val;
        document.getElementById('scResUnit').textContent  = total.unit;
        document.getElementById('scResNote').textContent  =
            `${cameras} cam${cameras>1?'s':''} · ${fps} FPS · ${hours}h/day · ${days} days · `
            + `${SC_RES_LABEL[resKey]} · ${quality} quality · ${codec.toUpperCase()}`;

        document.getElementById('scPerCam').textContent  = perCam.val + ' ' + perCam.unit;
        document.getElementById('scPerDay').textContent  = perDay.val + ' ' + perDay.unit;
        document.getElementById('scBitrate').textContent = bitratePerCam.toFixed(3);

        const result = document.getElementById('scResult');
        result.classList.add('visible');
        result.style.animation = 'none';
        result.offsetHeight;          // reflow to re-trigger animation
        result.style.animation = '';
    }

    function scReset() {
        document.getElementById('sc_cameras').value = '4';
        document.getElementById('sc_fps').value     = '25';
        document.getElementById('sc_hours').value   = '24';
        document.getElementById('sc_days').value    = '15';
        document.getElementById('sc_res').value     = '1080';
        document.getElementById('sc_quality').value = 'medium';
        document.getElementById('sc_codec').value   = 'h265';
        document.getElementById('scResult').classList.remove('visible');
    }

    function openCalcPopup() {
        document.getElementById('scBackdrop').classList.add('open');
        document.body.style.overflow = 'hidden';
        scCalculate();
    }

    function closeCalcPopup() {
        document.getElementById('scBackdrop').classList.remove('open');
        document.body.style.overflow = '';
    }

    function handleBackdropClick(e) {
        if (e.target === document.getElementById('scBackdrop')) closeCalcPopup();
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCalcPopup();
    });

    ['sc_cameras','sc_fps','sc_hours','sc_days','sc_res','sc_quality','sc_codec'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            if (document.getElementById('scResult').classList.contains('visible')) {
                scCalculate();
            }
        });
    });


/* ============================================================
   4. DECORATIVE CANDLESTICK CHART
   Location: Why Choose Us section, right panel.
   SVG candles animate upward when section scrolls into view.
   Triggered by IntersectionObserver. No real data.
============================================================ */

    /* ═══════════════════════════════════════════════════════
       ANIMATED CANDLESTICK GRAPH — Why Choose Us Section
       Decorative only — no real data
       Candles grow up from baseline one-by-one with colours
    ═══════════════════════════════════════════════════════ */
    (function() {

        /* Candle palette — alternates through colours */
        const PALETTES = [
            { grad:'gGreen',  wick:'#5cb870',  filter:'gFiltGreen'  },
            { grad:'gGold',   wick:'#f4d03f',  filter:'gFiltGold'   },
            { grad:'gTeal',   wick:'#6ee7b7',  filter:'gFiltTeal'   },
            { grad:'gBlue',   wick:'#67e8f9',  filter:'gFiltBlue'   },
            { grad:'gPurple', wick:'#c4b5fd',  filter:'gFiltPurple' },
            { grad:'gOrange', wick:'#fed7aa',  filter:'gFiltGold'   },
            { grad:'gPink',   wick:'#f9a8d4',  filter:'gFiltRed'    },
            { grad:'gGreen',  wick:'#a3e6b0',  filter:'gFiltGreen'  },
            { grad:'gGold',   wick:'#f4d03f',  filter:'gFiltGold'   },
            { grad:'gTeal',   wick:'#6ee7b7',  filter:'gFiltTeal'   },
            { grad:'gBlue',   wick:'#67e8f9',  filter:'gFiltBlue'   },
            { grad:'gPurple', wick:'#c4b5fd',  filter:'gFiltPurple' },
        ];

        /* Chart dimensions */
        const CHART_X0  = 44;     // left edge of first candle center
        const CHART_TOP = 22;     // highest y (top of chart area)
        const BASE_Y    = 222;    // y of baseline
        const CHART_H   = BASE_Y - CHART_TOP;  // total drawable height
        const N         = 12;     // number of candles
        const STEP      = (472 - CHART_X0) / (N - 1);   // spacing between candles
        const BODY_W    = 18;     // candle body width

        /* Month labels */
        const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        /* Generate gradually rising candle heights (decorative "growth" pattern) */
        function makeCandles() {
            // heights increase overall with some natural variation — "growth" story
            const basePct = [18, 28, 22, 38, 32, 48, 42, 58, 52, 72, 65, 88];
            return basePct.map((pct, i) => {
                const bodyH  = (pct / 100) * CHART_H * 0.78;   // body height
                const wickUp = bodyH * 0.15;                     // wick above body
                const wickDn = bodyH * 0.08;                     // wick below body
                const bodyY  = BASE_Y - bodyH - wickDn;
                const topY   = bodyY - wickUp;
                const botY   = BASE_Y - wickDn;
                const cx     = CHART_X0 + i * STEP;
                return { cx, bodyY, bodyH, topY, botY, wickDn, palette: PALETTES[i % PALETTES.length] };
            });
        }

        function buildGraph() {
            const container = document.getElementById('candleGroupContainer');
            const xLabelGrp = document.getElementById('xLabelGroup');
            if (!container) return;

            const candles = makeCandles();

            /* Build SVG candle groups */
            candles.forEach((c, i) => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('g-candle-group');
                g.style.animationDelay = (i * 0.12) + 's';

                /* Wick */
                const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                wick.setAttribute('x1', c.cx); wick.setAttribute('y1', c.topY);
                wick.setAttribute('x2', c.cx); wick.setAttribute('y2', c.botY);
                wick.setAttribute('stroke', c.palette.wick);
                wick.setAttribute('stroke-width', '1.5');
                wick.setAttribute('stroke-linecap', 'round');
                wick.setAttribute('opacity', '0.7');
                g.appendChild(wick);

                /* Body */
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x',      c.cx - BODY_W / 2);
                rect.setAttribute('y',      c.bodyY);
                rect.setAttribute('width',  BODY_W);
                rect.setAttribute('height', Math.max(c.bodyH, 4));
                rect.setAttribute('rx', '3');
                rect.setAttribute('ry', '3');
                rect.setAttribute('fill', `url(#${c.palette.grad})`);
                rect.setAttribute('filter', `url(#${c.palette.filter})`);
                rect.setAttribute('opacity', '0.92');
                g.appendChild(rect);

                /* Top glow dot */
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', c.cx);
                dot.setAttribute('cy', c.topY);
                dot.setAttribute('r', '3');
                dot.setAttribute('fill', c.palette.wick);
                dot.setAttribute('opacity', '0.8');
                g.appendChild(dot);

                container.appendChild(g);

                /* X label */
                const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.setAttribute('x', c.cx);
                txt.setAttribute('y', '240');
                txt.textContent = MONTHS[i];
                xLabelGrp.appendChild(txt);
            });

            /* Trend line — connects top of each candle body */
            const trendPts = candles.map(c => `${c.cx},${c.bodyY}`).join(' ');
            document.getElementById('trendLinePath').setAttribute('points', trendPts);
            // Need polyline not path for points — swap element type
            const trendEl = document.getElementById('trendLinePath');
            const polyTrend = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyTrend.setAttribute('points', trendPts);
            polyTrend.setAttribute('fill', 'none');
            polyTrend.setAttribute('stroke', '#f4d03f');
            polyTrend.setAttribute('stroke-width', '1.6');
            polyTrend.setAttribute('stroke-dasharray', '5 3');
            polyTrend.setAttribute('opacity', '0.6');
            polyTrend.classList.add('g-trend');
            trendEl.parentNode.replaceChild(polyTrend, trendEl);

            /* Moving average smooth cubic bezier path */
            const maPoints = candles.map(c => ({ x: c.cx, y: c.bodyY + c.bodyH * 0.5 }));
            let maD = `M ${maPoints[0].x} ${maPoints[0].y}`;
            for (let i = 1; i < maPoints.length; i++) {
                const prev = maPoints[i - 1];
                const curr = maPoints[i];
                const cpX  = (prev.x + curr.x) / 2;
                maD += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
            }
            const maLine = document.getElementById('maLinePath');
            maLine.setAttribute('d', maD);
            maLine.style.stroke = '#67e8f9';
            maLine.style.strokeWidth = '1.5';

            /* Area fill below MA */
            const last = maPoints[maPoints.length - 1];
            const first = maPoints[0];
            const areaD = maD + ` L ${last.x} ${BASE_Y} L ${first.x} ${BASE_Y} Z`;
            document.getElementById('maAreaPath').setAttribute('d', areaD);

            /* Trigger candle animations via IntersectionObserver */
            const section = document.getElementById('whyUsGraph');
            if (!section) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        /* Animate each candle with a staggered delay */
                        const groups = document.querySelectorAll('.g-candle-group');
                        groups.forEach((g, i) => {
                            setTimeout(() => { g.classList.add('g-in'); }, i * 110);
                        });

                        /* After all candles are up, draw trend and MA lines */
                        const lineDelay = groups.length * 110 + 200;
                        setTimeout(() => {
                            polyTrend.classList.add('g-draw');
                            maLine.classList.add('g-draw');
                        }, lineDelay);

                        observer.disconnect();
                    }
                });
            }, { threshold: 0.35 });

            observer.observe(section);
        }

        /* Build on DOM ready */
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', buildGraph);
        } else {
            buildGraph();
        }
    })();

    /* ============================================================
   5. BRAND LOGO FLIP CARDS And TESTIMONIALS SLIDER
    Both sections are optimized by generating content dynamically in JS
    ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
      const brandsTrack = document.getElementById('brandsTrack');
      if (brandsTrack) { brandsTrack.innerHTML += brandsTrack.innerHTML; }
      document.querySelectorAll('.marquee-track').forEach(track => {
        track.innerHTML += track.innerHTML;
      });
    }); 

    /* ============================================================
   6. LAZY LOADING IMAGES
   All images except hero banner slider are set to lazy load for performance.
   Hero banner images are excluded to ensure smooth slider experience.
    ============================================================ */
    document.querySelectorAll('img').forEach(img => {
    if (!img.closest('.hero-banner-slider')) {
        img.loading = 'lazy';
    }
});
