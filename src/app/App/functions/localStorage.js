/* Helper functions to stringify in local storage */
export const saveInLocalStorage = (name, obj) => {
  localStorage.setItem(name, JSON.stringify(obj));
};
export const getFromLocalStorage = (name) => {
  const x = localStorage.getItem(name);
  if (!x) return null;
  return JSON.parse(x);
};
