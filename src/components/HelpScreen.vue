<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'save-custom-item', payload: any): void,
}>();

onMounted(() => {

})

</script>

<template>
  <div class="help-screen">
    <p class="help-screen__section-title">HELP INFO</p>

    

  </div>
</template>

<style>
.help-screen {
  padding: 15px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.help-screen .help-screen__section-title {
  margin-top: 0;
  margin-bottom: 5px;
  color: #e7ab2a;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
}

</style>
