import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getStepData } from "service/loop-stepper-service";

const SecondaryActivityPage = () => {
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;
    const stepData = getStepData(EdtRoutesNameEnum.SECONDARY_ACTIVITY);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const onNext = () => {
        //TODO : fill
        navigate("");
    };

    const onPrevious = () => {
        //TODO : fill
        navigate("");
    };

    return (
        <LoopSurveyPage
            onNext={onNext}
            onPrevious={onPrevious}
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
