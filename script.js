// ========================
//     公開作品資料
// ========================

// getWorkDisplayTitle() / getDisplayDate() 定義在 shared.js，
// 記得在 index.html 裡於 script.js 之前載入 shared.js
const publicWorks = getPublicWorks(works);


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
        手機固定 Hero 高度 = 39vw

        可上下裁切調整範圍：
        56.25 - 39 = 17.25vw

        mobilePosition：
        0   = 保留圖片上方
        50  = 置中裁切
        100 = 保留圖片下方
    */
    const maxOffset = 17.25;

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
                `works/${slide1Work.id}/index.html`;
        }
    }
);

slide2.addEventListener(
    "click",
    function() {

        if (slide2Work) {
            window.location.href =
                `works/${slide2Work.id}/index.html`;
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

                slide1.style.pointerEvents = "auto";
                slide2.style.pointerEvents = "none";
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
                    `works/${work.id}/index.html`;
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
        document.createElement(
            "button"
        );

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


    return button;
}


// ========================
//     建立子分類資料
// ========================

function getFilterOptionList(
    filter
) {

    const optionList = [];


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


                optionList.push({
                    text: year,
                    works: filteredWorks
                });
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


                optionList.push({
                    text:
                        artists[artistId].name,

                    works:
                        filteredWorks
                });
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


                optionList.push({
                    text: character,
                    works: filteredWorks
                });
            }
        );
    }


    return optionList;
}


// ========================
//     子分類位置
// ========================

function setFilterOptionsPosition(
    tab
) {

    const parent =
        filterOptions.offsetParent;

    if (!parent) {
        return;
    }


    const parentRect =
        parent.getBoundingClientRect();

    const tabRect =
        tab.getBoundingClientRect();


    // 子分類列中心
    // 對準目前主分類標籤中心
    const center =
        tabRect.left +
        tabRect.width / 2 -
        parentRect.left;


    filterOptions.style.setProperty(
        "--filter-center",
        `${center}px`
    );
}


// ========================
//     顯示子分類
// ========================

function showFilterOptions(
    filter,
    tab
) {

    clearTimeout(
        filterCloseTimer
    );


    // 清空上一個分類
    filterOptions.innerHTML = "";

    filterOptions.classList.remove(
        "is-short"
    );


    const optionList =
        getFilterOptionList(
            filter
        );


    // 沒有選項時不顯示
    if (optionList.length === 0) {

        filterOptions.classList.remove(
            "show"
        );

        return;
    }


    // 讓子分類列中心
    // 對準目前主標籤中心
    setFilterOptionsPosition(
        tab
    );


    // 建立真正可捲動的軌道
    const track =
        document.createElement(
            "div"
        );

    track.className =
        "filter-track";


    // ========================
    //     3 個以下
    // ========================

    if (optionList.length <= 3) {

        filterOptions.classList.add(
            "is-short"
        );


        optionList.forEach(
            function(item) {

                track.appendChild(
                    createFilterOption(
                        item.text,
                        item.works
                    )
                );
            }
        );
    }


    // ========================
    //     超過 3 個
    // ========================

    else {

        /*
            建立三份相同內容：

            [前一組] [中間組] [下一組]

            平常停在中間組。
            接近任一端時，
            瞬間搬回相同位置的另一組，
            視覺上就會形成無限循環。
        */
        for (
            let copy = 0;
            copy < 3;
            copy++
        ) {

            optionList.forEach(
                function(item, index) {

                    const button =
                        createFilterOption(
                            item.text,
                            item.works
                        );


                    button.dataset.copy =
                        copy;

                    button.dataset.index =
                        index;


                    track.appendChild(
                        button
                    );
                }
            );
        }
    }


    filterOptions.appendChild(
        track
    );


    filterOptions.classList.add(
        "show"
    );


    // ========================
    //     無限循環初始化
    // ========================

    if (optionList.length > 3) {

        requestAnimationFrame(
            function() {

                const middleFirst =
                    track.querySelector(
                        '[data-copy="1"][data-index="0"]'
                    );

                const nextFirst =
                    track.querySelector(
                        '[data-copy="2"][data-index="0"]'
                    );


                if (
                    !middleFirst ||
                    !nextFirst
                ) {
                    return;
                }


                // 一整組選項的實際寬度
                const sectionWidth =
                    nextFirst.offsetLeft -
                    middleFirst.offsetLeft;


                // 一開始讓中間組的第一個選項
                // 位於顯示區中央附近
                track.scrollLeft =
                    middleFirst.offsetLeft -
                    (
                        track.clientWidth -
                        middleFirst.offsetWidth
                    ) / 2;


                // ------------------------
                //     無限循環
                // ------------------------

                track.addEventListener(
                    "scroll",
                    function() {

                        /*
                            捲進第一組時，
                            搬到中間組的相同位置。
                        */
                        if (
                            track.scrollLeft <
                            sectionWidth * 0.55
                        ) {

                            track.scrollLeft +=
                                sectionWidth;
                        }


                        /*
                            捲進第三組時，
                            搬回中間組的相同位置。
                        */
                        else if (
                            track.scrollLeft >
                            sectionWidth * 1.55
                        ) {

                            track.scrollLeft -=
                                sectionWidth;
                        }
                    }
                );


                // ------------------------
                //     滾輪轉成橫向捲動
                // ------------------------

                track.addEventListener(
                    "wheel",
                    function(event) {

                        const amount =
                            Math.abs(event.deltaY) >
                            Math.abs(event.deltaX)
                                ? event.deltaY
                                : event.deltaX;


                        track.scrollLeft +=
                            amount;


                        event.preventDefault();
                    },
                    {
                        passive: false
                    }
                );
            }
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
                    filter,
                    tab
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

        // 桌面版維持橫向作品列；
        // 手機 / 直向版改成正常上下捲動，不攔截滾輪。
        if (
            window.matchMedia(
                "(max-width: 700px), (orientation: portrait)"
            ).matches
        ) {
            return;
        }

        drawerWorks.scrollLeft +=
            event.deltaY;

        event.preventDefault();

    },
    {
        passive: false
    }
);

// ========================
//     ABOUT 覆蓋層
// ========================

const aboutOpen =
    document.getElementById(
        "about-open"
    );

const aboutOverlay =
    document.getElementById(
        "about-overlay"
    );

const aboutClose =
    document.getElementById(
        "about-close"
    );


function openAbout() {

    aboutOverlay.classList.add(
        "show"
    );

    aboutOverlay.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeAbout() {

    // 關閉前先把焦點移出即將隱藏的 ABOUT，
    // 避免 aria-hidden 與鍵盤焦點衝突。
    if (
        aboutOverlay.contains(
            document.activeElement
        )
    ) {
        aboutOpen.focus();
    }

    aboutOverlay.classList.remove(
        "show"
    );

    aboutOverlay.setAttribute(
        "aria-hidden",
        "true"
    );
}


aboutOpen.addEventListener(
    "click",
    openAbout
);


aboutClose.addEventListener(
    "click",
    closeAbout
);


aboutOverlay.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            aboutOverlay
        ) {
            closeAbout();
        }
    }
);


document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            aboutOverlay.classList.contains(
                "show"
            )
        ) {
            closeAbout();
        }
    }
);


// ========================
//     語言切換後重新整理 UI
// ========================

window.addEventListener(
    "languagechange",
    function() {

        // 作品名稱、角色名、繪師名不翻譯，
        // 因此只需要重新套用目前網站介面文字。
        if (
            typeof applyLanguage ===
            "function"
        ) {
            applyLanguage();
        }
    }
);
