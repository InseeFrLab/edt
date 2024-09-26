import "./App.scss";
import LoadingFull from "./components/commons/LoadingFull/LoadingFull";
import { EdtUserRightsEnum } from "./enumerations/EdtUserRightsEnum";
import { ErrorCodeEnum } from "./enumerations/ErrorCodeEnum";
import "./i18n/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EdtRoutes } from "./routes/EdtRoutes";
import { initializeDatas, initializeListSurveys } from "./service/survey-service";
import { getCookie } from "./utils/utils";
import { useAuth } from "./hooks/useAuth.ts";
import { useOnline } from "./hooks/useOnline.ts";
import { useAsyncEffect } from "./hooks/useAsyncEffect.ts";

const App = () => {
    const { t } = useTranslation();
    const { isAuthenticated, role } = useAuth({ persistState: true });
    const isOnline = useOnline();
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<ErrorCodeEnum | undefined>(undefined);

    // TODO: Explain this code
    useEffect(() => {
        if (
            window.location.search &&
            getCookie("KC_RESTART") == null &&
            localStorage.getItem("setauth") == null
        ) {
            localStorage.setItem("setauth", "yes");
            window.location.search = "";
        }
    }, []);

    // Initialize data when user is authenticated
    useAsyncEffect(async () => {
        if (!isOnline || !isAuthenticated) {
            return;
        }

        await initializeDatas(setError);
        if (role === EdtUserRightsEnum.REVIEWER) {
            await initializeListSurveys(setError);
        }
        setIsReady(true);
    }, [isAuthenticated, role]);

    if (error) {
        console.error("Error on App level", error);
    }

    if (!isReady) {
        return <LoadingFull message={t("page.home.loading.message")} />;
    }

    return <EdtRoutes />;
};

export default App;
