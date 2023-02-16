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

const getUserActivitiesSummary = (
    idSurvey: string,
    t: TFunction<"translation", undefined>,
): UserActivitiesSummary | undefined => {
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey);
    let activitiesSummary: UserActivitiesSummary = {
        activitiesAmount: activitiesRoutesOrGaps.filter(activityOrRoute => !activityOrRoute.isRoute)
            .length,
        routesAmount: activitiesRoutesOrGaps.filter(activityOrRoute => activityOrRoute.isRoute).length,
        workingTimeLabel: undefined, //Tout dans 210 et 260 (catégorie entière travail et etudes)
        sleepingTimeLabel: undefined, //"111, 112, 114" que activité principale
        homeTasksTimeLabel: undefined, // Tout dans taches domestiques 300 ou taches domestiques/taches ménagères
        otherFamilyTasksTimeLabel: undefined, // 440 Aide non rémunérée à ses voisins, ses amis, bénévolat ou 440 -> 441
        realRouteTimeLabel: getRealRouteTimeLabel(activitiesRoutesOrGaps),
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
        routeTimeLabel: (getValue(idSurvey, FieldNameEnum.TRAVELTIME) as string).replace(":", "h"),
        phoneTimeLabel: (getValue(idSurvey, FieldNameEnum.PHONETIME) as string).replace(":", "h"),
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

export { getUserActivitiesSummary, getUserActivitiesCharacteristics };
