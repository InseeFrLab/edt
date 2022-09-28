import React from "react";
import "./App.scss";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { OrchestratorForStories } from "./orchestrator/Orchestrator";
import source from "./local-test-source.json";
import { theme } from "lunatic-edt";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import frFile from "./lang/fr.json";
import Home from "./page/home/Home";

i18n.use(initReactI18next).init({
    resources: {
        fr: {
            translation: frFile,
        },
    },
    lng: "fr",
    fallbackLng: "fr",
    interpolation: {
        escapeValue: false,
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Home></Home>
            <OrchestratorForStories source={source} data={{}}></OrchestratorForStories>
        </ThemeProvider>
    );
}

export default App;
