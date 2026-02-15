import { t } from "./i18n.js";

function buildMailto(name, email, message) {
    const subject = `${t("form_mail_subject")} - ${name}`;
    const body = `${t("form_name")}: ${name}\n${t("form_email")}: ${email}\n\n${t("form_message")}:\n${message}`;
    return `mailto:yflin1110@cycu.edu.tw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function initCollaborationForm(root = document) {
    const form = root.querySelector("#collaborationForm");
    if (!form) {
        return;
    }

    const status = root.querySelector("#formStatus");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const fd = new FormData(form);
        const name = String(fd.get("name") || "").trim();
        const email = String(fd.get("email") || "").trim();
        const message = String(fd.get("message") || "").trim();

        if (!name || !email || !message) {
            if (status) {
                status.textContent = t("form_status_error");
            }
            return;
        }

        if (status) {
            status.textContent = t("form_status_ready");
        }

        window.location.href = buildMailto(name, email, message);
        form.reset();
    });
}
