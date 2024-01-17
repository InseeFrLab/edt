import {
    WeeklyPlannerSpecificProps,
    getArrayFromSession,
    responsesHourChecker,
} from "@inseefrlab/lunatic-edt";
import { IODataStructure } from "@inseefrlab/lunatic-edt/src/interface/WeeklyPlannerTypes";
import InfoIcon from "assets/illustration/info.svg";
import expandLessWhite from "assets/illustration/mui-icon/expand-less-white.svg";
import expandLess from "assets/illustration/mui-icon/expand-less.svg";
import expandMoreWhite from "assets/illustration/mui-icon/expand-more-white.svg";
import expandMore from "assets/illustration/mui-icon/expand-more.svg";
import InfoTooltipIcon from "assets/illustration/mui-icon/info.svg";
import moreHorizontal from "assets/illustration/mui-icon/more-horizontal.svg";
import work from "assets/illustration/mui-icon/work-full.svg";
import ClientIcon from "assets/illustration/place-work-categories/client.svg";
import HomeIcon from "assets/illustration/place-work-categories/home.svg";
import NotWorkIcon from "assets/illustration/place-work-categories/notwork.svg";
import OtherIcon from "assets/illustration/place-work-categories/other.svg";
import WorkIcon from "assets/illustration/place-work-categories/work.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import HelpMenu from "components/edt/HelpMenu/HelpMenu";
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
    getNavigatePath,
    getOrchestratorPage,
    navFullPath,
    saveAndNav,
    setEnviro,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { getData, getPrintedFirstName, getSurveyDate, saveData } from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

const WeeklyPlannerPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();

    const { t } = useTranslation();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);

    setEnviro(context, useNavigate(), callbackHolder);

    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);
    let [isPlaceWorkDisplayed, setIsPlaceWorkDisplayed] = React.useState<boolean>(false);
    const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);

    const [displayedDayHeader, setDisplayedDayHeader] = React.useState<string>("");

    const currentPage = EdtRoutesNameEnum.WEEKLY_PLANNER;

    const save = (idSurvey: string, data?: [IODataStructure[], string[], string[], any[]]): void => {
        const callbackData = callbackHolder.getData();
        if (data && data[1].length > 0) {
            if (callbackData.COLLECTED) {
                callbackData.COLLECTED[FieldNameEnum.WEEKLYPLANNER].COLLECTED = data[0];
                callbackData.COLLECTED[FieldNameEnum.WEEKLYPLANNER].EDITED = data[0];
                callbackData.COLLECTED[FieldNameEnum.DATES].COLLECTED = data[1];
                callbackData.COLLECTED[FieldNameEnum.DATES].EDITED = data[1];
                callbackData.COLLECTED[FieldNameEnum.DATES_STARTED].COLLECTED = data[2];
                callbackData.COLLECTED[FieldNameEnum.DATES_STARTED].EDITED = data[2];
            }

            const dataResponse = getData(idSurvey);
            if (
                dataResponse.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED ==
                callbackData.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED
            ) {
                saveData(idSurvey, callbackData);
            }
        }
    };

    const saveDuration = (idSurveyResponse: string, response: responsesHourChecker) => {
        const callbackData = callbackHolder.getData();
        const dataCopy = { ...callbackData };
        const dates = (dataCopy?.COLLECTED?.["DATES"].COLLECTED ??
            getArrayFromSession("DATES")) as string[];
        const currentDateIndex = dates.indexOf(response.date);
        const dataResponse = getData(idSurveyResponse);
        if (
            dataResponse.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED ==
            dataCopy.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED
        ) {
            response.names.forEach(name => {
                let quartier = dataCopy?.COLLECTED?.[name].COLLECTED as string[];
                quartier[currentDateIndex] = response.values[name] + "";

                if (dataCopy?.COLLECTED) {
                    dataCopy.COLLECTED[name].COLLECTED = quartier;
                }
            });
            saveData(idSurveyResponse, dataCopy);
        }
    };

    const specificProps: WeeklyPlannerSpecificProps = {
        surveyDate: getSurveyDate(idSurvey),
        isSubChildDisplayed: displayDayOverview,
        setIsSubChildDisplayed: setDisplayDayOverview,
        isPlaceWorkDisplayed: isPlaceWorkDisplayed,
        setIsPlaceWorkDisplayed: setIsPlaceWorkDisplayed,
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
            dates: "DATES",
            datesStarted: "DATES_STARTED",
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
        saveHours: (idSurvey: string, response: responsesHourChecker) => {
            saveDuration(idSurvey, response);
        },
        optionsIcons: {
            "1": {
                icon: WorkIcon,
                altIcon: t("accessibility.assets.with-someone.categories.parents-alt"),
            },
            "2": {
                icon: HomeIcon,
                altIcon: t("accessibility.assets.with-someone.categories.child-alt"),
            },
            "3": {
                icon: ClientIcon,
                altIcon: t("accessibility.assets.with-someone.categories.other-know-alt"),
            },
            "4": {
                icon: OtherIcon,
                altIcon: t("accessibility.assets.with-someone.categories.other-alt"),
            },
            "5": {
                icon: NotWorkIcon,
                altIcon: t("accessibility.assets.with-someone.categories.couple-alt"),
            },
        },
        idSurvey: idSurvey,
    };

    const validateAndNav = (): void => {
        if (displayDayOverview) {
            save(idSurvey);
            if (isPlaceWorkDisplayed) {
                setDisplayDayOverview(true);
                setIsPlaceWorkDisplayed(false);
                isPlaceWorkDisplayed = false;
            } else {
                setDisplayDayOverview(false);
            }
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

    const onCloseHelpMenu = useCallback(() => {
        setIsHelpMenuOpen(false);
    }, [isHelpMenuOpen]);

    const navToContactPage = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.CONTACT));
    }, []);

    const navToInstallPage = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.INSTALL));
    }, []);

    const navToHelpPages = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_ACTIVITY));
    }, []);

    const renderMenuHelp = () => {
        return (
            <HelpMenu
                labelledBy={""}
                describedBy={""}
                onClickContact={navToContactPage}
                onClickInstall={navToInstallPage}
                onClickHelp={navToHelpPages}
                handleClose={onCloseHelpMenu}
                open={isHelpMenuOpen}
            />
        );
    };

    const onHelp = useCallback(() => {
        setIsHelpMenuOpen(true);
    }, []);

    return (
        <>
            {renderMenuHelp()}
            <SurveyPage
                idSurvey={idSurvey}
                validate={useCallback(() => validateAndNav(), [displayDayOverview])}
                onNavigateBack={useCallback(() => validateAndNav(), [displayDayOverview])}
                onPrevious={useCallback(() => saveAndNav(idSurvey), [])}
                onEdit={useCallback(() => onEdit(), [])}
                onHelp={onHelp}
                firstName={getPrintedFirstName(idSurvey)}
                firstNamePrefix={t("component.survey-page-edit-header.week-of")}
                simpleHeader={displayDayOverview}
                simpleHeaderLabel={displayedDayHeader}
                backgroundWhiteHeader={displayDayOverview}
            >
                <FlexCenter>
                    <OrchestratorForStories
                        source={context.source}
                        data={getData(idSurvey)}
                        cbHolder={callbackHolder}
                        page={getOrchestratorPage(currentPage)}
                        componentSpecificProps={specificProps}
                    ></OrchestratorForStories>
                </FlexCenter>
            </SurveyPage>
        </>
    );
};

export default WeeklyPlannerPage;
