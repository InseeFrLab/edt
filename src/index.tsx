import { theme } from "@inseefrlab/lunatic-edt";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { OidcProvider } from "./components/OidcProvider.tsx";
import { ReloadPrompt } from "./components/ReloadPrompt.tsx";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <OidcProvider>
        <React.StrictMode>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme />
                    <App />
                    <ReloadPrompt />
                </ThemeProvider>
            </StyledEngineProvider>
        </React.StrictMode>
    </OidcProvider>,
);
