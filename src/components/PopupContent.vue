<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { getRenderSortedList, getFavoriteList } from '~/services/list-service';

const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'delete-item-action', item: any): void,
  (e: 'hide-popup-to-button',): void
  (e: 'save-edit',item: any): void,
  (e: 'preview-tooltip', options: any): void,
  (e: 'add-to-favorite', item: any): void,
  (e: 'remove-favorite', item: any): void,
  (e: 'save-parse-image', payload: any): void,
  (e: 'save-custom-item', payload: any): void,
}>();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  detailsItems: {
    type: Array,
    default() {
      return null
    }
  },
  hidePopup: {
    type: Boolean,
    default: false
  },
  sizeStorage: {
    type: Number
  },
  entryMemoryOptions: {
    type: Object,
    default: () => ({})
  }
});
const { hidePopup, detailsItems, sizeStorage, entryMemoryOptions } = toRefs(props);

const listTabsActions = [
  {
    name: 'all',
    code: 'main',
    icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffd060" fill-rule="evenodd" d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm2 5h2v2H6zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2zm-3 4H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1m-2 3H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1" clip-rule="evenodd"/></svg>`,
    action: () => {
      typeList.value = 'main';
    }
  },
  {
    name: 'favorite',
    code: 'favorite',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 2048 2048"><path fill="#ffd060" d="m1416 1254l248 794l-640-492l-640 492l248-794L0 768h784L1024 0l240 768h784zm5 446q-38-124-76-246t-78-247q103-77 203-155t202-156h-502l-146-467l-146 467H376q102 78 202 156t203 155q-40 124-78 246t-76 247l397-306z"/></svg>`,
    action: () => {
      typeList.value = 'favorite';
    }
  },
  {
    name: 'image',
    code: 'parse-image',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffd060" d="M21 6.25A3.25 3.25 0 0 0 17.75 3H6.25A3.25 3.25 0 0 0 3 6.25v4.507a5.5 5.5 0 0 1 1.5-.882V6.25c0-.966.784-1.75 1.75-1.75h11.5c.966 0 1.75.784 1.75 1.75v11.5q-.002.315-.104.595l-5.822-5.702l-.128-.116a2.25 2.25 0 0 0-2.243-.38c.259.425.461.889.598 1.38a.75.75 0 0 1 .724.188L18.33 19.4a1.8 1.8 0 0 1-.581.099h-4.775l.512.513c.278.277.443.626.495.987h3.768A3.25 3.25 0 0 0 21 17.75zm-3.496 2.502a2.252 2.252 0 1 0-4.504 0a2.252 2.252 0 0 0 4.504 0m-3.004 0a.752.752 0 1 1 1.504 0a.752.752 0 0 1-1.504 0M9.95 17.89a4.5 4.5 0 1 0-1.145.976l2.915 2.915a.75.75 0 1 0 1.06-1.06zM6.5 18a3 3 0 1 1 0-6a3 3 0 0 1 0 6"/></svg>`,
    action: () => {
      typeList.value = 'parse-image';
    }
  },
  {
    name: 'memory',
    code: 'memory',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="none" stroke="#ffd060" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M44 11v27c0 3.314-8.954 6-20 6S4 41.314 4 38V11"/><path d="M44 29c0 3.314-8.954 6-20 6S4 32.314 4 29m40-9c0 3.314-8.954 6-20 6S4 23.314 4 20"/><ellipse cx="24" cy="10" rx="20" ry="6"/></g></svg>`,
    action: () => {
      typeList.value = 'memory';
    }
  }
]

const enableEditor = ref<boolean>(false);

const enableCustomCrateItem = ref<boolean>(false);

const enableHelpScreen = ref<boolean>(false);

const memoryOptions = ref<any>({});

const typeList = ref<'main' | 'favorite' | 'memory' | 'parse-image'>('main');

const editItem = ref<any|null>(null);

const tooltipPreview = ref<any>({ value: '', enable: false, position: '' });

function getSortedList(detailsList: any[],params:string) {
  return getRenderSortedList(detailsList, params)
}

