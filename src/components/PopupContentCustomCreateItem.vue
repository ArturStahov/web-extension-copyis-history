<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'save-custom-item', payload: any): void,
}>();

// const props = defineProps({
  
// });

//const {  } = toRefs(props);

const editValue = ref<any>(null);

onMounted(() => {
 
})

function handlerSubmit() {
  if (editValue.value) {
    const payload = {
      value: editValue.value
    }
    emit('save-custom-item', payload);
  }
}

</script>

<template>
  <div class="custom-create">
    <p class="content-editor__section-title">CREATE CUSTOM RECORD</p>

    <textarea class="content-editor__textarea" v-model="editValue">

    </textarea>
    <ButtonComponent class="save-button" :type-button="'text'" @click="handlerSubmit">
      SAVE
    </ButtonComponent>

  </div>
</template>

<style>
.custom-create {
  padding: 15px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 82%;
}

@media screen and (max-height: 766px) {
.custom-create {
    height: 76%;
  }
}

.custom-create .content-editor_item-info-list {
  list-style: none;
  width: 100%;
  padding-left: 18px;
}

.custom-create .content-editor_item-info-list-item {
  list-style: none;
  display: flex;
  margin-bottom: 5px;
}


.custom-create .content-editor__section-title {
  margin-top: 0;
  margin-bottom: 5px;
  color: #e7ab2a;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
}

.custom-create .content-editor__textarea {
  background: transparent;
  width: 90%;
  height: 100%;
  margin-bottom: 15px;
  resize: none;
  border: 1px solid #8b888842;
  font-size: 14px;
  line-height: 1.2;
  color: #ffffff;
  padding: 5px;
  word-break: break-all;
}

.custom-create .content-editor__textarea:focus {
  outline: none !important;
}

.custom-create .save-button {
  width: 125px;
  height: 25px;
}

.custom-create .content-editor__textarea::-webkit-scrollbar {
  width: 5px !important;
}

.custom-create .content-editor__textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  opacity: 0.5 !important;
}

.custom-create .content-editor__textarea::-webkit-scrollbar-thumb {
  background-color: #ffd060 !important;
  outline: 1px solid slategrey !important;
}
</style>
