import React, { Component, useEffect, useState } from "react";
import "./App.scss";

import { CssBaseline } from "@mui/material";
import { OrchestratorForStories } from "./orchestrator/Orchestrator";
import { ThemeProvider } from "lunatic-edt";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import frFile from "./i18n/fr.json";
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

const App = () => {
    const data = {};
    const [source, setSource] = useState(null as object | null);

    useEffect(() => {
        // this is temporary !!! TODO : replace when we know how we shoulmd do it ! This was to prenvent a source.json in the repo
        const url = "https://pogues-back-office-insee.k8s.keyconsulting.fr/api/persistence/questionnaire/json-lunatic/l8lq5lp6";

        fetch(url)
            .then(sourcePromise => sourcePromise.json())
            .then(source => setSource(source));
    }, []);

    return source && data ? (
        <ThemeProvider>
            <CssBaseline enableColorScheme />
            <Home></Home>
            <OrchestratorForStories source={source} data={data}></OrchestratorForStories>
        </ThemeProvider>
    ) : (
        <div>Chargement du questionnaire...</div>
    );
}

export default App;