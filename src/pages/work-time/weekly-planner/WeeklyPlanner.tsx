import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { WeeklyPlannerSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getPrintedFirstName, getSurveyDate, saveData } from "service/survey-service";

const WeeklyPlannerPage = () => {
    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);

    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const specificProps: WeeklyPlannerSpecificProps = {
        surveyDate: getSurveyDate(context.idSurvey),
        isSubChildDisplayed: displayDayOverview,
        setIsSubChildDisplayed: setDisplayDayOverview,
        labels: {
            title: t("component.weekly-planner.title"),
            workSumLabel: t("component.weekly-planner.work-sum-label"),
            presentButtonLabel: t("component.weekly-planner.present-button-label"),
            futureButtonLabel: t("component.weekly-planner.future-button-label"),
        },
    };

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
            saveAndGoHome();
        }
    };

    const onEdit = () => {
        //TODO : sprint 5 edition des données
    };

    return (
        <SurveyPage
            validate={validateAndNav}
            onNavigateBack={validateAndNav}
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
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default WeeklyPlannerPage;
