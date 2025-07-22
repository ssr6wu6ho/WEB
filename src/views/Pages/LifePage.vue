<template>
  <div class="relative min-h-screen w-full overflow-hidden p-8">

    <!-- Photo Grid -->
    <section class="mb-8">
      <h1 class="text-7xl font-bold mb-8 flex items-center gap-2">
        🛹 & 📸
      </h1>
      <lifeTime class="mb-10"></lifeTime>
      <div class="grid lg:grid-cols-5 border-gray-400/20 border-2 rounded-3xl overflow-hidden">
        <div class="col-span-2 grid grid-rows-5 gap-6 p-6">
          <div class="row-span-4 group  bg-zinc-800/50 rounded-lg">
            <div class="grid grid-cols-2 h-1/2 p-6 gap-4">
              <div class="relative">
                <video autoplay loop muted class="w-full h-full object-cover transition-transform rounded-lg overflow-hidden 
                  group-hover:scale-110">
                  <source :src="videos[0].src" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div class=" relative ">
                <img :src="photos[1].cover" alt="Glass Animals"
                  class="absolute w-full h-full object-cover transition-transform rounded-lg overflow-hidden duration-500 group-hover:scale-110" />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 left-0 p-4">
                    <h3 class="text-lg font-bold mb-1">GLASS ANIMALS</h3>
                    <p class="text-sm">🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-1/2 relative p-2 ">
              <video autoplay loop muted
                class=" w-full h-full object-cover rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-110">
                <source :src="videos[1]?.src" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div
            class="row-span-1 relative rounded-xl p-6 border border-white/5 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10"
            :class="darkModeStore.isDark ? 'bg-gradient-to-br from-purple-500/20 to-green-400/10' : 'bg-gradient-to-br from-green-500/20 to-pink-400/10'">
            <div class="absolute inset-0 bg-noise opacity-10"></div>
            <h3 class="text-6xl font-black bg-gradient-to-r from-purple-200 to-pink-100 bg-clip-text text-transparent">
              LifePhoto</h3>
            <p class="text-sm mt-2">👽👽👽👽</p>
          </div>
        </div>

        <!-- 后半部分 -->
        <div class="col-span-3 grid gap-6 m-6">
          <div class="grid grid-cols-2 gap-6 row-span-2 rounded-lg p-4"
            :class="[darkModeStore.isDark ? 'bg-zinc-800/50' : 'bg-slate-500/30 shadow-lg']">
            <div class="group relative aspect-square bg-zinc-800/50 rounded-lg overflow-hidden">
              <img :src="photos[2].cover" alt="Glass Animals"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div class="group relative aspect-square bg-zinc-800/50 rounded-lg overflow-hidden">
              <img :src="photos[3].cover" alt="Glass Animals"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6 row-span-2 rounded-lg p-6"
            :class="[darkModeStore.isDark ? 'bg-zinc-800/50' : 'bg-slate-500/30 shadow-lg']">
            <div class="group relative aspect-square bg-zinc-800/50 rounded-lg overflow-hidden">
              <img :src="photos[0].cover" alt="Glass Animals"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div class="group relative aspect-square bg-zinc-800/50 rounded-lg overflow-hidden">
              <img :src="photos[0].cover" alt="Glass Animals"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import {
  CameraIcon, BookOpenIcon, HeartIcon, CalendarIcon, MusicIcon, PaletteIcon, PlaneIcon, CoffeeIcon
} from 'lucide-vue-next'

import { storeToRefs } from 'pinia';
import { userDarkMOdel } from '../../store/stateStore';
import lifeTime from '../components/LifeTime.vue'
const darkModeStore = userDarkMOdel();
const photos = [
  {
    id: 1,
    name: 'glass animals',
    cover: '/images/png_other/bgbg.jpg',
  },
  {
    id: 2,
    name: 'glass animals',
    cover: '/images/png_life/ga3.jpg',
  },
  {
    id: 3,
    name: 'glass animals',
    cover: '/images/png_life/sk1.jpg',
  },
  {
    id: 4,
    name: 'glass animals',
    cover: '/images/png_life/sk3.jpg',
  },
]
const videos = [
  {
    id: 1,
    src: '/images/1f7c1dbda4e66d651967e2b5d6b6d541.mp4',
  },
  {
    id: 2,
    src: '/images/4f77be389bcdb8f43a3679fc02016a2f.mp4',
  }
];

const interests = [
  { name: 'Music', icon: MusicIcon },
  { name: 'Art', icon: PaletteIcon },
  { name: 'Travel', icon: PlaneIcon },
  { name: 'Coffee', icon: CoffeeIcon }
]
</script>

<style scoped></style>