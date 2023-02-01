import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, Info } from "lunatic-edt";
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
import InfoIcon from "assets/illustration/info.svg";

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
            specifiquesProps?.backClickback ??
                saveAndLoopNavigate(
                    backRoute || getPreviousLoopPage(currentPage, isRoute),
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                    fieldConditionBack,
                    fieldConditionBack ? getPreviousLoopPage(currentPage, isRoute) : undefined,
                );
        },
        nextClickCallback: () => {
            specifiquesProps?.nextClickback ??
                saveAndLoopNavigate(
                    nextRoute || getNextLoopPage(currentPage, isRoute),
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                    fieldConditionNext,
                    fieldConditionNext ? getNextLoopPage(currentPage, isRoute) : undefined,
                );
        },
        labels: getLabels(labelOfPage),
        errorIcon: errorIcon,
        onSelectValue: () => {
            specifiquesProps?.onSelectValue ??
                validateAndNextLoopStep(
                    nextRoute || getNextLoopPage(currentPage, isRoute),
                    currentIteration,
                    fieldConditionNext,
                    fieldConditionNext ? getNextLoopPage(currentPage, isRoute) : undefined,
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
        currentStepLabel: specifiquesProps?.currentStepLabel
            ? t(specifiquesProps?.currentStepLabel)
            : stepData.stepLabel,
        isRoute: isRoute,
        displayStepper: specifiquesProps?.displayStepper,
    };

    const alertProps = {
        isAlertDisplayed: isAlertDisplayed,
        onCompleteCallBack: useCallback(() => setIsAlertDisplayed(false), [isAlertDisplayed]),
        onCancelCallBack: useCallback(
            (cancel: boolean) => onClose(cancel, setIsAlertDisplayed, currentIteration),
            [isAlertDisplayed],
        ),
        labels: getLabelsWhenQuit(isRoute),
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
                <Alert {...alertProps} />
                <OrchestratorForStories {...orchestratorProps} />
            </FlexCenter>
            <FlexCenter>
                {(specifiquesProps?.infoLight || specifiquesProps?.infoBold) && (
                    <Info
                        normalText={t(specifiquesProps?.infoLight)}
                        boldText={t(specifiquesProps?.infoBold)}
                        infoIcon={InfoIcon}
                        infoIconAlt={t("accessibility.asset.info.info-alt")}
                    />
                )}
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default LoopSurveyPageStep;
