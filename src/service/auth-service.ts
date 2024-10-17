import { WebStorageStateStore } from "oidc-client-ts";
import { UserManager } from "oidc-react";
import { getAuth } from "./user-service";

const url = import.meta.env.VITE_KEYCLOAK_AUTHORITY ?? "";
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? "";
const redirectUri = import.meta.env.VITE_KEYCLOAK_REDIRECT_URI ?? "";
const protocol = "protocol/openid-connect/auth";
const attributes = window.location.search;
const isSSO = attributes.includes("kc_idp_hint");
const attributeSSO = attributes.substring(1, attributes.length);

const createUserManager = () => {
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
        metadata: navigator.onLine ? METADATA_OIDC : undefined,
    });

    userManager.events.addAccessTokenExpired(() => {
        if (navigator.onLine) {
            signinSilent(userManager);
        }
    });

    return userManager;
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

const logout = () => {
    let auth = getAuth();
    auth.userManager
        .signoutRedirect({
            id_token_hint: localStorage.getItem("id_token") ?? undefined,
        })
        .then(() => auth.userManager.clearStaleState())
        .then(() => auth.userManager.signoutRedirectCallback())
        .then(() => {
            sessionStorage.clear();
            localStorage.clear();
        })
        .then(() => auth.userManager.clearStaleState())
        .then(() => window.location.replace(import.meta.env.BASE_URL ?? ""));
};

export { createUserManager, isSSO, logout, signinSilent };
