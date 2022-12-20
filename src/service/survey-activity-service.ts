import { ActivityOrRoute } from "interface/entity/ActivityOrRoute";
import { SelectedActivity } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import { getLoopSize, LoopEnum } from "service/loop-service";
import { FieldNameEnum, getValue } from "service/survey-service";
import {
    findActivityInAutoCompleteReferentiel,
    findActivityInNomenclatureReferentiel,
    findPlaceInRef,
    findSecondaryActivityInRef,
} from "./referentiel-service";
import { LunaticModel } from "interface/lunatic/Lunatic";

const getActivities = (idSurvey: string, source?: LunaticModel): Array<ActivityOrRoute> => {
    const { t } = useTranslation();
    let activities: ActivityOrRoute[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE);
    for (let i = 0; i < activityLoopSize; i++) {
        let activity: ActivityOrRoute = { label: t("common.activity.unknown-activity") + (i + 1) };
        activity.isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, i) as boolean;
        activity.startTime = getValue(idSurvey, FieldNameEnum.STARTTIME, i)?.toString() || undefined;
        activity.endTime = getValue(idSurvey, FieldNameEnum.ENDTIME, i)?.toString() || undefined;

        // Main activity
        const mainActivityValue = getValue(idSurvey, FieldNameEnum.MAINACTIVITY, i);
        const activitySelection: SelectedActivity = mainActivityValue
            ? JSON.parse(mainActivityValue.toString())
            : undefined;
        activity.label = getActivityLabel(activitySelection) || "";
        // Secondary activity
        const secondaryActivityValue = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY, i);
        if (secondaryActivityValue) {
            activity.secondaryActivityLabel = findSecondaryActivityInRef(
                secondaryActivityValue.toString(),
            )?.label;
        }
        // Location
        const placeValue = getValue(idSurvey, FieldNameEnum.PLACE, i);
        if (placeValue) {
            activity.place = findPlaceInRef(placeValue.toString())?.label;
        }
        // With someone
        const withSomeoneLabel = getWithSomeoneLabels(idSurvey, i, source);
        if (withSomeoneLabel) {
            activity.withSomeone = withSomeoneLabel;
        }

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

const getActivityLabel = (activity: SelectedActivity | undefined): string | undefined => {
    if (!activity) {
        return undefined;
    }
    if (activity.label) {
        return activity.label;
    } else {
        if (activity.suggesterId) {
            return findActivityInAutoCompleteReferentiel(activity)?.label;
        } else {
            return findActivityInNomenclatureReferentiel(activity)?.label;
        }
    }
};

const getWithSomeoneLabels = (
    idSurvey: string,
    i: number,
    source: LunaticModel | undefined,
): string | undefined => {
    const result: any[] = [];
    const fieldNames = [
        FieldNameEnum.COUPLE,
        FieldNameEnum.CHILD,
        FieldNameEnum.PARENTS,
        FieldNameEnum.OTHERKNOWN,
        FieldNameEnum.OTHER,
    ];
    // TODO should not be parsed for each activity
    const responses = source?.components
        .find(c => c.bindingDependencies?.includes(FieldNameEnum.COUPLE))
        ?.components?.find(co => co.bindingDependencies?.includes(FieldNameEnum.COUPLE))?.responses;
    fieldNames.forEach(f => {
        if (getValue(idSurvey, f, i)) {
            const label = responses?.find(
                (r: { response: { name: FieldNameEnum } }) => r.response.name === f,
            ).label;
            result.push(label);
        }
    });

    return result.length !== 0 ? result.join(", ").replaceAll('"', "") : undefined;
};

export { getActivities, getActivityOrRouteDurationLabel, getActivityLabel };
