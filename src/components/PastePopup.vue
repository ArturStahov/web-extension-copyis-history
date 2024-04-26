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
  <div class="paste-popup"
    :style="`height:${visible === '1' ? 'auto' : 0}px;opacity:${visible};display: flex;left: ${visible === '1' ? position?.left +'px' : '-500%'}; top: ${position?.top}px`">
    <ButtonComponent class="paste-popup-close" @click="emit('closePastePopup')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 24 24">
        <path fill="#0d9488"
          d="M4 0h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm7.414 8l2.829 2.828a1 1 0 0 1-1.415 1.415L10 11.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L8.586 10L5.757 7.172a1 1 0 0 1 1.415-1.415L10 8.586l2.828-2.829a1 1 0 0 1 1.415 1.415z" />
      </svg>
    </ButtonComponent>
    <h2 class="paste-popup-title text"> FAVORITE LIST</h2>
    <p class="error-text text" v-if="textError"> {{ textError }}</p>
    <div class="popup-main" v-if="detailsItems && detailsItems.length">
      <div class=" popup-main__scroll-wrapper">
        <div class="details-favorite">
          <ul class="details-block-list">
            <li @click="() => handlerSelectValue(item)" :class="{ 'selected-item': isSelected(item.id) }"
              class="details-block-list__item" v-for="item in getRenderFavoriteList(detailsItems) " :key="item.id">
              <span class="details-block-list__item-value"> {{ item.value }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="paste-popup-wrapper-information">
      <ButtonComponent class="paste-button" :type-button="'text'" @click="handlerPase">
        PASTE
      </ButtonComponent>
    </div>
  </div>
</template>

<style>
.paste-popup {
  pointer-events: all !important;
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  position: absolute;
  width: 350px;
  color: #ffffff;
  font-size: 14px;
  background-color: #363636;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px #ffffff57;
  z-index: 1147483645;
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.paste-popup-close {
  position: absolute;
  right: 5px;
  top: 5px;
}

.paste-popup .paste-popup-title {
  text-align: center;
  color: #d3ac13 !important;
  font-weight: 600 !important;
  width: 100%;
  font-size: 14px !important;
  margin-bottom: 5px !important;
}

.paste-popup .error-text {
  text-align: center;
  color: #c54118 !important;
  font-weight: 600 !important;
  width: 100%;
  font-size: 12px !important;
  margin: 0 !important;
}

.paste-popup-wrapper-information {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 10px;
}

.paste-popup .paste-button {
  width: 100px !important;
  height: 25px !important;
}

.paste-popup .popup-main {
  width: 100%;
  height: 230px;
  overflow: hidden;
  margin-top: 5px;
}

.paste-popup .popup-main__scroll-wrapper {
  height: 100%;
  overflow-y: auto;
}

.paste-popup .details-block-list {
  padding-left: 10px;
  list-style: none;
  padding-right: 10px;
}

.paste-popup .details-block-list__item {
  cursor: pointer;
  position: relative;
  border: 1px solid #8b888842;
  padding: 5px 5px 5px 20px;
  display: flex;
  text-decoration: none;
  list-style: none;
  align-items: center;
  margin-bottom: 10px;
}

.paste-popup .details-block-list__item.selected-item {
  border: 2px solid #d3ac13;
}

.paste-popup .details-block-list__item-value {
  color: #ffffff;
  font-size: 12px;
  width: 290px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.paste-popup .popup-main__scroll-wrapper::-webkit-scrollbar {
  width: 5px;
}

.paste-popup .popup-main__scroll-wrapper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  opacity: 0.5;
}

.paste-popup .popup-main__scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: #ffd060;
  outline: 1px solid slategrey;
}
</style>
