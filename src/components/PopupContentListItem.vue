<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'details-list-action', payload: { action: string, item: any }): void,
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
  }
});

const { item } = toRefs(props);

const hoverText = ref<boolean>(false);

function handlerStartHoverText() {
  if(item.value?.value?.length > 46) {
    hoverText.value = true;
  }
}

function getTooltipText() {
  return `${item.value?.value?.slice(0, 500)}...`
}

function handlerEndHoverText() {
  hoverText.value = false;
}

onMounted(() => {
})

</script>

<template>
  <li class="details-block-list__item">
    <!-- TOOLTIP -->
    <div v-if="hoverText" class="details-block-list__item-tooltip text">
      {{ getTooltipText() }}
      <svg class="details-block-list__item-tooltip-arrow" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
        viewBox="0 0 24 24">
        <path fill="#2b2b2b"
          d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886" />
      </svg>
    </div>

    <svg class="details-block-list__item-marker" xmlns=" http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 16 16">
      <path fill="#d3ac13" d="M4 8a4 4 0 1 1 8 0a4 4 0 0 1-8 0m4-2.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5" />
    </svg>

    <span @mouseover="handlerStartHoverText" @mouseleave="handlerEndHoverText"
      class="text details-block-list__item-text">
      {{ item.value }}
    </span>

    <div class="details-block-list__item-actions">
      <ButtonComponent :tooltip="'delete'" data-type="delete"
        @click="() => { emit('details-list-action', { action: 'delete', item })}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path fill="#0d9488" d="M9 7h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z" />
            <path stroke="#0d9488" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7h-2M4 7h2m0 0h12M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7m-9-.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5v0" />
          </g>
        </svg>
      </ButtonComponent>
      <ButtonComponent :tooltip="'edit'" data-type="edit"
        @click="() => emit('details-list-action', { action: 'edit', item})">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#0d9488"
            d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h4v-1.9l10-10V8l-6-6zm7 1.5L18.5 9H13zm7.1 9.5c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-2 1.8L12 20.9V23h2.1l6.1-6.1z" />
        </svg>
      </ButtonComponent>
      <ButtonComponent :tooltip="'copy'" data-type="copy"
        @click="() => emit('details-list-action', { action: 'copy', item})">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
          <path fill="#0d9488"
            d="M8.5 5.25A3.25 3.25 0 0 1 11.75 2h12A3.25 3.25 0 0 1 27 5.25v18a3.25 3.25 0 0 1-3.25 3.25h-12a3.25 3.25 0 0 1-3.25-3.25zM5 8.75c0-1.352.826-2.511 2-3.001v17.75a4.5 4.5 0 0 0 4.5 4.5h11.751a3.25 3.25 0 0 1-3.001 2H11.5A6.5 6.5 0 0 1 5 23.5z" />
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
  padding: 5px;
  display: flex;
  text-decoration: none;
  list-style: none;
  align-items: center;
  margin-bottom: 10px;
}

.details-block-list__item-tooltip {
  position: absolute;
  width: 380px;
  height: 140px;
  left: -425px;
  top: 50%;
  transform: translateY(-50%);
  background: #2b2b2b;
  border: 1px solid #8b888842;
  border-radius: 5px;
  padding: 10px;
  z-index: 999999999999;
}

.details-block-list__item-tooltip-arrow {
  position: absolute;
  z-index: 99999999;
  right: -37px;
  top: 50%;
  transform: translateY(-50%);
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

.details-block-list__item-marker {
  margin-right: 5px;
}
</style>
