import { createApp } from "vue";
import App from "./App.vue";
import Vue3Toastify from "vue3-toastify";
import router from "./router";
import "vue3-toastify/dist/index.css";
import "../src/main.css";

const app = createApp(App);
app.use(Vue3Toastify, {
  poistion: "top-right",
  autoClose: 3000,
  closeOnClick: true,
});
app.use(router);
app.mount("#app");
