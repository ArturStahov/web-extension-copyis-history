<script setup lang="ts">
import { storageDemo } from '~/logic/storage'
import { sendMessage } from 'webext-bridge/popup'


function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function activatedExtension() {
  await activateContentScript();
  await closePopup();
}

async function activateContentScript() {
  let tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  console.log('START EXTENSION');
  const activeTabId = tabs[0]?.id || 0;
  await sendMessage('activate-extension-event', { activate: true }, { context: 'content-script', tabId: activeTabId }); // send to content script
  await sendMessage('activate-extension-event', { activate: true, tabId: activeTabId }, "background"); // send to background script
}

// TODO: INFO: close extension popup
async function closePopup() {
  const window = await browser.windows.getLastFocused();
  browser.extension.getViews({ type: 'popup', windowId: window.id }).forEach(w => w.close());
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>Popup</div>
    <SharedSubtitle />

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <button class="btn mt-2" @click="activatedExtension">
      Start
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>
