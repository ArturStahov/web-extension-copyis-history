<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

import { createWorker } from 'tesseract.js';

const emit = defineEmits<{
  (e: 'save-image-parse', payload: any): void,
}>();

// const props = defineProps({
 
// });

// const {  } = toRefs(props);

const editValue = ref<any>('');

onMounted(() => {

})

function handlerSubmit() {
  const payload = {
    value: editValue.value
  }
  emit('save-image-parse', payload);
}

const process = ref<any>(false);

const imageSelected = ref<any>(null);

async function handleImageUpload(event: any) {
  try {
    process.value = true;
    const image = event.target.files[0];
    getBase64(image);
    const url = URL.createObjectURL(image);

    const worker = await createWorker();
    const ret = await worker.recognize(url);
    editValue.value = ret?.data?.text;
    process.value = false;
    await worker.terminate();
  } catch (error: any) {
    console.log('error parse image:',error?.message)
  }
}

function getBase64(file: any) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    imageSelected.value = reader.result;
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

</script>

<template>
  <div class="parse-image">
     
    <LoaderComponent v-if="process"/>
    
    <div class="file-input">
      <input type="file" accept="image/*" @input='handleImageUpload' />
      selectedImage : <img v-if="imageSelected" :src="imageSelected" alt=" Selected" />
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="96" height="112" viewBox="0 0 1536 1792">
        <path fill="#d3ac13"
          d="M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22m384 1528V640H992q-40 0-68-28t-28-68V128H128v1536zm-128-448v320H256v-192l192-192l128 128l384-384zm-832-192q-80 0-136-56t-56-136t56-136t136-56t136 56t56 136t-56 136t-136 56" />
      </svg>
    </div>

    <textarea class="content-editor__textarea" v-model="editValue">

    </textarea>
    <ButtonComponent class="save-button" :type-button="'text'" @click="handlerSubmit">
      SAVE
    </ButtonComponent>

  </div>
</template>

<style>
.file-input {
  width: 300px;
  height: 200px;
  color: red;
  display: flex;
}

.parse-image .loader {

}

.file-input img {
  width: 96px;
  height: 112px;
}

.parse-image {
  padding: 30px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.parse-image .content-editor__textarea {
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

.parse-image .content-editor__textarea:focus {
  outline: none !important;
}

.parse-image .save-button {
  width: 125px;
  height: 25px;
}

.parse-image .content-editor__textarea::-webkit-scrollbar {
  width: 5px;
}

.parse-image .content-editor__textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  opacity: 0.5;
}

.parse-image .content-editor__textarea::-webkit-scrollbar-thumb {
  background-color: #ffd060;
  outline: 1px solid slategrey;
}
</style>
