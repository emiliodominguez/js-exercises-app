import { useEffect } from "react";
import { useState } from "react";
import exercises from "../../config/exercises.json";
import { icons } from "../../shared/icons";
import CodeEditor from "../CodeEditor";
import ExerciseParser from "../ExerciseParser";
import styles from "./Main.module.scss";

const count = exercises.length;

export default function Main() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentExercise, setCurrentExercise] = useState<string>(
        () => exercises[currentIndex].code
    );

    /**
     * Goes to the previous exercise
     */
    function goToPreviousExercise(): void {
        setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
    }

    /**
     * Goes to the next exercise
     */
    function goToNextExercise(): void {
        setCurrentIndex((prev) => (prev + 1) % count);
    }

    function showResultantCode(): void {
        try {
            // eslint-disable-next-line no-eval
            if (currentExercise) eval(currentExercise);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setCurrentExercise((prevExercise) => {
            const newExercise = exercises[currentIndex].code;

            if (prevExercise === newExercise) return prevExercise;
            return newExercise;
        });
    }, [currentIndex]);

    return (
        <main className={styles.main}>
            <ExerciseParser />

            <section className={styles.editorContainer}>
                <CodeEditor
                    value={currentExercise}
                    setValue={setCurrentExercise}
                />

                <button
                    className={styles.showResultsBtn}
                    onClick={showResultantCode}
                >
                    {icons.chevronFill}
                </button>

                <div className={styles.results}>
                    Results will be displayed here
                </div>
            </section>

            {/* DEBUG ONLY */}
            <div className={styles.navigation}>
                <button onClick={goToPreviousExercise}>Go to previous</button>
                <button onClick={goToNextExercise}>Go to next</button>
            </div>
        </main>
    );
}
