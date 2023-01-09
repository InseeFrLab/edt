import { Activity } from "interface/entity/Activity";
import { useTranslation } from "react-i18next";
import { getLoopSize, LoopEnum } from "service/loop-service";
import { FieldNameEnum, getValue } from "service/survey-service";

const getActivities = (idSurvey: string): Array<Activity> => {
    const { t } = useTranslation();
    let activities: Activity[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopEnum.ACTIVITY);
    for (let i = 0; i < activityLoopSize; i++) {
        let activity: Activity = { label: t("common.activity.unknown-activity") + (i + 1) };
        activity.startTime = getValue(idSurvey, FieldNameEnum.STARTTIME, i)?.toString() || undefined;
        activity.endTime = getValue(idSurvey, FieldNameEnum.ENDTIME, i)?.toString() || undefined;
        activities.push(activity);
    }
    return activities;
};

export { getActivities };
