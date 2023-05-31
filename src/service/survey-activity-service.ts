import {
    AutoCompleteActiviteOption,
    getProgressBarValue,
    SelectedActivity,
    transformToWeeklyPlannerDataType,
} from "@inseefrlab/lunatic-edt";
import { IODataStructure } from "@inseefrlab/lunatic-edt/src/interface/WeeklyPlannerTypes";
import activitySurveySource from "activity-survey.json";
import { DAY_LABEL, FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "constants/constants";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { Activity, ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { TFunction, useTranslation } from "react-i18next";
import { getLoopSize } from "service/loop-service";
import {
    findActivityInAutoCompleteReferentiel,
    findActivityInNomenclatureReferentiel,
    findActivitySecondaryActivityInRef,
    findMeanOfTransportInRef,
    findPlaceInRef,
    findRouteInRef,
    findRouteSecondaryActivityInRef,
    getAutoCompleteRef,
    getLanguage,
} from "service/referentiel-service";
import { getData, getValue, saveData, surveysIds } from "service/survey-service";

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
    const goalActivity = getValue(idSurvey, FieldNameEnum.GOAL, i) as string;

    if (mainActivityId || mainActivitySuggesterId || mainActivityLabel || mainActivityIsFullyCompleted) {
        const activitySelection: SelectedActivity = {
            id: mainActivityId,
            suggesterId: mainActivitySuggesterId,
            label: mainActivityLabel,
            isFullyCompleted: mainActivityIsFullyCompleted,
        };
        activityOrRoute.activity = {
            activityCode:
                activitySelection.suggesterId ??
                activitySelection.id ??
                findItemInAutoCompleteRefByLabel(activitySelection.label, getAutoCompleteRef())?.id,
            activityLabel: getActivityLabel(activitySelection) || "",
            isGoal: mainActivitySuggesterId != null || mainActivityLabel != null,
            activityGoal: goalActivity,
        };
    }
};

export const findItemInAutoCompleteRefByLabel = (
    label: string | undefined,
    ref: AutoCompleteActiviteOption[],
): AutoCompleteActiviteOption | undefined => {
    return ref.find(a => a.label === label);
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
                activityLabel: activityOrRoute.isRoute
                    ? getActivitySecondary(idSurvey, i, secondaryActivityValue)
                    : getRouteActivitySecondary(idSurvey, i, secondaryActivityValue),
            };
        }
    }
};

const getActivitySecondary = (idSurvey: string, i: number, secondaryActivityValue: string) => {
    const newSecondaryActivityValue = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY_LABEL, i) as
        | string
        | undefined;
    const activtySecondaryInRef = findActivitySecondaryActivityInRef(secondaryActivityValue);
    return activtySecondaryInRef != null ? activtySecondaryInRef?.label : newSecondaryActivityValue;
};

const getRouteActivitySecondary = (idSurvey: string, i: number, secondaryActivityValue: string) => {
    const newSecondaryActivityValue = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY_LABEL, i) as
        | string
        | undefined;
    const routeActivtySecondaryInRef = findRouteSecondaryActivityInRef(secondaryActivityValue);
    return routeActivtySecondaryInRef != null
        ? routeActivtySecondaryInRef?.label
        : newSecondaryActivityValue;
};

const createRoute = (
    idSurvey: string,
    source: LunaticModel,
    activityOrRoute: ActivityRouteOrGap,
    iteration: number,
    t: TFunction<"translation", undefined>,
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
    activityOrRoute.meanOfTransportLabels = getMeanOfTransportLabel(idSurvey, iteration);
    return activityOrRoute;
};

