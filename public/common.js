(() => {
    'use strict';

    // Theme Toggle Functionality
    const THEME_KEY = "theme";
    const toggle = document.getElementById("toggle");

    function getThemeOriginPoint() {
        const img = document.querySelector(".image-ring img") ||
            document.querySelector(".image-ring") ||
            document.querySelector("img[src*='aarya']");

        if (img) {
            const rect = img.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                return {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
            }
        }
        const toggleLabel = document.querySelector(".darkModeLabel");
        if (toggleLabel) {
            const rect = toggleLabel.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        document.body.classList.toggle("dark", isDark);
        if (toggle) toggle.checked = isDark;
    }

    function switchThemeWithRipple(theme) {
        if (document.documentElement.classList.contains("theme-transitioning")) return;

        const { x, y } = getThemeOriginPoint();
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            document.documentElement.classList.add("theme-transitioning");

            const transition = document.startViewTransition(() => {
                applyTheme(theme);
            });

            transition.ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${endRadius}px at ${x}px ${y}px)`
                        ]
                    },
                    {
                        duration: 750,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        pseudoElement: "::view-transition-new(root)"
                    }
                );
            });

            transition.finished.then(() => {
                document.documentElement.classList.remove("theme-transitioning");
            });
        } else {
            const isDark = theme === "dark";
            const rippleColor = isDark ? "#040711" : "#eef5ff";

            const ripple = document.createElement("div");
            ripple.className = "theme-ripple-overlay";
            ripple.style.background = rippleColor;

            document.body.appendChild(ripple);

            const animation = ripple.animate(
                [
                    {
                        width: "0px",
                        height: "0px",
                        left: `${x}px`,
                        top: `${y}px`
                    },
                    {
                        width: `${endRadius * 2}px`,
                        height: `${endRadius * 2}px`,
                        left: `${x - endRadius}px`,
                        top: `${y - endRadius}px`
                    }
                ],
                {
                    duration: 750,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)"
                }
            );

            animation.onfinish = () => {
                applyTheme(theme);
                ripple.remove();
            };
        }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(savedTheme);

    if (toggle) {
        toggle.addEventListener("change", () => {
            const theme = toggle.checked ? "dark" : "light";
            localStorage.setItem(THEME_KEY, theme);
            switchThemeWithRipple(theme);
        });

        const toggleLabel = document.querySelector(".darkModeLabel");
        if (toggleLabel) {
            toggleLabel.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle.checked = !toggle.checked;
                    toggle.dispatchEvent(new Event("change"));
                }
            });
        }
    }

    // Dynamic Sticky Navbar Scroll Morph powered by GSAP
    const header = document.querySelector("header");
    const nav = document.querySelector(".nav");
    if (nav) {
        let isScrolled = false;
        if (window.gsap) {
            gsap.set(nav, { borderRadius: 999 });
        }

        const updateNavScroll = () => {
            // Only run navbar scroll animation on desktop viewports (> 768px)
            if (window.innerWidth <= 768) {
                if (isScrolled) {
                    isScrolled = false;
                    if (header) header.classList.remove("is-scrolled");
                    nav.classList.remove("is-scrolled");
                }
                if (window.gsap) {
                    gsap.killTweensOf(nav);
                    gsap.set(nav, { clearProps: "maxWidth,paddingTop,paddingBottom,paddingLeft,paddingRight,y,transform" });
                }
                return;
            }

            const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;

            // Hysteresis deadband: trigger scrolled at > 55px, expand back at < 15px (prevents threshold bounce)
            if (!isScrolled && scrollY > 55) {
                isScrolled = true;
                if (header) header.classList.add("is-scrolled");
                nav.classList.add("is-scrolled");

                if (window.gsap) {
                    gsap.to(nav, {
                        maxWidth: 860,
                        paddingTop: 9,
                        paddingBottom: 9,
                        paddingLeft: 20,
                        paddingRight: 20,
                        borderRadius: 999,
                        y: 2,
                        duration: 0.38,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            } else if (isScrolled && scrollY < 15) {
                isScrolled = false;
                if (header) header.classList.remove("is-scrolled");
                nav.classList.remove("is-scrolled");

                if (window.gsap) {
                    gsap.to(nav, {
                        maxWidth: 1200,
                        paddingTop: 14,
                        paddingBottom: 14,
                        paddingLeft: 22,
                        paddingRight: 22,
                        borderRadius: 999,
                        y: 0,
                        duration: 0.38,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            }
        };

        window.addEventListener("scroll", updateNavScroll, { passive: true });
        window.addEventListener("resize", () => {
            updateNavScroll();
        }, { passive: true });

        // Initial check
        updateNavScroll();
    }
})();
