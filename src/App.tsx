import "App.scss";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import "i18n/i18n";
import { User, useAuth } from "oidc-react";
import ErrorPage from "pages/error/Error";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EdtRoutes } from "routes/EdtRoutes";
import {
    getAuthCache,
    getDatas,
    initPropsAuth,
    initializeDatas,
    initializeListSurveys,
} from "service/survey-service";
import { getUserRights, setAuth, setUser, setUserToken } from "service/user-service";
import { getCookie } from "utils/utils";

const App = () => {
    const { t } = useTranslation();
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState<ErrorCodeEnum | undefined>(undefined);
    const auth = useAuth();

    const getTokenHint = () => {
        return localStorage.getItem("id_token") ?? undefined;
    };

    const setErrorType = (err: any) => {
        if (err.response.status === 403) {
            setError(ErrorCodeEnum.NO_RIGHTS);
        } else {
            setError(ErrorCodeEnum.COMMON);
        }
    };
    const promisesToWait: Promise<any>[] = [];

    useEffect(() => {
        if (
            window.location.search &&
            getCookie("KC_RESTART") == null &&
            localStorage.getItem("setauth") == null
        ) {
            localStorage.setItem("setauth", "yes");
            window.location.search = "";
        }
        if (auth?.userData?.access_token && getDatas().size === 0 && error === undefined) {
            setUserToken(auth.userData?.access_token);
            setUser(auth.userData);
            setAuth(auth);
            //keeps user token up to date after session renewal
            auth.userManager.events.addUserLoaded(() => {
                auth.userManager.getUser().then(user => {
                    setUserToken(user?.access_token || "");
                });
            });

            auth.userManager.events.addSilentRenewError(() => {
                if (navigator.onLine) {
                    auth.userManager
                        .signoutRedirect({
                            id_token_hint: getTokenHint(),
                        })
                        .then(() => auth.userManager.clearStaleState())
                        .then(() => auth.userManager.signoutRedirectCallback())
                        .then(() => {
                            sessionStorage.clear();
                            localStorage.clear();
                        })
                        .then(() => auth.userManager.clearStaleState())
                        .then(() => window.location.replace(process.env.REACT_APP_PUBLIC_URL || ""))
                        .catch(err => {
                            setErrorType(err);
                        });
                }
            });

            //auth.userManager.startSilentRenew();
            promisesToWait.push(
                initializeDatas(setError).then(() => {
                    setInitialized(true);
                    return initPropsAuth(auth).then(() => {
                        setInitialized(true);
                    });
                }),
            );

            if (getUserRights() === EdtUserRightsEnum.REVIEWER && navigator.onLine) {
                promisesToWait.push(
                    initializeListSurveys(setError).then(() => {
                        setInitialized(true);
                    }),
                );
            }
            Promise.all(promisesToWait);
        } else if (!navigator.onLine) {
            getAuthCache().then(auth => {
                if (auth?.data.userData?.access_token) {
                    const user: User = {
                        access_token: auth.data.userData?.access_token,
                        expires_at: auth.data.userData?.expires_at,
                        id_token: auth.data.userData?.id_token,
                        profile: auth.data.userData?.profile,
                        refresh_token: auth.data.userData?.refresh_token,
                        scope: auth.data.userData?.scope,
                        session_state: auth.data.userData?.session_state ?? "",
                        token_type: auth.data.userData?.token_type ?? "",
                        state: auth.data.userData.state,
                        expires_in: auth.data.userData.expires_in,
                        expired: auth.data.userData.expired,
                        scopes: auth.data.userData.scopes ?? [],
                        toStorageString: () => "",
                    };
                    setUserToken(auth.data.userData?.access_token);
                    setUser(user);
                }

                promisesToWait.push(
                    initializeDatas(setError).then(() => {
                        if (getUserRights() === EdtUserRightsEnum.REVIEWER) {
                            return initializeListSurveys(setError).then(() => {
                                setInitialized(true);
                            });
                        } else setInitialized(true);
                    }),
                );

                Promise.all(promisesToWait);
            });
        }
    }, [auth]);

    const errorOrLoadingPage = () => {
        return !error ? (
            <LoadingFull
                message={t("page.home.loading.message")}
                thanking={t("page.home.loading.thanking")}
            />
        ) : (
            <ErrorPage errorCode={error} atInit={true} />
        );
    };

    return <>{initialized && !error ? <EdtRoutes /> : errorOrLoadingPage()}</>;
};

export default App;
