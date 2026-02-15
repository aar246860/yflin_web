# 林穎凡研究室網站 架構與編排審查報告（給網頁美術設計師）

版本日期：2026-02-15  
審查範圍：`yflin_web` 整站（首頁 + blog + pages 子頁）  
目的：提供設計師可直接提出改稿方案的依據（含優先級與證據）

## 一頁摘要（TL;DR）
目前網站的主要問題不是單一「視覺風格」，而是「資訊架構與互動契約未對齊」：
1. 有多個導覽與連結會導到不存在的目標，會直接打斷使用者流程。
2. 子頁共用首頁腳本，但腳本假設首頁元素一定存在，導致子頁互動初始化失敗。
3. 設計 Token（CSS 變數）使用與定義不一致，造成視覺結果不可預期。
4. 部分子頁內容與品牌資訊不一致，會降低專業可信度。

建議先做 P0/P1 結構治理，再做視覺精修，否則美術改稿會被結構問題抵消。

## 主要發現（依嚴重度）

### P0-1 導覽錨點與互動契約不一致，造成跳轉失效與點擊錯誤
證據：
1. 導覽連到 `#projects-students`，但頁面實際 section 是 `#students`。  
`index.html:38`, `index.html:283`
2. 平滑捲動對所有 `a[href^="#"]` 一律執行 `querySelector(this.getAttribute('href'))`，若 `href="#"` 會命中無效 selector。  
`script.js:53`, `script.js:56`
3. 站內存在多個 `href="#"` 互動元素。  
`index.html:30`, `index.html:404`, `index.html:407`, `index.html:410`, `index.html:625`, `index.html:626`, `index.html:627`  
`blog/index.html:26`, `blog/index.html:27`, `blog/index.html:28`, `blog/index.html:29`, `blog/index.html:30`  
`blog/posts/research-life.html:54`, `blog/posts/research-life.html:55`, `blog/posts/research-life.html:56`, `blog/posts/research-life.html:59`, `blog/posts/research-life.html:61`

設計影響：
1. 主要導覽與 CTA 的可預期性下降。
2. 設計師提供的互動稿在實站難以穩定重現。

設計建議：
1. 定義錨點命名規格（`nav href` 必須 1:1 對應現存 `section id`）。
2. 將未上線連結改為明確 disabled 視覺狀態，不用 `#` 當暫存。

### P0-2 首頁研究卡片導向不存在頁面，資訊架構斷鏈
證據：
1. 首頁研究卡片連到 `research/*.html`。  
`index.html:139`, `index.html:144`, `index.html:149`, `index.html:154`, `index.html:159`, `index.html:164`
2. 以上對應檔案不存在（`research/groundwater.html` 等皆缺失）。

設計影響：
1. 使用者從首頁進入研究內容的主路徑中斷。
2. 研究主題卡片缺乏「目的頁承接」，導致版面價值無法兌現。

設計建議：
1. 先規劃統一研究詳頁模板（Hero + 摘要 + 成果 + CTA）。
2. 未完成頁面先導向「研究總覽頁」而非死鏈。

### P0-3 子頁共用腳本耦合首頁元素，導致子頁互動初始化易失敗
證據：
1. 腳本直接假設 `.theme-toggle` 存在並取子節點。  
`script.js:27`, `script.js:28`
2. 腳本直接假設 `#collaborationForm` 存在並綁事件。  
`script.js:470`
3. 子頁均載入同一 `script.js`。  
`blog/index.html:60`  
`blog/posts/research-life.html:73`  
`pages/team/index.html:69`  
`pages/research/index.html:34`
4. 但子頁多數未提供上述首頁元素。

設計影響：
1. 子頁互動與動效不穩定，設計展示一致性下降。
2. 設計師在子頁檢視時會看到「有樣式但互動異常」的破碎體驗。

設計建議：
1. 以「頁面層級元件契約」切分腳本（首頁專屬、共用、子頁專屬）。
2. 設計稿交付時同步標記「全站共用元件」與「頁面限定元件」。

