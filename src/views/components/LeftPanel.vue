<template>
    <!-- 修改后的侧边栏容器 -->
    <div class="h-full fixed duration-300 rounded-lg  p-2"
        :class="[slideBarExtendStore.leftBarExtend ? 'w-[250px]' : 'w-[50px]',]">
        <!-- 折叠按钮 -->
        <div class="flex h-10 items-center p-2" :class="{ 'justify-end': slideBarExtendStore.leftBarExtend }">
            <button @click="toggleSidebar" class="transform transition-transform duration-300 hover:scale-110" :class="[
                !slideBarExtendStore.leftBarExtend && 'rotate-180']">
                <PanelTopOpen class="w-5 h-5" />
            </button>
        </div>
        <!-- 折叠后的图标导航 -->
        <div class="p-2 space-y-4">
            <nav v-for="route in mainRoutes" class="flex items-center p-2 rounded-lg"
                @click="smoothRouteToPage(route.index)" :class="[
                    route.index === CurrentPageStore.currentIndex ? 'bg-gray-300/40' :
                        darkModeStore.isDark ? 'hover:bg-zinc-700/30' : 'hover:bg-gray-400',
                    slideBarExtendStore.leftBarExtend ? 'justify-start' : 'justify-center'
                ]">
                <component :is="route.icon" class="w-5 h-5 shrink-0" />
                <span v-show="slideBarExtendStore.leftBarExtend"
                    class="ml-2 text-sm truncate transition-opacity duration-300">
                    {{ route.name }}
                </span>
                <span v-if="!slideBarExtendStore.leftBarExtend"
                    class="absolute left-full ml-2 px-2 py-1 text-xs rounded-md opacity-0 transition-opacity duration-200"
                    :class="darkModeStore.isDark ? 'bg-zinc-700 text-white' : 'bg-gray-100 text-black'">
                    {{ route.name }}
                </span>
            </nav>
            <div class="p-4 border-t transition-colors"
                :class="darkModeStore.isDark ? 'border-zinc-700' : 'border-gray-200'">
            </div>
            <nav v-for="route in secondaryRoutes" class="flex items-center p-2 rounded-lg"
                @click="routeToPage(route.path)" :class="[slideBarExtendStore.leftBarExtend ? 'justify-start' : 'justify-center',
                darkModeStore.isDark ? 'hover:bg-zinc-700/30' : 'hover:bg-gray-400']">
                <component :is="route.icon" class="w-5 h-5 shrink-0" />
                <span v-show="slideBarExtendStore.leftBarExtend"
                    class="ml-2 text-sm truncate transition-opacity duration-300">
                    {{ route.name }}
                </span>
                <span v-if="!slideBarExtendStore.leftBarExtend"
                    class="absolute left-full ml-2 px-2 py-1 text-xs rounded-md opacity-0  transition-opacity duration-200">
                    {{ route.name }}
                </span>
            </nav>
        </div>

        <!-- 折叠时隐藏的内容 -->
        <div v-if="slideBarExtendStore.leftBarExtend">
            <!-- 系统状态监控 -->
            <div class="p-4 border-t transition-colors"
                :class="darkModeStore.isDark ? 'border-zinc-700' : 'border-gray-200'">
                <div class="space-y-4">
                    <div class="p-3 rounded-lg transition-colors">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs">SYSTEM STATUS</span>
                            <span class="flex items-center gap-2 text-xs">
                                <span class="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                ONLINE
                            </span>
                        </div>
                        <div class="space-y-2">
                            <div v-for="(stat, index) in systemStats" :key="index">
                                <div class="flex justify-between text-xs mb-1">
                                    <span>{{ stat.name }}</span>
                                    <span>{{ stat.value }}%</span>
                                </div>
                                <div class="h-1 rounded-full overflow-hidden">
                                    <div class="h-full duration-500 rounded-full" :class="stat.color"
                                        :style="{ width: `${stat.value}%` }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { userDarkMOdel, userCurrentPage, userSlideBarExtend } from '../../store/stateStore'
import 'vue3-carousel/dist/carousel.css'
import { useRouter } from 'vue-router'
const darkModeStore = userDarkMOdel()
const CurrentPageStore = userCurrentPage()
const slideBarExtendStore = userSlideBarExtend()
const router = useRouter()

import {
    CodeIcon, HeartIcon, PanelTopOpen, Music,
    MessageSquareDiff, Cpu
} from 'lucide-vue-next'

function toggleSidebar() {
    slideBarExtendStore.toggleLeftBarExtend();
}

// 路由配置
const mainRoutes = [ // 主要路由
    { index: 1, name: 'TECH_MATRIX', icon: CodeIcon },
    { index: 2, name: 'LIFE_STREAM', icon: HeartIcon },
    { index: 3, name: 'MUSIC', icon: Music }
]
const secondaryRoutes = [
    { index: 1, name: 'messagePage', icon: MessageSquareDiff, path: '/messagePage' },
    { index: 2, name: 'Info', icon: Cpu, path: '/Info' }
]

function smoothRouteToPage(_id: number) {
    CurrentPageStore.setTargetScrollIndex(_id);
}

const routeToPage = (route: string) => {
    router.push(route)
}

const systemStats = ref([
    { name: 'CPU LOAD', value: 45, color: 'bg-blue-500' },
    { name: 'MEMORY', value: 72, color: 'bg-purple-500' },
    { name: 'NETWORK', value: 89, color: 'bg-green-500' }
])
// 模拟系统状态数据变化
setInterval(() => {
    systemStats.value = systemStats.value.map(stat => ({
        ...stat,
        value: Math.floor(Math.random() * 100) // 随机生成新的状态值
    }))
}, 3000)

</script>