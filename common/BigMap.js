/// there is hard limit on how big a map can be in JS => 1GB
// this is workaround for that, it creates multiple maps as backend
// using js Object is not an option, because it is slow after 8mil entries if keys are not numbers
export class BigMap {
  /*
    public api, compatible with "Map"
  */
  constructor(...parameters) {
    this.maxSize = parameters.maxSize || Math.pow(2, 20); // 24
    this.maps = [new Map(...parameters)];
  }

  set(key, value) {
    const map = this.maps[this.maps.length - 1];

    if (map.size === this.maxSize) {
      this.maps.push(new Map());
      return this.set(key, value);
    } else {
      return map.set(key, value);
    }
  }

  has(key) {
    return this.#mapForKey(this.maps, key) !== undefined;
  }

  get(key) {
    return this.#valueForKey(this.maps, key);
  }

  delete(key) {
    const map = this.#mapForKey(this.maps, key);

    if (map !== undefined) {
      return map.delete(key);
    }

    return false;
  }

  clear() {
    for (let map of this.maps) {
      map.clear();
    }
  }

  get size() {
    let size = 0;

    for (let map of this.maps) {
      size += map.size;
    }

    return size;
  }

  forEach(callbackFn, thisArg) {
    if (thisArg) {
      for (let value of this) {
        callbackFn.call(thisArg, value);
      }
    } else {
      for (let value of this) {
        callbackFn(value);
      }
    }
  }

  entries() {
    return this.#iterator(this.maps, "entries");
  }

  keys() {
    return this.#iterator(this.maps, "keys");
  }

  values() {
    return this.#iterator(this.maps, "values");
  }

  [Symbol.iterator]() {
    return this.#iterator(this.maps, Symbol.iterator);
  }

  /*
  private function
*/
  #mapForKey(maps, key) {
    for (let index = maps.length - 1; index >= 0; index--) {
      const map = maps[index];

      if (map.has(key)) {
        return map;
      }
    }
  }

  #valueForKey(maps, key) {
    for (let index = maps.length - 1; index >= 0; index--) {
      const map = maps[index];
      const value = map.get(key);

      if (value !== undefined) {
        return value;
      }
    }
  }

  #iterator(items, name) {
    let index = 0;

    var iterator = items[index][name]();

    return {
      next: () => {
        let result = iterator.next();

        if (result.done && index < items.length - 1) {
          index++;
          iterator = items[index][name]();
          result = iterator.next();
        }

        return result;
      },
      [Symbol.iterator]: function () {
        return this;
      },
    };
  }
}
