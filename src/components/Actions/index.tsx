import { icons } from "../../shared/icons";
import styles from "./Actions.module.scss";

interface ActionProps {
    showRestoreButton: boolean;
    fullScreenModeActive: boolean;
    restoreExercise: () => void;
    toggleHardMode: () => void;
    toggleFullScreen: () => void;
}

export default function Actions(props: ActionProps): JSX.Element {
    return (
        <div className={styles.editorActions}>
            {/* Restore exercise button */}
            {props.showRestoreButton && (
                <button title="Restore exercise" onClick={props.restoreExercise}>
                    {icons.restore}
                </button>
            )}

            {/* Difficulty button */}
            <button className="difficulty-btn" title="Toggle hard difficulty" onClick={props.toggleHardMode}>
                {icons.skull}
            </button>

            {/* Full screen button */}
            <button title="Toggle full screen mode" onClick={props.toggleFullScreen}>
                {props.fullScreenModeActive ? icons.shrink : icons.enlarge}
            </button>
        </div>
    );
}
