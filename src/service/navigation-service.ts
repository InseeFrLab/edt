import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutesMapping";
import { getCurrentLoopPage, getLoopInitialPage, LoopEnum } from "service/loop-service";
import { FieldNameEnum, getCurrentPage, getData, getValue } from "service/survey-service";

const getNavigatePath = (page: EdtRoutesNameEnum): string => {
    return "/" + page;
};

const getParameterizedNavigatePath = (page: EdtRoutesNameEnum, param: string): string => {
    return "/" + page.split(":")[0] + param;
};

const getLoopParameterizedNavigatePath = (
    page: EdtRoutesNameEnum,
    idSurvey: string,
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
            return getNavigatePath(EdtRoutesNameEnum.ERROR);
        }
    } else {
        return getNavigatePath(EdtRoutesNameEnum.ERROR);
    }
};

const getFullNavigatePath = (idSurvey: string, page: EdtRoutesNameEnum) => {
    const targetPage = mappingPageOrchestrator.find(link => link.page === page);

    if (targetPage && targetPage.parentPage) {
        return getParameterizedNavigatePath(targetPage.parentPage, idSurvey) + getNavigatePath(page);
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
    const subpage = getCurrentLoopPage(surveyData, loop, iteration);

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

export {
    getNavigatePath,
    getParameterizedNavigatePath,
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getFullNavigatePath,
};
