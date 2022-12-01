import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getPrintedFirstName, getPrintedSurveyDate, saveData } from "service/survey-service";

const WhoAreYouPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;
    let [disabledButton, setDisabledButton] = React.useState<boolean>(true);

    const validate = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getCurrentNavigatePath(context.idSurvey, context.surveyRootPage, context.source.maxPage),
            );
        });
    };

    const navBack = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    React.useEffect(() => {
        const keydownChange = (e: any) => {
            setDisabledButton(
                callbackHolder.getErrors() == undefined ||
                    callbackHolder.getErrors()["inputtext_firstName"].length > 0,
            );
        };
        document.addEventListener("keyup", keydownChange);
    }, [callbackHolder]);

    return (
        <>
            <SurveyPage
                validate={validate}
                srcIcon={who_are_you}
                altIcon={t("accessibility.asset.who-are-you-alt")}
                onNavigateBack={navBack}
                firstName={getPrintedFirstName(context.idSurvey)}
                surveyDate={getPrintedSurveyDate(context.idSurvey, context.surveyRootPage)}
                disableNav={disabledButton}
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
