import { useState, useEffect, useRef, useMemo } from "react";
import exercises from "../../config/exercises.json";
import useEventListener from "../../hooks/useEventListener";
import LocalStorageService from "../../services/local-storage.service";
import { areEqual, className, getRandomString } from "../../shared/helpers";
import { icons } from "../../shared/icons";
import Actions from "../Actions";
import CodeEditor from "../CodeEditor";
import ExerciseParser from "../ExerciseParser";
import Header from "../Header";
import Navigation from "../Navigation";
import styles from "./Main.module.scss";

interface LogMessages {
    logs: string[];
    error: string;
}

interface Configuration {
    currentIndex: number;
    fullScreen: boolean;
    hardMode: boolean;
    hash: string;
}

interface Exercise {
    code: string;
    hard?: boolean;
}

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
    const localStorageService = useRef<LocalStorageService>(new LocalStorageService());
    const [logMessages, setLogMessages] = useState<LogMessages>({ logs: [], error: "" });
    const [configuration, setConfiguration] = useState<Configuration>({ currentIndex: 0, fullScreen: false, hardMode: false, hash: "" });
    const filteredExercises = useMemo<Exercise[]>(getFilterdExercises, [configuration.hardMode]);
    const [currentExercise, setCurrentExercise] = useState<string>(() => getCurrentExercise(configuration.currentIndex));

    /**
     * Updates the configuration
     * @param configuration The updated configuration
     */
    function updateConfiguration(configuration: Partial<Configuration>): void {
        setConfiguration(prevConfiguration => ({ ...prevConfiguration, ...configuration }));
    }

    /**
     * Gets the current exercise
     * @param index The exercise index
     * @returns The exercise string
     */
    function getCurrentExercise(index: number): string {
        return localStorageService.current.get(getKey(index)) ?? filteredExercises[index].code;
    }

    /**
     * Gets the filtered array of exercises by difficulty
     * @returns The exercises array
     */
    function getFilterdExercises(): Exercise[] {
        return exercises.filter(exercise => (configuration.hardMode ? exercise : !exercise.hard));
    }

    /**
     * Goes to a specific index
     * @param index The index
     */
    function goToExercise(index: number): void {
        localStorageService.current.set(getKey(configuration.currentIndex), currentExercise);
        updateConfiguration({ currentIndex: index });
        setCurrentExercise(getCurrentExercise(index));
        clearLogMessages();
    }

    /**
     * Goes to the previous exercise
     */
    function goToPreviousExercise(): void {
        const index = configuration.currentIndex === 0 ? filteredExercises.length - 1 : configuration.currentIndex - 1;
        goToExercise(index);
    }

    /**
     * Goes to the next exercise
     */
    function goToNextExercise(): void {
        const index = (configuration.currentIndex + 1) % filteredExercises.length;
        goToExercise(index);
    }

    /**
     * Shows the output of the exercise on keydown
     * @param e The event
     */
    function showOutputOnKeyDown(e: KeyboardEvent): void {
        if (e.ctrlKey && e.key === "Enter") showOutput();
    }

    /**
     * Toggles the hard mode and set the current index as 0
     */
    function toggleHardMode(): void {
        localStorageService.current.clear();
        updateConfiguration({ hardMode: !configuration.hardMode });
        goToExercise(0);
    }

    /**
     * Toggles the full screen mode
     */
    function toggleFullScreen(): void {
        updateConfiguration({ fullScreen: !configuration.fullScreen });
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
        clearLogMessages();
        setCurrentExercise(filteredExercises[configuration.currentIndex].code);
        updateConfiguration({ hash: getRandomString() });
        localStorageService.current.remove(getKey(configuration.currentIndex));
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
                localStorageService.current.set(getKey(configuration.currentIndex), currentExercise);
            });

            // eslint-disable-next-line no-eval
            (1, eval)(`{${currentExercise}}`)();
        } catch (error) {
            const { name, message } = error as EvalError;

            if (!message.includes("eval")) setLogMessages(prev => ({ ...prev, error: `${name}: ${message}` }));
        }
    }

    useEffect(() => {
        // Mocks console methods
        console.clear = clearLogMessages;
        console.log = log =>
            setLogMessages(prev => {
                const message = log instanceof Function ? log.toString() : JSON.stringify(log, null, 4);
                return { logs: [...prev.logs, message], error: "" };
            });

        // Clears local storage
        localStorageService.current.clear();
    }, []);

    useEventListener("keydown", showOutputOnKeyDown);

    return (
        <main {...className(styles.main, { [styles.hardMode]: configuration.hardMode })}>
            <ExerciseParser />

            <Header />

            <section {...className(styles.controlGroup, { [styles.fullScreenMode]: configuration.fullScreen })}>
                {/* Code editor */}
                <CodeEditor
                    key={`${configuration.hash}_${getKey(configuration.currentIndex)}`}
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

                <Actions
                    showRestoreButton={!areEqual(currentExercise, exercises[configuration.currentIndex].code)}
                    fullScreenModeActive={configuration.fullScreen}
                    restoreExercise={restoreExercise}
                    toggleHardMode={toggleHardMode}
                    toggleFullScreen={toggleFullScreen}
                />
            </section>

            <Navigation current={configuration.currentIndex} previous={goToPreviousExercise} next={goToNextExercise} />
        </main>
    );
}
