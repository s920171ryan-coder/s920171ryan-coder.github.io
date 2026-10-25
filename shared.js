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
    // 作品名稱和篩選標籤分開處理。
    // 例如 character: "ヒメヒナ" 仍顯示「ヒメヒナ」，
    // 但角色篩選裡有「田中ヒメ」及「鈴木ヒナ」。
    const characterFilterAliases = {
        "ヒメヒナ": ["田中ヒメ", "鈴木ヒナ"]
    };

    function getWorkCharacters(work) {
        const value = work.character;
        const list = Array.isArray(value) ? value : [value];

        return [...new Set(list
            .filter(name => typeof name === "string")
            .flatMap(name => name.split(/[＋+]/u))
            .map(name => name.trim())
            .filter(Boolean)
            .flatMap(name => characterFilterAliases[name] || [name])
        )];
    }

    function getWorkDisplayTitle(work) {
        const value = work.character;
        const names = (Array.isArray(value) ? value : [value])
            .filter(name => typeof name === "string")
            .map(name => name.trim())
            .filter(Boolean);

        // 兼容先前已手動拆分的資料，標題仍維持組合名稱。
        const isHimeHina = names.length === 2 &&
            names.includes("田中ヒメ") && names.includes("鈴木ヒナ");

        const characterLabel = isHimeHina ? "ヒメヒナ" : names.join("・");
        return `${characterLabel} ${work.title || ""}`.trim();
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
        getWorkCharacters: getWorkCharacters,
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
        window.getWorkCharacters = getWorkCharacters;
        window.getDisplayDate = getDisplayDate;
        window.getThumbnailImage = getThumbnailImage;
    }

})(typeof globalThis !== "undefined" ? globalThis : this);
