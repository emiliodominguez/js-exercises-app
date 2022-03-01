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
     * Goes to the previous exercise
     */
    function goToPreviousExercise(): void {
        setCurrentIndex(prev => {
            const index = prev === 0 ? count - 1 : prev - 1;
            localStorageService.set(getKey(currentIndex), currentExercise);
            setCurrentExercise(localStorageService.get(getKey(index)) ?? exercises[index].code);
            return index;
        });
    }

    /**
     * Goes to the next exercise
     */
    function goToNextExercise(): void {
        setCurrentIndex(prev => {
            const index = (prev + 1) % count;
            localStorageService.set(getKey(currentIndex), currentExercise);
            setCurrentExercise(localStorageService.get(getKey(index)) ?? exercises[index].code);
            return index;
        });
    }

    /**
     * Handles the show resultant code action
     * * Saves a copy of the original window object and restores it after eval's execution
     * * Saves the exercise on local storage
     */
    function showResultantCode(): void {
        clearLogMessages();

        try {
            if (currentExercise) {
                const originalWindow = Object.keys(window);

                // eslint-disable-next-line no-eval
                eval.call(window, currentExercise);

                const modifiedWindow = Object.keys(window);
                const diff = modifiedWindow.filter(key => !originalWindow.includes(key));

                diff.forEach(key => delete (window as { [key: string]: any })[key]);
                localStorageService.set(getKey(currentIndex), currentExercise);
            }
        } catch (error) {
            const { name, message } = error as EvalError;

            if (!message.includes("eval")) setLogMessages(prev => ({ ...prev, error: `${name}: ${message}` }));
        }
    }

    /**
     * Clears all log messages
     */
    function clearLogMessages(): void {
        console.clear();
        setLogMessages({ logs: [], error: "" });
        setRefreshHash(getRandomString());
    }

    /**
     * Restore exercise to its initial state
     */
    function restoreExercise(): void {
        localStorageService.remove(getKey(currentIndex));
        setCurrentExercise(exercises[currentIndex].code);
        clearLogMessages();
    }

    /**
     * Shows the results on keydown
     * @param e The event
     */
    function showResultsOnKeyDown(e: KeyboardEvent): void {
        if (e.ctrlKey && e.key === "Enter") showResultantCode();
    }

    useEffect(() => {
        clearLogMessages();
        // Mocks console log
        console.log = message => setLogMessages(prev => ({ logs: [...prev.logs, JSON.stringify(message, null, 4)], error: "" }));
    }, []);

    useEffect(() => {
        clearLogMessages();
    }, [currentIndex]);

    useEventListener("keydown", showResultsOnKeyDown);

    return (
        <main className={styles.main}>
            <ExerciseParser />

            <Header />

            <section className={styles.controlGroup}>
                <CodeEditor key={`${refreshHash}_${getKey(currentIndex)}`} code={currentExercise} setCode={setCurrentExercise} />

                {/* Results */}
                <div className={styles.results}>
                    {logMessages.logs.map((message, i) => (
                        <span key={`log_${i}`}>{message}</span>
                    ))}

                    {logMessages.error && <span className={styles.error}>{logMessages.error}</span>}
                </div>

                {/* Show results button */}
                <button className={styles.showResultsBtn} onClick={showResultantCode}>
                    {icons.chevronFill}
                </button>

                {/* Restore exercise button */}
                {!areEqual(currentExercise, exercises[currentIndex].code) && (
                    <button className={styles.restoreBtn} title="Restore exercise" onClick={restoreExercise}>
                        {icons.restore}
                    </button>
                )}
            </section>

            <Navigation previous={goToPreviousExercise} next={goToNextExercise} />
        </main>
    );
}
