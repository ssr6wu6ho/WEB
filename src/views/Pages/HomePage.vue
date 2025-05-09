<template>
  <!-- 主要内容 -->
  <main class="relative flex min-h-screen items-center mr-10">
    <section v-if="darkModeStore.isDark" class="w-full max-w-5xl lg:px-16 animate-float">
      <div class="space-y-6 backdrop-blur-sm p-6 rounded-2xl bg-white/5">
        <h2 class="text-xl font-medium tracking-wide text-gray-400">
          -- {{ displayText }}
        </h2>
        <h1 class="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-gray-100">
          Shi SR
          <span class="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            🛹👻🛹
          </span>
        </h1>
        <p class="max-w-[600px] text-lg text-gray-400">
          {{ t('homePage.intro') }}
        </p>
      </div>
      <!-- 技能标签 -->
      <div class="mt-12 flex flex-wrap gap-3">
        <div v-for="skill in skills" :key="skill"
          class="group cursor-pointer rounded-full backdrop-blur-md transition-all hover:scale-105 hover:-translate-y-1 bg-zinc-800/50 hover:bg-zinc-700/50">
          <span class="flex items-center gap-2 px-4 py-2 text-sm text-gray-300">
            {{ skill }}
          </span>
        </div>
      </div>
    </section>
    <section v-else class="space-y-6 bg-white/5 rounded-xl p-8 w-full max-w-5xl backdrop-blur-sm animate-float">
      <h1 class="text-7xl">SSR</h1>
    </section>
  </main>
</template>

<script setup>
import { ref, computed ,onMounted, onUnmounted } from 'vue'
import { userDarkMOdel } from '../../store/stateStore'
import { i18n } from '../../utils/18n';
const darkModeStore = userDarkMOdel();
const t = i18n.global.t;


let currentIndex = 0
const displayText = ref('')
const topText = ["<WELCOME TO MY SPACE />", "<STUDENT />", "<SSR />"]
let currentTextIndex = 0
let typingDirection = 'forward'
let timeoutId = null

const skills = computed(() => [
t('homePage.webDevel'),
t('homePage.uiuxDes'),
t('homePage.fullStark') 
])

const typeText = () => {
  const currentText = topText[currentTextIndex]

  if (typingDirection === 'forward') {
    // 正向输入
    if (displayText.value.length < currentText.length) {
      displayText.value = currentText.substring(0, displayText.value.length + 1)
      timeoutId = setTimeout(typeText, 150)
    } else {
      // 完成输入后等待1秒开始删除
      typingDirection = 'backward'
      timeoutId = setTimeout(typeText, 1000)
    }
  } else {
    // 反向删除
    if (displayText.value.length > 0) {
      displayText.value = displayText.value.slice(0, -1)
      timeoutId = setTimeout(typeText, 100)
    } else {
      // 完成删除后切换下一个文本并重置方向
      currentTextIndex = (currentTextIndex + 1) % topText.length
      typingDirection = 'forward'
      timeoutId = setTimeout(typeText, 500) // 切换文本前的延迟
    }
  }
}

onMounted(() => {
  typeText()
})

onUnmounted(() => {
  clearTimeout(timeoutId)
})
</script>
