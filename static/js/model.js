document.addEventListener('DOMContentLoaded', () => {
    console.log('JS loaded and DOM ready');

    const viewer = document.querySelector("model-viewer");
    const model = document.querySelector('.hero-model');

    let lastScroll = 0;
    let modelOffset = 0;
    let stopTimer;
    let horizontalOffset = 0;

    const animations = ['EdgeGrab', 'Fall', 'Idle', 'Jump', 'Run', 'RunTiltL', 'RunTiltR', 'WallSlide'];

    if (viewer) {
        viewer.addEventListener("load", () => {
            // Keep model in Idle animation
            viewer.animationName = "Idle";
        });
    }

    function play(animationName) {
        if (viewer) {
            viewer.animationName = animationName;
            if (animationName === "Run") {
                if (model) model.classList.add("running");
            } else {
                if (model) model.classList.remove("running");
            }
        }
    }

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');

    if (hamburger) {
        console.log('Hamburger found');
        
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            console.log('Menu toggled');
            navUl.classList.toggle('show');
        }
        
        // Use touchend instead of touchstart for better mobile support
        // This prevents double-toggling that happens with both touchstart and click
        hamburger.addEventListener('touchend', toggleMenu);
        hamburger.addEventListener('click', toggleMenu);
    } else {
        console.log('Hamburger not found');
    }

    // Close menu when clicking a link
    if (navUl) {
        navUl.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navUl.classList.remove('show');
            }
        });
    }

    // Scroll event to move model and change animation
    window.addEventListener("scroll", () => {
        const current = window.scrollY;
        const diff = current - lastScroll;
        lastScroll = current;

        // MODEL MOVE WITH SCROLL 👇
        if (model) {
            modelOffset = current * 1;   // proportional to scroll, increased speed
            model.style.transform = `translateY(${modelOffset}px)`;
        }

        // ANIMATION LOGIC
        if (diff > 3) {
            play("Fall");
        } else if (diff < -3) {
            play("Jump");
        }

        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => {
            const randomAnim = animations[Math.floor(Math.random() * animations.length)];
            play(randomAnim);
            // Random horizontal movement for each animation
            horizontalOffset += (Math.random() - 0.5) * 40; // random -20 to 20
            if (model) {
                model.style.right = `calc(5% + ${horizontalOffset}px)`;
            }

            setTimeout(() => {
                play("Idle");
                if (model) {
                    model.style.transform = `translateY(${modelOffset}px)`; // reset any extra transform
                }
            }, 1500);

        }, 120);
    });


    // Animate sections on scroll
    const animateElements = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(section => {
        section.classList.add('animate'); // initially hidden
        observer.observe(section);
        
        // Fallback: Make visible after a short delay if IntersectionObserver doesn't trigger
        setTimeout(() => {
            if (section.classList.contains('animate') && !section.classList.contains('visible')) {
                section.classList.add('visible');
            }
        }, 500);
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item h3');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            parent.classList.toggle('active');
        });
    });
});
