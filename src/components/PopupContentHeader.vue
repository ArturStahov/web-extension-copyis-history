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
  <header class="sticky top-0 z-50 flex items-center justify-between px-container-padding h-14 bg-surface border-b border-outline-variant">
    <div class="flex items-center gap-inner-gap">
      <!-- Back button for editor/help -->
      <button
        v-if="enableEditor || enableHelpScreen"
        class="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
        @click="emit('back-button-action')"
      >
        <span class="i-mdi-arrow-left text-on-surface-variant text-[20px]"></span>
      </button>

      <!-- Create custom button (main screens only) -->
      <button
        v-if="!enableEditor && !enableHelpScreen"
        class="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
        @click="emit('create-custom')"
      >
        <span class="i-mdi-plus text-primary text-[20px]"></span>
      </button>

      <!-- App title -->
      <h1 class="font-headline-md text-headline-md font-bold text-primary">ClipFlow</h1>
    </div>

    <div class="flex items-center gap-inner-gap">
      <!-- Help button -->
      <button
        v-if="!enableHelpScreen"
        class="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
        @click="emit('open-help-screen')"
      >
        <span class="i-mdi-help-circle-outline text-on-surface-variant text-[20px]"></span>
      </button>

      <!-- Hide popup button -->
      <button
        class="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
        @click="emit('hide-popup-to-button')"
      >
        <span class="i-mdi-minus text-on-surface-variant text-[20px]"></span>
      </button>

      <!-- Close button -->
      <button
        class="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
        @click="emit('close')"
      >
        <span class="i-mdi-close text-on-surface-variant text-[20px]"></span>
      </button>
    </div>
  </header>
</template>
