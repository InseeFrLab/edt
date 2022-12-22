import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, IconGridCheckBoxOneSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getLoopPageSubpage, getNextLoopPage, getStepData } from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    saveAndLoopNavigate,
    validateWithAlertAndNav,
} from "service/navigation-service";
import { FieldNameEnum, getValue } from "service/survey-service";

import locationErrorIcon from "assets/illustration/error/location-error.svg";
import errorIcon from "assets/illustration/error/puzzle.svg";
import option1 from "assets/illustration/locations/1.svg";
import option2 from "assets/illustration/locations/2.svg";
import option3 from "assets/illustration/locations/3.svg";
import option4 from "assets/illustration/locations/4.svg";
import option5 from "assets/illustration/locations/5.svg";
import option6 from "assets/illustration/locations/6.svg";
import { getPlaceRef } from "service/referentiel-service";

const ActivityLocationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.ACTIVITY_LOCATION;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const alertLabels = {
        content: t("page.alert-when-quit.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const specificProps: IconGridCheckBoxOneSpecificProps = {
        optionsIcons: {
            "11": option1,
            "12": option2,
            "14": option3,
            "15": option4,
            "13": option5,
            "16": option6,
        },
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            const hasSecondaryActivity = getValue(
                context.idSurvey,
                FieldNameEnum.WITHSECONDARYACTIVITY,
                currentIteration,
            );
            const page = hasSecondaryActivity
                ? EdtRoutesNameEnum.ACTIVITY_SECONDARY_ACTIVITY_SELECTION
                : currentPage;
            saveAndLoopNavigate(
                navigate,
                context,
                callbackHolder,
                page,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(
                navigate,
                context,
                callbackHolder,
                getNextLoopPage(currentPage),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        labels: {
            alertMessage: t("component.location-selecter.alert-message"),
            alertIgnore: t("component.location-selecter.alert-ignore"),
            alertComplete: t("component.location-selecter.alert-complete"),
            alertAlticon: t("component.location-selecter.alert-alt_icon"),
        },
        errorIcon: locationErrorIcon,
    };

    const onClose = (forceQuit: boolean) => {
        validateWithAlertAndNav(
            navigate,
            context,
            callbackHolder,
            forceQuit,
            setIsAlertDisplayed,
            getCurrentNavigatePath(
                context.idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
    };

    const onNext = (e: React.MouseEvent) => {
        setNextClickEvent(e);
    };

    const onPrevious = (e: React.MouseEvent) => {
        setBackClickEvent(e);
    };

    return (
        <LoopSurveyPage
            onNext={onNext}
            onPrevious={onPrevious}
            onClose={() => onClose(false)}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={() => setIsAlertDisplayed(false)}
                    onCancelCallBack={onClose}
                    labels={alertLabels}
                    icon={errorIcon}
                    errorIconAlt={t("page.alert-when-quit.alt-alert-icon")}
                ></Alert>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                    overrideOptions={getPlaceRef()}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default ActivityLocationPage;
