// ========================
//     取得作品 ID
// ========================

// 靜態作品頁：
// window.currentWorkId = "kumano-nii-morning"

// 舊版作品頁：
// work.html?id=kumano-nii-morning
const params =
    new URLSearchParams(
        window.location.search
    );

const workId =
    window.currentWorkId ||
    params.get("id");


// ========================
//     公開作品資料
// ========================

// getWorkDisplayTitle() / getDisplayDate() 定義在 shared.js，
// 記得在 work.html 及靜態作品頁裡於 work.js 之前載入 shared.js
//
// 只允許 published: true 的作品
const publicWorks = getPublicWorks(works);


// ========================
//     尋找目前作品
// ========================

// 只從公開作品中尋找
const work =
    publicWorks.find(
        function(item) {
            return item.id === workId;
        }
    );


// ========================
//     顯示作品
// ========================

if (work) {

    const artist =
        artists[work.artist];

    // 資料打錯字、artist id 對不到 artists.js 時，
    // 印出是哪件作品有問題，而不是讓整頁噴錯
    if (!artist) {

        console.warn(
            `找不到繪師資料：work.id = "${work.id}", artist = "${work.artist}"`
        );
    }

    const displayTitle =
        getWorkDisplayTitle(work);


    // ========================
    //     作品圖片
    // ========================

    const workImage =
        document.getElementById(
            "work-image"
        );

    const workBg =
        document.getElementById(
            "work-bg"
        );


    // 靜態作品頁位於：
    // works/作品ID/index.html
    //
    // 因此圖片要回到網站根目錄
    const imagePath =
        window.currentWorkId
            ? `../../${work.image}`
            : work.image;

    // 模糊背景用縮圖版（getThumbnailImage 定義在 shared.js），
    // 一樣要處理靜態作品頁的路徑前綴
    const thumbnailImagePath =
        window.currentWorkId
            ? `../../${getThumbnailImage(work)}`
            : getThumbnailImage(work);


    // 清晰主圖，維持原圖畫質
    workImage.style.backgroundImage =
        `url("${imagePath}")`;


    // 模糊背景（有 blur 濾鏡，用縮圖看不出差別）
    workBg.style.backgroundImage =
        `url("${thumbnailImagePath}")`;


    // ========================
    //     作品名稱
    // ========================

    document.getElementById(
        "work-title"
    ).textContent =
        displayTitle;


    // ========================
    //     繪師
    // ========================

    document.getElementById(
        "work-artist"
    ).textContent =
        artist
            ? `${artist.name} 様`
            : "";


// ========================
//     繪師相關連結
// ========================

const artistLinks =
    document.getElementById(
        "work-artist-links"
    );


// ========================
//     固定平台
// ========================

const fixedLinks = artist
    ? [
        {
            label: "X",
            url: artist.x
        },
        {
            label: "Pixiv",
            url: artist.pixiv
        },
        {
            label: "Skeb",
            url: artist.skeb
        }
    ]
    : [];


// ========================
//     建立連結
// ========================

function createArtistLink(
    label,
    url
) {

    // 沒有網址就不產生
    if (!url) {
        return;
    }


    const link =
        document.createElement(
            "a"
        );

    link.textContent =
        label;

    link.href =
        url;

    link.target =
        "_blank";

    link.rel =
        "noopener noreferrer";


    artistLinks.appendChild(
        link
    );
}


// ========================
//     顯示固定平台
// ========================

fixedLinks.forEach(
    function(link) {

        createArtistLink(
            link.label,
            link.url
        );
    }
);


// ========================
//     顯示其他連結
// ========================

if (
    artist &&
    Array.isArray(
        artist.links
    )
) {

    artist.links.forEach(
        function(link) {

            createArtistLink(
                link.label,
                link.url
            );
        }
    );
}


    // ========================
    //     完稿日期
    // ========================

    document.getElementById(
        "work-date"
    ).textContent =
        getDisplayDate(work);


    // ========================
    //     瀏覽器分頁標題
    // ========================

    document.title =
        `${displayTitle}｜白針的收藏冊`;
}


// ========================
//     找不到作品
// ========================

else {

    document.getElementById(
        "work-title"
    ).textContent =
        "找不到這件作品";


    document.title =
        "找不到作品｜白針的收藏冊";
}


// ========================
//     沒有其他作品可切換
// ========================

// 找不到作品，或公開作品只有一件時，
// 上一張／下一張按鈕直接隱藏
if (!work || publicWorks.length <= 1) {

    document.getElementById(
        "work-prev"
    ).style.display = "none";

    document.getElementById(
        "work-next"
    ).style.display = "none";
}


// ========================
//     上一張 / 下一張作品
// ========================

if (work && publicWorks.length > 1) {

    const currentIndex =
        publicWorks.findIndex(
            function(item) {
                return item.id === work.id;
            }
        );


    const prevButton =
        document.getElementById(
            "work-prev"
        );

    const nextButton =
        document.getElementById(
            "work-next"
        );


    // ========================
    //     上一張
    // ========================

    prevButton.addEventListener(
        "click",
        function() {

            const prevIndex =
                (
                    currentIndex
                    - 1
                    + publicWorks.length
                )
                % publicWorks.length;


            const prevWork =
                publicWorks[
                    prevIndex
                ];


            // 靜態作品頁位於 works/作品ID/index.html，
            // 往上一層就是其他作品資料夾；
            // 舊版 work.html?id= 則在網站根目錄，
            // 要先進入 works/ 才找得到資料夾。
            //
            // 正式網站使用乾淨網址：works/作品ID/
            // GitHub Pages 會自動載入該資料夾內的 index.html。
            window.location.href =
                window.currentWorkId
                    ? `../${prevWork.id}/`
                    : `works/${prevWork.id}/`;
        }
    );


    // ========================
    //     下一張
    // ========================

    nextButton.addEventListener(
        "click",
        function() {

            const nextIndex =
                (
                    currentIndex
                    + 1
                )
                % publicWorks.length;


            const nextWork =
                publicWorks[
                    nextIndex
                ];


            window.location.href =
                window.currentWorkId
                    ? `../${nextWork.id}/`
                    : `works/${nextWork.id}/`;
        }
    );
}