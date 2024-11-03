<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'details-list-action', payload: { action: string, item: any }): void,
  (e: 'preview-tooltip', options: any): void,
}>();

const props = defineProps({
  item: {
    type: Object,
    default() {
      return {
        value: '',
        time: ''
      }
    }
  },
  isFavoriteList: {
    type: Boolean,
    default: false
  }
});

const { item } = toRefs(props);

const hoverText = ref<boolean>(false);

const listItemElement = ref<any>(null)

function handlerStartHoverText(event: any) {
  const rect = listItemElement.value?.getBoundingClientRect();

  hoverText.value = true;
  if (item.value?.value?.length > 46) {

    emit('preview-tooltip', { value: getTooltipText(), enable: true, position: rect?.top  });
  }
}

function getTooltipText() {
  return `${item.value?.value?.slice(0, 520)} ${item.value?.value?.length > 520 ? "..." : ""}`
}

function handlerEndHoverText() {
  hoverText.value = false;
  emit('preview-tooltip', { value: '', enable: false, position: '' });
}

function handlerFavorite(item: any) {
  if (!item.favorite) {
    emit('details-list-action', { action: 'addToFavorite', item })
  } else {
    emit('details-list-action', { action: 'removeFavorite', item })
  }
}

function handlerClickLinkPreview(link: string) {
 if(!link) {
  return;
 }
  window.open(link, '_blank');
}

function handlerAction(type: string) {
  emit('preview-tooltip', { value: '', enable: false, position: '' });
  emit('details-list-action', { action: type, item: item.value })
}

function getItemHoverValue(item: any) {
  if(item.location) {
    return item.location;
  }

  if (item.action === 'custom-item') {
    return item.title ? `<span class="custom-item-title">TITLE:<span/> ${item.title}` : `<span class="custom-item-title">TITLE: EMPTY TITLE<span/>`
  }

  return item.value;
}

onMounted(() => {
})

</script>

<template>
  <li ref="listItemElement" @mouseover="handlerStartHoverText" @mouseleave="handlerEndHoverText"
    class="details-block-list__item" :class='{ "favorite-item": item.favorite && !isFavoriteList }'>
    <svg class="details-block-list__item-marker" xmlns=" http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 16 16">
      <path fill="#d3ac13" d="M4 8a4 4 0 1 1 8 0a4 4 0 0 1-8 0m4-2.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5" />
    </svg>

    <span v-if="!hoverText" class="text details-block-list__item-text not-hovered">
      {{ item.title ? item.title : item.value }}
    </span>

    <span v-else @click="() => handlerClickLinkPreview(item.location)" target="_blank"
      class="text details-block-list__item-text hovered" :class="{ 'link-preview': item.location}"
      v-html="getItemHoverValue(item)"
      >
    </span>

    <div class="details-block-list__item-actions">
      <ButtonComponent :tooltip="'favorite'" data-type="favorite" @click="() => handlerFavorite(item)">
        <svg v-if="!item.favorite" data-type="ADD TO FAVORITE ICON" xmlns="http://www.w3.org/2000/svg" width="24"
          height="24" viewBox="0 0 16 16">
          <path fill="#0d9488"
            d="M8.808 2.101a.9.9 0 0 0-1.614 0L5.673 5.183l-3.401.495a.9.9 0 0 0-.5 1.535l2.462 2.399l-.581 3.387a.9.9 0 0 0 1.306.949l.91-.479a5.5 5.5 0 0 1 4.372-8.463zM15 10.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V10H8.5a.5.5 0 0 0 0 1H10v1.5a.5.5 0 1 0 1 0V11h1.5a.5.5 0 1 0 0-1H11z" />
        </svg>
        <svg v-else data-type="REMOVE FROM FAVORITE ICON" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24">
          <path fill="#0d9488"
            d="m5.8 21l1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6l7.2.6l-3.2 2.8H18c-3.1 0-5.6 2.3-6 5.3zm8.2-4v2h8v-2z" />
        </svg>
      </ButtonComponent>
      <ButtonComponent :tooltip="'edit'" data-type="edit" @click="() => handlerAction('edit')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#0d9488"
            d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h4v-1.9l10-10V8l-6-6zm7 1.5L18.5 9H13zm7.1 9.5c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-2 1.8L12 20.9V23h2.1l6.1-6.1z" />
        </svg>
      </ButtonComponent>
      <ButtonComponent :tooltip="'copy'" data-type="copy" @click="() => handlerAction('copy')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
          <path fill="#0d9488"
            d="M8.5 5.25A3.25 3.25 0 0 1 11.75 2h12A3.25 3.25 0 0 1 27 5.25v18a3.25 3.25 0 0 1-3.25 3.25h-12a3.25 3.25 0 0 1-3.25-3.25zM5 8.75c0-1.352.826-2.511 2-3.001v17.75a4.5 4.5 0 0 0 4.5 4.5h11.751a3.25 3.25 0 0 1-3.001 2H11.5A6.5 6.5 0 0 1 5 23.5z" />
        </svg>
      </ButtonComponent>
      <ButtonComponent :tooltip="'delete'" data-type="delete" @click="() => handlerAction('delete')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path fill="#0d9488" d="M9 7h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z" />
            <path stroke="#0d9488" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7h-2M4 7h2m0 0h12M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7m-9-.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5v0" />
          </g>
        </svg>
      </ButtonComponent>
    </div>

    <span class="text details-block-list__item-time">
      {{ item.time }}
    </span>
  </li>
</template>

<style>
.details-block-list__item {
  position: relative;
  border: 1px solid #8b888842;
  padding: 5px 5px 5px 20px;
  display: flex;
  text-decoration: none;
  list-style: none;
  align-items: center;
  margin-bottom: 10px;
  transition: all 0.3s linear;
}

.details-block-list__item:hover { 
 transform: scaleY(1.05);
 border-top-color: rgb(226, 219, 219);
 border-bottom-color: rgb(226, 219, 219);
 border-right-color: rgb(226, 219, 219);
}

.details-block-list__item:hover .link-preview {
 font-weight: 600;
}

.details-block-list__item-marker {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translateY(-50%);
  z-index: 9999;
}

.favorite-item {
  border-left: 3px solid #d9223d
}

.details-block-list__item .link-preview {
  cursor: pointer;
  color: #d9223d !important;
  font-weight: 600;
}

.details-block-list__item a.link-preview {
  cursor: pointer;
  color: #d9223d;
  font-weight: 600;
}

.details-block-list__item:hover .details-block-list__item-actions {
  opacity: 1;
}

.details-block-list__item-actions {
  display: flex;
  align-self: flex-end;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.3s linear;
}

.details-block-list__item-text {
  max-width: 275px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 20px;
}

.details-block-list__item-time {
  color: #d3ac13 !important;
}

.details-block-list__item .custom-item-title {
  color: #d3ac13 !important;
}

.details-block-list__item-marker {
  margin-right: 5px;
}
</style>
