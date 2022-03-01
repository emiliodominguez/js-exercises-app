import { UnControlled as CodeMirror } from "react-codemirror2";
import { Editor, EditorChange } from "codemirror";
import styles from "./CodeEditor.module.scss";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
}

export default function CodeEditor(props: CodeEditorProps): JSX.Element {
    /**
     * Formats the editor content
     * @param editor The editor
     */
    function format(editor: Editor): void {
        editor.eachLine((line) =>
            editor.indentLine(editor.getLineNumber(line)!, "smart")
        );
    }

    /**
     * Handles the editor change event
     * @param editor The editor
     * @param data The change descriptor
     * @param value The updated value
     */
    function handleChange(
        editor: Editor,
        _data: EditorChange,
        value: string
    ): void {
        format(editor);
        props.setCode(value);
    }

    return (
        <CodeMirror
            value={props.code}
            editorDidMount={format}
            onChange={handleChange}
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
