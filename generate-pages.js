// ========================
//     靜態作品頁產生器
// ========================

const fs = require("fs");
const path = require("path");
const vm = require("vm");


// ========================
//     基本設定
// ========================

const siteURL =
    "https://s920171ryan-coder.github.io";

const worksOutputFolder = path.join(
    __dirname,
    "works"
);

const webImageFolder = path.join(
    __dirname,
    "web-images"
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

// 只產生允許公開的作品
// 並依完稿日期由新到舊排列
const publicWorks = works
    .filter(function(work) {
        return work.published === true;
    })
    .sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });


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


// 每次重新產生前，先刪除舊分享圖片
if (
    fs.existsSync(
        webImageFolder
    )
) {

    fs.rmSync(
        webImageFolder,
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

fs.mkdirSync(
    webImageFolder,
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
        //     建立網站用圖片
        // ========================

        const sourceImage = path.join(
            __dirname,
            work.image
        );

        const imageExtension =
            path.extname(
                work.image
            ).toLowerCase();

        const webImageName =
            `${work.id}${imageExtension}`;

        const webImagePath = path.join(
            webImageFolder,
            webImageName
        );


        // 複製成乾淨英文檔名
        fs.copyFileSync(
            sourceImage,
            webImagePath
        );


        // 公開圖片網址
        const webImageURL =
            `${siteURL}/web-images/${webImageName}`;


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

                <a
                    class="work-back"
                    href="../../index.html"
                >
                    返回
                </a>

                <div class="work-switch">

                    <button
                        id="work-prev"
                        type="button"
                    >
                        ‹
                    </button>

                    <button
                        id="work-next"
                        type="button"
                    >
                        ›
                    </button>

                </div>

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