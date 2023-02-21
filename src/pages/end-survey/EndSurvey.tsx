import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Typography } from "@mui/material";
import InfoIcon from "assets/illustration/info.svg";
import submit_icon from "assets/illustration/submit.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { SurveyData } from "interface/entity/Api";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Info, InfoProps, makeStylesEdt } from "lunatic-edt";
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
    saveAndNav,
    setEnviro,
} from "service/navigation-service";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";
import { getCurrentPage, saveData, setValue } from "service/survey-service";

const EndSurveyPage = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
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
                currentPage: getCurrentPage(callbackHolder.getData()),
            },
            data: dataWithIsEnvoyed ?? callbackHolder.getData(),
        };
        remotePutSurveyData(context.idSurvey, surveyData)
            .then(surveyDataAnswer => {
                surveyData.data.lastRemoteSaveDate = surveyDataAnswer.stateData.date;
                saveData(context.idSurvey, surveyData.data, true).then(() => {
                    setIsModalDisplayed(true);
                });
            })
            .catch(() => {
                setErrorSubmit(true);
            });
    }, []);

    const onPrevious = useCallback(() => {
        if (isActivitySurvey) {
            saveAndNav(
                getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, context.idSurvey) +
                    getNavigatePath(EdtRoutesNameEnum.PHONE_TIME),
            );
        } else {
            saveAndNav(
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
            saveAndNav();
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
            <FlexCenter className={classes.actionBox}>
                <Online>
                    <Button
                        className={classes.sendButton}
                        variant="contained"
                        onClick={remoteSaveSurveyAndGoBackHome}
                        endIcon={<SendIcon />}
                    >
                        {t("common.navigation.send")}
                    </Button>
                </Online>
                <Offline>
                    <Button
                        className={classes.sendButton}
                        variant="contained"
                        onClick={remoteSaveSurveyAndGoBackHome}
                        endIcon={<SendIcon />}
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
            <FlexCenter>
                <FelicitationModal
                    isModalDisplayed={isModalDisplayed}
                    onCompleteCallBack={useCallback(
                        () => validateAndNav(true, setIsModalDisplayed),
                        [isModalDisplayed],
                    )}
                    content={t("component.modal-edt.modal-felicitation.activity-content")}
                />
            </FlexCenter>
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { EndSurveyPage } })(theme => ({
    contentBox: {
        display: "flex",
        flexDirection: "column",
        padding: "0 1rem",
        textAlign: "center",
    },
    actionBox: {
        marginTop: "auto",
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
