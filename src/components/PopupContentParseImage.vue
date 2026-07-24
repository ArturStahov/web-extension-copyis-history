<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';
import Tesseract from 'tesseract.js';

const emit = defineEmits<{
  (e: 'save-image-parse', payload: any): void,
}>();

const editValue = ref<any>('');

onMounted(async () => {
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
  <div class="flex flex-col p-container-padding">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="font-headline-md text-headline-md text-on-surface">Parse Text from Image</h2>
      <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">Upload an image to extract text</p>
    </div>

    <!-- Upload Area -->
    <div class="flex flex-col items-center justify-center p-6 bg-surface-container rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-colors mb-4">
      <label for="file-upload" class="flex flex-col items-center cursor-pointer">
        <div v-if="!imageSelected" class="flex flex-col items-center">
          <span class="i-mdi-image-plus text-[48px] text-on-surface-variant mb-3"></span>
          <span class="font-body-sm text-on-surface-variant">Click to upload image</span>
        </div>
        <img v-else :src="imageSelected" alt="Selected" class="w-24 h-28 object-cover rounded-lg" />
      </label>
      <input type="file" id="file-upload" accept="image/*" @input="handleImageUpload" class="hidden" />
    </div>

    <!-- Loading -->
    <div v-if="process" class="flex justify-center py-8">
      <LoaderComponent />
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-center font-body-sm text-error mb-4">
      {{ errorMessage }}
    </p>

    <!-- Editor -->
    <div v-if="imageSelected && !process && !errorMessage" class="flex flex-col flex-1">
      <textarea
        v-model="editValue"
        class="flex-1 w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none min-h-[200px] mb-4"
        placeholder="Extracted text will appear here..."
      ></textarea>
      <button
        class="w-full py-2.5 bg-secondary-container text-on-secondary-container font-label-lg rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
        @click="handlerSubmit"
      >
        SAVE
      </button>
    </div>
  </div>
</template>
