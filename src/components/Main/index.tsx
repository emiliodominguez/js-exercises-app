import { useState, useEffect, useRef } from "react";
import exercises from "../../config/exercises.json";
import useEventListener from "../../hooks/useEventListener";
import LocalStorageService from "../../services/local-storage.service";
import { areEqual, getRandomString } from "../../shared/helpers";
import { icons } from "../../shared/icons";
import CodeEditor from "../CodeEditor";
import ExerciseParser from "../ExerciseParser";
import Header from "../Header";
import Navigation from "../Navigation";
import styles from "./Main.module.scss";

interface LogMessages {
    logs: string[];
    error: string;
}

const count: number = exercises.length;
const indexKey: string = "exercise_{{index}}";

/**
 * Gets a key depending on the exercise index
 * @param index The index
 * @returns The key string
 */
function getKey(index: number): string {
    return indexKey.replace("{{index}}", index.toString());
}

export default function Main(): JSX.Element {
    const { current: localStorageService } = useRef<LocalStorageService>(new LocalStorageService());
    const [logMessages, setLogMessages] = useState<LogMessages>({ logs: [], error: "" });
    const [refreshHash, setRefreshHash] = useState<string>("");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentExercise, setCurrentExercise] = useState<string>(
        () => localStorageService.get(getKey(currentIndex)) ?? exercises[currentIndex].code
    );

    /**
     * Goes to a specific index
     * @param index The index
     */
    function goToExercise(index: number): void {
        localStorageService.set(getKey(currentIndex), currentExercise);
        setCurrentExercise(localStorageService.get(getKey(index)) ?? exercises[index].code);
        clearLogMessages();
    }

    /**
     * Goes to the previous exercise
     */
    function goToPreviousExercise(): void {
        setCurrentIndex(prev => {
            const index = prev === 0 ? count - 1 : prev - 1;
            goToExercise(index);
            return index;
        });
    }

    /**
     * Goes to the next exercise
     */
    function goToNextExercise(): void {
        setCurrentIndex(prev => {
            const index = (prev + 1) % count;
            goToExercise(index);
            return index;
        });
    }

    /**
     * Handles the show output button action
     * - Saves a copy of the original window object and restores it after eval's execution
     * - Saves the exercise on local storage
     */
    function showOutput(): void {
        clearLogMessages();

        try {
            const originalWindow = Object.keys(window);

            setTimeout(() => {
                const modifiedWindow = Object.keys(window);
                const windowPropertiesDiff = modifiedWindow.filter(key => !originalWindow.includes(key));

                windowPropertiesDiff.forEach(key => delete (window as { [key: string]: any })[key]);
                localStorageService.set(getKey(currentIndex), currentExercise);
            });

            // eslint-disable-next-line no-eval
            (1, eval)(`{${currentExercise}}`)();
        } catch (error) {
            const { name, message } = error as EvalError;

            if (!message.includes("eval")) setLogMessages(prev => ({ ...prev, error: `${name}: ${message}` }));
        }
    }

    /**
     * Clears all log messages
     */
    function clearLogMessages(): void {
        setLogMessages({ logs: [], error: "" });
    }

    /**
     * Restore exercise to its initial state
     */
    function restoreExercise(): void {
        localStorageService.remove(getKey(currentIndex));
        clearLogMessages();
        setCurrentExercise(exercises[currentIndex].code);
        setRefreshHash(getRandomString());
    }

    /**
     * Shows the output of the exercise on keydown
     * @param e The event
     */
    function showOutputOnKeyDown(e: KeyboardEvent): void {
        if (e.ctrlKey && e.key === "Enter") showOutput();
    }

    useEffect(() => {
        // Mocks console methods
        console.clear = clearLogMessages;
        console.log = log =>
            setLogMessages(prev => {
                const message = log instanceof Function ? log.toString() : JSON.stringify(log, null, 4);
                return { logs: [...prev.logs, message], error: "" };
            });
    }, []);

    useEventListener("keydown", showOutputOnKeyDown);

    return (
        <main className={styles.main}>
            <ExerciseParser />

            <Header />

            <section className={styles.controlGroup}>
                {/* Code editor */}
                <CodeEditor
                    key={`${refreshHash}_${getKey(currentIndex)}`}
                    code={currentExercise}
                    setCode={setCurrentExercise}
                    onMount={clearLogMessages}
                />

                {/* Output */}
                <div className={styles.output}>
                    {logMessages.logs.map((message, i) => (
                        <span key={`log_${i}`}>{message}</span>
                    ))}

                    {logMessages.error && <span className={styles.error}>{logMessages.error}</span>}
                </div>

                {/* Show output button */}
                <button className={styles.showOutputBtn} title="Show output" onClick={showOutput}>
                    {icons.chevronFill}
                </button>

                {/* Restore exercise button */}
                {!areEqual(currentExercise, exercises[currentIndex].code) && (
                    <button className={styles.restoreBtn} title="Restore exercise" onClick={restoreExercise}>
                        {icons.restore}
                    </button>
                )}
            </section>

            <Navigation current={currentIndex} previous={goToPreviousExercise} next={goToNextExercise} />
        </main>
    );
}
