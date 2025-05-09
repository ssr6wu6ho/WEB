import { createI18n } from "vue-i18n";

// const $t = i18n.global.t：直接获取静态翻译函数，适用于简单场景，但无法响应语言切换。
// // 组合式API场景：必须使用 useI18n() 获取响应式 t 函数，配合 computed 实现动态更新。
// . 响应性缺失
// 现象：当切换语言时（如 i18n.global.locale = 'zh'），通过 $t 获取的翻译值不会自动更新。

// 原因：i18n.global.t 是一个静态方法，直接赋值给 $t 后，无法感知语言变化。

// 2. 组合式API兼容性
// 选项式API（Options API）：可通过 this.$t 直接访问（无需手动赋值），且自动响应语言变化。

// 组合式API（Composition API）：直接使用 i18n.global.t 会失去响应性，需改用 useI18n()。
export const i18n = createI18n({
    legacy: false,
    locale: "en", // 默认语言为英文
    messages: {
        en: {
            homePage: {
                intro: "Third-year undergraduate student / Welcome",
                webDevel: "WEB Development",
                uiuxDes: "UI/UX Design",
                fullStark: "Full Stack",
            } as const,
            techPage: {
                projects: "projects",
                personWeb: "Personal Website",
                personWebIntro: "A simple personal website project built with Vue3 + TypeScript, enhanced with JavaScript libraries like Three.js and D3.js.",
                APPXIOT: "Android APP IoT Gadget",
                APPXIOTIntro: "An IoT x Android APP toy integrated with large language models, a practice project using Arduino (C++) and Java.",
                techStack: "TECH STACK",
                softWear: "SOFTWARE",
                hardWear: "HARDWARE",
                readMore: "REDA MORE"
            } as const
        },
        zh: {
            homePage: {
                intro: "大三本科在读 / 欢迎",
                webDevel: "web开发",
                uiuxDes: "UI/UX 设计",
                fullStark: "全栈",
            } as const,
            techPage: {
                projects: "项目",
                personWeb: "个人网页",
                personWebIntro: "一个由vue3+ts搭建的简单个人网页项目,three,d3等js库进行点缀",
                APPXIOT: "安卓APP物联网小摆件",
                APPXIOTIntro: "接入大模型的物联网x安卓APP小玩具,Arduino(C++)+java的小练习",
                techStack: "技术栈",
                softWear: "软件",
                hardWear: "硬件",
                readMore: "阅读更多"
            } as const
        },
        ja: {
            homePage: {
                intro: "大学3年生、学部在籍中 / ようこそ",
                webDevel: "WEB Development",
                uiuxDes: "UI/UX Design",
                fullStark: "Full Stack",
            } as const,
            techPage: {
                projects: "プロジェクト",
                personWeb: "個人ウェブサイト",
                personWebIntro: "Vue3 + TypeScriptで構築されたシンプルな個人ウェブサイトプロジェクト。Three.jsやD3.jsなどのJavaScriptライブラリで装飾を施しています。",
                APPXIOT: "Androidアプリ IoTガジェット",
                APPXIOTIntro: "大規模言語モデルを統合したIoT x Androidアプリのおもちゃ。Arduino（C++）とJavaを使用した練習プロジェクトです。",
                techStack: "技術スタック",
                softWear: "ソフトウェア",
                hardWear: "ハードウェア",
                readMore: "阅读更多"
            } as const
        }
    } as const,
});