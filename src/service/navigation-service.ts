import { LunaticData } from "interface/lunatic/Lunatic";
import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutes";
import { getCurrentPage, getData } from "service/survey-activity-service";

const getNavigatePath = (page: EdtRoutesNameEnum): string => {
    return "/" + page;
};

const getParameterizedNavigatePath = (page: EdtRoutesNameEnum, param: string): string => {
    return "/" + page.split(":")[0] + param;
};

// Function to retrieve the last completed step to go back to the right activity subpage
const getCurrentActivityNavigatePath = (idSurvey: string): string => {
    const surveyData = getData(idSurvey);
    const subpage = mappingPageOrchestrator.find(
        link => link.surveyPage == (getCurrentPage(surveyData) + 1).toString(),
    )?.page;
    if (subpage) {
        return (
            getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) + getNavigatePath(subpage)
        );
    } else {
        //TODO : do we define error page ?
        return "/";
    }
};

const getCurrentActivityNavigatePathWithData = (idSurvey: string, data: LunaticData): string => {
    const subpage = mappingPageOrchestrator.find(
        link => link.surveyPage == (getCurrentPage(data) + 1).toString(),
    )?.page;
    if (subpage) {
        return (
            getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) + getNavigatePath(subpage)
        );
    } else {
        //TODO : do we define error page ?
        return "/";
    }
};

export {
    getNavigatePath,
    getParameterizedNavigatePath,
    getCurrentActivityNavigatePath,
    getCurrentActivityNavigatePathWithData,
};
