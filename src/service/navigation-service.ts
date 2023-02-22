import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { LunaticData, OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import { SetStateAction } from "react";
import { NavigateFunction, To } from "react-router-dom";
import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutesMapping";
import { getCurrentLoopPage, getLoopInitialPage } from "service/loop-service";
import { getCurrentPage, getData, getValue, saveData, setValue } from "service/survey-service";
import { getLastPageStep, getLastStep } from "./stepper.service";

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
                getParameterizedNavigatePath(parentPageOrchestrator.parentPage, _context.idSurvey) +
                getNavigatePath(parentPageOrchestrator.page) +
                getParameterizedNavigatePath(page, iteration.toString())
            );
        } else {
            return getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON);
        }
    } else {
        return getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON);
    }
};

const getFullNavigatePath = (page: EdtRoutesNameEnum, parentPage?: EdtRoutesNameEnum) => {
    const targetPage = mappingPageOrchestrator.find(
        link => link.page === page && (parentPage ? link.parentPage === parentPage : true),
    );
    if (targetPage && targetPage.parentPage) {
        return (
            getParameterizedNavigatePath(targetPage.parentPage, _context.idSurvey) +
            getNavigatePath(page)
        );
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
        const currentPage = getCurrentPage(surveyData);
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

const getLastCompletedStep = (): number => {
    const data = getData(_context.idSurvey ?? "");
    const lastStepCompleted = getLastPageStep(data);
    const lastStep = getLastStep();
    return lastStepCompleted.stepNumber < lastStep.stepNumber
        ? lastStepCompleted.stepNumber - 1
        : lastStep.stepNumber;
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
    route?: string,
    value?: FieldNameEnum,
    routeNotSelection?: string,
    currentIteration?: number,
): void => {
    saveData(_context.idSurvey, _callbackHolder.getData()).then(() => {
        navToRouteOrRouteNotSelection(route, value, routeNotSelection, currentIteration);
    });
};

/**
 * Close formulaire and nav to closing page
 * @param route
 */
const closeFormularieAndNav = (route: string) => {
    const data = setValue(_context.idSurvey, FieldNameEnum.ISCLOSED, true);
    saveData(_context.idSurvey, data ? data : _callbackHolder.getData()).then(() => {
        _navigate(route);
    });
};

/**
 * Due to the lack of a hook that lets us know when the event has ended,
 * a change of a variable in the callbackholder,
 * we need to make the call twice to be able to retrieve the current state of the database
 */
const validate = (): Promise<void | LunaticData> => {
    return saveData(_context.idSurvey, _callbackHolder.getData()).then(() => {
        return saveData(_context.idSurvey, _callbackHolder.getData());
    });
};

const navToRouteOrRouteNotSelection = (
    route?: string,
    value?: FieldNameEnum,
    routeNotSelection?: string,
    currentIteration?: number,
) => {
    if (value) {
        const conditional = getValue(_context.idSurvey, value, currentIteration);
        if (conditional || (typeof conditional == "string" && conditional != "")) {
            _navigate(route as To);
        } else {
            _navigate(routeNotSelection as To);
        }
    } else _navigate(route ? route : "/");
};

const navToHome = (): void => {
    _navigate("/");
};

const navToHelp = (): void => {
    _navigate(getNavigatePath(EdtRoutesNameEnum.HELP));
};

const navToErrorPage = (errorCode?: ErrorCodeEnum): void => {
    if (errorCode) {
        _navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, errorCode));
    } else {
        _navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON));
    }
};

const navToActivityRoutePlanner = () => {
    _navigate(
        getCurrentNavigatePath(
            _context.idSurvey,
            EdtRoutesNameEnum.ACTIVITY,
            getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
        ),
    );
};

const navToActivityOrPlannerOrSummary = (idSurvey: string, maxPage: string, navigate: any) => {
    const surveyIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED);
    if (surveyIsClosed) {
        const surveyIsEnvoyed = getValue(idSurvey, FieldNameEnum.ISENVOYED);
        if (surveyIsEnvoyed) {
            navigate(
                getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
                    getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY),
            );
        } else {
            const currentPathNav = getCurrentNavigatePath(idSurvey, EdtRoutesNameEnum.ACTIVITY, maxPage);
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
            ),
        );
    }
};

const navToWeeklyPlannerOrClose = (idSurvey: string, navigate: any) => {
    const surveyIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED);
    const weeklyPlannerRoute = getCurrentNavigatePath(
        idSurvey,
        EdtRoutesNameEnum.WORK_TIME,
        getOrchestratorPage(EdtRoutesNameEnum.WEEKLY_PLANNER),
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

const navToActivitySummary = () => {
    _navigate(
        getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, _context.idSurvey) +
            getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY),
    );
};

