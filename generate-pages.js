// ========================
//     靜態作品頁產生器
// ========================

const fs = require("fs");
const path = require("path");
const vm = require("vm");


// ========================
//     讀取資料檔
// ========================

function loadData(filePath, variableName) {

    const code = fs.readFileSync(filePath, "utf8");

    const context = {};

    vm.createContext(context);

    vm.runInContext(
        `${code}\nthis.result = ${variableName};`,
        context
    );

    return context.result;
}


const works = loadData(
    path.join(__dirname, "data", "works.js"),
    "works"
);

const artists = loadData(
    path.join(__dirname, "data", "artists.js"),
    "artists"
);


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
//     建立每件作品頁
// ========================

works.forEach(function(work) {

    const artist = artists[work.artist];

    const folderPath = path.join(
        __dirname,
        "works",
        work.id
    );

    fs.mkdirSync(folderPath, {
        recursive: true
    });


    const html = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${escapeHTML(work.title)}｜白針的收藏冊</title>

<!-- ======================== -->
<!-- 分享預覽                  -->
<!-- ======================== -->

<meta
    name="description"
    content="${escapeHTML(work.title)}｜${escapeHTML(artist.name)} 様｜白針的收藏冊"
>

<meta property="og:type" content="website">

<meta
    property="og:title"
    content="${escapeHTML(work.title)}｜白針的收藏冊"
>

<meta
    property="og:description"
    content="${escapeHTML(artist.name)} 様｜${escapeHTML(work.date.replaceAll("-", " / "))}"
>

<meta
    property="og:url"
    content="https://s920171ryan-coder.github.io/works/${escapeHTML(work.id)}/"
>

<meta
    property="og:image"
    content="https://s920171ryan-coder.github.io/${encodeURI(work.image)}"
>

<meta name="twitter:card" content="summary_large_image">

<meta
    name="twitter:title"
    content="${escapeHTML(work.title)}｜白針的收藏冊"
>

<meta
    name="twitter:description"
    content="${escapeHTML(artist.name)} 様｜${escapeHTML(work.date.replaceAll("-", " / "))}"
>

<meta
    name="twitter:image"
    content="https://s920171ryan-coder.github.io/${encodeURI(work.image)}"
>

<link rel="stylesheet" href="../../style.css">
</head>

<body>

    <main class="work-page">

        <section class="work-viewer">

            <!-- 作品導覽 -->
            <div class="work-navigation">

                <a class="work-back" href="../../index.html">返回</a>

                <div class="work-switch">
                    <button id="work-prev" type="button">‹</button>
                    <button id="work-next" type="button">›</button>
                </div>

            </div>


            <!-- 模糊背景 -->
            <div class="work-viewer-bg" id="work-bg"></div>

            <!-- 清晰作品 -->
            <div
               class="work-viewer-image"
                id="work-image"
            ></div>


            <!-- 作品資訊 -->
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


    <script src="../../data/artists.js"></script>
    <script src="../../data/works.js"></script>

    <script>
        window.currentWorkId = "${escapeHTML(work.id)}";
    </script>

    <script src="../../work.js"></script>

</body>

</html>`;

    fs.writeFileSync(
        path.join(folderPath, "index.html"),
        html,
        "utf8"
    );

    console.log("建立：", work.id);
});


console.log("");
console.log("作品頁產生完成！");