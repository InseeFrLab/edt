import { Box, Divider } from "@mui/material";
import { ActivityOrRoute } from "interface/entity/ActivityOrRoute";
import { makeStylesEdt } from "lunatic-edt";
import { getActivityOrRouteDurationLabel } from "service/survey-activity-service";

interface ActivityOrRouteCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
    activityOrRoute: ActivityOrRoute;
}

const ActivityOrRouteCard = (props: ActivityOrRouteCardProps) => {
    const { labelledBy, describedBy, onClick, activityOrRoute } = props;
    const { classes } = useStyles();

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
                <Box className={classes.activityLabel}>getActivityLabel(code) || activity.label</Box>
                <Box></Box>
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
    activityLabel: {
        fontWeight: "bold",
    },
}));

export default ActivityOrRouteCard;
