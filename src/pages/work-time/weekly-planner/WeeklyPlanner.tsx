import { WeeklyPlannerSpecificProps } from "@inseefrlab/lunatic-edt";
import InfoIcon from "assets/illustration/info.svg";
import InfoTooltipIcon from "assets/illustration/mui-icon/info.svg";
import expandLessWhite from "assets/illustration/mui-icon/expand-less-white.svg";
import expandLess from "assets/illustration/mui-icon/expand-less.svg";
import expandMoreWhite from "assets/illustration/mui-icon/expand-more-white.svg";
import expandMore from "assets/illustration/mui-icon/expand-more.svg";
import moreHorizontal from "assets/illustration/mui-icon/more-horizontal.svg";
import work from "assets/illustration/mui-icon/work-full.svg";
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
import { getData, getPrintedFirstName, getSurveyDate, saveData } from "service/survey-service";
import { surveyReadOnly } from "service/survey-activity-service";

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
            editButtonLabel: t("common.navigation.edit"),
            infoLabels: {
                normalText: t("page.weekly-planner.info-light"),
                boldText: t("page.weekly-planner.info-bold"),
                infoIconAlt: t("accessibility.asset.info.info-alt"),
                infoIcon: InfoIcon,
                border: true,
                infoIconTooltip: InfoTooltipIcon,
                infoIconTooltipAlt: t("accessibility.asset.info.info-alt"),
            },
        },
        saveAll: save,
        language: getLanguage(),
        moreIcon: moreHorizontal,
        moreIconAlt: t("accessibility.asset.mui-icon.more-horizontal"),
        expandLessIcon: expandLess,
        expandLessIconAlt: t("accessibility.asset.mui-icon.expand-less"),
        expandMoreIcon: expandMore,
        expandMoreIconAlt: t("accessibility.asset.mui-icon.expand-more"),
        expandLessWhiteIcon: expandLessWhite,
        expandMoreWhiteIcon: expandMoreWhite,
        workIcon: work,
        workIconAlt: t("accessibility.asset.mui-icon.work"),
        modifiable: !surveyReadOnly(context.rightsSurvey),
    };
    console.log(context.rightsSurvey);
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
    console.log(context.rightsSurvey);
    return (
        <>
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
                modifiable={!surveyReadOnly(context.rightsSurvey)}
            >
                <FlexCenter>
                    <OrchestratorForStories
                        source={context.source}
                        data={context.data}
                        cbHolder={callbackHolder}
                        page={getOrchestratorPage(currentPage)}
                        componentSpecificProps={specificProps}
                        idSurvey={context.idSurvey}
                        dataSurvey={getData(context.idSurvey)}
                    ></OrchestratorForStories>
                </FlexCenter>
            </SurveyPage>
        </>
    );
};

export default WeeklyPlannerPage;
