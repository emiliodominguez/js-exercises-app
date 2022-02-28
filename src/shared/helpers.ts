/**
 * Highlights the syntax for any given JSON string
 * @param json The JSON string
 * @returns The parsed string
 */
export function highlightSyntax(json: string): string {
    if (typeof json !== "string") json = JSON.stringify(json, null, 4);

    json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
        (match) => {
            let cssClass = "number";

            if (/^"/.test(match)) {
                cssClass = /:$/.test(match) ? "key" : "string";
            } else if (/true|false/.test(match)) {
                cssClass = "boolean";
            } else if (/null/.test(match)) {
                cssClass = "null";
            }

            return '<span class="' + cssClass + '">' + match + "</span>";
        }
    );
}
