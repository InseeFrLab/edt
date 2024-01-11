import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { ModePersistenceEnum } from "enumerations/ModePersistenceEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { LunaticData, LunaticModel, OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import { SetStateAction } from "react";
import { NavigateFunction, To } from "react-router-dom";
import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutesMapping";
import { getCurrentLoopPage, getLoopInitialPage } from "service/loop-service";
import {
    getCurrentPage,
    getData,
    getModePersistence,
    getValue,
    saveData,
    setValue,
    surveysIds,
} from "service/survey-service";
import { getLastPageStep } from "./stepper.service";
import { surveyReadOnly } from "./survey-activity-service";

let _context: OrchestratorContext;
let _navigate: NavigateFunction;
let _callbackHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } };

const setEnviro = (
    context: OrchestratorContext,
    navigate: NavigateFunction,
    callbackHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } },
) => {
    _context = context;
    _navigate = navigate;
    _callbackHolder = callbackHolder;
};

const getNavigatePath = (page: EdtRoutesNameEnum): string => {
    return "/" + page;
};

const getParameterizedNavigatePath = (page: EdtRoutesNameEnum, param: string): string => {
    return "/" + page.split(":")[0] + param;
};

const getLoopParameterizedNavigatePath = (
    idSurvey: string,
    page: EdtRoutesNameEnum,
    loop: LoopEnum,
    iteration: number,
): string => {
    const loopPage = getLoopInitialPage(loop);
    const pageOrchestrator = mappingPageOrchestrator.find(
        link => link.surveyPage === loopPage && link.page === page,
    );

    if (pageOrchestrator) {
        const parentPageOrchestrator = mappingPageOrchestrator.find(
            link => link.page === pageOrchestrator.parentPage,
        );
        if (parentPageOrchestrator) {
            return (
                getParameterizedNavigatePath(parentPageOrchestrator.parentPage, idSurvey) +
                getNavigatePath(parentPageOrchestrator.page) +
                getParameterizedNavigatePath(page, iteration.toString())
            );
        } else {
            console.error(
                `Erreur get parent page orchestrator with pageOrchestator : ${pageOrchestrator.parentPage} and page : ${page}`,
            );
            return getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON);
        }
    } else {
        console.error(`Erreur get page orchestrator with loop : ${loopPage} and page : ${page}`);
        return getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON);
    }
};

const getFullNavigatePath = (
    idSurvey: string,
    page: EdtRoutesNameEnum,
    parentPage?: EdtRoutesNameEnum,
) => {
    const targetPage = mappingPageOrchestrator.find(
        link => link.page === page && (parentPage ? link.parentPage === parentPage : true),
    );
    if (targetPage && targetPage.parentPage) {
        return getParameterizedNavigatePath(targetPage.parentPage, idSurvey) + getNavigatePath(page);
    } else if (targetPage) {
        return getNavigatePath(page);
    } else {
        return getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON);
    }
};

const getPathOfPage = (
    idSurvey: string,
    rootPage: EdtRoutesNameEnum,
    subpage: number,
    page?: EdtRoutesNameEnum,
    parentPage?: EdtRoutesNameEnum,
    iteration?: number,
) => {
    if (page && subpage && iteration !== undefined) {
        return (
            getParameterizedNavigatePath(rootPage, idSurvey) +
            (parentPage ? getNavigatePath(parentPage) : "") +
            getParameterizedNavigatePath(page, iteration.toString())
        );
    } else if (page) {
        return getParameterizedNavigatePath(rootPage, idSurvey) + getNavigatePath(page);
    } else {
        return getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON);
    }
};

