import { theme } from "@inseefrlab/lunatic-edt";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { AuthProvider } from "oidc-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createUserManager, isSSO } from "service/auth-service";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const getAuthority = () => {
    const authority = process.env.REACT_APP_KEYCLOAK_AUTHORITY;
    return authority;
};

const oidcConfigSSO = {
    userManager: createUserManager(),
};

const currentHost = `${window.location.protocol}//${window.location.hostname}`;

const oidcConfigOnline = {
    onSignIn: () => {
        //to remove keycloak params in url
        window.history.replaceState(null, "", window.location.pathname);
    },
    authority: getAuthority(),
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    redirectUri: process.env.REACT_APP_KEYCLOAK_REDIRECT_URI,
    automaticSilentRenew: true,
};

const oidcConfigOffline = {
    automaticSilentRenew: false,
    silent_redirect_uri: currentHost,
};

let oidcPropss = {};

if (navigator.onLine) {
    if (isSSO) {
        oidcPropss = Object.assign(oidcConfigOnline, oidcConfigSSO);
    } else {
        oidcPropss = oidcConfigOnline;
    }
} else {
    oidcPropss = oidcConfigOnline;
}

const oidcProps = navigator.onLine
    ? isSSO
        ? Object.assign(oidcConfigOnline, oidcConfigSSO)
        : oidcConfigOnline
    : oidcConfigOffline;

root.render(
    <AuthProvider {...oidcPropss}>
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
