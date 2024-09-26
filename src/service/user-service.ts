import { EdtUserRightsEnum } from "../enumerations/EdtUserRightsEnum";
import { AuthContextProps } from "oidc-react";
import { useOnline } from "../hooks/useOnline.ts";

let globalAuth: AuthContextProps | undefined;

/**
 * @deprecated This method is kept to avoid to edit a lot of code but should not be used
 */
export const useGlobalUserState = (auth: AuthContextProps) => {
    const isOnline = useOnline();
    if (!isOnline) {
        return;
    }

    globalAuth = auth;
};

export const getAuth = (): AuthContextProps => {
    if (!globalAuth) {
        throw new Error("User must be authenticated");
    }
    return globalAuth;
};

export const getUserToken = (): string => {
    return globalAuth?.userData?.access_token ?? "";
};

/**
 * @deprecated
 */
export const getUserRights = (): EdtUserRightsEnum => {
    const groups = globalAuth?.userData?.profile?.inseegroupedefaut as string[];
    if (groups?.includes(import.meta.env.VITE_REVIEWER_ROLE ?? EdtUserRightsEnum.REVIEWER)) {
        return EdtUserRightsEnum.REVIEWER;
    } else if (groups?.includes(import.meta.env.VITE_SURVEYED_ROLE ?? EdtUserRightsEnum.SURVEYED)) {
        return EdtUserRightsEnum.SURVEYED;
    } else {
        return EdtUserRightsEnum.NO_RIGHTS;
    }
};

export const isReviewer = (): boolean => getUserRights() === EdtUserRightsEnum.REVIEWER;
