import { Alert, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import disconnectIcon from "assets/illustration/disconnect.svg";
import logo from "assets/illustration/logo.png";
import arrowForwardIos from "assets/illustration/mui-icon/arrow-forward-blue.svg";
import powerSettings from "assets/illustration/mui-icon/power-settings.svg";
import visibility from "assets/illustration/mui-icon/visibility.svg";
import reviewer from "assets/illustration/reviewer.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { useAuth } from "oidc-react";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { lunaticDatabase } from "service/lunatic-database";
import { getNavigatePath } from "service/navigation-service";
import { initializeSurveysDatasCache } from "service/survey-service";

const HomeReviewerPage = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();
    const [isAlertDisplayed, setIsAlertDisplayed] = React.useState<boolean>(false);
    const alertProps = {
        isAlertDisplayed: isAlertDisplayed,
        onCompleteCallBack: useCallback(() => disconnect(), []),
        onCancelCallBack: useCallback(() => setIsAlertDisplayed(false), [isAlertDisplayed]),
        labels: {
            boldContent: t("page.home.logout-popup.content"),
            content: "",
            cancel: t("common.navigation.cancel"),
            complete: t("page.home.navigation.logout"),
        },
        icon: disconnectIcon,
        errorIconAlt: t("page.alert-when-quit.alt-alert-icon"),
    };

    const onDisconnect = useCallback(() => setIsAlertDisplayed(true), [isAlertDisplayed]);

    const disconnect = useCallback(() => {
        auth.userManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token") || undefined,
        });
        auth.userManager.clearStaleState();
        auth.userManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            lunaticDatabase.clear();
            setTimeout(() => {
                window.location.replace(process.env.REACT_APP_PUBLIC_URL || "");
                auth.userManager.clearStaleState();
            }, 200);
        });
    }, []);

    const navToSurveysView = useCallback(() => {
        //TODO : nav to new view
    }, []);

    const navToDemonstration = useCallback(() => {
        localStorage.setItem(LocalStorageVariableEnum.IS_DEMO_MODE, "true");
        initializeSurveysDatasCache().then(() => {
            navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
        });
    }, []);

    return (
        <Box>
            <FlexCenter>
                <Alert {...alertProps} />
            </FlexCenter>
            <Box className={classes.headerBox}>
                <Box className={classes.logoBox}>
                    <img
                        className={classes.logoImg}
                        src={logo}
                        alt={t("accessibility.asset.logo-alt")}
                    />
                </Box>
                <Button
                    color="secondary"
                    startIcon={
                        <img
                            src={powerSettings}
                            alt={t("accessibility.asset.mui-icon.power-settings")}
                        />
                    }
                    onClick={onDisconnect}
                >
                    {t("page.home.navigation.logout")}
                </Button>
            </Box>
            <FlexCenter>
                <img src={reviewer} alt={t("accessibility.assets.reviewer-alt")} />
            </FlexCenter>
            <FlexCenter>
                <Box className={classes.titleBox}>
                    <h3>{t("page.reviewer-home.welcome")}</h3>
                    <h3>{t("page.reviewer-home.reviewer")}</h3>
                </Box>
            </FlexCenter>

            <FlexCenter>
                <Box className={classes.actionsBox}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        endIcon={
                            <img
                                src={arrowForwardIos}
                                alt={t("accessibility.asset.mui-icon.arrow-forward")}
                            />
                        }
                        onClick={navToSurveysView}
                    >
                        {t("page.reviewer-home.navigation.surveys")}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={
                            <img src={visibility} alt={t("accessibility.asset.mui-icon.visibility")} />
                        }
                        onClick={navToDemonstration}
                    >
                        {t("page.reviewer-home.navigation.demo")}
                    </Button>
                </Box>
            </FlexCenter>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { HomeReviewerPage } })(theme => ({
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "0.5rem",
    },
    logoBox: {
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
    },
    logoImg: {
        width: "40px",
    },
    titleBox: {
        textAlign: "center",
    },
    actionsBox: {
        display: "flex",
        flexDirection: "column",
    },
    button: {
        marginTop: "1rem",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.main,
        "&:hover": {
            color: theme.variables.white,
        },
    },
}));

export default HomeReviewerPage;
