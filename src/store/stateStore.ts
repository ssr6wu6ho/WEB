//stateStore负责管理应用状态,不涉及具体的UI逻辑。
import { defineStore } from "pinia";
//Pinia 库来定义一个 Vuex 存储模块（store）

//用 defineStore 函数来定义一个新的存储模块。'darkMode' 是这个存储模块的唯一标识符。
export const userDarkMOdel = defineStore("darkMode", {
  state: () => ({
    isDark: true,
  }),
  actions: {
    toggleDarkModel() {
      this.isDark = !this.isDark;
    },
  },
});

//存储折叠的侧边栏状态
export const userSlideBarExtend = defineStore("slideBarExtend", {
  state: () => ({
    musicBarExtend: false,
    leftBarExtend: false,
  }),
  actions: {
    toggleMusicBarExtend() {
      this.musicBarExtend = !this.musicBarExtend;
    },
    toggleLeftBarExtend() {
      this.leftBarExtend = !this.leftBarExtend;
    },
  },
});
//存储当前页面
export const userCurrentPage = defineStore("currentPage", {
  state: () => ({
    currentIndex: 0,
    targetScrollIndex: 0 // 新增滚动目标状态

  }),
  actions: {
    setCurrentPage(index: number) {
      this.currentIndex = index;
    },
    setTargetScrollIndex(index: number) {
      this.targetScrollIndex = index;
    }
  },
});

export const userBlogPage = defineStore("blogPage", {
  state: () => ({
    blogPage: 1,
  }),
  actions: {
    setBlogPage(index: number) {
      this.blogPage = index;
    },
  },
});
