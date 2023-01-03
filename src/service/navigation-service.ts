import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import { SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutesMapping";
import { getCurrentLoopPage, getLoopInitialPage, LoopEnum } from "service/loop-service";
import { FieldNameEnum, getCurrentPage, getData, getValue, saveData } from "service/survey-service";

let _context: any = null;
let _navigate: any = null;
let _callbackHolder: any = null;

const setEnviro = (context: OrchestratorContext, navigate: NavigateFunction, callbackHolder: any) => {
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
            return getNavigatePath(EdtRoutesNameEnum.ERROR);
        }
    } else {
        return getNavigatePath(EdtRoutesNameEnum.ERROR);
    }
};

const getFullNavigatePath = (page: EdtRoutesNameEnum) => {
    const targetPage = mappingPageOrchestrator.find(link => link.page === page);

    if (targetPage && targetPage.parentPage) {
        return (
            getParameterizedNavigatePath(targetPage.parentPage, _context.idSurvey) +
            getNavigatePath(page)
        );
    } else if (targetPage) {
        return getNavigatePath(page);
    } else {
        return getNavigatePath(EdtRoutesNameEnum.ERROR);
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
        const activityIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED);
        const currentPage = getCurrentPage(surveyData);
        const lastFilledPage = activityIsClosed && currentPage == 2 ? 4 : getCurrentPage(surveyData);
        const firstEmptyPage = nextPage ? nextPage : lastFilledPage + 1;
        page = mappingPageOrchestrator.find(
            link =>
                link.surveyPage ===
                    (firstEmptyPage > Number(maxPage) ? maxPage : firstEmptyPage).toString() &&
                link.parentPage === rootPage,
        )?.page;
    }
    if (page && subpage && iteration !== undefined) {
        return (
            getParameterizedNavigatePath(rootPage, idSurvey) +
            (parentPage ? getNavigatePath(parentPage) : "") +
            getParameterizedNavigatePath(page, iteration.toString())
        );
    } else if (page) {
        return getParameterizedNavigatePath(rootPage, idSurvey) + getNavigatePath(page);
    } else {
        return getNavigatePath(EdtRoutesNameEnum.ERROR);
    }
};

const getLastCompletedStep = (): number => {
    const data = getData(_context.idSurvey ?? "");
    const currentLastCompletedPage = getCurrentPage(data) - 1;
    const page = mappingPageOrchestrator.find(
        page => page.surveySubPage && page.surveySubPage === currentLastCompletedPage.toString(),
    );
    return page?.surveyStep ?? 0;
};

const getOrchestratorPage = (page: EdtRoutesNameEnum) => {
    return mappingPageOrchestrator.find(pageData => pageData.page === page)?.surveyPage || "";
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

const navToRouteOrRouteNotSelection = (
    route?: string,
    value?: FieldNameEnum,
    routeNotSelection?: string,
    currentIteration?: number,
) => {
    if (value) {
        const conditional = getValue(_context.idSurvey, value, currentIteration);
        if (conditional || (typeof conditional == "string" && conditional != "")) {
            _navigate(route);
        } else {
            _navigate(routeNotSelection);
        }
    } else _navigate(route ? route : "/");
};

const navToHome = (): void => {
    _navigate("/");
};

const navToHelp = (): void => {
    _navigate(getNavigatePath(EdtRoutesNameEnum.HELP));
};

const navToActivitRouteHome = () => {
    _navigate(
        getCurrentNavigatePath(
            _context.idSurvey,
            EdtRoutesNameEnum.ACTIVITY,
            getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
        ),
    );
};

const navFullPath = (route: EdtRoutesNameEnum): void => {
    _navigate(getFullNavigatePath(route));
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
    navToActivitRouteHome,
    navToEditActivity,
    navFullPath,
    saveAndNav,
    saveAndNavFullPath,
    saveAndNextStep,
    saveAndLoopNavigate,
    loopNavigate,
    validateWithAlertAndNav,
    setEnviro,
    getPage,
    getLoopPage,
    getSurveySubPage,
};
