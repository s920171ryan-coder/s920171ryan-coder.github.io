// ========================
//     共用作品邏輯
// ========================
//
// 這支檔案同時給瀏覽器（index.html / work.html /
// 產生出來的靜態作品頁）跟 Node（generate-pages.js）使用，
// 避免同一套規則在三個地方各自維護一份、改了忘記同步。

(function(root) {

    // ========================
    //     公開作品
    // ========================

    // 只保留允許公開的作品，
    // 並依完稿日期由新到舊排列
    function getPublicWorks(works) {

        return works
            .filter(function(work) {
                return work.published === true;
            })
            .sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });
    }


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
    //     縮圖路徑
    // ========================

    // 原圖：images/xxx.jpg
    // 縮圖：images/thumbs/xxx.jpg
    //
    // 縮圖檔案由 generate-thumbnails.js 產生，
    // 這裡只是依規則算出路徑，不做任何圖片處理
    function getThumbnailImage(work) {

        return work.image.replace(
            "images/",
            "images/thumbs/"
        );
    }


    // ========================
    //     匯出
    // ========================

    const sharedWorks = {
        getPublicWorks: getPublicWorks,
        getWorkDisplayTitle: getWorkDisplayTitle,
        getDisplayDate: getDisplayDate,
        getThumbnailImage: getThumbnailImage
    };

    // Node（generate-pages.js 用 require 讀取）
    if (typeof module !== "undefined" && module.exports) {
        module.exports = sharedWorks;
    }

    // 瀏覽器（index.html / work.html / 靜態作品頁用 <script> 讀取）
    if (typeof window !== "undefined") {
        window.getPublicWorks = getPublicWorks;
        window.getWorkDisplayTitle = getWorkDisplayTitle;
        window.getDisplayDate = getDisplayDate;
        window.getThumbnailImage = getThumbnailImage;
    }

})(typeof globalThis !== "undefined" ? globalThis : this);
