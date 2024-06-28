import { Alert, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Typography } from "@mui/material";
import activitySurveySource from "activity-survey.json";
import { ReactComponent as DisconnectIcon } from "assets/illustration/disconnect.svg";
import { ReactComponent as DefaultErrorIcon } from "assets/illustration/error/error.svg";
import { ReactComponent as HelpIcon } from "assets/illustration/mui-icon/help-white.svg";
import { ReactComponent as HomeIcon } from "assets/illustration/mui-icon/home.svg";
import { ReactComponent as PowerSettingsIcon } from "assets/illustration/mui-icon/power-settings-white.svg";
import { ReactComponent as ReplayIcon } from "assets/illustration/mui-icon/replay.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useAuth } from "oidc-react";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { lunaticDatabase } from "service/lunatic-database";
import { getNavigatePath, setEnviro } from "service/navigation-service";
import { getData, getSurveyRights, surveysIds } from "service/survey-service";

export type ErrorPageProps = {
    errorCode?: ErrorCodeEnum;
    atInit?: boolean;
    atBoundary?: boolean;
};

const ErrorPage = (props: ErrorPageProps) => {
    const { errorCode, atInit = false, atBoundary = false } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const auth = useAuth();
    const [isAlertDisplayed, setIsAlertDisplayed] = React.useState<boolean>(false);
    const onDisconnect = useCallback(() => setIsAlertDisplayed(true), [isAlertDisplayed]);
    const source = activitySurveySource;

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

    let navigate: NavigateFunction = useNavigate();

    const navToHome = useCallback(() => {
        console.log("navigate to home");
        if (navigate) {
            navigate("/");
        }
    }, []);

    const retryInitialize = useCallback(() => {
        window.location.href = window.location.origin;
    }, []);

    const getErrorText = (errorCode: ErrorCodeEnum | undefined): string => {
        switch (errorCode) {
            case ErrorCodeEnum.NO_RIGHTS:
                return t("common.error.error-no-rights");
            case ErrorCodeEnum.UNREACHABLE_SOURCE:
                return t("common.error.error-get-surveys-sources");
            case ErrorCodeEnum.UNREACHABLE_SURVEYS_ASSIGNMENTS:
                return t("common.error.error-get-surveys-assignments");
            case ErrorCodeEnum.UNREACHABLE_SURVEYS_DATAS:
                return t("common.error.error-get-surveys-data");
            case ErrorCodeEnum.UNREACHABLE_NOMENCLATURES:
                return t("common.error.error-nomenclatures");
            case ErrorCodeEnum.COMMON:
                return t("common.error.error-default");
            default:
                return t("common.error.error-default");
        }
    };

    const getErrorActionButton = (errorCode: ErrorCodeEnum | undefined) => {
        if (errorCode === ErrorCodeEnum.NO_RIGHTS || atInit) {
            return (
                <Button
                    className={classes.button}
                    variant="contained"
                    startIcon={<ReplayIcon aria-label={t("accessibility.asset.mui-icon.replay")} />}
                    onClick={retryInitialize}
                >
                    {t("common.navigation.retry")}
                </Button>
            );
        } else {
            return (
                <>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={<HelpIcon aria-label={t("accessibility.asset.mui-icon.help")} />}
                        onClick={navToHelp}
                    >
                        {t("page.home.navigation.link-help-label")}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={<HomeIcon aria-label={t("accessibility.asset.mui-icon.home")} />}
                        onClick={navToHome}
                    >
                        {t("common.navigation.back-to-home")}
                    </Button>
                </>
            );
        }
    };

    const disconnect = useCallback(() => {
        auth.userManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token") ?? undefined,
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

    const navToHelp = useCallback(() => {
        if (navigate) {
            const idSurvey = surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS][0];
            let data = getData(idSurvey || "");
            let context: OrchestratorContext = {
                source: source,
                data: data,
                idSurvey: idSurvey,
                surveyRootPage: EdtRoutesNameEnum.WORK_TIME,
                global: true,
                rightsSurvey: getSurveyRights(idSurvey ?? ""),
            };
            localStorage.setItem(LocalStorageVariableEnum.IS_GLOBAL, "true");
            setEnviro(context, navigate, callbackHolder);
            navigate(getNavigatePath(EdtRoutesNameEnum.HELP_INSTALL));
        }
    }, []);

    return (
        <>
            <FlexCenter>
                <Alert {...alertProps} />
            </FlexCenter>
            <PageIcon icon={<DefaultErrorIcon aria-label={t("accessibility.asset.error.default")} />} />
            <Box className={classes.textBox}>
                <Typography>{t("common.error.error-default-title")}</Typography>
                <br />
                <Typography>{getErrorText(errorCode)}</Typography>
                <br />
                <Typography>
                    {t("common.error.error-user-info") + auth.userData?.profile?.preferred_username}
                </Typography>
            </Box>
            {!atBoundary && (
                <FlexCenter>
                    <Box className={classes.buttonBox}>
                        {getErrorActionButton(errorCode)}
                        <Button
                            className={classes.button}
                            variant="contained"
                            startIcon={
                                <PowerSettingsIcon
                                    aria-label={t("accessibility.asset.mui-icon.power-settings")}
                                />
                            }
                            onClick={onDisconnect}
                        >
                            {t("page.home.navigation.logout")}
                        </Button>
                    </Box>
                </FlexCenter>
            )}
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
    buttonBox: {
        marginTop: "4rem",
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        justifyContent: "center",
    },
    button: {
        margin: "0.25rem",
    },
}));

export default ErrorPage;
