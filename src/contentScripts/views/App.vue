<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted, reactive } from 'vue'
import { onMessage, sendMessage } from 'webext-bridge/content-script'

const LIMIT_STORAGE = 10485760;

interface ICopyItem { copy: string, location: string, created_at: string };
interface ISaveResponseData { size: string, data: ICopyItem }
interface IInitResponseData { size: string, data: ICopyItem[] }

const [show, togglePopup] = useToggle(true);

const hidePopup = ref<boolean>(true);

const details = ref<null | ICopyItem[] >(null);

const sizeStorage = ref<number>(0);

onMessage('event-retry', async(response) => {
  const initPayload = { location: window.location.href };
  const res = await sendMessage('get-copy-data', initPayload, "background");
 
  if (res) {
    details.value = (res as any as IInitResponseData).data;
    sizeStorage.value = Number((res as any as IInitResponseData).size);
    console.log('INIT event-retry', res)
  }
  togglePopup();
})

function getSelectionText() {
  let text = "";
  if (window.getSelection) {
    text = window.getSelection()?.toString() || '';
  }
  return text;
}

const handlerCopyText = async(e: any) => {
  try {
    const copyText = getSelectionText();
    const payload = { copy: copyText, location: window.location.href };
    const res = await sendMessage('save-copy-data', payload, "background");
    if (show && details.value) {
      details.value.push((res as any as ISaveResponseData).data)
      sizeStorage.value = Number((res as any as ISaveResponseData).size);
    }
    console.log('COPY>>>>>>>', res);
  } catch (error: any) {
    console.log(error?.message);
  }
}

onMounted(async() => {
  document.addEventListener("copy", handlerCopyText);
  
  const initPayload = { location: window.location.href };
  const res = await sendMessage('get-init-copy-data', initPayload, "background");
  
  if(res) {
    details.value = (res as any as IInitResponseData).data;
    sizeStorage.value = Number((res as any as IInitResponseData).size);
    console.log('INIT Details')
  }
})

function hidePopupToButton() {
  hidePopup.value = true;
}

async function openPopupButton() {
  try {
    const initPayload = { location: window.location.href };
    const res = await sendMessage('get-copy-data', initPayload, "background");
   
    if (res) {
      details.value = (res as any as IInitResponseData).data;
      sizeStorage.value = Number((res as any as IInitResponseData).size);
      console.log('INIT Details openPopup>>', res)
    }
    hidePopup.value = false;
  } catch (error: any) {
    console.log(error?.message);
  }
}

</script>

<template>
  <div class="wrapper-main right-0 top-0 select-none leading-1em">
    <!-- POPUP -->
    <PopupContent :details="details" :hidePopup="hidePopup"
      :show="show" @close="togglePopup()" 
      @hide-popup-to-button="hidePopupToButton" />

    <!-- BUTTON HIDE POPUP -->
    <button v-if="hidePopup" class="open-button flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700" @click="openPopupButton()">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <path fill="#0a0a0a"
          d="m12.05 19l2.85-2.825l-2.85-2.825L11 14.4l1.075 1.075q-.7.025-1.362-.225t-1.188-.775q-.5-.5-.763-1.15t-.262-1.3q0-.425.113-.85t.312-.825l-1.1-1.1q-.425.625-.625 1.325T7 12q0 .95.375 1.875t1.1 1.65q.725.725 1.625 1.088t1.85.387l-.95.95zm4.125-4.25q.425-.625.625-1.325T17 12q0-.95-.363-1.888T15.55 8.45q-.725-.725-1.638-1.075t-1.862-.35L13 6.05L11.95 5L9.1 7.825l2.85 2.825L13 9.6l-1.1-1.1q.675 0 1.375.263t1.2.762q.5.5.763 1.15t.262 1.3q0 .425-.112.85t-.313.825zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8" />
      </svg>
    </button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.wrapper-main {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.open-button {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all !important;
  position: fixed;
  top: 5px;
  right: 5px;
  z-index: 999999999999;
}
</style>
