import { useEffect, useState } from 'react';

const PREFIX = 'websocket-';

export default function useLocalStorage(key, initiaValue) {
  const prefixedkey = PREFIX + key;
  const [value, setValue] = useState(() => {
    const JsonValue = localStorage.getItem(prefixedkey);
    if (JsonValue !== null) return JSON.parse(JsonValue);
    if (typeof initiaValue === 'function') {
      return initiaValue();
    } else {
      return initiaValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixedkey, JSON.stringify(value));
  }, [prefixedkey, value]);

  return [value, setValue];
}
