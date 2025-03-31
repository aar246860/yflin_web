// 當前語言
let currentLang = localStorage.getItem('language') || 'zh-TW';

// 切換語言函數
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updateContent();
}

// 更新頁面內容
function updateContent() {
    document.documentElement.setAttribute('lang', currentLang);
    
    // 更新所有帶有 data-i18n 屬性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            // 如果元素是輸入框或文本區域
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    // 更新所有帶有 data-i18n-title 屬性的元素的title屬性
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (translations[currentLang][key]) {
            element.title = translations[currentLang][key];
        }
    });
}

// 頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    updateContent();
}); 