import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { AuthContextProps, User } from "oidc-react";

let user: any;
let userToken: string;
let auth: AuthContextProps;

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
    if (user?.profile?.inseegroupedefaut?.includes(EdtUserRightsEnum.REVIEWER)) {
        return EdtUserRightsEnum.REVIEWER;
    } else if (user?.profile?.inseegroupedefaut?.includes(EdtUserRightsEnum.SURVEYED)) {
        return EdtUserRightsEnum.SURVEYED;
    } else {
        return EdtUserRightsEnum.NO_RIGHTS;
    }
};
