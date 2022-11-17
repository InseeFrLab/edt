import activitySurveySource from "activity-survey.json";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { EdtRoutesNameEnum } from "routes/EdtRoutes";
import { getNavigatePath } from "service/navigation-service";
import workTimeSurveySource from "work-time-survey.json";

const getCurrentPageSource = (): LunaticModel | undefined => {
    if (window.location.pathname.includes(getNavigatePath(EdtRoutesNameEnum.ACTIVITY))) {
        return activitySurveySource;
    } else {
        return workTimeSurveySource;
    }
};

const getCurrentSurveyParentPage = (): EdtRoutesNameEnum => {
    if (window.location.pathname.includes(getNavigatePath(EdtRoutesNameEnum.ACTIVITY))) {
        return EdtRoutesNameEnum.ACTIVITY;
    } else {
        return EdtRoutesNameEnum.WORK_TIME;
    }
};

export { getCurrentPageSource, getCurrentSurveyParentPage };
