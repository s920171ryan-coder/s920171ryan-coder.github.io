// ========================
//     取得作品 ID
// ========================

// 讀取網址，例如：
// work.html?id=kumano-nii-morning

// 靜態作品頁會直接提供 ID
// 舊 work.html?id=... 仍然可以辨識
const params = new URLSearchParams(window.location.search);

const workId =
    window.currentWorkId ||
    params.get("id");


// ========================
//     尋找作品
// ========================

const work = works.find(function(item) {
    return item.id === workId;
});


// ========================
//     顯示作品
// ========================

if (work) {

    const artist = artists[work.artist];

    // 作品圖片
    const workImage =
    document.getElementById("work-image");

const workBg =
    document.getElementById("work-bg");

// 靜態作品頁位於 works/作品ID/
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

    // 作品名稱
    document.getElementById("work-title").textContent =
        work.title;

    // 繪師
    document.getElementById("work-artist").textContent =
        `${artist.name} 様`;

        // ========================
        //     繪師相關連結
        // ========================

        const artistLinks =
            document.getElementById("work-artist-links");

        // 連結名稱與 artists.js 欄位
        const linkTypes = [
            ["X", "x"],
            ["Pixiv", "pixiv"],
            ["Skeb", "skeb"],
            ["Website", "website"],
            ["Facebook", "FB"]
        ];

        // 只產生有填寫網址的項目
        linkTypes.forEach(function(linkType) {

            const label = linkType[0];
            const key = linkType[1];

            if (artist[key]) {

                const link = document.createElement("a");

                link.textContent = label;
                link.href = artist[key];

                // 在新分頁開啟
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                artistLinks.appendChild(link);
            }
        });

    // 完稿日期
    document.getElementById("work-date").textContent =
        work.date.replaceAll("-", " / ");

    // 瀏覽器分頁標題
    document.title =
        `${work.title}｜白針的收藏冊`;
}


// ========================
//     找不到作品
// ========================

else {

    document.getElementById("work-title").textContent =
        "找不到這件作品";
}

// ========================
//     上一張 / 下一張作品
// ========================

if (work) {

    // works.js 本身已經會在首頁依日期排序，
    // 單張作品頁也另外建立相同的順序
    const sortedWorks = [...works].sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    const currentIndex = sortedWorks.findIndex(function(item) {
        return item.id === work.id;
    });

    const prevButton = document.getElementById("work-prev");
    const nextButton = document.getElementById("work-next");


    // 上一張
    if (currentIndex > 0) {

        prevButton.addEventListener("click", function() {

            const prevWork = sortedWorks[currentIndex - 1];

            window.location.href =
            `../${prevWork.id}/`;
        });

    } else {
        prevButton.disabled = true;
    }


    // 下一張
    if (currentIndex < sortedWorks.length - 1) {

        nextButton.addEventListener("click", function() {

            const nextWork = sortedWorks[currentIndex + 1];

            window.location.href =
                `../${nextWork.id}/`;
        });

    } else {
        nextButton.disabled = true;
    }
}