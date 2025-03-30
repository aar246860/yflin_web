// 載入動畫
window.addEventListener('load', () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        loaderWrapper.style.opacity = '0';
        setTimeout(() => {
            loaderWrapper.style.display = 'none';
        }, 500);
    }, 1000);
});

// 動態游標
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

// 深色模式切換
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function toggleTheme() {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    icon.className = document.body.dataset.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', toggleTheme);

// 初始化主題
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.dataset.theme = savedTheme;
} else if (prefersDarkScheme.matches) {
    document.body.dataset.theme = 'dark';
}
updateThemeIcon();

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
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
    
    // 這裡可以添加發送表單數據到後端的代碼
    console.log('表單提交數據：', formData);
    
    // 顯示成功消息
    alert('感謝您的合作提案！我們會盡快與您聯繫。');
    
    // 重置表單
    this.reset();
});

// 漢堡選單
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 點擊導航連結時關閉選單
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// 點擊外部時關閉選單
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navLinks.classList.remove('active');
    }
});

// 延遲載入圖片
document.addEventListener('DOMContentLoaded', () => {
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
}); 