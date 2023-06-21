import who_are_you from "assets/illustration/who-are-you.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { getComponentsOfVariable, setValue } from "service/survey-service";

const EditGlobalInformationPage = () => {
    const context: OrchestratorContext = useOutletContext();
    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);

    const keydownChange = () => {
        const componentNameId = getComponentsOfVariable(FieldNameEnum.FIRSTNAME, context.source)[1].id;
        const disableButtonForName = componentNameId
            ? callbackHolder.getErrors() == undefined ||
              callbackHolder.getErrors()[componentNameId].length > 0
            : false;

        dayjs.extend(customParseFormat);
        const input = (document.getElementsByClassName("MuiInputBase-input")[1] as HTMLInputElement)
            .value;
        const inputFormatted = dayjs(input, "DD/MM/YYYY").format("YYYY-MM-DD");
        const bdd = setValue(context.idSurvey, FieldNameEnum.SURVEYDATE, inputFormatted);
        if (bdd) context.data = bdd;

        const componentDateId = getComponentsOfVariable(FieldNameEnum.SURVEYDATE, context.source)[1].id;
        const errorData =
            inputFormatted != null &&
            (typeof inputFormatted == "string" ? inputFormatted.includes("Invalid") : false);

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
