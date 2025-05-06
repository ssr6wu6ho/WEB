<template>
  <div class="flex p-3 gap-2">
    <section class="flex gap-3 border border-black/5 rounded-full p-1">
      <a v-for="tech in IconAndUrl" :key="tech.name" :href="tech.url" class="hover:text-white" :title="tech.name">
        <component :is="tech.icon" class="w-6 h-6" />
      </a>
      <button @click="toggleTheme">
        <MoonIcon v-if="darkModeStore.isDark" class="w-6 h-6 hover:text-white" />
        <SunIcon v-else class="w-6 h-6 hover:text-white" />
      </button>
    </section>
    <section class="flex gap-3 border border-gray-400/20 border-2 rounded-full p-1">
      <div class="rounded-full items-center justify-center cursor-pointer z-10" @click="switchLanguage('zh')">
        <span class="text-xs" :class="activeLang === 'zh' ? 'text-white' : 'text-gray-500'">
          中文
        </span>
      </div>
      <div class="items-center justify-center cursor-pointer z-10" @click="switchLanguage('en')">
        <span class="text-xs" :class="activeLang === 'en' ? 'text-white' : 'text-gray-500'">
          EN
        </span>
      </div>
      <div class="items-center justify-center cursor-pointer z-10" @click="switchLanguage('ja')">
        <span class="text-xs" :class="activeLang === 'ja' ? 'text-white' : 'text-gray-500'">
          日本語
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { userDarkMOdel } from '../../store/stateStore'
import { ref } from 'vue'
import { i18n } from '../../utils/18n'
import {
  SunIcon, MoonIcon,
  GithubIcon, Tv
} from 'lucide-vue-next'

const activeLang = ref('en')


const darkModeStore = userDarkMOdel()

function toggleTheme() {
  darkModeStore.toggleDarkModel()
}

const IconAndUrl = [
  { name: 'GitHub', icon: GithubIcon, url: "https://github.com/ssr6wu6ho" },
  { name: 'bilibili', icon: Tv, url: "https://space.bilibili.com/34321318" },
]

// 封装语言切换逻辑
function switchLanguage(lang: 'zh' | 'en' | 'ja') {
  activeLang.value = lang
  i18n.global.locale.value = lang
}
</script>

<style scoped></style>