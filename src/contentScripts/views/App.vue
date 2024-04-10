<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted, reactive } from 'vue'
import { onMessage, sendMessage } from 'webext-bridge/content-script'

const LIMIT_STORAGE = 10485760;

interface ICopyItem { value: string, location: string, time: string, key: string, id: string };
interface IDataItem { key: string, items: ICopyItem[], id: string}
interface ISaveResponseData { size: string, data: IDataItem[] }
interface IInitResponseData { size: string, data: IDataItem[] }

const [show, togglePopup] = useToggle(true);

const hidePopup = ref<boolean>(true);

const details = ref<null | IDataItem[] >(null);

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
    const payload = { value: copyText, location: window.location.href };
    const res = await sendMessage('save-copy-data', payload, "background");
    if (show) {
      details.value = [...(res as any as ISaveResponseData).data]
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

async function handlerDeleteListItem(item: any) {
  console.log('DELETE ITEM>>',item)
  const res = await sendMessage('delete-item', item, "background");
  if(res) {
    details.value = [...(res as any as ISaveResponseData).data]
    sizeStorage.value = Number((res as any as ISaveResponseData).size);
  } 
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
    <PopupContent :detailsItems="details" :hidePopup="hidePopup" :show="show" @close="togglePopup()"
      @hide-popup-to-button="hidePopupToButton" @delete-item-action="handlerDeleteListItem" />

    <!-- BUTTON HIDE POPUP -->
    <button v-if="hidePopup" class="open-button flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700" @click="openPopupButton()">
      <div class="i-fluent:book-coins-20-filled w-48px h-48px" style="color: #0a0a0a;"></div>
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
