import { onMessage, sendMessage } from 'webext-bridge/background'
import uniqid from 'uniqid';

import { storageCopy, optionsStorage } from '~/logic/storage'

const LIMIT_STORAGE = 9 * 1024 * 1024;

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

  // TODO support old interface options
  if((options as any).memory) {
    return {
      ...(options as any).memory,
      ...options,
    }
  }

  return options
})

onMessage('save-memory-options', (message: any) => {
  const { data } = message;
  const options = optionsStorage.value;
  const update = {
    ...options,
    ...data
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

  const autoClearEnable = optionsStorage.value?.['auto-clear-last'];

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

  // Якщо досягли 8 МБ — запускаємо очищення БЕЗПЕРЕЧНО, навіть якщо галочка вимкнена!
  if (usedSize >= LIMIT_STORAGE) {
    if (!autoClearEnable) {
      console.warn('[Memory Protection] 8MB hard limit reached! Forcing auto-clear to prevent crash.');
    }
    // Наш розумний алгоритм видалить лише найстаріші записи без зірочок і пінів
    needRemoveFavorite = autoClearOldItems(saveArray);
  }

  if (needRemoveFavorite) {
    Notification({
      title: 'STORAGE FULL (9 MB)!',
      message: `All ephemeral history cleared! Please unpin or remove some favorites to save new items.`
    });
    return {
      data: storageCopy.value,
      size: getStringMemorySize(JSON.stringify(storageCopy.value)),
      error: { type: 'memory', message: '8MB limit reached, remove favorites!' }
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

onMessage('pin', async (message: any) => {
  const { data } = message;
  const { item, action } = data

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
      pin: action === 'add',
    }
    parentItem.items.splice(editIdx, 1, updated);

    storageCopy.value = saveData;
    const usedSize = getStringMemorySize(JSON.stringify(saveData));

    Notification({
      title: action === 'add' ? 'Pin record success!' : 'Unpin record success!',
      message: `${item.value?.split(0, 10)}...`
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

    const autoClearEnable = optionsStorage.value?.['auto-clear-last'];

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

    // Якщо досягли 8 МБ — запускаємо очищення БЕЗПЕРЕЧНО, навіть якщо галочка вимкнена!
    if (usedSize >= LIMIT_STORAGE) {
      if (!autoClearEnable) {
        console.warn('[Memory Protection] 8MB hard limit reached! Forcing auto-clear to prevent crash.');
      }
      // Наш розумний алгоритм видалить лише найстаріші записи без зірочок і пінів
      needRemoveFavorite = autoClearOldItems(saveData);
    }

    // Ця помилка вилетить ТІЛЬКИ в тому крайньому випадку, якщо алгоритм видалив УСЕ сміття,
    // але розмір все одно > 8 МБ (тобто всі 8 МБ забиті виключно фаворитами і пінами)
    if (needRemoveFavorite) {
      Notification({
        title: 'STORAGE FULL (9 MB)!',
        message: `All ephemeral history cleared! Please unpin or remove some favorites to save new items.`
      });
      return {
        data: storageCopy.value,
        size: getStringMemorySize(JSON.stringify(storageCopy.value)),
        error: { type: 'memory', message: '8MB limit reached, remove favorites!' }
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

function autoClearOldItems(saveArray: any[]): boolean {
  let currentSize = getStringMemorySize(JSON.stringify(saveArray));

  // Крутимо цикл, поки розмір перевищує ліміт
  while (currentSize >= LIMIT_STORAGE) {
    let itemsRemovedInPass = 0;

    // Йдемо від найстаріших днів (індекс 0 — це найстаріша дата)
    for (let i = 0; i < saveArray.length; i++) {
      const dayGroup = saveArray[i];

      if (!dayGroup || !dayGroup.items) continue;

      // Шукаємо індекс найстарішого запису, який НЕ є фаворитом і НЕ закріплений піном
      const nonFavIdx = dayGroup.items.findIndex((item: any) => !item.favorite && !item.pin);

      if (nonFavIdx !== -1) {
        // Видаляємо РІВНО 1 старий запис
        dayGroup.items.splice(nonFavIdx, 1);
        itemsRemovedInPass++;

        // Якщо після видалення день залишився порожнім — видаляємо сам день
        if (dayGroup.items.length === 0) {
          saveArray.splice(i, 1);
          i--; // КРИТИЧНО: компенсуємо зсув індексів, щоб не пропустити наступний день!
        }

        // Видаляємо пачками по 5 штук перед перерахунком важкого JSON.stringify,
        // щоб не вішати CPU Service Worker'а на 10 мегабайтах
        if (itemsRemovedInPass >= 5) {
          break;
        }
      }
    }

    // Якщо ми пройшли весь масив і не змогли видалити ЖОДНОГО елемента 
    // (це означає, що всі 10 МБ забиті виключно favorites або pin)
    if (itemsRemovedInPass === 0) {
      return true; // needRemoveFavorite = true -> повідомляємо юзеру, що треба чистити фаворити
    }

    // Перевіряємо новий розмір після видалення пачки
    currentSize = getStringMemorySize(JSON.stringify(saveArray));
  }

  return false; // Пам'ять успішно розчищено, фаворити чіпати не треба
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