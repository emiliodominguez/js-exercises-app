import styles from "./Navigation.module.scss";

interface NavigationProps {
    previous: () => void;
    next: () => void;
}

export default function Navigation(props: NavigationProps): JSX.Element {
    return (
        <div className={styles.navigation}>
            <button onClick={props.previous}>Previous</button>
            <button onClick={props.next}>Next</button>
        </div>
    );
}
