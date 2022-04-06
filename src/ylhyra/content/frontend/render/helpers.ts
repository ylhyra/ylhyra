export const addClass = (ids: string | string[], cssClass = "audio") => {
  ids = Array.isArray(ids) ? ids : [ids];
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.add(cssClass);
  });
};

export const removeClass = (ids: string | string[], cssClass = "audio") => {
  ids = Array.isArray(ids) ? ids : [ids];
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.remove(cssClass);
  });
};

export const getScrollingElement = () => {
  return document.scrollingElement || document.documentElement;

  // document.documentElement //|| document.body || document.body.parentNode || document.documentElement
};