// Function to retrieve the last completed step to go back to the right activity subpage
const getCurrentNavigatePath = (
    idSurvey: string,
    rootPage: EdtRoutesNameEnum,
    maxPage: string,
    source: LunaticModel,
    loop?: LoopEnum,
    iteration?: number,
    nextPage?: number,
): string => {
    const surveyData = getData(idSurvey);
    const isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, iteration) as boolean;
    const subpage = getCurrentLoopPage(
        idSurvey,
        surveyData,
        loop ?? LoopEnum.ACTIVITY_OR_ROUTE,
        iteration,
        isRoute,
    ).step;

    let page: EdtRoutesNameEnum | undefined;
    let parentPage: EdtRoutesNameEnum | undefined;
    if (subpage !== 0 && loop) {
        const loopPage = getLoopInitialPage(loop);
        const pageOrchestrator = mappingPageOrchestrator.find(
            link => link.surveyPage === loopPage && link.surveySubPage === subpage.toString(),
        );
        page = pageOrchestrator?.page;
        parentPage = pageOrchestrator?.parentPage;
    } else {
        const currentPage = getCurrentPage(surveyData, source);
        const firstEmptyPage = nextPage ? nextPage : currentPage;
        page = mappingPageOrchestrator.find(
            link =>
                link.surveyPage ===
                    (firstEmptyPage > Number(maxPage) ? maxPage : firstEmptyPage).toString() &&
                link.parentPage === rootPage,
        )?.page;
    }
    return getPathOfPage(idSurvey, rootPage, subpage, page, parentPage, iteration);
};

const getLastCompletedStep = (idSurvey?: string): number => {
    const data = getData(idSurvey ?? "");
    const lastStepCompleted = getLastPageStep(data);

    return lastStepCompleted != null ? lastStepCompleted.stepNumber : 0;
};

const getOrchestratorPage = (page: EdtRoutesNameEnum, parentPage?: EdtRoutesNameEnum): string => {
    return (
        mappingPageOrchestrator.find(
            pageData =>
                pageData.page === page && (parentPage ? pageData.parentPage === parentPage : true),
        )?.surveyPage || ""
    );
};

const getNextPage = (currentPage: EdtRoutesNameEnum) => {
    const currentPageNum = getOrchestratorPage(currentPage);
    return Number(currentPageNum) + 1;
};

const getPage = (pageNumber: number): OrchestratorEdtNavigation | undefined => {
    return mappingPageOrchestrator.find(
        page => page.surveyPage && Number(page.surveyPage) == pageNumber,
    );
};

const getLoopPage = (pageNumber: number): OrchestratorEdtNavigation | undefined => {
    return mappingPageOrchestrator.find(
        page => page.surveySubPage && Number(page.surveySubPage) == pageNumber,
    );
};

const getSurveySubPage = (page?: EdtRoutesNameEnum): string | undefined => {
    return mappingPageOrchestrator.find(pageOrch => pageOrch.page && pageOrch.page === page)
        ?.surveySubPage;
};

const saveAndNav = (
    idSurvey: string,
    route?: string,
    value?: FieldNameEnum,
    routeNotSelection?: string,
    currentIteration?: number,
): void => {
    saveData(idSurvey, _callbackHolder.getData()).then(() => {
        navToRouteOrRouteNotSelection(idSurvey, route, value, routeNotSelection, currentIteration);
    });
};

/**
 * Close formulaire and nav to closing page
 * @param route
 */
const closeFormularieAndNav = (idSurvey: string, route: string) => {
    const data = setValue(idSurvey, FieldNameEnum.ISCLOSED, true);
    saveData(idSurvey, data ? data : _callbackHolder.getData()).then(() => {
        _navigate(route);
    });
};

/**
 * Due to the lack of a hook that lets us know when the event has ended,
 * a change of a variable in the callbackholder,
 * we need to make the call twice to be able to retrieve the current state of the database
 */
const validate = (idSurvey: string): Promise<void | LunaticData> => {
    return saveData(idSurvey, _callbackHolder.getData(), true).then(() => {
        return saveData(idSurvey, _callbackHolder.getData(), false);
    });
};

