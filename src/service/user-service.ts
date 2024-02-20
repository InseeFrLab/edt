import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { AuthContextProps, User } from "oidc-react";

let user: any;
let userToken: string;
let auth: AuthContextProps;
let isSSO: boolean;

export const setUser = (loggedUser: User | null): void => {
    user = loggedUser;
};

export const setAuth = (authContext: AuthContextProps): void => {
    auth = authContext;
};

export const getAuth = (): AuthContextProps => {
    return auth;
};

export const getUserToken = (): string => {
    return userToken;
};

export const setUserToken = (token: string): void => {
    userToken = token;
};

export const getUserRights = (): EdtUserRightsEnum => {
    const rights = user?.profile?.inseegroupedefaut;
    console.log("rights", rights, "isSSO", isSSO);
    if (user?.profile?.inseegroupedefaut?.includes(EdtUserRightsEnum.REVIEWER) || isSSO) {
        return EdtUserRightsEnum.REVIEWER;
    } else if (user?.profile?.inseegroupedefaut?.includes(EdtUserRightsEnum.SURVEYED)) {
        return EdtUserRightsEnum.SURVEYED;
    } else {
        return EdtUserRightsEnum.NO_RIGHTS;
    }
};

export const isReviewer = (): boolean => getUserRights() === EdtUserRightsEnum.REVIEWER;

export const setUserSSO = (_isSSO: boolean): void => {
    isSSO = _isSSO;
};

export const isUserSSO = (): boolean => {
    return isSSO;
};
