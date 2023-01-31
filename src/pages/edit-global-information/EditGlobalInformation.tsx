import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import {
    getOrchestratorPage,
    navFullPath,
    saveAndNavFullPath,
    setEnviro,
} from "service/navigation-service";
import {
    getComponentsOfVariable,
    getPrintedFirstName,
    getPrintedSurveyDate,
} from "service/survey-service";

const EditGlobalInformationPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);

    const keydownChange = () => {
        const componentNameId = getComponentsOfVariable(FieldNameEnum.FIRSTNAME, context.source)[1].id;
        const disableButtonForName = componentNameId
            ? callbackHolder.getErrors() == undefined ||
              callbackHolder.getErrors()[componentNameId].length > 0
            : false;

        const componentDateId = getComponentsOfVariable(FieldNameEnum.SURVEYDATE, context.source)[1].id;
        const dataSurveyDate = callbackHolder.getData().COLLECTED?.SURVEYDATE.COLLECTED;
        const errorData =
            dataSurveyDate != null &&
            (typeof dataSurveyDate == "string" ? dataSurveyDate.includes("Invalid") : false);

        const disableButtonForDate = componentDateId
            ? callbackHolder.getErrors()[componentDateId].length > 0 || errorData
            : false;
        setDisabledButton(disableButtonForName || disableButtonForDate);
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
            onPrevious={() => navFullPath(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)}
            firstName={getPrintedFirstName(context.idSurvey)}
            surveyDate={getPrintedSurveyDate(context.idSurvey, context.surveyRootPage)}
            disableNav={disabledButton}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    cbHolder={callbackHolder}
                    page={getOrchestratorPage(
                        EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION,
                        context.surveyRootPage,
                    )}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default EditGlobalInformationPage;
