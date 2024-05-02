import { onMessage, sendMessage } from 'webext-bridge/background'
import uniqid from 'uniqid';

import { storageCopy, optionsStorage } from '~/logic/storage'

const LIMIT_STORAGE = 10100700;

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

onMessage('get-options', (message) => {
  const options = optionsStorage.value;
  return options
})

onMessage('save-memory-options', (message: any) => {
  const { data } = message;
  const options = optionsStorage.value;
  const update = {
    ...options,
    memory: data
  }
  optionsStorage.value = update;
  return data
})

let currentActiveTabId = 0

browser.tabs.onActivated.addListener(async () => {
 try {
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
   await sendMessage('activated-new-tab', { tab: currentActiveTabId }, { context: 'content-script', tabId: currentActiveTabId })
 } catch (error: any) {
   console.log('ERROR:', error?.message);
 }
})

onMessage('get-init-copy-data', (message) => {
  const data = storageCopy.value;
  const usedSize = getStringMemorySize(JSON.stringify(data));
  
  return {
    data,
    size: usedSize,
  }
})

onMessage('set-notification', (message) => {
  const {data} = message
  Notification(data as any);
})

const handlerCreateItem = async (message: any) => {
  const { data } = message;
  const saveArray: any[] = JSON.parse(JSON.stringify(storageCopy.value));

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
      items: [newDataItem],
      id: `${uniqid()}-${Date.now()}`,
    }
    saveArray.push(parent);
  } else {
    const parentItem = saveArray[parentIdx];
    parentItem.items.push(newDataItem);
    saveArray.splice(parentIdx, 1, parentItem);
  }

  const usedSize = getStringMemorySize(JSON.stringify(saveArray));

  const autoClearEnable = optionsStorage.value?.memory?.['auto-clear-last'];

  if (usedSize >= LIMIT_STORAGE && !autoClearEnable) {
    Notification({
      title: 'ERROR save copy!',
      message: `The end storage memory limit! Please enable options auto-clear!`
    });
    return {
      data: storageCopy.value,
      size: getStringMemorySize(JSON.stringify(storageCopy.value)),
      error: { type: 'memory', message: 'end limit memory' }
    }
  }

  let needRemoveFavorite = false;

  if (usedSize >= LIMIT_STORAGE && autoClearEnable) {
    // CLEARED LAST ELEMENT 
    needRemoveFavorite = autoClearOldItems(saveArray);
  }

  if (needRemoveFavorite) {
    Notification({
      title: 'ERROR save copy!',
      message: `The end storage memory limit! Please remove some favorite!`
    });
    return {
      data: storageCopy.value,
      size: getStringMemorySize(JSON.stringify(storageCopy.value)),
      error: { type: 'memory', message: 'end limit memory, remove favorite!' }
    }
  }

  (storageCopy.value as any) = saveArray;

  if (data.action === 'parse-image') {
    Notification({
      title: 'Save success!',
      message: `Value: ${data.value?.split(0, 10)}...`
    })
  }
  if (data.action === 'custom-item') {
    Notification({
      title: 'Create success!',
      message: `Value: ${data.value?.split(0, 10)}...`
    })
  }
  browser.action.setBadgeText({ text: 'ON' });
  return {
    data: saveArray,
    size: usedSize,
  }

}

onMessage('save-custom-item', handlerCreateItem )

onMessage('save-copy-data', handlerCreateItem );

onMessage('save-parse-image', handlerCreateItem);

