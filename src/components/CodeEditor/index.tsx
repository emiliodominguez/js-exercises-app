import { UnControlled as CodeMirror } from "react-codemirror2";
import { Editor } from "codemirror";
import styles from "./CodeEditor.module.scss";

interface CodeEditorProps {
    value: string;
}

export default function CodeEditor(props: CodeEditorProps): JSX.Element {
    /**
     * Formats the editor content
     * @param editor The editor
     */
    function format(editor: Editor) {
        editor.eachLine((line) =>
            editor.indentLine(editor.getLineNumber(line)!, "smart")
        );
    }

    return (
        <CodeMirror
            value={props.value}
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
                readOnly: true,
            }}
        />
    );
}
