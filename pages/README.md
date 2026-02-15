# pages 目錄（2026 重構）

目前上線子頁：
- `research/index.html`
- `publications/index.html`
- `team/index.html`
- `blog/index.html`
- `blog/posts/lagging-darcy-time-scale.html`
- `blog/posts/analytical-solution-truth-error.html`

所有頁面皆使用：
- 共用樣式：`/styles/*.css` + `/components/publication-card.css`
- 共用腳本：`/js/app.js`（模組化初始化）
- 共用翻譯：`/js/translations_2026.js`

規則：
1. 禁止使用 `href="#"` 做假連結。
2. 新增 UI 必須優先使用 token（`styles/variables.css`）。
3. 子頁不可假設首頁 DOM 存在，互動必須做元素檢查。
