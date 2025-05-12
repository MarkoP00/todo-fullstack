<template>
  <section class="section-wrapper">
    <GlobalSpinner v-if="isLoading"></GlobalSpinner>
    <TodoList
      :allTodos="allTodos"
      @updateList="getTodos"></TodoList>
    <AddTodo @todo-added="getTodos"></AddTodo>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import fetchRequest from "../vue-services/fetchRequest";
import callToast from "@/vue-services/callToast";
import GlobalSpinner from "@/components/GlobalSpinner.vue";
import TodoList from "@/components/TodoList.vue";
import AddTodo from "../components/AddTodo.vue";

const allTodos = ref([]);
const isLoading = ref(true);

const getTodos = async () => {
  try {
    const todos = await fetchRequest();
    if (!todos) {
      callToast("Something went wrong", "error");
    }
    allTodos.value = todos;
  } catch (error) {
    callToast(error.message || "Something went wrong", "error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getTodos();
});
</script>
