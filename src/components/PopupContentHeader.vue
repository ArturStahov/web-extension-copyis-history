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
      <div class="i-material-symbols:top-panel-close-outline w-24px h-24px" style="color: #0d9488;"></div>
    </ButtonComponent>
    <ButtonComponent @click="emit('close')">
      <div class="i-jam:close-rectangle w-24px h-24px" style="color: #0d9488;"></div>
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
