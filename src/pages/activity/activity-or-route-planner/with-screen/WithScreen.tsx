import errorIcon from "assets/illustration/error/puzzle.svg";
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
    getLoopParameterizedNavigatePath,
    getOrchestratorPage,
} from "service/navigation-service";
import { FieldNameEnum, getValue, saveData } from "service/survey-service";

const WithScreenPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.WITH_SCREEN;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const alertLabels = {
        content: t("page.alert-when-quit.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const loopNavigate = (page: EdtRoutesNameEnum) => {
        navigate(
            getLoopParameterizedNavigatePath(
                page,
                context.idSurvey,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            ),
        );
    };

    const saveAndGoToActivityPlanner = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getCurrentNavigatePath(
                    context.idSurvey,
                    EdtRoutesNameEnum.ACTIVITY,
                    getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                ),
            );
        });
    };

    const onprevious = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            saveData(context.idSurvey, callbackHolder.getData()).then(() => {
                const isWithSomeone = getValue(
                    context.idSurvey,
                    FieldNameEnum.WITHSOMEONE,
                    currentIteration,
                );
                if (isWithSomeone) {
                    loopNavigate(EdtRoutesNameEnum.WITH_SOMEONE_SELECTION);
                } else {
                    loopNavigate(getPreviousLoopPage(currentPage));
                }
            });
        });
    };

    const onClose = (forceQuit: boolean) => {
        if (forceQuit) {
            saveAndGoToActivityPlanner();
        } else {
            setIsAlertDisplayed(true);
        }
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
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default WithScreenPage;
