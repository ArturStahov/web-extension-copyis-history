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

onMounted(() => {
})

</script>

<template>
  <li class="details-block-list__item">
    <div class="details-block-list__item-marker i-octicon:dot-16 w-16px h-16px" style="color: #d3ac13;"></div>

    <span class="text details-block-list__item-text">
      {{ item.value }}
    </span>

    <div class="details-block-list__item-actions">
      <ButtonComponent :tooltip="'delete'" data-type="delete"
        @click="() => { emit('details-list-action', { action: 'delete', item })}">
        <div class="i-majesticons:delete-bin w-24px h-24px" style="color: #0d9488;"></div>
      </ButtonComponent>
      <ButtonComponent :tooltip="'edit'" data-type="edit"
        @click="() => emit('details-list-action', { action: 'edit', item})">
        <div class="i-mdi:file-edit w-24px h-24px" style="color: #0d9488;"></div>
      </ButtonComponent>
      <ButtonComponent :tooltip="'copy'" data-type="copy"
        @click="() => emit('details-list-action', { action: 'copy', item})">
        <div class="i-fluent:copy-20-filled w-24px h-24px" style="color: #0d9488;"></div>
      </ButtonComponent>
    </div>

    <span class="text details-block-list__item-time">
      {{ item.time }}
    </span>
  </li>
</template>

<style>
.details-block-list__item {
  display: flex;
  text-decoration: none;
  list-style: none;
  align-items: center;
  margin-bottom: 10px;
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
