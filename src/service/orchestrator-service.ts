import activitySurveySource from "activity-survey.json";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import workTimeSurveySource from "work-time-survey.json";

const getCurrentPageSource = (): LunaticModel => {
    if (!window.location.pathname.includes(EdtRoutesNameEnum.ACTIVITY.split(":")[0])) {
        return workTimeSurveySource;
    } else {
        return activitySurveySource;
    }
};

const getCurrentSurveyRootPage = (): EdtRoutesNameEnum => {
    if (window.location.pathname.includes(EdtRoutesNameEnum.ACTIVITY.split(":")[0])) {
        return EdtRoutesNameEnum.ACTIVITY;
    } else {
        return EdtRoutesNameEnum.WORK_TIME;
    }
};

export { getCurrentPageSource, getCurrentSurveyRootPage };