onMessage('delete-item', (message: any) => {
  const { data } = message;
  const saveData = JSON.parse(JSON.stringify(storageCopy.value));
  const parentIdx = saveData.findIndex((parent: any) => parent.key === data?.key);
  const parentItem = saveData[parentIdx] as any;
  
  if(parentItem) { 
    const deleteIdx = parentItem.items?.findIndex((el: any)=> el.id === data.id);
    if (deleteIdx === -1) {
      console.log('ERROR: not found delete item in db')
      return;
    }

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

onMessage('favorite', async (message: any) => {
  const { data } = message;
  const {item, action} = data

  const saveData = JSON.parse(JSON.stringify(storageCopy.value));
  const parentIdx = saveData.findIndex((parent: any) => parent.key === item?.key);
  const parentItem = saveData[parentIdx] as any;

  if (parentItem) {
    const editIdx = parentItem.items?.findIndex((el: any) => el.id === item.id);
    if (editIdx === -1) {
      console.log('ERROR: not found item in db')
      return;
    }
    const updated = {
      ...item,
      favorite: action === 'add',
    }
    parentItem.items.splice(editIdx, 1, updated);

    storageCopy.value = saveData;
    const usedSize = getStringMemorySize(JSON.stringify(saveData));

    Notification({
      title: action === 'add' ? 'Add to favorite success!' : 'Remove favorite success!',
      message: `value: ${item.value?.split(0, 10)}...`
    })

    return {
      data: saveData,
      size: usedSize,
    }
  } else {
    console.log('ERROR: item Not-found parent')
  }
})

onMessage('save-edit-item', async (message: any) => {
  const { data } = message;

  const saveData = JSON.parse(JSON.stringify(storageCopy.value));
  const parentIdx = saveData.findIndex((parent: any) => parent.key === data?.key);
  const parentItem = saveData[parentIdx] as any;

  if (parentItem) {
    const editIdx = parentItem.items?.findIndex((el: any) => el.id === data.id);
    if (editIdx === -1) {
      console.log('ERROR: not found edit item in db')
      return;
    }

    parentItem.items.splice(editIdx, 1, data);

    const usedSize = getStringMemorySize(JSON.stringify(saveData));

    const autoClearEnable = optionsStorage.value?.memory?.['auto-clear-last'];

    if (usedSize >= LIMIT_STORAGE && !autoClearEnable) {
      Notification({
        title: 'ERROR save copy!',
        message: `The end storage memory limit! Please enable options auto-clear!`
      });
      return {
        data: storageCopy.value,
        size: getStringMemorySize(JSON.stringify(storageCopy.value)),
        error: { type: 'memory', message: 'end limit memory' }
      }
    }

    let needRemoveFavorite = false;

    if (usedSize >= LIMIT_STORAGE && autoClearEnable) {
      // CLEARED LAST ELEMENT 
      needRemoveFavorite = autoClearOldItems(saveData);
    }

    if (needRemoveFavorite) {
      Notification({
        title: 'ERROR save copy!',
        message: `The end storage memory limit! Please remove some favorite!`
      });
      return {
        data: storageCopy.value,
        size: getStringMemorySize(JSON.stringify(storageCopy.value)),
        error: { type: 'memory', message: 'end limit memory, remove favorite!' }
      }
    }

    storageCopy.value = saveData;
    const currentSize = getStringMemorySize(JSON.stringify(saveData));

    Notification({
      title: 'Edit success!',
      message: `New value: ${data.value?.split(0, 10)}...`
    })

    return {
      data: saveData,
      size: currentSize,
    }
  } else {
    console.log('ERROR: Edit item Not-found parent')
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
  const data = storageCopy.value;
  const usedSize = getStringMemorySize(JSON.stringify(data));

  return {
    data,
    size: usedSize,
  }
})

function autoClearOldItems(saveArray: any[]) {
  let needRemoveFavorite = false;
  const checkedArray = JSON.parse(JSON.stringify(saveArray))
  for (let iterator = 0; iterator <= checkedArray.length; iterator += 1) {
    if (!saveArray[iterator]) {
      needRemoveFavorite = true;
      break
    }
    const clearItems = saveArray[iterator]?.items?.filter((item: any) => item.favorite);
    const clearedItem = {
      ...saveArray[iterator],
      items: clearItems
    }
    if (clearItems.length) {
      saveArray.splice(iterator, 1, clearedItem);
    } else {
      saveArray.splice(iterator, 1);
    }

    const checkedSize = getStringMemorySize(JSON.stringify(saveArray))
    if (checkedSize < LIMIT_STORAGE) {
      break;
    }
  
    if (iterator === checkedArray.length - 1 && checkedSize >= LIMIT_STORAGE) {
      needRemoveFavorite = true;
    }
  }

  return needRemoveFavorite
}

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