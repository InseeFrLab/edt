import React from "react";
import "./App.scss";
import Home from "./page/Home";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { OrchestratorForStories } from "./orchestrator/Orchestrator";
import source from "./local-test-source.json";
import { theme } from "lunatic-edt/dist/ui/theme/theme";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import frFile from "./lang/fr.json";

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
    const { t } = useTranslation();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <header>{t("common.welcome")}</header>
            <Home></Home>
            {/*<OrchestratorForStories source={source} data={{}}></OrchestratorForStories>*/}
        </ThemeProvider>
    );
}

export default App;
