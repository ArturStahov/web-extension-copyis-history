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
  details: {
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

const {hidePopup, details } = toRefs(props);

function close() {
  emit('close');
}

function hidePopupToShortButton() {
  emit('hide-popup-to-button');
}

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
    <div class="header">
      <button @click="hidePopupToShortButton" class="icon-button flex rounded-full shadow cursor-pointer border-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#0d9488"
            d="m12.05 19l2.85-2.825l-2.85-2.825L11 14.4l1.075 1.075q-.7.025-1.362-.225t-1.188-.775q-.5-.5-.763-1.15t-.262-1.3q0-.425.113-.85t.312-.825l-1.1-1.1q-.425.625-.625 1.325T7 12q0 .95.375 1.875t1.1 1.65q.725.725 1.625 1.088t1.85.387l-.95.95zm4.125-4.25q.425-.625.625-1.325T17 12q0-.95-.363-1.888T15.55 8.45q-.725-.725-1.638-1.075t-1.862-.35L13 6.05L11.95 5L9.1 7.825l2.85 2.825L13 9.6l-1.1-1.1q.675 0 1.375.263t1.2.762q.5.5.763 1.15t.262 1.3q0 .425-.112.85t-.313.825zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22" />
        </svg>
      </button>
      <button class="popup-button-close flex w-4 h-4 rounded-full shadow cursor-pointer border-none"
        bg="teal-600 hover:teal-700" @click="close">
        X
      </button>
    </div>

    <!-- MAIN SCREEN -->
    <div v-if="details" class="popup-main">
     
      <div class="wrapper-information">
        <div class="action-panels">
          <button class="button-default copy-style-button shadow cursor-pointer border-none" @click="()=>{}"
            bg="teal-600 hover:teal-700">
            copy style
          </button>
        </div>
      </div>
    </div>

    <!-- START SCREEN -->
    <div v-if="!details" class="start-screen">
      <span class="start-screen-title text">Copy some text</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <g fill="#ffd060">
          <path
            d="M8.55 10.55a1 1 0 1 1-2 0a1 1 0 0 1 2 0m2 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
          <path fill-rule="evenodd"
            d="M16.207 4.893a8.001 8.001 0 0 1 .662 10.565c.016.013.03.027.045.042l4.243 4.243a1 1 0 0 1-1.414 1.414L15.5 16.914a.933.933 0 0 1-.042-.045A8.001 8.001 0 0 1 4.893 4.893a8 8 0 0 1 11.314 0m-9.9 9.9a6 6 0 1 0 8.486-8.485a6 6 0 0 0-8.485 8.485"
            clip-rule="evenodd" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style>
.popup-content {
  pointer-events: all !important;
  position: fixed;
  top: 5px;
  right: 5px;
  width: 225px;
  height: 300px;
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
  justify-content: space-between;
  align-items: center;
}

.popup-button-close {
  height: auto !important;
  width: auto !important;
  margin-left: auto;
  pointer-events: all !important;
  justify-content: center;
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
  width: 71px;
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


.button-default {
  display: flex;
  height: auto !important;
  width: auto !important;
  pointer-events: all !important;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: #0a0a0a;
  font-size: 12px;
}

.icon-button {
  margin-left: auto;
  width: max-content;
  height: auto;
  background: none;
}

.action-panels {
  position: absolute;
  bottom: 10px;
  display: flex;
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