### P0-4 專題生區塊為空且篩選邏輯與團隊區塊互相干擾
證據：
1. 專題生區塊有容器但無初始內容。  
`index.html:290`
2. 專題生篩選按鈕與團隊篩選共用 `.team-filter-btn` class。  
`index.html:220`, `index.html:221`, `index.html:222`, `index.html:287`, `index.html:288`
3. 腳本對所有 `.team-filter-btn` 綁同一事件，實際只呼叫 `generateTeamMembers(...)`。  
`script.js:761`, `script.js:763`, `script.js:765`

設計影響：
1. 使用者點「專題生篩選」卻影響團隊卡片，互動心智模型錯置。
2. 區塊可見但內容空白，破壞資訊節奏。

設計建議：
1. 將「團隊篩選」與「專題生篩選」分離命名與互動邏輯。
2. 專題生區塊先定義最低可顯示資料卡（即使只有 1 筆）。

## P1 中優先問題

### P1-1 CSS 變數大量「使用未定義」，視覺結果不可預期
證據：
1. 變數使用但未在 `:root` 或 dark theme 區塊定義，例如：  
`--text-secondary`, `--dark-card-bg`, `--dark-border`, `--primary-rgb`, `--accent-rgb` 等。  
使用位置示例：`styles.css:438`, `styles.css:607`, `styles.css:704`, `styles.css:1587`, `styles.css:1633`
2. 目前 `:root` 與 dark theme 定義只涵蓋部分基礎變數。  
`styles.css:1`, `styles.css:45`

設計影響：
1. 設計稿的色彩/層次在不同區塊表現不一致。
2. 後續微調顏色成本高，且容易出現暗色模式破圖。

設計建議：
1. 先建立最小 Token 字典（Color, Text, Surface, Border, State）。
2. 先把「已使用 Token」補齊，再進行視覺精修。

### P1-2 子頁模板與品牌資訊不一致
證據：
1. 研究頁 title 使用不同姓名。  
`pages/research/index.html:6`
2. 團隊頁教授所屬單位與首頁敘述不一致。  
`pages/team/index.html:37`

設計影響：
1. 品牌辨識與可信度下降。
2. 設計師難以建立統一語氣與頁面敘事。

設計建議：
1. 建立「品牌文字基線」文件（姓名、職稱、單位、標準描述）。
2. 設計稿中的標題、副標、頁尾語句統一從基線出稿。

### P1-3 子頁規格文件與實際檔案結構不一致
證據：
1. 文件宣告 `teaching/`, `publications/`, `resources/`, `contact/` 等子頁，但實際 `pages/` 只有 `research/` 與 `team/`。  
`pages/README.md:6`, `pages/README.md:7`, `pages/README.md:8`, `pages/README.md:9`, `pages/README.md:10`, `pages/README.md:11`
2. 研究子頁引用不存在的資源：  
`pages/research/index.html:8` (`../../styles/research.css`)  
`pages/research/index.html:35` (`../../scripts/research.js`)

設計影響：
1. 設計師無法判斷哪些頁型已落地、哪些仍是規劃中。
2. 版型擴充路線不清晰，改稿容易返工。

設計建議：
1. 先定義「已上線頁型」與「規劃頁型」兩份清單。
2. 設計交付優先對齊已上線頁型，避免先畫不存在模板。

## P2 優化項目

### P2-1 首頁資訊層級過長，主導覽與內容量不成比例
證據：
1. 首頁共有 15 個 section。  
`index.html:53`, `index.html:66`, `index.html:136`, `index.html:216`, `index.html:283`, `index.html:297`, `index.html:346`, `index.html:372`, `index.html:427`, `index.html:455`, `index.html:479`, `index.html:504`, `index.html:541`, `index.html:563`, `index.html:597`
2. 導覽僅呈現部分入口，且存在失配項。  
`index.html:35`, `index.html:36`, `index.html:37`, `index.html:38`, `index.html:39`, `index.html:40`, `index.html:41`, `index.html:42`

