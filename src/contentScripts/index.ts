/* eslint-disable no-console */
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
let init = false;

(() => {
  onMessage('activated-new-tab', async() => {
    console.log('ACTIVATE EXTENSION 1')
    if (init) {
      return;
    }
    mountContentPopup();
  })

  onMessage('activate-extension-event', async() => {
    console.log('ACTIVATE EXTENSION 2')
    if (init) {
      await sendMessage('retry-init', {}, "background");
      return;
    }
    mountContentPopup();
  })
})()


function mountContentPopup() {
  const container = document.createElement('div')
  container.id = `${__NAME__ + Date.now()}`
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  const app = createApp(App)
  setupApp(app)
  app.mount(root);
  init = true;
}