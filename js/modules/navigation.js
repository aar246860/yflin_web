function toggleMenu(menu, toggleButton, expanded) {
    menu.classList.toggle("is-open", expanded);
    toggleButton.setAttribute("aria-expanded", String(expanded));
}

export function initNavigation(root = document) {
    const toggleButton = root.querySelector("[data-menu-toggle]");
    const menu = root.querySelector("[data-nav-links]");

    if (toggleButton && menu) {
        toggleButton.addEventListener("click", () => {
            const isOpen = menu.classList.contains("is-open");
            toggleMenu(menu, toggleButton, !isOpen);
        });

        menu.querySelectorAll("a").forEach((anchor) => {
            anchor.addEventListener("click", () => {
                if (menu.classList.contains("is-open")) {
                    toggleMenu(menu, toggleButton, false);
                }
            });
        });

        document.addEventListener("click", (event) => {
            if (!menu.classList.contains("is-open")) {
                return;
            }
            if (menu.contains(event.target) || toggleButton.contains(event.target)) {
                return;
            }
            toggleMenu(menu, toggleButton, false);
        });
    }

    root.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || href.length <= 1) {
                return;
            }
            const target = root.querySelector(href);
            if (!target) {
                return;
            }
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}
