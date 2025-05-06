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

interface MusicTrack {
  id: number;
  title?: string;
  artist?: string;
  cover?: string;
  duration?: string;
  url?: string;
}

export const userMusicState = defineStore("musicState", {
  state: () => ({
    isPlaying: false,
    currentTrackIndex: 0,    // 当前播放索引
    currentTime: 0,         // 当前播放时间
    currentMusic: {
      id: 1,
      title: '',
      artist: '',
      cover: '',
      duration: '',
      url: ''
    },
    audioElement: null as HTMLAudioElement | null // 音频元素
  }),

  actions: {
    // 初始化音频
    initAudio(url: string) {

      this.audioElement = new Audio(url)

      if (this.audioElement) {
        this.audioElement.play().catch((error) => {
          console.error('音频播放失败:', error);
        });
      }
    },

    setCurrentMusic(track: MusicTrack) {
      this.currentMusic.id = track.id;
      this.currentMusic.title = track.title || '';
      this.currentMusic.artist = track.artist || '';
      this.currentMusic.cover = track.cover || '';
      this.currentMusic.duration = track.duration || '';
      this.currentMusic.url = track.url || '';
      console.log('setCurrentMusic', this.currentMusic);

      if (this.currentMusic.url) {
        this.initAudio(this.currentMusic.url);
      }
    },

    // 播放/暂停
    togglePlay() {
      if (!this.audioElement) return
      this.isPlaying = !this.isPlaying
      this.isPlaying ? this.audioElement.play() : this.audioElement.pause()
    },

    cleanup() {
      if (this.audioElement) {
        this.audioElement.pause()
        this.audioElement.removeAttribute('src')
        this.audioElement = null
      }
    }
  }

})