import { Box, Divider, Typography } from "@mui/material";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { makeStylesEdt } from "lunatic-edt";
import { getActivityOrRouteDurationLabel } from "service/survey-activity-service";

export const enum InsideAlertTypes {
    PLACE = "place",
    WITHSOMEONE = "withSomeone",
    SCREEN = "screen",
}

interface ActivityOrRouteCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
    activityOrRoute: ActivityRouteOrGap;
    insideAlertIcon: string;
    insideAlertLabels: {
        [InsideAlertTypes.PLACE]: string;
        [InsideAlertTypes.WITHSOMEONE]: string;
        [InsideAlertTypes.SCREEN]: string;
    };
    gapIcon: string;
    gapLabels: {
        main: string;
        secondary: string;
    };
}

const ActivityOrRouteCard = (props: ActivityOrRouteCardProps) => {
    const {
        labelledBy,
        describedBy,
        onClick,
        activityOrRoute,
        insideAlertIcon,
        insideAlertLabels,
        gapIcon,
        gapLabels,
    } = props;
    const { classes, cx } = useStyles();

    const renderInsideAlert = (type: InsideAlertTypes) => {
        return (
            <Box className={classes.insideAlertBox}>
                <img className={classes.insideAlertIcon} src={insideAlertIcon}></img>
                <Typography className={classes.insideAlertText}> {insideAlertLabels[type]} </Typography>
            </Box>
        );
    };

    const renderActivityOrRoute = () => {
        return (
            <Box
                className={cx(classes.mainCardBox, classes.activityCardBox)}
                onClick={onClick}
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
            >
                <Box className={classes.timeBox}>
                    <Box className={classes.hour}>{activityOrRoute.startTime}</Box>
                    <Box>{getActivityOrRouteDurationLabel(activityOrRoute)}</Box>
                    <Box className={classes.hour}>{activityOrRoute.endTime}</Box>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Box className={classes.dataBox}>
                    <Box className={classes.mainActivityLabel}>
                        {activityOrRoute.isRoute
                            ? activityOrRoute.routeLabel
                            : activityOrRoute.activityLabel}
                    </Box>
                    {activityOrRoute.secondaryActivityLabel && (
                        <Box className={classes.otherInfoLabel}>
                            {activityOrRoute.secondaryActivityLabel}
                        </Box>
                    )}
                    {activityOrRoute.place ? (
                        <Box className={classes.otherInfoLabel}>{activityOrRoute.place}</Box>
                    ) : (
                        renderInsideAlert(InsideAlertTypes.PLACE)
                    )}
                    {activityOrRoute.withSomeone ? (
                        <Box className={classes.otherInfoLabel}>{activityOrRoute.withSomeone}</Box>
                    ) : (
                        renderInsideAlert(InsideAlertTypes.WITHSOMEONE)
                    )}
                    {!activityOrRoute.withScreen && renderInsideAlert(InsideAlertTypes.SCREEN)}
                </Box>
            </Box>
        );
    };

    const renderGap = () => {
        return (
            <Box className={cx(classes.mainCardBox, classes.gapBox)}>
                <img className={classes.insideAlertIcon} src={gapIcon}></img>
                <Typography className={cx(classes.mainActivityLabel, classes.gapText)}>
                    {" "}
                    {gapLabels.main}{" "}
                </Typography>
                <Typography className={cx(classes.otherInfoLabel, classes.gapText)}>
                    {" "}
                    {gapLabels.secondary}{" "}
                </Typography>
            </Box>
        );
    };

    return activityOrRoute.isGap ? renderGap() : renderActivityOrRoute();
};

const useStyles = makeStylesEdt({ "name": { ActivityOrRouteCard } })(theme => ({
    mainCardBox: {
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        cursor: "pointer",
        width: "90%",
        maxWidth: "310px",
        marginTop: "1rem",
    },
    activityCardBox: {
        backgroundColor: theme.variables.white,
        border: "1px solid transparent",
        color: theme.palette.text.primary,
    },
    timeBox: {
        display: "flex",
        flexDirection: "column",
        marginRight: "1rem",
        justifyContent: "space-between",
        alignItems: "center",
    },
    hour: {
        color: theme.palette.primary.main,
    },
    dataBox: {
        marginLeft: "1rem",
    },
    mainActivityLabel: {
        fontWeight: "bold",
        fontSize: "14px",
    },
    otherInfoLabel: {
        fontSize: "14px",
    },
    insideAlertBox: {
        display: "flex",
        alignItems: "center",
    },
    insideAlertIcon: {
        marginRight: "0.5rem",
        width: "3rem",
        height: "1.5rem",
    },
    insideAlertText: {
        fontSize: "10px",
        color: theme.variables.alertActivity,
    },
    gapBox: {
        flexDirection: "column",
        alignItems: "center",
        border: "1px dashed #B6462C",
    },
    gapText: {
        color: theme.variables.alertActivity,
    },
}));

export default ActivityOrRouteCard;
