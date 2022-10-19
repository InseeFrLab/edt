import { useEffect, useState } from "react";
import "./App.scss";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { OrchestratorForStories } from "./orchestrator/Orchestrator";
import { theme } from "lunatic-edt";
import Home from "./page/home/Home";
import { LunaticData, lunaticDatabase } from "service/lunatic-database";
import "i18n/i18n";

const App = () => {
    const [data, setData] = useState(null as LunaticData | null);
    const [source, setSource] = useState(null as object | null);

    useEffect(() => {
        // this is temporary !!! TODO : replace when we know how we shoulmd do it ! This was to prenvent a source.json in the repo
        const url =
            "https://pogues-back-office-insee.k8s.keyconsulting.fr/api/persistence/questionnaire/json-lunatic/l8lq5lp6";

        fetch(url)
            .then(sourcePromise => sourcePromise.json())
            .then(source => setSource(source));

        lunaticDatabase.get("edt").then(d => {
            setData(d ? d : {});
        });
    }, []);

    return source && data ? (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Home />
            <OrchestratorForStories source={source} data={data}></OrchestratorForStories>
        </ThemeProvider>
    ) : (
        <div>Chargement du questionnaire...</div>
    );
};

export default App;
