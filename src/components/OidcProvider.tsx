import { createUserManager, isSSO } from "../service/auth-service.ts";
import { type PropsWithChildren } from "react";
import { useOnline } from "../hooks/useOnline.ts";
import { AuthProvider } from "oidc-react";

const userManager = createUserManager();
const onSignIn = () => {
    window.history.replaceState(null, "", window.location.pathname);
};

/**
 * Custom OidcProvider that handle offline mode
 */
export function OidcProvider({ children }: PropsWithChildren) {
    const isOnline = useOnline();
    if (!isOnline) {
        return (
            <AuthProvider
                automaticSilentRenew={false}
                silentRedirectUri={`${window.location.protocol}//${window.location.hostname}`}
            >
                {children}
            </AuthProvider>
        );
    }
    return (
        <AuthProvider
            userManager={isSSO ? userManager : undefined}
            onSignIn={onSignIn}
            authority={import.meta.env.VITE_KEYCLOAK_AUTHORITY}
            clientId={import.meta.env.VITE_KEYCLOAK_CLIENT_ID}
            redirectUri={import.meta.env.VITE_KEYCLOAK_REDIRECT_URI}
            automaticSilentRenew={true}
        >
            {children}
        </AuthProvider>
    );
}
