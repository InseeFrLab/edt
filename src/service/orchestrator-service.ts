import activitySurveySource from "activity-survey.json";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { EdtRoutesNameEnum } from "routes/EdtRoutes";
import { getNavigatePath, getParameterizedNavigatePath } from "service/navigation-service";
import workTimeSurveySource from "work-time-survey.json";

const getCurrentPageSource = (): LunaticModel => {
    if (window.location.pathname.includes(getNavigatePath(EdtRoutesNameEnum.ACTIVITY))) {
        return activitySurveySource;
    } else {
        return workTimeSurveySource;
    }
};

const getCurrentSurveyParentPage = (idSurvey: string): EdtRoutesNameEnum => {
    if (window.location.pathname.includes(getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey))) {
        return EdtRoutesNameEnum.ACTIVITY;
    } else {
        return EdtRoutesNameEnum.WORK_TIME;
    }
};

export { getCurrentPageSource, getCurrentSurveyParentPage };
