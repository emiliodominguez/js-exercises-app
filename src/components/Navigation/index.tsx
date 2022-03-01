import styles from "./Navigation.module.scss";

interface NavigationProps {
    previous: () => void;
    next: () => void;
}

export default function Navigation(props: NavigationProps): JSX.Element {
    return (
        <div className={styles.navigation}>
            <button title="Go to previous exercise" onClick={props.previous}>
                Previous
            </button>

            <button title="Go to next exercise" onClick={props.next}>
                Next
            </button>
        </div>
    );
}
