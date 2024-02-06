import day_of_survey from "assets/illustration/day-of-survey.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { ModePersistenceEnum } from "enumerations/ModePersistenceEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { navToErrorPage } from "service/navigation-service";
import { surveyReadOnly } from "service/survey-activity-service";
import {
    getComponentId,
    getData,
    getModePersistence,
    getPerson,
    navToPlanner,
    saveData,
    setValue,
} from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

const DayOfSurveyPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const navigate = useNavigate();

    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);
    const modifiable =
        context.surveyRootPage == EdtRoutesNameEnum.WORK_TIME
            ? true
            : !surveyReadOnly(context.rightsSurvey);

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
            const bdd = setValue(idSurvey, FieldNameEnum.SURVEYDATE, inputFormatted);
            if (bdd) context.data = bdd;

            const errorData =
                inputFormatted != null &&
                (typeof inputFormatted == "string" ? inputFormatted.includes("Invalid") : false);

            setDisabledButton(callbackHolder.getErrors()?.[componentId]?.length > 0 || errorData);
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

    const setSurveyDate = (input: string) => {
        let dataSurveyDate = callbackHolder.getData().COLLECTED?.[FieldNameEnum.SURVEYDATE];
        const dataBdd = getData(idSurvey);
        dayjs.extend(customParseFormat);
        const inputFormatted = dayjs(input, "DD/MM/YYYY").format("YYYY-MM-DD");
        dataSurveyDate = {
            COLLECTED:
                getModePersistence(dataBdd) == ModePersistenceEnum.COLLECTED ? inputFormatted : null,
            EDITED: getModePersistence(dataBdd) == ModePersistenceEnum.EDITED ? inputFormatted : null,
            FORCED: null,
            INPUTED: null,
            PREVIOUS: null,
        };

        if (dataBdd.COLLECTED && dataSurveyDate) {
            dataBdd.COLLECTED[FieldNameEnum.SURVEYDATE] = dataSurveyDate;
        }
        return dataBdd;
    };

    const validate = useCallback(() => {
        const input = (document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement)
            ?.value;
        const personAct = getPerson(idSurvey);
        const surveyRootPage =
            personAct?.data?.questionnaireModelId == SourcesEnum.WORK_TIME_SURVEY
                ? EdtRoutesNameEnum.WORK_TIME
                : EdtRoutesNameEnum.ACTIVITY;
        const dataUpdated = setSurveyDate(input);
        saveData(idSurvey, dataUpdated, false, true).then(data => {
            navigate(navToPlanner(idSurvey, surveyRootPage));
        });
    }, []);

    return (
        <>
            <SurveyPageStep
                currentPage={EdtRoutesNameEnum.DAY_OF_SURVEY}
                errorIcon={day_of_survey}
                errorAltIcon={"accessibility.asset.day-of-survey-alt"}
                isStep={false}
                disableButton={modifiable ? disabledButton : true}
                validateButton={validate}
            />
        </>
    );
};

export default DayOfSurveyPage;
