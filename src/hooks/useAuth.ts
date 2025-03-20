import { useAuth as useOidcAuth } from "oidc-react";
import { lunaticDatabase } from "../service/lunatic-database.ts";
import { useEffect, useMemo } from "react";
import { useOnline } from "./useOnline.ts";
import { EdtUserRightsEnum } from "../enumerations/EdtUserRightsEnum.ts";
import { useGlobalUserState } from "../service/user-service.ts";

export const authKey = "auth";

type AuthCache = { username: string; role: EdtUserRightsEnum };

const offlineOidcAuth: ReturnType<typeof useOidcAuth> = {
    isLoading: false,
    signIn(): Promise<void> {
        return Promise.resolve(undefined);
    },
    signInPopup(): Promise<void> {
        return Promise.resolve(undefined);
    },
    signOut(): Promise<void> {
        return Promise.resolve(undefined);
    },
    signOutRedirect(): Promise<void> {
        return Promise.resolve(undefined);
    },
    // @ts-expect-error userManager doesn't exist if we are offline
    userManager: undefined,
    userData: null
}

/**
 * Custom auth hook to provide essential functionalities
 */
export function useAuth({ persistState = false }: { persistState: boolean } = { persistState: false }) {
    const isOnline = useOnline();
    let auth = offlineOidcAuth
    try {
        auth = useOidcAuth();
    } catch (e) {}
    const authUsername = auth.userData?.profile.preferred_username;
    const groups = auth.userData?.profile?.inseegroupedefaut as string[] | undefined;
    const role = useMemo(() => {
        if (groups?.includes(import.meta.env.VITE_REVIEWER_ROLE ?? EdtUserRightsEnum.REVIEWER)) {
            return EdtUserRightsEnum.REVIEWER;
        }
        return groups?.includes(import.meta.env.VITE_SURVEYED_ROLE ?? EdtUserRightsEnum.SURVEYED)
            ? EdtUserRightsEnum.SURVEYED
            : EdtUserRightsEnum.NO_RIGHTS;
    }, [groups]);

    const offlineData = useMemo(() => {
        if (isOnline) {
            return null;
        }
        try {
            const store = localStorage.getItem(authKey);
            if (store) {
                return JSON.parse(store) as AuthCache;
            }
        } catch {
            return null;
        }
    }, [isOnline]);
    const username = isOnline ? authUsername : offlineData?.username;

    const logout = async () => {
        localStorage.clear();
        await lunaticDatabase.clear();

        if (!auth.userManager) {
            window.location.replace(import.meta.env.VITE_PUBLIC_URL || "");
            return;
        }
        await auth.userManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token") ?? undefined,
        });
        await auth.userManager.clearStaleState();
        await auth.userManager.signoutRedirectCallback();
        window.location.replace(import.meta.env.VITE_PUBLIC_URL || "");
    };

    // Persist the auth state
    if (persistState) {
        // Make auth info globally available (so API call can use access token for instance)
        useGlobalUserState({
            role: isOnline ? role : offlineData?.role,
            oidcAuth: auth,
        });

        // Persist some key user info in the localStorage for offline usage
        useEffect(() => {
            if (!window.navigator.onLine) {
                return;
            }

            if (authUsername) {
                localStorage.setItem(
                    authKey,
                    JSON.stringify({ username: authUsername, role: role } satisfies AuthCache),
                );
            } else {
                localStorage.removeItem(authKey);
            }
        }, [authUsername, role]);

        // Disconnect the user on renewal error if online
        useEffect(() => {
            if(!auth.userManager) {
                return;
            }
            const cb = () => {
                if (window.navigator.onLine) {
                    logout().catch(console.error);
                }
            };
            auth.userManager.events.addSilentRenewError(cb);
            return () => {
                auth.userManager.events.removeSilentRenewError(cb);
            };
        }, [auth]);
    }

    console.log(
    {
        isAuthenticated: !!username,
            username,
            role: isOnline ? role : offlineData?.role,
        logout,
    })

    return {
        isAuthenticated: !!username,
        username,
        role: isOnline ? role : offlineData?.role,
        logout,
    };
}