function handlerBackButtonAction() {
  enableEditor.value = false;
  editItem.value = null;
  enableCustomCrateItem.value = false;
  enableHelpScreen.value = false;
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

function handlerItemAction(event: { action: string, item: any, $event?:any}) {
  const actions: {[key:string]: ()=> void} = {
    delete: () => emit('delete-item-action', event.item),
    copy: () => copyValue(event?.item?.value),
    edit: () => handlerOpenEditor(event.item),
    addToFavorite: () => emit('add-to-favorite', event.item),
    removeFavorite: () => emit('remove-favorite', event.item)
  }
  actions[event.action] ? actions[event.action]() : console.log('Not found event');
}

function handlerPreviewTooltip(options: { value: string, enable: boolean, position: string }) {
  tooltipPreview.value = {
    ...options,
    position: Number(options.position) + 20,
  };
}

function getRenderFavoriteList(detailsItems:any[]) {
  return getFavoriteList(detailsItems);
}

async function handlerSaveMemoryOptions(options: {[key: string]: string}) {
  const data = await sendMessage('save-memory-options', options, "background");
  memoryOptions.value = data;
}

async function handlerSaveParseImage(data: {value: string}) {
  emit('save-parse-image', data);
}

function handlerOpenCreateCustomItem() {
  enableCustomCrateItem.value = true;
}

function handlerOpenHelpScreen() {
  enableHelpScreen.value = true;
}

function handlerSaveCustomItem(item: any) {
  emit('save-custom-item', item);
  enableCustomCrateItem.value = false;
}

onMounted(async() => {
  memoryOptions.value = entryMemoryOptions.value;
})

watch(entryMemoryOptions,() => {
  memoryOptions.value = entryMemoryOptions.value;
})
</script>

<template>
  <div class="popup-content text-gray-800 shadow w-max h-min" p="x-2 y-2" m="y-auto r-2" v-show="show && !hidePopup">

    <!-- TOOLTIP PREVIEW-->
    <div v-if="tooltipPreview.enable" :style="`top: ${tooltipPreview.position ? tooltipPreview.position : 80}px;`"
      class="tooltip-preview text">
      {{ tooltipPreview.value }}
      <svg class="tooltip-preview-arrow" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <path fill="#2b2b2b"
          d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886" />
      </svg>
    </div>

    <!-- HEADER ACTIONS -->
    <PopupContentHeader :enableEditor="enableEditor || enableCustomCrateItem" :enableHelpScreen="enableHelpScreen"
      @back-button-action="handlerBackButtonAction" @hide-popup-to-button="emit('hide-popup-to-button')"
      @close="emit('close')" @create-custom="handlerOpenCreateCustomItem" @open-help-screen="handlerOpenHelpScreen" />

    <!-- TABS-BUTTONS -->
    <div v-if="!enableEditor && !enableCustomCrateItem && !enableHelpScreen" class="list-tabs">
      <div v-for="(tab,idx) in listTabsActions" @click.native="tab.action" :key="idx"
        :class="{'active-tab': tab.code === typeList}" class="list-tabs-button">
        <span class="tab-icon" v-html="tab.icon"></span>
        <span class="tab-name">{{ tab.name }}</span>
      </div>
    </div>

    <!-- MAIN SCREEN -->
    <div v-if="detailsItems && detailsItems.length && !enableEditor && !enableCustomCrateItem && !enableHelpScreen"
      class="popup-main">
      <div class="popup-main__scroll-wrapper">
        <!-- MAIN LIST -->
        <div v-if="typeList === 'main'" class="main-list-wrapper">
          <div v-for="parent in getSortedList(detailsItems,'id')" :key="parent.id" class="details-block">
            <h2 class="details-block__title text"> {{ parent.key }}</h2>
            <ul class="details-block-list">
              <PopupContentListItem v-for="item in getSortedList(parent.items, 'id')" :key="item.id" :item="item"
                @details-list-action="handlerItemAction" @preview-tooltip="handlerPreviewTooltip" />
            </ul>
          </div>
        </div>
        <!-- FAVORITE LIST -->
        <div v-if="typeList === 'favorite'" class="details-favorite">
          <ul class="details-block-list">
            <PopupContentListItem v-for="item in getRenderFavoriteList(detailsItems)" :key="item.id" :item="item"
              :isFavoriteList="true" @details-list-action="handlerItemAction"
              @preview-tooltip="handlerPreviewTooltip" />
          </ul>
        </div>
        <!-- PARSE IMAGE -->
        <div v-if="typeList === 'parse-image'" class="details-parse">
          <PopupContentParseImage @save-image-parse="handlerSaveParseImage" />
        </div>
        <!-- MEMORY SETTINGS -->
        <div v-if="typeList === 'memory'" class="details-memory">
          <PopupContentMemory :sizeStorage="sizeStorage" :memoryOptions="memoryOptions"
            @save-options="handlerSaveMemoryOptions" />
        </div>
      </div>
    </div>

    <!-- EDITOR -->
    <PopupContentEditor :editItem="editItem" v-if="enableEditor && !enableHelpScreen"
      @save-edit="(item) => emit('save-edit',item)" />

    <!-- CUSTOM-CREATE ITEM -->
    <PopupContentCustomCreateItem v-if="enableCustomCrateItem && !enableHelpScreen"
      @save-custom-item="handlerSaveCustomItem" />

    <!-- HelpScreen-->
    <HelpScreen v-if="enableHelpScreen" />

    <!-- START SCREEN -->
    <div v-if="(!detailsItems && !enableHelpScreen) || (!detailsItems?.length && !enableHelpScreen)"
      class="start-screen">
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
  height: 82%;
  background-color: #363636;
  -webkit-box-shadow: 1px 1px 5px 1px #ffffff57;
  box-shadow: 1px 1px 5px 1px #ffffff57;
  border: none;
  border-radius: 5px;
  opacity: 0.95;
  z-index: 2147483645;
}

.list-tabs {
  margin-top: 15px;
  margin-left: 12px;
  display: flex;
}

.list-tabs .list-tabs-button {
  margin-right: 10px;
  padding-bottom: 5px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.list-tabs .tab-name {
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
  text-transform: uppercase;
}

.list-tabs .active-tab {
  border-bottom: 1px solid #d3ac13;
}

.list-tabs .tab-icon {
  margin-right: 5px;
}

.tooltip-preview {
  position: absolute;
  width: 380px;
  height: 140px;
  left: -425px;
  top: 80px;
  transform: translateY(-50%);
  background: #2b2b2b;
  border: 1px solid #8b888842;
  border-radius: 5px;
  padding: 10px;
  z-index: 999999999999;
  line-height: 1.2;
  word-break: break-all;
}

.tooltip-preview-arrow {
  position: absolute;
  z-index: 99999999;
  right: -33px;
  top: 46%;
  transform: translateY(-50%);
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

.popup-content .popup-main {
  height: 85%;
  overflow: hidden;
  margin-top: 20px;
}

.popup-content .popup-main__scroll-wrapper {
  height: 100%;
  overflow-y: auto;
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

.popup-content .popup-main__scroll-wrapper::-webkit-scrollbar {
  width: 5px;
}

.popup-content .popup-main__scroll-wrapper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  opacity: 0.5;
}

.popup-content .popup-main__scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: #ffd060;
  outline: 1px solid slategrey;
}

.popup-content .details-parse {
 height: 100%;
}


</style>
