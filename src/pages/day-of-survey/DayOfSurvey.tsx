import day_of_survey from "assets/illustration/day-of-survey.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getPrintedFirstName, getPrintedSurveyDate, saveData } from "service/survey-service";

const DayOfSurveyPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;

    const validate = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getCurrentNavigatePath(
                    context.idSurvey,
                    context.surveyParentPage,
                    context.source.maxPage,
                ),
            );
        });
    };

    const navBack = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    return (
        <>
            <SurveyPage
                validate={validate}
                srcIcon={day_of_survey}
                altIcon={t("accessibility.asset.day-of-survey-alt")}
                onNavigateBack={navBack}
                firstName={getPrintedFirstName(context.idSurvey)}
                surveyDate={getPrintedSurveyDate(context.idSurvey, context.surveyParentPage)}
            >
                <FlexCenter>
                    <OrchestratorForStories
                        source={context.source}
                        data={context.data}
                        callbackHolder={callbackHolder}
                        page="2"
                    ></OrchestratorForStories>
                </FlexCenter>
            </SurveyPage>
        </>
    );
};

export default DayOfSurveyPage;
