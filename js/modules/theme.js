const STORAGE_KEY = "theme";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";

function setTheme(theme, button) {
    const normalized = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
    document.documentElement.setAttribute("data-theme", normalized);
    localStorage.setItem(STORAGE_KEY, normalized);

    if (button) {
        const icon = button.querySelector("i");
        if (icon) {
            icon.className = normalized === THEME_DARK ? "fas fa-sun" : "fas fa-moon";
        }
        button.setAttribute("aria-pressed", String(normalized === THEME_DARK));
    }
}

export function initTheme(root = document) {
    const toggle = root.querySelector("[data-theme-toggle]");
    const savedTheme = localStorage.getItem(STORAGE_KEY) || THEME_LIGHT;
    setTheme(savedTheme, toggle);

    if (!toggle) {
        return;
    }

    toggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        setTheme(next, toggle);
    });
}
