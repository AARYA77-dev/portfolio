// =============================================================
// Scroll reveal animations
// These animations make text and cards fade/slide into view as the user scrolls.
// =============================================================
(() => {
    'use strict';

    // Initializes scroll-triggered reveal animations for portfolio content sections.
    function initScrollAnimations() {
        // Select all elements to animate
        const animatedElements = document.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, .badge, .skill-name, .project-title, .project-desc'
        );

        if (animatedElements.length === 0) return;

        // Create Intersection Observer
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px 0px -100px 0px', // trigger when element is 100px from bottom
            threshold: 0.1 // trigger when 10% of element is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after animation for better performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add animation class and observe each element
        animatedElements.forEach((element, index) => {
            // Skip elements that are already animated by other systems
            if (element.closest('.hero') && element.classList.contains('hero-greeting')) {
                return;
            }

            element.classList.add('animate-on-scroll');

            // Add stagger delays for a nice cascading effect
            const delayClass = `delay-${(index % 5) + 1}`;
            element.classList.add(delayClass);

            observer.observe(element);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }

    // Re-initialize on page transitions (for SPA-like behavior)
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            initScrollAnimations();
        }
    });
})();
