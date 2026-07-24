<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, reactive, defineProps } from 'vue'
import { getFavoriteList } from '~/services/list-service';

const emit = defineEmits<{
  (e: 'closePastePopup'): void,
  (e: 'paste-value', payload: { value: string }): void,
}>();

const props = defineProps({
  position: {
    type: Object,
  },
  visible: {
    type: String,
    default: 'none'
  },
  detailsItems: {
    type: Array,
    default() {
      return null
    }
  },
});

const { visible, detailsItems } = toRefs(props);

const selectedItem = ref<any>(null);
const textError = ref<string>('');

function handlerSelectValue(item: { id: string, value: string }) {
  selectedItem.value = item;
}

function handlerPase() {
  if (selectedItem.value) {
    textError.value = '';
    emit('paste-value', { value: selectedItem.value.value });
    selectedItem.value = null;
  } else {
    textError.value = 'Click on list item for selected value!'
  }
}

function isSelected(id: string) {
  return id === selectedItem.value?.id
}

function getRenderFavoriteList(detailsItems: any[]) {
  return getFavoriteList(detailsItems);
}
</script>

<template>
  <div
    class="paste-popup flex flex-col bg-surface rounded-xl border border-outline-variant shadow-2xl overflow-hidden"
    :style="`height:${visible === '1' ? 'auto' : 0}px;opacity:${visible};display: flex;left: ${visible === '1' ? position?.left + 'px' : '-500%'}; top: ${position?.top}px`"
  >
    <!-- Close button -->
    <ButtonComponent class="absolute right-2 top-2 z-10" @click="emit('closePastePopup')">
      <span class="i-mdi-close text-on-surface-variant text-[18px]"></span>
    </ButtonComponent>

    <!-- Title -->
    <h2 class="text-center font-headline-md text-headline-md text-primary px-container-padding pt-3 pb-2">
      Favorite Records
    </h2>

    <!-- Error -->
    <p v-if="textError" class="text-center font-label-sm text-error px-container-padding -mt-1 mb-2">
      {{ textError }}
    </p>

    <!-- List -->
    <div class="popup-main" v-if="detailsItems && detailsItems.length">
      <div class="popup-main__scroll-wrapper">
        <div class="space-y-inner-gap px-container-padding pb-2">
          <div
            v-for="item in getRenderFavoriteList(detailsItems)"
            :key="item.id"
            class="p-2 bg-surface-container rounded-lg cursor-pointer border transition-all duration-200"
            :class="isSelected(item.id)
              ? 'border-primary bg-surface-container-high'
              : 'border-transparent hover:border-outline-variant'"
            @click="() => handlerSelectValue(item)"
          >
            <span class="font-mono-sm text-mono-sm text-on-surface truncate block">
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-8">
      <span class="i-mdi-star-outline text-[32px] text-on-surface-variant mb-2"></span>
      <p class="font-body-sm text-on-surface-variant text-center">Favorite list empty!</p>
      <p class="font-label-sm text-on-surface-variant/60 text-center mt-1">Add a record to favorites first</p>
    </div>

    <!-- Paste button -->
    <div class="flex justify-center px-container-padding pb-3 pt-2">
      <button
        class="w-full py-2 bg-secondary-container text-on-secondary-container font-label-lg rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
        @click="handlerPase"
      >
        PASTE
      </button>
    </div>
  </div>
</template>

<style>
.paste-popup {
  pointer-events: all !important;
  position: absolute;
  width: 350px;
  z-index: 1147483645;
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.paste-popup .popup-main {
  width: 100%;
  height: 230px;
  overflow: hidden;
}

.paste-popup .popup-main__scroll-wrapper {
  height: 100%;
  overflow-y: auto;
}
</style>
