import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutes";
import { getCurrentPage, getData } from "service/survey-service";

const getNavigatePath = (page: EdtRoutesNameEnum): string => {
    return "/" + page;
};

const getParameterizedNavigatePath = (page: EdtRoutesNameEnum, param: string): string => {
    return "/" + page.split(":")[0] + param;
};

// Function to retrieve the last completed step to go back to the right activity subpage
const getCurrentNavigatePath = (idSurvey: string, parentPage: EdtRoutesNameEnum, maxPage: string): string => {
    const surveyData = getData(idSurvey);

    const lastFilledPage = getCurrentPage(surveyData);
    const firstEmptyPage = lastFilledPage + 1;

    const subpage = mappingPageOrchestrator.find(
        link => link.surveyPage === (firstEmptyPage > Number(maxPage) ? maxPage : firstEmptyPage).toString(),
    )?.page;
    if (subpage) {
        return getParameterizedNavigatePath(parentPage, idSurvey) + getNavigatePath(subpage);
    } else {
        //TODO : do we define error page ?
        return "/";
    }
};

export { getNavigatePath, getParameterizedNavigatePath, getCurrentNavigatePath };
