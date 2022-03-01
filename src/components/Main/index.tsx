import { useState, useEffect } from "react";
import exercises from "../../config/exercises.json";
import useEventListener from "../../hooks/useEventListener";
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

export default function Main(): JSX.Element {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [logMessages, setLogMessages] = useState<LogMessages>({ logs: [], error: "" });
    const [currentExercise, setCurrentExercise] = useState<string>(() => exercises[currentIndex].code);

    /**
     * Goes to the previous exercise
     */
    function goToPreviousExercise(): void {
        setCurrentIndex(prev => {
            const index = prev === 0 ? count - 1 : prev - 1;
            setCurrentExercise(exercises[index].code);
            return index;
        });
    }

    /**
     * Goes to the next exercise
     */
    function goToNextExercise(): void {
        setCurrentIndex(prev => {
            const index = (prev + 1) % count;
            setCurrentExercise(exercises[index].code);
            return index;
        });
    }

    /**
     * Handles the show resultant code action
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

    useEffect(clearLogMessages, [currentIndex]);

    useEventListener("keydown", showResultsOnKeyDown);

    return (
        <main className={styles.main}>
            <ExerciseParser />

            <Header />

            <section className={styles.controlGroup}>
                <CodeEditor key={`exercise_${currentIndex}`} code={currentExercise} setCode={setCurrentExercise} />

                <button className={styles.showResultsBtn} onClick={showResultantCode}>
                    {icons.chevronFill}
                </button>

                <div className={styles.results}>
                    {logMessages.logs.map((message, i) => (
                        <span key={`log_${i}`}>{message}</span>
                    ))}

                    {logMessages.error && <span className={styles.error}>{logMessages.error}</span>}
                </div>
            </section>

            <Navigation previous={goToPreviousExercise} next={goToNextExercise} />
        </main>
    );
}
