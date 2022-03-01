/**
 * Checks if two objects are equal
 * @param objectA The object A
 * @param objectB The object B
 * @returns A boolean that determines whether the two objects are equal or not
 */
export function areEqual(objectA: any, objectB: any): boolean {
    return JSON.stringify(objectA) === JSON.stringify(objectB);
}

/**
 * Gets a random string
 * @returns The random string
 */
export function getRandomString(): string {
    return (Math.random() + 1).toString(36).substring(7);
}
