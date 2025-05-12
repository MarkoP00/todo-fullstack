import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import SingleTodo from "./pages/SingleTodo.vue";
const routes = [
  {
    path: "/",
    alias: "/api/todos",
    component: HomePage,
    name: "Home",
  },
  {
    path: "/:id",
    alias: "/api/todos/:id",
    component: SingleTodo,
    name: "SingleTodo",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
