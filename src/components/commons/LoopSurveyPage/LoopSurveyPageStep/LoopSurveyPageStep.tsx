import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLabels, getLabelsWhenQuit } from "service/alert-service";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
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
    validateAndNextLoopStep,
} from "service/navigation-service";
import { FieldNameEnum, getValue } from "service/survey-service";
import LoopSurveyPage from "../LoopSurveyPage";

export interface LoopSurveyPageStepProps {
    currentPage: EdtRoutesNameEnum;
    labelOfPage: string;
    errorIcon: string;
    backRoute?: EdtRoutesNameEnum;
    nextRoute?: EdtRoutesNameEnum;
    fieldConditionNext?: FieldNameEnum;
    fieldConditionBack?: FieldNameEnum;
    specifiquesProps?: any;
}

const LoopSurveyPageStep = (props: LoopSurveyPageStepProps) => {
    const {
        currentPage,
        labelOfPage,
        errorIcon,
        backRoute,
        nextRoute,
        fieldConditionNext,
        fieldConditionBack,
        specifiquesProps,
    } = props;

    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(context.idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;
    const stepData = getStepData(currentPage, isRoute);

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const componentLunaticProps: any = {
        optionsIcons: specifiquesProps?.optionsIcons,
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(
                backRoute || getPreviousLoopPage(currentPage, isRoute),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
                backRoute ? fieldConditionBack : undefined,
                backRoute ? getPreviousLoopPage(currentPage, isRoute) : undefined,
            );
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(
                nextRoute || getNextLoopPage(currentPage, isRoute),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
                nextRoute != null ? fieldConditionNext : undefined,
                nextRoute != null ? getNextLoopPage(currentPage, isRoute) : undefined,
            );
        },
        labels: getLabels(labelOfPage),
        errorIcon: errorIcon,
        onSelectValue: () => {
            validateAndNextLoopStep(
                nextRoute ? nextRoute : getNextLoopPage(currentPage, isRoute),
                currentIteration,
                nextRoute ? fieldConditionNext : undefined,
                nextRoute ? getNextLoopPage(currentPage, isRoute) : undefined,
            );
        },
    };

    const loopSurveyPageProps = {
        onNext: useCallback((e: React.MouseEvent) => onNext(e, setNextClickEvent), [nextClickEvent]),
        onPrevious: useCallback(
            (e: React.MouseEvent) => onPrevious(e, setBackClickEvent),
            [backClickEvent],
        ),
        onClose: useCallback(
            () => onClose(false, setIsAlertDisplayed, currentIteration),
            [isAlertDisplayed],
        ),
        currentStepIcon: stepData.stepIcon,
        currentStepIconAlt: stepData.stepIconAlt,
        currentStepNumber: stepData.stepNumber,
        currentStepLabel: stepData.stepLabel,
        isRoute: isRoute,
    };

    const alertPprop = {
        isAlertDisplayed: isAlertDisplayed,
        onCompleteCallBack: useCallback(() => setIsAlertDisplayed(false), [isAlertDisplayed]),
        onCancelCallBack: useCallback(
            (cancel: boolean) => onClose(cancel, setIsAlertDisplayed, currentIteration),
            [isAlertDisplayed],
        ),
        labels: getLabelsWhenQuit(),
        icon: errorIcon,
        errorIconAlt: t("page.alert-when-quit.alt-alert-icon"),
    };

    const orchestratorProps = {
        source: context.source,
        data: context.data,
        cbHolder: callbackHolder,
        page: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        subPage: getLoopPageSubpage(currentPage),
        iteration: currentIteration,
        overrideOptions: specifiquesProps?.referentiel,
        componentSpecificProps: componentLunaticProps,
    };

    return (
        <LoopSurveyPage {...loopSurveyPageProps}>
            <FlexCenter>
                <Alert {...alertPprop} />
                <OrchestratorForStories {...orchestratorProps} />
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default LoopSurveyPageStep;
