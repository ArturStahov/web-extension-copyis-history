<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted, reactive } from 'vue'
import { onMessage, sendMessage } from 'webext-bridge/content-script'

interface ICopyItem { value: string, location?: string, time: string, key: string, id: string, favorite?: boolean, action?: string };
interface IDataItem { key: string, items: ICopyItem[], id: string}
interface ISaveResponseData { size: string, data: IDataItem[] }
interface IInitResponseData { size: string, data: IDataItem[] }

const [show, togglePopup] = useToggle(true);

const hidePopup = ref<boolean>(true);

const details = ref<null | IDataItem[] >(null);

const sizeStorage = ref<number>(0);

const options = ref<any>(null);

const init = ref<boolean>(false);

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
    if (show && res) {
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

  const data = await sendMessage('get-options', {}, "background");
  options.value = data;
  console.log('options.value>>>>', options.value)
  init.value = true
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

async function handlerSaveEditItem(item: any) {
  console.log('SAVE_EDITED_ITEM', item)
  const res = await sendMessage('save-edit-item', item, "background");
  if (res) {
    details.value = [...(res as any as ISaveResponseData).data]
    sizeStorage.value = Number((res as any as ISaveResponseData).size);
  }
}

async function handlerAddToFavorite(item: any) {
  const res = await sendMessage('favorite', {action: 'add', item}, "background");
  if (res) {
    details.value = [...(res as any as ISaveResponseData).data]
    sizeStorage.value = Number((res as any as ISaveResponseData).size);
  }
}

async function handlerRemoveFromFavorite(item: any) {
  const res = await sendMessage('favorite', { action: 'remove', item }, "background");
  if (res) {
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

    const data = await sendMessage('get-options', {}, "background");
    options.value = data;
    console.log('RE_INIT OPTIONS', data)
  } catch (error: any) {
    console.log(error?.message);
  }
}

async function handlerSaveParseImage(data: any) {
  console.log('SAVE_PARSE_IMAGE', data)
  const payload = {
    ...data,
    action: 'parse-image'
  }
  const res = await sendMessage('save-parse-image', payload, "background");
  if (res) {
    details.value = [...(res as any as ISaveResponseData).data]
    sizeStorage.value = Number((res as any as ISaveResponseData).size);
  }
}

</script>

<template>
  <div class="wrapper-main right-0 top-0 select-none leading-1em">
    <!-- POPUP -->
    <PopupContent v-if="init" :entry-memory-options="options?.memory" :sizeStorage="sizeStorage" :detailsItems="details"
      :hidePopup="hidePopup" :show="show" @close="togglePopup()" @hide-popup-to-button="hidePopupToButton"
      @delete-item-action="handlerDeleteListItem" @save-edit="handlerSaveEditItem"
      @add-to-favorite="handlerAddToFavorite" @remove-favorite="handlerRemoveFromFavorite"
      @save-parse-image="handlerSaveParseImage" />

    <!-- BUTTON HIDE POPUP -->
    <button v-if="hidePopup" class="open-button flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700" @click="openPopupButton()">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <path fill="#0a0a0a"
          d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5zm6.197 2.964C9.622 7.739 9 8.24 9 9s.622 1.26 1.197 1.536c.622.297 1.437.464 2.303.464s1.681-.167 2.303-.464C15.378 10.261 16 9.76 16 9s-.621-1.26-1.197-1.536C14.18 7.167 13.366 7 12.5 7s-1.681.167-2.303.464m5.798 3.426C15.17 11.567 13.91 12 12.5 12s-2.67-.433-3.495-1.11A1 1 0 0 0 9 11c0 1.105 1.567 2 3.5 2s3.5-.895 3.5-2q0-.055-.005-.11M12.5 14c-1.41 0-2.67-.433-3.495-1.11A1 1 0 0 0 9 13c0 1.105 1.567 2 3.5 2s3.5-.895 3.5-2a1 1 0 0 0-.005-.11C15.17 13.567 13.91 14 12.5 14" />
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
