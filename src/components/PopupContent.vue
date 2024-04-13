<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';
import { onMessage, sendMessage } from 'webext-bridge/content-script'


const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'delete-item-action', item: any): void,
  (e: 'hide-popup-to-button',): void
}>();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  detailsItems: {
    type: Object,
    default() {
      return null
    }
  },
  hidePopup: {
    type: Boolean,
    default: false
  },
});

const { hidePopup, detailsItems } = toRefs(props);

const enableEditor = ref<boolean>(false);

const editItem = ref<any|null>(null);

function handlerSaveEditItem(item: any) {
 //TODO: send item to background.js
}

function handlerCloseEditor() {
  enableEditor.value = false;
  editItem.value = null;
}

function handlerOpenEditor(item: any) {
  enableEditor.value = true;
  editItem.value = item;
}

async function copyValue(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    const payload = { title: 'Copied to clipboard!', message: `Copied value success!`};
    await sendMessage('set-notification', payload, "background");
  } catch (error) {
    console.log('failed to copy to clipboard. error=' + error);
  }
}

function handlerItemAction(event: {action: string, item: any}) {
  const actions: {[key:string]: ()=> void} = {
    delete: () => emit('delete-item-action', event.item),
    copy: () => copyValue(event?.item?.value),
    edit: () => handlerOpenEditor(event.item)
  }
  actions[event.action] ? actions[event.action]() : console.log('Not found event');
}

onMounted(() => {
})

</script>

<template>
  <div class="popup-content text-gray-800 shadow w-max h-min" p="x-2 y-2" m="y-auto r-2" v-show="show && !hidePopup">

    <PopupContentHeader :enableEditor="enableEditor" @close-editor="handlerCloseEditor"
      @hide-popup-to-button="emit('hide-popup-to-button')" @close="emit('close')" />

    <!-- MAIN SCREEN -->
    <div v-if="detailsItems && detailsItems.length && !enableEditor" class="popup-main">

      <div v-for="parent in detailsItems" :key="parent.id" class="details-block">
        <h2 class="details-block__title text"> {{ parent.key }}</h2>
        <ul class="details-block-list">
          <PopupContentListItem v-for="item in parent.items" :key="item.id" :item="item"
            @details-list-action="handlerItemAction" />
        </ul>
      </div>
    </div>

    <!-- EDITOR -->
    <PopupContentEditor :editItem="editItem" v-if="enableEditor" @save-edit="handlerSaveEditItem" />

    <!-- START SCREEN -->
    <div v-if="!detailsItems || !detailsItems?.length" class="start-screen">
      <span class="start-screen-title text">Copy some text</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <path fill="#ffd060"
          d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5zm7.69 2.958a.75.75 0 0 0-1.36-.043L8.785 10.5H7.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 .67-.415l1.023-2.044l2.116 5.001a.75.75 0 0 0 1.339.086L15.93 12h.819a.75.75 0 0 0 0-1.5H15.5a.75.75 0 0 0-.648.372l-.995 1.706z" />
      </svg>
    </div>
  </div>
</template>

<style>
.popup-content {
  pointer-events: all !important;
  position: fixed;
  top: 5px;
  right: 5px;
  width: 500px;
  height: 75%;
  background-color: #363636;
  -webkit-box-shadow: 1px 1px 5px 1px #ffffff57;
  box-shadow: 1px 1px 5px 1px #ffffff57;
  border: none;
  border-radius: 5px;
  opacity: 0.95;
  z-index: 2147483645;
}

.popup-content .header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.popup-content .text {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.popup-content .wrapper-information {
  width: 100%;
}

.start-screen {
  width: 100px;
  height: 50px;
  position: absolute;
  left: 53%;
  top: 45%;
  transform: translate(-50%, -50%);
  opacity: .6;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.start-screen-title {
  margin-bottom: 5px;
}

.details-wrapper {
  overflow: hidden;
  height: 270px;
}

.details-block-list {
  padding-left: 10px;
  list-style: none;
  padding-right: 10px;
}

.details-block__title {
  text-align: center;
  color: #d3ac13 !important;
  font-weight: 600 !important;
}

.details-list::-webkit-scrollbar {
  width: 5px;
}

.details-list::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  opacity: 0.5;
}

.details-list::-webkit-scrollbar-thumb {
  background-color: #ffd060;
  outline: 1px solid slategrey;
}
</style>
