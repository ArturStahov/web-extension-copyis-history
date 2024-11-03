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

const { fieldConfig} = toRefs(props);

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
  <div class="field-wrapper">
    <div class="tooltip"> {{ fieldConfig.tooltip }} </div>
    <input :id="fieldConfig.code" class="field" type="checkbox" :value="inputValue" @input="handlerChange"
      :checked="inputValue ?? false" />
    <label class="label" :for="fieldConfig.code">
      {{ fieldConfig?.label }}
    </label>
  </div>
</template>

<style>
.field-wrapper {
  display: flex;
  width: max-content;
  position: relative;
  align-items: center;
}

.field-wrapper .tooltip {
  font-size: 14px !important;
  position: absolute;
  top: -100px !important; 
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 140px !important;
  height: max-content !important;
  background-color: rgb(34, 33, 33) !important;
  color: #0d9488 !important;
  padding: 5px;
  opacity: 0;
  border: #ffffff solid 1px !important;
  border-radius: 5px;
  transition: opacity 0.3s linear;
}

.field-wrapper:hover .tooltip {
  opacity: 1;
}

.field-wrapper .field {
  margin-right: 10px;
  cursor: pointer;
}

.field-wrapper .label {
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
}
</style>
