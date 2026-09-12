// ========================
//     公開作品資料
// ========================

// 只使用允許公開的作品
// 並依完稿日期由新到舊排列
const publicWorks = works
    .filter(function(work) {
        return work.published === true;
    })
    .sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });


// ========================
//     作品顯示名稱
// ========================

// 資料中：
// character = 角色名稱
// title     = 作品標題
//
// 畫面顯示時才組合成：
// 「角色名稱 作品標題」
function getWorkDisplayTitle(work) {
    return `${work.character} ${work.title}`.trim();
}


// ========================
//     日期顯示格式
// ========================

function getDisplayDate(work) {
    return work.date.replaceAll("-", " / ");
}


// ========================
//     幻燈片元素
// ========================

const slide1 = document.getElementById("slide-image-1");
const slide2 = document.getElementById("slide-image-2");


// ---------- 第一個幻燈片 ----------

const slide1Bg =
    slide1.querySelector(".slide-bg");

const slide1Main =
    slide1.querySelector(".slide-main-image");

const slide1InfoTitle =
    slide1.querySelector(".slide-info-title");

const slide1InfoArtist =
    slide1.querySelector(".slide-info-artist");

const slide1InfoDate =
    slide1.querySelector(".slide-info-date");


// ---------- 第二個幻燈片 ----------

const slide2Bg =
    slide2.querySelector(".slide-bg");

const slide2Main =
    slide2.querySelector(".slide-main-image");

const slide2InfoTitle =
    slide2.querySelector(".slide-info-title");

const slide2InfoArtist =
    slide2.querySelector(".slide-info-artist");

const slide2InfoDate =
    slide2.querySelector(".slide-info-date");


// 目前播放到哪一件作品
let currentSlide = 0;

// true  = 第一個幻燈片目前顯示中
// false = 第二個幻燈片目前顯示中
let showingFirst = true;
// 第一張一開始可以點擊
slide1.style.pointerEvents = "auto";

// 第二張一開始隱藏，不攔截滑鼠
slide2.style.pointerEvents = "none";
// ========================
//     幻燈片目前作品
// ========================

// 記錄兩個幻燈片目前各自顯示的作品
let slide1Work = null;
let slide2Work = null;

// ========================
//     手機版主圖位置設定
// ========================

function setMobilePosition(element, work) {

    // 沒有設定時預設置中
    const position =
        work.mobilePosition ?? 50;

    /*
        完整 16:9 主圖高度 = 56.25vw
        展示模式高度       = 40vw

        可上下調整範圍：
        56.25 - 40 = 16.25vw
    */
    const maxOffset = 16.25;

    /*
        0   = 貼齊最上方
        50  = 正中央
        100 = 貼齊最下方
    */
    const offset =
        -(maxOffset * position / 100);

    element.style.setProperty(
        "--mobile-offset",
        `${offset}vw`
    );
}


// ========================
//     幻燈片作品資訊
// ========================

function setSlideInfo(
    titleElement,
    artistElement,
    dateElement,
    work
) {

    const artist =
        artists[work.artist];

    titleElement.textContent =
        getWorkDisplayTitle(work);

    artistElement.textContent =
        `${artist.name} 様`;

    dateElement.textContent =
        getDisplayDate(work);
}


// ========================
//     設定幻燈片內容
// ========================

function setSlide(
    slideBg,
    slideMain,
    titleElement,
    artistElement,
    dateElement,
    work
    
) 
{

    // 背景
    slideBg.style.backgroundImage =
        `url("${work.image}")`;

    // 清晰主圖
    slideMain.style.backgroundImage =
        `url("${work.image}")`;

    // 手機位置
    setMobilePosition(
        slideMain,
        work
    );

    // 作品資訊
    setSlideInfo(
        titleElement,
        artistElement,
        dateElement,
        work
    );
    // 記錄這個幻燈片目前顯示的作品
    if (slideMain === slide1Main) {
        slide1Work = work;
    }

    if (slideMain === slide2Main) {
        slide2Work = work;
    }
}
// ========================
//     點擊幻燈片進入作品頁
// ========================

slide1.addEventListener(
    "click",
    function() {

        if (slide1Work) {
            window.location.href =
                `works/${slide1Work.id}/`;
        }
    }
);

slide2.addEventListener(
    "click",
    function() {

        if (slide2Work) {
            window.location.href =
                `works/${slide2Work.id}/`;
        }
    }
);


