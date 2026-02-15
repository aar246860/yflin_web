import { initNavigation } from "./modules/navigation.js";
import { initTheme } from "./modules/theme.js";
import { initI18n } from "./modules/i18n.js";
import { initPublications } from "./modules/publications.js";
import { initTeam } from "./modules/team.js";
import { initCollaborationForm } from "./modules/form.js";

document.addEventListener("DOMContentLoaded", () => {
    initTheme(document);
    initI18n(document);
    initNavigation(document);
    initPublications(document);
    initTeam(document);
    initCollaborationForm(document);
});
