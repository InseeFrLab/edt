export interface ActivityRouteOrGap {
    isRoute?: boolean;
    startTime?: string;
    endTime?: string;
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
}

export interface Activity {
    activityLabel?: string;
    activityCode?: string;
}
export interface Route {
    routeLabel?: string;
    routeCode?: string;
}
export interface Place {
    placeLabel?: string;
    placeCode?: string;
}