const navToRouteOrRouteNotSelection = (
    idSurvey: string,
    route?: string,
    value?: FieldNameEnum,
    routeNotSelection?: string,
    currentIteration?: number,
) => {
    if (value) {
        const currentValue = getValue(idSurvey, value, currentIteration);
        const conditional = currentValue == "true";
        if (conditional || (typeof conditional == "string" && conditional != "")) {
            _navigate(route as To);
        } else {
            _navigate(routeNotSelection as To);
        }
    } else _navigate(route ? route : getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
};

const navToHome = (): void => {
    _navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
};

const navToHomeReviewer = () => {
    _navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_SURVEYS_OVERVIEW));
};

const navToHelp = (): void => {
    _navigate(getNavigatePath(EdtRoutesNameEnum.HELP_INSTALL));
};

const navToErrorPage = (errorCode?: ErrorCodeEnum): void => {
    if (errorCode) {
        _navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, errorCode));
    } else {
        _navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON));
    }
};

const navToActivityRoutePlanner = (idSurvey: string, source: LunaticModel) => {
    _navigate(
        getCurrentNavigatePath(
            idSurvey,
            EdtRoutesNameEnum.ACTIVITY,
            getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            source,
        ),
    );
};

const setNamesOfGroup = (idSurvey: string, nameAct: string, idsSurveysOfGroup: string[]) => {
    let listNames = idsSurveysOfGroup
        ?.map(id => {
            const firstName = getValue(id, FieldNameEnum.FIRSTNAME) as string;
            return firstName;
        })
        .filter(firstname => firstname != null);
    const promises: any[] = [];
    const nameOfGroup = listNames.length > 0 ? listNames[0] : nameAct;
    idsSurveysOfGroup.forEach(idSurvey => {
        let firstname = getValue(idSurvey, FieldNameEnum.FIRSTNAME);
        if (firstname == null) {
            let dataActuel = Object.assign({}, getData(idSurvey));
            const datasirv = { ...dataActuel };
            const emptydata = emptyDataSetFirstName(datasirv, nameOfGroup, getModePersistence(datasirv));
            promises.push(saveData(idSurvey, emptydata));
        }
    });
    return promises;
};

const emptyDataSetFirstName = (
    data: LunaticData,
    firstName: string,
    modePersistence: ModePersistenceEnum,
) => {
    let dataCollected = { ...data.COLLECTED };

    if (dataCollected) {
        for (let prop in FieldNameEnum as any) {
            if (prop == FieldNameEnum.SURVEYDATE) continue;
            dataCollected[prop] = {
                COLLECTED: null,
                EDITED: null,
                FORCED: {},
                INPUTED: {},
                PREVIOUS: {},
            };
        }

        dataCollected[FieldNameEnum.FIRSTNAME] = {
            COLLECTED: modePersistence == ModePersistenceEnum.COLLECTED ? firstName : null,
            EDITED: modePersistence == ModePersistenceEnum.EDITED ? firstName : null,
            FORCED: {},
            INPUTED: {},
            PREVIOUS: {},
        };
    }
    data.COLLECTED = dataCollected;
    return data;
};
const setAllNamesOfGroupAndNav = (
    idSurvey: string,
    idsSurveysOfGroup: string[],
    nameAct: string,
    route: string,
    navigate: any,
) => {
    const promises = setNamesOfGroup(idSurvey, nameAct, idsSurveysOfGroup);
    Promise.all(promises).then(() => {
        navigate(route);
    });
};

const navToActivityOrPlannerOrSummary = (
    idSurvey: string,
    maxPage: string,
    navigate: any,
    source: LunaticModel,
) => {
    const surveyIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED);
    if (surveyIsClosed) {
        const surveyIsEnvoyed = getValue(idSurvey, FieldNameEnum.ISENVOYED);
        if (surveyIsEnvoyed) {
            navigate(
                getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
                    getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY),
            );
        } else {
            const currentPathNav = getCurrentNavigatePath(
                idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                maxPage,
                source,
            );
            const navEndSurvey =
                getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
                getNavigatePath(EdtRoutesNameEnum.END_SURVEY);
            const allStepsAdded =
                currentPathNav.indexOf(EdtRoutesNameEnum.PHONE_TIME) != 0 &&
                getValue(idSurvey, FieldNameEnum.PHONETIME) != null;
            navigate(allStepsAdded ? navEndSurvey : currentPathNav);
        }
    } else {
        navigate(
            getCurrentNavigatePath(
                idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                source,
            ),
        );
    }
};

