<template>
  <section class="section-wrapper">
    <GlobalPopup
      v-if="popupTitle"
      :popupTitle="popupTitle"
      :popupMessage="popupMessage"
      @popup-confirm="deleteTodo"
      @popup-close="handlePopup('', '')"></GlobalPopup>
    <h1 class="single-todo-title">Your Task</h1>
    <main class="single-todo-content">
      <p v-if="singleTodo.length === 0">Task not found...</p>
      <div
        v-else
        class="todo-item"
        :class="{ finished: singleTodo.finished }">
        <div class="item-info">
          <transition
            name="fade"
            mode="out-in">
            <h2
              v-if="!editVisible"
              @click="editVisible = true">
              {{ singleTodo.title }}
            </h2>

            <div
              v-else
              class="edit-todo">
              <input
                type="text"
                v-model="editValue"
                ref="editInput" />
              <button
                @click="editTask(false)"
                class="save-btn"
                :disabled="editValue.trim().length < 3">
                Edit
              </button>
              <button
                class="cancel-btn"
                @click="cancelEdit">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </transition>

          <p>Created: {{ handleDate(singleTodo.createdAt) }}</p>
          <p v-if="singleTodo.updatedAt !== singleTodo.createdAt">
            Updated: {{ handleDate(singleTodo.updatedAt) }}
          </p>
        </div>

        <transition
          name="fade"
          mode="out-in">
          <div
            v-if="!editVisible"
            class="item-icons"
            @click.stop>
            <i
              class="fa-solid fa-check"
              title="Completed"
              v-if="singleTodo.finished"
              @click="editTask(true)"></i>
            <i
              class="fa-solid fa-hourglass-half"
              title="Pending"
              v-else
              @click="editTask(true)"></i>
            <i
              class="fa-solid fa-pen"
              title="Edit"
              @click="editVisible = !editVisible"></i>
            <i
              class="fa-solid fa-trash"
              title="Delete"
              @click="
                handlePopup(
                  'Delete confirmation',
                  'Are you sure you want to delete this task?'
                )
              "></i>
          </div>
        </transition>
      </div>
    </main>
  </section>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import fetchRequest from "../vue-services/fetchRequest";
import handleDate from "@/vue-services/handleDate";
import callToast from "@/vue-services/callToast";
import GlobalPopup from "@/components/GlobalPopup.vue";

const router = useRouter();
const route = useRoute();
const providedID = route.params.id;

const singleTodo = ref([]);

const popupTitle = ref("");
const popupMessage = ref("");

const editVisible = ref(false);
const editInput = ref(null);
const editValue = ref("");

async function getSingleTodo() {
  const responseData = await fetchRequest(`/${providedID}`);

  if (responseData) {
    singleTodo.value = { ...responseData };
    editValue.value = responseData.title;
  }
}

async function editTask(updateStatus = false) {
  try {
    const todoBody = updateStatus
      ? {
          finished: !singleTodo.value.finished,
          title: singleTodo.value.title.trim(),
        }
      : { title: editValue.value.trim(), finished: singleTodo.value.finished };

    if (!updateStatus && (!todoBody.title || todoBody.title.length < 3)) {
      callToast("warning", "Title must be at least 3 characters");
      return;
    }

    const responseData = await fetchRequest(
      `/${providedID}`,
      "PATCH",
      todoBody
    );

    if (!responseData) {
      callToast("error", "Something went wrong");
      return;
    }
    getSingleTodo();
  } catch (error) {
    callToast(error.message || "Something went wrong", "error");
  } finally {
    editVisible.value = false;
  }
}

async function deleteTodo() {
  try {
    const responseData = await fetchRequest(`/${providedID}`, "DELETE");

    if (responseData) {
      singleTodo.value = [];
      setTimeout(() => {
        router.push("/api/todos");
      }, 2000);
    }
  } catch (error) {
    callToast(error.message || "Something went wrong", "error");
    console.log(error);
  } finally {
    handlePopup("", "", null);
  }
}

const cancelEdit = () => {
  editVisible.value = false;
  editValue.value = singleTodo.value.title;
};

const handlePopup = (title, message) => {
  popupTitle.value = title;
  popupMessage.value = message;
};

onMounted(() => {
  getSingleTodo();
});

watch(editVisible, async (newVal) => {
  if (newVal) {
    await nextTick();
    setTimeout(() => {
      editInput.value?.focus();
    }, 300);
  }
});
</script>

<style scoped>
.single-todo-content {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
}
.single-todo-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.todo-item {
  background: rgba(242, 46, 32, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
  color: #444;
  position: relative;
}

.item-info {
  min-height: 80px;
  position: relative;
}

.item-info h2 {
  max-width: 300px;
  cursor: pointer;
}

.edit-todo {
  display: flex;
  align-items: center;
  gap: 10px;
  top: 0;
  left: 0;
  right: 0;
}

.edit-todo input {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  font-weight: 700;
  width: 100%;
  color: #444;
  outline: none;
}

.save-btn {
  padding: 0.5rem 1.2rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:hover {
  background: #4338ca;
}

.save-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 0.5rem;
  background: #e9536c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #a83346;
}
.finished {
  background: rgba(111, 222, 111, 0.3);
}

@media (max-width: 600px) {
  .edit-todo {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .edit-todo button {
    width: 100%;
  }
}

/* transtions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
