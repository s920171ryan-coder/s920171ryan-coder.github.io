// ========================
//     作品資料
// ========================

const works = [

    {
        id: "himehina-million",

        title: "百万お祝い",
        date: "2024-10-10",
        character: "ヒメヒナ",
        artist: "aori",
        published: true,

        image: "images/ヒメヒナ -AORI青凜 リクエスト241010.jpg",

        mobilePosition: 3
    },

    {
        id: "hiyori-akane-morning",

        title: "早安",
        date: "2024-08-18",
        character: "日和あかね",
        artist: "nishino-eri",
        published: true,

        image: "images/日和あかね -西之エリ リクエスト240818.jpg",

        mobilePosition: 8
    },

    {
        id: "inuzuki-ren-birthday",

        title: "Birthday",
        date: "2024-06-30",
        character: "戌月れん",
        artist: "zmmin",
        published: false,

        image: "images/戌月れん -ZM敏 リクエスト240630.jpg",

        mobilePosition: 13
    },

    {
        id: "inuzuki-ren-morning",

        title: "朝",
        date: "2024-03-15",
        character: "戌月れん",
        artist: "zmmin",
        published: false,

        image: "images/戌月れん -ZM敏 リクエスト240315.jpg",

        mobilePosition: 90
    },

    {
        id: "aori-halloween",

        title: "Halloween",
        date: "2024-10-18",
        character: "青凛Aori",
        artist: "nekoboshi-horo",
        published: false,

        image: "images/青凛Aori -猫星ほろ リクエスト241018.jpg",

        mobilePosition: 0
    },

    {
        id: "ellise-bath",

        title: "お風呂",
        date: "2025-01-24",
        character: "Ellise",
        artist: "shimoji-yori",
        published: false,

        image: "images/Ellise -下地ヨリ リクエスト250124.jpg",

        mobilePosition: 0
    },

    {
        id: "ori-graduation",

        title: "卒業記念",
        date: "2025-09-13",
        character: "ORI禮",
        artist: "boni",
        published: false,

        image: "images/ORI禮 -蘿蔔泥Boni リクエスト250913.jpg",

        mobilePosition: 10
    },

    {
        id: "azumalim-touring",

        title: "ツーリング",
        date: "2025-03-21",
        character: "アズマリム",
        artist: "isana",
        published: false,

        image: "images/アズマリム -ISANA リクエスト250321.jpg",

        mobilePosition: 10
    },

    {
        id: "himehina-marriage",

        title: "結婚しました",
        date: "2026-07-30",
        character: "ヒメヒナ",
        artist: "harukaze-ruu",
        published: false,

        image: "images/ヒメヒナ -春風るぅ リクエスト260730-1.jpg",

        mobilePosition: 15
    },

    {
        id: "himehina-happiness",

        title: "お幸せに",
        date: "2026-07-30",
        character: "ヒメヒナ",
        artist: "harukaze-ruu",
        published: false,

        image: "images/ヒメヒナ -春風るぅ リクエスト260730-2.jpg",

        mobilePosition: 15
    },

    {
        id: "nagino-mashiro-onsen",

        title: "温泉旅行",
        date: "2026-08-20",
        character: "凪乃ましろ",
        artist: "izumi-kei",
        published: false,

        image: "images/凪乃ましろ -いずみけい リクエスト260820.jpg",

        mobilePosition: 15
    },

    {
        id: "axiong-changing",

        title: "更衣中",
        date: "2026-04-25",
        character: "阿雄",
        artist: "gibun",
        published: false,

        image: "images/阿雄 -GIBUN(ギブン) リクエスト260425.jpg",

        mobilePosition: 25
    },

    {
        id: "aori-play-together",

        title: "一起玩吧！",
        date: "2026-07-31",
        character: "青凛Aori",
        artist: "cine",
        published: false,

        image: "images/青凛Aori -CinE リクエスト260731.jpg",

        mobilePosition: 0
    },

    {
        id: "booklive-drink",

        title: "一起喝嗎？",
        date: "2026-07-31",
        character: "書靈booklive",
        artist: "mimihachi",
        published: false,

        image: "images/書靈booklive -みみはち リクエスト260731.jpg",

        mobilePosition: 0
    },

    {
        id: "mayo-yune-dont-stare",

        title: "別盯著看",
        date: "2026-08-03",
        character: "真夜幽禰",
        artist: "togemaru",
        published: false,

        image: "images/真夜幽禰 -とげまる リクエスト260803.jpg",

        mobilePosition: 0
    },

    {
        id: "booklive-stargazing",

        title: "星見",
        date: "2026-03-30",
        character: "書靈booklive",
        artist: "sumi",
        published: false,

        image: "images/書靈booklive -酥米sumi リクエスト260330.jpg",

        mobilePosition: 23
    },

    {
        id: "ibara-muan-4th-anniversary",

        title: "4周年記念",
        date: "2025-03-04",
        character: "茨むあん",
        artist: "isshorin",
        published: false,

        image: "images/茨むあん -一緒臨 リクエスト250304.jpg",

        mobilePosition: 8
    },

    {
        id: "yuzuki-ririna-morning",

        title: "早晨",
        date: "2025-02-11",
        character: "結月莉莉奈",
        artist: "kkix25",
        published: false,

        image: "images/結月莉莉奈 -KKIX25 リクエスト250211.jpg",

        mobilePosition: 3
    },

    {
        id: "yuzuki-ririna-tipsy",

        title: "微醺",
        date: "2025-05-17",
        character: "結月莉莉奈",
        artist: "kkix25",
        published: false,

        image: "images/結月莉莉奈 -KKIX25 リクエスト250517.jpg",

        mobilePosition: 3
    },

    {
        id: "aimi-yua-sea",

        title: "海だ！",
        date: "2026-07-09",
        character: "愛未ゆあ",
        artist: "kirifrog",
        published: false,

        image: "images/愛未ゆあ -KiriFrog リクエスト260709.jpg",

        mobilePosition: 10
    },

    {
        id: "nove-water-play",

        title: "戲水",
        date: "2026-02-15",
        character: "諾芙Nove",
        artist: "datang",
        published: false,

        image: "images/諾芙Nove -大堂 リクエスト260215.jpg",

        mobilePosition: 10
    },

    {
        id: "mayo-yune-debut",

        title: "初次亮相",
        date: "2025-07-24",
        character: "真夜幽禰",
        artist: "boni",
        published: false,

        image: "images/真夜幽禰 -蘿蔔泥Boni リクエスト250724.jpg",

        mobilePosition: 17
    },

    {
        id: "harumizu-rei-swimsuit",

        title: "水着だ──ッ",
        date: "2026-08-24",
        character: "春水レイ",
        artist: "yahako",
        published: false,

        image: "images/春水レイ -やはこ リクエスト260824.jpg",

        mobilePosition: 3
    },

    {
        id: "kumano-nii-morning",

        title: "おはよう",
        date: "2026-09-06",
        character: "くまのにい",
        artist: "minase-nami",
        published: false,

        image: "images/くまのにい -水瀬なみ リクエスト260906.jpg",

        mobilePosition: 3
    }

];