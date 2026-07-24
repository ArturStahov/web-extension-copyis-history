<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'save-options', payload: any): void,
}>();

const props = defineProps({
  sizeStorage: {
    type: Number,
    default: 0
  },
  memoryOptions: {
    type: Object,
    required: true
  }
});

const { sizeStorage, memoryOptions } = toRefs(props);

const optionsData = ref<any>({});

let settingsFields = ref<any>([
  {
    code: 'auto-clear-last',
    type: 'checkbox',
    label: 'Auto-clear old saved copied entries',
    tooltip: 'Clear records from the end of the list only when memory limit is reached (do not clear favorite or custom entries).',
    value: false,
  },
  {
    code: 'visible-open-button',
    type: 'checkbox',
    label: 'Show open button on webpage',
    tooltip: 'Enable visible "Open" button on all pages',
    value: true,
  }
])

const init = ref<boolean>(false);

function setEntryOptions() {
  init.value = false;
  settingsFields.value.forEach((item: any) => {
    if (Object.hasOwn(memoryOptions?.value, item.code)) {
      item.value = memoryOptions.value[item.code]
    }
  })
  init.value = true;
}

onMounted(() => {
  setEntryOptions();
  init.value = true
})

watch(memoryOptions, () => {
  setEntryOptions();
})

function handlerChangeOptions(payload: { code: string, value: any }) {
  optionsData.value = {
    ...optionsData.value,
    [payload.code]: payload.value
  }
  emit('save-options', optionsData.value);
}
</script>

<template>
  <div class="flex flex-col p-container-padding">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="font-headline-md text-headline-md text-on-surface">Memory</h2>
      <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Storage usage and settings</p>
    </div>

    <!-- Storage Usage -->
    <div class="bg-surface-container rounded-xl p-item-padding mb-6">
      <p class="font-body-sm text-on-surface-variant mb-2">Current usage</p>
      <div class="flex items-baseline gap-1">
        <span class="font-headline-md text-headline-md text-primary font-bold">{{ sizeStorage }}</span>
        <span class="font-body-sm text-on-surface-variant">/</span>
        <span class="font-body-sm text-on-surface-variant">10,100,700 bytes</span>
      </div>
    </div>

    <!-- Settings -->
    <div v-if="init">
      <h3 class="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-3">Settings</h3>
      <div class="space-y-3">
        <CheckboxComponent
          v-for="(field, idx) in settingsFields"
          :key="idx"
          :field-config="field"
          @change="handlerChangeOptions"
        />
      </div>
    </div>
  </div>
</template>
