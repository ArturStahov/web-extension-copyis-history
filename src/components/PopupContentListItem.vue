<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs, computed } from 'vue';

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
  },
  isCustomRecordsList: {
    type: Boolean,
    default: false
  }
});

const { item } = toRefs(props);

const isExpanded = ref(false);

function handlerFavorite(item: any) {
  if (!item.favorite) {
    emit('details-list-action', { action: 'addToFavorite', item })
  } else {
    emit('details-list-action', { action: 'removeFavorite', item })
  }
}

function handlerPin(item: any) {
  if (!item.pin) {
    emit('details-list-action', { action: 'addPin', item })
  } else {
    emit('details-list-action', { action: 'removePin', item })
  }
}

function handlerAction(type: string) {
  emit('details-list-action', { action: type, item: item.value })
}

function handlerEdit() {
  emit('details-list-action', { action: 'edit', item: item.value })
}

function handlerClickLinkPreview(link: string) {
  if (!link) return;
  window.open(link, '_blank');
}

function isLinkItem(item: any) {
  return item.location && item.action !== 'custom-item';
}

onMounted(() => {
})

</script>

<template>
  <li class="card group relative flex flex-col p-item-padding bg-surface-container rounded-lg border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200"
    :class="{ 'favorite-card': item.favorite && !isFavoriteList, 'pin-card': item.pin && isCustomRecordsList }">

    <!-- Top row: source/time -->
    <div class="flex justify-between items-start gap-inner-gap mb-1">
      <div class="flex-1 min-w-0">
        <p v-if="isLinkItem(item)"
          class="font-label-sm text-label-sm text-primary truncate cursor-pointer hover:underline"
          @click="() => handlerClickLinkPreview(item.location)">
          {{ item.location || item.title || item.value }}
        </p>
        <p v-else class="font-label-sm text-label-sm text-primary truncate">
          {{ item.title || item.value }}
        </p>
      </div>
      <span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">
        {{ item.time }}
      </span>
    </div>

    <!-- Content area with expand/collapse -->
    <div class="flex-1 min-w-0">
      <p v-if="item.location" class="font-mono-sm text-mono-sm text-on-background transition-all duration-300"
        :class="isExpanded ? 'line-clamp-none' : 'line-clamp-2'">
        {{ item.value }}
      </p>
      <p v-else class="font-body-sm text-body-sm text-on-background transition-all duration-300"
        :class="isExpanded ? 'line-clamp-none' : 'line-clamp-2'">
        {{ item.value }}
      </p>
    </div>

    <!-- Bottom row: expand button + actions -->
    <div class="flex justify-between items-center mt-2">
      <!-- Expand/collapse toggle -->
      <button
        v-if="item.value && item.value.length > 80"
        class="bg-transparent border-none text-on-surface-variant hover:text-primary flex items-center gap-1 text-label-sm p-0 cursor-pointer transition-colors"
        @click="isExpanded = !isExpanded">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" v-if="isExpanded" />
          <path fill="currentColor" d="m12 8.4l-6 6L7.4 16l4.6-4.6L16.6 16L18 14.6z" v-else />
        </svg>
        <span>{{ isExpanded ? 'Less' : 'More' }}</span>
      </button>
      <div v-else></div>

      <!-- Action buttons - ghost icon buttons -->
      <div class="flex items-center gap-1 shrink-0">
        <!-- Pin button (custom records only) -->
        <button v-if="isCustomRecordsList"
          class="bg-transparent border-none shadow-none p-1 text-on-surface-variant cursor-pointer flex items-center justify-center transition-colors"
          :class="item.pin ? 'text-primary' : 'hover:text-primary'"
          @click="() => handlerPin(item)">
          <svg v-if="!item.pin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15 12.423L16.577 14v1H12.5v5l-.5.5l-.5-.5v-5H7.423v-1L9 12.423V5H8V4h8v1h-1z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m3 3l18 18M15 4.5l-3.249 3.249m-2.57 1.433L7 10l-1.5 1.5l7 7L14 17l.82-2.186m1.43-2.563L19.5 9M9 15l-4.5 4.5M14.5 4L20 9.5" />
          </svg>
        </button>

        <!-- Favorite button - NOT favorited = standard star (add), favorited = star-minus (remove) -->
        <button class="bg-transparent border-none shadow-none p-1 text-on-surface-variant cursor-pointer flex items-center justify-center transition-colors"
          :class="item.favorite ? 'text-tertiary' : 'hover:text-tertiary'"
          @click="() => handlerFavorite(item)">
          <!-- NOT favorited: Standard outline star = "Add to favorites" -->
          <svg v-if="!item.favorite" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.8 21z" />
          </svg>
          <!-- Favorited: Filled star with minus = "Remove from favorites" -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="m5.8 21l1.6-7L2 9.2l7.2-.6L12 2l2.8 6.6l7.2.6l-3.2 2.8H18c-3.1 0-5.6 2.3-6 5.3zm8.2-4v2h8v-2z" />
          </svg>
        </button>

        <!-- Edit button - ALWAYS visible on ALL tabs -->
        <button class="bg-transparent border-none shadow-none p-1 text-on-surface-variant cursor-pointer flex items-center justify-center transition-colors hover:text-primary"
          @click="handlerEdit">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z" />
          </svg>
        </button>

        <!-- Copy button -->
        <button class="bg-transparent border-none shadow-none p-1 text-on-surface-variant cursor-pointer flex items-center justify-center transition-colors hover:text-primary"
          @click="() => handlerAction('copy')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" />
          </svg>
        </button>

        <!-- Delete button -->
        <button class="bg-transparent border-none shadow-none p-1 text-on-surface-variant cursor-pointer flex items-center justify-center transition-colors hover:text-error"
          @click="() => handlerAction('delete')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>

<style>
.card.favorite-card {
  border-left: 3px solid #ff5252;
  background-color: rgba(255, 82, 82, 0.06) !important;
}

.card.pin-card {
  border-left: 3px solid #57f1db;
  background-color: rgba(87, 241, 219, 0.05) !important;
}
</style>
