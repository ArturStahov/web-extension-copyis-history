export function getPastePopupPosition(clientX: number, clientY: number, popupElement: any) {
  const rect = popupElement?.$el?.getBoundingClientRect();
  const elWidth = rect?.width;
  const elHeight = rect?.height;

  const windowWidth = window.innerWidth;

  const offsetY = 20;
  const offsetX = 20;

  const isLeftBorder = clientX < (elWidth + offsetX);
  const isTopBorder = clientY < (elHeight + offsetY);
  const isRightBorder = (clientX + elWidth / 2 + offsetX + 30) > windowWidth;
  const leftPosition = isLeftBorder ? (clientX + offsetX) : ((clientX - elWidth / 2) + window.scrollX + offsetX);
  const topPosition = isTopBorder ? (clientY + offsetY) : (clientY - elHeight - offsetY) + window.scrollY;
  const leftCorrect = isRightBorder ? (clientX - elWidth) : leftPosition;

  return {
    left: leftCorrect,
    top: topPosition
  };
}