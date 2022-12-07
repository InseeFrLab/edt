import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getNextLoopPage, getPreviousLoopPage, getStepData } from "service/loop-stepper-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { saveData } from "service/survey-service";

const SecondaryActivityPage = () => {
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;
    const currentPage = EdtRoutesNameEnum.SECONDARY_ACTIVITY;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getLoopParameterizedNavigatePath(
                    page,
                    context.idSurvey,
                    LoopEnum.ACTIVITY,
                    currentIteration,
                ),
            );
        });
    };

    const saveAndGoToActivityPlanner = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
        });
    };

    const onNext = () => {
        saveAndLoopNavigate(getNextLoopPage(currentPage));
    };

    const onPrevious = () => {
        saveAndLoopNavigate(getPreviousLoopPage(currentPage));
    };

    return (
        <LoopSurveyPage
            onNext={onNext}
            onPrevious={onPrevious}
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

export default SecondaryActivityPage;
