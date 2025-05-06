<template>
  <div class="relative min-h-screen w-full overflow-hidden p-8">
    <!-- Playlist Grid -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold mb-8 flex items-center gap-2">
        <component :is="HeadphonesIcon" class="w-6 h-6" />
        ACTIVE_PLAYLISTS
      </h2>
      <!--会将元素的最大宽度设置为视口的宽度。-->
      <!--横向滚动容器-->
      <div class="max-w-screen mx-auto p-4">
        <!--snap-mandatory: 设置滚动快照行为为强制模式，即滚动必须停靠在快照点上。-->
        <div class="overflow-x-hidden space-x-4 p-4">
          <div class="flex flex-nowrap gap-4 w-max scroll-animation">
            <div v-for="album in firstRowAlbums" :key="album.id">
              <div class="group relative aspect-square bg-gray-800 rounded-lg overflow-hidden p-1 w-[400px]">
                <img :src="album.cover" alt="album.name" class="w-full h-full object-cover">
                <div
                  class="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4 w-full">
                    <h3 class="text-white text-lg font-bold mb-1">{{ album.name }}</h3>
                    <p class="text-gray-300 text-sm">{{ album.trackCount }} tracks</p>
                  </div>
                  <button
                    class="absolute top-4 right-4 p-3 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors">
                    <Play class="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="overflow-x-hidden space-x-4 p-4">
          <div class="flex flex-nowrap gap-4 w-max reverse-scroll-animation">
            <div v-for="album in secondRowAlbums" key="album.id">
              <!-- `group` 类 -->
              <!-- 用于在子元素中使用 `group-hover` 等修饰符 -->
              <!-- `relative` 类 -->
              <!-- 设置相对定位，以便子元素可以绝对定位在这个容器内 -->
              <div class="group relative aspect-square bg-gray-800 rounded-lg overflow-hidden p-1 w-[400px]">
                <img :src="album.cover" alt="album.name" class="w-full h-full">
                <!--确保包含滚动内容的父元素设置了 position: relative，这样 absolute 定位的子元素才能相对于它进行定位。-->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4 w-full">
                    <h3 class="text-white text-lg font-bold mb-1">{{ album.name }}</h3>
                    <p class="text-gray-300 text-sm">{{ album.trackCount }} tracks</p>
                  </div>
                  <button
                    class="absolute top-4 right-4 p-3 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors">
                    <Play class="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Playlist -->
    <section>
      <h2 class="text-2xl font-bold mb-8 flex items-center gap-2">
        <component :is="CatIcon" class="w-6 h-6" />
        TRACK_MATRIX
      </h2>
      <div class="rounded-lg overflow-hidden">
        <div v-for="track in tracks" :key="track.id"
          class="flex items-center justify-between p-4 hover:bg-zinc-700/50 transition-colors"
          @click="playMusic(track)">
          <div class="flex items-center gap-4">
            <img :src="track.cover" :alt="track.title" class="w-12 h-12 rounded object-cover" />
            <div>
              <h3 class="font-medium">{{ track.title }}</h3>
              <p class="text-sm ">{{ track.artist }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm">{{ track.duration }}</span>
            <button class="p-2 rounded-lg transition-colors">
              <Play class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Play } from 'lucide-vue-next'
import { userMusicState } from '../../store/stateStore'
import { HeadphonesIcon, CatIcon } from 'lucide-vue-next'

const musicStore = userMusicState()


const albums = ref([
  {
    id: 1,
    name: 'how to be a human being',
    cover: '/src/components/png_music/HowToBeAHumanBeing.jpg',
    trackCount: 25
  },
  {
    id: 2,
    name: 'omnipotent youth society',
    cover: '/src/components/png_music/OmnipotentYouthSociety.jpg',
    trackCount: 18
  },
  {
    id: 3,
    name: 'optimist',
    cover: '/src/components/png_music/Optimist.jpg',
    trackCount: 32
  },
  {
    id: 4,
    name: 'brent2',
    cover: '/src/components/png_music/Brent2.jpg',
    trackCount: 25
  },
  {
    id: 5,
    name: 'inside the cable temple',
    cover: '/src/components/png_music/InsideTheCableTemple.jpg',
    trackCount: 25
  },
  {
    id: 6,
    name: 'dreamland',
    cover: '/src/components/png_music/Dreamland.jpg',
    trackCount: 25
  },
  {
    id: 9,
    name: 'ILoveyouSoFuckingMuch',
    cover: '/src/components/png_music/ILoveyouSoFuckingMuch.jpg',
    trackCount: 25
  },
  {
    id: 8,
    name: 'cyinc',
    cover: '/src/components/png_music/CYINC.jpg',
    trackCount: 25
  },
  {
    id: 9,
    name: 'TheServile',
    cover: '/src/components/png_music/TheServile.jpg',
    trackCount: 25
  }

])

//拆分为两行然后将每行的专辑数组复制一份，合并到原数组后面动画 无缝衔接
const firstRowAlbums = [...albums.value.slice(0, 4), ...albums.value.slice(0, 4)];
const secondRowAlbums = [...albums.value.slice(4, 9), ...albums.value.slice(4, 9)];

const tracks = [
  {
    id: 1,
    title: 'Midnight Dreams',
    artist: 'Luna Wave',
    cover: '/src/components/png_music/ILoveyouSoFuckingMuch.jpg',
    duration: '3:45',
    url: '/src/components/music_1.m4a'
  },
  {
    id: 2,
    title: 'Summer Breeze',
    artist: 'Solar Beats',
    cover: '/src/components/png_music/cyinc.jpg',
    duration: '4:20',
    url: '/src/components/music_2.m4a'
  },
]
interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  url: string;
}
const playMusic = (currentTrack: MusicTrack) => {
  // 假设专辑接口返回 tracks
  musicStore.setCurrentMusic(currentTrack);
}

</script>

<style scoped>
/* 新增动画 */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
    /* 移动一半宽度（克隆后总宽度为两倍） */
  }
}

/* 应用动画的类 */
.scroll-animation {
  animation: scroll 20s linear infinite;
  /* 时长 20s，可根据需求调整 */
  will-change: transform;
  /* 优化性能 */
}

/* 新增反向滚动动画 */
@keyframes reverse-scroll {
  0% {
    transform: translateX(-50%);
  }

  100% {
    transform: translateX(0);
    /* 移动正方向，实现反向滚动 */
  }
}

/* 应用反向动画的类 */
.reverse-scroll-animation {
  animation: reverse-scroll 20s linear infinite;
  will-change: transform;
}

/* 悬停暂停动画 */
.scroll-animation:hover {
  animation-play-state: paused;
}

/* 悬停暂停动画 */
.reverse-scroll-animation:hover {
  animation-play-state: paused;
}
</style>