const navFullPath = (route: EdtRoutesNameEnum, parentPage?: EdtRoutesNameEnum): void => {
    _navigate(getFullNavigatePath(route, parentPage));
};

const saveAndNavFullPath = (route: EdtRoutesNameEnum) => {
    saveAndNav(getFullNavigatePath(route));
};

/*
Save and navigate to next step of stepper without loop
*/
const saveAndNextStep = (rootPage: EdtRoutesNameEnum, currentPage: EdtRoutesNameEnum) => {
    saveAndNav(
        getCurrentNavigatePath(
            _context.idSurvey,
            rootPage,
            _context.source.maxPage,
            undefined,
            undefined,
            getNextPage(currentPage),
        ),
    );
};

const saveAndLoopNavigate = (
    page: EdtRoutesNameEnum,
    loop: LoopEnum,
    iteration: number,
    value?: FieldNameEnum,
    routeNotSelection?: EdtRoutesNameEnum,
) => {
    const pathRoute = getLoopParameterizedNavigatePath(page, loop, iteration);
    if (value && routeNotSelection) {
        const pathRouteNotSelection = getLoopParameterizedNavigatePath(
            routeNotSelection,
            loop,
            iteration,
        );
        saveAndNav(pathRoute, value, pathRouteNotSelection, iteration);
    } else saveAndNav(pathRoute);
};

const validateAndNextStep = (page: EdtRoutesNameEnum) => {
    validate().then(() => {
        saveAndNextStep(EdtRoutesNameEnum.ACTIVITY, page);
    });
};

const validateAndNextLoopStep = (
    page: EdtRoutesNameEnum,
    iteration: number,
    value?: FieldNameEnum,
    routeNotSelection?: EdtRoutesNameEnum,
) => {
    validate().then(() => {
        saveAndLoopNavigate(page, LoopEnum.ACTIVITY_OR_ROUTE, iteration, value, routeNotSelection);
    });
};

const loopNavigate = (page: EdtRoutesNameEnum, loop: LoopEnum, iteration: number) => {
    _navigate(getLoopParameterizedNavigatePath(page, loop, iteration));
};

const navToEditActivity = (iteration: number) => {
    const path =
        getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, _context.idSurvey) +
        getNavigatePath(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER) +
        getParameterizedNavigatePath(EdtRoutesNameEnum.EDIT_ACTIVITY_INFORMATION, iteration.toString());
    _navigate(path);
};

const validateWithAlertAndNav = (
    displayAlert: boolean,
    setDisplayAlert: (value: SetStateAction<boolean>) => void,
    iteration?: number,
    route?: string,
): void => {
    const isCompleted = getValue(_context.idSurvey, FieldNameEnum.ISCOMPLETED, iteration);
    if (!displayAlert && !isCompleted) {
        setDisplayAlert(true);
    } else {
        saveAndNav(route);
    }
};

const onNext = (e: React.MouseEvent | undefined, setNextClickEvent: any) => {
    setNextClickEvent(e);
};

const onPrevious = (e: React.MouseEvent | undefined, setBackClickEvent: any) => {
    setBackClickEvent(e);
};

const onClose = (forceQuit: boolean, setIsAlertDisplayed: any, iteration?: number) => {
    const isCloture = getValue(_context.idSurvey, FieldNameEnum.ISCLOSED) as boolean;
    validateWithAlertAndNav(
        forceQuit,
        setIsAlertDisplayed,
        iteration,
        isCloture
            ? getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, _context.idSurvey) +
                  getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY)
            : getCurrentNavigatePath(
                  _context.idSurvey,
                  EdtRoutesNameEnum.ACTIVITY,
                  getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
              ),
    );
};

export {
    getNavigatePath,
    getParameterizedNavigatePath,
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getFullNavigatePath,
    getLastCompletedStep,
    getOrchestratorPage,
    getNextPage,
    navToHome,
    navToHelp,
    navToActivitySummary,
    navToErrorPage,
    navToActivityRoutePlanner,
    navToEditActivity,
    navToActivityOrPlannerOrSummary,
    navToWeeklyPlannerOrClose,
    navFullPath,
    saveAndNav,
    saveAndNavFullPath,
    saveAndNextStep,
    saveAndLoopNavigate,
    closeFormularieAndNav,
    loopNavigate,
    validateWithAlertAndNav,
    setEnviro,
    getPage,
    getLoopPage,
    getSurveySubPage,
    onNext,
    onPrevious,
    onClose,
    validate,
    validateAndNextLoopStep,
    validateAndNextStep,
};
