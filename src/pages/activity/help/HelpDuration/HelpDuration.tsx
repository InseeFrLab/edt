
import { Box, Button, Modal } from "@mui/material";
import ImageHelpIcon from "../../../../assets/illustration/hourpicker.svg?react";
import ArrowBackIosIcon from "../../../../assets/illustration/mui-icon/arrow-back-ios-white.svg?react";
import ArrowForwardIosIcon from "../../../../assets/illustration/mui-icon/arrow-forward-ios-white.svg?react";
import ArrowForwardIcon from "../../../../assets/illustration/mui-icon/arrow-forward.svg?react";
import ArrowDownIcon from "../../../../assets/illustration/mui-icon/expand-more.svg?react";
import FlexCenter from "../../../../components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "../../../../components/commons/LoopSurveyPage/LoopSurveyPage";
import { FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "../../../../constants/constants";
import { EdtRoutesNameEnum } from "../../../../enumerations/EdtRoutesNameEnum";
import { LoopEnum } from "../../../../enumerations/LoopEnum";
import { SourcesEnum } from "../../../../enumerations/SourcesEnum";
import { SurveysIdsEnum } from "../../../../enumerations/SurveysIdsEnum";
import { callbackHolder, OrchestratorForStories } from "../../../../orchestrator/Orchestrator";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getLoopInitialPage } from "../../../../service/loop-service";
import { getLoopPageSubpage, getStepData } from "../../../../service/loop-stepper-service";
import { getIdSurveyContext, getNavigatePath, navToHome } from "../../../../service/navigation-service";
import { getActivitiesOrRoutes, mockData } from "../../../../service/survey-activity-service";
import { getSource } from "../../../../service/survey-service";
import { TimepickerSpecificProps } from "../../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../../theme";
import { important } from "../../../../utils/lunatic-edt";

const HelpDuration = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.ACTIVITY_DURATION;
    const stepData = getStepData(currentPage);

    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const idSurvey = getIdSurveyContext(SurveysIdsEnum.ACTIVITY_SURVEYS_IDS);
    const data = mockData();

    const { classes, cx } = useStyles();

    const helpStep = 1;

    const activitiesAct = getActivitiesOrRoutes(t, idSurvey, source).activitiesRoutesOrGaps;

    const specificProps: TimepickerSpecificProps = {
        activitiesAct: activitiesAct,
        defaultValue: true,
        constants: {
            START_TIME_DAY: START_TIME_DAY,
            FORMAT_TIME: FORMAT_TIME,
            MINUTE_LABEL: MINUTE_LABEL,
        },
        helpStep: 1,
        helpImage: <ImageHelpIcon />,
        arrowDownIcon: <ArrowDownIcon aria-label={t("accessibility.asset.mui-icon.expand-more")} />,
        labels: {
            ariaLabelTimepicker: t("accessibility.asset.timepicker-alt"),
            cancelLabel: t("page.activity-duration.cancel"),
            validateLabel: t("page.activity-duration.validate"),
        },
        defaultLanguage: "fr",
    };

    const navToActivityRouteHome = useCallback(() => {
        navToHome();
    }, []);

    const nextHelpStep = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_MAIN_ACTIVITY_CATEGORY));
    }, [helpStep]);

    const previousHelpStep = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_ACTIVITY));
    }, [helpStep]);

    const renderHelp = () => {
        return (
            <Modal disableEnforceFocus open={true}>
                <Box className={classes.rootHelp}>
                    <Box className={classes.headerHelpBox}>
                        {
                            <Button
                                className={cx(classes.buttonBox, classes.buttonHelpBox)}
                                variant="outlined"
                                onClick={previousHelpStep}
                                startIcon={
                                    <ArrowBackIosIcon
                                        aria-label={t("accessibility.asset.mui-icon.arrow-back-ios")}
                                    />
                                }
                            >
                                {t("common.navigation.previous")}
                            </Button>
                        }
                        {helpStep < 3 && (
                            <Button
                                className={cx(classes.buttonBox, classes.buttonHelpBox)}
                                variant="outlined"
                                onClick={nextHelpStep}
                                endIcon={
                                    <ArrowForwardIosIcon
                                        aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                                    />
                                }
                            >
                                {t("common.navigation.next")}
                            </Button>
                        )}
                    </Box>
                    <Box>
                        <Button
                            className={cx(classes.buttonBox, classes.buttonSkipBox)}
                            variant="outlined"
                            onClick={navToActivityRouteHome}
                            endIcon={
                                <ArrowForwardIcon
                                    aria-label={t("accessibility.asset.mui-icon.arrow-forward")}
                                />
                            }
                        >
                            {t("common.navigation.skip")}
                        </Button>
                    </Box>
                    {renderHelpStep()}
                </Box>
            </Modal>
        );
    };

    const renderHelpStep = () => {
        return (
            <>
                {helpStep == 1 && (
                    <Box id="help-step-1" className={cx(classes.stepHelpBox, classes.stepHelpOne)}>
                        {t("component.help.help-page-2.help-step-1")}
                    </Box>
                )}
            </>
        );
    };

    return (
        <>
            {renderHelp()}
            <LoopSurveyPage
                onNext={useCallback(() => console.log(""), [])}
                onClose={useCallback(() => console.log(""), [])}
                currentStepIcon={stepData.stepIcon}
                currentStepIconAlt={stepData.stepIconAlt}
                currentStepNumber={stepData.stepNumber}
                currentStepLabel={stepData.stepLabel}
            >
                <FlexCenter>
                    <OrchestratorForStories
                        source={source}
                        data={data}
                        cbHolder={callbackHolder}
                        page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                        subPage={getLoopPageSubpage(currentPage)}
                        iteration={0}
                        componentSpecificProps={specificProps}
                    ></OrchestratorForStories>
                </FlexCenter>
            </LoopSurveyPage>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpDuration } })(theme => ({
    headerHelpBox: {
        display: "flex",
    },
    rootHelp: {
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        marginTop: "0.5rem",
    },
    buttonBox: {
        color: theme.variables.white,
        borderColor: "transparent",
        marginBottom: "1rem",
        marginRight: "1rem",
        width: "10rem",
        "&:hover": {
            color: theme.variables.white,
            borderColor: important(theme.variables.white),
        },
    },
    buttonHelpBox: {
        backgroundColor: "#2c2e33",
        "&:hover": {
            backgroundColor: "#2c2e33",
        },
    },
    buttonSkipBox: {
        backgroundColor: "#707070",
        "&:hover": {
            backgroundColor: "#707070",
        },
    },
    stepHelpBox: {
        fontWeight: "bold",
        borderRadius: "1rem",
        padding: "1rem",
        backgroundColor: "#707070",
        color: theme.variables.white,
    },
    stepHelpOne: {
        width: "20rem",
        marginTop: "25.5rem",
        textAlign: "center",
    },
}));

export default HelpDuration;