設計建議：
1. 首頁聚焦「身份 + 研究亮點 + 團隊 + 最新成果 + 聯絡」。
2. 其餘深度內容移至子頁，首頁保留摘要卡片與導流 CTA。

### P2-2 內嵌樣式與散落式規則增加視覺維護成本
證據：
`index.html:418`, `index.html:419`, `index.html:420`

設計建議：
1. 交由元件 class 控制樣式，避免頁面內嵌 style。
2. 設計師可直接用元件狀態稿（default/hover/active）對應實作。

### P2-3 後備素材缺失會讓視覺稿呈現破圖
證據：
1. `images/default-avatar.png` 不存在（但腳本與頁面有 onerror fallback 指向此檔）。  
`script.js:720`, `pages/team/index.html:51`
2. `images/blog/default-blog.jpg` 不存在。  
`blog/index.html:38`

設計建議：
1. 先補齊最小素材包（avatar placeholder、blog default cover）。
2. 設計稿中將 fallback 納入規格（比例、裁切、背景色）。

## 當前資訊架構（現況）
```
首頁（單頁長捲動，15 sections）
├─ 關於我 / 研究 / 團隊 / 專題生 / Alumni / 公告 / 發表 / 教學
├─ 未來方向 / 合作機會 / 資源 / 環境 / 合作表單 / 聯絡
└─ 研究卡片（連結到不存在 research/*.html）

子頁
├─ blog/
│  ├─ index.html
│  └─ posts/research-life.html
└─ pages/
   ├─ team/index.html
   └─ research/index.html（引用缺失資源）
```

## 建議資訊架構（供設計稿使用）
```
首頁（聚焦版）
├─ Hero（身份與研究主軸）
├─ 研究亮點（3-6 卡 + 研究總覽 CTA）
├─ 團隊精選（現任 + Alumni 摘要）
├─ 最新成果（公告 + 發表摘要）
└─ 聯絡與合作 CTA

子頁（承接深度內容）
├─ /research        研究主題總覽
├─ /research/:slug  研究詳頁模板
├─ /team            團隊與 Alumni
├─ /publications    論文與篩選
├─ /teaching        教學課程
└─ /blog            研究隨筆
```

## 視覺系統與編排建議（給美術設計師）
1. 先做「Token 層」再做「頁面層」：色彩、字級、間距、卡片陰影先統一。
2. 為每個核心元件定義三態：`default`, `hover`, `active/focus`。
3. 首頁每一屏只保留一個主任務（避免多個同等權重 CTA 競爭）。
4. 團隊卡與專題生卡分離視覺語言：避免同元件承擔不同資料語意。
5. 多語版型需先做最小/最大文案長度檢核（尤其按鈕、標題、tab）。

## 建議改版節奏（設計主導）
### Sprint 1（先止血）
1. 修正導覽錨點與失效連結的視覺/互動狀態。
2. 定義首頁精簡版資訊層級。
3. 補齊必要 fallback 素材。

### Sprint 2（建立穩定設計系統）
1. 建立 Token 字典與核心元件規格。
2. 完成 `research`、`team`、`publications` 三個子頁模板。

### Sprint 3（完整體驗）
1. 建立所有子頁導流關係與 breadcrumb/返回邏輯。
2. 做手機版斷點與長內容可讀性精修。

## 設計師回饋模板（可直接複製）
1. 你同意的 P0/P1/P2 順序是什麼？
2. 首頁你建議保留哪 5 個核心區塊？
3. 研究詳頁模板你偏好哪種版型（論文導向 / 專案故事導向 / 混合）？
4. 團隊與專題生是否採用不同卡片元件？若是，差異點為何？
5. 你預估第一輪視覺改稿需要幾個工作天？

## 本報告定位
本報告聚焦「架構與編排可執行建議」，目的是加速設計改稿決策；不等同最終前端修復清單。
