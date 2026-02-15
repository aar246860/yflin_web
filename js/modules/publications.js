import { publicationsData } from "./data.js";
import { getCurrentLanguage, t } from "./i18n.js";

function publicationMatches(item, query, lang) {
    if (!query) {
        return true;
    }
    const text = [
        item.title[lang] || item.title.en || "",
        item.title["zh-TW"] || "",
        item.authors,
        item.venue
    ]
        .join(" ")
        .toLowerCase();

    return text.includes(query.toLowerCase());
}

function buildCard(item, lang) {
    const article = document.createElement("article");
    article.className = "publication-card";
    article.innerHTML = `
        <div>
            <span class="venue-tag">${item.venue}</span>
        </div>
        <div class="publication-content">
            <p class="publication-meta">${t("publications_year")} ${item.year} · ${t("publications_venue")}</p>
            <h3 class="publication-title">${item.title[lang] || item.title.en}</h3>
            <p class="publication-authors">${item.authors}</p>
            <div class="action-row">
                <a class="btn-pdf" href="${item.pdf}" target="_blank" rel="noopener noreferrer">${t("publications_pdf")}</a>
                <a class="btn-code" href="${item.code}" target="_blank" rel="noopener noreferrer" aria-label="${t("publications_code")}">
                    <i class="fab fa-github"></i>
                </a>
            </div>
        </div>
    `;
    return article;
}

function filterPublications(state) {
    const lang = getCurrentLanguage();
    return publicationsData
        .filter((item) => state.year === "all" || String(item.year) === state.year)
        .filter((item) => publicationMatches(item, state.search, lang))
        .sort((a, b) => {
            if (b.year !== a.year) {
                return b.year - a.year;
            }
            return (b.month || 0) - (a.month || 0);
        });
}

function render(root, state) {
    const container = root.querySelector("#publicationsGrid");
    const empty = root.querySelector("#publicationsEmpty");
    if (!container) {
        return;
    }

    container.innerHTML = "";
    const lang = getCurrentLanguage();
    const list = filterPublications(state);

    list.forEach((item) => container.appendChild(buildCard(item, lang)));
    if (empty) {
        empty.classList.toggle("is-hidden", list.length > 0);
        empty.textContent = t("publications_empty");
    }
}

function setupFilters(root, state) {
    const filterButtons = root.querySelectorAll("[data-year-filter]");
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            state.year = btn.dataset.yearFilter;
            filterButtons.forEach((node) => node.classList.remove("is-active"));
            btn.classList.add("is-active");
            render(root, state);
        });
    });
}

function setupSearch(root, state) {
    const searchInput = root.querySelector("#publicationSearch");
    if (!searchInput) {
        return;
    }
    searchInput.addEventListener("input", (event) => {
        state.search = event.target.value.trim();
        render(root, state);
    });
}

export function initPublications(root = document) {
    if (!root.querySelector("#publicationsGrid")) {
        return;
    }

    const state = { year: "all", search: "" };
    setupFilters(root, state);
    setupSearch(root, state);
    render(root, state);
    window.addEventListener("languagechange", () => render(root, state));
}
