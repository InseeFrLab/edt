import React, { Component } from "react";
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

type Source = {
    source?: object;
};

export default class App extends Component<{}, Source> {
    constructor(props: object) {
        super(props);

        this.state = {
            source: undefined,
        };
    }

    componentWillMount() {
        const param = new URLSearchParams(window.location.search);
        let url =
            "https://pogues-back-office-insee.k8s.keyconsulting.fr/api/persistence/questionnaire/json-lunatic/l8lq5lp6";
        if (param.has("questionnaire")) {
            url = param?.get("questionnaire") ?? "";
        }
        fetch(url)
            .then(sourcePromise => sourcePromise.json())
            .then(source => this.setState({ source: source }));
    }
    render() {
        const { source = {} } = this.state;
        return this.state.source ? (
            <ThemeProvider>
                <CssBaseline enableColorScheme />
                <Home></Home>
                <OrchestratorForStories source={source} data={{}}></OrchestratorForStories>
            </ThemeProvider>
        ) : (
            <div>Chargement du questionnaire...</div>
        );
    }
}
