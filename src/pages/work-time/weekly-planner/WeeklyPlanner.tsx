import { WeeklyPlannerSpecificProps, responsesHourChecker } from "@inseefrlab/lunatic-edt";
import { IODataStructure } from "@inseefrlab/lunatic-edt/src/interface/WeeklyPlannerTypes";
import InfoIcon from "assets/illustration/info.svg";
import expandLessWhite from "assets/illustration/mui-icon/expand-less-white.svg";
import expandLess from "assets/illustration/mui-icon/expand-less.svg";
import expandMoreWhite from "assets/illustration/mui-icon/expand-more-white.svg";
import expandMore from "assets/illustration/mui-icon/expand-more.svg";
import InfoTooltipIcon from "assets/illustration/mui-icon/info.svg";
import moreHorizontal from "assets/illustration/mui-icon/more-horizontal.svg";
import work from "assets/illustration/mui-icon/work-full.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
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
import { getSurveyIdFromUrl } from "utils/utils";

const WeeklyPlannerPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);

    setEnviro(context, useNavigate(), callbackHolder);

    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);
    const [displayedDayHeader, setDisplayedDayHeader] = React.useState<string>("");

    const currentPage = EdtRoutesNameEnum.WEEKLY_PLANNER;

    const save = (data?: IODataStructure[]): void => {
        const callbackData = callbackHolder.getData();
        let dataWeeklyCallback = callbackData?.COLLECTED?.[FieldNameEnum.WEEKLYPLANNER]
            .COLLECTED as any[];
        if (data && dataWeeklyCallback && data?.length > dataWeeklyCallback.length) {
            dataWeeklyCallback = data;
            if (callbackData.COLLECTED) {
                callbackData.COLLECTED[FieldNameEnum.WEEKLYPLANNER].COLLECTED = data;
                callbackData.COLLECTED[FieldNameEnum.WEEKLYPLANNER].EDITED = data;
            }
        }
        saveData(idSurvey, callbackData);
    };

    const getHourMinWithZeros = (name: string) => {
        let hourMin = name.split("h");
        const hour = hourMin[0];
        hourMin[0] = Number(hour) < 10 ? "0" + hour : hour;
        const min = hourMin[1];
        hourMin[1] = Number(min) < 10 ? "0" + min : min;
        const nameCallbackdata = hourMin[0] + "H" + hourMin[1];
        return nameCallbackdata;
    }

    const initHours = (hourMin: string) => {
        const callbackData = callbackHolder.getData();
        let quartier = callbackData?.COLLECTED?.[hourMin].COLLECTED;
        let arrayQuartiers = new Array(7);
        if (quartier) {
            quartier = quartier as string[];
            if (quartier.length < 7) {
                quartier.forEach((q, index) => {
                    arrayQuartiers[index] = q;
                })
            }
        }
        return arrayQuartiers;
    }


    const saveDuration = (response: responsesHourChecker) => {
        const promisesToWait: Promise<any>[] = [];

        const callbackData = callbackHolder.getData();
        const dataCopy = Object.assign({}, callbackData);
        const dates = dataCopy?.COLLECTED?.[FieldNameEnum.DATES].COLLECTED as string[];
        const currentDateIndex = dates.indexOf(response.date);

        response.names.forEach(name => {
            let quartier = dataCopy?.COLLECTED?.[name].COLLECTED as string[];
            //let arrayQuartiers = initHours(name);
            quartier[currentDateIndex] = (response.values[name]) + "";

            if (dataCopy && dataCopy.COLLECTED) {
                dataCopy.COLLECTED[name].COLLECTED = quartier;
            }

            promisesToWait.push(
                saveData(idSurvey, dataCopy)
            );
        });

        saveData(idSurvey, dataCopy).then((data) => {
            saveData(idSurvey, dataCopy);
        });
    }

    const specificProps: WeeklyPlannerSpecificProps = {
        surveyDate: getSurveyDate(idSurvey),
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
        modifiable: true,
        saveHours: (response: responsesHourChecker) => {
            saveDuration(response);
        }
    };

    const validateAndNav = (): void => {
        if (displayDayOverview) {
            save();
            setDisplayDayOverview(false);
        } else {
            closeFormularieAndNav(
                idSurvey,
                getFullNavigatePath(idSurvey, EdtRoutesNameEnum.KIND_OF_WEEK),
            );
        }
    };

    const onEdit = () => {
        navFullPath(idSurvey, EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION, EdtRoutesNameEnum.WORK_TIME);
    };

    return (
        <>
            <SurveyPage
                idSurvey={idSurvey}
                validate={useCallback(() => validateAndNav(), [displayDayOverview])}
                onNavigateBack={useCallback(() => validateAndNav(), [displayDayOverview])}
                onPrevious={useCallback(() => saveAndNav(idSurvey), [])}
                onEdit={useCallback(() => onEdit(), [])}
                onHelp={navToHelp}
                firstName={getPrintedFirstName(idSurvey)}
                firstNamePrefix={t("component.survey-page-edit-header.week-of")}
                simpleHeader={displayDayOverview}
                simpleHeaderLabel={displayedDayHeader}
                backgroundWhiteHeader={displayDayOverview}
                modifiable={true}
            >
                <FlexCenter>
                    <OrchestratorForStories
                        source={context.source}
                        data={getData(idSurvey)}
                        cbHolder={callbackHolder}
                        page={getOrchestratorPage(currentPage)}
                        componentSpecificProps={specificProps}
                        idSurvey={idSurvey}
                    ></OrchestratorForStories>
                </FlexCenter>
            </SurveyPage>
        </>
    );
};

export default WeeklyPlannerPage;
