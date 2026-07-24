<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'click',): void,
}>();

const props = defineProps({
  typeButton: {
    type: String,
    default: 'icon'
  },
  tooltip: {
    type: String,
    default: ''
  },
});

const { typeButton } = toRefs(props);

const buttonStyle = ref<any>(['icon-button', 'flex', 'rounded-lg', 'cursor-pointer', 'border-none']);

onMounted(() => {
  if(typeButton.value !== 'icon') {
    buttonStyle.value = ['button-default', 'cursor-pointer', 'border-none']
  }
})

</script>

<template>
  <button @click="emit('click')" :class="buttonStyle">
    <slot></slot>
  </button>
</template>

<style>
.icon-button {
  width: max-content;
  height: auto;
  background: none;
  border: none;
  padding: 4px;
  color: #0d9488;
  transition: all 0.2s ease;
}

.icon-button:hover {
  color: #57f1db;
  background: rgba(13, 148, 136, 0.1);
}

.button-default {
  display: flex;
  pointer-events: all !important;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 16px;
}
</style>
