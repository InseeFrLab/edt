import {
    DOMESTIC_CATEGORIES_ACTIVITES_LIST,
    HOME_CATEGORY_PLACE_LIST,
    MAX_SCORE,
    MINUTES_DAY,
    MIN_THRESHOLD,
    OTHER_FAMILY_CATEGORIES_ACTIVITES_LIST,
    PERCENT_MIN_THRESHOLD,
    POINTS_REMOVE,
    SKIP_WORKING_CATEGORIES_ACTIVITES_LIST,
    SLEEPING_CATEGORIES_ACTIVITES_LIST,
    WORKING_CATEGORIES_ACTIVITES_LIST,
} from "constants/constants";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import {
    UserActivitiesCharacteristics,
    UserActivitiesSummary,
} from "interface/entity/ActivitiesSummary";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { TFunction } from "react-i18next";
import {
    findActivityInAutoCompleteReferentielById,
    findActivityInNomenclatureReferentielById,
    findKindOfDayInRef,
    findNewActivityById,
    findRouteInRef,
    findRouteSecondaryActivityInRef,
} from "service/referentiel-service";
import {
    convertStringToBoolean,
    getActivitiesOrRoutes,
    getActivityOrRouteDurationLabelFromDurationMinutes,
    getLabelFromTime,
} from "service/survey-activity-service";
import { getValue } from "service/survey-service";
import { filtrePage, getAllCodesFromActivitiesCodes } from "./loop-service";

const getUserActivitiesSummary = (
    idSurvey: string,
    t: TFunction<"translation", undefined>,
): UserActivitiesSummary | undefined => {
    const { activitiesRoutesOrGaps } = getActivitiesOrRoutes(t, idSurvey);
    let activitiesSummary: UserActivitiesSummary = {
        activitiesAmount: activitiesRoutesOrGaps.filter(activityOrRoute => !activityOrRoute.isRoute)
            .length,
        routesAmount: activitiesRoutesOrGaps.filter(activityOrRoute => activityOrRoute.isRoute).length,
        realRouteTimeLabel: getRealRouteTimeLabel(activitiesRoutesOrGaps),
        homeTasksTimeLabel: getHomeTasksTime(activitiesRoutesOrGaps, HOME_CATEGORY_PLACE_LIST),
        aloneTimeLabel: getAloneTime(activitiesRoutesOrGaps),
        sleepingTimeLabel: getDuration(activitiesRoutesOrGaps, SLEEPING_CATEGORIES_ACTIVITES_LIST, []),
        workingTimeLabel: getDuration(
            activitiesRoutesOrGaps,
            WORKING_CATEGORIES_ACTIVITES_LIST,
            SKIP_WORKING_CATEGORIES_ACTIVITES_LIST,
        ),
        domesticTasksTimeLabel: getDuration(
            activitiesRoutesOrGaps,
            DOMESTIC_CATEGORIES_ACTIVITES_LIST,
            [],
        ),
        otherFamilyTasksTimeLabel: getDuration(
            activitiesRoutesOrGaps,
            OTHER_FAMILY_CATEGORIES_ACTIVITES_LIST,
            [],
        ),

        activitiesWithScreenAmount: activitiesRoutesOrGaps.filter(
            activityOrRoute => activityOrRoute.withScreen,
        ).length,
        activitiesTimeWithScreenLabel: getActivitiesTimeWithScreenLabel(activitiesRoutesOrGaps),
    };

    return activitiesSummary;
};

const getActivityOrRouteInRef = (idSurvey: string, activityOrRouteId: string) => {

    return (
        findActivityInNomenclatureReferentielById(activityOrRouteId)?.label ||
        findActivityInAutoCompleteReferentielById(activityOrRouteId)?.label ||
        findRouteInRef(activityOrRouteId)?.label ||
        findRouteSecondaryActivityInRef(activityOrRouteId)?.label ||
        findNewActivityById(idSurvey, activityOrRouteId) ||
        activityOrRouteId ||
        ""
    );
};

