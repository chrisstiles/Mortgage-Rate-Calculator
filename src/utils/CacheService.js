export default class CacheService {
  get(key, defaultValue = null, type = 'localStorage') {
    if (this[key]) {
      return this[key];
    }

    try {
      return JSON.parse(window[type].getItem(key)) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }

  getSession(key, defaultValue) {
    return this.get(`_${key}`, defaultValue, 'sessionStorage');
  }

  set(key, data, type = 'localStorage') {
    this[key] = data;

    requestIdleCallback(() => {
      try {
        const value = JSON.stringify(data);
        window[type].setItem(key, value);
      } catch {}
    });
  }

  remove(key, type = 'localStorage') {
    window[type].removeItem(key);
  }

  setSession(key, data) {
    return this.set(`_${key}`, data, 'sessionStorage');
  }
}
