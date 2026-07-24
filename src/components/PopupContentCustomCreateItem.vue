<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'save-custom-item', payload: any): void,
}>();

const editValue = ref<any>(null);
const titleValue = ref<any>('');

onMounted(() => {
})

function handlerSubmit() {
  if (editValue.value) {
    const payload = {
      value: editValue.value,
      title: titleValue.value
    }
    emit('save-custom-item', payload);
  }
}
</script>

<template>
  <div class="flex flex-col flex-1 p-container-padding">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="font-headline-md text-headline-md text-on-surface">Create Custom Record</h2>
      <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Add a new custom entry to your clipboard</p>
    </div>

    <!-- Title Input -->
    <div class="mb-4">
      <label class="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">TITLE</label>
      <input
        type="text"
        v-model="titleValue"
        placeholder="Enter a title..."
        class="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>

    <!-- Content Textarea -->
    <div class="flex-1 flex flex-col mb-4">
      <label class="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">CONTENT</label>
      <textarea
        v-model="editValue"
        placeholder="Paste or type your content here..."
        class="flex-1 w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none min-h-[200px]"
      ></textarea>
    </div>

    <!-- Save Button -->
    <button
      class="w-full py-2.5 bg-secondary-container text-on-secondary-container font-label-lg rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
      @click="handlerSubmit"
    >
      SAVE
    </button>
  </div>
</template>
