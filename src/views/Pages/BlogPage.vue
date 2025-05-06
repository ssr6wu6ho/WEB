<template>
  <div class="min-h-screen p-8">
    <!-- 主要内容 -->
    <div class="relative z-10">
      <article class="mx-auto max-w-4xl">
        <!-- 文章头部 -->
        <header class="mb-8 text-center">
          <h1 class="mb-4 text-4xl font-bold text-white">{{ post.title }}</h1>
          <div class="flex items-center justify-center gap-4 text-gray-400">
            <span>{{ post.date }}</span>
            <span>by:{{ post.author }}</span>
          </div>
        </header>

        <!-- 文章内容 -->
        <div class="prose prose-invert max-w-none rounded-xl backdrop-blur-sm bg-white/5 p-6 lg:p-8">
          <div class="markdown-body" v-html="renderedContent"></div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userBlogPage } from '../../store/stateStore.ts';
import MarkdownIt from 'markdown-it'
import 'prismjs' // 导入 Prism.js
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/themes/prism-tomorrow.css'

const WebMd = import.meta.glob('../../components/Web.md', { as: 'raw', eager: true })
const IOTMd = import.meta.glob('../../components/IOT.md', { as: 'raw', eager: true })

const blogPageStore = userBlogPage();

// Markdown 解析器配置
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (Prism.languages[lang]) {
      return (
        '<pre class="language-' +
        lang +
        '">' +
        Prism.highlight(str, Prism.languages[lang], lang) +
        '</pre>'
      );
    } else {
      return (
        '<pre class="language-text">' +
        Prism.highlight(str, Prism.languages['markup'], 'text') +
        '</pre>'
      );
    }
  },
});

// 文章数据
const post = ref({
  title: '个人网站简介',
  date: '2024-02-19',
  author: 'RSRR',
  content: WebMd['../../components/Web.md'],
})


const post_2 = ref({
  title: '👻',
  date: '2024-02-19',
  author: 'sss',
  content: IOTMd['../../components/IOT.md'],
})


const newComment = ref('')
// 渲染的 Markdown 内容
const renderedContent = ref('')


// 渲染 Markdown
onMounted(() => {

  if (blogPageStore.blogPage === 1) { renderedContent.value = md.render(post.value.content) }
  else if (blogPageStore.blogPage === 2) { renderedContent.value = md.render(post_2.value.content) }
})
</script>

<style>
.markdown-body {
  color: #e4e4e7;
  line-height: 1.6;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 标题 */
.markdown-body h1 {
  font-size: 2em;
  border-bottom: 5px solid #3f3f46;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.75em;
  border-bottom: 3px solid #3f3f46;
}

.markdown-body h3 {
  font-size: 1.5em;
}

.markdown-body h4 {
  font-size: 1.25em;
}

.markdown-body h5 {
  font-size: 1em;
}

.markdown-body h6 {
  font-size: 0.875em;
  color: #a1a1aa;
}

/* 段落和列表 */
.markdown-body p {
  margin: 0 0 1em;
  line-height: 1.7;
}

.markdown-body ul,
.markdown-body ol {
  margin: 0 0 1em 1.5em;
  padding-left: 1em;
}

.markdown-body li {
  margin: 0.5em 0;
}

/* 引用 */
.markdown-body blockquote {
  margin: 1em 0;
  padding: 0.5em 1em;
  background-color: #2d2d42;
  border-left: 4px solid #a855f7;
  color: #a1a1aa;
  border-radius: 0.3em;
}

/* 表格 */
.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  background-color: #2d2d42;
}

.markdown-body th,
.markdown-body td {
  padding: 0.75em;
  border: 1px solid #3f3f46;
}

.markdown-body th {
  background-color: #363646;
  color: white;
  font-weight: 600;
}

/* 图片 */
.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5em;
  margin: 1em 0;
}

/* 分隔线 */
.markdown-body hr {
  border: none;
  border-top: 2px solid #3f3f46;
  margin: 2em 0;
}

/* 代码块增强 */
.markdown-body pre {
  position: relative;
  padding: 1.5em;
  overflow-x: auto;
}

.markdown-body pre code {
  display: block;
  font-family: "Fira Code", "Consolas", monospace;
  line-height: 1.5;
  font-size: 14px;
}

/* 行内代码 */
.markdown-body code:not(pre code) {
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 0.9em;
}

/* 强调文本 */
.markdown-body strong {
  color: white;
  font-weight: 600;
}

.markdown-body em {
  color: #a1a1aa;
  font-style: italic;
}

/* 链接交互效果 */
.markdown-body a:hover {
  color: #c084fc;
  text-decoration: underline;
}

/* 列表符号颜色 */
.markdown-body ul {
  list-style-type: "•";
  color: #a855f7;
}

.markdown-body ul ul {
  list-style-type: "◦";
}

.markdown-body ol {
  list-style-type: decimal;
}

/* 滚动条样式（仅支持 WebKit） */
.markdown-body pre::-webkit-scrollbar {
  height: 6px;
}

.markdown-body pre::-webkit-scrollbar-thumb {
  background-color: #4a4a6e;
  border-radius: 3px;
}

.markdown-body pre::-webkit-scrollbar-track {
  background-color: #2d2d42;
}
</style>