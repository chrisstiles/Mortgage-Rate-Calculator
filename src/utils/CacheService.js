export default class CacheService {
  get(key, defaultValue = null) {
    if (this[key]) {
      return this[key];
    }

    try {
      return JSON.parse(window.localStorage.getItem(key));;
    } catch {
      return defaultValue;
    }
  }

  set(key, data) {
    try {
      const value = JSON.stringify(data);
      this[key] = value;
      window.localStorage.setItem(key, value);
    } catch {}
  }
}