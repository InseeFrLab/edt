import who_are_you from "assets/illustration/who-are-you.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { getComponentsOfVariable, setValue, validateAllGroup } from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

const EditGlobalInformationPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const navigate = useNavigate();

    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);

    const keydownChange = () => {
        const componentNameId = getComponentsOfVariable(FieldNameEnum.FIRSTNAME, context.source)[1].id;
        const disableButtonForName = componentNameId
            ? callbackHolder.getErrors()?.[componentNameId].length > 0
            : false;
        dayjs.extend(customParseFormat);
        const input =
            (document.getElementsByClassName("MuiInputBase-input")[1] as HTMLInputElement).value + " ";
        const inputFormatted = dayjs(input, "DD/MM/YYYY").format("YYYY-MM-DD");
        const bdd = setValue(idSurvey, FieldNameEnum.SURVEYDATE, inputFormatted);
        if (bdd) context.data = bdd;

        const componentDateId = getComponentsOfVariable(FieldNameEnum.SURVEYDATE, context.source)[1].id;
        const errorData =
            inputFormatted != null &&
            (typeof inputFormatted == "string" ? inputFormatted.includes("Invalid") : false);

        const disableButtonForDate = componentDateId
            ? callbackHolder.getErrors()?.[componentDateId]?.length > 0 || errorData
            : false;
        const disableButton = disableButtonForName || disableButtonForDate;
        setDisabledButton(disableButton);
    };

    React.useEffect(() => {
        document.addEventListener("keyup", keydownChange, true);
        return () => document.removeEventListener("keyup", keydownChange, true);
    }, [callbackHolder]);

    const validate = useCallback(() => {
        const inputName = (
            document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement
        )?.value;
        validateAllGroup(navigate, idSurvey, inputName);
    }, []);

    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION}
            nextRoute={
                context.surveyRootPage == EdtRoutesNameEnum.WORK_TIME
                    ? EdtRoutesNameEnum.WEEKLY_PLANNER
                    : EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER
            }
            backRoute={
                context.surveyRootPage == EdtRoutesNameEnum.WORK_TIME
                    ? EdtRoutesNameEnum.WEEKLY_PLANNER
                    : EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER
            }
            errorIcon={who_are_you}
            errorAltIcon={"accessibility.asset.who-are-you-alt"}
            isStep={false}
            disableButton={disabledButton}
            validateButton={validate}
        />
    );
};

export default EditGlobalInformationPage;