// ========================
//     啟動幻燈片
// ========================

if (publicWorks.length > 0) {

    // ---------- 第一張作品 ----------

    setSlide(
        slide1Bg,
        slide1Main,
        slide1InfoTitle,
        slide1InfoArtist,
        slide1InfoDate,
        publicWorks[0]
    );


    // ========================
    //     自動輪播
    // ========================

    if (publicWorks.length > 1) {

        setInterval(function() {

            // 前往下一件作品
            currentSlide++;

            // 播放到最後後回到第一件
            if (
                currentSlide >=
                publicWorks.length
            ) {
                currentSlide = 0;
            }

            const work =
                publicWorks[currentSlide];


            // ---------- 第一張目前顯示 ----------

            if (showingFirst) {

                // 下一件作品放進第二張
                setSlide(
                    slide2Bg,
                    slide2Main,
                    slide2InfoTitle,
                    slide2InfoArtist,
                    slide2InfoDate,
                    work
                );

                slide1.style.opacity = 0;
                slide2.style.opacity = 1;

                slide1.style.pointerEvents = "none";
                slide2.style.pointerEvents = "auto";
            }


            // ---------- 第二張目前顯示 ----------

            else {

                // 下一件作品放進第一張
                setSlide(
                    slide1Bg,
                    slide1Main,
                    slide1InfoTitle,
                    slide1InfoArtist,
                    slide1InfoDate,
                    work
                );

                slide1.style.opacity = 1;
                slide2.style.opacity = 0;

                slide1.style.pointerEvents = "none";
                slide2.style.pointerEvents = "auto";
            }


            // 下次交換另一個幻燈片
            showingFirst =
                !showingFirst;

        }, 5000);
    }
}


// ========================
//     作品列表
// ========================

const worksContainer =
    document.getElementById("works");


// ========================
//     顯示指定作品
// ========================

function renderWorks(workList) {

    // 清空目前作品
    worksContainer.innerHTML = "";


    // ---------- 建立作品縮圖 ----------

    workList.forEach(function(work) {

        const article =
            document.createElement("article");

        article.className =
            "work-card";


        const displayTitle =
            getWorkDisplayTitle(work);


        article.innerHTML = `
            <div class="work-thumbnail">

                <img
                    src="${work.image}"
                    alt="${displayTitle}"
                >

                <div class="work-thumbnail-title">
                    ${displayTitle}
                </div>

            </div>
        `;


        // 點擊後前往單張作品頁
        article.addEventListener(
            "click",
            function() {

                window.location.href =
                    `works/${work.id}/`;
            }
        );


        worksContainer.appendChild(
            article
        );
    });
}


// 第一次開啟網站
// 顯示全部「已公開」作品
renderWorks(publicWorks);


// ========================
//     資料夾分類標籤
// ========================

const filterOptions =
    document.getElementById(
        "filter-options"
    );

const drawerTabs =
    document.querySelectorAll(
        ".drawer-tab"
    );

const drawerTabsContainer =
    document.querySelector(
        ".drawer-tabs"
    );
const workDrawer =
    document.querySelector(
        ".work-drawer"
    );

// 預設為「作品」
workDrawer.dataset.drawer = "all";
let filterCloseTimer;
// 記住目前選中的資料夾
let currentDrawerFilter = "all";

// ========================
//     建立子分類按鈕
// ========================

function createFilterOption(
    text,
    filteredWorks
) {

    const button =
        document.createElement("button");

    button.className =
        "filter-option";

    button.textContent =
        text;


    button.addEventListener(
        "click",
        function() {

            // 顯示篩選結果
            renderWorks(
                filteredWorks
            );

            // 收回子分類列
            filterOptions.classList.remove(
                "show"
            );
        }
    );


    filterOptions.appendChild(
        button
    );
}


// ========================
//     顯示子分類
// ========================

