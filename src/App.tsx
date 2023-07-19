import "App.scss";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import "i18n/i18n";
import { useAuth } from "oidc-react";
import ErrorPage from "pages/error/Error";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EdtRoutes } from "routes/EdtRoutes";
import { getDatas, initializeDatas, initializeListSurveys } from "service/survey-service";
import { getUserRights, setAuth, setUser, setUserToken } from "service/user-service";

const App = () => {
    const { t } = useTranslation();
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState<ErrorCodeEnum | undefined>(undefined);
    const auth = useAuth();

    useEffect(() => {
        console.log("auth", auth);
        console.log("auth?.userData", auth?.userData);
        console.log("auth?.userData?.access_token", auth?.userData?.access_token);

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
                            id_token_hint: localStorage.getItem("id_token") || undefined,
                        })
                        .then(() => auth.userManager.clearStaleState())
                        .then(() => auth.userManager.signoutRedirectCallback())
                        .then(() => {
                            sessionStorage.clear();
                            localStorage.clear();
                        })
                        .then(() => auth.userManager.clearStaleState())
                        .then(() => window.location.replace(process.env.REACT_APP_PUBLIC_URL || ""));
                }
            });

            initializeDatas(setError).then(() => {
                setInitialized(true);
            });

            if (getUserRights() === EdtUserRightsEnum.REVIEWER) {
                initializeListSurveys().then(() => {
                    setInitialized(true);
                });
            }
        }
    }, [auth]);

    return (
        <>
            {initialized && !error ? (
                <EdtRoutes />
            ) : !error ? (
                <LoadingFull
                    message={t("page.home.loading.message")}
                    thanking={t("page.home.loading.thanking")}
                />
            ) : (
                <ErrorPage errorCode={error} atInit={true} />
            )}
        </>
    );
};

export default App;