const getUserActivitiesCharacteristics = (
    idSurvey: string,
    t: TFunction<"translation", undefined>,
): UserActivitiesCharacteristics | undefined => {
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey);
    let greatestActivityId = getValue(idSurvey, FieldNameEnum.GREATESTACTIVITYDAY) as string;
    let worstActivityId = getValue(idSurvey, FieldNameEnum.WORSTACTIVITYDAY) as string;

    let activitiesCharacteristics: UserActivitiesCharacteristics = {
        greatestActivityLabel: getActivityOrRouteInRef(idSurvey, greatestActivityId),
        worstActivityLabel: getActivityOrRouteInRef(idSurvey, worstActivityId),
        kindOfDayLabel:
            findKindOfDayInRef(getValue(idSurvey, FieldNameEnum.KINDOFDAY) as string)?.label ||
            undefined,
        isExceptionalDay: convertStringToBoolean(
            getValue(idSurvey, FieldNameEnum.EXCEPTIONALDAY) as string,
        ),
        routeTimeLabel: transformTimeInLabel(idSurvey, FieldNameEnum.TRAVELTIME), //(getValue(idSurvey, FieldNameEnum.TRAVELTIME) as string)?.replace(":", "h"),
        phoneTimeLabel: transformTimeInLabel(idSurvey, FieldNameEnum.PHONETIME), //(getValue(idSurvey, FieldNameEnum.PHONETIME) as string)?.replace(":", "h"),
        userMarkLabel:
            t("page.activity-summary.quality-score.label") +
            " " +
            getQualityScore(activitiesRoutesOrGaps, overlaps, t),
    };
    return activitiesCharacteristics;
};

const transformTimeInLabel = (idSurvey: string, variable: FieldNameEnum) => {
    const value = getValue(idSurvey, variable) as string;

    if (value == null) return "";

    const valueSplitted = value.split(":");
    const hours = Number(valueSplitted[0]);
    const minutes = Number(valueSplitted[1]);

    return getLabelFromTime(hours, minutes);
};

const getRealRouteTimeLabel = (activitiesOrRoutes: ActivityRouteOrGap[]): string => {
    const routes = activitiesOrRoutes.filter(activityOrRoute => activityOrRoute.isRoute);
    let totalDurationMinutes = 0;
    routes.forEach(route => {
        if (route.durationMinutes) {
            totalDurationMinutes = totalDurationMinutes + route.durationMinutes;
        }
    });
    return getActivityOrRouteDurationLabelFromDurationMinutes(totalDurationMinutes);
};

const getActivitiesTimeWithScreenLabel = (activitiesOrRoutes: ActivityRouteOrGap[]): string => {
    const activitiesWithScreen = activitiesOrRoutes.filter(
        activityOrRoute => activityOrRoute.withScreen,
    );
    let totalDurationMinutes = 0;
    activitiesWithScreen.forEach(activitiyWithScreen => {
        if (activitiyWithScreen.durationMinutes) {
            totalDurationMinutes = totalDurationMinutes + activitiyWithScreen.durationMinutes;
        }
    });
    return getActivityOrRouteDurationLabelFromDurationMinutes(totalDurationMinutes);
};

const getAllTime = (listToSum: number[]) => {
    return listToSum?.reduce((a, b) => a + b, 0);
};

/**
 * Takes activity or its code exist in list codesWorkingTime
 * and not in list to skipper (codesActivitiesToSkip)
 * @param activityRouteOrGap
 * @param codesWorkingTime list with codes to consider
 * @param codesActivitiesToSkip list with codes to skipper
 * @returns
 */
const takeActivity = (
    activityRouteOrGap: ActivityRouteOrGap,
    codesWorkingTime: string[],
    codesActivitiesToSkip: string[],
) => {
    let activityCode = activityRouteOrGap.activity?.activityCode;

    if (activityCode != null) {
        activityCode = activityCode.split("-").length > 1 ? activityCode.split("-")[0] : activityCode;

        return (
            codesActivitiesToSkip.indexOf(activityCode) < 0 &&
            codesWorkingTime.indexOf(activityCode) >= 0
        );
    }
    return false;
};

const getTime = (
    activitiesRoutesOrGaps: ActivityRouteOrGap[],
    codesActivities: string[],
    codesActivitiesSkip: string[],
) => {
    const codesWorkingTime = getAllCodesFromActivitiesCodes(codesActivities);
    const codesActivitiesToSkip = getAllCodesFromActivitiesCodes(codesActivitiesSkip);
    const activitesFiltred = activitiesRoutesOrGaps
        .filter(act => takeActivity(act, codesWorkingTime, codesActivitiesToSkip))
        .map(act => act.durationMinutes ?? 0);
    return getAllTime(activitesFiltred);
};

