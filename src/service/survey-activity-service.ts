import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { SelectedActivity } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import { FieldNameEnum, getValue } from "service/survey-service";
import { getLoopSize, LoopEnum } from "./loop-service";
import {
    findActivityInAutoCompleteReferentiel,
    findActivityInNomenclatureReferentiel,
    findPlaceInRef,
    findRouteInRef,
    findSecondaryActivityInRef,
} from "./referentiel-service";

const getActivitiesOrRoutes = (
    idSurvey: string,
    source?: LunaticModel,
): {
    activitiesRoutesOrGaps: ActivityRouteOrGap[];
    overlaps: { prev: string | undefined; current: string | undefined }[];
} => {
    const { t } = useTranslation();
    const overlaps = [];
    let activities: ActivityRouteOrGap[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE);
    for (let i = 0; i < activityLoopSize; i++) {
        let activity: ActivityRouteOrGap = {
            activityLabel: t("common.activity.unknown-activity") + (i + 1),
        };
        activity.isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, i) as boolean;
        activity.startTime = getValue(idSurvey, FieldNameEnum.STARTTIME, i)?.toString() || undefined;
        activity.endTime = getValue(idSurvey, FieldNameEnum.ENDTIME, i)?.toString() || undefined;

        if (activity.isRoute) {
            // Route
            const routeValue = getValue(idSurvey, FieldNameEnum.ROUTE, i) as string;
            activity.routeLabel = getRouteLabel(routeValue);

            //Mean of transport
            const meanOfTransportValue = "";
        } else {
            // Main activity
            const mainActivityValue = getValue(idSurvey, FieldNameEnum.MAINACTIVITY, i);
            const activitySelection: SelectedActivity = mainActivityValue
                ? JSON.parse(mainActivityValue.toString())
                : undefined;
            activity.activityLabel = getActivityLabel(activitySelection) || "";

            // Location
            const placeValue = getValue(idSurvey, FieldNameEnum.PLACE, i);
            if (placeValue) {
                activity.place = findPlaceInRef(placeValue.toString())?.label;
            }
        }

        // Secondary activity
        const secondaryActivityValue = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY, i);
        if (secondaryActivityValue) {
            activity.secondaryActivityLabel = findSecondaryActivityInRef(
                secondaryActivityValue.toString(),
            )?.label;
        }
        // With someone
        const withSomeoneLabel = getWithSomeoneLabel(idSurvey, i, source);
        if (withSomeoneLabel) {
            activity.withSomeone = withSomeoneLabel;
        }

        // Screen
        activity.withScreen = getValue(idSurvey, FieldNameEnum.WITHSCREEN, i) as boolean;

        activities.push(activity);
    }

    const sortedActivities = activities.sort(
        (a, b) => hourToNormalizedTimeStamp(a.startTime) - hourToNormalizedTimeStamp(b.startTime),
    );

    // Fill the gaps and overlaps
    let previousActivity: ActivityRouteOrGap | undefined;
    const copy = [...sortedActivities];
    for (const act of copy) {
        // Gaps
        if (
            previousActivity &&
            hourToNormalizedTimeStamp(act.startTime) >
                hourToNormalizedTimeStamp(previousActivity.endTime)
        ) {
            const index = sortedActivities.indexOf(act);
            sortedActivities.splice(index, 0, {
                startTime: previousActivity.endTime,
                endTime: act.startTime,
                isGap: true,
            });
        }
        // Overlaps to be completed...
        if (
            previousActivity &&
            hourToNormalizedTimeStamp(act.startTime) -
                hourToNormalizedTimeStamp(previousActivity.endTime) <
                0
        ) {
            overlaps.push({
                prev: previousActivity.startTime,
                current: act.startTime,
            });
        }
        previousActivity = act;
    }

    return {
        activitiesRoutesOrGaps: sortedActivities,
        overlaps: overlaps,
    };
};

/**
 * Convert hour as string (hh:mm) to normalized timestamp
 * to allow hours comparison
 * @param hour
 * @returns
 */
const hourToNormalizedTimeStamp = (hour: string | undefined): number => {
    return new Date(`01/01/1970 ${hour}`).getTime();
};

const getActivitesSelectedLabel = (idSurvey: string): string[] => {
    let activitesSelected: string[] = [];
    getActivitiesOrRoutes(idSurvey).activitiesRoutesOrGaps.forEach(activity => {
        if (activity?.activityLabel != null && activity?.activityLabel.length > 0)
            activitesSelected.push(activity.activityLabel);
        if (activity?.secondaryActivityLabel != null && activity?.secondaryActivityLabel.length > 0)
            activitesSelected.push(activity.secondaryActivityLabel);
    });
    return activitesSelected;
};

const getActivityOrRouteDurationLabel = (activity: ActivityRouteOrGap): string => {
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

const getRouteLabel = (routeId: string | undefined): string | undefined => {
    if (!routeId) {
        return undefined;
    }
    return findRouteInRef(routeId)?.label;
};

const getWithSomeoneLabel = (
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

export {
    getActivitiesOrRoutes,
    getActivitesSelectedLabel,
    getActivityOrRouteDurationLabel,
    getActivityLabel,
};
