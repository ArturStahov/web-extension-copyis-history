export function getRenderSortedList(detailsList: any[], params: string) {
  return detailsList.sort((a, b) => b[params].localeCompare(a[params]))
}

export function getFavoriteList(detailsItems: any[]) {
  const all: any[] = [];
  detailsItems.forEach(parent => {
    const parentFavorites = parent.items.filter((item: any) => item.favorite);
    all.push(...parentFavorites);
  });
  return getRenderSortedList(all, 'id');
}