import errorIcon from "assets/illustration/error/activity.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getLoopPageSubpage, getPreviousLoopPage, getStepData } from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    saveAndLoopNavigate,
    saveAndNav,
    setEnviro,
    validateWithAlertAndNav,
} from "service/navigation-service";
import { FieldNameEnum, getValue } from "service/survey-service";

const WithScreenPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.WITH_SCREEN;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(context.idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const alertLabels = {
        boldContent: t("page.alert-when-quit.activity.alert-content-bold"),
        content: !isRoute
            ? t("page.alert-when-quit.activity.alert-content")
            : t("page.alert-when-quit.route.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const saveAndGoToActivityPlanner = () => {
        saveAndNav(
            getCurrentNavigatePath(
                context.idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
    };

    const onprevious = () => {
        saveAndLoopNavigate(
            EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
            LoopEnum.ACTIVITY_OR_ROUTE,
            currentIteration,
            FieldNameEnum.WITHSOMEONE,
            getPreviousLoopPage(currentPage),
        );
    };

    const onClose = (forceQuit: boolean) => {
        validateWithAlertAndNav(
            forceQuit,
            setIsAlertDisplayed,
            currentIteration,
            getCurrentNavigatePath(
                context.idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
    };

    return (
        <LoopSurveyPage
            onPrevious={onprevious}
            onValidate={saveAndGoToActivityPlanner}
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
                    cbHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default WithScreenPage;
