import { createRouter, createWebHistory } from "vue-router";

export const routes = [
  {
    path: "/messagePage",
    name: "messagePage",
    component: () => import("../views/Pages/MessagePage.vue"),
  },
  {
    path: "/blogPage",
    name: "blogPage",
    component: () => import("../views/Pages/BlogPage.vue"),
  },
  {
    path:"/Info",
    name:"InfoPage",
    component:()=>import("../views/Pages/InfoPage.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
