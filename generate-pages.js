// ========================
//     靜態作品頁產生器
// ========================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const {
    getPublicWorks,
    getWorkDisplayTitle,
    getDisplayDate
} = require(
    path.join(__dirname, "shared.js")
);


// ========================
//     基本設定
// ========================

const siteURL =
    "https://s920171ryan-coder.github.io";

const worksOutputFolder = path.join(
    __dirname,
    "works"
);


// ========================
//     讀取資料檔
// ========================

function loadData(
    filePath,
    variableName
) {

    const code =
        fs.readFileSync(
            filePath,
            "utf8"
        );

    const context = {};

    vm.createContext(context);

    vm.runInContext(
        `${code}\nthis.result = ${variableName};`,
        context
    );

    return context.result;
}


const works = loadData(
    path.join(
        __dirname,
        "data",
        "works.js"
    ),
    "works"
);

const artists = loadData(
    path.join(
        __dirname,
        "data",
        "artists.js"
    ),
    "artists"
);


// ========================
//     公開作品
// ========================

// 只產生允許公開的作品，
// 排序規則定義在 shared.js（依完稿日期由新到舊）
const publicWorks = getPublicWorks(works);


// ========================
//     HTML 安全處理
// ========================

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}


// ========================
//     清理舊輸出
// ========================

// 每次重新產生前，先刪除舊作品頁
if (
    fs.existsSync(
        worksOutputFolder
    )
) {

    fs.rmSync(
        worksOutputFolder,
        {
            recursive: true,
            force: true
        }
    );
}


// ========================
//     建立乾淨輸出資料夾
// ========================

fs.mkdirSync(
    worksOutputFolder,
    {
        recursive: true
    }
);


// ========================
//     建立每件公開作品
// ========================

