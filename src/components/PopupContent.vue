<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs, computed } from 'vue';
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { getRenderSortedList, getFavoriteList, getCustomList, getCopiedList } from '~/services/list-service';

const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'delete-item-action', item: any): void,
  (e: 'hide-popup-to-button',): void
  (e: 'save-edit', item: any): void,
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

const tabs = [
  { name: 'copied', code: 'main', icon: 'i-mdi-content-paste' },
  { name: 'custom', code: 'custom-records', icon: 'i-mdi-file-document-edit-outline' },
  { name: 'favorite', code: 'favorite', icon: 'i-mdi-star-outline' },
  { name: 'memory', code: 'memory', icon: 'i-mdi-history' },
];

const enableEditor = ref<boolean>(false);
const enableCustomCrateItem = ref<boolean>(false);
const enableHelpScreen = ref<boolean>(false);
const memoryOptions = ref<any>({});
const typeList = ref<'main' | 'favorite' | 'memory' | 'parse-image' | 'custom-records'>('main');
const editItem = ref<any | null>(null);
const tooltipPreview = ref<any>({ value: '', enable: false, position: '' });
const searchQuery = ref<string>('');

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
    const payload = { title: 'Copied to clipboard!', message: `Copied value success!` };
    await sendMessage('set-notification', payload, "background");
  } catch (error) {
    console.log('failed to copy to clipboard. error=' + error);
  }
}

