// ========================
//     網站多語言
// ========================

const translations = {
    "zh-TW": {
        siteTitle: "白針的收藏冊",
        works: "作品",
        year: "年份",
        artist: "作者",
        character: "角色",
        home: "首頁",
        aboutWelcome: "歡迎來到",
        aboutName: "「白針的收藏冊」",
        aboutP1: "我一直想找一個地方，<br>集中整理這些年來委託的作品。",
        aboutP2: "試過一些方式，卻始終找不到真正合適的地方。<br>於是最後，我決定自己做一個。",
        aboutP3: "這就是「白針的收藏冊」。",
        aboutP4: "這裡收錄著我委託不同創作者完成的作品，<br>記錄著我喜歡的一切。",
        aboutP5: "感謝每一位將我的想法化為作品的創作者，<br>也謝謝你的來訪。",
        aboutEnd: "祝你逛得開心。",
        close: "CLOSE"
    },

    "ja": {
        siteTitle: "白針のコレクション",
        works: "作品",
        year: "年",
        artist: "作者",
        character: "キャラクター",
        home: "ホーム",
        aboutWelcome: "ようこそ",
        aboutName: "「白針のコレクション」へ",
        aboutP1: "これまで依頼してきた作品を、ひとつの場所にまとめて整理したいと、ずっと思っていました。",
        aboutP2: "いろいろな方法を試してみましたが、なかなか自分に合う場所が見つからず、それなら最後は、自分で作ってみようと思いました。",
        aboutP3: "こうしてできたのが「白針のコレクション」です。",
        aboutP4: "ここには、さまざまなクリエイターの方々に依頼して描いていただいた作品と、私の好きなものを記録しています。",
        aboutP5: "私の思いを作品という形にしてくださったすべてのクリエイターの皆さま、そしてここを訪れてくださったあなたに、心から感謝します。",
        aboutEnd: "どうぞ、ごゆっくりお楽しみください。",
        close: "CLOSE"
    },

    "en": {
        siteTitle: "Shirahari's Collection",
        works: "Works",
        year: "Year",
        artist: "Artist",
        character: "Character",
        home: "Home",
        aboutWelcome: "Welcome to",
        aboutName: "Shirahari's Collection",
        aboutP1: "I had always wanted a place where I could keep<br>all the artwork I have commissioned over the years together.",
        aboutP2: "I tried a few different ways, but never found one that truly felt right.<br>So in the end, I decided to make one myself.",
        aboutP3: "This is Shirahari's Collection.",
        aboutP4: "Here you will find works I commissioned from different artists,<br>recording the things I love.",
        aboutP5: "My thanks to every artist who brought my ideas to life,<br>and to you for stopping by.",
        aboutEnd: "I hope you enjoy looking around.",
        close: "CLOSE"
    }
};

const supportedLanguages = ["zh-TW", "ja", "en"];

function getSavedLanguage() {
    const saved = localStorage.getItem("gallery-language");
    return supportedLanguages.includes(saved) ? saved : "zh-TW";
}

let currentLanguage = getSavedLanguage();

function t(key) {
    return translations[currentLanguage][key]
        ?? translations["zh-TW"][key]
        ?? key;
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach(function(element) {
        const key = element.dataset.i18n;
        element.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function(element) {
        const key = element.dataset.i18nHtml;
        element.innerHTML = t(key);
    });

    document.querySelectorAll(".language-button").forEach(function(button) {
        button.classList.toggle(
            "active",
            button.dataset.lang === currentLanguage
        );
    });

    if (document.querySelector(".hero-content h1")) {
        document.title = t("siteTitle");
    }
}

function setLanguage(language) {
    if (!supportedLanguages.includes(language)) return;

    currentLanguage = language;
    localStorage.setItem("gallery-language", language);
    applyLanguage();

    window.dispatchEvent(
        new CustomEvent("languagechange", {
            detail: { language: currentLanguage }
        })
    );
}

document.addEventListener("DOMContentLoaded", function() {
    applyLanguage();

    document.querySelectorAll(".language-button").forEach(function(button) {
        button.addEventListener("click", function() {
            setLanguage(button.dataset.lang);
        });
    });
});
