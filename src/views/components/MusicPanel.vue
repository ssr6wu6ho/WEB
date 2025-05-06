<template>
  <div class="rounded-lg border backdrop-blur-sm overflow-hidden" :class="[slideBarExtendStore.musicBarExtend ? 'w-90' : 'w-30', slideBarExtendStore.musicBarExtend ? 'h-full' : 'h-20',
  darkModeStore.isDark ? 'bg-zinc-900/20' : 'bg-slate-200/20 shadow-lg',
  darkModeStore.isDark ? 'border-gray-200' : 'border-gray-800'
  ]">
    <!-- Player Header -->
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-3">
        <!--<img :src="currentTrack.cover" alt="Album Cover" class="w-10 h-10 rounded object-cover" />-->
        <Disc3 class="w-10 h-10 rounded object-cover" :class="{
          'spinner': isPlaying
        }" />
        <div v-show="slideBarExtendStore.musicBarExtend">
          <h3 class="text-sm font-medium">
            {{ currentTrack.title }}
          </h3>
          <p class="text-xs">
            {{ currentTrack.artist }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="toggleMusicSidebar" class="p-2 rounded-lg transition-colors">
          <Maximize2 v-if="!slideBarExtendStore.musicBarExtend" class="w-4 h-4"
            :class="darkModeStore.isDark ? 'text-gray-400' : 'text-gray-600'" />
          <Minimize2 v-else class="w-4 h-4" :class="darkModeStore.isDark ? 'text-gray-400' : 'text-gray-600'" />
        </button>
        <ListMusic class="w-4 h-4" :class="darkModeStore.isDark ? 'text-gray-400' : 'text-gray-600'" />
      </div>
    </div>
    <!-- Player Controls -->
    <div class="p-4">
      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="h-1 rounded-full overflow-hidden" :class="darkModeStore.isDark ? 'bg-zinc-700' : 'bg-gray-200'">
          <div class="h-full bg-purple-500 transition-all duration-500" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-xs">{{
            formatTime(currentTime)
            }}</span>
          <span class="text-xs">{{
            formatTime(duration) }}</span>
        </div>
      </div>
      <!-- Controls -->
      <div class="flex items-center justify-center gap-4">
        <button @click="previousTrack" class="p-2 rounded-lg transition-colors"
          :class="darkModeStore.isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'">
          <SkipBack class="w-5 h-5" />
        </button>
        <button @click="togglePlay" class="p-3 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors">
          <Play v-if="!isPlaying" class="w-5 h-5 text-white" />
          <Pause v-else class="w-5 h-5 text-white" />
        </button>
        <button @click="nextTrack" class="p-2 rounded-lg transition-colors"
          :class="darkModeStore.isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'">
          <SkipForward class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Play, Pause, SkipForward, SkipBack, Maximize2, Minimize2, ListMusic, Disc3 } from 'lucide-vue-next'
import { userDarkMOdel, userSlideBarExtend } from '../../store/stateStore'

//遇到的错误1：性能影响
//不建议这样写，因为每一次storeToRefs()都会返回一个新的实例，这样会导致 userSlideBarExtend() 被调用多次
//为了确保 userSlideBarExtend() 只被调用一次，并且 slideBarExtendStore.musicBarExtend 引用的是同一个实例中的属性
//const {slideBarExtendStore.musicBarExtend}=storeToRefs(userSlideBarExtend())

const darkModeStore = userDarkMOdel()
const slideBarExtendStore = userSlideBarExtend()
function toggleMusicSidebar() {
  slideBarExtendStore.toggleMusicBarExtend()
}

const isPlaying = ref(false)
const progress = ref(0)
const currentTime = ref(0)
const duration = ref(180)

const currentTrack = ref({
  title: 'Sample Track',
  artist: 'Sample Artist',
  cover: '/placeholder.svg?height=40&width=40'
})


const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

const previousTrack = () => {
  // Implement previous track logic
}

const nextTrack = () => {
  // Implement next track logic
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Simulate progress updates
//let progressInterval: number
onMounted(() => {
  // progressInterval = setInterval(() => {
  //   if (isPlaying.value) {
  //     currentTime.value = (currentTime.value + 1) % duration.value
  //     progress.value = (currentTime.value / duration.value) * 100
  //   }
  // }, 1000)
})

onUnmounted(() => {
  //
})
</script>

<style scoped>
/* 旋转动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 2s linear infinite;
  /* 1秒内完成一次旋转，线性过渡，无限循环 */
}
</style>
