import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { saveData } from "service/survey-service";

const SecondaryActivitySelectionPage = () => {
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;
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

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            loopNavigate(page);
        });
    };

    const saveAndGoToActivityPlanner = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
        });
    };

    const onNext = () => {
        saveAndLoopNavigate(EdtRoutesNameEnum.ACTIVITY_LOCATION);
    };

    const onPrevious = () => {
        saveAndLoopNavigate(EdtRoutesNameEnum.SECONDARY_ACTIVITY);
    };

    return (
        <LoopSurveyPage onNext={onNext} onPrevious={onPrevious} onClose={saveAndGoToActivityPlanner}>
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY)}
                    subPage={"8"}
                    iteration={currentIteration}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default SecondaryActivitySelectionPage;
