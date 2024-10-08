
import { Box, Button, Modal } from "@mui/material";
import ArrowBackIosIcon from "../../../../assets/illustration/mui-icon/arrow-back-ios-white.svg?react";
import ArrowForwardIosIcon from "../../../../assets/illustration/mui-icon/arrow-forward-ios-white.svg?react";
import ArrowForwardIcon from "../../../../assets/illustration/mui-icon/arrow-forward.svg?react";
import childIcon from "../../../../assets/illustration/with-someone-categories/child.svg?react";
import coupleIcon from "../../../../assets/illustration/with-someone-categories/couple.svg?react";
import otherKnownIcon from "../../../../assets/illustration/with-someone-categories/other-known.svg?react";
import otherIcon from "../../../../assets/illustration/with-someone-categories/other.svg?react";
import parentsIcon from "../../../../assets/illustration/with-someone-categories/parents.svg?react";
import FlexCenter from "../../../../components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "../../../../components/commons/LoopSurveyPage/LoopSurveyPage";
import { EdtRoutesNameEnum } from "../../../../enumerations/EdtRoutesNameEnum";
import { LocalStorageVariableEnum } from "../../../../enumerations/LocalStorageVariableEnum";
import { LoopEnum } from "../../../../enumerations/LoopEnum";
import { SourcesEnum } from "../../../../enumerations/SourcesEnum";
import { OrchestratorForStories, callbackHolder } from "../../../../orchestrator/Orchestrator";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getLoopInitialPage } from "../../../../service/loop-service";
import { getLoopPageSubpage, getStepData } from "../../../../service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getNavigatePath,
    getOrchestratorPage,
    isActivityPage,
    isPageGlobal,
    onClose,
    onNext,
    onPrevious,
} from "../../../../service/navigation-service";
import { mockData } from "../../../../service/survey-activity-service";
import { getSource } from "../../../../service/survey-service";
import { makeStylesEdt } from "../../../../theme/make-style-edt";
import { important } from "../../../../utils/lunatic-edt";

const HelpCheckbox = () => {
    const navigate = useNavigate();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.WITH_SOMEONE_SELECTION;
    const stepData = getStepData(currentPage);
    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const data = mockData();

    const globalHelp = isPageGlobal() && !isActivityPage();

    const [helpStep, setHelpStep] = React.useState(1);

    const navToActivityRouteHome = useCallback(() => {
        if (globalHelp) {
            navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
        } else {
            let idSurvey = localStorage.getItem(LocalStorageVariableEnum.IDSURVEY_CURRENT) ?? "";
            navigate(
                getCurrentNavigatePath(
                    idSurvey,
                    EdtRoutesNameEnum.ACTIVITY,
                    getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                    source,
                ),
            );
        }
    }, []);

    const navToBackPage = useCallback(
        () => navigate(getNavigatePath(EdtRoutesNameEnum.HELP_MAIN_ACTIVITY_SUB_CATEGORY)),
        [helpStep],
    );

    const previousHelpStep = useCallback(() => {
        helpStep > 1 ? setHelpStep(helpStep - 1) : navToBackPage();
    }, [helpStep]);

    const nextHelpStep = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_WORK_TIME));
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

                        {globalHelp && (
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
                            {globalHelp
                                ? t("common.navigation.skip")
                                : t("common.navigation.skip-final")}
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
                        {t("component.help.help-page-5.help-step-1")}
                    </Box>
                )}
            </>
        );
    };

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const displayStepper = true;
    const displayHeader = true;

    const specificProps = {
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            console.log("");
        },
        nextClickCallback: () => {
            console.log("");
        },
        onSelectValue: () => {
            console.log("");
        },
        optionsIcons: {
            "1": {
                icon: coupleIcon,
                altIcon: t("accessibility.assets.with-someone.categories.couple-alt"),
            },
            "2": {
                icon: parentsIcon,
                altIcon: t("accessibility.assets.with-someone.categories.parents-alt"),
            },
            "3": {
                icon: childIcon,
                altIcon: t("accessibility.assets.with-someone.categories.child-alt"),
            },
            "4": {
                icon: otherKnownIcon,
                altIcon: t("accessibility.assets.with-someone.categories.other-know-alt"),
            },
            "5": {
                icon: otherIcon,
                altIcon: t("accessibility.assets.with-someone.categories.other-alt"),
            },
        },
        displayStepper: false,
        helpStep: helpStep,
    };

    return (
        <Box className={classes.root}>
            {renderHelp()}
            <LoopSurveyPage
                onNext={useCallback(
                    (e: React.MouseEvent) => onNext(e, setNextClickEvent),
                    [nextClickEvent],
                )}
                onPrevious={useCallback(
                    (e: React.MouseEvent) => onPrevious(e, setBackClickEvent),
                    [backClickEvent],
                )}
                onClose={useCallback(
                    () => onClose("", source, false, setIsAlertDisplayed),
                    [isAlertDisplayed],
                )}
                currentStepIcon={stepData.stepIcon}
                currentStepIconAlt={stepData.stepIconAlt}
                currentStepNumber={stepData.stepNumber}
                currentStepLabel={stepData.stepLabel}
                displayStepper={displayStepper}
                displayHeader={displayHeader}
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
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpCheckbox } })(theme => ({
    root: {
        height: "100vh",
        maxHeight: "100vh",
    },
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
        width: "24rem",
        marginTop: "21.5rem",
    },
}));

export default HelpCheckbox;
