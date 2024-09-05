import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Typography } from "@mui/material";
import PageIcon from "../../components/commons/PageIcon/PageIcon";
import HomeIcon from "../../assets/illustration/mui-icon/home.svg?react";

import DefaultErrorIcon from "../../assets/illustration/error/error.svg?react";
import PowerSettingsIcon from "../../assets/illustration/mui-icon/power-settings-white.svg?react";
import ErrorPage from "../../pages/error/ErrorPage";
import { useTranslation } from "react-i18next";
import FlexCenter from "../../components/commons/FlexCenter/FlexCenter";
import { useCallback } from "react";
import { useAuth } from "oidc-react";
import { lunaticDatabase } from "../../service/lunatic-database";
import { NavigateFunction, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const { t } = useTranslation();
    const { classes } = useStyles();
    const auth = useAuth();

    const disconnect = useCallback(() => {
        auth.userManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token") ?? undefined,
        });
        auth.userManager.clearStaleState();
        auth.userManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            lunaticDatabase.clear();
            setTimeout(() => {
                window.location.replace(import.meta.env.VITE_PUBLIC_URL || "");
                auth.userManager.clearStaleState();
            }, 200);
        });
    }, []);

    let navigate: NavigateFunction = useNavigate();

    const navToHome = useCallback(() => {
        if (navigate) {
            navigate("/");
        }
    }, []);

    return (
        <>
            <PageIcon icon={<DefaultErrorIcon aria-label={t("accessibility.asset.error.default")} />} />
            <Box className={classes.textBox}>
                <Typography>{t("common.error.error-default-title")}</Typography>
                <br />
                <Typography>{t("page.not-found.not-found")}</Typography>
                <br />
            </Box>
            <FlexCenter>
                <Box className={classes.buttonBox}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={
                            <HomeIcon aria-label={t("accessibility.asset.mui-icon.power-settings")} />
                        }
                        onClick={navToHome}
                    >
                        {t("common.navigation.back-to-home")}
                    </Button>
                </Box>
                <Box className={classes.buttonBox}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={
                            <PowerSettingsIcon
                                aria-label={t("accessibility.asset.mui-icon.power-settings")}
                            />
                        }
                        onClick={disconnect}
                    >
                        {t("page.home.navigation.logout")}
                    </Button>
                </Box>
            </FlexCenter>
        </>
    );
};
const useStyles = makeStylesEdt({ "name": { ErrorPage } })(theme => ({
    textBox: {
        display: "flex",
        flexDirection: "column",
        color: theme.palette.error.main,
        textAlign: "center",
    },
    button: {
        margin: "0.25rem",
    },
    buttonBox: {
        marginTop: "4rem",
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        justifyContent: "center",
    },
}));
export default NotFoundPage;
