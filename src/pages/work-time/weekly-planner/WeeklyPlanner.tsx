import {
    WeeklyPlannerSpecificProps,
    getArrayFromSession,
    makeStylesEdt,
    responsesHourChecker,
} from "@inseefrlab/lunatic-edt";
import { IODataStructure } from "@inseefrlab/lunatic-edt/src/interface/WeeklyPlannerTypes";
import { Box } from "@mui/material";
import InfoIcon from "../../../assets/illustration/info.svg?react";
import ExpandLessWhiteIcon from "../../../assets/illustration/mui-icon/expand-less-white.svg?react";
import ExpandLessIcon from "../../../assets/illustration/mui-icon/expand-less.svg?react";
import ExpandMoreWhiteIcon from "../../../assets/illustration/mui-icon/expand-more-white.svg?react";
import ExpandMoreIcon from "../../../assets/illustration/mui-icon/expand-more.svg?react";
import InfoTooltipIcon from "../../../assets/illustration/mui-icon/info.svg?react";
import MoreHorizontalIcon from "../../../assets/illustration/mui-icon/more-horizontal.svg?react";
import WorkFullIcon from "../../../assets/illustration/mui-icon/work-full.svg?react";
import ClientIcon from "../../../assets/illustration/place-work-categories/client.svg?react";
import HomeIcon from "../../../assets/illustration/place-work-categories/home.svg?react";
import NotWorkIcon from "../../../assets/illustration/place-work-categories/notwork.svg?react";
import OtherIcon from "../../../assets/illustration/place-work-categories/other.svg?react";
import WorkIcon from "../../../assets/illustration/place-work-categories/work.svg?react";
import FlexCenter from "../../../components/commons/FlexCenter/FlexCenter";
import SurveyPage from "../../../components/commons/SurveyPage/SurveyPage";
import HelpMenu from "../../../components/edt/HelpMenu/HelpMenu";
import { EdtRoutesNameEnum } from "../../../enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "../../../enumerations/FieldNameEnum";
import { LunaticData, MultiCollected, OrchestratorContext } from "../../../interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "../../../orchestrator/Orchestrator";
import ErrorProvider from "../../../pages/error/ErrorProvider";
import React, { useCallback } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import {
    closeFormularieAndNav,
    getFullNavigatePath,
    getNavigatePath,
    getOrchestratorPage,
    navFullPath,
    saveAndNavLocally,
    setEnviro,
} from "../../../service/navigation-service";
import { getLanguage } from "../../../service/referentiel-service";
import { isMobile, isPwa } from "../../../service/responsive";
import {
    getData,
    getPrintedFirstName,
    getSurveyDate,
    saveData,
} from "../../../service/survey-service";
import { isReviewer } from "../../../service/user-service";
import { getSurveyIdFromUrl } from "../../../utils/utils";

//TODO: For info:
// The Weekly Planner page UI uses the content of the "WEEKLYPLANNER" variable from the data object.
// This variable cannot be sent to the back office; it is only used in the front office.
// All of its content can be derived or calculated using other variables within the data object.
// This variable is deleted upon saving the data to the back office.
// However, if the user clears the local storage, the data will be lost, resulting in empty fields on the page.
// Additionally, the data is somehow overwritten if the user submits a new value for the Weekly Planner.
// (probably when the function initializeCollectedFields() is called in the save function)
// The component being used is from the lunatic-edt package.

const WeeklyPlannerPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();

    const { t } = useTranslation();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);

    setEnviro(context, useNavigate(), callbackHolder);
    const isMobileNav = !isPwa() && (isIOS || isAndroid || isMobile());
    const headerHeight = document.getElementById(
        t("accessibility.component.survey-selecter.id"),
    )?.clientHeight;
    const windowHeight = isMobileNav ? window.innerHeight : window.innerHeight - (headerHeight ?? 72);

    const { classes, cx } = useStyles({
        "isMobile": !isPwa(),
        "isIOS": isIOS,
        "iosHeight": context.isOpenHeader ? "80vh" : "87vh",
        "innerHeight": windowHeight,
    });

    const [displayDayOverview, setDisplayDayOverview] = React.useState<boolean>(false);
    let [isPlaceWorkDisplayed, setIsPlaceWorkDisplayed] = React.useState<boolean>(false);
    const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);

    const [displayedDayHeader, setDisplayedDayHeader] = React.useState<string>("");

    const currentPage = EdtRoutesNameEnum.WEEKLY_PLANNER;

    const initializeCollectedFields = (dataBdd: LunaticData, fieldsToInitialize: FieldNameEnum[]) => {
        if (dataBdd.COLLECTED !== undefined) {
            fieldsToInitialize.forEach(field => {
                if (!dataBdd.COLLECTED?.[field]) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    dataBdd.COLLECTED![field] = {
                        COLLECTED: [],
                        EDITED: [],
                        FORCED: null,
                        INPUTED: null,
                        PREVIOUS: null,
                    } as MultiCollected;
                }
            });
        }
    };

    const save = (idSurvey: string, data?: [IODataStructure[], string[], string[], any[]]): void => {
        const dataBdd = getData(idSurvey);
        console.log("dataBdd", dataBdd);
        if (data && data[1].length > 0) {
            if (dataBdd.COLLECTED) {
                initializeCollectedFields(dataBdd, [
                    FieldNameEnum.WEEKLYPLANNER,
                    FieldNameEnum.DATES,
                    FieldNameEnum.DATES_STARTED,
                ]);
                if (isReviewer()) {
                    dataBdd.COLLECTED[FieldNameEnum.WEEKLYPLANNER].EDITED = data[0];
                    dataBdd.COLLECTED[FieldNameEnum.DATES].EDITED = data[1];
                    dataBdd.COLLECTED[FieldNameEnum.DATES_STARTED].EDITED = data[2];
                } else {
                    dataBdd.COLLECTED[FieldNameEnum.WEEKLYPLANNER].COLLECTED = data[0];
                    dataBdd.COLLECTED[FieldNameEnum.DATES].COLLECTED = data[1];
                    dataBdd.COLLECTED[FieldNameEnum.DATES_STARTED].COLLECTED = data[2];
                }
                saveData(idSurvey, dataBdd);
            }
        }
    };

    // TODO: Fix the addition of "S_" prefix to the variable name (response.names)
    // This also causes the total work time to be set to zero as lunatic-edt does not recognize the variable name
    const saveDuration = (idSurveyResponse: string, response: responsesHourChecker) => {
        const callbackData = getData(idSurvey);
        console.log("callbackData", callbackData);
        const dataCopy = { ...callbackData };
        const dates = (dataCopy?.COLLECTED?.["DATES"].COLLECTED ??
            getArrayFromSession("DATES")) as string[];
        const currentDateIndex = dates.indexOf(response.date);
        const dataResponse = getData(idSurveyResponse);
        if (
            !isReviewer() &&
            dataResponse.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED ==
            dataCopy.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED
        ) {
            response.names.forEach(name => {
                let quartier = Object.assign(dataCopy?.COLLECTED?.[name]?.COLLECTED as string[]);
                quartier[currentDateIndex] = response.values[name] + "";

                if (dataCopy?.COLLECTED) {
                    dataCopy.COLLECTED[name].COLLECTED = quartier;
                }
            });
            saveData(idSurveyResponse, dataCopy, true);
        }


        if (
            isReviewer() &&
            (dataResponse.COLLECTED?.[FieldNameEnum.FIRSTNAME].EDITED ==
                dataCopy.COLLECTED?.[FieldNameEnum.FIRSTNAME].EDITED ||
                dataResponse.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED ==
                dataCopy.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED)
        ) {
            response.names.forEach(name => {
                const responsesValues: string[] =
                    dataCopy?.COLLECTED?.[name]?.EDITED ?? dataCopy?.COLLECTED?.[name]?.COLLECTED;
                let quartier = Object.assign(responsesValues ?? []);

                quartier[currentDateIndex] = response.values[name] + "";

                if (dataCopy?.COLLECTED) {
                    dataCopy.COLLECTED[name].EDITED = quartier;
                }
            });
            saveData(idSurveyResponse, dataCopy, true);
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
                border: true,
                infoIcon: <InfoIcon aria-label={t("accessibility.asset.info.info-alt")} />,
                infoIconTooltip: <InfoTooltipIcon aria-label={t("accessibility.asset.info.info-alt")} />,
            },
            dates: "DATES",
            datesStarted: "DATES_STARTED",
        },
        saveAll: save,
        language: getLanguage(),
        moreIcon: <MoreHorizontalIcon aria-label={t("accessibility.asset.mui-icon.more-horizontal")} />,
        expandLessIcon: <ExpandLessIcon aria-label={t("accessibility.asset.mui-icon.expand-less")} />,
        expandMoreIcon: <ExpandMoreIcon aria-label={t("accessibility.asset.mui-icon.expand-more")} />,
        expandLessWhiteIcon: (
            <ExpandLessWhiteIcon aria-label={t("accessibility.asset.mui-icon.expand-less")} />
        ),
        expandMoreWhiteIcon: (
            <ExpandMoreWhiteIcon aria-label={t("accessibility.asset.mui-icon.expand-more")} />
        ),
        workIcon: <WorkFullIcon aria-label={t("accessibility.asset.mui-icon.work")} />,
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
            console.log('CallbackHolder', callbackHolder.getData());
            if (isPlaceWorkDisplayed) {
                saveData(idSurvey, callbackHolder.getData());
                setDisplayDayOverview(true);
                setIsPlaceWorkDisplayed(false);
                isPlaceWorkDisplayed = false;
            } else {
                save(idSurvey);
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
        <ErrorBoundary FallbackComponent={ErrorProvider}>
            <Box
                className={cx(
                    !isPwa() && (isIOS || isAndroid || isMobile())
                        ? classes.pageMobileTablet
                        : classes.pageDesktop,
                )}
            >
                {renderMenuHelp()}
                <SurveyPage
                    idSurvey={idSurvey}
                    validate={useCallback(() => validateAndNav(), [displayDayOverview])}
                    onNavigateBack={useCallback(() => saveAndNavLocally(idSurvey), [displayDayOverview])}
                    onPrevious={useCallback(() => saveAndNavLocally(idSurvey), [])}
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
            </Box>
        </ErrorBoundary>
    );
};

const useStyles = makeStylesEdt<{
    isMobile: boolean;
    isIOS: boolean;
    iosHeight: string;
    innerHeight: number;
}>({
    "name": { WeeklyPlannerPage },
})((_, { isIOS, iosHeight, innerHeight }) => ({
    pageDesktop: {
        height: "100%",
        maxHeight: isIOS ? iosHeight : innerHeight,
    },
    pageMobileTablet: {
        maxHeight: isIOS ? iosHeight : innerHeight + "px",
        height: isIOS ? "100%" : innerHeight + "px",
    },
}));

export default WeeklyPlannerPage;
