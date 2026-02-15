import { alumniMembers, currentMembers } from "./data.js";
import { getCurrentLanguage, t } from "./i18n.js";

function createCurrentCard(member, lang, imagePrefix, fallbackPrefix) {
    const card = document.createElement("article");
    card.className = "glass-panel section-panel";
    const photoPath = `${imagePrefix}${member.photo}`;
    const fallbackPath = `${fallbackPrefix}default-avatar.png`;
    card.innerHTML = `
        <div class="stack-md">
            <img src="${photoPath}" alt="${member.name[lang] || member.name.en}" class="team-photo" onerror="this.onerror=null;this.src='${fallbackPath}';">
            <div>
                <h3>${member.name[lang] || member.name.en}</h3>
                <p class="muted">${t(member.roleKey)}</p>
                <p>${member.focus[lang] || member.focus.en}</p>
                ${member.admission ? `<p><strong>${t("team_admission_result")}:</strong> ${member.admission[lang] || member.admission.en}</p>` : ""}
            </div>
        </div>
    `;
    return card;
}

function createAlumniItem(member, lang) {
    const item = document.createElement("li");
    item.className = "glass-panel section-panel";
    item.innerHTML = `
        <h3>${member.name[lang] || member.name.en}</h3>
        <p>${member.topic[lang] || member.topic.en}</p>
        <p><strong>${t("team_current_placement")}:</strong> ${member.placement[lang] || member.placement.en}</p>
    `;
    return item;
}

function renderTeam(root) {
    const currentWrap = root.querySelector("#teamCurrent");
    const alumniWrap = root.querySelector("#teamAlumni");
    if (!currentWrap || !alumniWrap) {
        return;
    }

    const lang = getCurrentLanguage();
    currentWrap.innerHTML = "";
    alumniWrap.innerHTML = "";

    const imagePrefix = currentWrap.dataset.teamImagePrefix || "";
    const fallbackPrefix = currentWrap.dataset.teamFallbackPrefix || "";

    currentMembers.forEach((member) => currentWrap.appendChild(createCurrentCard(member, lang, imagePrefix, fallbackPrefix)));
    if (alumniMembers.length === 0) {
        const empty = document.createElement("li");
        empty.className = "glass-panel section-panel";
        empty.innerHTML = `<p>${t("team_alumni_empty")}</p>`;
        alumniWrap.appendChild(empty);
    } else {
        alumniMembers.forEach((member) => alumniWrap.appendChild(createAlumniItem(member, lang)));
    }
}

export function initTeam(root = document) {
    if (!root.querySelector("#teamCurrent") || !root.querySelector("#teamAlumni")) {
        return;
    }

    renderTeam(root);
    window.addEventListener("languagechange", () => renderTeam(root));
}
