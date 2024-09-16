import {
    ActivitySelecterSpecificProps,
    Alert,
    AutoCompleteActiviteOption,
    important,
    makeStylesEdt,
} from "@inseefrlab/lunatic-edt";
import { Box, Button, Modal } from "@mui/material";
import CatIcon100 from "../../../../assets/illustration/activity-categories/1.svg?react";
import CatIcon200 from "../../../../assets/illustration/activity-categories/2.svg?react";
import CatIcon300 from "../../../../assets/illustration/activity-categories/3.svg?react";
import CatIcon400 from "../../../../assets/illustration/activity-categories/4.svg?react";
import CatIcon440 from "../../../../assets/illustration/activity-categories/5.svg?react";
import CatIcon500 from "../../../../assets/illustration/activity-categories/6.svg?react";
import CatIcon650 from "../../../../assets/illustration/activity-categories/8.svg?react";
import CatIcon600 from "../../../../assets/illustration/activity-categories/7.svg?react";
import ErrorIcon from "../../../../assets/illustration/error/activity.svg?react";
import AddLightBlueIcon from "../../../../assets/illustration/mui-icon/add-light-blue.svg?react";
import AddWhiteIcon from "../../../../assets/illustration/mui-icon/add.svg?react";
import ArrowBackIosIcon from "../../../../assets/illustration/mui-icon/arrow-back-ios-white.svg?react";
import ArrowForwardIosIcon from "../../../../assets/illustration/mui-icon/arrow-forward-ios-white.svg?react";
import ChevronRightIcon from "../../../../assets/illustration/mui-icon/arrow-forward-ios.svg?react";
import ArrowForwardIcon from "../../../../assets/illustration/mui-icon/arrow-forward.svg?react";
import ExtensionIcon from "../../../../assets/illustration/mui-icon/extension.svg?react";
import SearchIcon from "../../../../assets/illustration/mui-icon/search.svg?react";
import FlexCenter from "../../../../components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "../../../../components/commons/LoopSurveyPage/LoopSurveyPage";
import { SEPARATOR_DEFAUT } from "../../../../constants/constants";
import { EdtRoutesNameEnum } from "../../../../enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "../../../../enumerations/FieldNameEnum";
import { LoopEnum } from "../../../../enumerations/LoopEnum";
import { SourcesEnum } from "../../../../enumerations/SourcesEnum";
import { OrchestratorForStories, callbackHolder } from "../../../../orchestrator/Orchestrator";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getLabelsWhenQuit } from "../../../../service/alert-service";
import { getLoopInitialPage } from "../../../../service/loop-service";
import { getLoopPageSubpage, getStepData } from "../../../../service/loop-stepper-service";
import { getNavigatePath, navToHome, onClose, onNext, onPrevious } from "../../../../service/navigation-service";
import { getAutoCompleteRef, getNomenclatureRef } from "../../../../service/referentiel-service";
import { CreateIndexation, getIndexSuggester } from "../../../../service/suggester-service";
import { mockData } from "../../../../service/survey-activity-service";
import { addToAutocompleteActivityReferentiel, getSource } from "../../../../service/survey-service";

const HelpSubCategoryActivity = () => {
    const navigate = useNavigate();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY;
    const stepData = getStepData(currentPage);
    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const data = mockData();

    if (data?.COLLECTED?.[FieldNameEnum.MAINACTIVITY_ID])
        data.COLLECTED[FieldNameEnum.MAINACTIVITY_ID].COLLECTED = ["120"];

    if (data?.COLLECTED?.[FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED])
        data.COLLECTED[FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED].COLLECTED = [false];

    const [helpStep, setHelpStep] = React.useState(3);

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [displayStepper, setDisplayStepper] = useState<boolean>(true);
    const [displayHeader, setDisplayHeader] = useState<boolean>(true);
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: ActivitySelecterSpecificProps = {
        categoriesIcons: {
            "100": {
                icon: CatIcon100,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-100-alt"),
            },
            "200": {
                icon: CatIcon200,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-200-alt"),
            },
            "300": {
                icon: CatIcon300,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-300-alt"),
            },
            "400": {
                icon: CatIcon400,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-400-alt"),
            },
            "440": {
                icon: CatIcon440,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-440-alt"),
            },
            "500": {
                icon: CatIcon500,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-500-alt"),
            },
            "650": {
                icon: CatIcon600,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-600-alt"),
            },
            "600": {
                icon: CatIcon650,
                altIcon: t("accessibility.asset.activities.categories.cat-icon-650-alt"),
            },
        },
        clickableListIconNoResult: <ErrorIcon />,
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
            clickableListPlaceholder: t("component.activity-selecter.clickable-list-placeholder"),
            clickableListNotFoundLabel: t("component.activity-selecter.clickable-list-not-found-label"),
            clickableListNotFoundComment: t(
                "component.activity-selecter.clickable-list-not-found-comment",
            ),
            clickableListAddActivityButton: t(
                "component.activity-selecter.clickable-list-add-activity-button",
            ),
            clickableListNotSearchLabel: t(
                "component.activity-selecter.clickable-list-not-search-label",
            ),
            otherButton: t("component.activity-selecter.other-button"),
            saveButton: t("component.activity-selecter.save-button"),
            validateButton: t("component.activity-selecter.validate-button"),
        },
        errorIcon: <ErrorIcon />,
        addToReferentielCallBack: (newItem: AutoCompleteActiviteOption) => {
            addToAutocompleteActivityReferentiel(newItem);
        },
        widthGlobal: true,
        separatorSuggester: import.meta.env.VITE_SEPARATOR_SUGGESTER ?? SEPARATOR_DEFAUT,
        helpStep: 3,
        chevronRightIcon: ChevronRightIcon,
        chevronRightIconAlt: t("accessibility.asset.mui-icon.arrow-right-ios"),
        searchIcon: SearchIcon,
        searchIconAlt: t("accessibility.asset.mui-icon.search"),
        extensionIcon: <ExtensionIcon aria-label={t("accessibility.asset.mui-icon.extension")} />,
        addLightBlueIcon: <AddLightBlueIcon aria-label={t("accessibility.asset.mui-icon.add")} />,
        addWhiteIcon: <AddWhiteIcon aria-label={t("accessibility.asset.mui-icon.add")} />,
        indexSuggester: getIndexSuggester(),
        CreateIndex: CreateIndexation,
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
                                startIcon={
                                    <ArrowBackIosIcon
                                        aria-label={t("accessibility.asset.mui-icon.arrow-back-ios")}
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
                                    <ArrowForwardIosIcon
                                        aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
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
                                <ArrowForwardIcon
                                    aria-label={t("accessibility.asset.mui-icon.arrow-forward")}
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
                    () => onClose(" ", source, false, setIsAlertDisplayed),
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
                    <Alert
                        isAlertDisplayed={isAlertDisplayed}
                        onCompleteCallBack={useCallback(
                            () => setIsAlertDisplayed(false),
                            [isAlertDisplayed],
                        )}
                        onCancelCallBack={useCallback(
                            cancel => onClose(" ", source, cancel, setIsAlertDisplayed, 0),
                            [isAlertDisplayed],
                        )}
                        labels={getLabelsWhenQuit()}
                        icon={<ErrorIcon aria-label={t("page.alert-when-quit.alt-alert-icon")} />}
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
