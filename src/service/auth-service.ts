import { WebStorageStateStore } from "oidc-client-ts";
import { UserManager } from "oidc-react";
import { setUserSSO, setUserToken } from "./user-service";

const url = process.env.REACT_APP_KEYCLOAK_AUTHORITY ?? "";
const clientId = process.env.REACT_APP_KEYCLOAK_CLIENT_ID ?? "";
const redirectUri = process.env.REACT_APP_KEYCLOAK_REDIRECT_URI ?? "";
const protocol = "protocol/openid-connect/auth";
const attributes = window.location.search;
const isSSO = attributes.includes("kc_idp_hint");
const attributeSSO = attributes.substring(1, attributes.length);

const createUserManager = () => {
    console.log("create new usermanager for : ", attributeSSO);
    const IDENTITY_CONFIG = {
        authority: url, //(string): The URL of the OIDC provider.
        client_id: clientId, //(string): Your client application's identifier as registered with the OIDC provider.
        redirect_uri: redirectUri, //The URI of your client application to receive a response from the OIDC provider.
    };

    const METADATA_OIDC = {
        issuer: url,
        authorization_endpoint: url + protocol + "?" + attributeSSO,
        token_endpoint: url + "protocol/openid-connect/token",
        introspection_endpoint: url + protocol + "/introspect",
        userinfo_endpoint: url + protocol + "/userInfo",
        end_session_endpoint: url + protocol + "/logout",
        revocation_endpoint: url + protocol + "/revoke",
        registration_endpoint: url + "clients-registrations/openid-connect",
        jwks_uri: url + "/.well-known/openid-configuration/?" + attributeSSO,
        device_authorization_endpoint: url + protocol + "/device",
        backchannel_authentication_endpoint: url + protocol + "/ext/ciba/auth",
        pushed_authorization_request_endpoint: url + protocol + "/ext/par/request",

        grant_types_supported: [
            "authorization_code",
            "implicit",
            "refresh_token",
            "password",
            "client_credentials",
            "urn:ietf:params:oauth:grant-type:device_code",
            "urn:openid:params:grant-type:ciba",
        ],
        response_types_supported: [
            "code",
            "none",
            "id_token",
            "token",
            "id_token token",
            "code id_token",
            "code token",
            "code id_token token",
        ],
        token_endpoint_auth_methods_supported: [
            "private_key_jwt",
            "client_secret_basic",
            "client_secret_post",
            "tls_client_auth",
            "client_secret_jwt",
        ],
    };

    const userManager = new UserManager({
        ...IDENTITY_CONFIG,
        userStore: new WebStorageStateStore({ store: window.sessionStorage }),
        metadata: METADATA_OIDC,
    });

    userManager.events.addUserLoaded(user => {
        if (window.location.href.indexOf("signin-oidc") !== -1) {
            setUserToken(user?.access_token || "");
            setUserSSO(isSSO);
        }
    });

    userManager.events.addSilentRenewError(e => {
        console.log("silent renew error", e.message);
    });

    userManager.events.addAccessTokenExpired(() => {
        console.log("token expired");
        signinSilent(userManager);
    });

    userManager.metadataService.getMetadata().then(data => {
        console.log("metadata of new userManager", data);
    });

    return userManager;
};

const getUser = async (userManager: UserManager) => {
    const user = await userManager.getUser();
    if (!user) {
        return await userManager.signinRedirectCallback();
    }
    return user;
};

export const parseJwt = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
};

const signinRedirect = (userManager: UserManager) => {
    localStorage.setItem("redirectUri", window.location.pathname);
    userManager.signinRedirect({});
};

const navigateToScreen = () => {
    window.location.replace("/en/dashboard");
};

const isAuthenticated = () => {
    const url = process.env.REACT_APP_AUTH_URL;
    const clientId = process.env.REACT_APP_IDENTITY_CLIENT_ID;
    if (url != null && clientId != null) {
        const item = `oidc.user:${url}:${clientId}`;
        const oidcStorage = JSON.parse(sessionStorage.getItem(item) ?? "");

        return !!oidcStorage && !!oidcStorage.access_token;
    }
    return false;
};

const signinSilent = (userManager: UserManager) => {
    userManager
        .signinSilent()
        .then(user => {
            console.log("signed in", user);
        })
        .catch(err => {
            console.log(err);
        });
};

const signinSilentCallback = (userManager: UserManager) => {
    userManager.signinSilentCallback();
};

const logout = (userManager: UserManager) => {
    userManager.signoutRedirect({
        id_token_hint: localStorage.getItem("id_token") ?? "",
    });
    userManager.clearStaleState();
};

const signoutRedirectCallback = (userManager: UserManager) => {
    userManager.signoutRedirectCallback().then(() => {
        localStorage.clear();
        window.location.replace(process.env.REACT_APP_PUBLIC_URL ?? "");
    });
    userManager.clearStaleState();
};

export {
    createUserManager,
    getUser,
    isAuthenticated,
    isSSO,
    logout,
    navigateToScreen,
    signinRedirect,
    signinSilent,
    signinSilentCallback,
    signoutRedirectCallback,
};
