import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { makeStylesEdt } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useOutletContext, useParams } from "react-router-dom";

const MainActivityPage = () => {
    const { classes } = useStyles();
    const context = useOutletContext() as OrchestratorContext;
    const { iteration } = useParams();
    return (
        <>
            <OrchestratorForStories
                source={context.source}
                data={context.data}
                callbackHolder={callbackHolder}
                page="4"
                subPage="3"
                iteration={iteration ? +iteration : 0}
            ></OrchestratorForStories>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { MainActivityPage } })(() => ({}));

export default MainActivityPage;
