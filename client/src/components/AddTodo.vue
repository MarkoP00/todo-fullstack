<template>
  <main class="add-todo-wrapper">
    <h1>Add Todo</h1>
    <form @submit.prevent>
      <input
        type="text"
        v-model="todoData.title"
        :class="{ invalid: todoData.invalid }"
        placeholder="Write your task..."
        @blur="todoData.invalid = false" />
      <GlobalButton
        @click="addTodo"
        :text="'Add Todo'" />
    </form>
  </main>
</template>

<script setup>
import { ref } from "vue";
import GlobalButton from "../components/GlobalButton.vue";
import callToast from "../vue-services/callToast";
import fetchRequest from "../vue-services/fetchRequest.js";

const todoData = ref({
  title: "",
  invalid: false,
});

const emits = defineEmits(["todo-added"]);

async function addTodo() {
  if (
    todoData.value.title === "" ||
    todoData.value.title.length < 3 ||
    todoData.value.invalid
  ) {
    todoData.value.invalid = true;
    callToast("Title must be at least 3 characters long", "warning");
    return;
  }
  try {
    const responseData = await fetchRequest("", "POST", {
      title: todoData.value.title,
    });

    if (responseData) {
      emits("todo-added");
      todoData.value.title = "";
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.add-todo-wrapper {
  max-width: 660px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
}

.add-todo-wrapper h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #333;
}

.add-todo-wrapper form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-todo-wrapper input {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.add-todo-wrapper input:focus {
  outline: none;
  border-color: rgba(3, 207, 253);
  box-shadow: 0 0 10px 2px rgba(3, 207, 253, 0.2);
}
input.invalid {
  box-shadow: 0 0 10px 2px rgba(253, 16, 3, 0.4);
  border-color: rgba(253, 16, 3, 0.4);
}
</style>
