import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getLoopPageSubpage } from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    saveAndLoopNavigate,
    saveAndNav,
} from "service/navigation-service";
import { getSecondaryActivityRef } from "service/referentiel-service";

const ActivitySecondaryActivitySelectionPage = () => {
    const navigate = useNavigate();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.ACTIVITY_SECONDARY_ACTIVITY_SELECTION;
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const onClose = () => {
        saveAndNav(
            navigate,
            context,
            callbackHolder,
            getCurrentNavigatePath(
                context.idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
    };

    const onNext = () => {
        saveAndLoopNavigate(
            navigate,
            context,
            callbackHolder,
            EdtRoutesNameEnum.ACTIVITY_LOCATION,
            LoopEnum.ACTIVITY_OR_ROUTE,
            currentIteration,
        );
    };

    const onPrevious = () => {
        saveAndLoopNavigate(
            navigate,
            context,
            callbackHolder,
            EdtRoutesNameEnum.SECONDARY_ACTIVITY,
            LoopEnum.ACTIVITY_OR_ROUTE,
            currentIteration,
        );
    };

    return (
        <LoopSurveyPage onNext={onNext} onPrevious={onPrevious} onClose={onClose}>
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                    overrideOptions={getSecondaryActivityRef()}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default ActivitySecondaryActivitySelectionPage;
