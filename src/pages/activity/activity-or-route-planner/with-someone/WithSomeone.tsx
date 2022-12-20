import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import {
    getLoopPageSubpage,
    getNextLoopPage,
    getPreviousLoopPage,
    getStepData,
} from "service/loop-stepper-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { FieldNameEnum, getValue, saveData } from "service/survey-service";

import errorIcon from "assets/illustration/error/puzzle.svg";
import { Alert } from "lunatic-edt";
import { useTranslation } from "react-i18next";

const WithSomeonePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.WITH_SOMEONE;
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

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            loopNavigate(page);
        });
    };

    const onNext = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            const isWithSomeone = getValue(
                context.idSurvey,
                FieldNameEnum.WITHSOMEONE,
                currentIteration,
            );
            if (isWithSomeone) {
                loopNavigate(EdtRoutesNameEnum.WITH_SOMEONE_SELECTION);
            } else {
                loopNavigate(getNextLoopPage(currentPage, context.isRoute));
            }
        });
    };

    const onPrevious = () => {
        if (context.isRoute) {
            const hasSecondaryActivity = getValue(
                context.idSurvey,
                FieldNameEnum.WITHSECONDARYACTIVITY,
                currentIteration,
            );
            if (hasSecondaryActivity) {
                saveAndLoopNavigate(EdtRoutesNameEnum.ROUTE_SECONDARY_ACTIVITY_SELECTION);
            } else {
                saveAndLoopNavigate(getPreviousLoopPage(currentPage, context.isRoute));
            }
        } else {
            saveAndLoopNavigate(getPreviousLoopPage(currentPage, context.isRoute));
        }
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
        </LoopSurveyPage>
    );
};

export default WithSomeonePage;