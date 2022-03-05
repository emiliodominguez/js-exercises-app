/**
 * A helper function to handle classname conditions easily.
 * Recieves an object containing strings or an object with the CSS class as key
 * and a condition to add or remove it as value.
 *
 * @param classNames - The classnames object
 * @returns The classes separated by a space
 */
export function className(...classNames: any): { className: string } {
    const classes = [];

    for (const className of classNames) {
        if (typeof className === "object") {
            for (const key in className) {
                if (className.hasOwnProperty(key) && className[key]) {
                    classes.push(key);
                }
            }
        } else {
            classes.push(className);
        }
    }

    return { className: classes.join(" ") };
}

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
