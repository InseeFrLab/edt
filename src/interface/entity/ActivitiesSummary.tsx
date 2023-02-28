import { ActivityRouteOrGap } from "./ActivityRouteOrGap";

export interface UserActivitiesCharacteristics {
    greatestActivityLabel?: string;
    worstActivityLabel?: string;
    kindOfDayLabel?: string;
    isExceptionalDay?: boolean;
    routeTimeLabel?: string;
    phoneTimeLabel?: string;
    userMarkLabel?: string;
}

export interface UserActivitiesSummary {
    activitiesAmount?: number;
    routesAmount?: number;
    workingTimeLabel?: string;
    sleepingTimeLabel?: string;
    homeTasksTimeLabel?: string;
    aloneTimeLabel?: string;
    domesticTasksTimeLabel?: string;
    otherFamilyTasksTimeLabel?: string;
    realRouteTimeLabel?: string;
    activitiesWithScreenAmount?: number;
    activitiesTimeWithScreenLabel?: string;
}

export interface ActivitiesSummaryExportData {
    firstName?: string;
    surveyDate?: string;
    activitiesAndRoutes: ActivityRouteOrGap[];
    activities: ActivityRouteOrGap[];
    routes: ActivityRouteOrGap[];
    userActivitiesSummary?: UserActivitiesSummary;
    userActivitiesCharacteristics?: UserActivitiesCharacteristics;
}