const navToWeeklyPlannerOrClose = (idSurvey: string, navigate: any, source: LunaticModel) => {
    const surveyIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED);
    const weeklyPlannerRoute = getCurrentNavigatePath(
        idSurvey,
        EdtRoutesNameEnum.WORK_TIME,
        getOrchestratorPage(EdtRoutesNameEnum.WEEKLY_PLANNER),
        source,
    );
    const kindOfDayRoute =
        getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, idSurvey) +
        getNavigatePath(EdtRoutesNameEnum.KIND_OF_WEEK);

    if (surveyIsClosed) {
        const surveyIsEnvoyed = getValue(idSurvey, FieldNameEnum.ISENVOYED);

        if (surveyIsEnvoyed) {
            navigate(weeklyPlannerRoute);
        } else {
            const navEndSurvey =
                getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, idSurvey) +
                getNavigatePath(EdtRoutesNameEnum.END_SURVEY);
            const allStepsAdded = getValue(idSurvey, FieldNameEnum.WEEKTYPE) != null;

            navigate(allStepsAdded ? navEndSurvey : kindOfDayRoute);
        }
    } else {
        navigate(weeklyPlannerRoute);
    }
};

const navToActivitySummary = (idSurvey: string) => {
    _navigate(
        getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
            getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY),
    );
};

const navFullPath = (
    idSurvey: string,
    route: EdtRoutesNameEnum,
    parentPage?: EdtRoutesNameEnum,
): void => {
    _navigate(getFullNavigatePath(idSurvey, route, parentPage));
};

const getIdSurveyContext = (typeSurvey: SurveysIdsEnum) => {
    return _context ? _context.idSurvey : surveysIds[typeSurvey][0];
};

const isPageGlobal = () => {
    const isGlobal = localStorage.getItem(LocalStorageVariableEnum.IS_GLOBAL);
    return _context ? _context.global : isGlobal != null && isGlobal == "true" ? true : false;
};

const isActivityPage = () => {
    return _context ? _context.surveyRootPage == EdtRoutesNameEnum.ACTIVITY : false;
};

const saveAndNavFullPath = (idSurvey: string, route: EdtRoutesNameEnum) => {
    saveAndNav(idSurvey, getFullNavigatePath(idSurvey, route));
};

/*
Save and navigate to next step of stepper without loop
*/
const saveAndNextStep = (
    idSurvey: string,
    source: LunaticModel,
    rootPage: EdtRoutesNameEnum,
    currentPage: EdtRoutesNameEnum,
) => {
    saveAndNav(
        idSurvey ?? "",
        getCurrentNavigatePath(
            idSurvey,
            rootPage,
            source.maxPage,
            source,
            undefined,
            undefined,
            getNextPage(currentPage),
        ),
    );
};

const getLoopPageOrActivityPlanner = (
    idSurvey: string,
    source: LunaticModel,
    page: EdtRoutesNameEnum,
    loop: LoopEnum,
    iteration: number,
) => {
    if (page == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER) {
        return getCurrentNavigatePath(
            idSurvey,
            EdtRoutesNameEnum.ACTIVITY,
            getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            source,
        );
    } else {
        return getLoopParameterizedNavigatePath(idSurvey, page, loop, iteration);
    }
};

