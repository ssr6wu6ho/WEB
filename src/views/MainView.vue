<!--职责：主文件负责布局和状态栏的位置信息，但不直接处理状态栏的折叠逻辑。-->
<template>
  <!--pointer-events-none pointer-events: none;，这样鼠标事件会穿透该组件，从而不会影响滚动条的使用。-->
  <starBackground class="fixed pointer-events-none" />
  <!-- 鼠标跟随效果 -->
  <div class=" fixed transition-opacity duration-300" :style="getMouseFollowStyle(1, 1)"></div>
  <!--全局背景以及字体颜色-->
  <div class="min-h-screen font-mono transition-colors duration-300"
    :class="[darkModeStore.isDark ? 'bg-gradient-to-r from-zinc-900 to-purple-950 text-gray-400' : 'bg-gradient-to-r from-gray-700 to-gray-500 text-zinc-800']">
    <!-- 右上角 -->
    <div v-show="$route.path === '/'"
      :class="[windowWidth < 768 ? 'fixed top-12 right-6 z-10' : 'fixed top-6 right-6 z-10']">
      <RightTopPanel />
    </div>
    <!-- 左侧浮动面板 -->
    <div v-show="currentPageStore.currentIndex && $route.path === '/'" class="fixed duration-300 z-10"
      :class="[windowWidth < 768 ? 'right-6 top-4 -translate-x-1/2' : 'left-6 top-8']"
      :style="windowWidth < 768 ? { transform: 'rotate(90deg)' } : { transform: `perspective(1500px) rotateY(${mouseX * 5}deg) rotateX(${-mouseY * 5}deg) scale(1.02)` }">
      <LeftPanel />
    </div>
    <!-- 主要内容区域 -->
    <div v-if="$route.path === '/'" class="duration-300 z-50"
      :class="[windowWidth < 768 ? 'w-full' : slideBarExtendStore.leftBarExtend ? 'ml-[300px]' : 'ml-[50px]']">

      <main>
        <section ref="homePage" id="homePage">
          <HomePage />
        </section>
        <section ref="techPage" id="techPage">
          <TechPage />
        </section>
        <section ref="lifePage" id="lifePage">
          <LifePage />
        </section>
        <section ref="musicPage" id="musicPage">
          <MusicListPage />
        </section>
      </main>
    </div>
    <div v-else class="duration-300 z-50">
      <router-view></router-view>
    </div>
    <!-- 音乐播放器 -->
    <div v-show="currentPageStore.currentIndex" class="fixed bottom-6 right-6 duration-300 z-10"
      :style="getMouseFollowStyle(1, 10)">
      <MusicPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import {
  userDarkMOdel, userSlideBarExtend, userCurrentPage
} from "../store/stateStore";
import { getMessages } from "../api/message_request";
import MusicPanel from "./components/MusicPanel.vue";
import LeftPanel from "./components/LeftPanel.vue";
import RightTopPanel from "./components/RightTopPanel.vue";
import starBackground from "./starBackground.vue";
import TechPage from "./Pages/TechPage.vue";
import LifePage from "./Pages/LifePage.vue";
import MusicListPage from "./Pages/MusicListPage.vue";
import HomePage from "./Pages/HomePage.vue";
//状态获取
const darkModeStore = userDarkMOdel();
const slideBarExtendStore = userSlideBarExtend();
const currentPageStore = userCurrentPage();
//辅助响应的
const windowWidth = ref(window.innerWidth);
const mouseX = ref(0);
const mouseY = ref(0);
//页面获取
const homePage = ref<HTMLElement | null>(null);
const techPage = ref<HTMLElement | null>(null);
const lifePage = ref<HTMLElement | null>(null);
const musicPage = ref<HTMLElement | null>(null);
//消息获取
interface Message {
  id: number
  author_name: string
  author_avatar: string
  created_at: string
  content: string
}
const messages = ref<Message[]>([]);

const loadMessages = async () => {
  try {
    messages.value = (await getMessages()) as Message[];
    console.log(messages.value)
  } catch (error) {
    console.error('加载留言失败:', error);

  }
}

//主组件通过监听滚动事件来更新currentIndex，这样当用户滚动时，currentIndex会自动更新。但反过来，如果直接修改currentIndex，可能不会触发滚动
//或者导致滚动位置和状态不一致，出现bug。
//所以正确的做法应该是新增一个缓冲index，然后监听该index，让滚动事件自然更新currentIndex，而不是直接修改它。这样状态和视图就能保持同步，避免不一致的问题
//自动更新
const renewNavBar = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  // 检查哪个部分在视图中
  if (homePage.value && scrollPosition < homePage.value.offsetTop + homePage.value.offsetHeight) {
    currentPageStore.setCurrentPage(0);
    slideBarExtendStore.leftBarExtend = false;
    slideBarExtendStore.musicBarExtend = false;
  } else if (techPage.value && scrollPosition < techPage.value.offsetTop + techPage.value.offsetHeight) {
    //console.log(currentPageStore.currentIndex)
    currentPageStore.setCurrentPage(1);
  } else if (lifePage.value && scrollPosition < lifePage.value.offsetTop + lifePage.value.offsetHeight) {
    //console.log(currentPageStore.currentIndex)
    currentPageStore.setCurrentPage(2);
  } else if (musicPage.value && scrollPosition < musicPage.value.offsetTop + musicPage.value.offsetHeight) {
    //console.log(currentPageStore.currentIndex)
    currentPageStore.setCurrentPage(3);
  }
}
// 新增监听 targetScrollIndex
watch(() => currentPageStore.targetScrollIndex,
  (newIndex) => {
    if (newIndex === -1) return;

    const sections = [homePage, techPage, lifePage, musicPage];
    const targetSection = sections[newIndex]?.value;

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      console.log("滚动到目标页面：", newIndex);
      // 滚动完成后重置目标状态
      setTimeout(() => {
        currentPageStore.targetScrollIndex = -1;
      }, 1000);
    }
  }
);
onMounted(async () => {
  window.addEventListener("resize", updateWidth);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("scroll", renewNavBar);
  updateWidth();
  renewNavBar();
  loadMessages();
  slideBarExtendStore.leftBarExtend = false;
  slideBarExtendStore.musicBarExtend = false;
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
  window.removeEventListener("mousemove", handleMouseMove);
  window.addEventListener("scroll", renewNavBar);
});

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
  slideBarExtendStore.leftBarExtend = windowWidth.value >= 1024;
  slideBarExtendStore.musicBarExtend = windowWidth.value >= 1024;
};
const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 4; // 归一化为[-1,1]
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 4;
};
// 鼠标跟随移动的计算方法
const getMouseFollowStyle = (scaleFactor: number, rotateFactor: number) => {
  return {
    transform: `perspective(1000px) 
      rotateY(${mouseX.value * rotateFactor}deg) 
      rotateX(${-mouseY.value * rotateFactor}deg) 
      scale(${scaleFactor})`
  };
};
</script>