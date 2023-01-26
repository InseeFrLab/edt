import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import {
    getOrchestratorPage,
    navToErrorPage,
    navToHome,
    saveAndNav,
    saveAndNextStep,
    setEnviro,
} from "service/navigation-service";
import {
    FieldNameEnum,
    getComponentId,
    getPrintedFirstName,
    getPrintedSurveyDate,
} from "service/survey-service";

const WhoAreYouPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.WHO_ARE_YOU;
    setEnviro(context, useNavigate(), callbackHolder);

    let [disabledButton, setDisabledButton] = React.useState<boolean>(true);

    const keydownChange = () => {
        const componentId = getComponentId(FieldNameEnum.FIRSTNAME, context.source);
        if (componentId == null) {
            navToErrorPage();
        } else {
            setDisabledButton(
                callbackHolder.getErrors() == undefined ||
                    callbackHolder.getErrors()[componentId].length > 0,
            );
        }
    };

    React.useEffect(() => {
        document.addEventListener("keyup", keydownChange, true);
        return () => document.removeEventListener("keyup", keydownChange, true);
    }, [callbackHolder]);

    return (
        <>
            <SurveyPage
                validate={() => saveAndNextStep(context.surveyRootPage, currentPage)}
                srcIcon={who_are_you}
                altIcon={t("accessibility.asset.who-are-you-alt")}
                onNavigateBack={() => saveAndNav()}
                onPrevious={() => navToHome()}
                firstName={getPrintedFirstName(context.idSurvey)}
                surveyDate={getPrintedSurveyDate(context.idSurvey, context.surveyRootPage)}
                disableNav={disabledButton}
            >
                <FlexCenter>
                    <OrchestratorForStories
                        source={context.source}
                        data={context.data}
                        cbHolder={callbackHolder}
                        page={getOrchestratorPage(currentPage)}
                    ></OrchestratorForStories>
                </FlexCenter>
            </SurveyPage>
        </>
    );
};

export default WhoAreYouPage;
