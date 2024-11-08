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

function handlerChangeOptions(payload: {code: string, value: any}) {
  optionsData.value = {
    ...optionsData.value,
    [payload.code]: payload.value
  }
  
  emit('save-options', optionsData.value);
}

</script>

<template>
  <div class="memory-main">
    <p class="section-title text title"> Memory </p>
    <p class="memory-size text">Current usage: <span class="current-size-text">{{`${sizeStorage}`}}</span> /
      <span class="max-size-text">10100700</span> bytes
    </p>
    <div v-if="init" class="settings-wrapper">
      <p class="section-title text title"> Settings </p>
      <CheckboxComponent v-for="(field,idx) in settingsFields" :key="idx" :field-config="field"
        @change="handlerChangeOptions" />
    </div>
  </div>
</template>

<style>
.memory-main {
  padding: 30px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.memory-main .memory-size {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.memory-size .current-size-text {
 color: #e7ab2a;
 font-weight: 600;
}

.memory-size .max-size-text {
 color: #0d9488;
}

.memory-main .settings-wrapper {
  width: 100%;
  padding: 15px;
}

.memory-main .section-title.title {
  color: #e7ab2a !important;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
}

</style>