publicWorks.forEach(
    function(work) {

        const artist =
            artists[work.artist];

        const displayTitle =
            getWorkDisplayTitle(work);

        const displayDate =
            getDisplayDate(work);


        // ========================
        //     分享用圖片網址
        // ========================

        // 直接指向 images/ 裡的原始檔案，
        // 不再複製一份到 web-images/。
        //
        // 檔名可能含有中日文或空白，
        // encodeURI() 會把這些字元轉成網址能安全使用的編碼，
        // 但不會動到 "/" 這種路徑分隔符號。
        const webImageURL =
            `${siteURL}/${encodeURI(work.image)}`;


        // ========================
        //     作品網址
        // ========================

        const workURL =
            `${siteURL}/works/${work.id}/`;


        // ========================
        //     建立作品資料夾
        // ========================

        const folderPath = path.join(
            worksOutputFolder,
            work.id
        );

        fs.mkdirSync(
            folderPath,
            {
                recursive: true
            }
        );


        // ========================
        //     建立作品 HTML
        // ========================

        const html = `<!DOCTYPE html>
<html>

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>${escapeHTML(displayTitle)}｜白針的收藏冊</title>


    <!-- ======================== -->
    <!--     基本資訊              -->
    <!-- ======================== -->

    <meta
        name="description"
        content="${escapeHTML(displayTitle)}｜${escapeHTML(artist.name)} 様｜白針的收藏冊"
    >

    <link
        rel="canonical"
        href="${escapeHTML(workURL)}"
    >


    <!-- ======================== -->
    <!--     Open Graph           -->
    <!-- ======================== -->

    <meta
        property="og:type"
        content="website"
    >

    <meta
        property="og:site_name"
        content="白針的收藏冊"
    >

    <meta
        property="og:title"
        content="${escapeHTML(displayTitle)}｜白針的收藏冊"
    >

    <meta
        property="og:description"
        content="${escapeHTML(artist.name)} 様｜${escapeHTML(displayDate)}"
    >

    <meta
        property="og:url"
        content="${escapeHTML(workURL)}"
    >

    <meta
        property="og:image"
        content="${escapeHTML(webImageURL)}"
    >

    <meta
        property="og:image:alt"
        content="${escapeHTML(displayTitle)}"
    >


    <!-- ======================== -->
    <!--     X / Twitter Card     -->
    <!-- ======================== -->

    <meta
        name="twitter:card"
        content="summary_large_image"
    >

    <meta
        name="twitter:title"
        content="${escapeHTML(displayTitle)}｜白針的收藏冊"
    >

    <meta
        name="twitter:description"
        content="${escapeHTML(artist.name)} 様｜${escapeHTML(displayDate)}"
    >

    <meta
        name="twitter:image"
        content="${escapeHTML(webImageURL)}"
    >

    <meta
        name="twitter:image:alt"
        content="${escapeHTML(displayTitle)}"
    >


    <!-- ======================== -->
    <!--     樣式表               -->
    <!-- ======================== -->

    <link
        rel="stylesheet"
        href="../../style.css"
    >

</head>

<body>

    <main class="work-page">

        <section class="work-viewer">


            <!-- ======================== -->
            <!--     作品導覽              -->
            <!-- ======================== -->

            <div class="work-navigation">

                <svg
                    class="work-nav-svg"
                    viewBox="0 0 224 40"
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="work-nav-glow" x="-40%" y="-300%" width="180%" height="700%">
                            <feGaussianBlur stdDeviation="1.4"></feGaussianBlur>
                        </filter>
                    </defs>

                    <g class="work-nav-line work-nav-line-left">
                        <line class="work-nav-line-glow" x1="50" y1="20" x2="84" y2="20"></line>
                        <line class="work-nav-line-main" x1="50" y1="20" x2="84" y2="20"></line>
                    </g>

                    <g class="work-nav-line work-nav-line-right">
                        <line class="work-nav-line-glow" x1="140" y1="20" x2="174" y2="20"></line>
                        <line class="work-nav-line-main" x1="140" y1="20" x2="174" y2="20"></line>
                    </g>
                </svg>

                <button
                    id="work-prev"
                    class="work-nav-arrow"
                    type="button"
                    aria-label="Previous work"
                >
                    <svg class="work-nav-chevron" viewBox="0 0 16 24" aria-hidden="true">
                        <path d="M11 4 L5 12 L11 20"></path>
                    </svg>
                </button>

                <a
                    class="work-back"
                    href="../../index.html"
                >
                    HOME
                </a>

                <button
                    id="work-next"
                    class="work-nav-arrow"
                    type="button"
                    aria-label="Next work"
                >
                    <svg class="work-nav-chevron" viewBox="0 0 16 24" aria-hidden="true">
                        <path d="M5 4 L11 12 L5 20"></path>
                    </svg>
                </button>

            </div>


            <!-- ======================== -->
            <!--     模糊背景              -->
            <!-- ======================== -->

            <div
                class="work-viewer-bg"
                id="work-bg"
            ></div>


            <!-- ======================== -->
            <!--     清晰作品              -->
            <!-- ======================== -->

            <div
                class="work-viewer-image"
                id="work-image"
            ></div>


            <!-- ======================== -->
            <!--     作品資訊              -->
            <!-- ======================== -->

            <div class="work-viewer-info">

                <h1 id="work-title"></h1>

                <div class="work-artist-area">

                    <div id="work-artist"></div>

                    <div
                        class="work-artist-links"
                        id="work-artist-links"
                    ></div>

                </div>

                <div id="work-date"></div>

            </div>

        </section>

    </main>


    <!-- ======================== -->
    <!--     資料                  -->
    <!-- ======================== -->

    <script src="../../data/artists.js"></script>
    <script src="../../data/works.js"></script>


    <!-- ======================== -->
    <!--     目前作品 ID           -->
    <!-- ======================== -->

    <script>
        window.currentWorkId = "${escapeHTML(work.id)}";
    </script>


    <!-- ======================== -->
    <!--     作品頁功能            -->
    <!-- ======================== -->

    <script src="../../shared.js"></script>
    <script src="../../work.js"></script>

</body>

</html>`;


        // ========================
        //     寫入 index.html
        // ========================

        fs.writeFileSync(
            path.join(
                folderPath,
                "index.html"
            ),
            html,
            "utf8"
        );


        console.log(
            "建立：",
            displayTitle
        );
    }
);


// ========================
//     完成訊息
// ========================

console.log("");
console.log(
    `作品頁產生完成！共 ${publicWorks.length} 件公開作品。`
);