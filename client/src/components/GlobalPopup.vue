<template>
  <section
    class="popupSection"
    @click="handleEmit('popup-close')">
    <transition name="fadeIn">
      <main
        @click.stop
        v-if="popupVisible">
        <div class="popupTitle">{{ props.popupTitle }}</div>
        <div class="popupMessage">{{ props.popupMessage }}</div>
        <div
          class="popupSingleButton"
          v-if="props.singleButton">
          <GlobalButton
            :text="'Okay'"
            @click="handleEmit('popup-close')"></GlobalButton>
        </div>
        <div
          class="popupActionButtons"
          v-else>
          <GlobalButton
            :text="'Yes'"
            @click="handleEmit('popup-confirm')"></GlobalButton>
          <button
            class="closeButton"
            @click="handleEmit('popup-close')">
            No
          </button>
        </div>
      </main>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import GlobalButton from "./GlobalButton.vue";

const popupVisible = ref(null);
const props = defineProps({
  popupTitle: String,
  popupMessage: String,
  singleButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["popup-confirm", "popup-close"]);

function handleEmit(event) {
  setTimeout(() => {
    emit(event);
  }, 500);
  popupVisible.value = false;
}

onMounted(() => {
  popupVisible.value = true;
});
</script>

<style scoped>
.popupSection {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popupSection main {
  background: rgb(255, 255, 255, 0.9);
  border-radius: 8px;
  width: 90%;
  max-width: 450px;
  padding: 20px;
  box-shadow: 0 5px 35px rgb(0, 180, 255, 0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  border: 1px solid rgb(0, 180, 255);
}

.popupTitle {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 10px;
  color: #000;
}

.popupTitle::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: #3498db;
  margin: 0 auto;
  border-radius: 2px;
  margin-top: 10px;
}

.popupMessage {
  font-size: 1rem;
  color: #000;
  margin-bottom: 20px;
}

.popupSingleButton {
  display: flex;
  justify-content: center;
}

.popupActionButtons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.popupActionButtons button {
  font-size: 16px;
}

.closeButton {
  background: #333;
  border: 1px solid #444;
  color: #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 50%;
}

.closeButton:hover {
  background: #e74c3c;
  color: white;
}

.fadeIn-enter-from,
.fadeIn-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: all 0.5s;
}
.fadeIn-enter-to,
.fadeIn-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
