import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    getPrintedFirstName,
    getPrintedSurveyDate,
    getSurveyDate,
    saveData,
} from "service/survey-service";

const WeeklyPlannerPage = () => {
    const context = useOutletContext() as OrchestratorContext;
    const navigate = useNavigate();

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    const validate = () => {
        saveAndGoHome();
    };

    const navBack = () => {
        saveAndGoHome();
    };

    const startDate: string | undefined = getSurveyDate(context.idSurvey);

    return (
        <SurveyPage
            validate={validate}
            onNavigateBack={navBack}
            firstName={getPrintedFirstName(context.idSurvey)}
            surveyDate={getPrintedSurveyDate(context.idSurvey)}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="3"
                    surveyDate={startDate}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default WeeklyPlannerPage;
