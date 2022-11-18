import { CssBaseline, ThemeProvider } from "@mui/material";
import "App.scss";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import "i18n/i18n";
import { theme } from "lunatic-edt";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EdtRoutes } from "routes/EdtRoutes";
import { initializeDatas, getDatas } from "service/survey-service";

const App = () => {

    const { t } = useTranslation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (getDatas().size === 0) {
            initializeDatas()
                .then(() => {
                    console.log("DATA collected !!");
                    setInitialized(true)
                })
                .catch(err => console.error(err));
        }

    }, []);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {initialized ? (<EdtRoutes />)
                    : (
                        <LoadingFull
                            message={t("page.home.loading.message")}
                            thanking={t("page.home.loading.thanking")}
                        />
                    )}

            </ThemeProvider>
        </>
    )
};

export default App;
