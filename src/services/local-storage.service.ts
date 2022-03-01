export default class LocalStorageService {
    /**
     * Gets an element from local storage
     * @param key The key
     * @returns The element or null
     */
    get(key: string): string | null {
        return localStorage.getItem(key);
    }

    /**
     * Sets an element on the local storage
     * @param key The key
     * @param value The value
     */
    set(key: string, value: string): void {
        if (this.get(key)) this.remove(key);
        localStorage.setItem(key, value);
    }

    /**
     * Removes an element from local storage
     * @param key The key
     */
    remove(key: string): void {
        localStorage.removeItem(key);
    }
}
