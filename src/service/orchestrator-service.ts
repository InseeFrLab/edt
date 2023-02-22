import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { getSource } from "service/survey-service";
import activitySurveySource from "activity-survey.json";

const LABEL_WORK_TIME_SURVEY = "WorkTime";
const LABEL_ACTIVITY_SURVEY = "ActivityTime";

const getCurrentPageSource = (): LunaticModel => {
    if (!window.location.pathname.includes(EdtRoutesNameEnum.ACTIVITY.split(":")[0])) {
        return getSource(SourcesEnum.WORK_TIME_SURVEY);
    } else {
        //return getSource(SourcesEnum.ACTIVITY_SURVEY);
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

export { getCurrentPageSource, getCurrentSurveyRootPage, LABEL_WORK_TIME_SURVEY, LABEL_ACTIVITY_SURVEY };
