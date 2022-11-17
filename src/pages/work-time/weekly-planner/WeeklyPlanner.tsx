import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { OrchestratorForStories } from "orchestrator/Orchestrator";
import { makeStyles } from "tss-react/mui";

interface WeeklyPlannerProps { }

const WeeklyPlanner = (props: WeeklyPlannerProps) => {
    const { } = props;
    return (
        <>
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="3"
                ></OrchestratorForStories>
            </FlexCenter>
        </>
    )
};

export default WeeklyPlanner;
