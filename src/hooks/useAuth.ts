import { useAuth as useOidcAuth } from "oidc-react";
import { lunaticDatabase } from "../service/lunatic-database.ts";
import { useEffect, useMemo } from "react";
import { useOnline } from "./useOnline.ts";
import { EdtUserRightsEnum } from "../enumerations/EdtUserRightsEnum.ts";
import { useGlobalUserState } from "../service/user-service.ts";

export const authKey = "auth";

type AuthCache = { username: string; role: EdtUserRightsEnum };

/**
 * Custom auth hook to provide essential functionalities
 */
export function useAuth({ persistState = false }: { persistState: boolean } = { persistState: false }) {
    const isOnline = useOnline();
    const auth = useOidcAuth();
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
            window.location.replace(import.meta.env.BASE_URL || "");
            return;
        }
        await auth.userManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token") ?? undefined,
        });
        await auth.userManager.clearStaleState();
        await auth.userManager.signoutRedirectCallback();
        window.location.replace(import.meta.env.BASE_URL || "");
    };

    // Persist the auth state
    if (persistState) {
        // Make auth info globally available (so API call can use access token for instance)
        useGlobalUserState(auth);

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

        // Disconnect the user on renewal error
        useEffect(() => {
            auth.userManager.events.addSilentRenewError(logout);
        }, [auth]);
    }

    return {
        isAuthenticated: !!username,
        username,
        role: isOnline ? role : offlineData?.role,
        logout,
    };
}
