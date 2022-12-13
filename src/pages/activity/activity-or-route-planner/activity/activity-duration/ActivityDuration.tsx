import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getNextLoopPage, getStepData } from "service/loop-stepper-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { saveData } from "service/survey-service";
import { getActivities } from "service/survey-activity-service";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Alert } from "lunatic-edt";

import errorIcon from "assets/illustration/error/puzzle.svg";

const ActivityDurationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.ACTIVITY_DURATION;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const activitiesAct = getActivities(context.idSurvey);

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const alertLabels = {
        content: t("page.alert-when-quit.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const specificProps = {
        activitiesAct: activitiesAct,
    };

    const onNext = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getLoopParameterizedNavigatePath(
                    getNextLoopPage(currentPage),
                    context.idSurvey,
                    LoopEnum.ACTIVITY,
                    currentIteration,
                ),
            );
        });
    };

    const onClose = (forceQuit: boolean) => {
        if (forceQuit) {
            saveData(context.idSurvey, callbackHolder.getData()).then(() => {
                navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
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
                    page={getLoopInitialPage(LoopEnum.ACTIVITY)}
                    subPage={(stepData.stepNumber + 1).toString()}
                    iteration={currentIteration}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default ActivityDurationPage;
