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
    otherFamilyTasksTimeLabel?: string;
    realRouteTimeLabel?: string;
    activitiesWithScreenAmount?: number;
    activitiesTimeWithScreenLabel?: string;
}
