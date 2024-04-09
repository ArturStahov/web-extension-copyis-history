<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'get-font-details',): void,
  (e: 'hide-popup-to-button',): void
}>();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  detailsItems: {
    type: Object,
    default() {
      return null
    }
  },
  hidePopup: {
    type: Boolean,
    default: false
  },
});

const { hidePopup, detailsItems } = toRefs(props);


async function copyValue(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.log('failed to copy to clipboard. error=' + error);
  }
}


onMounted(() => {
})

</script>

<template>
  <div class="popup-content text-gray-800 shadow w-max h-min" p="x-2 y-2" m="y-auto r-2" v-show="show && !hidePopup">

    <PopupContentHeader @hide-popup-to-button="emit('hide-popup-to-button')" @close="emit('close')" />

    <!-- MAIN SCREEN -->
    <div v-if="detailsItems && detailsItems.length" class="popup-main">


    </div>

    <!-- START SCREEN -->
    <div v-if="!detailsItems || !detailsItems?.length" class="start-screen">
      <span class="start-screen-title text">Copy some text</span>
      <div class="i-fluent:book-pulse-20-filled w-48px h-48px" style="color: #ffd060;"></div>
    </div>
  </div>
</template>

<style>
.popup-content {
  pointer-events: all !important;
  position: fixed;
  top: 5px;
  right: 5px;
  width: 500px;
  height: 75%;
  background-color: #363636;
  -webkit-box-shadow: 1px 1px 5px 1px #ffffff57;
  box-shadow: 1px 1px 5px 1px #ffffff57;
  border: none;
  border-radius: 5px;
  opacity: 0.95;
  z-index: 2147483645;
}

.popup-content .header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


.popup-content .text {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.popup-content .wrapper-information {
  width: 100%;
}


.start-screen {
  width: 100px;
  height: 50px;
  position: absolute;
  left: 53%;
  top: 45%;
  transform: translate(-50%, -50%);
  opacity: .6;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.start-screen-title {
  margin-bottom: 5px;
}

.details-wrapper {
  overflow: hidden;
  height: 270px;
}

.details-list {
  height: 215px;
  overflow-y: auto;
  padding-left: 10px;
  list-style: none;
  padding-right: 10px;
}


.details-list::-webkit-scrollbar {
  width: 5px;
}

.details-list::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  opacity: 0.5;
}

.details-list::-webkit-scrollbar-thumb {
  background-color: #ffd060;
  outline: 1px solid slategrey;
}
</style>
