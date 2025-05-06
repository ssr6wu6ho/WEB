import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/index.css";
import App from "./App.vue";

import router from './router/index';
import {i18n} from './utils/18n';


const app = createApp(App);
const pinia = createPinia();


app.use(i18n);
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount("#app");