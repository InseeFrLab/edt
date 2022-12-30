import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getOrchestratorPage, saveAndNavFullPath } from "service/navigation-service";
import {
    FieldNameEnum,
    getComponentId,
    getPrintedFirstName,
    getPrintedSurveyDate,
} from "service/survey-service";

const EditGlobalInformationPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();

    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);

    const keydownChange = () => {
        //TODO: fix control for double input
        const componentDateId = getComponentId(FieldNameEnum.SURVEYDATE, context.source) || "";
        const dataSurveyDate = callbackHolder.getData().COLLECTED?.SURVEYDATE.COLLECTED;
        const errorData =
            dataSurveyDate != null &&
            (typeof dataSurveyDate == "string" ? dataSurveyDate.includes("Invalid") : false);

        setDisabledButton(callbackHolder.getErrors()[componentDateId]?.length > 0 || errorData);

        const componentNameId = getComponentId(FieldNameEnum.FIRSTNAME, context.source) || "";
        setDisabledButton(
            callbackHolder.getErrors() == undefined ||
                callbackHolder.getErrors()[componentNameId]?.length > 0,
        );
    };

    React.useEffect(() => {
        document.addEventListener("keyup", keydownChange, true);
        return () => document.removeEventListener("keyup", keydownChange, true);
    }, [callbackHolder]);

    return (
        <SurveyPage
            validate={() => saveAndNavFullPath(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)}
            srcIcon={who_are_you}
            altIcon={t("accessibility.asset.who-are-you-alt")}
            onNavigateBack={() => saveAndNavFullPath(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)}
            firstName={getPrintedFirstName(context.idSurvey)}
            surveyDate={getPrintedSurveyDate(context.idSurvey, context.surveyRootPage)}
            disableNav={disabledButton}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getOrchestratorPage(EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION)}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default EditGlobalInformationPage;
