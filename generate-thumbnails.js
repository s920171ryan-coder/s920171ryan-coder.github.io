// ========================
//     批次縮圖產生器
// ========================
//
// 適用於固定 1920x1080 JPG 的作品原圖。
// 把每張原圖另外輸出一份小尺寸、壓縮過的版本，
// 放到 images/thumbs/ 底下，檔名跟原圖一樣。
//
// 用途：
// - 首頁縮圖格（最大只有 320px 寬）
// - 幻燈片 / 作品頁的模糊背景層（本來就有 blur 濾鏡，
//   用縮圖看起來跟原圖沒有差別）
//
// 清晰的主圖（幻燈片主圖、作品頁大圖）
// 繼續使用原圖，畫質不受影響。
//
// 執行前記得先：npm install sharp

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");


// ========================
//     基本設定
// ========================

const imagesFolder = path.join(
    __dirname,
    "images"
);

const thumbsFolder = path.join(
    imagesFolder,
    "thumbs"
);

// 縮圖寬度：
// 桌機縮圖格最大 320px，
// 乘以 2 是為了螢幕解析度較高（Retina）時也不會模糊
const thumbnailWidth = 640;

// JPG 壓縮品質（0-100）
const thumbnailQuality = 78;

// 只處理這些副檔名
const allowedExtensions = [".jpg", ".jpeg"];


// ========================
//     檔案大小顯示格式
// ========================

function formatBytes(bytes) {

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}


// ========================
//     建立輸出資料夾
// ========================

fs.mkdirSync(
    thumbsFolder,
    {
        recursive: true
    }
);


// ========================
//     找出所有原圖
// ========================

const imageFiles = fs
    .readdirSync(imagesFolder)
    .filter(function(fileName) {

        // 跳過資料夾（例如 thumbs/ 自己）
        const fullPath = path.join(
            imagesFolder,
            fileName
        );

        if (
            !fs.statSync(fullPath).isFile()
        ) {
            return false;
        }

        const ext =
            path.extname(fileName).toLowerCase();

        return allowedExtensions.includes(ext);
    });


if (imageFiles.length === 0) {

    console.log(
        `images/ 底下沒有找到 ${allowedExtensions.join(" / ")} 檔案，請確認路徑是否正確。`
    );

    process.exit(0);
}


// ========================
//     批次處理
// ========================

let totalOriginalSize = 0;
let totalThumbnailSize = 0;
let processedCount = 0;
let skippedCount = 0;
let failedCount = 0;


async function processImage(fileName) {

    const originalPath = path.join(
        imagesFolder,
        fileName
    );

    const thumbnailPath = path.join(
        thumbsFolder,
        fileName
    );

    const originalSize =
        fs.statSync(originalPath).size;


    // ========================
    //     已經有縮圖就跳過
    // ========================

    // 避免每次重跑整批圖片都重新壓縮一次；
    // 想強制重新產生的話，先把 images/thumbs/ 清空再跑
    if (fs.existsSync(thumbnailPath)) {

        skippedCount++;

        console.log(
            `略過（已存在）：${fileName}`
        );

        return;
    }


    try {

        await sharp(originalPath)
            .resize({
                width: thumbnailWidth
            })
            .jpeg({
                quality: thumbnailQuality,
                mozjpeg: true
            })
            .toFile(thumbnailPath);


        const thumbnailSize =
            fs.statSync(thumbnailPath).size;

        totalOriginalSize += originalSize;
        totalThumbnailSize += thumbnailSize;
        processedCount++;

        const savedPercent = (
            (1 - thumbnailSize / originalSize) * 100
        ).toFixed(0);

        console.log(
            `完成：${fileName}　`
            + `${formatBytes(originalSize)} → ${formatBytes(thumbnailSize)}`
            + `（省下 ${savedPercent}%）`
        );

    } catch (error) {

        failedCount++;

        console.error(
            `失敗：${fileName} — ${error.message}`
        );
    }
}


async function main() {

    console.log(
        `找到 ${imageFiles.length} 張原圖，開始產生縮圖...\n`
    );

    for (const fileName of imageFiles) {

        // 依序處理（不用 Promise.all 同時處理），
        // 避免大量圖片同時解碼吃光記憶體
        await processImage(fileName);
    }

    console.log("");
    console.log("========================");
    console.log(`新產生：${processedCount} 張`);
    console.log(`略過（已存在）：${skippedCount} 張`);

    if (failedCount > 0) {
        console.log(`失敗：${failedCount} 張`);
    }

    if (processedCount > 0) {

        console.log(
            `本次縮圖總大小：${formatBytes(totalOriginalSize)} → ${formatBytes(totalThumbnailSize)}`
        );

        console.log(
            `本次共省下：${formatBytes(totalOriginalSize - totalThumbnailSize)}`
        );
    }
}


main();
