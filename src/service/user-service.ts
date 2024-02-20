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
    if (
        user?.profile?.inseegroupedefaut?.includes(
            process.env.REACT_APP_REVIEWER_ROLE ?? EdtUserRightsEnum.REVIEWER,
        )
    ) {
        return EdtUserRightsEnum.REVIEWER;
    } else if (
        user?.profile?.inseegroupedefaut?.includes(
            process.env.REACT_APP_SURVEYED_ROLE ?? EdtUserRightsEnum.SURVEYED,
        )
    ) {
        return EdtUserRightsEnum.SURVEYED;
    } else {
        return EdtUserRightsEnum.NO_RIGHTS;
    }
};

export const isReviewer = (): boolean => getUserRights() === EdtUserRightsEnum.REVIEWER;
