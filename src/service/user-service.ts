let userToken: string;

export const getUserToken = (): string => {
    return userToken;
};

export const setUserToken = (token: string): void => {
    userToken = token;
};
