import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import ValidateButton from "components/commons/ValidateButton/ValidateButton";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getCurrentSurveyParentPage } from "service/orchestrator-service";
import { getSurveyDate, saveData } from "service/survey-service";

const WeeklyPlannerPage = () => {
    const context = useOutletContext() as OrchestratorContext;
    const navigate = useNavigate();
    const { t } = useTranslation();

    const validate = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, getCurrentSurveyParentPage(), context.source.maxPage));
        });
    };

    const startDate: string | undefined= getSurveyDate(context.idSurvey);

    return (
        <>
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="3"
                    surveyDate={startDate}
                ></OrchestratorForStories>
            </FlexCenter>

            <FlexCenter>
                <ValidateButton text={t("common.navigation.validate")} onClick={validate} />
            </FlexCenter>
        </>
    );
};

export default WeeklyPlannerPage;
