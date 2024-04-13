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

const buttonStyle = ref<any>(['icon-button', 'flex', 'rounded-full', 'shadow', 'cursor-pointer', 'border-none']);

onMounted(() => {
  if(typeButton.value !== 'icon') {
    buttonStyle.value = ['button-default', 'shadow', 'cursor-pointer', 'border-none']
  }
})

</script>

<template>
  <button  @click="emit('click')" :class="buttonStyle" :bg='typeButton !== "icon" ? "teal-600 hover:teal-700" : ""'>
    <slot></slot>
  </button>
</template>

<style>
.icon-button {
  width: max-content;
  height: auto;
  background: none;
}

.button-default {
  display: flex;
  pointer-events: all !important;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: #0a0a0a;
  font-weight: 600;
  font-size: 12px;
}
</style>
