(function() {
    'use strict';

    // ================================================================
    //  常量 & 状态
    // ================================================================
    const STORAGE_KEY = 'tab_v16_gecko';
    const PRESET_GRADIENTS = [
        { name:'日落', css:'linear-gradient(135deg,#ff6b6b,#ff8e53 25%,#ff5e7a 50%,#c44dff)' },
        { name:'海洋', css:'linear-gradient(135deg,#0c3483,#1e6fbf 30%,#26a0da 60%,#00d2ff)' },
        { name:'森林', css:'linear-gradient(135deg,#134e5e,#2d8a4e 40%,#71b280 80%,#c9e4c5)' },
        { name:'星空', css:'linear-gradient(135deg,#0f0c29,#1a1a4e 30%,#302b63 60%,#4b3f72)' },
        { name:'樱花', css:'linear-gradient(135deg,#fbc2eb,#ff9a9e 35%,#fecfef 65%,#fdcbf1)' },
        { name:'极光', css:'linear-gradient(135deg,#003d4d,#006b6b 30%,#00a896 60%,#02c39a)' },
        { name:'暗夜', css:'linear-gradient(135deg,#1a1a1a,#2d2d2d 30%,#5a4a2f 60%,#8b6914)' },
        { name:'薄荷', css:'linear-gradient(135deg,#a8e6cf,#88d8b0 30%,#56c9d6 65%,#3db8c9)' },
    ];
    const PRESET_IMAGES = [
        { name:'山脉', url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80' },
        { name:'海滩', url:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80' },
        { name:'森林', url:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80' },
        { name:'城市', url:'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80' },
        { name:'星空', url:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80' },
        { name:'极光', url:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200&q=80' },
    ];
    const QUOTES = [
        { text:'生活不止眼前的苟且，还有诗和远方。', author:'高晓松' },
        { text:'不忘初心，方得始终。', author:'《华严经》' },
        { text:'世界上最快乐的事，莫过于为理想而奋斗。', author:'苏格拉底' },
        { text:'千里之行，始于足下。', author:'老子' },
        { text:'你若爱，生活哪里都可爱。', author:'丰子恺' },
        { text:'一个人可以被毁灭，但不能被打败。', author:'海明威' },
        { text:'人生如逆旅，我亦是行人。', author:'苏轼' },
        { text:'天空没有翅膀的痕迹，但鸟儿已经飞过。', author:'泰戈尔' },
        { text:'时间就像海绵里的水，只要愿挤，总还是有的。', author:'鲁迅' },
        { text:'知者不惑，仁者不忧，勇者不惧。', author:'孔子' },
        { text:'活着就是为了改变世界。', author:'乔布斯' },
        { text:'心之所向，素履以往。', author:'《周易》' },
        { text:'每一个不曾起舞的日子，都是对生命的辜负。', author:'尼采' },
        { text:'星光不问赶路人，时光不负有心人。', author:'佚名' },
        { text:'慢慢来，比较快。', author:'佚名' },
        { text:'长风破浪会有时，直挂云帆济沧海。', author:'李白' },
    ];
    const SEARCH_SUGGESTIONS = [
        '今日新闻', '天气预报', '计算器', '翻译', '地图', '股票行情',
        'AI 助手', 'GitHub', 'B站', '知乎', '豆瓣', '维基百科'
    ];

    // App 状态
    let app = {
        wallpaperType: 'preset',
        wallpaperPresetIndex: 0,
        wallpaperGradientIndex: 0,
        wallpaperSolidColor: '#1a1a2e',
        wallpaperUploaded: null,
        overlayOpacity: 28,
        blurAmount: 0,
        brightness: 100,
        overlayColor: '#000000',
        clock24h: false,
        clockShowSeconds: true,
        searchShow: true,
        searchEngine: 'google',
        weatherShow: true,
        weatherCity: 'Nanchang',
        weatherLat: null,
        weatherLon: null,
        weatherLocated: false,
        quoteShow: true,
        quoteIndex: 0,
        particlesShow: true,
        keyboardShow: true,
        autoChangeInterval: 0,
        bookmarks: [],
        todos: [],
        pomoCount: 0,
        pomodoroRunning: false,
        pomodoroSeconds: 25 * 60,
        pomodoroTotal: 25 * 60,
        pomodoroPaused: true,
        notes: [],
        countdownSeconds: 0,
        countdownRunning: false,
        countdownInterval: null,
        // 首页组件
        homeNotesShow: true,
        homeTodoShow: false,
        homeCalendarShow: false,
        dailyGoalShow: false,
        sysInfoShow: false,
        homeCountdownShow: false,
        searchSuggestShow: true,
        homeNotes: [],
        calDate: new Date(),
        dailyGoal: 0,
        dailyCompleted: 0,
        lastResetDate: '',
        sysInfo: { memory: '--', uptime: '--' },
        startTime: Date.now(),
    };

    let autoChangeTimer = null;
    let contextTarget = null;
    let todoFilter = 'all';
    let keyboardActive = false;
    let shiftActive = false;
    let capsLock = false;
    let dragData = null;
    let sysInfoInterval = null;

    // ================================================================
    //  DOM 引用
    // ================================================================
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    const D = {
        wallpaper: $('#wallpaperLayer'),
        overlay: $('#overlayLayer'),
        canvas: $('#particleCanvas'),
        clockMain: $('#timeMain'),
        clockSec: $('#timeSeconds'),
        clockDate: $('#clockDate'),
        pomoInd: $('#pomodoroIndicator'),
        searchInput: $('#searchInput'),
        searchSelect: $('#searchEngineSelect'),
        searchWrap: $('#searchWrapper'),
        searchSuggestions: $('#searchSuggestions'),
        bookmarks: $('#bookmarksContainer'),
        quoteText: $('#quoteText'),
        quoteAuthor: $('#quoteAuthor'),
        quoteWrap: $('#quoteContainer'),
        weatherWrap: $('#weatherWidget'),
        weatherIcon: $('#weatherIcon'),
        weatherTemp: $('#weatherTemp'),
        weatherDesc: $('#weatherDesc'),
        weatherCity: $('#weatherCity'),
        btnTodo: $('#btnTodo'),
        btnTools: $('#btnTools'),
        btnPomo: $('#btnPomodoro'),
        btnSettings: $('#btnSettings'),
        todoBadge: $('#todoBadge'),
        overlayBg: $('#sidebarOverlay'),
        settingsPanel: $('#settingsPanel'),
        todoPanel: $('#todoPanel'),
        toolsPanel: $('#toolsPanel'),
        context: $('#contextMenu'),
        keyboardPanel: $('#keyboardPanel'),
        keyboardRows: $('#keyboardRows'),
        keyboardToggle: $('#keyboardToggle'),
        // settings
        ovOpacity: $('#overlayOpacitySlider'),
        blur: $('#blurSlider'),
        brightness: $('#brightnessSlider'),
        ovColor: $('#overlayColorPicker'),
        solidColor: $('#solidColorPicker'),
        clock24: $('#clock24h'),
        clockSecShow: $('#clockShowSeconds'),
        searchShowChk: $('#searchShow'),
        weatherShowChk: $('#weatherShow'),
        quoteShowChk: $('#quoteShow'),
        particlesShowChk: $('#particlesShow'),
        keyboardShowChk: $('#keyboardShow'),
        homeNotesShowChk: $('#homeNotesShow'),
        homeTodoShowChk: $('#homeTodoShow'),
        homeCalendarShowChk: $('#homeCalendarShow'),
        dailyGoalShowChk: $('#dailyGoalShow'),
        sysInfoShowChk: $('#sysInfoShow'),
        homeCountdownShowChk: $('#homeCountdownShow'),
        searchSuggestShowChk: $('#searchSuggestShow'),
        autoInterval: $('#autoChangeInterval'),
        autoLabel: $('#autoChangeLabel'),
        gradGroup: $('#gradientPresetsGroup'),
        solidGroup: $('#solidColorGroup'),
        presetGroup: $('#presetImagesGroup'),
        gradGrid: $('#gradientPresets'),
        presetGrid: $('#presetImagesGrid'),
        fileInput: $('#wallpaperFileInput'),
        importInput: $('#importFileInput'),
        // todo
        todoInput: $('#todoInput'),
        todoPriority: $('#todoPrioritySelect'),
        todoList: $('#todoList'),
        // stats
        statTodo: $('#statTodo'),
        statDone: $('#statDone'),
        statBookmark: $('#statBookmark'),
        statPomo: $('#statPomo'),
        // buttons
        btnSettingsClose: $('#btnSettingsClose'),
        btnTodoClose: $('#btnTodoClose'),
        btnToolsClose: $('#btnToolsClose'),
        btnTodoAdd: $('#btnTodoAdd'),
        btnClearCompleted: $('#btnClearCompleted'),
        btnFilterAll: $('#btnFilterAll'),
        btnFilterActive: $('#btnFilterActive'),
        btnFilterDone: $('#btnFilterDone'),
        btnUpload: $('#btnUploadWallpaper'),
        btnExport: $('#btnExportData'),
        btnImport: $('#btnImportData'),
        btnReset: $('#btnResetAll'),
        // tools
        noteInput: $('#noteInput'),
        noteList: $('#noteList'),
        btnAddNote: $('#btnAddNote'),
        btnClearNotes: $('#btnClearNotes'),
        calcInput: $('#calcInput'),
        calcResult: $('#calcResult'),
        btnCalc: $('#btnCalc'),
        btnCalcClear: $('#btnCalcClear'),
        convertValue: $('#convertValue'),
        convertFrom: $('#convertFrom'),
        convertTo: $('#convertTo'),
        convertResult: $('#convertResult'),
        countdownMinutes: $('#countdownMinutes'),
        countdownDisplay: $('#countdownDisplay'),
        btnCountdownStart: $('#btnCountdownStart'),
        btnCountdownReset: $('#btnCountdownReset'),
        // 首页组件
        homeNotesContainer: $('#homeNotesContainer'),
        homeTodoContainer: $('#homeTodoContainer'),
        homeTodoList: $('#homeTodoList'),
        htCount: $('#htCount'),
        homeCalendar: $('#homeCalendar'),
        calMonthYear: $('#calMonthYear'),
        calBody: $('#calBody'),
        calPrev: $('#calPrev'),
        calNext: $('#calNext'),
        dailyGoalContainer: $('#dailyGoalContainer'),
        dgCurrent: $('#dgCurrent'),
        dgTotal: $('#dgTotal'),
        dgFill: $('#dgFill'),
        dgStatus: $('#dgStatus'),
        dailyGoalInput: $('#dailyGoalInput'),
        btnSetDailyGoal: $('#btnSetDailyGoal'),
        sysInfo: $('#sysInfo'),
        sysMem: $('#sysMem'),
        sysUptime: $('#sysUptime'),
        homeCountdown: $('#homeCountdown'),
        hcdTime: $('#hcdTime'),
    };

    // ================================================================
    //  存储
    // ================================================================
    function saveData() {
        try {
            const toStore = { ...app };
            const wData = toStore.wallpaperUploaded;
            toStore.wallpaperUploaded = wData ? '[stored]' : null;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
            if (wData && wData !== '[stored]') {
                try { localStorage.setItem(STORAGE_KEY + '_wallpaper', wData); } catch (_) {}
            }
        } catch (_) {}
    }

    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                app = { ...app, ...parsed };
            }
            const w = localStorage.getItem(STORAGE_KEY + '_wallpaper');
            if (w) {
                app.wallpaperUploaded = w;
                if (app.wallpaperType === 'upload') applyWallpaper();
            }
        } catch (_) {}
        if (!app.wallpaperUploaded && app.wallpaperType === 'upload') {
            app.wallpaperType = 'preset';
        }
        if (!app.notes) app.notes = [];
        if (!app.homeNotes) app.homeNotes = [];
        if (!app.countdownSeconds) app.countdownSeconds = 0;
        if (!app.calDate) app.calDate = new Date();
        else app.calDate = new Date(app.calDate);
        if (!app.startTime) app.startTime = Date.now();
        // 每日目标重置
        const today = new Date().toDateString();
        if (app.lastResetDate !== today) {
            app.dailyCompleted = 0;
            app.lastResetDate = today;
            saveData();
        }
    }

    // ================================================================
    //  壁纸引擎
    // ================================================================
    function applyWallpaper() {
        const layer = D.wallpaper;
        const type = app.wallpaperType;
        let newBg = '';

        if (type === 'gradient') {
            const idx = Math.min(app.wallpaperGradientIndex, PRESET_GRADIENTS.length - 1);
            newBg = PRESET_GRADIENTS[idx].css;
            layer.style.backgroundColor = '';
        } else if (type === 'solid') {
            newBg = 'none';
            layer.style.backgroundColor = app.wallpaperSolidColor;
        } else if (type === 'upload' && app.wallpaperUploaded && app.wallpaperUploaded !== '[stored]') {
            newBg = `url(${app.wallpaperUploaded})`;
            layer.style.backgroundColor = '';
        } else {
            const idx = Math.min(app.wallpaperPresetIndex, PRESET_IMAGES.length - 1);
            newBg = `url(${PRESET_IMAGES[idx].url})`;
            layer.style.backgroundColor = '';
        }

        if (layer.style.backgroundImage !== newBg || type === 'solid') {
            layer.style.backgroundImage = newBg;
            if (type === 'solid') {
                layer.style.backgroundImage = 'none';
                layer.style.backgroundColor = app.wallpaperSolidColor;
            }
        }
        applyOverlay();
    }

    function applyOverlay() {
        D.overlay.style.opacity = app.overlayOpacity / 100;
        D.overlay.style.backgroundColor = app.overlayColor;
        D.wallpaper.style.filter = `blur(${app.blurAmount}px) brightness(${app.brightness / 100})`;
        document.documentElement.style.setProperty('--overlay-opacity', app.overlayOpacity / 100);
        document.documentElement.style.setProperty('--overlay-color', app.overlayColor);
        document.documentElement.style.setProperty('--blur-amount', app.blurAmount + 'px');
        document.documentElement.style.setProperty('--brightness', app.brightness / 100);
    }

    function refreshWallpaperUI() { applyWallpaper();
        updateSettingsUI(); }

    // ================================================================
    //  粒子 (Canvas)
    // ================================================================
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let animId = null;

    function initParticles() {
        const c = D.canvas;
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        const count = Math.min(Math.floor(c.width * c.height / 6000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * c.width,
                y: Math.random() * c.height,
                size: Math.random() * 2 + 0.8,
                sx: (Math.random() - 0.5) * 0.2,
                sy: (Math.random() - 0.5) * 0.2 - 0.03,
                op: Math.random() * 0.4 + 0.05
            });
        }
    }

    function drawParticles() {
        const c = D.canvas,
            ctx = c.getContext('2d');
        const w = c.width,
            h = c.height;
        ctx.clearRect(0, 0, w, h);
        if (!app.particlesShow) { animId = requestAnimationFrame(drawParticles); return; }
        for (const p of particles) {
            p.x += p.sx + Math.sin(Date.now() * 0.0005 + p.y * 0.002) * 0.02;
            p.y += p.sy + Math.cos(Date.now() * 0.0005 + p.x * 0.002) * 0.02;
            const dx = p.x - mouse.x,
                dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) { const force = (120 - dist) / 120 * 0.25;
                p.x += (dx / dist) * force * 0.5;
                p.y += (dy / dist) * force * 0.5; }
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.op})`;
            ctx.fill();
        }
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x,
                    dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                    const alpha = (1 - dist / 90) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animId = requestAnimationFrame(drawParticles);
    }

    function startParticles() { if (animId) cancelAnimationFrame(animId);
        initParticles();
        drawParticles(); }

    // ================================================================
    //  时钟
    // ================================================================
    function updateClock() {
        const now = new Date();
        let h = now.getHours(),
            m = now.getMinutes(),
            s = now.getSeconds();
        const ampm = h >= 12 ? 'PM' : 'AM';
        let dh = h;
        if (!app.clock24h) { dh = h % 12 || 12; }
        const hStr = String(dh).padStart(2, '0'),
            mStr = String(m).padStart(2, '0'),
            sStr = String(s).padStart(2, '0');
        D.clockMain.textContent = `${hStr}:${mStr}`;
        if (app.clockShowSeconds) {
            D.clockSec.textContent = `:${sStr}`;
            D.clockSec.style.display = '';
            if (!app.clock24h) D.clockSec.textContent = `:${sStr} ${ampm}`;
        } else { D.clockSec.style.display = 'none'; if (!app.clock24h) D.clockMain.textContent =
            `${hStr}:${mStr} ${ampm}`; }
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        D.clockDate.textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${days[now.getDay()]}`;
    }

    // ================================================================
    //  搜索 & 建议
    // ================================================================
    function doSearch() {
        const q = D.searchInput.value.trim();
        if (!q) return;
        const eng = app.searchEngine || 'google';
        const map = {
            baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
            duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
            github: `https://github.com/search?q=${encodeURIComponent(q)}`,
            bilibili: `https://search.bilibili.com/all?keyword=${encodeURIComponent(q)}`,
            google: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        };
        window.open(map[eng] || map.google, '_self');
    }

    function renderSearchSuggestions(query) {
        const container = D.searchSuggestions;
        if (!query || !app.searchSuggestShow) {
            container.classList.remove('active');
            return;
        }
        const filtered = SEARCH_SUGGESTIONS.filter(s => s.includes(query) || query.includes(s));
        if (filtered.length === 0) {
            container.classList.remove('active');
            return;
        }
        container.innerHTML = filtered.map(s =>
            `<div class="sug-item" data-query="${escapeHtml(s)}"><span class="sug-icon">🔍</span> ${escapeHtml(s)}</div>`
        ).join('');
        container.classList.add('active');
        container.querySelectorAll('.sug-item').forEach(el => {
            el.addEventListener('click', () => {
                D.searchInput.value = el.dataset.query;
                container.classList.remove('active');
                doSearch();
            });
        });
    }

    // ================================================================
    //  软键盘 (保持原有)
    // ================================================================
    const KEYBOARD_LAYOUTS = {
        lower: [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
            ['123', 'space', 'hide']
        ],
        upper: [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
            ['123', 'space', 'hide']
        ],
        numbers: [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['-', '/', ':', ';', '(', ')', '¥', '&', '@', '"'],
            ['.', ',', '?', '!', "'", '`', '~', '%', '^', '*'],
            ['ABC', 'space', 'hide']
        ]
    };

    let currentLayout = 'lower';

    function renderKeyboard() {
        const rows = D.keyboardRows;
        let layout = KEYBOARD_LAYOUTS[currentLayout];
        if (currentLayout === 'lower' && shiftActive) {
            layout = KEYBOARD_LAYOUTS.upper;
        }
        let html = '';
        for (const row of layout) {
            html += '<div class="keyboard-row">';
            for (const key of row) {
                let cls = 'key';
                let label = key;
                let dataAction = '';
                if (key === 'shift') {
                    cls += ' shift';
                    label = shiftActive ? '⇧' : '⇧';
                    if (shiftActive) cls += ' active-shift';
                    dataAction = 'shift';
                } else if (key === 'backspace') {
                    cls += ' backspace';
                    label = '⌫';
                    dataAction = 'backspace';
                } else if (key === 'space') {
                    cls += ' space';
                    label = '空格';
                    dataAction = 'space';
                } else if (key === 'hide') {
                    cls += ' hide-keyboard';
                    label = '▼';
                    dataAction = 'hide';
                } else if (key === '123' || key === 'ABC') {
                    cls += ' special';
                    label = key;
                    dataAction = 'switch';
                } else if (key === 'return') {
                    cls += ' return';
                    label = '↵';
                    dataAction = 'return';
                } else {
                    dataAction = 'char';
                }
                html += `<button class="${cls}" data-action="${dataAction}" data-char="${key}">${label}</button>`;
            }
            html += '</div>';
        }
        rows.innerHTML = html;

        rows.querySelectorAll('.key').forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                const char = btn.dataset.char;
                handleKeyAction(action, char);
            });
        });
    }

    function handleKeyAction(action, char) {
        const input = D.searchInput;
        switch (action) {
            case 'char':
                const val = shiftActive && currentLayout === 'lower' ? char.toUpperCase() : char;
                insertAtCursor(input, val);
                if (shiftActive && !capsLock) {
                    shiftActive = false;
                    renderKeyboard();
                }
                break;
            case 'shift':
                if (currentLayout === 'lower' || currentLayout === 'upper') {
                    shiftActive = !shiftActive;
                    renderKeyboard();
                }
                break;
            case 'backspace':
                if (input.selectionStart > 0) {
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    if (start === end) {
                        input.value = input.value.slice(0, start - 1) + input.value.slice(start);
                        input.setSelectionRange(start - 1, start - 1);
                    } else {
                        input.value = input.value.slice(0, start) + input.value.slice(end);
                        input.setSelectionRange(start, start);
                    }
                }
                input.focus();
                break;
            case 'space':
                insertAtCursor(input, ' ');
                input.focus();
                break;
            case 'hide':
                toggleKeyboard(false);
                input.focus();
                break;
            case 'switch':
                if (currentLayout === 'lower' || currentLayout === 'upper') {
                    currentLayout = 'numbers';
                    shiftActive = false;
                } else {
                    currentLayout = 'lower';
                    shiftActive = false;
                }
                renderKeyboard();
                break;
            case 'return':
                doSearch();
                toggleKeyboard(false);
                break;
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function insertAtCursor(input, text) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const before = input.value.slice(0, start);
        const after = input.value.slice(end);
        input.value = before + text + after;
        const newPos = start + text.length;
        input.setSelectionRange(newPos, newPos);
        input.focus();
    }

    function toggleKeyboard(show) {
        if (show === undefined) {
            keyboardActive = !keyboardActive;
        } else {
            keyboardActive = show;
        }
        if (keyboardActive && app.keyboardShow) {
            D.keyboardPanel.classList.add('active');
            D.keyboardToggle.classList.add('active');
            D.keyboardToggle.textContent = '⌨️ ✕';
            D.searchInput.focus();
            D.searchInput.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } else {
            D.keyboardPanel.classList.remove('active');
            D.keyboardToggle.classList.remove('active');
            D.keyboardToggle.textContent = '⌨️';
        }
        renderKeyboard();
    }

    // ================================================================
    //  书签
    // ================================================================
    function renderBookmarks() {
        const c = D.bookmarks;
        let html = '';
        app.bookmarks.forEach((bm, i) => {
            const letter = (bm.name || '?').charAt(0).toUpperCase();
            html += `<div class="bookmark-item" data-index="${i}" title="${escapeHtml(bm.name)}\n${escapeHtml(bm.url)}" data-url="${escapeHtml(bm.url)}">
                        <div class="bookmark-icon">${letter}</div><div class="bookmark-name">${escapeHtml(bm.name)}</div></div>`;
        });
        html +=
            `<div class="bookmark-add" id="bookmarkAddBtn"><div class="bookmark-icon">+</div><div class="bookmark-name">添加</div></div>`;
        c.innerHTML = html;
        c.querySelectorAll('.bookmark-item').forEach(el => {
            el.addEventListener('click', () => { if (el.dataset.url) window.open(el.dataset.url,
                '_self'); });
            el.addEventListener('contextmenu', (e) => { e.preventDefault();
                showContextMenu(e, parseInt(el.dataset.index)); });
        });
        const addBtn = $('#bookmarkAddBtn');
        if (addBtn) addBtn.addEventListener('click', () => showBookmarkDialog());
        updateStats();
    }

    function showBookmarkDialog(editIdx = null) {
        const isEdit = editIdx !== null;
        const old = isEdit ? app.bookmarks[editIdx] : { name: '', url: '' };
        const name = prompt('书签名称：', old.name || '');
        if (name === null) return;
        let url = prompt('网址 (含 https://)：', old.url || 'https://');
        if (url === null) return;
        url = url.trim();
        if (!name.trim() || !url) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        if (isEdit) app.bookmarks[editIdx] = { name: name.trim(), url };
        else app.bookmarks.push({ name: name.trim(), url });
        saveData();
        renderBookmarks();
    }

    function deleteBookmark(idx) {
        if (confirm(`删除「${app.bookmarks[idx].name}」？`)) { app.bookmarks.splice(idx, 1);
            saveData();
            renderBookmarks();
            updateStats(); }
    }

    // ================================================================
    //  右键菜单
    // ================================================================
    function showContextMenu(e, idx) {
        contextTarget = idx;
        const menu = D.context;
        let x = e.clientX,
            y = e.clientY;
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) menu.style.left = (x - rect.width) + 'px';
        if (rect.bottom > window.innerHeight) menu.style.top = (y - rect.height) + 'px';
        menu.classList.add('active');
        e.preventDefault();
    }

    function hideContext() { D.context.classList.remove('active');
        contextTarget = null; }

    // ================================================================
    //  待办 (含首页待办)
    // ================================================================
    function renderTodos() {
        let filtered = [...app.todos];
        if (todoFilter === 'active') filtered = filtered.filter(t => !t.completed);
        else if (todoFilter === 'done') filtered = filtered.filter(t => t.completed);
        const list = D.todoList;
        list.innerHTML = filtered.map((t, i) => {
            const realIdx = app.todos.indexOf(t);
            const pri = t.priority || 'medium';
            const priLabel = { high:'🔴', medium:'🟡', low:'🟢' } [pri] || '🟡';
            return `<div class="todo-item ${t.completed?'completed':''}" data-index="${realIdx}">
                        <div class="todo-priority ${pri}"></div>
                        <div class="todo-check">${t.completed?'✓':''}</div>
                        <span class="todo-text">${escapeHtml(t.text)}</span>
                        <span style="font-size:0.55rem;opacity:0.3;margin-left:auto;">${priLabel}</span>
                        <button class="todo-delete">删除</button>
                    </div>`;
        }).join('');
        list.querySelectorAll('.todo-check').forEach(el => {
            el.addEventListener('click', () => { const idx = parseInt(el.closest('.todo-item').dataset
                    .index);
                app.todos[idx].completed = !app.todos[idx].completed;
                if (app.todos[idx].completed) app.dailyCompleted = (app.dailyCompleted || 0) + 1;
                saveData();
                renderTodos();
                updateTodoBadge();
                updateStats();
                renderHomeTodos();
                updateDailyGoal();
            });
        });
        list.querySelectorAll('.todo-text').forEach(el => {
            el.addEventListener('click', () => { const idx = parseInt(el.closest('.todo-item').dataset
                    .index);
                app.todos[idx].completed = !app.todos[idx].completed;
                if (app.todos[idx].completed) app.dailyCompleted = (app.dailyCompleted || 0) + 1;
                saveData();
                renderTodos();
                updateTodoBadge();
                updateStats();
                renderHomeTodos();
                updateDailyGoal();
            });
        });
        list.querySelectorAll('.todo-delete').forEach(el => {
            el.addEventListener('click', (e) => { e.stopPropagation(); const idx = parseInt(el
                    .closest('.todo-item').dataset.index);
                app.todos.splice(idx, 1);
                saveData();
                renderTodos();
                updateTodoBadge();
                updateStats();
                renderHomeTodos();
                updateDailyGoal();
            });
        });
        updateTodoBadge();
        updateStats();
        renderHomeTodos();
        updateDailyGoal();
    }

    function addTodo() {
        const text = D.todoInput.value.trim();
        if (!text) return;
        const priority = D.todoPriority.value;
        app.todos.push({ text, completed: false, priority });
        saveData();
        renderTodos();
        D.todoInput.value = '';
        D.todoInput.focus();
    }

    function updateTodoBadge() {
        const left = app.todos.filter(t => !t.completed).length;
        if (left > 0) { D.todoBadge.style.display = 'flex';
            D.todoBadge.textContent = left; } else D.todoBadge.style.display = 'none';
    }

    // 首页待办
    function renderHomeTodos() {
        const container = D.homeTodoContainer;
        const list = D.homeTodoList;
        if (!app.homeTodoShow) { container.style.display = 'none'; return; }
        container.style.display = 'block';
        const active = app.todos.filter(t => !t.completed);
        const total = app.todos.length;
        D.htCount.textContent = `${active.length}/${total}`;
        if (active.length === 0 && total === 0) {
            list.innerHTML = `<div class="home-todo-empty">🎉 暂无待办</div>`;
            return;
        }
        const show = total > 5 ? active.slice(0, 5) : app.todos;
        list.innerHTML = show.map((t, i) => {
            const realIdx = app.todos.indexOf(t);
            const done = t.completed ? 'done' : '';
            return `<div class="home-todo-item ${done}" data-idx="${realIdx}">
                        <span class="ht-check">${t.completed?'✓':''}</span>
                        <span class="ht-text">${escapeHtml(t.text)}</span>
                    </div>`;
        }).join('');
        list.querySelectorAll('.home-todo-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.idx);
                if (isNaN(idx)) return;
                app.todos[idx].completed = !app.todos[idx].completed;
                if (app.todos[idx].completed) app.dailyCompleted = (app.dailyCompleted || 0) + 1;
                saveData();
                renderTodos();
                renderHomeTodos();
                updateDailyGoal();
            });
        });
    }

    // ================================================================
    //  名言
    // ================================================================
    function refreshQuote() {
        app.quoteIndex = Math.floor(Math.random() * QUOTES.length);
        const q = QUOTES[app.quoteIndex];
        D.quoteText.textContent = '“' + q.text + '”';
        D.quoteAuthor.textContent = '—— ' + q.author;
        saveData();
    }

    // ================================================================
    //  天气 (修复版: 优先浏览器定位，IP定位作为备选，并增加城市切换)
    // ================================================================
    async function fetchWeatherByCoords(lat, lon) {
        try {
            const resp = await fetch(
                `https://wttr.in/${lat},${lon}?format=j1&lang=zh`,
                { signal: AbortSignal.timeout(8000) }
            );
            if (!resp.ok) throw new Error('Network response was not ok');
            const data = await resp.json();

            const cur = data.current_condition && data.current_condition[0] ? data.current_condition[0] : null;
            const area = data.nearest_area && data.nearest_area[0] ? data.nearest_area[0] : null;

            if (!cur) throw new Error('No weather data');

            const temp = cur.temp_C || '--';
            const desc = cur.weatherDesc && cur.weatherDesc[0] ? cur.weatherDesc[0].value : '未知';
            const code = cur.weatherCode ? parseInt(cur.weatherCode) : 0;
            const city = area && area.areaName && area.areaName[0] ? area.areaName[0].value : '未知';
            const region = area && area.region && area.region[0] ? area.region[0].value : '';

            D.weatherTemp.textContent = temp + '°C';
            D.weatherDesc.textContent = desc;
            D.weatherIcon.textContent = getWeatherEmoji(code);
            D.weatherCity.textContent = '📍 ' + (region ? `${city},${region}` : city);

            app.weatherCity = city;
            app.weatherLocated = true;
            app.weatherLat = lat;
            app.weatherLon = lon;
            saveData();
        } catch (err) {
            console.warn('Weather fetch failed:', err);
            fallbackWeather();
        }
    }

    async function fetchWeatherByCity(city) {
        try {
            const resp = await fetch(
                `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`,
                { signal: AbortSignal.timeout(6000) }
            );
            if (!resp.ok) throw new Error();
            const data = await resp.json();
            const cur = data.current_condition && data.current_condition[0] ? data.current_condition[0] : null;
            const area = data.nearest_area && data.nearest_area[0] ? data.nearest_area[0] : null;

            if (!cur) throw new Error('No data');

            const temp = cur.temp_C || '--';
            const desc = cur.weatherDesc && cur.weatherDesc[0] ? cur.weatherDesc[0].value : '未知';
            const code = cur.weatherCode ? parseInt(cur.weatherCode) : 0;
            const loc = area && area.areaName && area.areaName[0] ? area.areaName[0].value : city;

            D.weatherTemp.textContent = temp + '°C';
            D.weatherDesc.textContent = desc;
            D.weatherIcon.textContent = getWeatherEmoji(code);
            D.weatherCity.textContent = '📍 ' + loc;

            app.weatherCity = loc;
            app.weatherLocated = true;
            saveData();
        } catch (_) {
            fallbackWeather();
        }
    }

    function fallbackWeather() {
        D.weatherTemp.textContent = '--°C';
        D.weatherDesc.textContent = '获取失败';
        D.weatherIcon.textContent = '🌤️';
        D.weatherCity.textContent = '📍 点击重试';
        app.weatherLocated = false;
        D.weatherCity.classList.remove('weather-locating');
    }

    function getWeatherEmoji(code) {
        if (code <= 1) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 6) return '☁️';
        if (code <= 9) return '🌫️';
        if (code <= 12) return '🌧️';
        if (code <= 15) return '⛈️';
        if (code <= 18) return '🌦️';
        if (code <= 21) return '🌨️';
        if (code <= 24) return '❄️';
        if (code <= 27) return '🌪️';
        return '🌤️';
    }

    // 定位策略: 优先浏览器定位 -> IP定位 -> 默认城市
    function locateAndFetchWeather() {
        if (!app.weatherShow) return;
        D.weatherCity.textContent = '📍 定位中…';
        D.weatherCity.classList.add('weather-locating');

        // 1. 优先使用浏览器地理定位 (最准确)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    D.weatherCity.classList.remove('weather-locating');
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    fetchWeatherByCoords(lat, lon);
                },
                (err) => {
                    D.weatherCity.classList.remove('weather-locating');
                    console.warn('Geolocation failed:', err.message);
                    // 2. 浏览器定位失败，尝试 IP 定位
                    fetchWeatherByIP();
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            // 浏览器不支持定位，尝试 IP 定位
            fetchWeatherByIP();
        }
    }

    function fetchWeatherByIP() {
        // 使用 ipapi.co 获取位置
        fetch('https://ipapi.co/json/')
            .then(res => {
                if (!res.ok) throw new Error('IP API failed');
                return res.json();
            })
            .then(data => {
                D.weatherCity.classList.remove('weather-locating');
                // 检查返回的城市是否有效，过滤掉 "Qili" 等无效值
                let city = data.city || data.region || data.country_name || '';
                // 如果城市名是 "Qili" 或类似无效值，使用地区或国家
                const invalidCities = ['qili', 'Qili', 'qi li', 'unknown', 'null', ''];
                if (invalidCities.includes(city.toLowerCase()) || city.length < 2) {
                    city = data.region || data.country_name || 'Unknown';
                }
                if (data.latitude && data.longitude && city && city !== 'Unknown') {
                    app.weatherCity = city;
                    fetchWeatherByCoords(data.latitude, data.longitude);
                } else {
                    throw new Error('No valid location data');
                }
            })
            .catch(() => {
                D.weatherCity.classList.remove('weather-locating');
                // 3. 所有定位都失败，使用默认城市 (用户可手动更改)
                const defaultCity = app.weatherCity || 'Beijing';
                fetchWeatherByCity(defaultCity);
            });
    }

    // 手动切换城市
    function showCityPicker() {
        const city = prompt('请输入您所在的城市名 (例如: Shanghai, 北京, Tokyo):', app.weatherCity || '');
        if (city && city.trim()) {
            const newCity = city.trim();
            app.weatherCity = newCity;
            app.weatherLocated = false;
            saveData();
            D.weatherCity.textContent = '📍 ' + newCity + '…';
            fetchWeatherByCity(newCity);
        }
    }

    // ================================================================
    //  番茄钟
    // ================================================================
    function updatePomoDisplay() {
        const m = Math.floor(app.pomodoroSeconds / 60),
            s = app.pomodoroSeconds % 60;
        D.pomoInd.textContent = `🍅 ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        D.pomoInd.classList.remove('running', 'paused');
        if (app.pomodoroRunning && !app.pomodoroPaused) D.pomoInd.classList.add('running');
        else if (app.pomodoroRunning) D.pomoInd.classList.add('paused');
    }

    function togglePomodoro() {
        if (!app.pomodoroRunning) {
            app.pomodoroRunning = true;
            app.pomodoroPaused = false;
            app.pomodoroSeconds = app.pomodoroTotal;
            D.pomoInd.style.display = 'inline-block';
            updatePomoDisplay();
            saveData();
        } else if (!app.pomodoroPaused) {
            app.pomodoroPaused = true;
            updatePomoDisplay();
            saveData();
        } else {
            app.pomodoroPaused = false;
            updatePomoDisplay();
            saveData();
        }
    }

    function resetPomodoro() {
        app.pomodoroRunning = false;
        app.pomodoroPaused = true;
        app.pomodoroSeconds = app.pomodoroTotal;
        D.pomoInd.style.display = 'none';
        updatePomoDisplay();
        saveData();
    }

    // ================================================================
    //  统计
    // ================================================================
    function updateStats() {
        D.statTodo.textContent = app.todos.length;
        D.statDone.textContent = app.todos.filter(t => t.completed).length;
        D.statBookmark.textContent = app.bookmarks.length;
        D.statPomo.textContent = app.pomoCount || 0;
    }

    // ================================================================
    //  每日目标
    // ================================================================
    function updateDailyGoal() {
        const container = D.dailyGoalContainer;
        if (!app.dailyGoalShow || app.dailyGoal <= 0) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';
        const completed = app.todos.filter(t => t.completed).length;
        const total = app.dailyGoal;
        const pct = Math.min(100, (completed / total) * 100);
        D.dgCurrent.textContent = completed;
        D.dgTotal.textContent = total;
        D.dgFill.style.width = pct + '%';
        if (completed >= total) {
            D.dgStatus.textContent = '🎉 目标达成！';
        } else {
            D.dgStatus.textContent = `剩余 ${total - completed} 项`;
        }
    }

    function setDailyGoal() {
        const val = parseInt(D.dailyGoalInput.value);
        if (isNaN(val) || val < 0) { alert('请输入有效的数字'); return; }
        app.dailyGoal = val;
        app.dailyCompleted = 0;
        app.lastResetDate = new Date().toDateString();
        saveData();
        updateDailyGoal();
        D.dailyGoalInput.value = '';
        updateSettingsUI();
    }

    // ================================================================
    //  系统信息
    // ================================================================
    function updateSysInfo() {
        if (!app.sysInfoShow) { D.sysInfo.style.display = 'none'; return; }
        D.sysInfo.style.display = 'flex';
        if (navigator.deviceMemory) {
            D.sysMem.textContent = `💾 ${navigator.deviceMemory.toFixed(0)}GB`;
        } else {
            D.sysMem.textContent = '💾 --';
        }
        const uptime = Math.floor((Date.now() - app.startTime) / 1000);
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        D.sysUptime.textContent = `⏱ ${h}h${String(m).padStart(2,'0')}m`;
    }

    // ================================================================
    //  首页倒计时小部件
    // ================================================================
    function updateHomeCountdown() {
        if (!app.homeCountdownShow) { D.homeCountdown.style.display = 'none'; return; }
        D.homeCountdown.style.display = 'block';
        const total = app.countdownSeconds || 0;
        const m = Math.floor(total / 60);
        const s = total % 60;
        D.hcdTime.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    // ================================================================
    //  设置UI
    // ================================================================
    function updateSettingsUI() {
        D.ovOpacity.value = app.overlayOpacity;
        D.blur.value = app.blurAmount;
        D.brightness.value = app.brightness;
        D.ovColor.value = app.overlayColor;
        D.solidColor.value = app.wallpaperSolidColor;
        D.clock24.checked = app.clock24h;
        D.clockSecShow.checked = app.clockShowSeconds;
        D.searchShowChk.checked = app.searchShow;
        D.weatherShowChk.checked = app.weatherShow;
        D.quoteShowChk.checked = app.quoteShow;
        D.particlesShowChk.checked = app.particlesShow;
        D.keyboardShowChk.checked = app.keyboardShow;
        D.homeNotesShowChk.checked = app.homeNotesShow;
        D.homeTodoShowChk.checked = app.homeTodoShow;
        D.homeCalendarShowChk.checked = app.homeCalendarShow;
        D.dailyGoalShowChk.checked = app.dailyGoalShow;
        D.sysInfoShowChk.checked = app.sysInfoShow;
        D.homeCountdownShowChk.checked = app.homeCountdownShow;
        D.searchSuggestShowChk.checked = app.searchSuggestShow;
        D.autoInterval.value = app.autoChangeInterval;
        D.autoLabel.textContent = app.autoChangeInterval === 0 ? '关闭' : app.autoChangeInterval + '分钟';
        D.searchSelect.value = app.searchEngine;

        D.gradGroup.style.display = app.wallpaperType === 'gradient' ? 'flex' : 'none';
        D.solidGroup.style.display = app.wallpaperType === 'solid' ? 'flex' : 'none';
        D.presetGroup.style.display = app.wallpaperType === 'preset' ? 'flex' : 'none';

        $$('.wallpaper-src-btn').forEach(b => b.classList.remove('accent'));
        const active = document.querySelector(`.wallpaper-src-btn[data-src="${app.wallpaperType}"]`);
        if (active) active.classList.add('accent');

        D.gradGrid.innerHTML = PRESET_GRADIENTS.map((g, i) =>
            `<div class="preset-dot ${app.wallpaperType==='gradient' && app.wallpaperGradientIndex===i?'active':''}" style="background:${g.css};" data-index="${i}" title="${g.name}"></div>`
            ).join('');
        D.presetGrid.innerHTML = PRESET_IMAGES.map((img, i) =>
            `<div class="preset-dot ${app.wallpaperType==='preset' && app.wallpaperPresetIndex===i?'active':''}" style="background-image:url(${img.url});background-size:cover;background-position:center;" data-index="${i}" title="${img.name}"></div>`
            ).join('');

        D.searchWrap.style.display = app.searchShow ? '' : 'none';
        D.weatherWrap.style.display = app.weatherShow ? '' : 'none';
        D.quoteWrap.style.display = app.quoteShow ? '' : 'none';
        D.canvas.style.display = app.particlesShow ? '' : 'none';
        if (!app.keyboardShow && keyboardActive) toggleKeyboard(false);
        updateStats();
        renderHomeNotes();
        renderHomeTodos();
        renderHomeCalendar();
        updateDailyGoal();
        updateSysInfo();
        updateHomeCountdown();
        if (!app.searchSuggestShow) D.searchSuggestions.classList.remove('active');
    }

    // ================================================================
    //  上传壁纸
    // ================================================================
    function handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) { alert('请选择图片'); return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            app.wallpaperType = 'upload';
            app.wallpaperUploaded = data;
            applyWallpaper();
            updateSettingsUI();
            saveData();
        };
        reader.readAsDataURL(file);
    }

    // ================================================================
    //  数据导出导入
    // ================================================================
    function exportData() {
        const exp = { ...app };
        exp.wallpaperUploaded = exp.wallpaperUploaded === '[stored]' ? null : exp.wallpaperUploaded;
        const blob = new Blob([JSON.stringify(exp, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tab_gecko_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importData(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.bookmarks && Array.isArray(data.bookmarks)) {
                    app = { ...app, ...data };
                    if (app.wallpaperType === 'upload' && app.wallpaperUploaded && app.wallpaperUploaded !==
                        '[stored]') {
                        localStorage.setItem(STORAGE_KEY + '_wallpaper', app.wallpaperUploaded);
                    }
                    saveData();
                    refreshWallpaperUI();
                    renderBookmarks();
                    renderTodos();
                    refreshQuote();
                    locateAndFetchWeather();
                    startParticles();
                    setupAutoChange();
                    updateSettingsUI();
                    updateClock();
                    renderNotes();
                    renderHomeNotes();
                    renderHomeCalendar();
                    updateDailyGoal();
                    updateSysInfo();
                    updateHomeCountdown();
                    closePanels();
                    alert('✅ 数据导入成功！');
                } else alert('❌ 无效数据格式');
            } catch (_) { alert('❌ 文件解析失败'); }
        };
        reader.readAsText(file);
    }

    function resetAll() {
        if (confirm('⚠️ 重置所有数据？不可恢复！')) {
            if (confirm('再次确认？')) {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(STORAGE_KEY + '_wallpaper');
                location.reload();
            }
        }
    }

    // ================================================================
    //  自动换壁纸
    // ================================================================
    function setupAutoChange() {
        if (autoChangeTimer) clearInterval(autoChangeTimer);
        if (app.autoChangeInterval > 0) {
            autoChangeTimer = setInterval(() => {
                if (app.wallpaperType === 'gradient') app.wallpaperGradientIndex = Math.floor(Math
                    .random() * PRESET_GRADIENTS.length);
                else if (app.wallpaperType === 'preset') app.wallpaperPresetIndex = Math.floor(Math
                    .random() * PRESET_IMAGES.length);
                applyWallpaper();
                updateSettingsUI();
                saveData();
            }, app.autoChangeInterval * 60 * 1000);
        }
    }

    // ================================================================
    //  面板控制
    // ================================================================
    function openPanel(panel) { panel.classList.add('active');
        D.overlayBg.classList.add('active');
        document.body.style.overflow = 'hidden'; }

    function closePanels() {
        D.settingsPanel.classList.remove('active');
        D.todoPanel.classList.remove('active');
        D.toolsPanel.classList.remove('active');
        D.overlayBg.classList.remove('active');
        document.body.style.overflow = '';
        hideContext();
    }

    // ================================================================
    //  便签 (工具箱内 & 首页)
    // ================================================================
    function renderNotes() {
        const list = D.noteList;
        if (!app.notes) app.notes = [];
        list.innerHTML = app.notes.map((note, i) =>
            `<div class="note-item"><span>${escapeHtml(note)}</span><span class="del-note" data-idx="${i}">✕</span></div>`
        ).join('');
        list.querySelectorAll('.del-note').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.idx);
                app.notes.splice(idx, 1);
                app.homeNotes = [...app.notes];
                saveData();
                renderNotes();
                renderHomeNotes();
            });
        });
    }

    function addNote() {
        const text = D.noteInput.value.trim();
        if (!text) return;
        app.notes.push(text);
        app.homeNotes = [...app.notes];
        D.noteInput.value = '';
        saveData();
        renderNotes();
        renderHomeNotes();
    }

    function clearNotes() {
        if (app.notes.length === 0) return;
        if (confirm('清空所有便签？')) { app.notes = [];
            app.homeNotes = [];
            saveData();
            renderNotes();
            renderHomeNotes(); }
    }

    // ================================================================
    //  首页便签 (可拖动)
    // ================================================================
    function renderHomeNotes() {
        const container = D.homeNotesContainer;
        if (!app.homeNotes || app.homeNotes.length === 0 || !app.homeNotesShow) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = app.homeNotes.map((note, i) =>
            `<div class="home-note-item" data-idx="${i}" style="touch-action:none;">
                        <span class="note-text">${escapeHtml(note)}</span>
                        <button class="note-del" data-idx="${i}">✕</button>
                    </div>`
        ).join('');

        container.querySelectorAll('.note-del').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(el.dataset.idx);
                app.homeNotes.splice(idx, 1);
                app.notes = [...app.homeNotes];
                saveData();
                renderHomeNotes();
                renderNotes();
            });
        });

        container.querySelectorAll('.home-note-item').forEach(el => {
            const startDrag = (e) => {
                const rect = el.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                if (!clientX || !clientY) return;
                dragData = {
                    el: el,
                    offsetX: clientX - rect.left,
                    offsetY: clientY - rect.top,
                    startX: rect.left,
                    startY: rect.top,
                    moved: false,
                };
                el.style.cursor = 'grabbing';
                el.style.transition = 'none';
                el.style.zIndex = '20';
                if (e.type === 'mousedown') {
                    document.addEventListener('mousemove', onDragMove);
                    document.addEventListener('mouseup', onDragEnd);
                } else {
                    document.addEventListener('touchmove', onDragMove, { passive: false });
                    document.addEventListener('touchend', onDragEnd);
                    document.addEventListener('touchcancel', onDragEnd);
                }
                e.preventDefault();
            };
            el.addEventListener('mousedown', startDrag);
            el.addEventListener('touchstart', startDrag, { passive: false });
        });
    }

    function onDragMove(e) {
        if (!dragData) return;
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (!clientX || !clientY) return;
        const el = dragData.el;
        let x = clientX - dragData.offsetX;
        let y = clientY - dragData.offsetY;
        const maxX = window.innerWidth - el.offsetWidth - 10;
        const maxY = window.innerHeight - el.offsetHeight - 10;
        x = Math.max(10, Math.min(maxX, x));
        y = Math.max(10, Math.min(maxY, y));
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.position = 'fixed';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        dragData.moved = true;
    }

    function onDragEnd(e) {
        if (!dragData) return;
        const el = dragData.el;
        el.style.cursor = 'grab';
        el.style.transition = '';
        el.style.zIndex = '';
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('touchend', onDragEnd);
        document.removeEventListener('touchcancel', onDragEnd);
        dragData = null;
    }

    // ================================================================
    //  首页日历
    // ================================================================
    function renderHomeCalendar() {
        const cal = D.homeCalendar;
        if (!app.homeCalendarShow) {
            cal.classList.remove('visible');
            return;
        }
        cal.classList.add('visible');

        const date = app.calDate || new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        D.calMonthYear.textContent = `${year}年${month+1}月`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrev = new Date(year, month, 0).getDate();

        let html = '<tr>';
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<td class="other">${daysInPrev - i}</td>`;
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = (d === todayDate && month === todayMonth && year === todayYear);
            html += `<td class="${isToday?'today':''}">${d}</td>`;
            if ((firstDay + d - 1) % 7 === 6) html += '</tr><tr>';
        }
        const remaining = (7 - (firstDay + daysInMonth) % 7) % 7;
        for (let i = 1; i <= remaining; i++) {
            html += `<td class="other">${i}</td>`;
        }
        html += '</tr>';
        D.calBody.innerHTML = html;
    }

    // ================================================================
    //  计算器 (工具箱)
    // ================================================================
    function doCalc() {
        const expr = D.calcInput.value.trim();
        if (!expr) { D.calcResult.textContent = '= 请输入表达式'; return; }
        try {
            const result = Function('"use strict"; return (' + expr + ')')();
            if (typeof result === 'number' && !isNaN(result)) {
                D.calcResult.textContent = '= ' + (Number.isInteger(result) ? result : result.toFixed(4));
            } else {
                D.calcResult.textContent = '= 无效';
            }
        } catch (_) { D.calcResult.textContent = '= 错误'; }
    }

    // ================================================================
    //  单位换算 (工具箱)
    // ================================================================
    const unitFactors = {
        cm: 0.01,
        m: 1,
        km: 1000,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344,
    };

    function doConvert() {
        const val = parseFloat(D.convertValue.value);
        if (isNaN(val) || val < 0) { D.convertResult.textContent = '= 请输入正数'; return; }
        const from = D.convertFrom.value;
        const to = D.convertTo.value;
        if (!unitFactors[from] || !unitFactors[to]) { D.convertResult.textContent = '= 单位不支持'; return; }
        const meters = val * unitFactors[from];
        const result = meters / unitFactors[to];
        D.convertResult.textContent = `= ${result.toFixed(4)} ${to}`;
    }

    // ================================================================
    //  倒计时 (工具箱 & 首页)
    // ================================================================
    function updateCountdownDisplay() {
        const total = app.countdownSeconds || 0;
        const m = Math.floor(total / 60);
        const s = total % 60;
        D.countdownDisplay.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        updateHomeCountdown();
    }

    function startCountdown() {
        if (app.countdownRunning) return;
        const mins = parseInt(D.countdownMinutes.value) || 0;
        if (mins <= 0) { alert('请输入有效的分钟数'); return; }
        app.countdownSeconds = mins * 60;
        app.countdownRunning = true;
        updateCountdownDisplay();
        D.btnCountdownStart.textContent = '⏸';
        if (app.countdownInterval) clearInterval(app.countdownInterval);
        app.countdownInterval = setInterval(() => {
            if (app.countdownSeconds <= 0) {
                clearInterval(app.countdownInterval);
                app.countdownInterval = null;
                app.countdownRunning = false;
                D.btnCountdownStart.textContent = '▶';
                updateCountdownDisplay();
                alert('⏰ 倒计时结束！');
                return;
            }
            app.countdownSeconds--;
            updateCountdownDisplay();
        }, 1000);
    }

    function resetCountdown() {
        if (app.countdownInterval) { clearInterval(app.countdownInterval);
            app.countdownInterval = null; }
        app.countdownRunning = false;
        app.countdownSeconds = 0;
        D.btnCountdownStart.textContent = '▶';
        updateCountdownDisplay();
        D.countdownMinutes.value = 5;
    }

    // ================================================================
    //  Event Bindings
    // ================================================================
    function bindEvents() {
        // 搜索
        D.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { doSearch();
                D.searchSuggestions.classList.remove('active'); }
        });
        D.searchInput.addEventListener('input', (e) => {
            renderSearchSuggestions(e.target.value.trim());
        });
        D.searchInput.addEventListener('blur', () => {
            setTimeout(() => D.searchSuggestions.classList.remove('active'), 200);
        });
        D.searchInput.addEventListener('focus', () => {
            const val = D.searchInput.value.trim();
            if (val) renderSearchSuggestions(val);
        });
        D.searchSelect.addEventListener('change', () => { app.searchEngine = D.searchSelect.value;
            saveData(); });

        // 键盘切换
        D.keyboardToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!app.keyboardShow) {
                alert('软键盘已在设置中关闭，请在设置中开启。');
                return;
            }
            toggleKeyboard();
        });

        document.addEventListener('pointerdown', (e) => {
            if (keyboardActive) {
                const panel = D.keyboardPanel;
                const toggle = D.keyboardToggle;
                const input = D.searchInput;
                if (!panel.contains(e.target) && !toggle.contains(e.target) && !input.contains(e
                    .target)) {
                    toggleKeyboard(false);
                }
            }
        });

        // 设置
        D.btnSettings.addEventListener('click', () => { updateSettingsUI();
            openPanel(D.settingsPanel); });
        D.btnSettingsClose.addEventListener('click', closePanels);
        D.overlayBg.addEventListener('click', closePanels);

        // 待办
        D.btnTodo.addEventListener('click', () => { renderTodos();
            openPanel(D.todoPanel);
            setTimeout(() => D.todoInput?.focus(), 300); });
        D.btnTodoClose.addEventListener('click', closePanels);
        D.btnTodoAdd.addEventListener('click', addTodo);
        D.todoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodo(); });
        D.btnClearCompleted.addEventListener('click', () => { app.todos = app.todos.filter(t => !t.completed);
            saveData();
            renderTodos(); });
        D.btnFilterAll.addEventListener('click', () => { todoFilter = 'all';
            renderTodos(); });
        D.btnFilterActive.addEventListener('click', () => { todoFilter = 'active';
            renderTodos(); });
        D.btnFilterDone.addEventListener('click', () => { todoFilter = 'done';
            renderTodos(); });

        // 工具箱
        D.btnTools.addEventListener('click', () => { renderNotes();
            openPanel(D.toolsPanel); });
        D.btnToolsClose.addEventListener('click', closePanels);

        // 便签 (工具箱)
        D.btnAddNote.addEventListener('click', addNote);
        D.btnClearNotes.addEventListener('click', clearNotes);
        D.noteInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e
                .preventDefault();
                addNote(); } });

        // 计算器
        D.btnCalc.addEventListener('click', doCalc);
        D.btnCalcClear.addEventListener('click', () => { D.calcInput.value = '';
            D.calcResult.textContent = '='; });
        D.calcInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCalc(); });

        // 换算
        D.convertValue.addEventListener('input', doConvert);
        D.convertFrom.addEventListener('change', doConvert);
        D.convertTo.addEventListener('change', doConvert);

        // 倒计时
        D.btnCountdownStart.addEventListener('click', startCountdown);
        D.btnCountdownReset.addEventListener('click', resetCountdown);
        D.countdownMinutes.addEventListener('keydown', (e) => { if (e.key === 'Enter') startCountdown(); });

        // 番茄钟
        D.btnPomo.addEventListener('click', togglePomodoro);
        D.btnPomo.addEventListener('dblclick', resetPomodoro);
        D.pomoInd.addEventListener('click', togglePomodoro);
        D.pomoInd.addEventListener('dblclick', (e) => { e.stopPropagation();
            resetPomodoro(); });

        // 名言 & 天气
        D.quoteWrap.addEventListener('click', refreshQuote);
        D.weatherWrap.addEventListener('click', locateAndFetchWeather);
        // 双击切换城市
        D.weatherWrap.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            showCityPicker();
        });

        // 设置滑块
        D.ovOpacity.addEventListener('input', () => { app.overlayOpacity = parseInt(D.ovOpacity.value);
            applyOverlay();
            saveData(); });
        D.blur.addEventListener('input', () => { app.blurAmount = parseInt(D.blur.value);
            applyOverlay();
            saveData(); });
        D.brightness.addEventListener('input', () => { app.brightness = parseInt(D.brightness.value);
            applyOverlay();
            saveData(); });
        D.ovColor.addEventListener('input', () => { app.overlayColor = D.ovColor.value;
            applyOverlay();
            saveData(); });
        D.solidColor.addEventListener('input', () => { app.wallpaperSolidColor = D.solidColor.value; if (app
                .wallpaperType === 'solid') applyWallpaper();
            saveData(); });

        // 复选框
        D.clock24.addEventListener('change', () => { app.clock24h = D.clock24.checked;
            updateClock();
            saveData(); });
        D.clockSecShow.addEventListener('change', () => { app.clockShowSeconds = D.clockSecShow.checked;
            updateClock();
            saveData(); });
        D.searchShowChk.addEventListener('change', () => { app.searchShow = D.searchShowChk.checked;
            D.searchWrap.style.display = app.searchShow ? '' : 'none';
            saveData(); });
        D.weatherShowChk.addEventListener('change', () => { app.weatherShow = D.weatherShowChk.checked;
            D.weatherWrap.style.display = app.weatherShow ? '' : 'none'; if (app.weatherShow)
                locateAndFetchWeather();
            saveData(); });
        D.quoteShowChk.addEventListener('change', () => { app.quoteShow = D.quoteShowChk.checked;
            D.quoteWrap.style.display = app.quoteShow ? '' : 'none';
            saveData(); });
        D.particlesShowChk.addEventListener('change', () => { app.particlesShow = D.particlesShowChk.checked;
            D.canvas.style.display = app.particlesShow ? '' : 'none';
            saveData(); });
        D.keyboardShowChk.addEventListener('change', () => {
            app.keyboardShow = D.keyboardShowChk.checked;
            if (!app.keyboardShow && keyboardActive) toggleKeyboard(false);
            saveData();
        });
        D.homeNotesShowChk.addEventListener('change', () => {
            app.homeNotesShow = D.homeNotesShowChk.checked;
            renderHomeNotes();
            saveData();
        });
        D.homeTodoShowChk.addEventListener('change', () => {
            app.homeTodoShow = D.homeTodoShowChk.checked;
            renderHomeTodos();
            saveData();
        });
        D.homeCalendarShowChk.addEventListener('change', () => {
            app.homeCalendarShow = D.homeCalendarShowChk.checked;
            renderHomeCalendar();
            saveData();
        });
        D.dailyGoalShowChk.addEventListener('change', () => {
            app.dailyGoalShow = D.dailyGoalShowChk.checked;
            updateDailyGoal();
            saveData();
        });
        D.sysInfoShowChk.addEventListener('change', () => {
            app.sysInfoShow = D.sysInfoShowChk.checked;
            updateSysInfo();
            saveData();
        });
        D.homeCountdownShowChk.addEventListener('change', () => {
            app.homeCountdownShow = D.homeCountdownShowChk.checked;
            updateHomeCountdown();
            saveData();
        });
        D.searchSuggestShowChk.addEventListener('change', () => {
            app.searchSuggestShow = D.searchSuggestShowChk.checked;
            if (!app.searchSuggestShow) D.searchSuggestions.classList.remove('active');
            saveData();
        });
        D.autoInterval.addEventListener('input', () => { app.autoChangeInterval = parseInt(D.autoInterval
                .value);
            D.autoLabel.textContent = app.autoChangeInterval === 0 ? '关闭' : app.autoChangeInterval +
                '分钟';
            setupAutoChange();
            saveData(); });

        // 每日目标
        D.btnSetDailyGoal.addEventListener('click', setDailyGoal);
        D.dailyGoalInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') setDailyGoal(); });

        // 壁纸源
        $$('.wallpaper-src-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.src;
                if (type === 'upload' && !app.wallpaperUploaded) { D.fileInput.click(); return; }
                app.wallpaperType = type;
                applyWallpaper();
                updateSettingsUI();
                saveData();
            });
        });
        D.btnUpload.addEventListener('click', () => D.fileInput.click());
        D.fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleImageUpload(e.target
                .files[0]); });

        // 预设点击
        D.gradGrid.addEventListener('click', (e) => {
            const dot = e.target.closest('.preset-dot');
            if (!dot) return;
            app.wallpaperGradientIndex = parseInt(dot.dataset.index);
            app.wallpaperType = 'gradient';
            applyWallpaper();
            updateSettingsUI();
            saveData();
        });
        D.presetGrid.addEventListener('click', (e) => {
            const dot = e.target.closest('.preset-dot');
            if (!dot) return;
            app.wallpaperPresetIndex = parseInt(dot.dataset.index);
            app.wallpaperType = 'preset';
            applyWallpaper();
            updateSettingsUI();
            saveData();
        });

        // 数据管理
        D.btnExport.addEventListener('click', exportData);
        D.btnImport.addEventListener('click', () => D.importInput.click());
        D.importInput.addEventListener('change', (e) => { if (e.target.files[0]) importData(e.target.files[
                0]); });
        D.btnReset.addEventListener('click', resetAll);

        // 右键菜单
        document.addEventListener('click', (e) => { if (!D.context.contains(e.target)) hideContext(); });
        D.context.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (!item) return;
            if (item.dataset.action === 'edit' && contextTarget !== null) showBookmarkDialog(
            contextTarget);
            else if (item.dataset.action === 'delete' && contextTarget !== null) deleteBookmark(
                contextTarget);
            hideContext();
        });

        // 日历控制
        D.calPrev.addEventListener('click', () => {
            app.calDate.setMonth(app.calDate.getMonth() - 1);
            renderHomeCalendar();
        });
        D.calNext.addEventListener('click', () => {
            app.calDate.setMonth(app.calDate.getMonth() + 1);
            renderHomeCalendar();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePanels();
                if (keyboardActive) toggleKeyboard(false);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault();
                D.searchInput.focus();
                D.searchInput.select(); }
            if ((e.ctrlKey || e.metaKey) && e.key === ',') { e.preventDefault();
                updateSettingsUI();
                openPanel(D.settingsPanel); }
            if ((e.ctrlKey || e.metaKey) && e.key === 't') { e.preventDefault();
                renderTodos();
                openPanel(D.todoPanel);
                setTimeout(() => D.todoInput?.focus(), 300); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault();
                togglePomodoro(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'q') { e.preventDefault();
                refreshQuote(); }
        });

        // 窗口
        window.addEventListener('resize', () => { initParticles(); });
        document.addEventListener('mousemove', (e) => { mouse.x = e.clientX;
            mouse.y = e.clientY; });
        document.addEventListener('mouseleave', () => { mouse.x = -9999;
            mouse.y = -9999; });
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer?.files?.[0];
            if (file && file.type.startsWith('image/')) handleImageUpload(file);
        });

        if ('Notification' in window && Notification.permission === 'default') {
            setTimeout(() => Notification.requestPermission(), 3000);
        }
    }

    // ================================================================
    //  番茄钟 Tick
    // ================================================================
    setInterval(() => {
        if (app.pomodoroRunning && !app.pomodoroPaused) {
            app.pomodoroSeconds--;
            updatePomoDisplay();
            if (app.pomodoroSeconds <= 0) {
                app.pomodoroRunning = false;
                app.pomodoroPaused = true;
                app.pomodoroSeconds = app.pomodoroTotal;
                app.pomoCount = (app.pomoCount || 0) + 1;
                D.pomoInd.style.display = 'none';
                updatePomoDisplay();
                saveData();
                updateStats();
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('🍅 番茄钟完成！', { body: '休息一下吧～' });
                }
                alert('🍅 番茄钟时间到！休息一下吧～');
            }
        }
    }, 1000);

    // ================================================================
    //  系统信息定时更新
    // ================================================================
    setInterval(() => {
        if (app.sysInfoShow) updateSysInfo();
    }, 30000);

    // ================================================================
    //  工具
    // ================================================================
    function escapeHtml(str) { const d = document.createElement('div');
        d.textContent = str; return d.innerHTML; }

    function setCopyrightYear() {
        const el = document.getElementById('currentYear');
        if (el) el.textContent = new Date().getFullYear();
    }

    // ================================================================
    //  Init
    // ================================================================
    function init() {
        loadData();
        refreshWallpaperUI();
        updateSettingsUI();
        renderBookmarks();
        renderTodos();
        renderNotes();
        renderHomeNotes();
        renderHomeTodos();
        renderHomeCalendar();
        updateDailyGoal();
        updateSysInfo();
        updateHomeCountdown();
        updateClock();
        setInterval(updateClock, 1000);
        startParticles();
        renderKeyboard();
        setCopyrightYear();
        updateCountdownDisplay();

        if (app.quoteShow) {
            if (app.quoteIndex >= 0 && app.quoteIndex < QUOTES.length) {
                const q = QUOTES[app.quoteIndex];
                D.quoteText.textContent = '“' + q.text + '”';
                D.quoteAuthor.textContent = '—— ' + q.author;
            } else refreshQuote();
        }
        if (app.weatherShow) {
            locateAndFetchWeather();
        }
        // 每30分钟刷新天气
        setInterval(() => { if (app.weatherShow) locateAndFetchWeather(); }, 30 * 60 * 1000);

        D.searchWrap.style.display = app.searchShow ? '' : 'none';
        D.weatherWrap.style.display = app.weatherShow ? '' : 'none';
        D.quoteWrap.style.display = app.quoteShow ? '' : 'none';
        D.canvas.style.display = app.particlesShow ? '' : 'none';

        if (app.pomodoroRunning) { D.pomoInd.style.display = 'inline-block';
            updatePomoDisplay(); }

        setupAutoChange();
        bindEvents();

        console.log('✅ 新标签页 V1.6 Gecko Pro 已启动 — 天气定位已修复，过滤 "Qili" 等无效城市');
        console.log('   🖼️ 壁纸: ' + app.wallpaperType + ' | 🔖 ' + app.bookmarks.length + ' 书签 | 📋 ' + app.todos
            .length + ' 待办');
        console.log('   📝 双击天气组件可手动切换城市');
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();
