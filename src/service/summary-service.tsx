import {
    HOME_CATEGORY_PLACE_LIST,
    SLEEPING_CATEGORIES_ACTIVITES_LIST,
    WORKING_CATEGORIES_ACTIVITES_LIST,
    DOMESTIC_CATEGORIES_ACTIVITES_LIST,
    OTHER_FAMILY_CATEGORIES_ACTIVITES_LIST,
} from "constants/constants";
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
} from "service/referentiel-service";
import {
    getActivitiesOrRoutes,
    getActivityOrRouteDurationLabelFromDurationMinutes,
} from "service/survey-activity-service";
import { getValue } from "service/survey-service";
import { getAllCodesFromActivitiesCodes } from "./loop-service";

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
        sleepingTimeLabel: getDuration(activitiesRoutesOrGaps, SLEEPING_CATEGORIES_ACTIVITES_LIST),
        workingTimeLabel: getDuration(activitiesRoutesOrGaps, WORKING_CATEGORIES_ACTIVITES_LIST),
        domesticTasksTimeLabel: getDuration(activitiesRoutesOrGaps, DOMESTIC_CATEGORIES_ACTIVITES_LIST),
        otherFamilyTasksTimeLabel: getDuration(
            activitiesRoutesOrGaps,
            OTHER_FAMILY_CATEGORIES_ACTIVITES_LIST,
        ),

        activitiesWithScreenAmount: activitiesRoutesOrGaps.filter(
            activityOrRoute => activityOrRoute.withScreen,
        ).length,
        activitiesTimeWithScreenLabel: getActivitiesTimeWithScreenLabel(activitiesRoutesOrGaps),
    };

    return activitiesSummary;
};

const getUserActivitiesCharacteristics = (
    idSurvey: string,
): UserActivitiesCharacteristics | undefined => {
    let activitiesCharacteristics: UserActivitiesCharacteristics = {
        greatestActivityLabel:
            findActivityInNomenclatureReferentielById(
                getValue(idSurvey, FieldNameEnum.GREATESTACTIVITYDAY) as string,
            )?.label ||
            findActivityInAutoCompleteReferentielById(
                getValue(idSurvey, FieldNameEnum.GREATESTACTIVITYDAY) as string,
            )?.label ||
            undefined,
        worstActivityLabel:
            findActivityInNomenclatureReferentielById(
                getValue(idSurvey, FieldNameEnum.WORSTACTIVITYDAY) as string,
            )?.label ||
            findActivityInAutoCompleteReferentielById(
                getValue(idSurvey, FieldNameEnum.WORSTACTIVITYDAY) as string,
            )?.label ||
            undefined,
        kindOfDayLabel:
            findKindOfDayInRef(getValue(idSurvey, FieldNameEnum.KINDOFDAY) as string)?.label ||
            undefined,
        isExceptionalDay: getValue(idSurvey, FieldNameEnum.EXCEPTIONALDAY) as boolean,
        routeTimeLabel: (getValue(idSurvey, FieldNameEnum.TRAVELTIME) as string)?.replace(":", "h"),
        phoneTimeLabel: (getValue(idSurvey, FieldNameEnum.PHONETIME) as string)?.replace(":", "h"),
        userMarkLabel: "Groupe A",
    };
    return activitiesCharacteristics;
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
    return listToSum.reduce((a, b) => a + b, 0);
};

const getTime = (activitiesRoutesOrGaps: ActivityRouteOrGap[], codesActivities: string[]) => {
    const codesWorkingTime = getAllCodesFromActivitiesCodes(codesActivities);
    const activitesFiltred = activitiesRoutesOrGaps
        .filter(act => codesWorkingTime.indexOf(act.activity?.activityCode || "") >= 0)
        .map(act => act.durationMinutes ?? 0);
    return getAllTime(activitesFiltred);
};

const getDuration = (activitiesRoutesOrGaps: ActivityRouteOrGap[], codesActivities: string[]) => {
    const minutes = getTime(activitiesRoutesOrGaps, codesActivities);
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

export { getUserActivitiesSummary, getUserActivitiesCharacteristics };
