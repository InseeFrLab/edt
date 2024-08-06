import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { filtrePage, getLoopInitialPage, getValueOfActivity, skipNextPage } from "service/loop-service";
import {
    getLoopPageSubpage,
    getNextLoopPage,
    getPreviousLoopPage,
    getStepData,
} from "service/loop-stepper-service";
import {
    onClose,
    onNext,
    onPrevious,
    saveAndLoopNavigate,
    setEnviro,
    validateLocally,
} from "service/navigation-service";

import {
    ActivitySelecterSpecificProps,
    Alert,
    AutoCompleteActiviteOption,
} from "@inseefrlab/lunatic-edt";
import { ReactComponent as CatIcon100 } from "assets/illustration/activity-categories/1.svg";
import { ReactComponent as CatIcon200 } from "assets/illustration/activity-categories/2.svg";
import { ReactComponent as CatIcon300 } from "assets/illustration/activity-categories/3.svg";
import { ReactComponent as CatIcon400 } from "assets/illustration/activity-categories/4.svg";
import { ReactComponent as CatIcon440 } from "assets/illustration/activity-categories/5.svg";
import { ReactComponent as CatIcon500 } from "assets/illustration/activity-categories/6.svg";
import { ReactComponent as CatIcon650 } from "assets/illustration/activity-categories/7.svg";
import { ReactComponent as CatIcon600 } from "assets/illustration/activity-categories/8.svg";
import { ReactComponent as ErrorIcon } from "assets/illustration/error/activity.svg";
import { ReactComponent as AddLightBlueIcon } from "assets/illustration/mui-icon/add-light-blue.svg";
import { ReactComponent as AddWhiteIcon } from "assets/illustration/mui-icon/add.svg";
import { ReactComponent as ChevronRightDisabledIcon } from "assets/illustration/mui-icon/arrow-forward-ios-grey.svg";
import { ReactComponent as ChevronRightIcon } from "assets/illustration/mui-icon/arrow-forward-ios.svg";
import { ReactComponent as ExtensionDisabledIcon } from "assets/illustration/mui-icon/extension-grey.svg";
import { ReactComponent as ExtensionIcon } from "assets/illustration/mui-icon/extension.svg";
import { ReactComponent as SearchIcon } from "assets/illustration/mui-icon/search.svg";
import { SEPARATOR_DEFAUT } from "constants/constants";
import { Index } from "elasticlunrjs";
import { LoopEnum } from "enumerations/LoopEnum";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLabelsWhenQuit } from "service/alert-service";
import { getAutoCompleteRef, getNomenclatureRef } from "service/referentiel-service";
import { CreateIndexation, getIndexSuggester } from "service/suggester-service";
import { surveyReadOnly } from "service/survey-activity-service";
import { createNewActivityInCategory, getData } from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

const MainActivityPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const modifiable = !surveyReadOnly(context.rightsSurvey);

    const chevronRightIconAlt = t("accessibility.asset.mui-icon.arrow-right-ios");
    const extensionIconAlt = t("accessibility.asset.mui-icon.extension");

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [displayStepper, setDisplayStepper] = useState<boolean>(true);
    const [displayHeader, setDisplayHeader] = useState<boolean>(true);
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const [index, setIndex] = useState<Index<AutoCompleteActiviteOption>>();

    const referentiel = getNomenclatureRef();
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
        clickableListIconNoResult: (
            <ErrorIcon aria-label={t("component.activity-selecter.clickable-list-icon-no-result-alt")} />
        ),
        activitesAutoCompleteRef: getAutoCompleteRef(),
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(
                idSurvey,
                context.source,
                getPreviousLoopPage(currentPage),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        nextClickCallback: (routeToGoal: boolean) => {
            const codeActivity = getValueOfActivity(callbackHolder.getData(), currentIteration) ?? "";
            console.log("codeActivity", codeActivity);
            const skip = filtrePage(EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL, codeActivity);
            if (routeToGoal && !skip) {
                saveAndLoopNavigate(
                    idSurvey,
                    context.source,
                    EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                );
            } else {
                const skip = filtrePage(EdtRoutesNameEnum.SECONDARY_ACTIVITY, codeActivity);
                saveAndLoopNavigate(
                    idSurvey,
                    context.source,
                    skip ? EdtRoutesNameEnum.ACTIVITY_LOCATION : getNextLoopPage(currentPage),
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                );
            }
        },
        onSelectValue: () => {
            validateLocally(idSurvey).then(() => {
                skipNextPage(idSurvey, context.source, currentIteration, currentPage);
            });
        },
        setDisplayStepper: setDisplayStepper,
        setDisplayHeader: setDisplayHeader,
        categoriesAndActivitesNomenclature: referentiel,
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
        errorIcon: <ErrorIcon aria-label={t("common.navigation.alert.alt-icon")} />,
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string,
            newActivity: string,
        ) => {
            createNewActivityInCategory(newItem, categoryId, newActivity, referentiel, index, setIndex);
        },
        widthGlobal: true,
        separatorSuggester: process.env.REACT_APP_SEPARATOR_SUGGESTER ?? SEPARATOR_DEFAUT,
        chevronRightIcon: modifiable ? ChevronRightIcon : ChevronRightDisabledIcon,
        chevronRightIconAlt: chevronRightIconAlt,
        searchIcon: SearchIcon,
        searchIconAlt: t("accessibility.asset.mui-icon.search"),
        extensionIcon: modifiable ? (
            <ExtensionIcon aria-label={extensionIconAlt} />
        ) : (
            <ExtensionDisabledIcon aria-label={extensionIconAlt} />
        ),
        addLightBlueIcon: <AddLightBlueIcon aria-label={t("accessibility.asset.mui-icon.add")} />,
        addWhiteIcon: <AddWhiteIcon aria-label={t("accessibility.asset.mui-icon.add")} />,
        modifiable: modifiable,
        indexSuggester: getIndexSuggester(),
        CreateIndex: CreateIndexation,
    };

    return (
        <LoopSurveyPage
            onNext={useCallback((e: React.MouseEvent) => onNext(e, setNextClickEvent), [nextClickEvent])}
            onPrevious={useCallback(
                (e: React.MouseEvent) => onPrevious(e, setBackClickEvent),
                [backClickEvent],
            )}
            onClose={useCallback(
                () => onClose(idSurvey, context.source, false, setIsAlertDisplayed, currentIteration),
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
                        cancel =>
                            onClose(
                                idSurvey,
                                context.source,
                                cancel,
                                setIsAlertDisplayed,
                                currentIteration,
                            ),
                        [isAlertDisplayed],
                    )}
                    labels={getLabelsWhenQuit()}
                    icon={<ErrorIcon aria-label={t("page.alert-when-quit.alt-alert-icon")} />}
                ></Alert>
                <OrchestratorForStories
                    source={context.source}
                    data={getData(idSurvey)}
                    cbHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default MainActivityPage;
