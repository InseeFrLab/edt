import { EdtUserRightsEnum } from "../enumerations/EdtUserRightsEnum";
import { AuthContextProps } from "oidc-react";

type AuthContext = {
    role?: EdtUserRightsEnum;
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
    return globalAuth?.role ?? EdtUserRightsEnum.NO_RIGHTS;
};

export const isReviewer = (): boolean => globalAuth?.role === EdtUserRightsEnum.REVIEWER;
