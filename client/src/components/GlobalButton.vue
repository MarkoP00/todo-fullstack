<template>
  <button class="defaultButton">
    <span class="defaultSpanText">{{ props.text }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  text: String,
});
</script>

<style scoped>
.defaultButton {
  align-items: center;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-size: 18px;
  justify-content: center;
  line-height: 1em;
  width: 100%;
  min-width: 140px;
  padding: 3px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;
}

.defaultButton:active,
.defaultButton:hover {
  outline: 0;
}

.defaultButton span {
  background-color: rgb(5, 6, 45);
  padding: 16px 24px;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  transition: 300ms;
}

.defaultButton:hover span {
  background: none;
}

.defaultButton:active {
  transform: scale(0.9);
}

.defaultButton:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>
