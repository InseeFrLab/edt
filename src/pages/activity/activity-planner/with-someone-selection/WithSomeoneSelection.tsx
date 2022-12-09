import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { saveData } from "service/survey-service";

const WithSomeoneSelectionPage = () => {
    const navigate = useNavigate();
    const context: OrchestratorContext = useOutletContext();
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

    const onNext = () => {
        saveAndLoopNavigate(EdtRoutesNameEnum.WITH_SCREEN);
    };

    const onPrevious = () => {
        saveAndLoopNavigate(EdtRoutesNameEnum.WITH_SOMEONE);
    };

    const onClose = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
        });
    };

    return (
        <LoopSurveyPage onNext={onNext} onPrevious={onPrevious} onClose={onClose}>
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY)}
                    subPage={"10"}
                    iteration={currentIteration}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default WithSomeoneSelectionPage;
