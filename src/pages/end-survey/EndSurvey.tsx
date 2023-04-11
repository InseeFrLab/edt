import { Info, InfoProps, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Typography } from "@mui/material";
import InfoIcon from "assets/illustration/info.svg";
import sendIcon from "assets/illustration/mui-icon/send.svg";
import submit_icon from "assets/illustration/submit.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { SurveyData } from "interface/entity/Api";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import { SetStateAction, useCallback, useState } from "react";
import { Offline, Online } from "react-detect-offline";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { remotePutSurveyData } from "service/api-service";
import {
    getNavigatePath,
    getParameterizedNavigatePath,
    navToHome,
    setEnviro,
} from "service/navigation-service";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";
import { getCurrentPage, initializeSurveysDatasCache, saveData, setValue } from "service/survey-service";
import { isMobile, isBrowser } from "react-device-detect";

const EndSurveyPage = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();

    setEnviro(context, useNavigate(), callbackHolder);

    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);
    const [errorSubmit, setErrorSubmit] = useState<boolean>(false);
    const isActivitySurvey = getCurrentSurveyRootPage() === EdtRoutesNameEnum.ACTIVITY ? true : false;

    const infoLabels: InfoProps = {
        boldText: t("page.end-survey.online-tooltip-text"),
        infoIcon: InfoIcon,
        infoIconAlt: t("accessibility.asset.info.info-alt"),
        border: true,
    };

    const remoteSaveSurveyAndGoBackHome = useCallback(() => {
        const dataWithIsEnvoyed = setValue(context.idSurvey, FieldNameEnum.ISENVOYED, true);
        const surveyData: SurveyData = {
            stateData: {
                state: StateDataStateEnum.VALIDATED,
                date: Date.now(),
                currentPage: getCurrentPage(callbackHolder.getData(), context.source),
            },
            data: dataWithIsEnvoyed ?? callbackHolder.getData(),
        };
        remotePutSurveyData(context.idSurvey, surveyData)
            .then(surveyDataAnswer => {
                surveyData.data.lastRemoteSaveDate = surveyDataAnswer.stateData?.date;
                saveData(context.idSurvey, surveyData.data).then(() => {
                    initializeSurveysDatasCache().finally(() => {
                        setIsModalDisplayed(true);
                    });
                });
            })
            .catch(() => {
                setErrorSubmit(true);
            });
    }, []);

    const onPrevious = useCallback(() => {
        if (isActivitySurvey) {
            navigate(
                getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, context.idSurvey) +
                    getNavigatePath(EdtRoutesNameEnum.PHONE_TIME),
            );
        } else {
            navigate(
                getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, context.idSurvey) +
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

    return (
        <SurveyPage
            srcIcon={submit_icon}
            altIcon={t("accessibility.asset.submit-alt")}
            onNavigateBack={navToHome}
            displayStepper={true}
            onPrevious={onPrevious}
            simpleHeader={true}
        >
            <Box className={classes.endContentBox}>
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
                        <Online>
                            <Info {...infoLabels} />
                        </Online>
                        <Offline>
                            <Box className={classes.offline}>
                                <Info isAlertInfo={true} {...infoLabels} />
                            </Box>
                        </Offline>
                    </FlexCenter>
                </Box>
                <Box className={classes.actionContentBox}>
                    <FlexCenter className={isMobile && isBrowser ? classes.actionBoxMobile : classes.actionBox}>
                        <Online>
                            <Button
                                className={cx(classes.sendButton)}
                                variant="contained"
                                onClick={remoteSaveSurveyAndGoBackHome}
                                endIcon={
                                    <img src={sendIcon} alt={t("accessibility.asset.mui-icon.send")} />
                                }
                            >
                                {t("common.navigation.send")} {isMobile && isBrowser ? "mobile-browser" : (isMobile ? "mobile" : "desktop")}
                            </Button>
                        </Online>
                        <Offline>
                            <Button
                                className={cx(classes.sendButton)}
                                variant="contained"
                                onClick={remoteSaveSurveyAndGoBackHome}
                                endIcon={
                                    <img src={sendIcon} alt={t("accessibility.asset.mui-icon.send")} />
                                }
                                disabled={true}
                            >
                                {t("common.navigation.send")}
                            </Button>
                        </Offline>
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
        justifyContent: "space-between",
        height: "60vh",
    },
    contentBox: {
        display: "flex",
        flexDirection: "column",
        padding: "0 1rem",
        textAlign: "center",
    },
    actionBox: {
        marginBottom: "1rem",
    },
    actionBoxMobile: {
        marginBottom: "2rem",
    },
    actionContentBox: {
        height: "10vh"
    },
    sendButton: {
        padding: "0.5rem 2rem",
    },
    offline: {
        color: theme.palette.error.main + " !important",
    },
    errorSubmit: {
        color: theme.palette.error.main,
    },
}));

export default EndSurveyPage;
