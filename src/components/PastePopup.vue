<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, reactive, defineProps } from 'vue'

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

function handlerPase() {
  emit('paste-value', { value: 'test paste value' })
}

const { visible, detailsItems } = toRefs(props);

</script>

<template>
  <div class="paste-popup"
    :style="`opacity:${visible};display: flex;left: ${position?.left}px; top: ${position?.top}px`">

    <div class="paste-popup-wrapper-information">
      <ButtonComponent class="save-button" :type-button="'text'" @click="handlerPase">
        PASTE
      </ButtonComponent>
    </div>
  </div>
</template>

<style>
.paste-popup {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  position: absolute;
  width: 250px;
  color: #ffffff;
  font-size: 14px;
  background-color: #363636;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px #ffffff57;
  z-index: 2147483647;
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.paste-popup-wrapper-information {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 10px;
}

</style>
