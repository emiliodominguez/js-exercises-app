import { Controlled as CodeMirror } from "react-codemirror2";
import { Editor, EditorChange } from "codemirror";
import styles from "./CodeEditor.module.scss";
import { useEffect } from "react";

interface CodeEditorProps {
    value: string;
    setValue: (value: string) => void;
}

export default function CodeEditor(props: CodeEditorProps): JSX.Element {
    /**
     * Handles the code change in the editor
     * @param editor The editor
     * @param data The change descriptor
     * @param value The updated value
     */
    function handleCodeChange(
        _editor: Editor,
        _data: EditorChange,
        value: string
    ): void {
        props.setValue(value);
    }

    /**
     * Formats the editor content
     * @param editor The editor
     */
    function format(editor: Editor) {
        editor.eachLine((line) =>
            editor.indentLine(editor.getLineNumber(line)!, "smart")
        );
    }

    useEffect(() => {}, [props.value]);

    return (
        <CodeMirror
            value={props.value}
            onBeforeChange={handleCodeChange}
            editorDidMount={format}
            onChange={format}
            className={styles.editor}
            options={{
                mode: "javascript",
                theme: "dracula",
                lineNumbers: true,
                electricChars: true,
                indentWithTabs: true,
                indentUnit: 4,
            }}
        />
    );
}
