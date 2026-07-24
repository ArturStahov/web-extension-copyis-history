<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, toRefs, computed } from 'vue';

const emit = defineEmits<{
  (e: 'save-edit', payload: any): void,
}>();

const props = defineProps({
  editItem: {
    type: Object,
    default() {
      return null
    }
  },
});

const { editItem } = toRefs(props);

const editValue = ref<any>(null);
const editTitle = ref<any>('');

const isCustomRecord = computed(() => {
  const itemAction = editItem.value?.action || null;
  if (itemAction && itemAction === 'custom-item') {
    return true;
  }
  return false;
});

// Надійна перевірка, чи це вже існуючий збережений запис в історії
const isExistingRecord = computed(() => {
  return !!(editItem.value && (editItem.value.time || editItem.value.location || (editItem.value.key && editItem.value.action !== 'custom-item')));
});

onMounted(() => {
  if (editItem?.value) {
    editValue.value = editItem?.value?.value || '';
    editTitle.value = editItem?.value?.title || '';
  } else {
    editValue.value = '';
  }
});

function handlerSubmit() {
  const payload = {
    ...editItem.value,
    value: editValue.value,
    ...(isCustomRecord.value === true ? { title: editTitle.value } : {})
  };
  emit('save-edit', payload);
}

function getItemActionValue(action: string) {
  if (action === 'parse-image') {
    return 'PARSE FROM IMAGE';
  }
  if (action === 'custom-item') {
    return 'CUSTOM RECORD';
  }
  return 'COPIED TEXT';
}

function handlerClickLinkPreview(link: string) {
  if (!link) {
    return;
  }
  window.open(link, '_blank');
}
</script>

<template>
  <!-- 1. ROOT SHELL: rigidly locked to 600px height, no global scroll -->
  <div class="w-full h-[600px] max-w-full flex flex-col justify-between bg-surface text-on-surface box-border overflow-hidden">

    <!-- 3. CENTRAL WORKSPACE: only internal content scrolls -->
    <div class="flex-1 flex flex-col min-h-0 min-w-0 max-w-full w-full box-border overflow-hidden p-container-padding gap-3">

      <!-- 3A. DETAILS BLOCK (ALWAYS RENDERED): prevents CLS layout shift -->
      <div class="shrink-0 min-h-[76px] w-full box-border bg-surface-container-low/80 border border-outline-variant/30 rounded-lg p-3 flex flex-col justify-center">
        <p class="text-label-sm text-primary font-bold tracking-wider uppercase mb-1">DETAILS</p>

        <template v-if="isExistingRecord">
          <div v-if="editItem.location" class="flex items-center gap-2 min-w-0">
            <span class="text-label-sm text-on-surface-variant shrink-0">Resource Link:</span>
            <span
              class="text-primary truncate block hover:underline cursor-pointer text-body-sm text-on-surface min-w-0"
              @click="handlerClickLinkPreview(editItem.location)">
              {{ editItem.location }}
            </span>
            <svg class="shrink-0 text-primary" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
              viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 5H8.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C5 6.52 5 7.08 5 8.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h7.606c1.118 0 1.677 0 2.104-.218c.377-.192.683-.498.875-.874c.218-.428.218-.987.218-2.105V14m1-5V4m0 0h-5m5 0l-7 7" />
            </svg>
          </div>

          <div v-if="editItem.action" class="flex items-center gap-2 min-w-0">
            <span class="text-label-sm text-on-surface-variant shrink-0">Resource:</span>
            <span class="text-body-sm text-on-surface min-w-0">{{ getItemActionValue(editItem.action) }}</span>
          </div>

          <div v-if="editItem.time || editItem.key" class="flex items-center gap-2 min-w-0">
            <span class="text-label-sm text-on-surface-variant shrink-0">Created:</span>
            <span class="text-body-sm text-on-surface min-w-0">{{ editItem.key }} {{ editItem.time }}</span>
          </div>
        </template>

        <template v-else>
          <span class="text-label-sm text-on-surface-variant/40 italic">New Custom Record &bull; Manual Entry</span>
        </template>
      </div>

      <!-- 3B. TITLE INPUT CONTAINER: fixed height when present -->
      <div v-if="isCustomRecord" class="shrink-0 flex flex-col gap-1 w-full box-border">
        <label class="font-label-sm text-label-sm text-on-surface-variant px-1">ADD TITLE</label>
        <input v-model="editTitle" type="text" placeholder="Type a catchy name for this snippet..."
          class="w-full box-border bg-surface-container-lowest text-on-surface p-2.5 rounded-lg border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md placeholder:text-outline" />
      </div>

      <!-- 3C. TEXTAREA CONTAINER: flex column so flex-1 works on textarea -->
      <div class="flex-1 flex flex-col min-h-0 min-w-0 w-full box-border overflow-hidden gap-1">
        <label class="font-label-sm text-label-sm text-on-surface-variant px-1 shrink-0">SNIPPET CONTENT</label>
        <textarea v-model="editValue"
          class="flex-1 w-full max-w-full min-w-0 box-border bg-surface-container-lowest text-on-surface font-mono-sm text-mono-sm p-3 rounded-lg border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words custom-scrollbar transition-all placeholder:text-outline"
          placeholder="Paste or write your custom data here..."></textarea>
      </div>
    </div>

    <!-- 4. FOOTER / SAVE BUTTON: rigidly docked to bottom, OUTSIDE workspace -->
    <footer class="shrink-0 w-full max-w-full box-border p-container-padding bg-surface border-t border-outline-variant/20 mt-auto z-20">
      <button @click="handlerSubmit"
        class="w-full box-border py-3 bg-primary text-on-primary font-label-lg font-bold text-label-lg rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3m3-10H5V5h10z" />
        </svg>
        SAVE
      </button>
    </footer>

  </div>
</template>