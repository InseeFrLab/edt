import { StateDataStateEnum } from "../../enumerations/StateDataStateEnum";

export interface ActivityRouteOrGap {
    isRoute?: boolean;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    durationLabel?: string;
    activity?: Activity;
    route?: Route;
    meanOfTransportLabels?: string;
    withSecondaryActivity?: boolean;
    secondaryActivity?: Activity;
    place?: Place;
    withSomeone?: boolean;
    withSomeoneLabels?: string;
    withScreen?: boolean;
    isGap?: boolean;
    iteration?: number;
    state?: StateDataStateEnum;
}

export interface Activity {
    activityLabel?: string;
    activityCode?: string;
    activityGoal?: string;
    isGoal?: boolean;
}
export interface Route {
    routeLabel?: string;
    routeCode?: string;
}
export interface Place {
    placeLabel?: string;
    placeCode?: string;
}
