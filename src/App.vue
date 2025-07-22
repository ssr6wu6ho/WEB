<template>
  <MainView />
</template>

<script setup>
import MainView from './views/MainView.vue';
</script>

<style>
/* 整体滚动条 */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #9265a7;
  /* 滑块背景颜色 */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #553a3a;
  /* 悬停时的背景颜色 */
}
</style>