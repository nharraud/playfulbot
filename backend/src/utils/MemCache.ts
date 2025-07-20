/**
 * Simple in-memory cache cleaning non-accessed/non-set keys on a provided frequency.
 */
export class MemCache<KEY, VALUE> {
  readonly #cache = new Map<KEY, VALUE>();
  readonly #accessedKeys = new Set<KEY>();
  readonly #cleanTimeoutMs = 5000;
  #isCleaning = true;

  constructor(readonly cleanTimeoutMs = 5000) {
    this.startCleaning();
  }

  startCleaning() {
      setTimeout(() => {
          if (!this.#isCleaning) {
            return;
          }
          this.clean();
          this.startCleaning();
    }, this.#cleanTimeoutMs);
  }

  stopCleaning() {
    this.#isCleaning = false;
  }

  clean() {
    const deletedKeys = [...this.#cache.keys()].filter(key => !this.#accessedKeys.has(key));
    for (const key of deletedKeys) {
      this.#cache.delete(key);
    }
    this.#accessedKeys.clear();
  }

  get(key: KEY): VALUE | undefined {
    // Note that we do not check if the key actually exist on purpose. This should not be exposed to user inputs!
    this.#accessedKeys.add(key);
    return this.#cache.get(key);
  }

  set(key: KEY, value: VALUE) {
    // Note that we do not check if the key actually exist on purpose. This should not be exposed to user inputs!
    this.#accessedKeys.add(key);
    this.#cache.set(key, value);
    return this;
  }

}