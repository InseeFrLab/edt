import { Box, Divider, Typography } from "@mui/material";
import { ActivityOrRoute } from "interface/entity/ActivityOrRoute";
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
    activityOrRoute: ActivityOrRoute;
    insideAlertIcon: string;
    insideAlertLabels: {
        [InsideAlertTypes.PLACE]: string;
        [InsideAlertTypes.WITHSOMEONE]: string;
        [InsideAlertTypes.SCREEN]: string;
    };
}

const ActivityOrRouteCard = (props: ActivityOrRouteCardProps) => {
    const { labelledBy, describedBy, onClick, activityOrRoute, insideAlertIcon, insideAlertLabels } =
        props;
    const { classes } = useStyles();

    const renderInsideAlert = (type: InsideAlertTypes) => {
        return (
            <Box className={classes.insideAlertBox}>
                <img className={classes.insideAlertIcon} src={insideAlertIcon}></img>
                <Typography className={classes.insideAlertText}> {insideAlertLabels[type]} </Typography>
            </Box>
        );
    };

    return (
        <Box
            className={classes.activityCardBox}
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

const useStyles = makeStylesEdt({ "name": { ActivityOrRouteCard } })(theme => ({
    activityCardBox: {
        backgroundColor: theme.variables.white,
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        cursor: "pointer",
        width: "90%",
        maxWidth: "310px",
        marginTop: "1rem",
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
        color: "#B6462C",
    },
}));

export default ActivityOrRouteCard;
