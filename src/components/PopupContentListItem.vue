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
  },
  isCustomRecordsList: {
    type: Boolean,
    default: false
  }
});

const { item } = toRefs(props);

const hoverText = ref<boolean>(false);
const expanded = ref<boolean>(false);
const listItemElement = ref<any>(null)

function handlerStartHoverText(event: any) {
  const rect = listItemElement.value?.getBoundingClientRect();

  hoverText.value = true;
  if (item.value?.value?.length > 46) {
    emit('preview-tooltip', { value: getTooltipText(), enable: true, position: rect?.top });
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

function handlerPin(item: any) {
  if (!item.pin) {
    emit('details-list-action', { action: 'addPin', item })
  } else {
    emit('details-list-action', { action: 'removePin', item })
  }
}

function handlerClickLinkPreview(link: string) {
  if (!link) {
    return;
  }
  window.open(link, '_blank');
}

function handlerAction(type: string) {
  emit('preview-tooltip', { value: '', enable: false, position: '' });
  emit('details-list-action', { action: type, item: item.value })
}

function toggleExpand() {
  expanded.value = !expanded.value;
}

function getItemHoverValue(item: any) {
  if (item.location) {
    return item.location;
  }

  if (item.action === 'custom-item') {
    return item.title ? item.title : 'EMPTY TITLE'
  }

  return item.value;
}

function isCodeContent(): boolean {
  const value = item.value?.value || '';
  return /[{}\[\];=>]/.test(value) || value.includes('function') || value.includes('const ') || value.includes('import ');
}

function isLink(): boolean {
  const value = item.value?.value || '';
  return value.startsWith('http') || value.startsWith('www.');
}

function getSourceIcon(): string {
  if (item.value?.location) {
    if (item.value.location.includes('github') || item.value.location.includes('git')) return 'code';
    if (item.value.location.includes('terminal') || item.value.location.includes('bash')) return 'terminal';
    if (item.value.location.includes('mail')) return 'email';
    return 'language';
  }
  if (isCodeContent()) return 'code';
  return 'description';
}

function getSourceLabel(): string {
  if (item.value?.location) {
    try {
      const url = new URL(item.value.location);
      return url.hostname.replace('www.', '');
    } catch {
      return item.value.location;
    }
  }
  return '';
}

onMounted(() => {
})
</script>

<template>
  <div
    ref="listItemElement"
    @mouseover="handlerStartHoverText"
    @mouseleave="handlerEndHoverText"
    class="group relative flex flex-col bg-surface-container rounded-xl border border-transparent hover:border-outline-variant hover:bg-surface-container-high transition-all duration-200"
    :class="{ 'card-pinned': item.pin && isCustomRecordsList, 'card-favorite': item.favorite && !isFavoriteList }"
  >
    <div class="p-item-padding">
      <!-- Header: Source + Time -->
      <div class="flex justify-between items-start gap-inner-gap mb-1">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <span class="i-mdi-code text-on-surface-variant text-[16px] shrink-0" v-if="getSourceIcon() === 'code'"></span>
          <span class="i-mdi-language text-on-surface-variant text-[16px] shrink-0" v-else-if="getSourceIcon() === 'language'"></span>
          <span class="i-mdi-email-outline text-on-surface-variant text-[16px] shrink-0" v-else-if="getSourceIcon() === 'email'"></span>
          <span class="i-mdi-console text-on-surface-variant text-[16px] shrink-0" v-else-if="getSourceIcon() === 'terminal'"></span>
          <span class="i-mdi-file-document-outline text-on-surface-variant text-[16px] shrink-0" v-else></span>

          <p class="font-mono-sm text-mono-sm text-on-surface-variant truncate">
            {{ item.value?.title ? item.value.title : getSourceLabel() || (item.value?.value?.slice(0, 50) + (item.value?.value?.length > 50 ? '...' : '')) }}
          </p>
        </div>
        <span class="font-label-sm text-label-sm text-on-surface-variant shrink-0">
          {{ item.value?.time || item.time }}
        </span>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0 mt-1">
        <!-- Custom item with title -->
        <p v-if="item.value?.title || item.title" class="font-label-sm text-primary truncate mb-1">
          {{ item.value?.title || item.title }}
        </p>

        <!-- Code content -->
        <div v-if="isCodeContent() && !expanded" class="font-mono-sm text-mono-sm text-on-background bg-surface-container-lowest p-2 rounded border border-outline-variant/20 line-clamp-2">
          {{ item.value?.value || item.value }}
        </div>

        <!-- Regular text content -->
        <p v-else class="font-body-sm text-body-sm text-on-background" :class="expanded ? '' : 'line-clamp-2'">
          {{ item.value?.value || item.value }}
        </p>
      </div>

      <!-- Footer: Expand + Actions -->
      <div class="flex justify-between items-center mt-2">
        <button
          class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          @click="toggleExpand"
        >
          <span class="i-mdi-chevron-down text-[18px] transition-transform duration-200" :class="{ 'rotate-180': expanded }"></span>
          <span class="text-label-sm">{{ expanded ? 'Less' : 'More' }}</span>
        </button>

        <div class="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <!-- Pin button (custom records only) -->
          <button
            v-if="isCustomRecordsList"
            class="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-primary-container/20"
            :title="item.pin ? 'Unpin' : 'Pin'"
            @click="() => handlerPin(item)"
          >
            <span class="i-mdi-pin text-[18px]" :class="{ 'text-primary': item.pin }"></span>
          </button>

          <!-- Copy button -->
          <button
            class="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-primary-container/20"
            title="Copy"
            @click="() => handlerAction('copy')"
          >
            <span class="i-mdi-content-copy text-[18px]"></span>
          </button>

          <!-- Favorite button -->
          <button
            class="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-primary-container/20"
            :title="item.favorite ? 'Remove from favorites' : 'Add to favorites'"
            @click="() => handlerFavorite(item)"
          >
            <span class="i-mdi-star text-[18px]" :class="{ 'text-primary': item.favorite }"></span>
          </button>

          <!-- Edit button -->
          <button
            class="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-primary-container/20"
            title="Edit"
            @click="() => handlerAction('edit')"
          >
            <span class="i-mdi-pencil text-[18px]"></span>
          </button>

          <!-- Delete button -->
          <button
            class="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-full hover:bg-error-container/20"
            title="Delete"
            @click="() => handlerAction('delete')"
          >
            <span class="i-mdi-delete text-[18px]"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-pinned {
  border-left: 3px solid #ef4444;
}

.card-favorite {
  border-left: 3px solid #d9223d;
}
</style>
