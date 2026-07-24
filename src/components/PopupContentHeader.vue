<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const props = defineProps({
  enableEditor: {
    type: Boolean,
    default: false
  },
  enableHelpScreen: {
    type: Boolean,
    default: false
  },
});

const { enableEditor, enableHelpScreen } = toRefs(props);

const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'back-button-action',): void,
  (e: 'hide-popup-to-button',): void
  (e: 'create-custom',): void,
  (e: 'open-help-screen'): void
}>();

onMounted(() => {
})

</script>

<template>
  <header class="sticky top-0 z-50 flex items-center justify-between p-container-padding bg-surface-container border-b border-outline-variant">
    <div class="flex items-center gap-inner-gap">
      <!-- Back button (editor/help mode) -->
      <ButtonComponent v-if="enableEditor || enableHelpScreen" @click="emit('back-button-action')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </ButtonComponent>

      <!-- Create custom button (normal mode) -->
      <ButtonComponent v-if="!enableEditor && !enableHelpScreen" @click="emit('create-custom')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 6a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1" />
        </svg>
      </ButtonComponent>

      <h1 class="font-headline-md text-headline-md font-bold text-primary">
        {{ enableEditor ? 'EDIT RECORD' : enableHelpScreen ? 'HELP' : 'ClipFlow' }}
      </h1>
    </div>
    <div class="flex items-center gap-inner-gap">
      <!-- Help button (normal mode) -->
      <ButtonComponent v-if="!enableHelpScreen" @click="emit('open-help-screen')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M11 18h2v-2h-2zm1-12c-2.2 0-4 1.8-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.8-3 5h2c0-2.2 3-2.5 3-5c0-2.2-1.8-4-4-4m7-1v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2" />
        </svg>
      </ButtonComponent>

      <!-- Hide popup button -->
      <ButtonComponent @click="emit('hide-popup-to-button')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14z" />
        </svg>
      </ButtonComponent>

      <!-- Close button -->
      <ButtonComponent @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
        </svg>
      </ButtonComponent>
    </div>
  </header>
</template>
