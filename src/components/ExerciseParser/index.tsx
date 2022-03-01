import { ChangeEvent, useRef, useState } from "react";
import { icons } from "../../shared/icons";
import useEventListener from "../../hooks/useEventListener";
import styles from "./ExerciseParser.module.scss";

export default function ExerciseParser(): JSX.Element {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [visible, setVisibility] = useState<boolean>(false);
    const [snippet, setSnippet] = useState<string>("");

    /**
     * Handles the textarea change
     * @param e The event
     */
    function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
        setSnippet(e.target.value);
    }

    /**
     * Handles the key down event
     * @param e The event
     */
    function handleKeyDown(e: KeyboardEvent): void {
        if (e.ctrlKey && e.key === "a") {
            e.preventDefault();

            if (!visible) setVisibility(true);
            else close();
        }
    }

    /**
     * Handles the copy button action
     */
    function handleCopyButtonClick(): void {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            const code = JSON.stringify(snippet, null, 4);
            const minifiedSnippet = code.replace(/\n/g, "\n");
            navigator.clipboard.writeText(minifiedSnippet);
        }
    }

    /**
     * Closes the modal
     */
    function close(): void {
        setVisibility(false);
        setSnippet("");

        if (textAreaRef.current) textAreaRef.current.value = "";
    }

    useEventListener("keydown", handleKeyDown);

    if (!visible) return <></>;

    return (
        <div className={styles.container}>
            <button title="Close modal" className={styles.close} onClick={close}>
                {icons.close}
            </button>

            <h2>Paste a snippet</h2>

            <div className={styles.textareaContainer}>
                <textarea ref={textAreaRef} value={snippet} placeholder="Paste your snippet here" onChange={handleChange} />

                {snippet && (
                    <button title="Copy formatted snippet" onClick={handleCopyButtonClick}>
                        {icons.rocket}
                    </button>
                )}
            </div>
        </div>
    );
}
