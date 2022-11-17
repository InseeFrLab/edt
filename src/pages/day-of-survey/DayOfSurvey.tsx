import day_of_survey from "assets/illustration/day-of-survey.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import NavButton from "components/commons/NavButton/NavButton";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { LunaticData, OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

const DayOfSurveyPage = () => {
    const { t } = useTranslation();
    const context = useOutletContext() as OrchestratorContext;

    const validate = () => {
        //save lunatic
        //nav next
    };

    const callbackHolder: { getData(): LunaticData } = {
        getData: () => {
            return {};
        },
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
