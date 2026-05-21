document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('open');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Before / After Slider Logic
    const slider = document.querySelector('.ba-slider');
    const afterImage = document.querySelector('.image-after');
    const handle = document.querySelector('.slider-handle');

    if (slider && afterImage && handle) {
        let isDragging = false;

        const setSliderPosition = (xPos) => {
            const rect = slider.getBoundingClientRect();
            let position = ((xPos - rect.left) / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            afterImage.style.width = `${position}%`;
            handle.style.left = `${position}%`;
        };

        // Desktop Mouse Events
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            setSliderPosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            setSliderPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Mobile Touch Events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.touches && e.touches[0]) {
                setSliderPosition(e.touches[0].clientX);
            }
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches && e.touches[0]) {
                setSliderPosition(e.touches[0].clientX);
                // Prevent mobile default scroll behavior while dragging
                if (e.cancelable) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Prevent default dragging on images inside slider
        slider.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }

    // 4. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. Contact Form Simulation
    const contactForm = document.getElementById('devis-form');
    const formWrapper = document.querySelector('.form-wrapper');
    const successMessage = document.querySelector('.form-success-message');

    if (contactForm && formWrapper && successMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple validation
            const nom = document.getElementById('form-nom').value.trim();
            const tel = document.getElementById('form-tel').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!nom || !tel || !email || !message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            // Simulate form submission status change
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = 'Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success state
                contactForm.style.display = 'none';
                document.querySelector('.form-title').style.display = 'none';
                document.querySelector('.form-subtitle').style.display = 'none';
                successMessage.classList.add('visible');
                
                // Scroll to form header if needed
                formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        });
    }

    // 6. Navigation Scroll Spy
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });
});