function showFilterOptions(filter) {

    clearTimeout(
        filterCloseTimer
    );

    // 清空上一個分類
    filterOptions.innerHTML = "";


    // ========================
    //     年份
    // ========================

    if (filter === "year") {

        const years = [
            ...new Set(
                publicWorks.map(
                    function(work) {
                        return work.date.slice(
                            0,
                            4
                        );
                    }
                )
            )
        ];


        // 新年份排在前面
        years.sort(
            function(a, b) {
                return b - a;
            }
        );


        years.forEach(
            function(year) {

                const filteredWorks =
                    publicWorks.filter(
                        function(work) {

                            return (
                                work.date.slice(
                                    0,
                                    4
                                ) === year
                            );
                        }
                    );


                createFilterOption(
                    year,
                    filteredWorks
                );
            }
        );
    }


    // ========================
    //     作者
    // ========================

    if (filter === "artist") {

        const artistIds = [
            ...new Set(
                publicWorks.map(
                    function(work) {
                        return work.artist;
                    }
                )
            )
        ];


        artistIds.forEach(
            function(artistId) {

                const filteredWorks =
                    publicWorks.filter(
                        function(work) {
                            return (
                                work.artist ===
                                artistId
                            );
                        }
                    );


                createFilterOption(
                    artists[artistId].name,
                    filteredWorks
                );
            }
        );
    }


    // ========================
    //     角色
    // ========================

    if (filter === "character") {

        const characters = [
            ...new Set(
                publicWorks.map(
                    function(work) {
                        return work.character;
                    }
                )
            )
        ];


        characters.forEach(
            function(character) {

                const filteredWorks =
                    publicWorks.filter(
                        function(work) {
                            return (
                                work.character ===
                                character
                            );
                        }
                    );


                createFilterOption(
                    character,
                    filteredWorks
                );
            }
        );
    }


    // 沒有選項時不顯示空白列
    if (
        filterOptions.children.length > 0
    ) {
        filterOptions.classList.add(
            "show"
        );
    }
}


// ========================
//     主分類標籤操作
// ========================

drawerTabs.forEach(
    function(tab) {

        // ========================
        //     滑鼠停留
        // ========================

        tab.addEventListener(
            "mouseenter",
            function() {

                clearTimeout(
                    filterCloseTimer
                );

                const filter =
                    tab.dataset.filter;
                    // 「作品」是抽屜重新展開時一定會經過的入口
// 所以單純滑過作品時，不改變目前分類
if (filter !== "all") {

    currentDrawerFilter =
        filter;

    workDrawer.dataset.drawer =
        currentDrawerFilter;

    drawerTabs.forEach(
        function(item) {
            item.classList.remove(
                "active"
            );
        }
    );

    tab.classList.add(
        "active"
    );
}


                // 「作品」沒有子分類
                if (filter === "all") {

                    filterOptions.classList.remove(
                        "show"
                    );

                    return;
                }


                showFilterOptions(
                    filter
                );
            }
        );


        // ========================
        //     點擊
        // ========================

        tab.addEventListener(
            "click",
            function() {

                // 點「作品」
                // 恢復全部公開作品
                if (
                    tab.dataset.filter ===
                    "all"
                ) {

                    renderWorks(
                        publicWorks
                    );

                    filterOptions.classList.remove(
                        "show"
                    );
                    currentDrawerFilter = "all";

workDrawer.dataset.drawer =
    "all";

drawerTabs.forEach(
    function(item) {
        item.classList.remove(
            "active"
        );
    }
);

tab.classList.add(
    "active"
);
                }
            }
        );
    }
);


// ========================
//     子分類收回
// ========================

function scheduleFilterClose() {

    clearTimeout(
        filterCloseTimer
    );

    filterCloseTimer =
        setTimeout(
            function() {

                filterOptions.classList.remove(
                    "show"
                );

            },
            150
        );
}


// 離開主分類
drawerTabsContainer.addEventListener(
    "mouseleave",
    function() {
        scheduleFilterClose();
    }
);


// 成功移進子分類
filterOptions.addEventListener(
    "mouseenter",
    function() {

        clearTimeout(
            filterCloseTimer
        );
    }
);


// 離開子分類
filterOptions.addEventListener(
    "mouseleave",
    function() {
        scheduleFilterClose();
    }
);


// ========================
//     底部作品列
// ========================

const drawerWorks =
    document.querySelector(
        ".drawer-works"
    );


// ========================
//     禁止右鍵
// ========================

drawerWorks.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();
    }
);


// ========================
//     禁止拖曳圖片
// ========================

drawerWorks.addEventListener(
    "dragstart",
    function(event) {

        event.preventDefault();
    }
);


// ========================
//     滾輪轉成橫向捲動
// ========================

drawerWorks.addEventListener(
    "wheel",
    function(event) {

        drawerWorks.scrollLeft +=
            event.deltaY;

        event.preventDefault();

    },
    {
        passive: false
    }
);