import { Alert, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button } from "@mui/material";
import disconnectIcon from "assets/illustration/disconnect.svg";
import logo from "assets/illustration/logo.png";
import help from "assets/illustration/mui-icon/help.svg";
import home from "assets/illustration/mui-icon/home.svg";
import powerSettings from "assets/illustration/mui-icon/power-settings.svg";
import removeCircle from "assets/illustration/mui-icon/remove-circle.svg";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import DayCard from "components/edt/DayCard/DayCard";
import WeekCard from "components/edt/WeekCard/WeekCard";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { SurveyData } from "interface/entity/Api";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useAuth } from "oidc-react";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { remotePutSurveyData } from "service/api-service";
import { getFlatLocalStorageValue } from "service/local-storage-service";
import { lunaticDatabase } from "service/lunatic-database";
import {
    getNavigatePath,
    navToActivityOrPlannerOrSummary,
    navToWeeklyPlannerOrClose,
    setEnviro,
} from "service/navigation-service";
import {
    getData,
    getIdSurveyActivity,
    getIdSurveyWorkTime,
    getPrintedFirstName,
    getPrintedSurveyDate,
    getSource,
    getUserDatasActivity,
    getValue,
    initializeSurveysDatasCache,
    initializeSurveysIdsModeReviewer,
    saveData,
    surveysIds,
} from "service/survey-service";
import { getUserRights } from "service/user-service";

const HomeSurveyedPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { classes } = useStyles();
    const auth = useAuth();
    const [isAlertDisplayed, setIsAlertDisplayed] = React.useState<boolean>(false);
    const source = getSource(SourcesEnum.WORK_TIME_SURVEY);
    const isDemoMode = getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";

    let [initialized, setInitialized] = React.useState(false);

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

    React.useEffect(() => {
        if (getUserRights() === EdtUserRightsEnum.REVIEWER) {
            initializeSurveysIdsModeReviewer();
            initializeSurveysDatasCache().then(() => {
                setInitialized(true);
            });
        }
    }, []);

    const resetDataAndReload = useCallback(() => {
        const promises: any[] = [];
        surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS].forEach(idSurvey => {
            const surveyData: SurveyData = {
                stateData: { state: null, date: 0, currentPage: 1 },
                data: {},
            };
            promises.push(remotePutSurveyData(idSurvey, surveyData));
        });
        Promise.all(promises).then(() => {
            lunaticDatabase.clear().then(() => {
                window.location.reload();
            });
        });
    }, []);

    const resetDemoDataAndReload = useCallback(() => {
        surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS].forEach(idSurvey => {
            saveData(idSurvey, {});
        });
        window.location.replace(process.env.REACT_APP_PUBLIC_URL || "");
    }, []);

    const navWorkTime = useCallback(
        (idSurvey: string) => () => {
            const firstName = getValue(idSurvey, FieldNameEnum.FIRSTNAME);
            let data = getData(idSurvey || "");

            localStorage.setItem(LocalStorageVariableEnum.IS_GLOBAL, "false");

            let context: OrchestratorContext = {
                source: source,
                data: data,
                idSurvey: idSurvey,
                surveyRootPage: EdtRoutesNameEnum.WORK_TIME,
                global: false,
            };
            setEnviro(context, navigate, callbackHolder);

            if (firstName != null || isDemoMode) {
                return navToWeeklyPlannerOrClose(
                    idSurvey,
                    navigate,
                    getSource(SourcesEnum.WORK_TIME_SURVEY),
                );
            } else {
                return navigate(getNavigatePath(EdtRoutesNameEnum.HELP_WORK_TIME));
            }
        },
        [],
    );

    const onDisconnect = useCallback(() => {
        setIsAlertDisplayed(true);
    }, [isAlertDisplayed]);

    const disconnect = useCallback(() => {
        window.localStorage.clear();
        lunaticDatabase
            .clear()
            .then(() =>
                auth.userManager.signoutRedirect({
                    id_token_hint: localStorage.getItem("id_token") || undefined,
                }),
            )
            .then(() => auth.userManager.clearStaleState())
            .then(() => auth.userManager.signoutRedirectCallback())
            .then(() => {
                sessionStorage.clear();
            })
            .then(() => auth.userManager.clearStaleState())
            .then(() => window.location.replace(process.env.REACT_APP_PUBLIC_URL || ""));
    }, []);

    const navActivity = useCallback(
        (idSurvey: string) => () => {
            let data = getData(idSurvey || "");
            let context: OrchestratorContext = {
                source: source,
                data: data,
                idSurvey: idSurvey,
                surveyRootPage: EdtRoutesNameEnum.ACTIVITY,
                global: false,
            };
            localStorage.setItem(LocalStorageVariableEnum.IS_GLOBAL, "false");

            setEnviro(context, navigate, callbackHolder);
            const firstName = getValue(idSurvey, FieldNameEnum.FIRSTNAME);
            if (firstName != null || isDemoMode) {
                navToActivityOrPlannerOrSummary(
                    idSurvey,
                    getSource(SourcesEnum.ACTIVITY_SURVEY).maxPage,
                    navigate,
                    getSource(SourcesEnum.ACTIVITY_SURVEY),
                );
            } else {
                return navigate(getNavigatePath(EdtRoutesNameEnum.HELP_ACTIVITY));
            }
        },
        [],
    );

    const formClose = (idSurvey: string) => {
        const surveyIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
        return surveyIsClosed;
    };

    const navToHelp = useCallback(() => {
        const idSurvey = surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS][0];
        let data = getData(idSurvey || "");
        let context: OrchestratorContext = {
            source: source,
            data: data,
            idSurvey: idSurvey,
            surveyRootPage: EdtRoutesNameEnum.WORK_TIME,
            global: true,
        };
        localStorage.setItem(LocalStorageVariableEnum.IS_GLOBAL, "true");
        setEnviro(context, navigate, callbackHolder);
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_INSTALL));
    }, []);

    const navToReviewerHome = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME));
    }, []);

    const renderActivityCard = (activitySurveyId: string, index: number) => {
        return (
            <>
                <DayCard
                    key={activitySurveyId + "-dayCard"}
                    labelledBy={""}
                    describedBy={""}
                    onClick={navActivity(activitySurveyId)}
                    firstName={getPrintedFirstName(activitySurveyId)}
                    surveyDate={getPrintedSurveyDate(activitySurveyId)}
                    idSurvey={activitySurveyId}
                    isClose={formClose(activitySurveyId)}
                    tabIndex={index}
                />
            </>
        );
    };

    const renderWorkTimeCard = (workTimeSurvey: string, index: number) => {
        return (
            <>
                <WeekCard
                    key={workTimeSurvey + "-weekCard"}
                    labelledBy={""}
                    describedBy={""}
                    onClick={navWorkTime(workTimeSurvey)}
                    firstName={getPrintedFirstName(workTimeSurvey)}
                    surveyDate={getPrintedSurveyDate(workTimeSurvey, EdtRoutesNameEnum.WORK_TIME)}
                    idSurvey={workTimeSurvey}
                    isClose={formClose(workTimeSurvey)}
                    tabIndex={index + 1}
                />
            </>
        );
    };

    const renderHomeDemo = () => {
        const interviewers = getUserDatasActivity().map(data => data.interviewerId);
        const interviewersUniques = interviewers.filter(
            (value, index, self) => self.indexOf(value) === index,
        );

        return (
            <>
                {interviewersUniques.map((interviewer, index) => (
                    <>
                        {getIdSurveyActivity(interviewer, 0) &&
                            renderActivityCard(getIdSurveyActivity(interviewer, 0), index * 2)}
                        {getIdSurveyActivity(interviewer, 1) &&
                            renderActivityCard(getIdSurveyActivity(interviewer, 1), index * 2 + 1)}
                        {getIdSurveyWorkTime(interviewer) &&
                            renderWorkTimeCard(getIdSurveyWorkTime(interviewer), index * 2 + 2)}
                    </>
                ))}
            </>
        );
    };

    const renderHomeInterviewer = () => {
        return (
            <>
                {surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].map((idSurvey, index) =>
                    renderActivityCard(idSurvey, index + 1),
                )}

                {surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].map((idSurvey, index) =>
                    renderWorkTimeCard(idSurvey, index + 1),
                )}
            </>
        );
    };

    const renderHomeReviewer = () => {
        /*return (
            <>
                {surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS].map((idSurvey, index) =>
                    surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].includes(idSurvey)
                        ? renderActivityCard(idSurvey, index + 1)
                        : renderWorkTimeCard(idSurvey, index + 1),
                )}
            </>
        );*/
        return initialized ? (
            <>
                {surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].map((idSurvey, index) =>
                    renderActivityCard(idSurvey, index + 1),
                )}

                {surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].map((idSurvey, index) =>
                    renderWorkTimeCard(idSurvey, index + 1),
                )}
            </>
        ) : (
            <>
                <LoadingFull
                    message={t("page.home.loading.message")}
                    thanking={t("page.home.loading.thanking")}
                />
            </>
        );
    };

    const renderHome = () => {
        if (getUserRights() === EdtUserRightsEnum.REVIEWER) {
            return renderHomeReviewer();
        } else {
            return renderHomeInterviewer();
        }
    };

    return (
        <>
            <FlexCenter>
                <Alert {...alertProps} />
            </FlexCenter>
            <Box className={classes.headerBox}>
                {isDemoMode ? (
                    <Box className={classes.reviewerButtonBox}>
                        <Button color="primary" variant="contained" onClick={navToReviewerHome}>
                            <img src={home} alt={t("accessibility.asset.mui-icon.home")} />
                        </Button>
                    </Box>
                ) : (
                    <Box className={classes.logoBox}>
                        <img
                            className={classes.logoImg}
                            src={logo}
                            alt={t("accessibility.asset.logo-alt")}
                        />
                    </Box>
                )}

                <Box className={classes.helpBox}>
                    {process.env.REACT_APP_NODE_ENV !== "production" && !isDemoMode && (
                        <Button
                            color="secondary"
                            startIcon={
                                <img
                                    src={removeCircle}
                                    alt={t("accessibility.asset.mui-icon.remove-circle")}
                                />
                            }
                            onClick={resetDataAndReload}
                        >
                            {t("page.home.navigation.reset-data")}
                        </Button>
                    )}
                    {isDemoMode && (
                        <Button
                            color="primary"
                            startIcon={
                                <img
                                    src={removeCircle}
                                    alt={t("accessibility.asset.mui-icon.remove-circle")}
                                />
                            }
                            onClick={resetDemoDataAndReload}
                        >
                            {t("page.home.navigation.reset-data-demo")}
                        </Button>
                    )}
                    <Button
                        color="secondary"
                        startIcon={<img src={help} alt={t("accessibility.asset.mui-icon.help")} />}
                        onClick={navToHelp}
                    >
                        {t("page.home.navigation.link-help-label")}
                    </Button>

                    <Button
                        color="secondary"
                        startIcon={
                            <img
                                src={powerSettings}
                                alt={t("accessibility.asset.mui-icon.power-settings")}
                            />
                        }
                        onClick={onDisconnect}
                        id={"button-logout"}
                    >
                        {t("page.home.navigation.logout")}
                    </Button>
                </Box>
            </Box>

            <Box className={classes.cardsBox}>
                <FlexCenter className={classes.spacing}>
                    <img src={reminder_note} alt={t("accessibility.asset.reminder-notes-alt")} />
                </FlexCenter>

                {isDemoMode ? renderHomeDemo() : renderHome()}
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: HomeSurveyedPage } })(() => ({
    cardsBox: {
        overflowY: "auto",
        paddingBottom: "6rem",
    },
    logoBox: {
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
    },
    reviewerButtonBox: { paddingLeft: "1rem", paddingTop: "0.5rem" },
    logoImg: {
        width: "40px",
    },
    helpBox: {
        paddingRight: "0.5rem",
    },
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "0.5rem",
    },
    spacing: {
        margin: "1rem",
    },
}));

export default HomeSurveyedPage;