const saveAndLoopNavigate = (
    idSurvey: string,
    source: LunaticModel,
    page: EdtRoutesNameEnum,
    loop: LoopEnum,
    iteration: number,
    value?: FieldNameEnum,
    routeNotSelection?: EdtRoutesNameEnum,
) => {
    const pathRoute = getLoopPageOrActivityPlanner(idSurvey, source, page, loop, iteration);
    if (value && routeNotSelection) {
        const pathRouteNotSelection = getLoopPageOrActivityPlanner(
            idSurvey,
            source,
            routeNotSelection,
            loop,
            iteration,
        );
        saveAndNav(idSurvey, pathRoute, value, pathRouteNotSelection, iteration);
    } else saveAndNav(idSurvey, pathRoute);
};

const validateAndNextStep = (idSurvey: string, source: LunaticModel, page: EdtRoutesNameEnum) => {
    validate(idSurvey).then(() => {
        saveAndNextStep(idSurvey, source, EdtRoutesNameEnum.ACTIVITY, page);
    });
};

const loopNavigate = (idSurvey: string, page: EdtRoutesNameEnum, loop: LoopEnum, iteration: number) => {
    _navigate(getLoopParameterizedNavigatePath(idSurvey, page, loop, iteration));
};

const navToEditActivity = (idSurvey: string, iteration: number) => {
    const path =
        getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
        getNavigatePath(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER) +
        getParameterizedNavigatePath(EdtRoutesNameEnum.EDIT_ACTIVITY_INFORMATION, iteration.toString());
    _navigate(path);
};

const validateWithAlertAndNav = (
    idSurvey: string,
    displayAlert: boolean,
    setDisplayAlert: (value: SetStateAction<boolean>) => void,
    iteration?: number,
    route?: string,
): void => {
    if (!displayAlert) {
        setDisplayAlert(true);
    } else {
        saveAndNav(idSurvey, route);
    }
};

const onNext = (e: React.MouseEvent | undefined, setNextClickEvent: any) => {
    setNextClickEvent(e);
};

const onPrevious = (e: React.MouseEvent | undefined, setBackClickEvent: any) => {
    setBackClickEvent(e);
};

const onClose = (
    idSurvey: string,
    source: LunaticModel,
    forceQuit: boolean,
    setIsAlertDisplayed: any,
    iteration?: number,
) => {
    const hasRights = !surveyReadOnly(_context.rightsSurvey);
    const isCloture = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
    const isActivity = isActivityPage();
    const pathNav = isCloture
        ? getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
          getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY)
        : getCurrentNavigatePath(
              idSurvey,
              EdtRoutesNameEnum.ACTIVITY,
              getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
              source,
          );
    const weeklyPlannerRoute = getCurrentNavigatePath(
        idSurvey,
        EdtRoutesNameEnum.WORK_TIME,
        getOrchestratorPage(EdtRoutesNameEnum.WEEKLY_PLANNER),
        source,
    );

    if (hasRights) {
        validateWithAlertAndNav(idSurvey, forceQuit, setIsAlertDisplayed, iteration, pathNav);
    } else {
        isActivity ? _navigate(pathNav) : _navigate(weeklyPlannerRoute);
    }
};

export {
    closeFormularieAndNav,
    getCurrentNavigatePath,
    getFullNavigatePath,
    getIdSurveyContext,
    getLastCompletedStep,
    getLoopPage,
    getLoopParameterizedNavigatePath,
    getNavigatePath,
    getNextPage,
    getOrchestratorPage,
    getPage,
    getParameterizedNavigatePath,
    getSurveySubPage,
    isActivityPage,
    isPageGlobal,
    loopNavigate,
    navFullPath,
    navToActivityOrPlannerOrSummary,
    navToActivityRoutePlanner,
    navToActivitySummary,
    navToEditActivity,
    navToErrorPage,
    navToHelp,
    navToHome,
    navToHomeReviewer,
    navToWeeklyPlannerOrClose,
    onClose,
    onNext,
    onPrevious,
    saveAndLoopNavigate,
    saveAndNav,
    saveAndNavFullPath,
    saveAndNextStep,
    setAllNamesOfGroupAndNav,
    setEnviro,
    validate,
    validateAndNextStep,
    validateWithAlertAndNav,
};
