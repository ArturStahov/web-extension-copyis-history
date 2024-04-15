<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'save-edit', payload: any): void,
}>();

const props = defineProps({
  sizeStorage: {
    type: Number,
    default: 0
  },
});

const { sizeStorage } = toRefs(props);



onMounted(() => {
  
})


</script>

<template>
  <div class="memory-main">
    <span class="memory-size text"> {{ `Current usage: ${sizeStorage} / 10100700 bytes` }}</span>

  </div>
</template>

<style>
.memory-main {
  padding: 30px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}
</style>
