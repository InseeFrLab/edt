import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { makeStylesEdt } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useOutletContext } from "react-router-dom";
import { getPrintedFirstName, saveData } from "service/survey-service";

const ActivityPlannerPage = () => {
    const context = useOutletContext() as OrchestratorContext;
    const { classes } = useStyles();

    const save = (): void => {
        saveData(context.idSurvey, callbackHolder.getData());
    };

    const validate = () => {
        console.log(callbackHolder.getData());
        save();
        //save();
    };

    const navBack = () => {
        //TODO
    };

    const onEdit = () => {
        //TODO : sprint 5 edition des données
    };

    return (
        <SurveyPage
            onNavigateBack={navBack}
            onEdit={onEdit}
            firstName={getPrintedFirstName(context.idSurvey)}
            validate={validate}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="4"
                    subPage="2"
                    iteration={0}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityPlannerPage } })(() => ({}));

export default ActivityPlannerPage;
