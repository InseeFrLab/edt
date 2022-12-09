import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getPreviousLoopPage, getStepData } from "service/loop-stepper-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { FieldNameEnum, getValue, saveData } from "service/survey-service";

const WithScreenPage = () => {
    const navigate = useNavigate();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.WITH_SCREEN;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const loopNavigate = (page: EdtRoutesNameEnum) => {
        navigate(
            getLoopParameterizedNavigatePath(
                page,
                context.idSurvey,
                LoopEnum.ACTIVITY,
                currentIteration,
            ),
        );
    };

    const saveAndGoToActivityPlanner = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
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

    return (
        <LoopSurveyPage
            onPrevious={onprevious}
            onValidate={saveAndGoToActivityPlanner}
            onClose={saveAndGoToActivityPlanner}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY)}
                    subPage={(stepData.stepNumber + 1).toString()}
                    iteration={currentIteration}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default WithScreenPage;
