import day_of_survey from "assets/illustration/day-of-survey.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { navToErrorPage } from "service/navigation-service";
import { getComponentId } from "service/survey-service";

const DayOfSurveyPage = () => {
    const context: OrchestratorContext = useOutletContext();
    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);

    const keydownChange = () => {
        const componentId = getComponentId(FieldNameEnum.SURVEYDATE, context.source);
        if (componentId == null) {
            navToErrorPage(
                ErrorCodeEnum.COMMON,
                `une erreur s'est produit lors la recuperation du surveydate de la source ${context?.source?.label}`,
            );
        } else {
            const dataSurveyDate = callbackHolder.getData().COLLECTED?.SURVEYDATE.COLLECTED;
            const errorData =
                dataSurveyDate != null &&
                (typeof dataSurveyDate == "string" ? dataSurveyDate.includes("Invalid") : false);
            setDisabledButton(callbackHolder.getErrors()[componentId].length > 0 || errorData);
        }
    };

    React.useEffect(() => {
        document.addEventListener("keyup", keydownChange, true);
        return () => document.removeEventListener("keyup", keydownChange, true);
    }, [callbackHolder]);

    const keypressChange = (event: any) => {
        if (event.key === "Enter") {
            document.getElementById("validateButton")?.click();
        }
    };

    React.useEffect(() => {
        document.addEventListener("keypress", keypressChange, true);
        return () => document.removeEventListener("keypress", keypressChange, true);
    }, [callbackHolder]);

    return (
        <>
            <SurveyPageStep
                currentPage={EdtRoutesNameEnum.DAY_OF_SURVEY}
                errorIcon={day_of_survey}
                errorAltIcon={"accessibility.asset.day-of-survey-alt"}
                isStep={false}
                disableButton={disabledButton}
            />
        </>
    );
};

export default DayOfSurveyPage;