const createActivity = (
    idSurvey: string,
    activityOrRoute: ActivityRouteOrGap,
    iteration: number,
    t: TFunction<"translation", undefined>,
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

const convertStringToBoolean = (value: string | undefined) => {
    return value == "true" ? true : value == "false" ? false : undefined;
};

const createActivitiesOrRoutes = (
    idSurvey: string,
    source: LunaticModel,
    t: TFunction<"translation", undefined>,
) => {
    let activitiesRoutes: ActivityRouteOrGap[] = [];
    const activityLoopSize = getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE, activitySurveySource);

    for (let i = 0; i < activityLoopSize; i++) {
        let activityOrRoute: ActivityRouteOrGap = {};
        activityOrRoute.iteration = i;
        activityOrRoute.isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, i) as boolean | undefined;

        activityOrRoute.startTime =
            getValue(idSurvey, FieldNameEnum.START_TIME, i)?.toString() || undefined;
        activityOrRoute.endTime = getValue(idSurvey, FieldNameEnum.END_TIME, i)?.toString() || undefined;
        activityOrRoute.durationMinutes = getActivityOrRouteDurationMinutes(activityOrRoute);
        activityOrRoute.durationLabel = getActivityOrRouteDurationLabel(activityOrRoute);

        if (activityOrRoute.isRoute) {
            activityOrRoute = createRoute(idSurvey, source, activityOrRoute, i, t);
        } else {
            activityOrRoute = createActivity(idSurvey, activityOrRoute, i, t);
        }

        const withSecondaryActivity = getValue(idSurvey, FieldNameEnum.WITHSECONDARYACTIVITY, i) as
            | string
            | undefined;
        // With Secondary activity
        activityOrRoute.withSecondaryActivity = convertStringToBoolean(withSecondaryActivity);

        // Secondary activity
        checkForSecondaryActivity(idSurvey, i, activityOrRoute);

        // With someone
        activityOrRoute.withSomeone = convertStringToBoolean(
            getValue(idSurvey, FieldNameEnum.WITHSOMEONE, i) as string | undefined,
        );
        if (activityOrRoute.withSomeone) {
            const withSomeoneLabel = getWithSomeoneLabel(idSurvey, i, source);
            activityOrRoute.withSomeoneLabels = withSomeoneLabel;
        }

        // Screen
        activityOrRoute.withScreen = convertStringToBoolean(
            getValue(idSurvey, FieldNameEnum.WITHSCREEN, i) as string | undefined,
        );

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
        const beforeFirstActivity = getDiffTime(getTime("04:00"), getTime(act?.startTime), "hours");
        if (activitiesRoutes.indexOf(act) == 0 && beforeFirstActivity > 0) {
            activitiesRoutes.splice(0, 0, {
                startTime: "04:00",
                endTime: act.startTime,
                isGap: true,
            });
        } else if (
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
    t: TFunction<"translation", undefined>,
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

const getActivitesSelectedLabel = (idSurvey: string): Activity[] => {
    let activitesSelected: Activity[] = [];
    const { t } = useTranslation();
    getActivitiesOrRoutes(t, idSurvey).activitiesRoutesOrGaps.forEach(activityRouteOrGap => {
        if (
            activityRouteOrGap?.activity?.activityLabel != null &&
            activityRouteOrGap?.activity?.activityLabel.length > 0
        )
            activitesSelected.push(activityRouteOrGap.activity);
    });
    return activitesSelected;
};

const getActivityOrRouteDuration = (activity: ActivityRouteOrGap, diffType: string): number => {
    dayjs.extend(customParseFormat);
    const startTime = dayjs(activity.startTime, FORMAT_TIME);
    let endTime = dayjs(activity.endTime, FORMAT_TIME);

    if (startTime.isAfter(endTime)) {
        endTime = endTime.add(1, DAY_LABEL);
    }

    let init = dayjs(START_TIME_DAY, FORMAT_TIME);

    if (startTime.isSame(endTime) && endTime.isSame(init)) {
        endTime = endTime.add(1, DAY_LABEL);
    }

    let diffMinutes = Math.abs(endTime.diff(startTime, MINUTE_LABEL));
    let diffHours = Math.trunc(diffMinutes / 60);

    return diffType != MINUTE_LABEL ? diffHours : diffMinutes;
};

const getActivityOrRouteDurationLabel = (activity: ActivityRouteOrGap): string => {
    if (!activity.startTime || !activity.endTime) return "?";

    let diffMinutes = getActivityOrRouteDuration(activity, MINUTE_LABEL);
    let diffHours = Math.trunc(diffMinutes / 60);
    diffMinutes = diffMinutes - diffHours * 60;

    if (diffMinutes >= 0 && diffHours > 0) {
        return diffHours + "h" + (diffMinutes < 10 ? "0" : "") + diffMinutes;
    } else if (diffHours == 0) {
        return diffMinutes + "min";
    } else return "";
};

const getActivityOrRouteDurationMinutes = (activity: ActivityRouteOrGap): number => {
    if (!activity.startTime || !activity.endTime) return 0;
    return getActivityOrRouteDuration(activity, MINUTE_LABEL);
};

const getActivityOrRouteDurationLabelFromDurationMinutes = (durationMinutes: number): string => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = Math.round(durationMinutes % 60);
    return getLabelFromTime(hours, minutes);
};

const getLabelFromTime = (hours: number, minutes: number) => {
    let hoursLabel = hours > 0 ? hours + "h" : "";
    let minutesLabel;

    if (hours > 0) {
        minutesLabel = (minutes < 10 ? "0" : "") + minutes;
    } else {
        minutesLabel = minutes + "min";
    }
    return hoursLabel + minutesLabel;
};

const getTotalTimeOfActivities = (idSurvey: string, t: TFunction<"translation", undefined>): number => {
    const { activitiesRoutesOrGaps } = getActivitiesOrRoutes(t, idSurvey);
    let totalTimeActivities = 0;

    for (let activityRouteOrGap of activitiesRoutesOrGaps) {
        if (!activityRouteOrGap.isGap) {
            totalTimeActivities += getActivityOrRouteDuration(activityRouteOrGap, MINUTE_LABEL);
        }
    }
    if (activitiesRoutesOrGaps.length == 0) return 0;
    else return totalTimeActivities;
};

const getScore = (idSurvey: string, t: TFunction<"translation", undefined>): number => {
    const totalHourActivities = getTotalTimeOfActivities(idSurvey, t) / 60;
    const percentage = (totalHourActivities / 24) * 100;
    return totalHourActivities > 0 ? Math.trunc(percentage) : 0;
};

const getWeeklyPlannerScore = (idSurvey: string): number => {
    const value = getValue(idSurvey, FieldNameEnum.WEEKLYPLANNER) as IODataStructure[];
    const weeklyPlannerValue = transformToWeeklyPlannerDataType(value, getLanguage());
    return getProgressBarValue(weeklyPlannerValue);
};

const getTime = (time?: string) => {
    let timeDay = dayjs(time, "HH:mm");
    if (timeDay.hour() < 4) {
        return timeDay.add(1, "day");
    } else return timeDay;
};

const getDiffTime = (startTime?: dayjs.Dayjs, endTime?: dayjs.Dayjs, diffType?: "minutes" | "hours") => {
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
    const diffHours = Math.abs(startFinalTime.diff(endTimeDay, diffType, true));
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

const getMeanOfTransportLabel = (idSurvey: string, i: number): string | undefined => {
    const meanOfTransportValue = getValue(idSurvey, FieldNameEnum.MEANOFTRANSPORT, i) as
        | string
        | undefined;

    return meanOfTransportValue ? findMeanOfTransportInRef(meanOfTransportValue)?.label : undefined;
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
            }
        });
        saveData(idSurvey, data, false, true);
    }
};

