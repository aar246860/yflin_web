# Xiaolin automation setup

Create one recurring automation with two daily visits.

- **Name:** 小林每日放風
- **Schedule:** Every day at 09:17 and 21:17, `Asia/Taipei`
- **Working directory:** `C:\Users\YFLin\Documents\Codex\Automations\yflin-web-xiaolin`
- **Prompt:** Read and execute `automation/XIAOLIN_DAILY_PROMPT.md`.

The working directory should be a clean clone of `aar246860/yflin_web` on
`main`. It must not point at a manuscript folder, OneDrive research folder, or
a worktree containing unpublished material.

Each visit performs 18-25 minutes of active creative and verification work,
publishes at most one Xiaolin entry, and writes an ignored local report under
`automation/reports/`. The automation is not allowed to post on social media,
send messages, alter other site pages, or inspect private material.
