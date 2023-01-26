import activitySurveySource from "activity-survey.json";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { SelectedActivity } from "lunatic-edt";
import { IODataStructure } from "lunatic-edt/dist/interface/WeeklyPlannerTypes";
import {
    getProgressBarValue,
    transformToWeeklyPlannerDataType,
} from "lunatic-edt/dist/ui/components/Planner/WeeklyPlanner";
import { useTranslation } from "react-i18next";
import { FieldNameEnum, getData, getValue, saveData } from "service/survey-service";
import { getLoopSize, LoopEnum } from "./loop-service";
import {
    findActivityInAutoCompleteReferentiel,
    findActivityInNomenclatureReferentiel,
    findPlaceInRef,
    findRouteInRef,
    findSecondaryActivityInRef,
} from "./referentiel-service";

const checkForMainActivity = (idSurvey: string, i: number, activityOrRoute: ActivityRouteOrGap) => {
    const mainActivityId = getValue(idSurvey, FieldNameEnum.MAINACTIVITY_ID, i) as string;
    const mainActivitySuggesterId = getValue(
        idSurvey,
        FieldNameEnum.MAINACTIVITY_SUGGESTERID,
        i,
    ) as string;
    const mainActivityLabel = getValue(idSurvey, FieldNameEnum.MAINACTIVITY_LABEL, i) as string;
    const mainActivityIsFullyCompleted = getValue(
        idSurvey,
        FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED,
        i,
    ) as boolean;

    if (mainActivityId || mainActivitySuggesterId || mainActivityLabel || mainActivityIsFullyCompleted) {
        const activitySelection: SelectedActivity = {
            id: mainActivityId,
            suggesterId: mainActivitySuggesterId,
            label: mainActivityLabel,
            isFullyCompleted: mainActivityIsFullyCompleted,
        };
        activityOrRoute.activity = {
            activityCode: activitySelection.suggesterId ?? activitySelection.id,
            activityLabel: getActivityLabel(activitySelection) || "",
        };
    }
};

const checkForPlace = (idSurvey: string, i: number, activityOrRoute: ActivityRouteOrGap) => {
    const placeValue = getValue(idSurvey, FieldNameEnum.PLACE, i) as string;
    if (placeValue) {
        activityOrRoute.place = {
            placeCode: placeValue,
            placeLabel: findPlaceInRef(placeValue.toString())?.label,
        };
    }
};

const checkForSecondaryActivity = (idSurvey: string, i: number, activityOrRoute: ActivityRouteOrGap) => {
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
};

const createRoute = (
    idSurvey: string,
    source: LunaticModel,
    activityOrRoute: ActivityRouteOrGap,
    iteration: number,
    t: any,
) => {
    // Label
    activityOrRoute.route = { routeLabel: t("common.activity.unknown-route") + (iteration + 1) };

    const routeCode = getValue(idSurvey, FieldNameEnum.ROUTE, iteration) as string | undefined;
    if (routeCode) {
        activityOrRoute.route = {
            routeCode: routeCode,
            routeLabel: getRouteLabel(routeCode),
        };
    }

    //Mean of transport
    activityOrRoute.meanOfTransportLabels = getMeanOfTransportLabel(idSurvey, iteration, source);
    return activityOrRoute;
};

const createActivity = (
    idSurvey: string,
    activityOrRoute: ActivityRouteOrGap,
    iteration: number,
    t: any,
) => {
    // Label
    activityOrRoute.activity = {
        activityLabel: t("common.activity.unknown-activity") + (iteration + 1),
    };
    // Main activity
    checkForMainActivity(idSurvey, iteration, activityOrRoute);

    // Location
    checkForPlace(idSurvey, iteration, activityOrRoute);
    return activityOrRoute;
};

const createActivitiesOrRoutes = (idSurvey: string, source: LunaticModel, t: any) => {
    let activitiesRoutes: ActivityRouteOrGap[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE, activitySurveySource);

    for (let i = 0; i < activityLoopSize; i++) {
        let activityOrRoute: ActivityRouteOrGap = {};
        activityOrRoute.iteration = i;
        activityOrRoute.isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, i) as boolean | undefined;

        activityOrRoute.startTime =
            getValue(idSurvey, FieldNameEnum.STARTTIME, i)?.toString() || undefined;
        activityOrRoute.endTime = getValue(idSurvey, FieldNameEnum.ENDTIME, i)?.toString() || undefined;

        if (activityOrRoute.isRoute) {
            activityOrRoute = createRoute(idSurvey, source, activityOrRoute, i, t);
        } else {
            activityOrRoute = createActivity(idSurvey, activityOrRoute, i, t);
        }

        // With Secondary activity
        activityOrRoute.withSecondaryActivity = getValue(
            idSurvey,
            FieldNameEnum.WITHSECONDARYACTIVITY,
            i,
        ) as boolean | undefined;

        // Secondary activity
        checkForSecondaryActivity(idSurvey, i, activityOrRoute);

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

    return activitiesRoutes;
};

