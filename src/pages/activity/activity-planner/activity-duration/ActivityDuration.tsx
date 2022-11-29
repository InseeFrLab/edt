import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { makeStylesEdt } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useOutletContext, useParams } from "react-router-dom";
import { LoopPage } from "service/survey-service";

const ActivityDurationPage = () => {
    const { classes } = useStyles();
    const context = useOutletContext() as OrchestratorContext;
    const { iteration } = useParams();

    return (
        <>
            <OrchestratorForStories
                source={context.source}
                data={context.data}
                callbackHolder={callbackHolder}
                page={LoopPage.ACTIVITY}
                subPage="2"
                iteration={iteration ? +iteration : 0}
            ></OrchestratorForStories>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityDurationPage } })(() => ({}));

export default ActivityDurationPage;
