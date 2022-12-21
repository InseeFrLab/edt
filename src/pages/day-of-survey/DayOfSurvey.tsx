import day_of_survey from "assets/illustration/day-of-survey.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getCurrentNavigatePath, getOrchestratorPage } from "service/navigation-service";
import {
    FieldNameEnum,
    getComponentId,
    getPrintedFirstName,
    getPrintedSurveyDate,
    saveData,
} from "service/survey-service";

const DayOfSurveyPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.DAY_OF_SURVEY;

    let [disabledButton, setDisabledButton] = React.useState<boolean>(false);

    const keydownChange = () => {
        //TODO: nav to error page when componentId empty
        const componentId = getComponentId(FieldNameEnum.SURVEYDATE, context.source) || "";
        const dataSurveyDate = callbackHolder.getData().COLLECTED?.SURVEYDATE.COLLECTED;
        const errorData =
            dataSurveyDate != null &&
            (typeof dataSurveyDate == "string" ? dataSurveyDate.includes("Invalid") : false);

        setDisabledButton(callbackHolder.getErrors()[componentId].length > 0 || errorData);
    };

    React.useEffect(() => {
        document.addEventListener("keyup", keydownChange, true);
        return () => document.removeEventListener("keyup", keydownChange, true);
    }, [callbackHolder]);

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

    return (
        <>
            <SurveyPage
                validate={validate}
                srcIcon={day_of_survey}
                altIcon={t("accessibility.asset.day-of-survey-alt")}
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
                        page={getOrchestratorPage(currentPage)}
                    ></OrchestratorForStories>
                </FlexCenter>
            </SurveyPage>
        </>
    );
};

export default DayOfSurveyPage;
