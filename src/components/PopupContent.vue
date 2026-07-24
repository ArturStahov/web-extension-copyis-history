<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { getRenderSortedList, getFavoriteList, getCustomList, getCopiedList } from '~/services/list-service';

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
  (e: 'update-options', payload: any): void,
  (e: 'add-pin', item: any): void,
  (e: 'remove-pin', item: any): void,
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
    name: 'copied',
    code: 'main',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"/></svg>`,
    action: () => {
      typeList.value = 'main';
    }
  },
  {
    name: 'custom',
    code: 'custom-records',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M6 6h5v5H6zm4.5 13a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5m3-6l3-5l3 5z"/></svg>`,
    action: () => {
      typeList.value = 'custom-records';
    }
  },
  {
    name: 'favorite',
    code: 'favorite',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.8 21z"/></svg>`,
    action: () => {
      typeList.value = 'favorite';
    }
  },
  {
    name: 'memory',
    code: 'memory',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    action: () => {
      typeList.value = 'memory';
    }
  }
]

const enableEditor = ref<boolean>(false);

const enableCustomCrateItem = ref<boolean>(false);

const enableHelpScreen = ref<boolean>(false);

const memoryOptions = ref<any>({});

const typeList = ref<'main' | 'favorite' | 'memory' | 'parse-image' | 'custom-records'>('main');

const editItem = ref<any|null>(null);

const tooltipPreview = ref<any>({ value: '', enable: false, position: '' });


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
    removeFavorite: () => emit('remove-favorite', event.item),
    addPin: () => emit('add-pin', event.item),
    removePin: () => emit('remove-pin', event.item)
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

function getRenderCustomList(detailsItems: any[]) {
  return getCustomList(detailsItems);
}

function getCopiedMainList(detailsItems: any[], isParent: boolean) {
  return getCopiedList(detailsItems, isParent);
}

