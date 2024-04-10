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
    <span class="text details-block-list__item-text">
      {{ item.value }}
    </span>
    <span class="text details-block-list__item-time">
      {{ item.time }}
    </span>
    <ButtonComponent data-type="delete" @click="() => { emit('details-list-action', { action: 'delete', item })}">
      <div class="i-majesticons:delete-bin w-24px h-24px" style="color: #0d9488;"></div>
    </ButtonComponent>
    <ButtonComponent data-type="edit" @click="() => emit('details-list-action', { action: 'edit', item})">
      <div class="i-mdi:file-edit w-24px h-24px" style="color: #0d9488;"></div>
    </ButtonComponent>
    <ButtonComponent data-type="copy" @click="() => emit('details-list-action', { action: 'copy', item})">
      <div class="i-fluent:copy-20-filled w-24px h-24px" style="color: #0d9488;"></div>
    </ButtonComponent>
  </li>
</template>

<style>

</style>
