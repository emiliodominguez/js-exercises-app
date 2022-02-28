import React from "react";
import { render } from "react-dom";
import { register } from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import Main from "./components/Main";
import "./styles/main.scss";

// Code mirror Javascript configuration
require("codemirror/mode/javascript/javascript");

render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>,
    document.getElementById("root")
);

register();
reportWebVitals();
