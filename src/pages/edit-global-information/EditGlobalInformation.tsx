import who_are_you from "assets/illustration/who-are-you.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getComponentsOfVariable } from "service/survey-service";

const EditGlobalInformationPage = () => {
    const context: OrchestratorContext = useOutletContext();
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
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION}
            nextRoute={EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER}
            backRoute={EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER}
            errorIcon={who_are_you}
            errorAltIcon={"accessibility.asset.who-are-you-alt"}
            isStep={false}
            disableButton={disabledButton}
        />
    );
};

export default EditGlobalInformationPage;
