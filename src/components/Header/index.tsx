import styles from "./Header.module.scss";

export default function Header(): JSX.Element {
    return (
        <header className={styles.header}>
            <img src="/logo192.png" alt="JavaScript logo" />
            <h1>JS Exercises</h1>
        </header>
    );
}