function handlerItemAction(event: { action: string, item: any, $event?: any }) {
  const actions: { [key: string]: () => void } = {
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

function getRenderFavoriteList(detailsItems: any[]) {
  return getFavoriteList(detailsItems);
}

function getRenderCustomList(detailsItems: any[]) {
  return getCustomList(detailsItems);
}

function getCopiedMainList(detailsItems: any[], isParent: boolean) {
  return getCopiedList(detailsItems, isParent);
}

async function handlerSaveMemoryOptions(options: { [key: string]: string }) {
  const data = await sendMessage('save-memory-options', options, "background");
  memoryOptions.value = data;
  emit('update-options', data);
}

async function handlerSaveParseImage(data: { value: string }) {
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

function switchTab(code: string) {
  typeList.value = code as any;
}

function isActiveTab(code: string) {
  return typeList.value === code;
}

const showMainContent = computed(() => !enableEditor.value && !enableCustomCrateItem.value && !enableHelpScreen.value);

onMounted(async () => {
  memoryOptions.value = entryMemoryOptions.value;
})

watch(entryMemoryOptions, () => {
  memoryOptions.value = entryMemoryOptions.value;
})
</script>

<template>
  <div
    class="popup-content flex flex-col bg-surface overflow-hidden relative border border-outline-variant shadow-2xl"
    v-show="show && !hidePopup"
  >
    <!-- TOOLTIP PREVIEW -->
    <div
      v-if="tooltipPreview.enable"
      :style="`top: ${tooltipPreview.position ? tooltipPreview.position : 80}px;`"
      class="tooltip-preview"
    >
      {{ tooltipPreview.value }}
    </div>

    <!-- HEADER -->
    <PopupContentHeader
      :enableEditor="enableEditor || enableCustomCrateItem"
      :enableHelpScreen="enableHelpScreen"
      @back-button-action="handlerBackButtonAction"
      @hide-popup-to-button="emit('hide-popup-to-button')"
      @close="emit('close')"
      @create-custom="handlerOpenCreateCustomItem"
      @open-help-screen="handlerOpenHelpScreen"
    />

    <!-- BOTTOM NAVIGATION BAR -->
    <nav
      v-if="showMainContent"
      class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 bg-surface-container-high border-t border-outline-variant"
    >
      <button
        v-for="tab in tabs"
        :key="tab.code"
        class="flex flex-col items-center justify-center px-4 py-1 transition-all duration-200 active:scale-90"
        :class="isActiveTab(tab.code)
          ? 'bg-secondary-container text-on-secondary-container rounded-full'
          : 'text-on-surface-variant hover:text-primary'"
        @click="switchTab(tab.code)"
      >
        <span
          class="text-[20px] leading-none"
          :class="tab.icon"
        ></span>
        <span class="font-label-sm text-label-sm mt-0.5">{{ tab.name }}</span>
      </button>
    </nav>

    <!-- MAIN SCROLLABLE CONTENT -->
    <main class="flex-1 overflow-y-auto px-container-padding pt-2 pb-20 space-y-stack-gap">
      <!-- MAIN LIST -->
      <template v-if="showMainContent && typeList === 'main'">
        <div v-for="parent in getCopiedMainList(detailsItems, true)" :key="parent.id">
          <!-- Date Section Header -->
          <div class="sticky top-0 py-2 bg-surface/90 glass-blur z-10 flex items-center justify-center">
            <span class="font-label-lg text-label-lg text-primary bg-surface-container-high px-3 py-0.5 rounded-full border border-outline-variant/30">
              {{ parent.key }}
            </span>
          </div>

          <!-- Items -->
          <div class="space-y-inner-gap mt-2">
            <PopupContentListItem
              v-for="item in getCopiedMainList(parent.items, false)"
              :key="item.id"
              :item="item"
              @details-list-action="handlerItemAction"
              @preview-tooltip="handlerPreviewTooltip"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!getCopiedMainList(detailsItems, true).length" class="flex flex-col items-center justify-center py-16 opacity-60">
          <span class="i-mdi-content-paste text-[48px] text-on-surface-variant mb-3"></span>
          <span class="font-body-md text-on-surface-variant">Copy some text!</span>
        </div>
      </template>

      <!-- CUSTOM RECORDS LIST -->
      <template v-if="showMainContent && typeList === 'custom-records'">
        <div v-if="getRenderCustomList(detailsItems).length" class="space-y-inner-gap">
          <PopupContentListItem
            v-for="item in getRenderCustomList(detailsItems)"
            :key="item.id"
            :item="item"
            :isCustomRecordsList="true"
            @details-list-action="handlerItemAction"
            @preview-tooltip="handlerPreviewTooltip"
          />
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16 opacity-60">
          <span class="i-mdi-file-document-edit-outline text-[48px] text-on-surface-variant mb-3"></span>
          <span class="font-body-md text-on-surface-variant">Create custom record!</span>
        </div>
      </template>

      <!-- FAVORITE LIST -->
      <template v-if="showMainContent && typeList === 'favorite'">
        <div v-if="getRenderFavoriteList(detailsItems).length" class="space-y-inner-gap">
          <!-- Pinned Items Section -->
          <template v-if="getRenderFavoriteList(detailsItems).filter(i => i.pin).length">
            <div class="mt-4 mb-2 flex items-center gap-2">
              <span class="font-label-lg text-label-lg text-primary uppercase tracking-wider">Pinned Items</span>
              <div class="h-[1px] flex-grow bg-outline-variant"></div>
            </div>
            <PopupContentListItem
              v-for="item in getRenderFavoriteList(detailsItems).filter(i => i.pin)"
              :key="item.id"
              :item="item"
              :isFavoriteList="true"
              @details-list-action="handlerItemAction"
              @preview-tooltip="handlerPreviewTooltip"
            />
          </template>

          <!-- Regular Favorites Section -->
          <template v-if="getRenderFavoriteList(detailsItems).filter(i => !i.pin).length">
            <div class="mt-4 mb-2 flex items-center gap-2">
              <span class="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Favorites</span>
              <div class="h-[1px] flex-grow bg-outline-variant"></div>
            </div>
            <PopupContentListItem
              v-for="item in getRenderFavoriteList(detailsItems).filter(i => !i.pin)"
              :key="item.id"
              :item="item"
              :isFavoriteList="true"
              @details-list-action="handlerItemAction"
              @preview-tooltip="handlerPreviewTooltip"
            />
          </template>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16 opacity-60">
          <span class="i-mdi-star-outline text-[48px] text-on-surface-variant mb-3"></span>
          <span class="font-body-md text-on-surface-variant">No favorites yet!</span>
        </div>
      </template>

      <!-- PARSE IMAGE -->
      <div v-if="showMainContent && typeList === 'parse-image'">
        <PopupContentParseImage @save-image-parse="handlerSaveParseImage" />
      </div>

      <!-- MEMORY SETTINGS -->
      <div v-if="showMainContent && typeList === 'memory'">
        <PopupContentSettings :sizeStorage="sizeStorage" :memoryOptions="memoryOptions"
          @save-options="handlerSaveMemoryOptions" />
      </div>
    </main>

    <!-- EDITOR -->
    <PopupContentEditor
      :editItem="editItem"
      v-if="enableEditor && !enableHelpScreen"
      @save-edit="(item) => emit('save-edit', item)"
    />

    <!-- CUSTOM-CREATE ITEM -->
    <PopupContentCustomCreateItem
      v-if="enableCustomCrateItem && !enableHelpScreen"
      @save-custom-item="handlerSaveCustomItem"
    />

    <!-- HelpScreen -->
    <HelpScreen v-if="enableHelpScreen" />
  </div>
</template>

<style>
.popup-content {
  pointer-events: all !important;
  position: fixed;
  top: 5px;
  right: 5px;
  width: 400px;
  height: 600px;
  background-color: #0b1326;
  border: 1px solid #3c4a46;
  border-radius: 0.75rem;
  z-index: 2147483645;
}

.tooltip-preview {
  position: absolute;
  width: 380px;
  max-height: 140px;
  left: -405px;
  top: 80px;
  transform: translateY(-50%);
  background: #222a3d;
  border: 1px solid #3c4a46;
  border-radius: 0.75rem;
  padding: 10px;
  z-index: 999999999999;
  line-height: 1.2;
  word-break: break-all;
  overflow-y: auto;
}
</style>
