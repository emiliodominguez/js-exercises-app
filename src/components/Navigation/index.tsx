import styles from "./Navigation.module.scss";

interface NavigationProps {
    current: number;
    previous: () => void;
    next: () => void;
}

export default function Navigation(props: NavigationProps): JSX.Element {
    return (
        <div className={styles.navigation}>
            <button title="Go to previous exercise" onClick={props.previous}>
                Previous
            </button>

            <span className={styles.current} title={`Exercise ${props.current + 1}`}>
                {props.current + 1}
            </span>

            <button title="Go to next exercise" onClick={props.next}>
                Next
            </button>
        </div>
    );
}
