import { onMessage, sendMessage } from 'webext-bridge/background'

import { storageCopy } from '~/logic/storage'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}


browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let currentActiveTabId = 0

browser.tabs.onActivated.addListener(async () => {
 try {
   console.log('activated new tab')

   let tabs = await browser?.tabs?.query({
     active: true,
     currentWindow: true
   });

   const activeTabId = tabs[0]?.id || 0;
   currentActiveTabId = activeTabId;
   await sendMessage('activated-new-tab', { tab: activeTabId }, { context: 'content-script', tabId: activeTabId })
 } catch (error: any) {
   console.log('ERROR:', error?.message);
 }
})

browser.tabs.onUpdated.addListener(async () => {
 try {
   console.log('activated new tab', currentActiveTabId)
   await sendMessage('activated-new-tab', { tab: currentActiveTabId }, { context: 'content-script', tabId: currentActiveTabId })
 } catch (error: any) {
   console.log('ERROR:', error?.message);
 }
})

onMessage('get-init-copy-data', (message) => {
  console.log('get-init-copy-data', message)
  const data = storageCopy.value;
  const usedSize = getStringMemorySize(JSON.stringify(data));
  
  return {
    data,
    size: usedSize,
  }
})

onMessage('save-copy-data', async(message) => {
  const { data, sender } = message;
  const saveArray: any[] = [...storageCopy.value];
 
  const dateOptions: any = {
    year: "numeric",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour12: false,
    hour: "numeric", 
    minute: "numeric"
  };
  const newData = {
    ...data as any,
    created_at: new Date().toLocaleString("en-US", dateOptions),
  }
  saveArray.push(newData);
  (storageCopy.value as any) = saveArray;
  const usedSize = getStringMemorySize(JSON.stringify(saveArray));
  console.log('save-copy-data', newData,'usedSize>>>>', usedSize)
  return {
    data: newData,
    size: usedSize,
  }
})

onMessage('retry-init', async(message) => {
  try {
    let tabs = await browser?.tabs?.query({
      active: true,
      currentWindow: true
    });
    console.log('START EXTENSION');
    const activeTabId = tabs[0]?.id || 0;
    await sendMessage('event-retry', { tab: activeTabId }, { context: 'content-script', tabId: activeTabId })
  } catch (error: any) {
    console.log('ERROR:', error?.message)
  }
})

onMessage('get-copy-data', (message) => {
  console.log('get-copy-data', message)
  const data = storageCopy.value;
  const usedSize = getStringMemorySize(JSON.stringify(data));

  return {
    data,
    size: usedSize,
  }
})

function getStringMemorySize(s: string) {
  return new Blob([s]).size;
}