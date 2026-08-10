// Polyfill window.fetch to be writable if it is defined as a getter-only property on Window
if (typeof window !== 'undefined') {
  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  }

  if (window.fetch) {
    try {
      const origFetch = window.fetch.bind(window);
      Object.defineProperty(window, 'fetch', {
        value: origFetch,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } catch (e) {
      // Ignore if already writable
    }
  }
}

export {};
