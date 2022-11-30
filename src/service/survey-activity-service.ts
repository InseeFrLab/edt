import { Activity } from "interface/entity/Activity";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { useTranslation } from "react-i18next";
import { FieldNameEnum, getLoopSize, getValue, LoopPage } from "./survey-service";

const getActivities = (idSurvey: string): Array<Activity> => {
    const { t } = useTranslation();
    let activities: Activity[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopPage.ACTIVITY);
    for (let i = 0; i < activityLoopSize; i++) {
        let activity: Activity = { label: t("common.activity.unknown-activity") + (i + 1) };
        activity.dateDebut = getValue(idSurvey, FieldNameEnum.DEBUT, i)?.toString() || undefined;
        activity.dateFin = getValue(idSurvey, FieldNameEnum.DEBUT, i)?.toString() || undefined;
        activities.push(activity);
    }
    return activities;
};

const setLoopSize = (source: LunaticModel, size: number): number => {
    const loop = source.components.find(composant => composant.page === LoopPage.ACTIVITY);
    if (loop && loop.iterations) {
        loop.iterations.value = size.toString();
        return +loop.iterations.value;
    }
    return 0;
};

export { getActivities, setLoopSize };
