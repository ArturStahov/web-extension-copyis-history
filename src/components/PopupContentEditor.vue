<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

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

onMounted(() => {
  if (editItem?.value) {
    editValue.value = editItem?.value?.value;
  } else {
    editValue.value = ''
  }
})

function handlerSubmit() {
  if (editItem?.value?.value && editItem?.value?.value !== editValue.value) {
    const payload = {
      ...editItem.value,
      value: editValue.value
    }
    emit('save-edit', payload);
  }
}

</script>

<template>
  <div class="content-editor">
    <textarea class="content-editor__textarea" v-model="editValue">

    </textarea>
    <ButtonComponent class="save-button" :type-button="'text'" @click="handlerSubmit">
      SAVE
    </ButtonComponent>

  </div>
</template>

<style>

.content-editor {
  padding: 30px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.content-editor .content-editor__textarea {
  background: transparent;
  width: 90%;
  height: 550px;
  margin-bottom: 15px;
  resize: none;
  border: 1px solid #8b888842;
  font-size: 14px;
  line-height: 1.2;
  color: #ffffff;
  padding: 5px;
  word-break: break-all;
}

.content-editor .content-editor__textarea:focus {
  outline: none !important;
}

.content-editor .save-button {
  width: 125px;
  height: 25px;
}

.content-editor .content-editor__textarea::-webkit-scrollbar {
  width: 5px !important;
}

.content-editor .content-editor__textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  opacity: 0.5 !important;
}

.content-editor .content-editor__textarea::-webkit-scrollbar-thumb {
  background-color: #ffd060 !important;
  outline: 1px solid slategrey !important;
}
</style>
