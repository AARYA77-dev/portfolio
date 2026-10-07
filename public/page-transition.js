// =============================================================
// Page transition effects
// This file creates the cinematic slide-in/out animation between pages.
// It helps the portfolio feel more polished and app-like while navigating.
// =============================================================
(() => {
    const tiles = ".from-left .tile";

    // 1. Enter: reveal the page by sliding the transition tiles to the right.
    if (sessionStorage.getItem("transition")) {
        sessionStorage.removeItem("transition");
        document.documentElement.classList.remove("page-transitioning");

        gsap.fromTo(tiles, 
            { width: "100%", left: "0%" },
            {
                duration: 0.4,
                left: "100%",
                stagger: -0.05,
                ease: "power4.inOut",
                onComplete: () => gsap.set(tiles, { width: "0%", left: "0%" })
            }
        );
    }

    // 2. Exit: slide the transition tiles from the left when a user clicks an internal link.
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;

        const currentPath = location.pathname.replace(/\/index\.html$/, "/");
        const targetPath = url.pathname.replace(/\/index\.html$/, "/");
        if (currentPath === targetPath) return;

        e.preventDefault();
        gsap.to(tiles, {
            duration: 0.4,
            width: "100%",
            left: "0%",
            stagger: 0.05,
            ease: "power4.inOut",
            onComplete: () => {
                sessionStorage.setItem("transition", "1");
                location.href = link.href;
            }
        });
    });

    // Reset tiles if the browser restores a page from the back/forward cache.
    window.addEventListener("pageshow", (e) => {
        if (e.persisted) gsap.set(tiles, { width: "0%", left: "0%" });
    });

    // 3. Ultra-smooth sliding navbar pill
    // Tracks the active nav item and creates a smooth hover highlight animation.
    function setupNavHoverIndicator() {
        const nav = document.querySelector(".nav");
        if (!nav) return;
        const links = nav.querySelectorAll(".navlink");
        if (!links.length) return;

        let hideTimer;

        links.forEach((link) => {
            link.addEventListener("mouseenter", () => {
                clearTimeout(hideTimer);
                const navRect = nav.getBoundingClientRect();
                const linkRect = link.getBoundingClientRect();
                nav.style.setProperty("--nav-left", `${Math.round(linkRect.left - navRect.left)}px`);
                nav.style.setProperty("--nav-top", `${Math.round(linkRect.top - navRect.top)}px`);
                nav.style.setProperty("--nav-width", `${Math.round(linkRect.width)}px`);
                nav.style.setProperty("--nav-height", `${Math.round(linkRect.height)}px`);
                nav.classList.add("is-hovering");
            });
        });

        const menu = nav.querySelector(".menu");
        if (menu) {
            menu.addEventListener("mouseleave", () => {
                hideTimer = setTimeout(() => {
                    nav.classList.remove("is-hovering");
                }, 80);
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupNavHoverIndicator);
    } else {
        setupNavHoverIndicator();
    }
})();
