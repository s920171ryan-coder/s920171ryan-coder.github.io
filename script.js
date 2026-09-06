// ========================
//     完稿日期排序
// ========================

// 最新作品排在前面，最舊作品排在後面
works.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
});


// ========================
//     幻燈片元素
// ========================

// 兩個交替淡入淡出的幻燈片容器
const slide1 = document.getElementById("slide-image-1");
const slide2 = document.getElementById("slide-image-2");

// 第一個幻燈片的模糊背景與清晰主圖
const slide1Bg = slide1.querySelector(".slide-bg");
const slide1Main = slide1.querySelector(".slide-main-image");
const slide1InfoTitle = slide1.querySelector(".slide-info-title");
const slide1InfoArtist = slide1.querySelector(".slide-info-artist");
const slide1InfoDate = slide1.querySelector(".slide-info-date");

// 第二個幻燈片的模糊背景與清晰主圖
const slide2Bg = slide2.querySelector(".slide-bg");
const slide2Main = slide2.querySelector(".slide-main-image");
const slide2InfoTitle = slide2.querySelector(".slide-info-title");
const slide2InfoArtist = slide2.querySelector(".slide-info-artist");
const slide2InfoDate = slide2.querySelector(".slide-info-date");

// 目前播放到哪一件作品
let currentSlide = 0;

// true = 第一張目前顯示中
// false = 第二張目前顯示中
let showingFirst = true;


// ========================
//     手機版主圖位置設定
// ========================

function setMobilePosition(element, work) {

    // 沒有設定時，預設為 50（正中央）
    const position = work.mobilePosition ?? 50;

    /*
        完整 16:9 主圖高度 = 56.25vw
        展示模式高度 = 40vw

        所以最多有：
        56.25 - 40 = 16.25vw
        可以上下調整。
    */
    const maxOffset = 16.25;

    /*
        0   = 貼齊最上方
        50  = 正中央
        100 = 貼齊最下方
    */
    const offset = -(maxOffset * position / 100);

    element.style.setProperty("--mobile-offset", `${offset}vw`);
}


// ========================
//     幻燈片作品資訊設定
// ========================

function setSlideInfo(titleElement, artistElement, dateElement, work) {

    const artist = artists[work.artist];

    titleElement.textContent = work.title;
    artistElement.textContent = `${artist.name} 様`;
    dateElement.textContent = work.date.replaceAll("-", " / ");
}


// ========================
//     設定第一張作品
// ========================

// 背景與主圖使用同一張作品
slide1Bg.style.backgroundImage = `url("${works[0].image}")`;
slide1Main.style.backgroundImage = `url("${works[0].image}")`;
setMobilePosition(slide1Main, works[0]);

setSlideInfo(
    slide1InfoTitle,
    slide1InfoArtist,
    slide1InfoDate,
    works[0]
);


// ========================
//     自動輪播
// ========================

setInterval(function() {

    // 前往下一件作品
    currentSlide++;

    // 播放到最後一件後回到第一件
    if (currentSlide >= works.length) {
        currentSlide = 0;
    }

    if (showingFirst) {

        // 把下一張作品放進第二個幻燈片
        slide2Bg.style.backgroundImage = `url("${works[currentSlide].image}")`;
        slide2Main.style.backgroundImage = `url("${works[currentSlide].image}")`;
        setMobilePosition(slide2Main, works[currentSlide]);

        setSlideInfo(
            slide2InfoTitle,
            slide2InfoArtist,
            slide2InfoDate,
            works[currentSlide]
        );

        // 第一張淡出，第二張淡入
        slide1.style.opacity = 0;
        slide2.style.opacity = 1;

    } else {

        // 把下一張作品放進第一個幻燈片
        slide1Bg.style.backgroundImage = `url("${works[currentSlide].image}")`;
        slide1Main.style.backgroundImage = `url("${works[currentSlide].image}")`;
        setMobilePosition(slide1Main, works[currentSlide]);

        setSlideInfo(
            slide1InfoTitle,
            slide1InfoArtist,
            slide1InfoDate,
            works[currentSlide]
        );

        // 第一張淡入，第二張淡出
        slide1.style.opacity = 1;
        slide2.style.opacity = 0;
    }

    // 下次交換另一個幻燈片
    showingFirst = !showingFirst;

}, 5000);


// ========================
//     最新作品列表
// ========================

const worksContainer = document.getElementById("works");

