<template>
  <section class="list-section">
    <GlobalPopup
      v-if="popupTitle"
      :popupTitle="popupTitle"
      :popupMessage="popupMessage"
      @popup-confirm="deleteTodo"
      @popup-close="handlePopup('', '', null)"></GlobalPopup>
    <div
      v-if="allTodos.length === 0"
      class="no-todos">
      <h1 class="title">Todo List</h1>
      <span>No todos yet.</span>
    </div>
    <div
      class="todos-container"
      v-else>
      <h1 class="title">Todo List</h1>
      <div>
        <div class="list-wrapper">
          <section class="todo-section">
            <h2 class="list-title title-not-finished">Not finished ❌</h2>
            <transition-group
              name="fade-slide"
              tag="ul"
              class="todo-list">
              <li
                v-for="todo in allTodos.filter((t) => !t.finished)"
                :key="todo._id"
                @click="router.push(`/api/todos/${todo._id}`)"
                class="todo-item">
                <div class="item-info">
                  <h2>{{ todo.title }}</h2>
                  <p>Created: {{ handleDate(todo.createdAt) }}</p>
                  <p v-if="todo.updatedAt !== todo.createdAt">
                    Updated: {{ handleDate(todo.updatedAt) }}
                  </p>
                </div>
                <div
                  class="item-icons"
                  @click.stop>
                  <i
                    class="fa-solid fa-hourglass-half"
                    title="Pending"
                    @click="toggleStatus(todo)"></i>
                  <i
                    class="fa-solid fa-trash"
                    title="Delete"
                    @click="
                      handlePopup(
                        'Delete Confirmation',
                        'Are you sure you want to delete todo?',
                        todo._id
                      )
                    "></i>
                </div>
              </li>
            </transition-group>
          </section>

          <section class="todo-section">
            <h2 class="list-title title-finished">Finished ✔️</h2>
            <transition-group
              name="fade-slide"
              tag="ul"
              class="todo-list">
              <li
                v-for="todo in allTodos.filter((t) => t.finished)"
                :key="todo._id"
                class="todo-item finished"
                @click="router.push(`/api/todos/${todo._id}`)">
                <div class="item-info">
                  <h2>{{ todo.title }}</h2>
                  <p>Created: {{ handleDate(todo.createdAt) }}</p>
                  <p v-if="todo.updatedAt !== todo.createdAt">
                    Updated: {{ handleDate(todo.updatedAt) }}
                  </p>
                </div>
                <div
                  class="item-icons"
                  @click.stop>
                  <i
                    class="fa-solid fa-check"
                    title="Completed"
                    @click="toggleStatus(todo)"></i>
                  <i
                    class="fa-solid fa-trash"
                    title="Delete"
                    @click="
                      handlePopup(
                        'Delete Confirmation',
                        'Are you sure you want to delete todo?',
                        todo._id
                      )
                    "></i>
                </div>
              </li>
            </transition-group>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import handleDate from "@/vue-services/handleDate";
import fetchRequest from "../vue-services/fetchRequest";
import GlobalPopup from "./GlobalPopup.vue";
import callToast from "@/vue-services/callToast";

const router = useRouter();
const popupTitle = ref("");
const popupMessage = ref("");

const selectedTodoID = ref(null);

const emits = defineEmits(["updateList"]);
const props = defineProps({
  allTodos: {
    type: Array,
    required: true,
  },
});

async function deleteTodo() {
  try {
    const responseData = await fetchRequest(
      `/${selectedTodoID.value}`,
      "DELETE"
    );

    if (responseData) {
      emits("updateList");
    }
  } catch (error) {
    callToast(error.message || "Something went wrong", "error");
    console.log(error);
  } finally {
    handlePopup("", "", null);
  }
}

const toggleStatus = async (todo) => {
  try {
    const todoBody = {
      title: todo.title,
      finished: !todo.finished,
    };

    const responseData = await fetchRequest(`/${todo._id}`, "PATCH", todoBody);

    if (!responseData) {
      callToast("error", "Something went wrong");
      return;
    }

    emits("updateList");
  } catch (error) {
    callToast(error.message || "Something went wrong", "error");
  }
};

const handlePopup = (title, message, id) => {
  popupTitle.value = title;
  popupMessage.value = message;
  selectedTodoID.value = id;
};
</script>

<style scoped>
.todos-container {
  max-width: 700px;
  width: 100%;
  min-height: 95vh;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
  padding: 1rem;
  overflow: hidden;
}
.no-todos {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
  padding: 1rem;
  overflow: hidden;
}
.title {
  font-size: 1.8rem;
  text-align: center;
  color: #333;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.list-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0.3rem 0;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-left: 5px solid #888;
  border-radius: 5px;
  color: #333;
}

.list-title.title-not-finished {
  border-left-color: #f22e20;
  background-color: rgb(242, 46, 32, 0.2);
}

.list-title.title-finished {
  border-left-color: rgb(109, 222, 109, 1);
  background-color: rgb(109, 222, 109, 0.2);
}

.todo-section h2 {
  color: #444;
}

.todo-list {
  list-style: none;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  min-height: 100px;
  height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
}

.todo-item {
  background: rgba(242, 46, 32, 0.3);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}
.todo-item:last-child {
  position: relative;
}

.todo-item:hover {
  transform: scale(1.02);
  cursor: pointer;
}
.finished {
  background: rgba(111, 222, 111, 0.3);
}

.finished h2 {
  text-decoration: line-through;
  color: #555;
}

.todo-item h2 {
  margin: 0 0 0.5rem 0;
}

.item-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* transition styles */
.fade-slide-move {
  transition: transform 0.5s ease;
}

.fade-slide-enter-active {
  transition: all 0.5s ease;
}

.fade-slide-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  /* width: calc(100% - 2rem); */
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .todo-list {
    padding: 0;
    height: 270px;
  }
}

@media (max-width: 425px) {
  .todo-item {
    box-shadow: none;
    gap: 20px;
  }
  .item-info p {
    display: none;
  }
  .list-wrapper {
    gap: 3rem;
  }
}
</style>
