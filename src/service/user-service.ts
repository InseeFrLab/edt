import { EdtUserRightsEnum } from "../enumerations/EdtUserRightsEnum";
import { AuthContextProps } from "oidc-react";

type AuthContext = {
    role?: string;
    oidcAuth?: AuthContextProps;
};

let globalAuth: AuthContext | undefined;

/**
 * @deprecated This method is kept to avoid to edit a lot of code but should not be used
 */
export const useGlobalUserState = (auth: AuthContext) => {
    globalAuth = auth;
};

/**
 * @deprecated This method should not be used directly
 */
export const getAuth = (): AuthContextProps => {
    if (!globalAuth?.oidcAuth) {
        throw new Error("User must be authenticated");
    }
    return globalAuth?.oidcAuth;
};

export const getUserToken = (): string => {
    return globalAuth?.oidcAuth?.userData?.access_token ?? "";
};

/**
 * @deprecated
 */
export const getUserRights = (): EdtUserRightsEnum => {
    const role = globalAuth?.role;
    if (role?.includes(import.meta.env.VITE_REVIEWER_ROLE ?? EdtUserRightsEnum.REVIEWER)) {
        return EdtUserRightsEnum.REVIEWER;
    } else if (role?.includes(import.meta.env.VITE_SURVEYED_ROLE ?? EdtUserRightsEnum.SURVEYED)) {
        return EdtUserRightsEnum.SURVEYED;
    }
    return EdtUserRightsEnum.NO_RIGHTS;
};

export const isReviewer = (): boolean => getUserRights() === EdtUserRightsEnum.REVIEWER;
