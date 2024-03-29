import { Alert, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactComponent as DisconnectIcon } from "assets/illustration/disconnect.svg";
import logo from "assets/illustration/logo.png";
import { ReactComponent as ArrowForwardIosIcon } from "assets/illustration/mui-icon/arrow-forward-blue.svg";
import { ReactComponent as PowerSettingsIcon } from "assets/illustration/mui-icon/power-settings.svg";
import { ReactComponent as VisibilityIcon } from "assets/illustration/mui-icon/visibility.svg";
import { ReactComponent as ReviewerImg } from "assets/illustration/reviewer.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { useAuth } from "oidc-react";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { lunaticDatabase } from "service/lunatic-database";
import { getNavigatePath } from "service/navigation-service";
import { initializeSurveysIdsDemo } from "service/survey-service";

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
        icon: <DisconnectIcon aria-label={t("page.alert-when-quit.alt-alert-icon")} />,
    };

    const onDisconnect = useCallback(() => {
        setIsAlertDisplayed(true);
    }, [isAlertDisplayed]);

    const disconnect = useCallback(() => {
        window.localStorage.clear();
        lunaticDatabase
            .clear()
            .then(() =>
                auth.userManager.signoutRedirect({
                    id_token_hint: localStorage.getItem("id_token") ?? undefined,
                }),
            )
            .then(() => auth.userManager.clearStaleState())
            .then(() => auth.userManager.signoutRedirectCallback())
            .then(() => {
                sessionStorage.clear();
                localStorage.clear();
            })
            .then(() => auth.userManager.clearStaleState())
            .then(() => localStorage.removeItem("auth"))
            .then(() => window.location.replace(process.env.REACT_APP_PUBLIC_URL || ""));
    }, []);

    const navToSurveysOverview = useCallback(() => {
        localStorage.setItem(LocalStorageVariableEnum.IS_DEMO_MODE, "false");
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_SURVEYS_OVERVIEW));
    }, []);

    const navToDemonstration = useCallback(() => {
        localStorage.setItem(LocalStorageVariableEnum.IS_DEMO_MODE, "true");
        initializeSurveysIdsDemo().finally(() => {
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
                    <>
                        <img
                            className={classes.logoImg}
                            src={logo}
                            alt={t("accessibility.asset.logo-alt")}
                        />
                        <h1 className={classes.emptyHeader}>Header</h1>
                    </>
                </Box>
                <Button
                    className={classes.logoutBox}
                    color="secondary"
                    startIcon={
                        <PowerSettingsIcon
                            aria-label={t("accessibility.asset.mui-icon.power-settings")}
                        />
                    }
                    onClick={onDisconnect}
                    id={"button-logout"}
                >
                    {t("page.home.navigation.logout")}
                </Button>
            </Box>
            <FlexCenter>
                <ReviewerImg aria-label={t("accessibility.assets.reviewer-alt")} />
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
                            <ArrowForwardIosIcon
                                aria-label={t("accessibility.asset.mui-icon.arrow-forward")}
                            />
                        }
                        onClick={navToSurveysOverview}
                        id="button-surveys-overview"
                    >
                        {t("page.reviewer-home.navigation.surveys")}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={
                            <VisibilityIcon aria-label={t("accessibility.asset.mui-icon.visibility")} />
                        }
                        onClick={navToDemonstration}
                        id="button-demo"
                    >
                        {t("page.reviewer-home.navigation.demo")}
                    </Button>
                </Box>
            </FlexCenter>
            <Outlet />
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
    logoutBox: {
        height: "4rem",
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
    emptyHeader: {
        visibility: "hidden",
    },
}));

export default HomeReviewerPage;
