import { useEffect, useRef } from 'react';

const getAllKeys = (obj: any, keys = new Set<string>(), path = '@') => {
  for (let [key, value] of Object.entries(obj)) {
    keys.add(path + key);

    if (typeof value === 'object') {
      getAllKeys(value, keys, path + key + '.');
    }
  }

  return keys;
};

export function createSpy(path = '@', usedKeys = new Set<string>()) {
  const __used__ = () => Array.from(usedKeys);
  const __unused__ = (root: any) => {
    const used = new Set(usedKeys);
    return Array.from(getAllKeys(root)).filter(key => !used.has(key));
  };

  const handler: ProxyHandler<any> = {
    get(target, key) {
      key = String(key);

      if (key === '__isProxy__') return true;

      if (target.hasOwnProperty(key) && key !== '__proto__') {
        usedKeys.add(path + key);
      }

      const prop = target[key];

      // return if property not found
      if (typeof prop === 'undefined') return;

      // set value as proxy if object
      if (!prop.__isProxy__ && typeof prop === 'object')
        target[key] = new Proxy(prop, createSpy(path + key + '.', usedKeys));

      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      return true;
    },
  };

  return { ...handler, __unused__, __used__ };
}

export function getUnusedProperties(obj: any, whitelist: string[] = []) {
  const spy = createSpy('@', new Set(whitelist));
  const proxy = new Proxy(obj, spy);
  const getUnused = () => spy.__unused__(obj);

  return [proxy, getUnused];
}

export function warnWhenUnused(obj: any, whitelist = []) {
  const [proxy, getUnused] = getUnusedProperties(obj, whitelist)

  setTimeout(() => {
    const unused = getUnused();
    if (unused && unused.length) {
      console.log(`Unused keys:\n${unused.join(', ')}`);
    }
  }, 100);

  return proxy;
}


type Timer = ReturnType<typeof setTimeout>;

export function useWarnWhenUnused(obj: any, whitelist = []) {
  const ref = useRef(obj);
  const spy = useRef(createSpy('@', new Set(whitelist)));
  const proxy = useRef(new Proxy(ref.current, spy.current));
  const timer = useRef<Timer>();

  if (ref.current !== obj) {
    ref.current = obj;
    spy.current = createSpy('@', new Set(whitelist));
    proxy.current = new Proxy(ref.current, spy.current);
  }

  useEffect(() => {
    timer.current = setTimeout(() => {
      const unused = spy.current.__unused__(ref.current);

      if (unused && unused.length) {
        console.log(`Unused keys:\n${unused.join(', ')}`);
      }
    }, 100);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };
  }, [spy, ref, timer]);

  return proxy.current;
}
