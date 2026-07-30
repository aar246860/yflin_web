# 抽水試驗現地研究站

這是一款六階段地下水抽水試驗模擬遊戲。玩家會選擇場址、配置抽水井與觀測井、設定抽水速率與停止時間、整理合成時間序列，最後選用分析方法估算水力傳導係數 K 與比儲水係數 Ss。

引導模式採用理想 Theis 情境；專家模式加入量測雜訊、河流定水頭邊界或阻水邊界。遊戲中的資料由數學模型產生，不是現地量測資料。

## 公開目錄內容

- `index.html` 與 `css/pumping-game.css`：遊戲頁面與樣式
- `js/pumping/`：模擬、分析、計分與操作流程
- `assets/pumping/`：遊戲正式使用的團隊、場景與設備圖像
- `js/lib/pixi.min.js`：畫面渲染所需的 PixiJS 4.0.3

此公開目錄不包含素材生成過程中的原始檢查圖，也不包含未被新版遊戲載入的舊程式、音效或圖像。

## 授權說明

本遊戲的專案程式與專案圖像屬 `yflin_web` 專案內容；本文件不另行將它們宣告為公共領域，也不授予專案既有條款以外的權利。

遊戲使用 [PixiJS 4.0.3](https://github.com/pixijs/pixijs/tree/v4.0.3)，採 MIT License：

> The Pixi License
>
> Copyright (c) 2013-2016 Mathew Groves, Chad Engler
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
