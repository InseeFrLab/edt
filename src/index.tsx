import { theme } from "@inseefrlab/lunatic-edt";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { AuthProvider } from "oidc-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createUserManager, isSSO } from "./service/auth-service";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const getAuthority = () => {
    const authority = import.meta.env.VITE_KEYCLOAK_AUTHORITY;
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
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    redirectUri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
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

console.log(navigator.onLine, oidcProps, oidcPropss);

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

