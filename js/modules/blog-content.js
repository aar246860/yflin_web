function normalizeLang(lang) {
    return lang === "en" ? "en" : "zh-TW";
}

function applyBlogLanguage(root = document, lang = "zh-TW") {
    const targetLang = normalizeLang(lang);
    const blocks = root.querySelectorAll("[data-lang-content]");
    if (!blocks.length) {
        return;
    }

    blocks.forEach((node) => {
        const visible = normalizeLang(node.dataset.langContent) === targetLang;
        node.hidden = !visible;
        node.setAttribute("aria-hidden", String(!visible));
        node.classList.toggle("is-hidden", !visible);
    });
}

export function initBlogContent(root = document) {
    if (!root.querySelector("[data-lang-content]")) {
        return;
    }

    applyBlogLanguage(root, document.documentElement.lang || "zh-TW");
    window.addEventListener("languagechange", (event) => {
        const lang = event?.detail?.lang || document.documentElement.lang || "zh-TW";
        applyBlogLanguage(root, lang);
    });
}
