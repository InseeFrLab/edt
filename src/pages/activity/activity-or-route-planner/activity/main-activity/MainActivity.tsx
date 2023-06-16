import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
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
    validate,
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
import chevronRight from "assets/illustration/mui-icon/arrow-forward-ios.svg";
import chevronRightDisabled from "assets/illustration/mui-icon/arrow-forward-ios-grey.svg";
import extension from "assets/illustration/mui-icon/extension.svg";
import extensionDisabled from "assets/illustration/mui-icon/extension-grey.svg";
import search from "assets/illustration/mui-icon/search.svg";
import { SEPARATOR_DEFAUT } from "constants/constants";
import { LoopEnum } from "enumerations/LoopEnum";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLabelsWhenQuit } from "service/alert-service";
import { getAutoCompleteRef, getNomenclatureRef } from "service/referentiel-service";
import { addToAutocompleteActivityReferentiel, getData } from "service/survey-service";
import { surveyReadOnly } from "service/survey-activity-service";

const MainActivityPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const modifiable = !surveyReadOnly(context.rightsSurvey);

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
            saveAndLoopNavigate(
                getPreviousLoopPage(currentPage),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        nextClickCallback: (routeToGoal: boolean) => {
            const codeActivity = getValueOfActivity(callbackHolder.getData(), currentIteration) ?? "";
            const skip = filtrePage(EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL, codeActivity);
            if (routeToGoal && !skip) {
                saveAndLoopNavigate(
                    EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                );
            } else {
                const skip = filtrePage(EdtRoutesNameEnum.SECONDARY_ACTIVITY, codeActivity);
                saveAndLoopNavigate(
                    skip ? EdtRoutesNameEnum.ACTIVITY_LOCATION : getNextLoopPage(currentPage),
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                );
            }
        },
        onSelectValue: () => {
            validate().then(() => {
                skipNextPage(context.idSurvey, context.source, currentIteration, currentPage);
            });
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
        chevronRightIcon: modifiable ? chevronRight : chevronRightDisabled,
        chevronRightIconAlt: t("accessibility.asset.mui-icon.arrow-right-ios"),
        searchIcon: search,
        searchIconAlt: t("accessibility.asset.mui-icon.search"),
        extensionIcon: modifiable ? extension : extensionDisabled,
        extensionIconAlt: t("accessibility.asset.mui-icon.extension"),
        addLightBlueIcon: addLightBlue,
        addWhiteIcon: addWhite,
        addIconAlt: t("accessibility.asset.mui-icon.add"),
        modifiable: modifiable,
    };

    return (
        <LoopSurveyPage
            onNext={useCallback((e: React.MouseEvent) => onNext(e, setNextClickEvent), [nextClickEvent])}
            onPrevious={useCallback(
                (e: React.MouseEvent) => onPrevious(e, setBackClickEvent),
                [backClickEvent],
            )}
            onClose={useCallback(
                () => onClose(false, setIsAlertDisplayed, currentIteration),
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
                        cancel => onClose(cancel, setIsAlertDisplayed, currentIteration),
                        [isAlertDisplayed],
                    )}
                    labels={getLabelsWhenQuit()}
                    icon={errorIcon}
                    errorIconAlt={t("page.activity-duration.alt-alert-icon")}
                ></Alert>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    cbHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                    componentSpecificProps={specificProps}
                    idSurvey={context.idSurvey}
                    dataSurvey={getData(context.idSurvey)}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default MainActivityPage;
