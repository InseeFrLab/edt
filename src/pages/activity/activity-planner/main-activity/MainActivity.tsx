import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getNextLoopPage, getPreviousLoopPage, getStepData } from "service/loop-stepper-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { saveData } from "service/survey-service";

import catIcon1 from "assets/illustration/activity-categories/1.svg";
import catIcon2 from "assets/illustration/activity-categories/2.svg";
import catIcon3 from "assets/illustration/activity-categories/3.svg";
import catIcon4 from "assets/illustration/activity-categories/4.svg";
import catIcon5 from "assets/illustration/activity-categories/5.svg";
import catIcon6 from "assets/illustration/activity-categories/6.svg";
import catIcon7 from "assets/illustration/activity-categories/7.svg";
import catIcon8 from "assets/illustration/activity-categories/8.svg";

import iconNoResult from "assets/illustration/error/puzzle.svg";
import activitesAutoCompleteRef from "activitesAutoCompleteRef.json";
import categoriesAndActivitesNomenclature from "activitiesCategoriesNomenclature.json";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivitySelecterSpecificProps } from "lunatic-edt";

const MainActivityPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context = useOutletContext() as OrchestratorContext;
    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [backClickEvent, setBackClickEvent] = React.useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = React.useState<React.MouseEvent>();
    const [displayStepper, setDisplayStepper] = React.useState<boolean>(true);

    const specificProps: ActivitySelecterSpecificProps = {
        categoriesIcons: [
            catIcon1,
            catIcon2,
            catIcon3,
            catIcon4,
            catIcon5,
            catIcon6,
            catIcon7,
            catIcon8,
        ],
        clickableListIconNoResult: iconNoResult,
        activitesAutoCompleteRef: activitesAutoCompleteRef,
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(getPreviousLoopPage(currentPage));
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(getNextLoopPage(currentPage));
        },
        setDisplayStepper: setDisplayStepper,
        categoriesAndActivitesNomenclature: categoriesAndActivitesNomenclature,
        labels: {
            selectInCategory: t("component.activity-selecter.select-in-category"),
            addActivity: t("component.activity-selecter.add-activity"),
            alertMessage: t("component.activity-selecter.alert-message"),
            alertIgnore: t("component.activity-selecter.alert-ignore"),
            alertComplete: t("component.activity-selecter.alert-complete"),
            clickableListPlaceholder: t("component.activity-selecter.clickable-list-placeholder"),
            clickableListNotFoundLabel: t("component.activity-selecter.clickable-list-not-found-label"),
            clickableListNotFoundComment: t("component.activity-selecter.clickable-list-not-found-comment"),
            clickableListAddActivityButton: t("component.activity-selecter.clickable-list-add-activity-button"),
            otherButton: t("component.activity-selecter.other-button"),
        }
    };

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getLoopParameterizedNavigatePath(
                    page,
                    context.idSurvey,
                    LoopEnum.ACTIVITY,
                    currentIteration,
                ),
            );
        });
    };

    const onNext = (e: React.MouseEvent) => {
        setNextClickEvent(e);
    };

    const onPrevious = (e: React.MouseEvent) => {
        setBackClickEvent(e);
    };

    const onClose = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
        });
    };

    return (
        <LoopSurveyPage
            onNext={onNext}
            onPrevious={onPrevious}
            onClose={onClose}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            displayStepper={displayStepper}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY)}
                    subPage={(stepData.stepNumber + 1).toString()}
                    iteration={currentIteration}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default MainActivityPage;
