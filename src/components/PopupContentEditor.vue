<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs, computed } from 'vue';

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
})

onMounted(() => {
  if (editItem?.value) {
    editValue.value = editItem?.value?.value;
    editTitle.value = editItem?.value?.title || '';
  } else {
    editValue.value = ''
  }
})

function handlerSubmit() {
  const isSaveCondition = (editItem?.value?.value && editItem?.value?.value !== editValue.value)
    || (Object.hasOwn(editItem?.value, 'title') && editItem?.value?.title !== editTitle.value);

  if (isSaveCondition) {
    const payload = {
      ...editItem.value,
      value: editValue.value,
      ...(isCustomRecord.value === true ? { title: editTitle.value } : {})
    }
    emit('save-edit', payload);
  }
}

function getItemActionValue(action: string) {
  if (action === 'parse-image') return 'Parse from Image';
  if (action === 'custom-item') return 'Custom Record';
  return 'Copied Text';
}

function handlerClickLinkPreview(link: string) {
  if (!link) return;
  window.open(link, '_blank');
}
</script>

<template>
  <div class="flex flex-col flex-1 p-container-padding">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="font-headline-md text-headline-md text-on-surface">Edit Record</h2>
      <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Modify your clipboard entry</p>
    </div>

    <!-- Details Section -->
    <div class="mb-4 space-y-2">
      <div v-if="editItem.location" class="flex items-center gap-2">
        <span class="font-label-sm text-primary font-semibold">Resource:</span>
        <span
          class="font-mono-sm text-mono-sm text-primary truncate cursor-pointer hover:underline max-w-[280px]"
          @click="handlerClickLinkPreview(editItem.location)"
        >
          {{ editItem.location }}
        </span>
        <span class="i-mdi-open-in-new text-primary text-[14px] shrink-0"></span>
      </div>

      <div v-if="editItem.action" class="flex items-center gap-2">
        <span class="font-label-sm text-primary font-semibold">Type:</span>
        <span class="font-body-sm text-on-surface-variant">
          {{ getItemActionValue(editItem.action) }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-label-sm text-primary font-semibold">Date:</span>
        <span class="font-body-sm text-on-surface-variant">{{ editItem.key }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-label-sm text-primary font-semibold">Time:</span>
        <span class="font-body-sm text-on-surface-variant">{{ editItem.time }}</span>
      </div>
    </div>

    <!-- Title Input (custom records only) -->
    <div v-if="isCustomRecord" class="mb-4">
      <label class="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">TITLE</label>
      <input
        type="text"
        v-model="editTitle"
        placeholder="Enter a title..."
        class="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>

    <!-- Content Textarea -->
    <div class="flex-1 flex flex-col mb-4">
      <label class="font-label-sm text-label-sm text-on-surface-variant block mb-1.5">CONTENT</label>
      <textarea
        v-model="editValue"
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
