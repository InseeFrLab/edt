import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Modal } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
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

import {
    ActivitySelecterSpecificProps,
    Alert,
    AutoCompleteActiviteOption,
} from "@inseefrlab/lunatic-edt";
import catIcon100 from "assets/illustration/activity-categories/1.svg";
import catIcon200 from "assets/illustration/activity-categories/2.svg";
import catIcon300 from "assets/illustration/activity-categories/3.svg";
import catIcon400 from "assets/illustration/activity-categories/4.svg";
import catIcon440 from "assets/illustration/activity-categories/5.svg";
import catIcon500 from "assets/illustration/activity-categories/6.svg";
import catIcon650 from "assets/illustration/activity-categories/7.svg";
import catIcon600 from "assets/illustration/activity-categories/8.svg";
import errorIcon from "assets/illustration/error/activity.svg";
import { SEPARATOR_DEFAUT } from "constants/constants";
import { LoopEnum } from "enumerations/LoopEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { useState } from "react";
import { getLabelsWhenQuit } from "service/alert-service";
import { getAutoCompleteRef, getNomenclatureRef } from "service/referentiel-service";
import { isDesktop } from "service/responsive";
import {
    addToAutocompleteActivityReferentiel,
    getData,
    getSource,
    surveysIds,
} from "service/survey-service";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const HelpSubCategoryActivity = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY;
    const stepData = getStepData(currentPage);
    const isItDesktop = isDesktop();
    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const idSurvey = surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS][0];
    let data = getData(idSurvey || "");

    setEnviro(context, useNavigate(), callbackHolder);

    const [helpStep, setHelpStep] = React.useState(3);

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [displayStepper, setDisplayStepper] = useState<boolean>(true);
    const [displayHeader, setDisplayHeader] = useState<boolean>(true);
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: ActivitySelecterSpecificProps = {
        categoriesIcons: {
            "100": catIcon100,
            "200": catIcon200,
            "300": catIcon300,
            "400": catIcon400,
            "440": catIcon440,
            "500": catIcon500,
            "650": catIcon650,
            "600": catIcon600,
        },
        clickableListIconNoResult: errorIcon,
        activitesAutoCompleteRef: getAutoCompleteRef(),
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            console.log("");
        },
        nextClickCallback: (routeToGoal: boolean) => {
            console.log("");
        },
        onSelectValue: () => {
            console.log("");
        },
        setDisplayStepper: setDisplayStepper,
        setDisplayHeader: setDisplayHeader,
        categoriesAndActivitesNomenclature: getNomenclatureRef(),
        labels: {
            selectInCategory: t("component.activity-selecter.select-in-category"),
            addActivity: t("component.activity-selecter.add-activity"),
            alertMessage: t("component.activity-selecter.alert-message"),
            alertIgnore: t("common.navigation.alert.ignore"),
            alertComplete: t("common.navigation.alert.complete"),
            alertAlticon: t("common.navigation.alert.alt-icon"),
            clickableListPlaceholder: t("component.activity-selecter.clickable-list-placeholder"),
            clickableListNotFoundLabel: t("component.activity-selecter.clickable-list-not-found-label"),
            clickableListNotFoundComment: t(
                "component.activity-selecter.clickable-list-not-found-comment",
            ),
            clickableListAddActivityButton: t(
                "component.activity-selecter.clickable-list-add-activity-button",
            ),
            clickableListIconNoResultAlt: t(
                "component.activity-selecter.clickable-list-icon-no-result-alt",
            ),
            clickableListNotSearchLabel: t(
                "component.activity-selecter.clickable-list-not-search-label",
            ),
            otherButton: t("component.activity-selecter.other-button"),
            saveButton: t("component.activity-selecter.save-button"),
        },
        errorIcon: errorIcon,
        addToReferentielCallBack: (newItem: AutoCompleteActiviteOption) => {
            addToAutocompleteActivityReferentiel(newItem);
        },
        widthGlobal: true,
        separatorSuggester: process.env.REACT_APP_SEPARATOR_SUGGESTER ?? SEPARATOR_DEFAUT,
        helpStep: 3,
    };

    const navToActivityRouteHome = useCallback(() => {
        navToHome();
    }, []);

    const navToNextPage = useCallback(
        () => navigate(getNavigatePath(EdtRoutesNameEnum.HELP_CHECKBOX)),
        [],
    );

    const navToBackPage = useCallback(
        () => navigate(getNavigatePath(EdtRoutesNameEnum.HELP_MAIN_ACTIVITY_CATEGORY)),
        [],
    );

    const nextHelpStep = useCallback(() => {
        navToNextPage();
    }, [helpStep]);

    const previousHelpStep = useCallback(() => {
        setHelpStep(1);
        navToBackPage();
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
                        {
                            <Button
                                className={cx(classes.buttonBox, classes.buttonHelpBox)}
                                variant="outlined"
                                onClick={nextHelpStep}
                                endIcon={<ArrowForwardIosIcon />}
                            >
                                {t("common.navigation.next")}
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
                {
                    <Box id="help-step-1" className={cx(classes.stepHelpBox, classes.stepHelpOne)}>
                        {t("component.help.help-page-4.help-step-1")}
                    </Box>
                }
            </>
        );
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
                    <Alert
                        isAlertDisplayed={isAlertDisplayed}
                        onCompleteCallBack={useCallback(
                            () => setIsAlertDisplayed(false),
                            [isAlertDisplayed],
                        )}
                        onCancelCallBack={useCallback(
                            cancel => onClose(cancel, setIsAlertDisplayed, 0),
                            [isAlertDisplayed],
                        )}
                        labels={getLabelsWhenQuit()}
                        icon={errorIcon}
                        errorIconAlt={t("page.activity-duration.alt-alert-icon")}
                    ></Alert>
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

const useStyles = makeStylesEdt({ "name": { HelpSubCategoryActivity } })(theme => ({
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
        width: "18rem",
        marginTop: "16rem",
    },
}));

export default HelpSubCategoryActivity;
