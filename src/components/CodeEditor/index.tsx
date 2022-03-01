import { UnControlled as CodeMirror } from "react-codemirror2";
import { Editor, EditorChange } from "codemirror";
import styles from "./CodeEditor.module.scss";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    onMount: () => void;
}

export default function CodeEditor(props: CodeEditorProps): JSX.Element {
    /**
     * Handles the editor mount event
     * @param editor The editor
     */
    function handleMount(editor: Editor): void {
        editor.setValue(props.code);
        editor.eachLine(line => editor.indentLine(editor.getLineNumber(line)!, "smart"));
        props.onMount();
    }

    /**
     * Handles the editor change event
     * @param editor The editor
     * @param data The change descriptor
     * @param value The updated value
     */
    function handleChange(_editor: Editor, _data: EditorChange, value: string): void {
        props.setCode(value);
    }

    return (
        <CodeMirror
            editorDidMount={handleMount}
            onChange={handleChange}
            className={styles.editor}
            options={{
                mode: "javascript",
                theme: "dracula",
                lineNumbers: true,
                electricChars: true,
                indentWithTabs: true,
                indentUnit: 4
            }}
        />
    );
}
