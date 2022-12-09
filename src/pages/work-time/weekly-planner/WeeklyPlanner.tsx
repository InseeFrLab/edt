import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getPrintedFirstName, getSurveyDate, saveData } from "service/survey-service";

const WeeklyPlannerPage = () => {
    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);

    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    const save = (): void => {
        saveData(context.idSurvey, callbackHolder.getData());
    };

    const validateAndNav = (): void => {
        if (displayDayOverview) {
            save();
            setDisplayDayOverview(false);
        } else {
            saveAndGoHome();
        }
    };

    const onEdit = () => {
        //TODO : sprint 5 edition des données
    };

    const startDate: string | undefined = getSurveyDate(context.idSurvey);

    return (
        <SurveyPage
            validate={validateAndNav}
            onNavigateBack={validateAndNav}
            onEdit={onEdit}
            firstName={getPrintedFirstName(context.idSurvey)}
            simpleHeader={displayDayOverview}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="3"
                    surveyDate={startDate}
                    isSubChildDisplayed={displayDayOverview}
                    setIsSubChildDisplayed={setDisplayDayOverview}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default WeeklyPlannerPage;
