export const getScrollingElement = () => {
  return document.scrollingElement || document.documentElement;

  // document.documentElement //|| document.body || document.body.parentNode || document.documentElement
};