const getDuration = (
    activitiesRoutesOrGaps: ActivityRouteOrGap[],
    codesActivities: string[],
    codesActivitiesSkip: string[],
) => {
    const minutes = getTime(activitiesRoutesOrGaps, codesActivities, codesActivitiesSkip);
    return getActivityOrRouteDurationLabelFromDurationMinutes(minutes);
};

const getHomeTasksTime = (activitiesRoutesOrGaps: ActivityRouteOrGap[], codesPlace: string[]) => {
    const activitesFiltred = activitiesRoutesOrGaps
        .filter(act => codesPlace.indexOf(act.place?.placeCode ?? "") >= 0)
        .map(act => act.durationMinutes ?? 0);
    return getActivityOrRouteDurationLabelFromDurationMinutes(getAllTime(activitesFiltred));
};

const getAloneTime = (activitiesRoutesOrGaps: ActivityRouteOrGap[]) => {
    const activitesFiltred = activitiesRoutesOrGaps
        .filter(act => act.withSomeone != null && !act.withSomeone)
        .map(act => act.durationMinutes ?? 0);
    return getActivityOrRouteDurationLabelFromDurationMinutes(getAllTime(activitesFiltred));
};

const getQualityScore = (
    activitiesRoutesOrGaps: ActivityRouteOrGap[],
    overlaps: { prev: string | undefined; current: string | undefined }[],
    t: TFunction<"translation", undefined>,
) => {
    const activitesFiltred = activitiesRoutesOrGaps.map(act => act.durationMinutes ?? 0);
    const allMinutesActivites = getAllTime(activitesFiltred);
    let substractPoint = 0;

    ////missing at least MIN_THRESHOLD_PROVIDED_HOURS hours
    substractPoint +=
        MINUTES_DAY - allMinutesActivites > MIN_THRESHOLD.MIN_THRESHOLD_PROVIDED_HOURS * 60
            ? POINTS_REMOVE.POINTS_REMOVE_PROVIDED_HOURS
            : 0;
    //missing at least MIN_THRESHOLD_MISSING_HOURS hours
    substractPoint +=
        MINUTES_DAY - allMinutesActivites > MIN_THRESHOLD.MIN_THRESHOLD_MISSING_HOURS * 60
            ? POINTS_REMOVE.POINTS_REMOVE_MISSING_HOURS
            : 0;
    //exist + MIN_THRESHOLD_OVERLAPS_HOURS overlaps
    substractPoint +=
        overlaps.length >= MIN_THRESHOLD.MIN_THRESHOLD_OVERLAPS_HOURS
            ? POINTS_REMOVE.POINTS_REMOVE_OVERLAPS_HOURS
            : 0;
    //insufficient number of routes (at least MIN_THRESHOLD_ROUTE_HOURS)
    substractPoint +=
        activitiesRoutesOrGaps.filter(activityOrRoute => activityOrRoute.isRoute).length <
            MIN_THRESHOLD.MIN_THRESHOLD_ROUTE_HOURS
            ? POINTS_REMOVE.POINTS_REMOVE_ROUTE_HOURS
            : 0;

    substractPoint += missingVariablesSomeone(activitiesRoutesOrGaps)
        ? POINTS_REMOVE.POINTS_REMOVE_MISSING_SOMEONE
        : 0;
    substractPoint += missingVariablesScreen(activitiesRoutesOrGaps)
        ? POINTS_REMOVE.POINTS_REMOVE_MISSING_SCREEN
        : 0;
    substractPoint += missingVariablesPlace(activitiesRoutesOrGaps)
        ? POINTS_REMOVE.POINTS_REMOVE_MISSING_SOMEONE
        : 0;
    substractPoint += missingVariablesGoal(activitiesRoutesOrGaps)
        ? POINTS_REMOVE.POINTS_REMOVE_MISSING_SOMEONE
        : 0;

    return groupScore(MAX_SCORE - substractPoint, t);
};

/**
 * Skip activites when variable not proposed
 * @param activitiesRoutesOrGaps
 * @param variable
 * @returns
 */
const getActivitiesMandatory = (
    activitiesRoutesOrGaps: ActivityRouteOrGap[],
    variable: EdtRoutesNameEnum,
) => {
    return activitiesRoutesOrGaps.filter(
        act => !act.isGap && !filtrePage(variable, act.activity?.activityCode ?? ""),
    );
};

