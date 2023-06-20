import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Modal } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getLoopInitialPage } from "service/loop-service";
import { getLoopPageSubpage, getStepData } from "service/loop-stepper-service";
import {
    getNavigatePath,
    navToActivityRouteOrHome,
    onClose,
    onNext,
    onPrevious,
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
import addLightBlue from "assets/illustration/mui-icon/add-light-blue.svg";
import addWhite from "assets/illustration/mui-icon/add.svg";
import arrowBackIos from "assets/illustration/mui-icon/arrow-back-ios.svg";
import {
    default as arrowForwardIos,
    default as chevronRight,
} from "assets/illustration/mui-icon/arrow-forward-ios.svg";
import arrowForward from "assets/illustration/mui-icon/arrow-forward.svg";
import extension from "assets/illustration/mui-icon/extension.svg";
import search from "assets/illustration/mui-icon/search.svg";
import { SEPARATOR_DEFAUT } from "constants/constants";
import { LoopEnum } from "enumerations/LoopEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { useState } from "react";
import { getLabelsWhenQuit } from "service/alert-service";
import { getAutoCompleteRef, getNomenclatureRef } from "service/referentiel-service";
import { mockData } from "service/survey-activity-service";
import { addToAutocompleteActivityReferentiel, getData, getSource } from "service/survey-service";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
const HelpSubCategoryActivity = () => {
    const navigate = useNavigate();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY;
    const stepData = getStepData(currentPage);
    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const data = mockData();

    const [helpStep, setHelpStep] = React.useState(3);

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [displayStepper, setDisplayStepper] = useState<boolean>(true);
    const [displayHeader, setDisplayHeader] = useState<boolean>(true);
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: ActivitySelecterSpecificProps = {
        categoriesIcons: {
            "100": {
                icon: catIcon100,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-100-alt"),
            },
            "200": {
                icon: catIcon200,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-200-alt"),
            },
            "300": {
                icon: catIcon300,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-300-alt"),
            },
            "400": {
                icon: catIcon400,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-400-alt"),
            },
            "440": {
                icon: catIcon440,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-440-alt"),
            },
            "500": {
                icon: catIcon500,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-500-alt"),
            },
            "650": {
                icon: catIcon600,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-600-alt"),
            },
            "600": {
                icon: catIcon650,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-650-alt"),
            },
        },
        clickableListIconNoResult: errorIcon,
        activitesAutoCompleteRef: getAutoCompleteRef(),
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
        chevronRightIcon: chevronRight,
        chevronRightIconAlt: t("accessibility.asset.mui-icon.arrow-right-ios"),
        searchIcon: search,
        searchIconAlt: t("accessibility.asset.mui-icon.search"),
        extensionIcon: extension,
        extensionIconAlt: t("accessibility.asset.mui-icon.extension"),
        addLightBlueIcon: addLightBlue,
        addWhiteIcon: addWhite,
        addIconAlt: t("accessibility.asset.mui-icon.add"),
    };

    const navToActivityRouteHome = useCallback(() => {
        navToActivityRouteOrHome(navigate);
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
                                startIcon={
                                    <img
                                        src={arrowBackIos}
                                        alt={t("accessibility.asset.mui-icon.arrow-back-ios")}
                                    />
                                }
                            >
                                {t("common.navigation.previous")}
                            </Button>
                        }
                        {
                            <Button
                                className={cx(classes.buttonBox, classes.buttonHelpBox)}
                                variant="outlined"
                                onClick={nextHelpStep}
                                endIcon={
                                    <img
                                        src={arrowForwardIos}
                                        alt={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                                    />
                                }
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
                            endIcon={
                                <img
                                    src={arrowForward}
                                    alt={t("accessibility.asset.mui-icon.arrow-forward")}
                                />
                            }
                        >
                            {t("common.navigation.skip")}
                        </Button>
                    </Box>
                    <Box className={classes.contentHelpBox}>{renderHelpStep()}</Box>
                </Box>
            </Modal>
        );
    };

    const renderHelpStep = () => {
        return (
            <>
                {
                    <Box id="help-step-1" className={cx(classes.stepHelpOne)}>
                        <Box className={cx(classes.stepHelpBox)}>
                            {t("component.help.help-page-4.help-step-1")}
                        </Box>
                    </Box>
                }
            </>
        );
    };
    const context: OrchestratorContext = useOutletContext();

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
        width: "18rem",
    },
    contentHelpBox: {
        height: "100%",
        display: "flex",
        alignItems: "start",
        marginTop: "7rem",
    },
}));

export default HelpSubCategoryActivity;
