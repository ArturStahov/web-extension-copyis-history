<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted, reactive } from 'vue'
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { getPastePopupPosition } from '~/services/pastePopup'

interface ICopyItem { value: string, location?: string, time: string, key: string, id: string, favorite?: boolean, action?: string };
interface IDataItem { key: string, items: ICopyItem[], id: string}
interface ISaveResponseData { size: string, data: IDataItem[] }

const [show, togglePopup] = useToggle(true);

const hidePopup = ref<boolean>(true);
const details = ref<null | IDataItem[] >(null);
const sizeStorage = ref<number>(0);
const options = ref<any>(null);
const init = ref<boolean>(false);
const openPastePopup = ref<boolean>(false);
const pastePopupRef = ref<any>(null);
const elementToPasteValue = ref<any>(null);
const correctCombinationKeyOpenPastePopup = ref<boolean>(false);

const pastePopupPosition = reactive({
  "left": 0,
  "top": 0,
})

onMounted(async () => {
  document.addEventListener("copy", handlerCopyText);
  window.addEventListener("keydown", handlerKeyCombinationDownOpenPastePopup);
  window.addEventListener("keyup", handlerKeyCombinationUpOpenPastePopup);
  document.addEventListener('click', handlerConditionOpenPastePopup);

  const initPayload = { location: window.location.href };
  const res = await sendMessage('get-init-copy-data', initPayload, "background");

  if (res) {
    updateStateData(res as any as ISaveResponseData);
  }

  const data = await sendMessage('get-options', {}, "background");
  options.value = data;
  init.value = true
})

onMessage('event-retry', async(response) => {
  const initPayload = { location: window.location.href };
  const res = await sendMessage('get-copy-data', initPayload, "background");
 
  if (res) {
    updateStateData(res as any as ISaveResponseData);
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
      updateStateData(res as any as ISaveResponseData);
    }
  } catch (error: any) {
    console.log(error?.message);
  }
}

function handlerKeyCombinationDownOpenPastePopup(e: any) {
  const special = e.shiftKey;
  //const key = e.charCode || e.keyCode;
  //const combo = special && key == 88;
  if (!special) {
    correctCombinationKeyOpenPastePopup.value = false;
   return;
  } 
  correctCombinationKeyOpenPastePopup.value = true;
}

function handlerKeyCombinationUpOpenPastePopup(e: any) {
  const special = e.keyCode === 16 || e.key === "Shift"

  if (special) {
    correctCombinationKeyOpenPastePopup.value = false;
  }
}

async function handlerConditionOpenPastePopup(event: any) {
  if (!correctCombinationKeyOpenPastePopup.value || openPastePopup.value) {
    return;
  }
  const x = event.clientX;
  const y = event.clientY;

  Object.assign(pastePopupPosition, {
    left: x + window.scrollX,
    top: y + window.scrollY
  });

  const position = getPastePopupPosition(x, y, pastePopupRef.value);
  position && Object.assign(pastePopupPosition, position);
  const element = document.elementFromPoint(x, y);
  if (!element) return;
  
  const tagName = element.tagName.toLowerCase();
  const conditionOpenPastePopup = tagName === 'input' || tagName === 'textarea';
  
  if (conditionOpenPastePopup) {
    openPastePopup.value = true;
  } 
  elementToPasteValue.value = element;
}

function actionClosePastePopup() {
  elementToPasteValue.value = null;
  openPastePopup.value = false;
  correctCombinationKeyOpenPastePopup.value = false;
}

function handlerPasteValueFromPastePopup(payload: {value: string}) {
  const nodeElement = elementToPasteValue.value;
  if (!nodeElement) {
    return;
  }
  
  nodeElement.addEventListener('paste', (event: any) => {
    nodeElement.value = payload.value;
    nodeElement.dispatchEvent(new Event('input'));
  })

  const pasteEvent = new Event('paste', {
    bubbles: true,
    cancelable: true,
  });

  nodeElement.dispatchEvent(pasteEvent);
  
  actionClosePastePopup();
}

const visiblePastePopup = () => {
  return openPastePopup.value ? '1' : '0';
}

function hideContentPopupToButton() {
  hidePopup.value = true;
}

async function handlerDeleteListItem(item: any) {
  const res = await sendMessage('delete-item', item, "background");
  if(res) {
    updateStateData(res as any as ISaveResponseData);
  } 
}

async function handlerSaveEditItem(item: any) {
  const res = await sendMessage('save-edit-item', item, "background");
  if (res) {
    updateStateData(res as any as ISaveResponseData);
  }
}

async function handlerAddToFavorite(item: any) {
  const res = await sendMessage('favorite', {action: 'add', item}, "background");
  if (res) {
    updateStateData(res as any as ISaveResponseData);
  }
}

async function handlerRemoveFromFavorite(item: any) {
  const res = await sendMessage('favorite', { action: 'remove', item }, "background");
  if (res) {
    updateStateData(res as any as ISaveResponseData);
  }
}

async function openContentPopupButton() {
  try {
    const initPayload = { location: window.location.href };
    const res = await sendMessage('get-copy-data', initPayload, "background");
   
    if (res) {
      updateStateData(res as any as ISaveResponseData);
    }
    hidePopup.value = false;

    const data = await sendMessage('get-options', {}, "background");
    options.value = data;
  } catch (error: any) {
    console.log(error?.message);
  }
}

async function handlerSaveParseImage(data: { value: string }) {
  const payload = {
    ...data,
    action: 'parse-image'
  }
  const res = await sendMessage('save-parse-image', payload, "background");
  if (res) {
    updateStateData(res as any as ISaveResponseData);
  }
}

async function handlerCreateCustomItem(data: {value: string}) {
  const payload = {
    ...data,
    action: 'custom-item'
  }
  const res = await sendMessage('save-custom-item', payload, "background");
  if (res) {
    updateStateData(res as any as ISaveResponseData);
  }
}

function updateStateData(res: ISaveResponseData) {
  details.value = [...res.data]
  sizeStorage.value = Number(res.size);
}

</script>

<template>
  <div class="wrapper-main right-0 top-0 select-none leading-1em">
    <PastePopup ref="pastePopupRef" :visible="visiblePastePopup()" :position="pastePopupPosition"
      :detailsItems="details" @closePastePopup="actionClosePastePopup" @paste-value="handlerPasteValueFromPastePopup" />
    <!-- POPUP -->
    <PopupContent v-if="init" :entry-memory-options="options?.memory" :sizeStorage="sizeStorage" :detailsItems="details"
      :hidePopup="hidePopup" :show="show" @close="togglePopup()" @hide-popup-to-button="hideContentPopupToButton"
      @delete-item-action="handlerDeleteListItem" @save-edit="handlerSaveEditItem"
      @add-to-favorite="handlerAddToFavorite" @remove-favorite="handlerRemoveFromFavorite"
      @save-parse-image="handlerSaveParseImage" @save-custom-item="handlerCreateCustomItem" />

    <!-- BUTTON HIDE POPUP -->
    <button v-if="hidePopup" class="open-button flex shadow cursor-pointer" @click="openContentPopupButton()">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <path fill="#0d9488"
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
  pointer-events: none !important;
}

.open-button {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border: 1px solid #1a1919;
  width: 35px;
  height: 35px;
  opacity: 0.3;
  filter: grayscale(0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all !important;
  position: fixed;
  bottom: 10%;
  right: 6px;
  z-index: 999999999999;
  transition: all 0.3s linear;
}

.open-button:hover {
  opacity: 0.8;
  filter: grayscale(0);
}
</style>
