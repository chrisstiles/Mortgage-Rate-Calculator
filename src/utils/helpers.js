export function getUrlParam(name, defaultValue = null) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) ?? defaultValue;
}