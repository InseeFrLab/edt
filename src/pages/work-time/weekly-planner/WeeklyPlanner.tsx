import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutes } from "routes/EdtRoutes";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getCurrentNavigatePath, getFullNavigatePath } from "service/navigation-service";
import { getPrintedFirstName, getSurveyDate, saveData } from "service/survey-service";

const saveAndGoNext = (
    navigate: NavigateFunction,
    context: OrchestratorContext,
    callbackHolder: any,
): void => {
    saveData(context.idSurvey, callbackHolder.getData()).then(() => {
        navigate(getFullNavigatePath(context.idSurvey, EdtRoutesNameEnum.KIND_OF_WEEK));
    });
};

const WeeklyPlannerPage = () => {
    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);

    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    const save = (): void => {
        saveData(context.idSurvey, callbackHolder.getData());
    };

    const validateAndNav = (): void => {
        if (displayDayOverview) {
            save();
            setDisplayDayOverview(false);
        } else {
            saveAndGoNext(navigate, context, callbackHolder);
        }
    };

    const onEdit = () => {
        //TODO : sprint 5 edition des données
    };

    const startDate: string | undefined = getSurveyDate(context.idSurvey);

    return (
        <SurveyPage
            validate={validateAndNav}
            onNavigateBack={saveAndGoHome}
            onEdit={onEdit}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={displayDayOverview}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="3"
                    surveyDate={startDate}
                    isSubChildDisplayed={displayDayOverview}
                    setIsSubChildDisplayed={setDisplayDayOverview}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default WeeklyPlannerPage;
