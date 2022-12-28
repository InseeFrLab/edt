import InfoIcon from "assets/illustration/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, Info } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import {
    getLoopPageSubpage,
    getNextLoopPage,
    getPreviousLoopPage,
    getStepData,
} from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    saveAndLoopNavigate,
    setEnviro,
    validateWithAlertAndNav,
} from "service/navigation-service";
import { FieldNameEnum, getValue } from "service/survey-service";

import errorIcon from "assets/illustration/error/puzzle.svg";

const SecondaryActivityPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.SECONDARY_ACTIVITY;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const alertLabels = {
        content: t("page.alert-when-quit.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const onNext = () => {
        const hasSecondaryActivity = getValue(
            context.idSurvey,
            FieldNameEnum.WITHSECONDARYACTIVITY,
            currentIteration,
        );
        let page = null;

        if (hasSecondaryActivity) {
            page = EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION;
        } else {
            page = getNextLoopPage(currentPage, context.isRoute);
        }
        saveAndLoopNavigate(page, LoopEnum.ACTIVITY_OR_ROUTE, currentIteration);
    };

    const onPrevious = () => {
        const goal = getValue(context.idSurvey, FieldNameEnum.GOAL, currentIteration);
        const page =
            goal === "" || goal
                ? EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL
                : getPreviousLoopPage(currentPage, context.isRoute);
        saveAndLoopNavigate(page, LoopEnum.ACTIVITY_OR_ROUTE, currentIteration);
    };

    const onClose = (forceQuit: boolean) => {
        validateWithAlertAndNav(
            forceQuit,
            setIsAlertDisplayed,
            getCurrentNavigatePath(
                context.idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
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
                    errorIconAlt={t("page.activity-duration.alt-alert-icon")}
                ></Alert>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
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
