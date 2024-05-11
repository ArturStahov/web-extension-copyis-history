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
    <p class="help-screen__section-title">HELP INFORMATION</p>
    <p class="text">About copybook:</p>

    <iframe width="400" height="200" src="https://www.youtube.com/embed/V1HcJ7BKCkc"
      title="Copybook - a powerful tool for saving and managing copied text" frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture;"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    <p class="text">Recommendation:</p>

    <ul class="recommendation-list">
      <li class="text">
        - For activate "paste popup window" select text field in page and use combination left shift button + left mouse
        click
      </li>
      <li class="text">
        - link in youtube video: <a class="recommendation-list-link"
          href="https://www.youtube.com/watch?v=V1HcJ7BKCkc&ab_channel=A.Stakhov" target="_blank">link</a>
      </li>
      <li class="text">
        - for contact: <a class="recommendation-list-link" href="mailto:stakhov.artur@gmail.com"
          target="_blank">stakhov.artur@gmail.com</a>
      </li>
    </ul>


  </div>
</template>

<style>
.help-screen {
  padding: 15px 0px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.help-screen .recommendation-list {
  list-style: none !important;
}

.help-screen .recommendation-list li {
  margin-bottom: 10px !important;
}

.help-screen .recommendation-list-link {
  text-decoration: none !important;
  color: #e7ab2a !important;
  font-weight: 600 !important;
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
