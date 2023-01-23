import activityErrorIcon from "assets/illustration/error/activity.svg";
import InfoIcon from "assets/illustration/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, CheckboxBooleanEdtSpecificProps, Info } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
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

const SecondaryActivityPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.SECONDARY_ACTIVITY;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(context.idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxBooleanEdtSpecificProps = {
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(
                EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
                FieldNameEnum.GOAL,
                getPreviousLoopPage(currentPage, context.isRoute),
            );
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(
                EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
                FieldNameEnum.WITHSECONDARYACTIVITY,
                getNextLoopPage(currentPage, context.isRoute),
            );
        },
        onClick: () => {
            validateAndNextLoopStep(
                EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
                currentIteration,
                FieldNameEnum.WITHSECONDARYACTIVITY,
                getNextLoopPage(currentPage, context.isRoute),
            );
        },
        labels: getLabels("secondary-activity-selecter"),
        errorIcon: activityErrorIcon,
    };

    return (
        <LoopSurveyPage
            onNext={e => onNext(e, setNextClickEvent)}
            onPrevious={e => onPrevious(e, setBackClickEvent)}
            onClose={() => onClose(false, setIsAlertDisplayed, currentIteration)}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            isRoute={isRoute}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={() => setIsAlertDisplayed(false)}
                    onCancelCallBack={cancel => onClose(cancel, setIsAlertDisplayed, currentIteration)}
                    labels={getLabelsWhenQuit(isRoute)}
                    icon={activityErrorIcon}
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
                ></OrchestratorForStories>
            </FlexCenter>
            <FlexCenter>
                <Info
                    normalText={t("page.secondary-activity.info-light")}
                    boldText={t("page.secondary-activity.info-bold")}
                    infoIcon={InfoIcon}
                    infoIconAlt={t("accessibility.asset.info.info-alt")}
                />
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default SecondaryActivityPage;
