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

const buttonStyle = ref<any>([]);

onMounted(() => {
  if (typeButton.value !== 'icon') {
    buttonStyle.value = ['bg-secondary-container', 'text-on-secondary-container', 'font-label-lg', 'rounded-lg', 'hover:opacity-90', 'transition-opacity', 'active:scale-[0.98]']
  } else {
    buttonStyle.value = ['p-2', 'rounded-full', 'hover:bg-surface-container', 'transition-colors', 'active:scale-95']
  }
})
</script>

<template>
  <button @click="emit('click')" :class="buttonStyle">
    <slot></slot>
  </button>
</template>
