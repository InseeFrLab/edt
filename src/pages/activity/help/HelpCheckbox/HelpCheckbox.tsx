import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Modal } from "@mui/material";
import childIcon from "assets/illustration/with-someone-categories/child.svg";
import coupleIcon from "assets/illustration/with-someone-categories/couple.svg";
import otherKnownIcon from "assets/illustration/with-someone-categories/other-known.svg";
import otherIcon from "assets/illustration/with-someone-categories/other.svg";
import parentsIcon from "assets/illustration/with-someone-categories/parents.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getLoopInitialPage } from "service/loop-service";
import { getLoopPageSubpage, getStepData } from "service/loop-stepper-service";
import {
    getNavigatePath,
    navToHome,
    onClose,
    onNext,
    onPrevious,
    setEnviro,
} from "service/navigation-service";
import { isDesktop } from "service/responsive";
import { getData, getSource, surveysIds } from "service/survey-service";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const HelpCheckbox = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.WITH_SOMEONE_SELECTION;
    const stepData = getStepData(currentPage);
    const isItDesktop = isDesktop();
    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const idSurvey = surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS][0];
    let data = getData(idSurvey || "");

    const [helpStep, setHelpStep] = React.useState(1);

    setEnviro(context, useNavigate(), callbackHolder);

    const navToActivityRouteHome = useCallback(() => {
        navToHome();
    }, []);

    const navToBackPage = useCallback(
        () => navigate(getNavigatePath(EdtRoutesNameEnum.HELP_MAIN_ACTIVITY_SUB_CATEGORY)),
        [helpStep],
    );

    const previousHelpStep = useCallback(() => {
        helpStep > 1 ? setHelpStep(helpStep - 1) : navToBackPage();
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
                                startIcon={<ArrowBackIosIcon />}
                            >
                                {t("common.navigation.previous")}
                            </Button>
                        }
                    </Box>
                    <Box>
                        <Button
                            className={cx(classes.buttonBox, classes.buttonSkipBox)}
                            variant="outlined"
                            onClick={navToActivityRouteHome}
                            endIcon={<ArrowForwardIcon />}
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
                        {t("component.help.help-page-5.help-step-1")}
                    </Box>
                )}
            </>
        );
    };

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const [displayStepper, setDisplayStepper] = useState<boolean>(true);
    const [displayHeader, setDisplayHeader] = useState<boolean>(true);

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
            "1": coupleIcon,
            "2": parentsIcon,
            "3": childIcon,
            "4": otherKnownIcon,
            "5": otherIcon,
        },
        displayStepper: false,
        helpStep: helpStep,
    };

    return (
        <Box>
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
                onClose={useCallback(() => onClose(false, setIsAlertDisplayed), [isAlertDisplayed])}
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
    },
    buttonHelpBox: {
        backgroundColor: "#2c2e33",
        "&:hover": {
            backgroundColor: "#2c2e33",
            color: theme.variables.white,
        },
    },
    buttonSkipBox: {
        "&:hover": {
            color: theme.palette.secondary.main,
            backgroundColor: theme.variables.white,
        },
    },
    stepHelpBox: {
        fontWeight: "bold",
        borderRadius: "1rem",
        padding: "1rem",
        backgroundColor: "#707070",
        color: theme.variables.white,
        borderStyle: "dashed",
    },
    stepHelpOne: {
        width: "24rem",
        marginTop: "21.5rem",
    },
}));

export default HelpCheckbox;
