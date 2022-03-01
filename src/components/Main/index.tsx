import { useState, useEffect } from "react";
import exercises from "../../config/exercises.json";
import { icons } from "../../shared/icons";
import CodeEditor from "../CodeEditor";
import ExerciseParser from "../ExerciseParser";
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
                // eslint-disable-next-line no-eval
                (undefined, eval)(currentExercise)();
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
        setLogMessages({ logs: [], error: "" });
    }

    useEffect(() => {
        console.log = message => setLogMessages(prev => ({ logs: [...prev.logs, message], error: "" }));
    }, []);

    useEffect(clearLogMessages, [currentIndex]);

    return (
        <main className={styles.main}>
            <ExerciseParser />

            <header className={styles.header}>
                <img src="/logo192.png" alt="JavaScript logo" />
                <h1>JS Exercises</h1>
            </header>

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
