export default class CacheService {
  get(key, defaultValue = null) {
    if (this[key]) {
      return this[key];
    }

    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch {
      return defaultValue;
    }
  }

  set(key, data) {
    this[key] = data;

    requestIdleCallback(() => {
      try {
        const value = JSON.stringify(data);
        window.localStorage.setItem(key, value);
      } catch {}
    });
  }
}