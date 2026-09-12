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

// 只允許 published: true 的作品
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

function getWorkDisplayTitle(work) {

    return `${work.character} ${work.title}`.trim();
}


// ========================
//     日期顯示格式
// ========================

function getDisplayDate(work) {

    return work.date.replaceAll(
        "-",
        " / "
    );
}


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


    // 清晰主圖
    workImage.style.backgroundImage =
        `url("${imagePath}")`;


    // 模糊背景
    workBg.style.backgroundImage =
        `url("${imagePath}")`;


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
        `${artist.name} 様`;


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

const fixedLinks = [
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
];


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


            window.location.href =
                `../${prevWork.id}/`;
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
                `../${nextWork.id}/`;
        }
    );
}