
import { Box, Button, Typography } from "@mui/material";
import { edtActivitySurvey } from "../../assets/surveyData";
import DisconnectIcon from "../../assets/illustration/disconnect.svg?react";
import DefaultErrorIcon from "../../assets/illustration/error/error.svg?react";
import HelpIcon from "../../assets/illustration/mui-icon/help-white.svg?react";
import HomeIcon from "../../assets/illustration/mui-icon/home.svg?react";
import PowerSettingsIcon from "../../assets/illustration/mui-icon/power-settings-white.svg?react";
import ReplayIcon from "../../assets/illustration/mui-icon/replay.svg?react";
import FlexCenter from "../../components/commons/FlexCenter/FlexCenter";
import PageIcon from "../../components/commons/PageIcon/PageIcon";
import { EdtRoutesNameEnum } from "../../enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "../../enumerations/ErrorCodeEnum";
import { LocalStorageVariableEnum } from "../../enumerations/LocalStorageVariableEnum";
import { SurveysIdsEnum } from "../../enumerations/SurveysIdsEnum";
import { OrchestratorContext } from "../../interface/lunatic/Lunatic";
import { callbackHolder } from "../../orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { getNavigatePath, setEnviro } from "../../service/navigation-service";
import { getData, getSurveyRights, surveysIds } from "../../service/survey-service";
import { useAuth } from "../../hooks/useAuth.ts";
import Alert from "../../components/lunatic-edt/Alert/Alert.tsx";
import { makeStylesEdt } from "../../theme/make-style-edt.ts";

export type ErrorPageProps = {
    errorCode?: ErrorCodeEnum;
    atInit?: boolean;
};

const ErrorPage = (props: ErrorPageProps) => {
    const { errorCode, atInit = false } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const { username, logout } = useAuth();
    const [isAlertDisplayed, setIsAlertDisplayed] = React.useState<boolean>(false);
    const onDisconnect = useCallback(() => setIsAlertDisplayed(true), [isAlertDisplayed]);
    const source = edtActivitySurvey;

    const alertProps = {
        isAlertDisplayed: isAlertDisplayed,
        onCompleteCallBack: logout,
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
                <Typography>{t("common.error.error-user-info") + username}</Typography>
            </Box>
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
