import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import { type } from "os";
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
    isRoute?: boolean,
    nextPage?: number,
): string => {
    const surveyData = getData(idSurvey);
    const subpage = getCurrentLoopPage(surveyData, loop, iteration, isRoute).step;

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
        if (value) {
            const conditional = getValue(_context.idSurvey, value, currentIteration);
            _navigate(conditional ? route : routeNotSelection);
        } else _navigate(route ? route : "/");
    });
};

const saveAndNavFullPath = (route: EdtRoutesNameEnum) => {
    saveAndNav(getFullNavigatePath(route));
};

/*
Save and navigate to next step of stepper without lop
*/
const saveAndNextStep = (rootPage: EdtRoutesNameEnum, currentPage: EdtRoutesNameEnum) => {
    saveAndNav(
        getCurrentNavigatePath(
            _context.idSurvey,
            rootPage,
            _context.source.maxPage,
            undefined,
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
    if ((value || (typeof value == "string" && value != "")) && routeNotSelection) {
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

const validateWithAlertAndNav = (
    displayAlert: boolean,
    setDisplayAlert: (value: SetStateAction<boolean>) => void,
    route?: string,
): void => {
    if (!displayAlert) {
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
