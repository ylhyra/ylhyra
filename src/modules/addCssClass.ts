export function addClass(ids: string | string[], cssClass = "audio") {
  ids = Array.isArray(ids) ? ids : [ids];
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.add(cssClass);
  });
}
export function removeClass(ids: string | string[], cssClass = "audio") {
  ids = Array.isArray(ids) ? ids : [ids];
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.classList.remove(cssClass);
  });
}

export function joinClassNames(...input: string[]) {
  return input.filter(Boolean).join(" ");
}
