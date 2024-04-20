<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

import Tesseract from 'tesseract.js';

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

const errorMessage = ref<string>('');

const imageSelected = ref<any>(null);

async function handleImageUpload(event: any) {
  try {
    errorMessage.value = '';
    process.value = true;
    const image = event.target.files[0];
    if (!image) {
      return;
    }
    getBase64(image);
    const url = URL.createObjectURL(image);
    const result = await Tesseract.recognize(url)
    editValue.value = result?.data?.text;
  } catch (error: any) {
    errorMessage.value = 'Failed parse image, change browser tab and repeat or change image file!';
    console.log('error parse image:', error?.message)
  } finally {
    process.value = false;
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
    <p class="parse-image__section-title"> Parse text from image </p>

    <div class="file-input">
      <label for="file-upload" class="custom-file-upload">
        Upload Image
      </label>
      <input type="file" id="file-upload" accept="image/*" @input='handleImageUpload' />

      <div v-if="imageSelected" class="file-input__image-preview-wrapper">
        <img :src="imageSelected" alt="Selected" />
      </div>

      <svg v-if="!imageSelected" xmlns="http://www.w3.org/2000/svg" width="96" height="112" viewBox="0 0 1536 1792">
        <path fill="#d3ac13"
          d="M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22m384 1528V640H992q-40 0-68-28t-28-68V128H128v1536zm-128-448v320H256v-192l192-192l128 128l384-384zm-832-192q-80 0-136-56t-56-136t56-136t136-56t136 56t56 136t-56 136t-136 56" />
      </svg>
    </div>

    <LoaderComponent v-if="process" />

    <p v-if="errorMessage" class="error_message_text"> {{ errorMessage }}</p>

    <div v-if="imageSelected && !process && !errorMessage" class="parse-image__editor-wrapper">
      <textarea class="content-editor__textarea" v-model="editValue">
      </textarea>
      <ButtonComponent class="save-button" :type-button="'text'" @click="handlerSubmit">
        SAVE
      </ButtonComponent>
    </div>
  </div>
</template>

<style>
.file-input {
  padding: 0 20px;
  width: 100%;
  color: red;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.file-input__image-preview-wrapper {}

.file-input input[type="file"] {
  display: none;
}

.custom-file-upload {
  display: flex;
  pointer-events: all !important;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: #0a0a0a;
  font-weight: 600;
  font-size: 14px;
  width: 150px;
  height: 30px;
  cursor: pointer;
  background-color: #0d9488;
}

.parse-image__editor-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.parse-image__section-title {
  color: #e7ab2a;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
}

.error_message_text {
  color: #e7602a;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  width: 100%;
  max-width: 70%;
}

.parse-image .loader {
  margin-top: 100px;
}

.file-input img {
  width: 96px;
  height: 112px;
}

.parse-image {
  padding: 0px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.parse-image .content-editor__textarea {
  background: transparent;
  width: 90%;
  height: 380px;
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
  width: 5px !important;
}

.parse-image .content-editor__textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  opacity: 0.5 !important;
}

.parse-image .content-editor__textarea::-webkit-scrollbar-thumb {
  background-color: #ffd060 !important;
  outline: 1px solid slategrey !important;
}
</style>
