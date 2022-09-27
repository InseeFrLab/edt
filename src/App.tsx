import React from "react";
import "./App.scss";
import Home from "./page/Home";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { OrchestratorForStories } from "./orchestrator/Orchestrator";
import source from "./local-test-source.json";
import { theme } from "lunatic-edt/dist/ui/theme/theme";
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Home></Home>
            {/*<OrchestratorForStories source={source} data={{}}></OrchestratorForStories>*/}
        </ThemeProvider>
    );
}

export default App;
