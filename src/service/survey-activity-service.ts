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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const getActivitiesOrRoutes = (
    idSurvey: string,
    source?: LunaticModel,
): {
    activitiesRoutesOrGaps: ActivityRouteOrGap[];
    overlaps: { prev: string | undefined; current: string | undefined }[];
} => {
    const { t } = useTranslation();
    const overlaps = [];
    let activitiesRoutes: ActivityRouteOrGap[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE);
    for (let i = 0; i < activityLoopSize; i++) {
        let activityOrRoute: ActivityRouteOrGap = {};
        activityOrRoute.isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, i) as boolean | undefined;
        if (activityOrRoute.isRoute) {
            activityOrRoute.route = { routeLabel: t("common.activity.unknown-activity") + (i + 1) };
        } else {
            activityOrRoute.activity = {
                activityLabel: t("common.activity.unknown-activity") + (i + 1),
            };
        }
        activityOrRoute.startTime =
            getValue(idSurvey, FieldNameEnum.STARTTIME, i)?.toString() || undefined;
        activityOrRoute.endTime = getValue(idSurvey, FieldNameEnum.ENDTIME, i)?.toString() || undefined;

        if (activityOrRoute.isRoute) {
            // Route
            const routeCode = getValue(idSurvey, FieldNameEnum.ROUTE, i) as string | undefined;
            if (routeCode) {
                activityOrRoute.route = {
                    routeCode: routeCode,
                    routeLabel: getRouteLabel(routeCode),
                };
            }

            //Mean of transport
            activityOrRoute.meanOfTransportLabels = getMeanOfTransportLabel(idSurvey, i, source);
        } else {
            // Main activity
            const mainActivityValue = getValue(idSurvey, FieldNameEnum.MAINACTIVITY, i);
            if (mainActivityValue) {
                const activitySelection: SelectedActivity = mainActivityValue
                    ? JSON.parse(mainActivityValue.toString())
                    : undefined;
                activityOrRoute.activity = {
                    activityCode: activitySelection.suggesterId ?? activitySelection.id,
                    activityLabel: getActivityLabel(activitySelection) || "",
                };
            }

            // Location
            const placeValue = getValue(idSurvey, FieldNameEnum.PLACE, i) as string;
            if (placeValue) {
                activityOrRoute.place = {
                    placeCode: placeValue,
                    placeLabel: findPlaceInRef(placeValue.toString())?.label,
                };
            }
        }

        // With Secondary activity
        activityOrRoute.withSecondaryActivity = getValue(
            idSurvey,
            FieldNameEnum.WITHSECONDARYACTIVITY,
            i,
        ) as boolean | undefined;

        // Secondary activity
        if (activityOrRoute.withSecondaryActivity) {
            const secondaryActivityValue = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY, i) as
                | string
                | undefined;
            if (secondaryActivityValue) {
                activityOrRoute.secondaryActivity = {
                    activityCode: secondaryActivityValue,
                    activityLabel: findSecondaryActivityInRef(secondaryActivityValue)?.label,
                };
            }
        }

        // With someone
        activityOrRoute.withSomeone = getValue(idSurvey, FieldNameEnum.WITHSOMEONE, i) as
            | boolean
            | undefined;
        if (activityOrRoute.withSomeone) {
            const withSomeoneLabel = getWithSomeoneLabel(idSurvey, i, source);
            activityOrRoute.withSomeoneLabels = withSomeoneLabel;
        }

        // Screen
        activityOrRoute.withScreen = getValue(idSurvey, FieldNameEnum.WITHSCREEN, i) as
            | boolean
            | undefined;

        activitiesRoutes.push(activityOrRoute);
    }

    const sortedActivities = activitiesRoutes.sort(
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
            const index = copy.indexOf(act);
            copy.splice(index, 0, {
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
    getActivitiesOrRoutes(idSurvey).activitiesRoutesOrGaps.forEach(activityRouteOrGap => {
        if (
            activityRouteOrGap?.activity?.activityLabel != null &&
            activityRouteOrGap?.activity?.activityLabel.length > 0
        )
            activitesSelected.push(activityRouteOrGap.activity?.activityLabel);
        if (
            activityRouteOrGap?.secondaryActivity?.activityLabel != null &&
            activityRouteOrGap?.secondaryActivity?.activityLabel.length > 0
        )
            activitesSelected.push(activityRouteOrGap.secondaryActivity.activityLabel);
    });
    return activitesSelected;
};

const getActivityOrRouteDurationLabel = (activity: ActivityRouteOrGap): string => {
    if (!activity.startTime || !activity.endTime) return "?";

    dayjs.extend(customParseFormat);
    const startTime = dayjs(activity.startTime, "HH:mm");
    const endTime = dayjs(activity.endTime, "HH:mm");

    let diffHours = Math.abs(startTime.diff(endTime, "hour"));
    let diffMinutes = Math.abs(startTime.diff(endTime, "minute"));

    const formatedHours = diffHours > 0 ? diffHours + "h " : "";
    const formatedMin = diffMinutes + "min";

    return formatedHours + formatedMin;
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

const getMeanOfTransportLabel = (
    idSurvey: string,
    i: number,
    source: LunaticModel | undefined,
): string | undefined => {
    const result: any[] = [];
    const fieldNames = [
        FieldNameEnum.FOOT,
        FieldNameEnum.BICYCLE,
        FieldNameEnum.TWOWHEELSMOTORIZED,
        FieldNameEnum.PRIVATECAR,
        FieldNameEnum.OTHERPRIVATE,
        FieldNameEnum.PUBLIC,
    ];
    // TODO should not be parsed for each mean of transport
    const responses = source?.components
        .find(c => c.bindingDependencies?.includes(FieldNameEnum.FOOT))
        ?.components?.find(co => co.bindingDependencies?.includes(FieldNameEnum.FOOT))?.responses;
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
