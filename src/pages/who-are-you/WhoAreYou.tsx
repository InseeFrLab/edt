import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getCurrentSurveyParentPage } from "service/orchestrator-service";
import { getFirstName, getSurveyDate, saveData } from "service/survey-service";

const WhoAreYouPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;

    const validate = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, getCurrentSurveyParentPage(), context.source.maxPage));
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
                srcIcon={who_are_you}
                altIcon={t("accessibility.asset.who-are-you-alt")}
                onNavigateBack={navBack}
                firstName={getFirstName(context.idSurvey) || "PERSONNETOFIX"}
                surveyDate={getSurveyDate(context.idSurvey) || "JOURNEETOFIX"}
            >
                <FlexCenter>
                    <OrchestratorForStories
                        source={context.source}
                        data={context.data}
                        callbackHolder={callbackHolder}
                        page="1"
                    ></OrchestratorForStories>
                </FlexCenter>
            </SurveyPage>
        </>
    );
};

export default WhoAreYouPage;
