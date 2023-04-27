import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { User } from "oidc-react";

let user: any;
let userToken: string;

export const setUser = (loggedUser: User | null): void => {
    user = loggedUser;
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
