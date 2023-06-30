import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { register } from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import Main from "./components/Main";
import "codemirror/mode/javascript/javascript";
import "./styles/main.scss";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(
    <StrictMode>
        <Main />
    </StrictMode>
);

register();
reportWebVitals();
