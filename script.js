document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const cursorInner = document.querySelector('.cursor-inner');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorInner.style.left = e.clientX + 'px';
        cursorInner.style.top = e.clientY + 'px';
    });

    // 游標懸停效果
    const hoverElements = document.querySelectorAll('a, button, .research-item, .team-member, .publication-item');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorInner.classList.add('cursor-inner-hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorInner.classList.remove('cursor-inner-hover');
        });
    });

    // 深色模式切換功能
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // 檢查本地存儲中的主題設置
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme === 'dark');
    }
    
    // 切換主題
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isDark);
    });
    
    // 更新圖標
    function updateThemeIcon(isDark) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 導航欄滾動效果
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // 動畫效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // 3D卡片效果
    document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // 論文數據
    const publications = [
        {
            year: '2025',
            date: '2025-06',
            title: 'Faulty Assumptions: Groundwater Modeling Through Anisotropic Fault Zones',
            authors: 'Jun-Hong Lin, Ying-Fan Lin*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2025',
            date: '2025-05',
            title: 'Tidal Signal Propagation in Coastal Aquifers Considering Semi-Permeable Boundaries and Partial Penetration Effects',
            authors: 'Fu-Kuo Huang, Ying-Fan Lin*, Grace S. Wang, Barret L. Kurylyk',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2025',
            date: '2025-03',
            title: 'Improving Water Table Kinematic Conditions with Unsaturated Flow Insights',
            authors: 'Jun-Hong Lin, Ying-Fan Lin*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2025',
            date: '2025-03',
            title: 'Rethinking Aquifer Characterization: Insights from Lagging Models',
            authors: 'Ying-Fan Lin*, Te-Hsing Chang',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2025',
            date: '2025-02',
            title: 'Reply to the discussion by Lv and Qian of "A simple analytical solution for organic contaminant diffusion through a geomembrane to unsaturated soil liner: Considering the sorption effect and Robin-type boundary" by Lin and Yeh (2020)',
            authors: 'Ying-Fan Lin, Hund-Der Yeh*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2025',
            date: '2025-02',
            title: 'Solving Inverse Wave Problems Using Spacetime Radial Basis Functions in Neural Networks',
            authors: 'Chih-Yu Liu, Cheng-Yu Ku*, Wei-Da Chen, Ying-Fan Lin, Jun-Hong Lin',
            journal: 'Mathematics',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-09',
            title: 'Theoretical Evaluation of High-Permeability Wellbore Skin Effect on Aquifer Response under Pumping',
            authors: 'Jun-Hong Lin, Ying-Fan Lin*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-09',
            title: '重新推導高滲透率之井膚層效應條件',
            authors: '林穎凡*，林俊宏，蔡瑞彬，余化龍',
            journal: '農業工程學報 Journal of Taiwan Agricultural Engineering',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-07',
            title: 'Application of the Image-Well Method for Transient Borehole Thermal Energy Storage Systems with Complex Boundaries',
            authors: 'Ying-Fan Lin*, Gabriel Rau, Barret Kurylyk',
            journal: 'Heat Transfer',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-06',
            title: 'Analysis of Groundwater Time Series with Limited Pumping Information in Unconfined Aquifer: Response Function Based on Lagging Theory',
            authors: 'Ying‐Fan Lin, Hua‐Ting Tseng, Shih‐Yao Lee, Hwa‐Lung Yu*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-06',
            title: 'Semi-Analytical Modeling of Transient Stream Drawdown and Depletion in Response to Aquifer Pumping',
            authors: 'Bwalya Malama*, Ying-Fan Lin, Kristopher L. Kuhlman',
            journal: 'Groundwater',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-05',
            title: 'Analytical Methodology for Determining the Extent of Pumped Freshwater Lenses in Recharge-Limited, Circular Islands',
            authors: 'Barret L. Kurylyk*, Yin-Fang Lin, Cristina Solórzano-Riva, Adrian D. Werner',
            journal: 'Advances in Water Resources',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-02',
            title: 'Advanced Analytical Model for Interpreting Oscillatory Pumping Tests With Wellbore Skin and Rate-Dependent Skin Effects',
            authors: 'Ali Mahdavi, Barret L. Kurylyk, Yin-Fang Lin*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2024',
            date: '2024-02',
            title: 'Estimating Spatiotemporal Pumping Amounts Using Multiple Signal Decomposition Methods',
            authors: 'Hua-Ting Tseng, Ying-Fan Lin, Hwa-Lung Yu*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2023',
            date: '2023-09',
            title: 'Analytical Study of Dual-Porosity Coastal Aquifer with Generalized Nonlinear Water Transfer Term',
            authors: 'Kuo-Chen Ma, Mo-Hsiung Chuang, Ya-Chi Chang*, Ying-Fan Lin',
            journal: 'Hydrological Processes',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2023',
            date: '2023-07',
            title: 'Estimating Hydrogeological Parameters at Groundwater Level Observation Wells Without Pumping Well Information',
            authors: 'Hwa-Lung Yu, Shih-Yao Lee, Hua-Ting Tseng, Ying-Fan Lin*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2023',
            date: '2023-05',
            title: 'A Novel Framework for Spatiotemporal Groundwater Pumping Process Estimation Based on Data-Driven Approaches',
            authors: 'Hwa-Lung Yu*, Hua-Ting Tseng, Ying-Fan Lin, Chun-Hung Chen, Ying-Chang Kuo, Yun-Ta Cheng',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2023',
            date: '2023-04',
            title: 'A Temporally Relaxed Theory of Physically or Chemically Non-Equilibrium Solute Transport in Heterogeneous Porous Media',
            authors: 'Ying-Fan Lin, Junqi Huang, Elliot J. Carr, Tung-Chou Hsieh, Hongbin Zhan*, Hwa-Lung Yu*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2023',
            date: '2023-01',
            title: 'Effects of Soil Type and Thermal Boundary on Predicting Temperature Profiles and Groundwater Fluxes',
            authors: 'Chia-Hao Chang, Ying-Fan Lin, Yo-Jin Shiau, Yi-Zhih Tsai, Jui-Pin Tsai*',
            journal: 'Groundwater',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2022',
            date: '2022-12',
            title: 'Estimation of Rainfall Infiltration Rates by New Heat Transfer Models and Subsurface Temperature Profiles',
            authors: 'Cia-Hao Chang, Yi-Zhih Tsai, Shao-Yiu Hsu, Hwa-Lung Yu, Ying-Fan Lin, Sin-Wei Yeh, Jui-Pin Tsai*',
            journal: '農業工程學報 Journal of Taiwan Agricultural Engineering',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2022',
            date: '2022-12',
            title: 'Well Hydraulics in Wedge-Shaped Aquifer: Unsteady Darcian Flow Model Revisited by Lagging Theory',
            authors: 'Ali Mahdavi*, Ying-Fan Lin, Hwa-Lung Yu',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2022',
            date: '2022-07',
            title: 'Analytical Solution for Estimating Transient Vertical Groundwater Flux from Temperature-Depth Profiles',
            authors: 'Ying-Fan Lin, Chia-Hao Chang, Jui-PinTsai*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2022',
            date: '2022-03',
            title: 'A Semi-Analytical Solution for Slug Test by Considering Near-Well Formation Damage and Nonlinear Flow',
            authors: 'Ying-Fan Lin, Hund-Der Yeh*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2021',
            date: '2021-07',
            title: 'An Analytical Model With a Generalized Nonlinear Water Transfer Term for the Flow in Dual-Porosity Media Induced by Constant-Rate Pumping in a Leaky Fractured Aquifer',
            authors: 'Ye-Chen Lin, Hund-Der Yeh*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2020',
            date: '2020-07',
            title: 'A Simple Analytical Solution for Organic Contaminant Diffusion Through a Geomembrane to Unsaturated Soil Liner: Considering the Sorption Effect and Robin-Type Boundary',
            authors: 'Ye-Chen Lin, Hund-Der Yeh*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2020',
            date: '2020-03',
            title: 'New Analytical Models for Flow Induced by Pumping in a Stream-Aquifer System: A New Robin Boundary Condition Reflecting Joint Effect of Streambed Width and Storage',
            authors: 'Ching‐Sheng Huang, Zicheng Wang, Ye‐Chen Lin, Hund‐Der Yeh*, Tao Yang*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2020',
            date: '2020-02',
            title: 'New Analytical Model for Constant-Head Pumping: Considering Rate-Dependent Factor at Well Screen',
            authors: 'Ye-Chen Lin, Hund-Der Yeh*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2019',
            date: '2019-08',
            title: 'Analytical Model for Heat Transfer Accounting for Both Conduction and Dispersion in Aquifers with a Robin-Type Boundary Condition at the Injection Well',
            authors: 'Ye-Chen Lin, Ting-Fang Hu, Hund-Der Yeh*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2019',
            date: '2019-04',
            title: 'Analysis of Unconfined Flow Induced by Constant Rate Pumping Based on the Lagging Theory',
            authors: 'Ye-Chen Lin, Ching-Sheng Huang, Hund-Der Yeh*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2017',
            date: '2017-09',
            title: 'A Lagging Model for Describing Drawdown Induced by a Constant-Rate Pumping in a Leaky Confined Aquifer',
            authors: 'Ye-Chen Lin, Hund-Der Yeh*',
            journal: 'Water Resources Research',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2017',
            date: '2017-06',
            title: 'An Analytical Model for Flow Induced by a Constant-Head Pumping in a Leaky Unconfined Aquifer System with Considering Unsaturated Flow',
            authors: 'Ye-Chen Lin, Ming-Hsu Li, Hund-Der Yeh*',
            journal: 'Advances in Water Resources',
            pdf: '#',
            doi: '#'
        },
        {
            year: '2016',
            date: '2016-07',
            title: 'A General Analytical Model for Pumping Tests in Radial Finite Two-Zone Confined Aquifers with Robin-Type Outer Boundary',
            authors: 'Ye-Chen Lin, Shaw-Yang Yang, Chiu-Shia Fen, Hund-Der Yeh*',
            journal: 'Journal of Hydrology',
            pdf: '#',
            doi: '#'
        }
    ];

    // 動態生成論文列表
    function generatePublications(year = 'all') {
        const container = document.querySelector('.publications-grid');
        container.innerHTML = '';
        
        const filteredPublications = year === 'all' 
            ? publications 
            : publications.filter(pub => pub.year === year);
        
        filteredPublications.forEach(pub => {
            const item = document.createElement('div');
            item.className = 'publication-item';
            item.setAttribute('data-year', pub.year);
            
            item.innerHTML = `
                <div class="publication-date">${pub.date}</div>
                <div class="publication-content">
                    <h3>${pub.title}</h3>
                    <p class="authors">${pub.authors}</p>
                    <p class="journal">${pub.journal}</p>
                    <div class="publication-links">
                        <a href="${pub.pdf}" class="link-btn" target="_blank">
                            <i class="fas fa-file-pdf"></i> PDF
                        </a>
                        <a href="${pub.doi}" class="link-btn" target="_blank">
                            <i class="fas fa-link"></i> DOI
                        </a>
                    </div>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    // 論文過濾功能
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按鈕狀態
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 過濾論文
            generatePublications(btn.dataset.year);
        });
    });

    // 初始化顯示所有論文
    generatePublications();

    // 研究合作諮詢表單處理
    document.getElementById('collaborationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 獲取表單數據
        const formData = {
            name: document.getElementById('name').value,
            institution: document.getElementById('institution').value,
            email: document.getElementById('email').value,
            collaborationType: document.getElementById('collaboration-type').value,
            message: document.getElementById('message').value
        };
        
        // 準備郵件內容
        const mailSubject = `研究合作諮詢：${formData.collaborationType} - 來自 ${formData.name}`;
        const mailBody = `
姓名：${formData.name}
所屬機構：${formData.institution}
電子郵件：${formData.email}
合作類型：${formData.collaborationType}

合作提案說明：
${formData.message}
        `.trim();
        
        // 使用mailto開啟郵件客戶端
        const mailtoLink = `mailto:yflin1110@cycu.edu.tw?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
        window.location.href = mailtoLink;
        
        // 顯示成功消息
        alert('即將開啟您的郵件客戶端，請確認內容後發送。');
        
        // 重置表單
        this.reset();
    });

    // 漢堡選單功能
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // 切換選單
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // 點擊導航連結後關閉選單
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // 點擊頁面其他部分時關閉選單
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // 延遲載入圖片
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    // 論文搜尋和顯示控制
    const searchInput = document.getElementById('pubSearch');
    const publicationItems = document.querySelectorAll('.publication-item');
    const showMoreBtn = document.querySelector('.show-more-btn');
    const ITEMS_PER_PAGE = 5;
    let currentlyShown = ITEMS_PER_PAGE;

    // 初始化：只顯示前5篇
    publicationItems.forEach((item, index) => {
        if (index >= ITEMS_PER_PAGE) {
            item.style.display = 'none';
        }
    });

    // 搜尋功能
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        let visibleCount = 0;

        publicationItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const authors = item.querySelector('.authors').textContent.toLowerCase();
            const journal = item.querySelector('.journal').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || 
                authors.includes(searchTerm) || 
                journal.includes(searchTerm)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // 如果在搜尋中，隱藏"顯示更多"按鈕
        showMoreBtn.style.display = searchTerm ? 'none' : 'block';
        
        // 重置當前顯示數量
        if (!searchTerm) {
            currentlyShown = ITEMS_PER_PAGE;
            publicationItems.forEach((item, index) => {
                item.style.display = index < ITEMS_PER_PAGE ? 'block' : 'none';
            });
        }
    });

    // 顯示更多按鈕功能
    showMoreBtn.addEventListener('click', function() {
        const hiddenItems = Array.from(publicationItems).slice(currentlyShown);
        
        hiddenItems.slice(0, ITEMS_PER_PAGE).forEach(item => {
            item.style.display = 'block';
        });
        
        currentlyShown += ITEMS_PER_PAGE;
        
        // 如果沒有更多項目可以顯示，隱藏按鈕
        if (currentlyShown >= publicationItems.length) {
            showMoreBtn.style.display = 'none';
        }
    });

    // 團隊成員數據
    const teamMembers = [
        {
            name: '林穎凡',
            title: '助理教授',
            type: 'professor',
            year: 'current',
            image: './images/team/professor_林穎凡.png',
            email: 'yflin1110@cycu.edu.tw',
            research: '地下水模擬、地下水資源管理'
        },
        {
            name: '蔡鼎翔',
            title: '碩士生',
            research: '橢圓海島抽水最佳化之研析',
            email: 'ding.tsai@g.ncu.edu.tw',
            type: 'master',
            year: 'current',
            image: './images/team/student_tsai.png',
        },
        {
            name: '羅于翔',
            title: '碩士生',
            type: 'master',
            year: 'current',
            image: './images/team/student_lo.png',
            email: 'example@cycu.edu.tw',
            research: '延遲理論應用在熱響應試驗'
        },
        {
            name: '王湘雯',
            title: '研究助理（大三）',
            type: 'assistant',
            year: 'current',
            image: './images/team/student_wang.png',
            email: 'example@cycu.edu.tw',
            research: '研究井內grout的熱傳性質於熱響應試驗'
        },
        {
            name: '陳鎬櫸',
            title: '研究助理（大三）',
            type: 'assistant',
            year: 'current',
            image: './images/team/student_chen.png',
            email: 'example@cycu.edu.tw',
            research: '延遲理論的新參數空間分布'
        },
        {
            name: '邱邵萱',
            title: '研究助理（大三）',
            type: 'assistant',
            year: 'current',
            image: './images/team/student_chiu.png',
            email: 'sherry.chiu@g.ncu.edu.tw',
            research: '進行中'
        }
    ];

    // 生成團隊成員卡片
    function generateTeamMembers(filter = 'current') {
        const container = document.querySelector('.team-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        const filteredMembers = filter === 'all' 
            ? teamMembers 
            : teamMembers.filter(member => member.year === filter);
        
        // 按類型排序：教授 > 博士後 > 博士生 > 碩士生 > 專任助理
        const typeOrder = {
            'professor': 1,
            'postdoc': 2,
            'phd': 3,
            'master': 4,
            'assistant': 5
        };
        
        filteredMembers.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
        
        filteredMembers.forEach(member => {
            const card = document.createElement('div');
            card.className = 'team-member card-3d';
            card.setAttribute('data-type', member.type);
            
            // 使用i18n屬性創建卡片內容
            const currentLang = localStorage.getItem('currentLang') || 'zh-TW';
            let memberName = member.name;
            let memberTitle = member.title;
            let memberResearch = member.research;
            
            // 如果是英文並且有對應的翻譯鍵，使用翻譯
            if (currentLang === 'en' && translations && translations.en) {
                // 嘗試查找姓名翻譯
                if (member.type === 'professor' && translations.en['professor_name']) {
                    memberName = translations.en['professor_name'];
                } else if (member.name === '蔡鼎翔' && translations.en['student_tsai_name']) {
                    memberName = translations.en['student_tsai_name'];
                } else if (member.name === '羅于翔' && translations.en['student_luo_name']) {
                    memberName = translations.en['student_luo_name'];
                } else if (member.name === '王湘雯' && translations.en['student_wang_name']) {
                    memberName = translations.en['student_wang_name'];
                } else if (member.name === '陳鎬櫸' && translations.en['student_chen_name']) {
                    memberName = translations.en['student_chen_name'];
                } else if (member.name === '邱邵萱' && translations.en['student_chiu_name']) {
                    memberName = translations.en['student_chiu_name'];
                }
                
                // 嘗試查找職位翻譯
                if (member.type === 'professor' && translations.en['position_assistant_professor']) {
                    memberTitle = translations.en['position_assistant_professor'];
                } else if (member.type === 'master' && translations.en['position_masters_student']) {
                    memberTitle = translations.en['position_masters_student'];
                } else if (member.type === 'assistant' && translations.en['position_research_assistant']) {
                    memberTitle = translations.en['position_research_assistant'];
                }
                
                // 嘗試查找研究方向翻譯
                if (member.research.includes('地下水模擬') && translations.en['research_groundwater']) {
                    memberResearch = translations.en['research_groundwater'];
                } else if (member.research.includes('熱響應試驗') && member.name === '羅于翔' && translations.en['research_delay_trt']) {
                    memberResearch = translations.en['research_delay_trt'];
                } else if (member.research.includes('grout') && member.name === '王湘雯' && translations.en['research_grout_thermal']) {
                    memberResearch = translations.en['research_grout_thermal'];
                } else if (member.research.includes('延遲理論') && member.name === '陳鎬櫸' && translations.en['research_numerical']) {
                    memberResearch = translations.en['research_numerical'];
                } else if (member.research.includes('進行中') && translations.en['research_ongoing']) {
                    memberResearch = translations.en['research_ongoing'];
                } else if (member.research.includes('橢圓海島') && translations.en['research_elliptical']) {
                    memberResearch = translations.en['research_elliptical'];
                }
            }
            
            card.innerHTML = `
                <div class="member-image">
                    <img src="${member.image}" alt="${memberName}" 
                         onerror="this.src='./images/default-avatar.png'">
                </div>
                <div class="member-info">
                    <h3>${memberName}</h3>
                    <p class="member-title">${memberTitle}</p>
                    <p class="member-research">${memberResearch}</p>
                    <a href="mailto:${member.email}" class="member-email">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                </div>
            `;
            
            container.appendChild(card);
        });
        
        // 重新綁定3D卡片效果
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // 初始化團隊成員顯示
    generateTeamMembers();
    
    // 綁定篩選按鈕事件
    document.querySelectorAll('.team-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.team-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            generateTeamMembers(btn.dataset.filter);
        });
    });

    // 語言切換功能
    function updateContent(lang) {
        console.log('Updating content to language:', lang);
        
        if (!translations || !translations[lang]) {
            console.error('Translation object not found for language:', lang);
            return;
        }
        
        // 更新 HTML 語言屬性
        document.documentElement.lang = lang;
        
        // 更新所有帶有 data-i18n 屬性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            console.log('Translating element with key:', key);
            
            if (!translations[lang][key]) {
                console.error('Translation not found for key:', key, 'in language:', lang);
                return;
            }
            
            const translatedText = translations[lang][key];
            console.log('Translated to:', translatedText);
            
            if (element.tagName.toLowerCase() === 'option') {
                element.value = element.value; // 保持原有的值
                element.textContent = translatedText;
            } else {
                element.textContent = translatedText;
            }
        });
        
        // 更新所有帶有 data-i18n-placeholder 屬性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
        
        // 更新語言按鈕狀態
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        
        // 保存當前語言設置
        localStorage.setItem('currentLang', lang);
        
        // 重新生成團隊成員卡片以應用新語言
        generateTeamMembers('current');
    }

    // 初始化語言設置
    if (typeof translations === 'undefined') {
        console.error('translations.js 未正確加載！');
        return;
    }
    
    console.log('translations.js 已成功加載');
    
    // 綁定語言切換按鈕事件
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            updateContent(lang);
        });
    });
    
    // 設置初始語言
    const savedLang = localStorage.getItem('currentLang') || 'zh-TW';
    updateContent(savedLang);

    // 確保在DOM加載完成後重新生成團隊成員
    document.addEventListener('DOMContentLoaded', () => {
        // 確保重新生成團隊成員以應用當前語言
        const currentLang = localStorage.getItem('currentLang') || 'zh-TW';
        if (currentLang === 'en') {
            generateTeamMembers('current');
        }
    });
});