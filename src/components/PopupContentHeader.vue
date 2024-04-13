<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const props = defineProps({
  enableEditor: {
    type: Boolean,
    default: false
  },
});

const { enableEditor } = toRefs(props);

const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'close-editor',): void,
  (e: 'hide-popup-to-button',): void
}>();

onMounted(() => {
})

</script>

<template>
  <div class="header-wrapper">
    <ButtonComponent v-if="enableEditor" class="close-editor" @click="emit('close-editor')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g fill="none">
          <path
            d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
          <path fill="#0d9488"
            d="M19 3a3 3 0 0 1 2.995 2.824L22 6v12a3 3 0 0 1-2.824 2.995L19 21H8.108a3 3 0 0 1-2.436-1.25l-.108-.16l-4.08-6.53a2 2 0 0 1-.087-1.967l.086-.153l4.081-6.53a3 3 0 0 1 2.351-1.404L8.108 3zm0 2H8.108a1 1 0 0 0-.773.366l-.075.104L3.18 12l4.08 6.53a1 1 0 0 0 .72.462l.128.008H19a1 1 0 0 0 .993-.883L20 18V6a1 1 0 0 0-.883-.993zm-8.121 3.464l2.12 2.122l2.122-2.122a1 1 0 1 1 1.414 1.415L14.415 12l2.12 2.121a1 1 0 0 1-1.414 1.415L13 13.414l-2.121 2.122a1 1 0 1 1-1.415-1.415L11.586 12L9.464 9.879a1 1 0 0 1 1.415-1.415" />
        </g>
      </svg>
    </ButtonComponent>
    <ButtonComponent @click="emit('hide-popup-to-button')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#0d9488"
          d="m12 12.5l-4 4h8zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zM19 8V5H5v3zM5 10v9h14v-9zm0-2V5z" />
      </svg>
    </ButtonComponent>
    <ButtonComponent @click="emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 24 24">
        <path fill="#0d9488"
          d="M4 0h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm7.414 8l2.829 2.828a1 1 0 0 1-1.415 1.415L10 11.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L8.586 10L5.757 7.172a1 1 0 0 1 1.415-1.415L10 8.586l2.828-2.829a1 1 0 0 1 1.415 1.415z" />
      </svg>
    </ButtonComponent>
  </div>
</template>

<style>
.popup-content .header-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.close-editor {
  margin-right: auto;
}
</style>
