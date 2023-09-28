import { Info, InfoProps, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Typography } from "@mui/material";
import InfoIcon from "assets/illustration/info.svg";
import sendIcon from "assets/illustration/mui-icon/send.svg";
import submit_icon from "assets/illustration/submit.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { StateData, SurveyData } from "interface/entity/Api";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { remotePutSurveyData, remotePutSurveyDataReviewer } from "service/api-service";
import { getFlatLocalStorageValue } from "service/local-storage-service";
import {
    getNavigatePath,
    getParameterizedNavigatePath,
    navToHome,
    setEnviro,
} from "service/navigation-service";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";
import { isPwa } from "service/responsive";
import { surveyReadOnly } from "service/survey-activity-service";
import { getCurrentPage, initializeSurveysDatasCache, saveData, setValue } from "service/survey-service";
import { isReviewer } from "service/user-service";
import { getSurveyIdFromUrl } from "utils/utils";

const EndSurveyPage = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);

    const navigate = useNavigate();

    setEnviro(context, useNavigate(), callbackHolder);

    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);
    const [errorSubmit, setErrorSubmit] = useState<boolean>(false);
    const isActivitySurvey = getCurrentSurveyRootPage() === EdtRoutesNameEnum.ACTIVITY ? true : false;
    const isDemoMode = getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";
    // Online state
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        // Update network status
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };
        // Listen to the online status
        window.addEventListener("online", handleStatusChange);
        // Listen to the offline status
        window.addEventListener("offline", handleStatusChange);
        // Specify how to clean up after this effect for performance improvment
        return () => {
            window.removeEventListener("online", handleStatusChange);
            window.removeEventListener("offline", handleStatusChange);
        };
    }, [isOnline]);

    const infoLabels: InfoProps = {
        boldText: t("page.end-survey.online-tooltip-text"),
        infoIcon: InfoIcon,
        infoIconAlt: t("accessibility.asset.info.info-alt"),
        infoIconTooltip: InfoIcon,
        infoIconTooltipAlt: t("accessibility.asset.info.info-alt"),
        border: true,
    };

    const saveDataAndInit = useCallback((surveyData: SurveyData) => {
        saveData(idSurvey, surveyData.data).then(() => {
            initializeSurveysDatasCache().finally(() => {
                setIsModalDisplayed(true);
            });
        });
    }, []);

    const remoteSaveSurveyAndGoBackHome = useCallback(() => {
        const dataWithIsEnvoyed = setValue(idSurvey, FieldNameEnum.ISENVOYED, true);
        const stateData: StateData = {
            state: StateDataStateEnum.COMPLETED,
            date: Date.now(),
            currentPage: getCurrentPage(callbackHolder.getData(), context.source),
        };

        const surveyData: SurveyData = {
            stateData: stateData,
            data: dataWithIsEnvoyed ?? callbackHolder.getData(),
        };

        if (!isDemoMode && !isReviewer()) {
            remotePutSurveyData(idSurvey, surveyData)
                .then(surveyDataAnswer => {
                    surveyData.data.lastRemoteSaveDate = surveyDataAnswer.stateData?.date;
                    saveDataAndInit(surveyData);
                })
                .catch(() => {
                    setErrorSubmit(true);
                });
        } else if (!isDemoMode && isReviewer()) {
            remotePutSurveyDataReviewer(idSurvey, stateData, surveyData.data)
                .then(surveyDataAnswer => {
                    surveyData.data.lastRemoteSaveDate = surveyDataAnswer.stateData?.date;
                    saveDataAndInit(surveyData);
                })
                .catch(() => {
                    setErrorSubmit(true);
                });
        } else {
            saveDataAndInit(surveyData);
        }
    }, []);

    const onPrevious = useCallback(() => {
        if (isActivitySurvey) {
            navigate(
                getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
                    getNavigatePath(EdtRoutesNameEnum.PHONE_TIME),
            );
        } else {
            navigate(
                getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, idSurvey) +
                    getNavigatePath(EdtRoutesNameEnum.KIND_OF_WEEK),
            );
        }
    }, []);

    const validateAndNav = (
        forceQuit: boolean,
        setIsModalDisplayed: (value: SetStateAction<boolean>) => void,
    ): void => {
        if (forceQuit) {
            navToHome();
        } else {
            setIsModalDisplayed(true);
        }
    };

    const isNavMobile = !isPwa() && isMobile;

    return (
        <SurveyPage
            idSurvey={idSurvey}
            onNavigateBack={navToHome}
            displayStepper={true}
            onPrevious={onPrevious}
            simpleHeader={true}
        >
            <PageIcon
                withMargin={false}
                srcIcon={submit_icon}
                altIcon={t("accessibility.asset.submit-alt")}
            />
            <Box className={cx(classes.endContentBox, isNavMobile ? classes.endContentBoxMobile : "")}>
                <Box>
                    <Box className={classes.contentBox}>
                        <h3>
                            {isActivitySurvey
                                ? t("page.end-survey.end-of-activity-survey")
                                : t("page.end-survey.end-of-work-time-survey")}
                        </h3>
                        <Typography>{t("page.end-survey.end-explanation")}</Typography>
                    </Box>

                    <FlexCenter>
                        {isOnline ? (
                            <Info {...infoLabels} />
                        ) : (
                            <Box className={classes.offline}>
                                <Info isAlertInfo={true} {...infoLabels} />
                            </Box>
                        )}
                    </FlexCenter>
                </Box>
                <Box>
                    <FlexCenter className={classes.actionBox}>
                        {isOnline ? (
                            <Button
                                className={cx(isNavMobile ? classes.actionBox : classes.sendButton)}
                                variant="contained"
                                onClick={remoteSaveSurveyAndGoBackHome}
                                endIcon={
                                    <img src={sendIcon} alt={t("accessibility.asset.mui-icon.send")} />
                                }
                                id="send-button"
                                disabled={
                                    context.surveyRootPage == EdtRoutesNameEnum.WORK_TIME
                                        ? false
                                        : surveyReadOnly(context.rightsSurvey)
                                }
                            >
                                {t("common.navigation.send")}
                            </Button>
                        ) : (
                            <Button
                                className={cx(isNavMobile ? classes.actionBox : classes.sendButton)}
                                variant="contained"
                                onClick={remoteSaveSurveyAndGoBackHome}
                                endIcon={
                                    <img src={sendIcon} alt={t("accessibility.asset.mui-icon.send")} />
                                }
                                disabled={isDemoMode ? false : true}
                                id="send-button"
                            >
                                {t("common.navigation.send")}
                            </Button>
                        )}
                        {errorSubmit ? (
                            <Typography className={classes.errorSubmit}>
                                {t("common.error.error-submit-survey")}
                            </Typography>
                        ) : (
                            <></>
                        )}
                    </FlexCenter>
                </Box>
            </Box>

            <FlexCenter>
                <FelicitationModal
                    isModalDisplayed={isModalDisplayed}
                    onCompleteCallBack={useCallback(
                        () => validateAndNav(true, setIsModalDisplayed),
                        [isModalDisplayed],
                    )}
                    content={
                        isActivitySurvey
                            ? t("component.modal-edt.modal-felicitation.activity-content")
                            : t("component.modal-edt.modal-felicitation.survey-content")
                    }
                />
            </FlexCenter>
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { EndSurveyPage } })(theme => ({
    endContentBox: {
        display: "flex",
        flexDirection: "column",
        height: "85vh",
    },
    endContentBoxMobile: {
        height: "60vh",
    },
    contentBox: {
        display: "flex",
        flexDirection: "column",
        padding: "0 1rem",
        textAlign: "center",
    },
    actionBox: {
        marginTop: "1rem",
        marginBottom: "1rem",
    },
    sendButton: {
        padding: "0.5rem 2rem",
        margin: "1rem",
    },
    offline: {
        color: theme.palette.error.main + " !important",
    },
    errorSubmit: {
        color: theme.palette.error.main,
    },
    pageIcon: {
        margin: "0",
    },
}));

export default EndSurveyPage;
