import day_of_survey from "assets/illustration/day-of-survey.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import NavButton from "components/commons/NavButton/NavButton";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getCurrentSurveyParentPage } from "service/orchestrator-service";
import { saveData } from "service/survey-service";

const DayOfSurveyPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;

    const validate = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, getCurrentSurveyParentPage()));
        });
    };

    return (
        <>
            <PageIcon srcIcon={day_of_survey} altIcon={t("accessibility.asset.day-of-survey-alt")} />

            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="2"
                ></OrchestratorForStories>
            </FlexCenter>

            <FlexCenter>
                <NavButton text={t("common.navigation.validate")} onClick={validate} />
            </FlexCenter>
        </>
    );
};

export default DayOfSurveyPage;
