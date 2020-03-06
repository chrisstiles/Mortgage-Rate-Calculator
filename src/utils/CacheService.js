export default class CacheService {
  get(key) {
    if (this[key]) {
      return this[key];
    }

    try {
      const value = JSON.parse(window.localStorage.getItem(key));
      this[key] = value;
      return value;
    } catch {
      return null;
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