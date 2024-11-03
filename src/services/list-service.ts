export function getRenderSortedList(detailsList: any[], params: string) {
  return detailsList.sort((a, b) => b[params].localeCompare(a[params]))
}

export function getFavoriteList(detailsItems: any[]) {
  if (!detailsItems?.length) {
    return []
  }

  const all: any[] = [];
  detailsItems.forEach(parent => {
    const parentFavorites = parent.items.filter((item: any) => item.favorite);
    all.push(...parentFavorites);
  });
  return getRenderSortedList(all, 'id');
}


export function getCustomList(detailsItems: any[]) {
  if (!detailsItems?.length) {
    return []
  }

  const all: any[] = [];
  detailsItems?.forEach(parent => {
    const items = parent.items.filter((item: any) => item.action === 'custom-item');
    all.push(...items);
  });
  const allSorted = getRenderSortedList(all, 'id');
  const pinned = allSorted.filter(i => !!i.pin);
  const unPinned = allSorted.filter(i => !i.pin);
  return [...pinned, ...unPinned];
}

export function getCopiedList(detailsItems: any[],isParent=true) {
  if (!detailsItems?.length) {
    return []
  }

  if(isParent) {
    return getRenderSortedList(detailsItems, 'id').filter(parent => {
      const isHaveChild = !![...parent.items?.filter(i => i.action === 'copy-text-item' || !i.action)].length
      return isHaveChild;
    });
  }

  return getRenderSortedList(detailsItems, 'id').filter(item => item.action === 'copy-text-item' || !item.action)
}