import { ActivityOrRoute } from "interface/entity/ActivityOrRoute";
import { useTranslation } from "react-i18next";
import { getLoopSize, LoopEnum } from "service/loop-service";
import { FieldNameEnum, getValue } from "service/survey-service";

const getActivities = (idSurvey: string): Array<ActivityOrRoute> => {
    const { t } = useTranslation();
    let activities: ActivityOrRoute[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopEnum.ACTIVITY);
    for (let i = 0; i < activityLoopSize; i++) {
        let activity: ActivityOrRoute = { label: t("common.activity.unknown-activity") + (i + 1) };
        activity.startTime = getValue(idSurvey, FieldNameEnum.STARTTIME, i)?.toString() || undefined;
        activity.endTime = getValue(idSurvey, FieldNameEnum.ENDTIME, i)?.toString() || undefined;
        activities.push(activity);
    }
    return activities;
};

const getActivityOrRouteDurationLabel = (activity: ActivityOrRoute): string => {
    if (!activity.startTime || !activity.endTime) return "?";
    const startDate = new Date("2000-01-01 " + activity.startTime + ":00");
    const endDate = new Date("2000-01-01 " + activity.endTime + ":00");
    const hoursDiff = endDate.getHours() - startDate.getHours();
    const minutesDiff = endDate.getMinutes() - startDate.getMinutes();
    const formatedHours = hoursDiff > 0 ? hoursDiff + "h" : "";
    const formatedMinutes = (minutesDiff === 0 ? "00" : minutesDiff) + (hoursDiff === 0 ? "min" : "");
    return formatedHours + formatedMinutes;
};

export { getActivities, getActivityOrRouteDurationLabel };
