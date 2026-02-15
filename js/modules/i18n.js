const STORAGE_KEY = "currentLang";
const DEFAULT_LANG = "zh-TW";

let currentLang = DEFAULT_LANG;

function getTranslations() {
    return window.siteTranslations2026 || {};
}

export function getCurrentLanguage() {
    return currentLang;
}

export function t(key) {
    const dict = getTranslations();
    const langPack = dict[currentLang] || {};
    const fallbackPack = dict[DEFAULT_LANG] || {};
    return langPack[key] ?? fallbackPack[key] ?? key;
}

function applyTextNodes(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((node) => {
        node.textContent = t(node.dataset.i18n);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
        node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
    });
}

function syncLangButtons(root = document) {
    root.querySelectorAll("[data-lang-btn]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.langBtn === currentLang);
    });
}

export function applyLanguage(lang, root = document) {
    const dict = getTranslations();
    if (!dict[lang]) {
        return;
    }
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTextNodes(root);
    syncLangButtons(root);
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

export function initI18n(root = document) {
    const dict = getTranslations();
    if (!dict[DEFAULT_LANG]) {
        return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    currentLang = dict[saved] ? saved : DEFAULT_LANG;
    applyLanguage(currentLang, root);

    root.querySelectorAll("[data-lang-btn]").forEach((btn) => {
        btn.addEventListener("click", () => {
            applyLanguage(btn.dataset.langBtn, root);
        });
    });
}
