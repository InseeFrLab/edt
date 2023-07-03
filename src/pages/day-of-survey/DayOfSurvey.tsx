import day_of_survey from "assets/illustration/day-of-survey.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { navToErrorPage } from "service/navigation-service";
import { surveyReadOnly } from "service/survey-activity-service";
import { getComponentId, setValue } from "service/survey-service";

const DayOfSurveyPage = () => {
    const context: OrchestratorContext = useOutletContext();
    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);
    const modifiable = !surveyReadOnly(context.rightsSurvey);

    const keydownChange = () => {
        const componentId = getComponentId(FieldNameEnum.SURVEYDATE, context.source);
        if (componentId == null) {
            navToErrorPage();
        } else {
            dayjs.extend(customParseFormat);
            const input = (
                document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement
            )?.value;
            const inputFormatted = dayjs(input, "DD/MM/YYYY").format("YYYY-MM-DD");
            const bdd = setValue(context.idSurvey, FieldNameEnum.SURVEYDATE, inputFormatted);
            if (bdd) context.data = bdd;

            const errorData =
                inputFormatted != null &&
                (typeof inputFormatted == "string" ? inputFormatted.includes("Invalid") : false);

            console.log(componentId, callbackHolder, errorData, bdd);
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
                disableButton={modifiable ? disabledButton : true}
            />
        </>
    );
};

export default DayOfSurveyPage;
