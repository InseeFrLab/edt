import { theme } from "@inseefrlab/lunatic-edt";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { AuthProvider } from "oidc-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { getUserRights } from "service/user-service";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const getAuthority = () => {
    const authorityForReviewer = window.location.pathname.includes(
        process.env.REACT_APP_KEYCLOAK_AUTHORITY_REVIEWER ?? "kcidphint=insee-ssp",
    )
        ? process.env.REACT_APP_KEYCLOAK_AUTHORITY_REVIEWER
        : process.env.REACT_APP_KEYCLOAK_AUTHORITY;

    const authority =
        getUserRights() === EdtUserRightsEnum.REVIEWER
            ? authorityForReviewer
            : process.env.REACT_APP_KEYCLOAK_AUTHORITY;
    console.log("oidc config - authority", authority);

    return authority;
};

const oidcConfig = {
    onSignIn: () => {
        //to remove keycloak params in url
        window.history.replaceState(null, "", window.location.pathname);
    },
    authority: getAuthority(),
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    redirectUri: process.env.REACT_APP_KEYCLOAK_REDIRECT_URI,
};

root.render(
    <AuthProvider {...oidcConfig}>
        <React.StrictMode>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme />
                    <App />
                </ThemeProvider>
            </StyledEngineProvider>
        </React.StrictMode>
    </AuthProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
