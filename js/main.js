/* ===================================================================
   PartyConcerts.com — Main JavaScript
   Navigation, scroll animations, counters, particles
   =================================================================== */

(function () {
    'use strict';

    // --- NAVIGATION ---
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var overlay = null;

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'nav__overlay';
        overlay.addEventListener('click', closeMenu);
        document.body.appendChild(overlay);
    }

    function openMenu() {
        navMenu.classList.add('nav__menu--open');
        navToggle.classList.add('nav__toggle--active');
        navToggle.setAttribute('aria-expanded', 'true');
        if (!overlay) createOverlay();
        overlay.classList.add('nav__overlay--active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('nav__menu--open');
        navToggle.classList.remove('nav__toggle--active');
        navToggle.setAttribute('aria-expanded', 'false');
        if (overlay) overlay.classList.remove('nav__overlay--active');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            var isOpen = navMenu.classList.contains('nav__menu--open');
            if (isOpen) closeMenu();
            else openMenu();
        });
    }

    // Close menu on link click (mobile)
    if (navMenu) {
        var links = navMenu.querySelectorAll('.nav__link');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }
    }

    // Nav scroll effect
    function handleNavScroll() {
        if (!nav) return;
        if (window.scrollY > 60) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();


    // --- SMOOTH SCROLL for anchor links ---
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var id = link.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        var offset = 80;
        var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    });


    // --- SCROLL REVEAL ---
    function initReveal() {
        // Add reveal classes to sections
        var sections = document.querySelectorAll('.section__header, .pi-card, .vibe-card, .travel-card, .legendary-card, .archetype-card, .crew__feature, .afterparty__feature, .faq__item, .safety__item, .no-tickets__layout, .crew__visual, .safety__visual, .no-tickets__visual, .newsletter__content');

        for (var i = 0; i < sections.length; i++) {
            sections[i].classList.add('reveal');
        }

        // Add stagger classes to grids
        var grids = document.querySelectorAll('.vibes__grid, .archetypes__grid, .afterparty__features, .safety__grid');
        for (var j = 0; j < grids.length; j++) {
            grids[j].classList.add('reveal-stagger');
        }

        var observer = new IntersectionObserver(function (entries) {
            for (var k = 0; k < entries.length; k++) {
                if (entries[k].isIntersecting) {
                    entries[k].target.classList.add('reveal--visible');
                    entries[k].target.classList.add('reveal-stagger--visible');
                    observer.unobserve(entries[k].target);
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        var allReveal = document.querySelectorAll('.reveal, .reveal-stagger');
        for (var m = 0; m < allReveal.length; m++) {
            observer.observe(allReveal[m]);
        }
    }

    if ('IntersectionObserver' in window) {
        initReveal();
    }


    // --- ANIMATED COUNTERS ---
    function animateCounters() {
        var counters = document.querySelectorAll('.proof-bar__number[data-target]');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    startCounter(entries[i].target);
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.5 });

        for (var i = 0; i < counters.length; i++) {
            observer.observe(counters[i]);
        }
    }

    function startCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = 2000;
        var startTime = null;
        var startVal = 0;

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOut(progress);
            var current = Math.floor(startVal + (target - startVal) * easedProgress);

            if (target >= 1000) {
                el.textContent = current.toLocaleString();
            } else {
                el.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        animateCounters();
    }


    // --- HERO PARTICLES ---
    function initParticles() {
        var container = document.getElementById('heroParticles');
        if (!container) return;

        var count = window.innerWidth < 768 ? 20 : 40;
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < count; i++) {
            var particle = document.createElement('div');
            var size = Math.random() * 4 + 2;
            var x = Math.random() * 100;
            var delay = Math.random() * 6;
            var duration = Math.random() * 4 + 4;

            particle.style.cssText =
                'position:absolute;' +
                'width:' + size + 'px;' +
                'height:' + size + 'px;' +
                'background:rgba(255,51,102,' + (Math.random() * 0.4 + 0.1) + ');' +
                'border-radius:50%;' +
                'left:' + x + '%;' +
                'bottom:-10px;' +
                'animation:particleRise ' + duration + 's ease-in-out ' + delay + 's infinite;';

            fragment.appendChild(particle);
        }

        container.appendChild(fragment);

        // Add keyframes
        if (!document.getElementById('particleKeyframes')) {
            var style = document.createElement('style');
            style.id = 'particleKeyframes';
            style.textContent =
                '@keyframes particleRise {' +
                '0% { transform: translateY(0) translateX(0); opacity: 0; }' +
                '10% { opacity: 1; }' +
                '90% { opacity: 1; }' +
                '100% { transform: translateY(-100vh) translateX(' + (Math.random() * 60 - 30) + 'px); opacity: 0; }' +
                '}';
            document.head.appendChild(style);
        }
    }

    // Only init particles if reduced motion is not preferred
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initParticles();
    }


    // --- PARTY INDEX FACTOR BARS ANIMATION ---
    function initFactorBars() {
        var bars = document.querySelectorAll('.pi-card__factor-fill');
        if (!bars.length) return;

        // Store original widths and set to 0
        for (var i = 0; i < bars.length; i++) {
            bars[i].setAttribute('data-width', bars[i].style.width);
            bars[i].style.width = '0%';
        }

        var observer = new IntersectionObserver(function (entries) {
            for (var j = 0; j < entries.length; j++) {
                if (entries[j].isIntersecting) {
                    var fill = entries[j].target;
                    var targetWidth = fill.getAttribute('data-width');
                    setTimeout(function (el, w) {
                        return function () { el.style.width = w; };
                    }(fill, targetWidth), 200);
                    observer.unobserve(fill);
                }
            }
        }, { threshold: 0.3 });

        for (var k = 0; k < bars.length; k++) {
            observer.observe(bars[k]);
        }
    }

    if ('IntersectionObserver' in window) {
        initFactorBars();
    }


    // --- NEWSLETTER FORM (demo) ---
    var newsletterForm = document.querySelector('.newsletter__form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = this.querySelector('.newsletter__input');
            var btn = this.querySelector('.newsletter__btn');
            if (input && btn) {
                btn.textContent = 'You\'re In!';
                btn.style.background = '#34d399';
                input.value = '';
                input.disabled = true;
                btn.disabled = true;
                setTimeout(function () {
                    btn.textContent = 'Join the Party';
                    btn.style.background = '';
                    input.disabled = false;
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // Same for coming soon form
    var csForm = document.querySelector('.cs-form');
    if (csForm) {
        csForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = this.querySelector('.cs-input');
            var btn = this.querySelector('.cs-btn');
            if (input && btn) {
                btn.textContent = 'You\'re In!';
                btn.style.background = '#34d399';
                input.value = '';
                input.disabled = true;
                btn.disabled = true;
            }
        });
    }

})();
