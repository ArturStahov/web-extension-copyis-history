<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'get-font-details',): void,
  (e: 'hide-popup-to-button',): void
}>();

onMounted(() => {
})

</script>

<template>
  <div class="header-wrapper">
    <ButtonComponent @click="emit('hide-popup-to-button')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#0d9488"
          d="m12 12.5l-4 4h8zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zM19 8V5H5v3zM5 10v9h14v-9zm0-2V5z" />
      </svg>
    </ButtonComponent>
    <ButtonComponent @click="emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 24 24">
        <path fill="#0d9488"
          d="M4 0h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm7.414 8l2.829 2.828a1 1 0 0 1-1.415 1.415L10 11.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L8.586 10L5.757 7.172a1 1 0 0 1 1.415-1.415L10 8.586l2.828-2.829a1 1 0 0 1 1.415 1.415z" />
      </svg>
    </ButtonComponent>
  </div>
</template>

<style>
.popup-content .header-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