const createGapsOverlaps = (idSurvey: string, activitiesRoutes: ActivityRouteOrGap[]) => {
    // Fill the gaps and overlaps
    const overlaps = [];

    let previousActivity: ActivityRouteOrGap | undefined;
    const copy = [...activitiesRoutes];
    for (const act of copy) {
        // Gaps
        if (
            previousActivity &&
            hourToNormalizedTimeStamp(act.startTime, idSurvey) >
                hourToNormalizedTimeStamp(previousActivity.endTime, idSurvey)
        ) {
            const index = activitiesRoutes.indexOf(act);
            activitiesRoutes.splice(index, 0, {
                startTime: previousActivity.endTime,
                endTime: act.startTime,
                isGap: true,
            });
        }
        // Overlaps to be completed...
        if (
            previousActivity &&
            hourToNormalizedTimeStamp(act.startTime, idSurvey) -
                hourToNormalizedTimeStamp(previousActivity.endTime, idSurvey) <
                0
        ) {
            overlaps.push({
                prev: previousActivity.startTime,
                current: act.startTime,
            });
        }
        previousActivity = act;
    }
    return overlaps;
};

const getActivitiesOrRoutes = (
    t: any,
    idSurvey: string,
    source?: LunaticModel,
): {
    activitiesRoutesOrGaps: ActivityRouteOrGap[];
    overlaps: { prev: string | undefined; current: string | undefined }[];
} => {
    let overlaps = [];
    let activitiesRoutes: ActivityRouteOrGap[] = [];
    if (source == null) source = activitySurveySource;

    activitiesRoutes = createActivitiesOrRoutes(idSurvey, source, t);

    activitiesRoutes.sort(
        (a, b) =>
            hourToNormalizedTimeStamp(a.startTime, idSurvey) -
            hourToNormalizedTimeStamp(b.startTime, idSurvey),
    );

    overlaps = createGapsOverlaps(idSurvey, activitiesRoutes);

    return {
        activitiesRoutesOrGaps: activitiesRoutes,
        overlaps: overlaps,
    };
};

/**
 * Convert hour as string (hh:mm) to normalized timestamp
 * to allow hours comparison
 * @param hour
 * @returns
 */
const hourToNormalizedTimeStamp = (hour: string | undefined, idSurvey: string): number => {
    dayjs.extend(customParseFormat);

    const timeDay = dayjs(hour, "HH:mm");
    const surveyDate = getValue(idSurvey, FieldNameEnum.SURVEYDATE) as string;
    let dateActivity = dayjs(surveyDate, "YYYY-MM-DD");
    if (timeDay.hour() < 4) {
        dateActivity = dateActivity.add(1, "day");
    }
    dateActivity = dateActivity.set("minute", timeDay.minute());
    dateActivity = dateActivity.set("hour", timeDay.hour());
    return dateActivity.toDate().getTime();
};

