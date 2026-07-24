<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'change', payload: any): void,
}>();

const props = defineProps({
  fieldConfig: {
    type: Object,
    required: true
  }
});

const inputValue = ref<boolean>(false);

const { fieldConfig } = toRefs(props);

function handlerChange(event: any) {
  inputValue.value = event.target.checked;
  const payload = {
    code: fieldConfig?.value?.code,
    value: event.target.checked,
  }
  emit('change', payload);
}

onMounted(() => {
  if (fieldConfig?.value?.value) {
    inputValue.value = fieldConfig.value?.value;
  }
})
</script>

<template>
  <div class="group relative flex items-center gap-3 p-item-padding bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer">
    <input
      :id="fieldConfig.code"
      type="checkbox"
      :value="inputValue"
      @input="handlerChange"
      :checked="inputValue ?? false"
      class="w-4 h-4 rounded accent-primary cursor-pointer"
    />
    <label class="font-body-sm text-on-surface cursor-pointer flex-1" :for="fieldConfig.code">
      {{ fieldConfig?.label }}
    </label>

    <!-- Tooltip -->
    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-body-sm text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 max-w-[280px] text-center">
      {{ fieldConfig.tooltip }}
    </div>
  </div>
</template>
