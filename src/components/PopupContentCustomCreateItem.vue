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
  <main class="flex-1 overflow-y-auto custom-scrollbar p-container-padding space-y-stack-gap">
    <!-- Form Content -->
    <div class="space-y-6 pt-2">
      <!-- Title Input Section -->
      <div class="space-y-2">
        <label class="font-label-sm text-label-sm text-on-surface-variant px-1" for="record-title">ADD TITLE</label>
        <input
          type="text"
          v-model="titleValue"
          id="record-title"
          placeholder="Type a catchy name for this snippet..."
          class="w-full bg-surface-container-low border-none rounded-lg p-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container transition-all outline-none" />
      </div>

      <!-- Content Textarea Section -->
      <div class="space-y-2">
        <label class="font-label-sm text-label-sm text-on-surface-variant px-1 flex justify-between" for="record-content">
          <span>SNIPPET CONTENT</span>
        </label>
        <textarea
          v-model="editValue"
          id="record-content"
          placeholder="Paste or write your custom data here..."
          class="w-full flex-1 min-h-[300px] bg-surface-container-low border-none rounded-lg p-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container transition-all font-mono-sm text-mono-sm resize-none custom-scrollbar outline-none">
        </textarea>
      </div>
    </div>
  </main>

  <!-- Action Footer -->
  <footer class="bg-surface-container-high border-t border-outline-variant p-container-padding">
    <div class="flex justify-center">
      <button
        @click="handlerSubmit"
        class="w-full bg-primary text-on-primary py-3 rounded-lg font-label-lg text-label-lg font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4m-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3m3-10H5V5h10z" />
        </svg>
        SAVE
      </button>
    </div>
  </footer>
</template>