async function handlerSaveMemoryOptions(options: {[key: string]: string}) {
  const data = await sendMessage('save-memory-options', options, "background");
  memoryOptions.value = data;
  emit('update-options', data);
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

function getTabActiveClasses(tabCode: string): string {
  const base = 'rounded-full px-4 py-1';
  const inactive = 'text-on-surface-variant hover:text-primary';
  const active: Record<string, string> = {
    'main': `bg-tertiary-container text-on-tertiary-container ${base}`,
    'custom-records': `bg-secondary-container text-on-secondary-container ${base}`,
    'favorite': `bg-primary-container text-on-primary-container ${base}`,
    'memory': `bg-tertiary-container text-on-tertiary-container ${base}`,
  };
  return active[tabCode] || inactive;
}

onMounted(async() => {
  memoryOptions.value = entryMemoryOptions.value;
})

watch(entryMemoryOptions,() => {
  memoryOptions.value = entryMemoryOptions.value;
})
</script>

<template>
  <div class="popup-content w-full h-[600px] flex flex-col bg-surface overflow-hidden relative" v-show="show && !hidePopup">

    <!-- HEADER -->
    <PopupContentHeader :enableEditor="enableEditor || enableCustomCrateItem" :enableHelpScreen="enableHelpScreen"
      @back-button-action="handlerBackButtonAction" @hide-popup-to-button="emit('hide-popup-to-button')"
      @close="emit('close')" @create-custom="handlerOpenCreateCustomItem" @open-help-screen="handlerOpenHelpScreen" />

    <!-- MAIN SCROLLABLE CONTENT -->
    <main class="flex-1 custom-scrollbar" :class="(!enableEditor && !enableCustomCrateItem && !enableHelpScreen) ? 'overflow-y-auto p-container-padding pb-20 space-y-stack-gap' : 'flex flex-col min-h-0 overflow-hidden'">

      <!-- MAIN LIST (Copied tab) -->
      <template v-if="typeList === 'main' && !enableEditor && !enableCustomCrateItem && !enableHelpScreen">
        <div v-for="parent in getCopiedMainList(detailsItems, true)" :key="parent.id" class="space-y-inner-gap">
          <!-- Date section header -->
          <div class="sticky top-0 -mx-container-padding px-container-padding pt-2 pb-1 bg-surface z-10">
            <div class="flex items-center justify-center">
              <span class="font-label-lg text-label-lg text-primary bg-surface-container-high px-3 py-0.5 rounded-full border border-outline-variant/30">
                {{ parent.key }}
              </span>
            </div>
          </div>
          <ul class="space-y-inner-gap">
            <PopupContentListItem v-for="item in getCopiedMainList(parent.items, false)" :key="item.id" :item="item"
              @details-list-action="handlerItemAction" @preview-tooltip="handlerPreviewTooltip" />
          </ul>
        </div>
        <div v-if="!getCopiedMainList(detailsItems, true).length"
          class="flex flex-col items-center justify-center py-20 opacity-60">
          <span class="font-body-md text-body-md text-on-surface-variant mb-2">Copy some text!</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" />
          </svg>
        </div>
      </template>

      <!-- CUSTOM RECORDS LIST -->
      <template v-if="typeList === 'custom-records' && !enableEditor && !enableCustomCrateItem && !enableHelpScreen">
        <ul v-if="!!getRenderCustomList(detailsItems).length" class="space-y-inner-gap">
          <PopupContentListItem v-for="item in getRenderCustomList(detailsItems)" :key="item.id" :item="item"
            :isCustomRecordsList="true" @details-list-action="handlerItemAction" @preview-tooltip="handlerPreviewTooltip" />
        </ul>
        <div v-if="!getRenderCustomList(detailsItems).length"
          class="flex flex-col items-center justify-center py-20 opacity-60">
          <span class="font-body-md text-body-md text-on-surface-variant mb-2">Create custom record!</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
          </svg>
        </div>
      </template>

      <!-- FAVORITE LIST -->
      <template v-if="typeList === 'favorite' && !enableEditor && !enableCustomCrateItem && !enableHelpScreen">
        <ul v-if="!!getRenderFavoriteList(detailsItems).length" class="space-y-inner-gap">
          <PopupContentListItem v-for="item in getRenderFavoriteList(detailsItems)" :key="item.id" :item="item"
            :isFavoriteList="true" @details-list-action="handlerItemAction"
            @preview-tooltip="handlerPreviewTooltip" />
        </ul>
        <div v-if="!getRenderFavoriteList(detailsItems).length"
          class="flex flex-col items-center justify-center py-20 opacity-60">
          <span class="font-body-md text-body-md text-on-surface-variant mb-2">No favorites yet!</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.8 21z" />
          </svg>
        </div>
      </template>

      <!-- PARSE IMAGE -->
      <div v-if="typeList === 'parse-image'" class="details-parse">
        <PopupContentParseImage @save-image-parse="handlerSaveParseImage" />
      </div>

      <!-- MEMORY SETTINGS -->
      <div v-if="typeList === 'memory' && !enableEditor && !enableCustomCrateItem && !enableHelpScreen" class="details-memory">
        <PopupContentSettings :sizeStorage="sizeStorage" :memoryOptions="memoryOptions"
          @save-options="handlerSaveMemoryOptions" />
      </div>

      <!-- EDITOR -->
      <PopupContentEditor :editItem="editItem" v-if="enableEditor && !enableHelpScreen"
        @save-edit="(item) => { emit('save-edit', item); handlerBackButtonAction(); }" />

      <!-- CUSTOM-CREATE ITEM -->
      <PopupContentCustomCreateItem v-if="enableCustomCrateItem && !enableHelpScreen"
        @save-custom-item="handlerSaveCustomItem" />

      <!-- HelpScreen -->
      <HelpScreen v-if="enableHelpScreen" />
    </main>

    <!-- BOTTOM NAVBAR -->
    <nav v-if="!enableEditor && !enableCustomCrateItem && !enableHelpScreen"
      class="absolute bottom-0 left-0 w-full h-16 bg-surface-container-high border-t border-outline-variant flex justify-around items-center z-50">
      <button v-for="(tab, idx) in listTabsActions" :key="idx"
        class="flex flex-col items-center justify-center bg-transparent border-none px-4 py-1 cursor-pointer transition-all duration-200 active:scale-90"
        :class="tab.code === typeList
          ? getTabActiveClasses(tab.code)
          : 'text-on-surface-variant hover:text-primary'"
        @click="tab.action">
        <span class="w-6 h-6 flex items-center justify-center" v-html="tab.icon"></span>
        <span class="font-label-sm text-label-sm mt-0.5">{{ tab.name }}</span>
      </button>
    </nav>

  </div>
</template>

<style>
.popup-content {
  pointer-events: all !important;
  position: fixed;
  top: 5px;
  right: 5px;
  width: 500px;
  height: 670px;
  background-color: #0b1326;
  border: 1px solid #3c4a46;
  border-radius: 12px;
  z-index: 2147483645;
}

.start-screen {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.details-parse {
  height: 100%;
}
</style>
