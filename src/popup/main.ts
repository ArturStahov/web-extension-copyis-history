import { sendMessage } from 'webext-bridge/popup'

async function activateContentScript() {
  let tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  console.log('=== copybook activated ===');
  const activeTabId = tabs[0]?.id || 0;
  await sendMessage('activate-extension-event', { activate: true }, { context: 'content-script', tabId: activeTabId }); // send to content script
  await sendMessage('activate-extension-event', { activate: true, tabId: activeTabId }, "background"); // send to background script
}

activateContentScript();