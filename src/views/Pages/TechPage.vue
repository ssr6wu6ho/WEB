<template>
  <div class="relative min-h-screen w-full overflow-hidden p-8">
    <h2 class="text-2xl font-bold mb-8 flex items-center gap-2 p-10">
      <component :is="CodeIcon" class="w-6 h-6" />
      {{ t('techPage.projects') }}
    </h2>
    <main class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-8 justify-content
      border rounded-2xls border-gray-400/20 border-2 p-8 rounded-3xl">
      <section class="mb-16 col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div v-for="project in projects" :key="project.id"
          class="relative rounded-lg overflow-hidden transition-colors p-4 hover:bg-slate-200/30"
          :class="[darkModeStore.isDark ? 'bg-zinc-800/50' : 'bg-slate-500/30 shadow-lg']"
          @click="pageToBlog(project.id)">
          <div class="aspect-video relative">
            <img :src="project.image" :alt="project.title"
              class="w-full h-full overflow-hidden rounded-lg object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t overflow-hidden rounded-lg"
              :class="[darkModeStore.isDark ? 'from-zinc-900/90' : 'from-gray-900/70']" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-bold mb-2">{{ project.title }}</h3>
            <p class="text-sm">{{ project.description }}</p>
            <div class="mt-4 flex gap-2">
              <span v-for="tech in project.tech" :key="tech" class="px-2 py-1 text-xs rounded"
                :class="[darkModeStore.isDark ? 'bg-zinc-700' : 'bg-slate-500/30']">
                {{ tech }}
              </span>
            </div>
            <div class="mt-4 flex gap-2">
              <component v-for="icon in project.icon" :key="icon" :is="icon" class=" w-6 h-6">
              </component>
            </div>
            <button class="text-sm font-medium hover:text-white transition-colors md:mt-4">
              Read More →
            </button>
          </div>
        </div>
      </section>

      <section class="mb-16">
        <div class="gap-8 justify-content ">
          <h3 class="text-xl font-bold mb-2 flex items-center">{{ t('techPage.techStack') }}</h3>
          <div class="p-6 rounded-lg">
            <div v-for="skill in TECH_STACK" key="skills" class="mb-8">
              <h3 :class="skill.title" class="text-gray-400 mb-4">{{ skill.title }}</h3>
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <!-- 每个条目容器改用横向排列 -->
                <div v-for="frontend in skill.frontend" class="flex items-center gap-2 p-2">
                  <component :is="frontend.icons" class="w-6 h-6" />
                  <p>{{ frontend.skill }}</p>
                  <div class="flex h-2 rounded-full overflow-hidden"
                    :class="[darkModeStore.isDark ? 'bg-zinc-700' : 'bg-gray-200']">
                    <div class="h-full rounded-full" :class="[frontend.color]" :style="{ width: `${frontend.level}%` }">
                      ------</div>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <div v-for="hardwear in skill.hardWear" class="flex items-center gap-2 p-2">
                  <component :is="hardwear.icons" class="w-6 h-6" />
                  <p>{{ hardwear.skill }}</p>
                  <div class="flex h-2 rounded-full overflow-hidden"
                    :class="[darkModeStore.isDark ? 'bg-zinc-700' : 'bg-gray-200']">
                    <div class="h-full rounded-full" :class="[hardwear.color]" :style="{ width: `${hardwear.level}%` }">
                      ------</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CodeIcon } from 'lucide-vue-next';
import { userBlogPage } from '../../store/stateStore.ts';
import { userDarkMOdel } from '../../store/stateStore.ts'
import { useRouter } from 'vue-router'
import { i18n } from '../../utils/18n'
import svg_android from '../../icons/android.svg';
import svg_arduino from '../../icons/arduino.svg';
import svg_html from '../../icons/html.svg';
import svg_linux from '../../icons/linux.svg';
import svg_mqtt from '../../icons/mqttx.svg';
import svg_spring from '../../icons/spring.svg';
import svg_vue from '../../icons/vue.svg';
import svg_tailwind from '../../icons/tailwindcss.svg';
import svg_typescript from '../../icons/typescript.svg';
import svg_supabase from '../../icons/supabase.svg'
import svg_vite from '../../icons/vite.svg'
import svg_python from '../../icons/python.svg'
const darkModeStore = userDarkMOdel();
const blogPageStore = userBlogPage();
const router = useRouter();
const t = i18n.global.t;
const pageToBlog = (blogId: number) => {
  blogPageStore.setBlogPage(blogId);
  router.push("/blogPage");
}

const projects = computed(() => [
  {
    id: 1,
    title: t('techPage.personWeb'),
    description: t('techPage.personWebIntro'),
    image: '/src/components/png_praises/Web_.png',
    tech: ['Vue.js', 'Typescript'],
    icon: [svg_vue, svg_tailwind, svg_typescript, svg_supabase]
  },
  {
    id: 2,
    title: t('techPage.APPXIOT'),
    description: t('techPage.APPXIOTIntro'),
    image: '/src/components/png_praises/Iot_5.png',
    tech: ['MQTT', 'Esp8266/32', 'Arudino', 'Android', 'java', 'C++'],
    icon: [svg_mqtt, svg_arduino, svg_android, svg_spring, svg_vue]
  },
]);

const TECH_STACK = computed(() => [
  {
    title: t('techPage.softWear'),
    frontend: [
      {
        skill: 'Vue + Vite + Tailwind',
        icons: svg_vite,
        level: 70,
        color: 'bg-green-500'
      },
      {
        skill: 'HTML + CSS + JS',
        icons: svg_html,
        level: 80,
        color: 'bg-blue-500'
      },
      {
        skill: 'android + java',
        icons: svg_android,
        level: 85,
        color: 'bg-purple-500'
      }
    ],
  },
  {
    title: t('techPage.hardWear'),
    hardWear: [
      {
        skill: 'arduino + esp8266/32',
        icons: svg_arduino,
        level: 55,
        color: 'bg-green-500'
      },
      {
        skill: 'micropython + opencv',
        icons: svg_python,
        level: 40,
        color: 'bg-blue-500'
      },
      {
        skill: 'linux',
        icons: svg_linux,
        level: 40,
        color: 'bg-purple-500'
      },
    ]
  }
])
</script>