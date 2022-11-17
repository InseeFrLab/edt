import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import NavButton from "components/commons/NavButton/NavButton";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { LunaticData, OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentActivityNavigatePath } from "service/navigation-service";
import { saveData } from "service/survey-activity-service";

const WhoAreYouPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;

    const validate = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentActivityNavigatePath(context.idSurvey));
        });
    };

    const callbackHolder: { getData(): LunaticData } = {
        getData: () => {
            return {};
        },
    };

    return (
        <>
            <PageIcon srcIcon={who_are_you} altIcon={t("accessibility.asset.who-are-you-alt")} />

            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="1"
                ></OrchestratorForStories>
            </FlexCenter>

            <FlexCenter>
                <NavButton onClick={validate} text={t("common.navigation.validate")} />
            </FlexCenter>
        </>
    );
};

export default WhoAreYouPage;
