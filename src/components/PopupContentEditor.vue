<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'save-edit', payload: any): void,
}>();

const props = defineProps({
  editItem: {
    type: Object,
    default() {
      return null
    }
  },
});

const { editItem } = toRefs(props);

const editValue = ref<any>(null);

onMounted(() => {
  if (editItem?.value) {
    editValue.value = editItem?.value?.value;
  } else {
    editValue.value = ''
  }
})

function handlerSubmit() {
  if (editItem?.value?.value && editItem?.value?.value !== editValue.value) {
    const payload = {
      ...editItem.value,
      value: editValue.value
    }
    emit('save-edit', payload);
  }
}

function getItemActionValue(action: string) {
  if (action === 'parse-image') {
    return 'PARSE FROM IMAGE';
  }
  if (action === 'custom-item') {
    return 'CUSTOM ITEM'
  }
  return '';
}

function handlerClickLinkPreview(link: string) {
  if (!link) {
    return;
  }
  window.open(link, '_blank');
  console.log('LINK CLICK', link)
}

</script>

<template>
  <div class="content-editor">
    <p class="content-editor__section-title">Details</p>
    <ul class="content-editor_item-info-list">
      <li v-if="editItem.location" @click="handlerClickLinkPreview(editItem.location)"
        class="content-editor_item-info-list-item">
        <span class="list-item_title text"> Resource link: </span><span
          class="list-item_value text list-item_value-link">
          {{ editItem.location }}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="none" stroke="#0d9488" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 5H8.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C5 6.52 5 7.08 5 8.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h7.606c1.118 0 1.677 0 2.104-.218c.377-.192.683-.498.875-.874c.218-.428.218-.987.218-2.105V14m1-5V4m0 0h-5m5 0l-7 7" />
        </svg>
      </li>
      <li v-if="editItem.action" class="content-editor_item-info-list-item">
        <span class="list-item_title text">Resource: </span><span
          class="list-item_value text list-item_value-parse-image">
          {{ getItemActionValue(editItem.action) }}
        </span>
      </li>
      <li class="content-editor_item-info-list-item">
        <span class="list-item_title text">Create date: </span><span class="list-item_value text">
          {{ editItem.key }}
        </span>
      </li>
      <li class="content-editor_item-info-list-item">
        <span class="list-item_title text">Create time: </span><span class="list-item_value text">
          {{ editItem.time }}
        </span>
      </li>
    </ul>

    <p class="content-editor__section-title">Editor</p>

    <textarea class="content-editor__textarea" v-model="editValue">

    </textarea>
    <ButtonComponent class="save-button" :type-button="'text'" @click="handlerSubmit">
      SAVE
    </ButtonComponent>

  </div>
</template>

<style>
.content-editor {
  padding: 15px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 88%;
}

@media screen and (max-height: 766px) {
  .content-editor {
    height: 76%;
  }
}

.content-editor .content-editor_item-info-list {
  list-style: none;
  width: 100%;
  padding-left: 18px;
}

.content-editor .content-editor_item-info-list-item {
  list-style: none;
  display: flex;
  margin-bottom: 5px;
}

.content-editor .list-item_title {
  color: #0d9488 !important;
  font-weight: 600 !important;
  margin-right: 5px !important;
}

.content-editor .list-item_value {}

.content-editor .list-item_value-link {
  cursor: pointer;
  max-width: 350px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #d9223d !important;
}

.content-editor .list-item_value-parse-image {
  color: #e7ab2a !important;
}

.content-editor .content-editor__section-title {
  margin-top: 0;
  margin-bottom: 5px;
  color: #e7ab2a;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
}

.content-editor .content-editor__textarea {
  background: transparent;
  width: 90%;
  height: 75%;
  margin-bottom: 15px;
  resize: none;
  border: 1px solid #8b888842;
  font-size: 14px;
  line-height: 1.2;
  color: #ffffff;
  padding: 5px;
  word-break: break-all;
}

.content-editor .content-editor__textarea:focus {
  outline: none !important;
}

.content-editor .save-button {
  width: 125px;
  height: 25px;
}

.content-editor .content-editor__textarea::-webkit-scrollbar {
  width: 5px !important;
}

.content-editor .content-editor__textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
  opacity: 0.5 !important;
}

.content-editor .content-editor__textarea::-webkit-scrollbar-thumb {
  background-color: #ffd060 !important;
  outline: 1px solid slategrey !important;
}
</style>