const mockActivitiesRoutesOrGaps = () => {
    const activitiesRoutesOrGaps = [
        {
            activity: {
                activityCode: "140",
                activityLabel: "Manger",
            },
            durationLabel: "2h00",
            durationMinutes: 120,
            endTime: "14:00",
            isRoute: false,
            iteration: 0,
            place: {
                placeCode: "12",
                placeLabel: "Lieu de travail ou d’études",
            },
            secondaryActivity: {
                activityCode: "1",
                activityLabel: '"Écouter la radio, des podcasts ou de la musique"',
            },
            startTime: "12:00",
            withScreen: true,
            withSecondaryActivity: false,
            withSomeone: false,
        },
        {
            endTime: "16:00",
            isGap: true,
            startTime: "14h00",
        },
        {
            durationLabel: "2h00",
            durationMinutes: 120,
            endTime: "18:00",
            isRoute: true,
            iteration: 2,
            meanOfTransportLabels: "Vélo (électrique ou non)",
            route: {
                routeCode: "1",
                routeLabel: "Trajet Domicile - Travail",
            },
            startTime: "16:00",
            withScreen: false,
            withSecondaryActivity: false,
            withSomeone: false,
        },
    ];
    return activitiesRoutesOrGaps;
};

const mockData = () => {
    const idSurvey = surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS][0];
    let dataAct = Object.assign({}, getData(idSurvey || ""));

    if (dataAct != null && dataAct.COLLECTED) {
        if (dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_ID])
            dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_ID].COLLECTED = null;
        if (dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED])
            dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED].COLLECTED = null;
        if (dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_LABEL])
            dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_LABEL].COLLECTED = null;
        if (dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_SUGGESTERID])
            dataAct.COLLECTED[FieldNameEnum.MAINACTIVITY_SUGGESTERID].COLLECTED = null;
    }
    return dataAct;
};

export {
    getActivitiesOrRoutes,
    getActivitesSelectedLabel,
    getActivityOrRouteDurationLabel,
    getActivityOrRouteDurationLabelFromDurationMinutes,
    getActivityLabel,
    getLabelFromTime,
    getTotalTimeOfActivities,
    getScore,
    getWeeklyPlannerScore,
    deleteActivity,
    mockActivitiesRoutesOrGaps,
    mockData,
};