// 顯示指定的作品
function renderWorks(workList) {

    // 先清空目前的作品
    worksContainer.innerHTML = "";

    // 重新產生作品
    workList.forEach(function(work) {

        const article = document.createElement("article");
        article.className = "work-card";

        article.innerHTML = `
            <div class="work-thumbnail">
                <img src="${work.image}" alt="${work.title}">
                <div class="work-thumbnail-title">${work.title}</div>
            </div>
        `;
        // 點擊作品後，前往單張作品頁
        article.addEventListener("click", function() {
            window.location.href = `works/${work.id}/`;
        });

        worksContainer.appendChild(article);
    });
}

// 第一次開啟網站時，顯示全部作品
renderWorks(works);


// ========================
//     資料夾分類標籤
// ========================

const filterOptions = document.getElementById("filter-options");
const drawerTabs = document.querySelectorAll(".drawer-tab");
const drawerTabsContainer = document.querySelector(".drawer-tabs");

let filterCloseTimer;


// ========================
//     建立一個子分類按鈕
// ========================

function createFilterOption(text, filteredWorks) {

    const button = document.createElement("button");

    button.className = "filter-option";
    button.textContent = text;

    button.addEventListener("click", function() {

        // 顯示篩選後的作品
        renderWorks(filteredWorks);

        // 選完後收回子分類列
        filterOptions.classList.remove("show");
    });

    filterOptions.appendChild(button);
}


// ========================
//     顯示子分類
// ========================

function showFilterOptions(filter) {

    clearTimeout(filterCloseTimer);

    // 清空上一個分類
    filterOptions.innerHTML = "";

    // ---------- 年份 ----------
    if (filter === "year") {

        const years = [
            ...new Set(
                works.map(function(work) {
                    return work.date.slice(0, 4);
                })
            )
        ];

        years.sort(function(a, b) {
            return b - a;
        });

        years.forEach(function(year) {

            const filteredWorks = works.filter(function(work) {
                return work.date.slice(0, 4) === year;
            });

            createFilterOption(year, filteredWorks);
        });
    }


    // ---------- 作者 ----------
    if (filter === "artist") {

        const artistIds = [
            ...new Set(
                works.map(function(work) {
                    return work.artist;
                })
            )
        ];

        artistIds.forEach(function(artistId) {

            const filteredWorks = works.filter(function(work) {
                return work.artist === artistId;
            });

            createFilterOption(
                artists[artistId].name,
                filteredWorks
            );
        });
    }


    // ---------- 角色 ----------
    if (filter === "character") {

        const characters = [
            ...new Set(
                works.map(function(work) {
                    return work.character;
                })
            )
        ];

        characters.forEach(function(character) {

            const filteredWorks = works.filter(function(work) {
                return work.character === character;
            });

            createFilterOption(
                character,
                filteredWorks
            );
        });
    }

    filterOptions.classList.add("show");
}


// ========================
//     主分類標籤操作
// ========================

drawerTabs.forEach(function(tab) {

    // 滑鼠停上去
    tab.addEventListener("mouseenter", function() {

        clearTimeout(filterCloseTimer);

        const filter = tab.dataset.filter;

        // 「作品」沒有子分類
        if (filter === "all") {
            filterOptions.classList.remove("show");
            return;
        }

        showFilterOptions(filter);
    });

    // 點「作品」恢復全部作品
    tab.addEventListener("click", function() {

        if (tab.dataset.filter === "all") {

            renderWorks(works);
            filterOptions.classList.remove("show");
        }
    });
});


// ========================
//     子分類收回
// ========================

function scheduleFilterClose() {

    clearTimeout(filterCloseTimer);

    filterCloseTimer = setTimeout(function() {
        filterOptions.classList.remove("show");
    }, 150);
}

// 離開上方主分類
drawerTabsContainer.addEventListener("mouseleave", function() {
    scheduleFilterClose();
});

// 成功移進子分類，取消收回
filterOptions.addEventListener("mouseenter", function() {
    clearTimeout(filterCloseTimer);
});

// 離開子分類，收回
filterOptions.addEventListener("mouseleave", function() {
    scheduleFilterClose();
});

// ========================
//     底部作品列：滾輪橫向捲動
// ========================

const drawerWorks = document.querySelector(".drawer-works");

drawerWorks.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

drawerWorks.addEventListener("dragstart", function(event) {
    event.preventDefault();
});

drawerWorks.addEventListener("wheel", function(event) {
    drawerWorks.scrollLeft += event.deltaY;
    event.preventDefault();
}, { passive: false });
