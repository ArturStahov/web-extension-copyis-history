<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'save-custom-item', payload: any): void,
}>();

onMounted(() => {
})
</script>

<template>
  <div class="flex flex-col p-container-padding">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="font-headline-md text-headline-md text-on-surface">Help</h2>
      <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">About Copybook extension</p>
    </div>

    <!-- Video -->
    <div class="w-full rounded-lg overflow-hidden mb-4 border border-outline-variant/30">
      <iframe
        width="100%"
        height="200"
        src="https://www.youtube.com/embed/V1HcJ7BKCkc"
        title="Copybook - a powerful tool for saving and managing copied text"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture;"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Recommendations -->
    <h3 class="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-3">Recommendations</h3>

    <ul class="space-y-3">
      <li class="font-body-sm text-on-surface leading-relaxed">
        To activate the paste popup window, select a text field on the page and use
        <span class="font-mono-sm text-mono-sm bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/30">Shift + Click</span>
      </li>
      <li class="font-body-sm text-on-surface leading-relaxed">
        Watch the video tutorial:
        <a
          class="text-primary hover:underline font-medium"
          href="https://www.youtube.com/watch?v=V1HcJ7BKCkc&ab_channel=A.Stakhov"
          target="_blank"
        >
          YouTube Link
        </a>
      </li>
      <li class="font-body-sm text-on-surface leading-relaxed">
        Contact:
        <a
          class="text-primary hover:underline font-medium"
          href="mailto:stakhov.artur@gmail.com"
          target="_blank"
        >
          stakhov.artur@gmail.com
        </a>
      </li>
    </ul>
  </div>
</template>
