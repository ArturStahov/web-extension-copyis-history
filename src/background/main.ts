import { onMessage, sendMessage } from 'webext-bridge/background'
import uniqid from 'uniqid';

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

onMessage('set-notification', (message) => {
  const {data} = message
  console.log('set-notification', data)
  Notification(data as any);
})

onMessage('save-copy-data', async(message) => {
  const { data } = message;
  const saveArray: any[] = [...storageCopy.value];

  const timeOptions: any = {
    hour12: false,
    hour: "numeric",
    minute: "numeric"
  };
  const keyOptions: any = {
    year: "numeric",
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const key = new Date().toLocaleString("en-US", keyOptions);
  const time = new Date().toLocaleString("en-US", timeOptions);

  const newDataItem = {
    ...data as any,
    key,
    time,
    id: uniqid(),
  }

  const parentIdx = saveArray.findIndex(parentItem => parentItem.key === key);

  if (parentIdx === -1) {
    const parent = {
      key,
      items:[newDataItem],
      id: `${uniqid()}-${Date.now()}`,
    }
    saveArray.push(parent);
  } else {
    const parentItem = saveArray[parentIdx];
    parentItem.items.push(newDataItem);
    saveArray.splice(parentIdx, 1, parentItem);
  }
  
  (storageCopy.value as any) = saveArray;
  const usedSize = getStringMemorySize(JSON.stringify(saveArray));
  console.log('save-copy-data', newDataItem,'usedSize>>>>', usedSize)
  browser.action.setBadgeText({ text: 'ON' });
  return {
    data: saveArray,
    size: usedSize,
  }
})


onMessage('delete-item', (message: any) => {
  const { data } = message;
  console.log('delete-item', data)

  const saveData = [...storageCopy.value];
  const parentIdx = saveData.findIndex((parent: any) => parent.key === data?.key);
  const parentItem = saveData[parentIdx] as any;
  
  if(parentItem) { 
    const deleteIdx = parentItem.items?.findIndex((el: any)=> el.id === data.id);
    parentItem.items.splice(deleteIdx, 1);

    if (parentItem.items.length === 0) {
      saveData.splice(parentIdx, 1)
    }

    storageCopy.value = saveData;
    const usedSize = getStringMemorySize(JSON.stringify(saveData));

    Notification({
      title: 'Delete success!',
      message: `Delete value: ${data.value?.split(0,10)}...`
    })

    return {
      data: saveData,
      size: usedSize,
    }
  } else {
    console.log('ERROR: delete-item Not-found parent')
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

function Notification(data: { title: string, message: string }) {
  browser.notifications.create('notification1', {
    type: 'basic',
    iconUrl: '/assets/success_alert.png',
    title: data.title,
    message: data.message,
    priority: 0
  });
}