const getActivitesSelectedLabel = (idSurvey: string): string[] => {
    let activitesSelected: string[] = [];
    const { t } = useTranslation();
    getActivitiesOrRoutes(t, idSurvey).activitiesRoutesOrGaps.forEach(activityRouteOrGap => {
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
    let endTime = dayjs(activity.endTime, "HH:mm");

    if (startTime.isAfter(endTime)) {
        endTime = endTime.add(1, "day");
    }
    let diffHours = Math.abs(endTime.diff(startTime, "hour"));
    let diffMinutes = Math.abs(endTime.diff(startTime, "minute"));
    diffMinutes = diffMinutes - diffHours * 60;

    if (diffMinutes >= 0 && diffHours > 0) {
        return diffHours + "h" + diffMinutes;
    } else if (diffHours == 0) {
        return diffMinutes + "min";
    } else return "";
};

const getTotalTimeOfActivities = (idSurvey: string, t: any): number => {
    const { activitiesRoutesOrGaps } = getActivitiesOrRoutes(t, idSurvey);
    let totalTimeGap = 0;
    let leftTimeActivities = 0;

    for (let activityRouteOrGap of activitiesRoutesOrGaps) {
        if (activityRouteOrGap.isGap) {
            let startTime = getTime(activityRouteOrGap.startTime);
            let endTime = getTime(activityRouteOrGap.endTime);
            const diffTime = getDiffTime(startTime, endTime);
            totalTimeGap += diffTime;
        }
    }

    const beforeFirstActivity = getDiffTime(
        getTime("04:00"),
        getTime(activitiesRoutesOrGaps[0]?.startTime),
    );

    const afterLastActivity = getDiffTime(
        getTime(activitiesRoutesOrGaps[activitiesRoutesOrGaps.length - 1]?.endTime),
        getTime("04:00"),
    );

    leftTimeActivities = beforeFirstActivity + afterLastActivity + totalTimeGap;

    if (activitiesRoutesOrGaps.length == 0) return 0;
    else return 24 - leftTimeActivities;
};

const getScore = (idSurvey: string, t: any): number => {
    const totalHourActivities = getTotalTimeOfActivities(idSurvey, t);
    const percentage = (totalHourActivities / 24) * 100;
    return totalHourActivities > 0 ? Number(percentage.toFixed(0)) : 0;
};

const getWeeklyPlannerScore = (idSurvey: string): number => {
    const value = getValue(idSurvey, FieldNameEnum.WEEKLYPLANNER) as IODataStructure[];
    const weeklyPlannerValue = transformToWeeklyPlannerDataType(value);
    return getProgressBarValue(weeklyPlannerValue);
};

const getTime = (time?: string) => {
    let timeDay = dayjs(time, "HH:mm");
    if (timeDay.hour() < 4) {
        return timeDay.add(1, "day");
    } else return timeDay;
};

const getDiffTime = (startTime?: any, endTime?: any) => {
    if (startTime == null || endTime == null) return 0;
    dayjs.extend(customParseFormat);
    let startFinalTime = startTime;
    let endTimeDay = endTime;

    let startTimeAfterMidnightAfterEndTime = startTime.hour() < 4 && endTime.hour() >= 4;
    let startTimeBeforeMidnightAfterEndTime =
        startTime.hour() >= 4 && endTime.hour() >= 4 && startTime.hour() > endTime.hour();

    if (startTimeAfterMidnightAfterEndTime || startTimeBeforeMidnightAfterEndTime) {
        endTimeDay = endTimeDay.set("day", dayjs().day() + 1);
    }
    const diffHours = Math.abs(startFinalTime.diff(endTimeDay, "hour", true));
    return diffHours;
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

const filterFieldNames = (
    fieldNames: FieldNameEnum[],
    idSurvey: string,
    i: number,
    source: LunaticModel | undefined,
) => {
    const result: any[] = [];
    const responses = source?.components
        .find(c => c.bindingDependencies?.includes(fieldNames[0]))
        ?.components?.find(co => co.bindingDependencies?.includes(fieldNames[0]))?.responses;
    fieldNames.forEach(f => {
        if (getValue(idSurvey, f, i)) {
            const label = responses?.find(
                (r: { response: { name: FieldNameEnum } }) => r.response.name === f,
            ).label;
            result.push(label);
        }
    });

    return result;
};

const getWithSomeoneLabel = (
    idSurvey: string,
    i: number,
    source: LunaticModel | undefined,
): string | undefined => {
    const fieldNames = [
        FieldNameEnum.COUPLE,
        FieldNameEnum.CHILD,
        FieldNameEnum.PARENTS,
        FieldNameEnum.OTHERKNOWN,
        FieldNameEnum.OTHER,
    ];
    const result = filterFieldNames(fieldNames, idSurvey, i, source);
    return result.length !== 0 ? result.join(", ").replaceAll('"', "") : undefined;
};

const getMeanOfTransportLabel = (
    idSurvey: string,
    i: number,
    source: LunaticModel | undefined,
): string | undefined => {
    const fieldNames = [
        FieldNameEnum.FOOT,
        FieldNameEnum.BICYCLE,
        FieldNameEnum.TWOWHEELSMOTORIZED,
        FieldNameEnum.PRIVATECAR,
        FieldNameEnum.OTHERPRIVATE,
        FieldNameEnum.PUBLIC,
    ];
    const result = filterFieldNames(fieldNames, idSurvey, i, source);
    return result.length !== 0 ? result.join(", ").replaceAll('"', "") : undefined;
};

const deleteActivity = (idSurvey: string, source: LunaticModel, iteration: number) => {
    const data = getData(idSurvey);
    const dataCollected = data.COLLECTED != null ? data.COLLECTED : null;
    if (dataCollected) {
        source.variables.forEach(variable => {
            let value = dataCollected?.[variable.name]?.COLLECTED;
            if (Array.isArray(value)) {
                if (value.length >= iteration + 1) {
                    value.splice(iteration, 1);
                }
                if (value.length == 0) {
                    value = [null];
                }
            }
        });
        saveData(idSurvey, data);
    }
};

export {
    getActivitiesOrRoutes,
    getActivitesSelectedLabel,
    getActivityOrRouteDurationLabel,
    getActivityLabel,
    getTotalTimeOfActivities,
    getScore,
    getWeeklyPlannerScore,
    deleteActivity,
};