const maxMissingActivites = (activitiesRoutesOrGaps: ActivityRouteOrGap[], threshold: number) => {
    return (threshold / 100) * activitiesRoutesOrGaps.length;
};
/**
 * If number of missing variables of someone doesn't reach the threshold
 * @param activitiesRoutesOrGaps activites
 * @returns number of missing variables > PERCENT_MIN_THRESHOLD_SOMEONE % of activites
 */
const missingVariablesSomeone = (activitiesRoutesOrGaps: ActivityRouteOrGap[]) => {
    const activitesMandatory = getActivitiesMandatory(
        activitiesRoutesOrGaps,
        EdtRoutesNameEnum.WITH_SOMEONE,
    );
    const activitesMissingSomeone = activitesMandatory
        .map(act => {
            return act.withSomeone == null || (act.withSomeone && act.withSomeoneLabels == null);
        })
        .filter(act => act);

    const threshold = maxMissingActivites(
        activitiesRoutesOrGaps,
        PERCENT_MIN_THRESHOLD.PERCENT_MIN_THRESHOLD_SOMEONE,
    );
    return activitesMissingSomeone.length >= threshold;
};

/**
 * If number of missing variables of screen doesn't reach the threshold
 * @param activitiesRoutesOrGaps activites
 * @returns number of missing variables > PERCENT_MIN_THRESHOLD_SCREEN % of activites
 */
const missingVariablesScreen = (activitiesRoutesOrGaps: ActivityRouteOrGap[]) => {
    const activitesMandatory = getActivitiesMandatory(
        activitiesRoutesOrGaps,
        EdtRoutesNameEnum.WITH_SCREEN,
    );
    const activitesMissingScreen = activitesMandatory
        .map(act => {
            return act.withScreen == null;
        })
        .filter(act => act);

    const threshold = maxMissingActivites(
        activitiesRoutesOrGaps,
        PERCENT_MIN_THRESHOLD.PERCENT_MIN_THRESHOLD_SCREEN,
    );
    return activitesMissingScreen.length >= threshold;
};

const missingVariablesPlace = (activitiesRoutesOrGaps: ActivityRouteOrGap[]) => {
    const activitesMandatory = getActivitiesMandatory(
        activitiesRoutesOrGaps,
        EdtRoutesNameEnum.ACTIVITY_LOCATION,
    );
    const activitesMissingPlace = activitesMandatory
        .map(act => {
            return act.place == null || act.place.placeLabel == null || act.place.placeLabel.length == 0;
        })
        .filter(act => act);

    const threshold = maxMissingActivites(
        activitiesRoutesOrGaps,
        PERCENT_MIN_THRESHOLD.PERCENT_MIN_THRESHOLD_PLACE,
    );
    return activitesMissingPlace.length >= threshold;
};

const missingVariablesGoal = (activitiesRoutesOrGaps: ActivityRouteOrGap[]) => {
    const activitesMandatory = getActivitiesMandatory(
        activitiesRoutesOrGaps,
        EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
    );
    const activitesMissingGoal = activitesMandatory
        .map(act => {
            return (
                act?.activity?.isGoal &&
                (act.activity?.activityGoal == null || act.activity?.activityGoal.length == 0)
            );
        })
        .filter(act => act);

    const threshold = maxMissingActivites(
        activitiesRoutesOrGaps,
        PERCENT_MIN_THRESHOLD.PERCENT_MIN_THRESHOLD_GOAL,
    );
    return activitesMissingGoal.length >= threshold;
};

/**
 * Quality score according to the score obtained
 * @param note
 * @returns quality score (A,B,C,D)
 */
const groupScore = (note: number, t: TFunction<"translation", undefined>) => {
    let group = "";
    if (note < 6) {
        group = t("page.activity-summary.quality-score.type-4");
    } else if (note >= 6 && note <= 11) {
        group = t("page.activity-summary.quality-score.type-3");
    } else if (note > 11 && note <= 16) {
        group = t("page.activity-summary.quality-score.type-2");
    } else {
        group = t("page.activity-summary.quality-score.type-1");
    }
    return group;
};

export { getQualityScore, getUserActivitiesCharacteristics, getUserActivitiesSummary };
