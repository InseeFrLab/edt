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
import { getLoopPageSubpage, getNextLoopPage, getStepData } from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getOrchestratorPage,
    setEnviro,
} from "service/navigation-service";
import { getActivitiesOrRoutes } from "service/survey-activity-service";
import { FieldNameEnum, saveData, setValue } from "service/survey-service";

import errorIcon from "assets/illustration/error/activity.svg";

const ActivityDurationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.ACTIVITY_DURATION;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const activitiesAct = getActivitiesOrRoutes(context.idSurvey);

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const alertLabels = {
        content: t("page.alert-when-quit.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const specificProps = {
        activitiesAct: activitiesAct,
        defaultValue: true,
    };

    const onNext = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            const data = setValue(
                context.idSurvey,
                FieldNameEnum.ISROUTE,
                context.isRoute || false,
                currentIteration,
            );
            saveData(context.idSurvey, data || {}).then(() => {
                navigate(
                    getLoopParameterizedNavigatePath(
                        getNextLoopPage(currentPage, context.isRoute),
                        LoopEnum.ACTIVITY_OR_ROUTE,
                        currentIteration,
                    ),
                );
            });
        });
    };

    const onClose = (forceQuit: boolean) => {
        if (forceQuit) {
            saveData(context.idSurvey, callbackHolder.getData()).then(() => {
                const data = setValue(
                    context.idSurvey,
                    FieldNameEnum.ISROUTE,
                    context.isRoute || false,
                    currentIteration,
                );
                saveData(context.idSurvey, data || {}).then(() => {
                    navigate(
                        getCurrentNavigatePath(
                            context.idSurvey,
                            EdtRoutesNameEnum.ACTIVITY,
                            getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                            undefined,
                            undefined,
                            context.isRoute,
                        ),
                    );
                });
            });
        } else {
            setIsAlertDisplayed(true);
        }
    };

    return (
        <LoopSurveyPage
            onNext={onNext}
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
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default ActivityDurationPage;
