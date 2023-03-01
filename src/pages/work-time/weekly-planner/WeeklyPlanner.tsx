import { WeeklyPlannerSpecificProps } from "@inseefrlab/lunatic-edt";
import InfoIcon from "assets/illustration/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    closeFormularieAndNav,
    getFullNavigatePath,
    getOrchestratorPage,
    navFullPath,
    navToHelp,
    saveAndNav,
    setEnviro,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { getPrintedFirstName, getSurveyDate, saveData } from "service/survey-service";

const WeeklyPlannerPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);
    const [displayedDayHeader, setDisplayedDayHeader] = React.useState<string>("");

    const currentPage = EdtRoutesNameEnum.WEEKLY_PLANNER;

    const save = (): void => {
        saveData(context.idSurvey, callbackHolder.getData());
    };

    const specificProps: WeeklyPlannerSpecificProps = {
        surveyDate: getSurveyDate(context.idSurvey),
        isSubChildDisplayed: displayDayOverview,
        setIsSubChildDisplayed: setDisplayDayOverview,
        displayedDayHeader: displayedDayHeader,
        setDisplayedDayHeader: setDisplayedDayHeader,
        labels: {
            title: t("component.weekly-planner.title"),
            workSumLabel: t("component.weekly-planner.work-sum-label"),
            presentButtonLabel: t("component.weekly-planner.present-button-label"),
            futureButtonLabel: t("component.weekly-planner.future-button-label"),
            infoLabels: {
                normalText: t("page.weekly-planner.info-light"),
                boldText: t("page.weekly-planner.info-bold"),
                infoIconAlt: t("accessibility.asset.info.info-alt"),
                infoIcon: InfoIcon,
                border: true,
            },
        },
        saveAll: save,
        language: getLanguage(),
    };

    const validateAndNav = (): void => {
        if (displayDayOverview) {
            save();
            setDisplayDayOverview(false);
        } else {
            closeFormularieAndNav(getFullNavigatePath(EdtRoutesNameEnum.KIND_OF_WEEK));
        }
    };

    const onEdit = () => {
        navFullPath(EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION, EdtRoutesNameEnum.WORK_TIME);
    };

    return (
        <SurveyPage
            validate={useCallback(() => validateAndNav(), [displayDayOverview])}
            onNavigateBack={useCallback(() => validateAndNav(), [displayDayOverview])}
            onPrevious={useCallback(() => saveAndNav(), [])}
            onEdit={useCallback(() => onEdit(), [])}
            onHelp={navToHelp}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={displayDayOverview}
            simpleHeaderLabel={displayedDayHeader}
            backgroundWhiteHeader={displayDayOverview}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    cbHolder={callbackHolder}
                    page={getOrchestratorPage(currentPage)}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default WeeklyPlannerPage;
