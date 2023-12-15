import { Alert, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button } from "@mui/material";
import disconnectIcon from "assets/illustration/disconnect.svg";
import logo from "assets/illustration/logo.png";
import help from "assets/illustration/mui-icon/help.svg";
import home from "assets/illustration/mui-icon/home.svg";
import lock from "assets/illustration/mui-icon/lock.svg";
import powerSettings from "assets/illustration/mui-icon/power-settings.svg";
import removeCircle from "assets/illustration/mui-icon/remove-circle.svg";
import reminder_note from "assets/illustration/reminder-note.svg";
import BreadcrumbsReviewer from "components/commons/BreadcrumbsReviewer/BreadcrumbsReviewer";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import HelpMenu from "components/edt/HelpMenu/HelpMenu";
import PersonCard from "components/edt/PersonCard/PersonCard";

import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { SurveyData } from "interface/entity/Api";
import { Person } from "interface/entity/Person";
import { LunaticData, OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import ErrorPage from "pages/error/Error";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logout, remotePutSurveyData, remotePutSurveyDataReviewer } from "service/api-service";
import { lunaticDatabase } from "service/lunatic-database";
import { getNavigatePath, setEnviro } from "service/navigation-service";
import {
    arrayOfSurveysPersonDemo,
    getData,
    getIdSurveyActivity,
    getRemoteSavedSurveysDatas,
    getSource,
    getSurveyRights,
    getUserDatasActivity,
    initializeDatas,
    initializeHomeSurveys,
    initializeSurveysDatasCache,
    initializeSurveysIdsDemo,
    isDemoMode,
    lockAllSurveys,
    nameSurveyGroupMap,
    saveData,
    surveysIds,
    userDatasMap,
    validateAllEmptySurveys,
} from "service/survey-service";
import { getUserRights } from "service/user-service";
import { groupBy } from "utils/utils";

const HomeSurveyedPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { classes, cx } = useStyles();

    const [isAlertDisplayed, setIsAlertDisplayed] = React.useState<boolean>(false);
    const [error, setError] = React.useState<ErrorCodeEnum | undefined>(undefined);
    const [initialized, setInitialized] = React.useState<boolean>(false);
    const [state, setState] = React.useState<LunaticData | undefined>(undefined);
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);

    const source = getSource(SourcesEnum.WORK_TIME_SURVEY);
    const isDemo = isDemoMode();
    const isReviewer = getUserRights() === EdtUserRightsEnum.REVIEWER;
    const idHousehold = localStorage.getItem(LocalStorageVariableEnum.ID_HOUSEHOLD);

    let userDatas: Person[];

    const initHome = (idsSurveysSelected: string[]) => {
        initializeHomeSurveys(idHousehold ?? "").then(() => {
            initializeSurveysDatasCache(idsSurveysSelected).finally(() => {
                userDatas = userDatasMap();
                if (getData(idsSurveysSelected[0]) != undefined) {
                    setState(getData(idsSurveysSelected[0]));
                    setInitialized(true);
                }
            });
        });
    };

    useEffect(() => {
        if (navigator.onLine && getUserRights() === EdtUserRightsEnum.SURVEYED) {
            initializeDatas(setError).then(() => {
                setInitialized(true);
            });
        }

        if (getUserRights() == EdtUserRightsEnum.REVIEWER && !isDemo) {
            userDatas = userDatasMap();
            const idsSurveysSelected = userDatas
                .map(data => data.data.surveyUnitId)
                .filter(
                    (survey: string) =>
                        !survey.startsWith("activitySurvey") && !survey.startsWith("workTimeSurvey"),
                );
            if (navigator.onLine) {
                getRemoteSavedSurveysDatas(idsSurveysSelected, setError, false).then(() => {
                    initHome(idsSurveysSelected);
                });
            }
        }
    }, []);

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

    const resetDataAndReload = useCallback(() => {
        const promises: any[] = [];
        surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS].forEach(idSurvey => {
            const stateData = { state: null, date: Date.now(), currentPage: 1 };
            const surveyData: SurveyData = {
                stateData: stateData,
                data: {},
            };
            promises.push(remotePutSurveyData(idSurvey, surveyData));
            promises.push(remotePutSurveyDataReviewer(idSurvey, stateData, {}));
        });
        Promise.all(promises).then(() => {
            lunaticDatabase.clear().then(() => {
                navigate(0);
            });
        });
    }, []);

    const resetDemoDataAndReload = useCallback(() => {
        const promises: any[] = [];
        surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS].forEach(idSurvey => {
            promises.push(saveData(idSurvey, {}));
        });
        Promise.all(promises).then(() => {
            window.location.replace(process.env.REACT_APP_PUBLIC_URL || "");
        });
    }, []);

    const onDisconnect = useCallback(() => {
        setIsAlertDisplayed(true);
    }, [isAlertDisplayed]);

    const disconnect = useCallback(() => {
        window.localStorage.clear();
        lunaticDatabase.clear().then(() => logout());
    }, []);

    const onCloseAddActivityOrRoute = useCallback(() => {
        setIsAddActivityOrRouteOpen(false);
    }, [isAddActivityOrRouteOpen]);

    const navToContactPage = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.CONTACT));
    }, []);

    const navToInstallPage = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.INSTALL));
    }, []);

    const navToHelpPages = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_ACTIVITY));
    }, []);

    const renderMenuHelp = () => {
        return (
            <HelpMenu
                labelledBy={""}
                describedBy={""}
                onClickContact={navToContactPage}
                onClickInstall={navToInstallPage}
                onClickHelp={navToHelpPages}
                handleClose={onCloseAddActivityOrRoute}
                open={isAddActivityOrRouteOpen}
            />
        );
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
            rightsSurvey: getSurveyRights(idSurvey ?? ""),
        };
        localStorage.setItem(LocalStorageVariableEnum.IS_GLOBAL, "true");
        setEnviro(context, navigate, callbackHolder);
        setIsAddActivityOrRouteOpen(true);
    }, [isAddActivityOrRouteOpen]);

    const navToReviewerHome = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME));
    }, []);

    const renderReminderNote = () => {
        return (
            <FlexCenter className={classes.spacing}>
                <img src={reminder_note} alt={t("accessibility.asset.reminder-notes-alt")} />
            </FlexCenter>
        );
    };

    const renderPageOrLoadingOrError = (page: any) => {
        if (initialized && state != null) {
            return page;
        } else {
            return !error ? (
                <LoadingFull
                    message={t("page.home.loading.message")}
                    thanking={t("page.home.loading.thanking")}
                />
            ) : (
                <ErrorPage errorCode={error} atInit={true} />
            );
        }
    };

    const renderHomeDemo = () => {
        let interviewers = getUserDatasActivity().map(data => data.interviewerId);
        let interviewersUniques = interviewers.filter(
            (value, index, self) => self.indexOf(value) === index,
        );
        initializeSurveysIdsDemo().then(() => {
            setState(getData(getIdSurveyActivity(interviewers[0], 0)));
            initializeSurveysDatasCache().then(() => {
                interviewers = getUserDatasActivity().map(data => data.interviewerId);
                interviewersUniques = interviewers.filter(
                    (value, index, self) => self.indexOf(value) === index,
                );
                setInitialized(true);
            });
        });

        return renderPageOrLoadingOrError(
            <>
                {renderReminderNote()}
                <Box className={classes.groupCardBox}>
                    {interviewersUniques.map((interviewer, index) => (
                        <>
                            <PersonCard
                                numPerson={index}
                                values={arrayOfSurveysPersonDemo(interviewer, index)}
                            />
                        </>
                    ))}
                </Box>
            </>,
        );
    };

    const renderHomeInterviewer = () => {
        let userDataGroupedInterv = nameSurveyGroupMap();
        let groups = Object.keys(userDataGroupedInterv);

        return (
            <>
                {renderReminderNote()}
                <Box className={classes.groupCardBox}>
                    {groups.map((group, index) => (
                        <PersonCard numPerson={index} values={userDataGroupedInterv[group]} />
                    ))}
                </Box>
            </>
        );
    };

    const navBack = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_SURVEYS_OVERVIEW));
    }, []);

    const lockSurveys = useCallback(() => {
        lockAllSurveys(idHousehold ?? "").then(() => {
            setInitialized(true);
        });
    }, []);

    const validateSurveys = useCallback(() => {
        validateAllEmptySurveys(idHousehold ?? "").then(() => {
            //navigate(0);
        });
    }, []);

    const renderHomeReviewer = () => {
        let userDatas = groupBy(userDatasMap(), nameSurveyData => nameSurveyData.num);
        let groups = Object.keys(userDatas);

        return renderPageOrLoadingOrError(
            <>
                {renderReminderNote()}

                <Box className={classes.groupCardBox}>
                    {groups.map((group, index) => (
                        <PersonCard numPerson={index} values={userDatas[group]} />
                    ))}
                </Box>
                <Box className={classes.navButtonsBox}>
                    <FlexCenter className={classes.innerButtonsBox}>
                        <Button
                            variant="outlined"
                            onClick={navBack}
                            className={cx(classes.navButton, classes.navBackButton)}
                            id="return-button"
                        >
                            <Box className={classes.label}>{t("common.navigation.back")}</Box>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={validateSurveys}
                            className={cx(classes.navButton, classes.validAllSurveysButton)}
                        >
                            {t("page.reviewer-home.validate-all-empties-surveys")}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={lockSurveys}
                            className={cx(classes.navButton)}
                            disabled={!navigator.onLine}
                        >
                            <img src={lock} alt={t("accessibility.asset.mui-icon.padlock")} />
                        </Button>
                    </FlexCenter>
                </Box>
            </>,
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
                {isReviewer ? (
                    <Box className={classes.reviewerButtonBox}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={navToReviewerHome}
                            id="button-home-reviewer"
                        >
                            <img src={home} alt={t("accessibility.asset.mui-icon.home")} />
                        </Button>
                        <BreadcrumbsReviewer
                            labelBreadcrumbPrincipal={t("page.breadcrumbs-reviewer.home")}
                            labelBreadcrumbSecondary={
                                t("page.breadcrumbs-reviewer.survey") + " " + idHousehold
                            }
                        />
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
                    {process.env.REACT_APP_NODE_ENV !== "production" && !isDemo && (
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
                    {isDemo && (
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

            <Box className={classes.cardsBox}>{isDemo ? renderHomeDemo() : renderHome()}</Box>

            {renderMenuHelp()}
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: HomeSurveyedPage } })(theme => ({
    cardsBox: {
        overflowY: "auto",
        paddingBottom: "6rem",
    },
    logoBox: {
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
    },
    reviewerButtonBox: {
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
        display: "flex",
        alignItems: "center",
        flexFlow: "wrap",
    },
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
    label: {
        color: theme.palette.secondary.main,
    },
    navButton: {
        borderRadius: "8px",
        border: "2px solid",
        borderColor: theme.palette.primary.main,
        marginRight: "1rem",
    },
    navButtonsBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "3rem",
        width: "100%",
    },
    innerButtonsBox: {
        width: "90%",
        display: "flex",
    },
    navBackButton: {
        width: "15%",
        minWidth: "100px",
    },
    validAllSurveysButton: {
        width: "30%",
        minWidth: "130px",
    },
    groupCardBox: {
        marginTop: "2rem",
    },
}));

export default HomeSurveyedPage;
