import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { UserActivitiesSummary } from "interface/entity/ActivitiesSummary";
import { makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";

interface DaySummaryProps {
    userActivitiesSummary?: UserActivitiesSummary;
}

const DaySummary = (props: DaySummaryProps) => {
    const { userActivitiesSummary } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={classes.daySummaryBox}>
            <h3 className={classes.title}>{t("component.day-summary.title")}</h3>
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>{userActivitiesSummary?.activitiesAmount || 0}</Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.activity-done")}
                </Typography>
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>{userActivitiesSummary?.routesAmount || 0}</Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.route-done")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>
                    {userActivitiesSummary?.workingTimeLabel || t("component.day-summary.no-time")}
                </Box>
                <Typography className={classes.label}>{t("component.day-summary.work-time")}</Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>
                    {userActivitiesSummary?.sleepingTimeLabel || t("component.day-summary.no-time")}
                </Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.sleep-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>
                    {userActivitiesSummary?.homeTasksTimeLabel || t("component.day-summary.no-time")}
                </Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.home-task-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>
                    {userActivitiesSummary?.otherFamilyTasksTimeLabel ||
                        t("component.day-summary.no-time")}
                </Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.other-home-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>
                    {userActivitiesSummary?.realRouteTimeLabel || t("component.day-summary.no-time")}
                </Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.real-route-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>
                    {userActivitiesSummary?.activitiesWithScreenAmount || 0}
                </Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.activity-or-route-with-screen")}
                </Typography>
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.valueBox}>
                    {userActivitiesSummary?.activitiesTimeWithScreenLabel ||
                        t("component.day-summary.no-time")}
                </Box>
                <Typography className={classes.label}>
                    {t("component.day-summary.activity-time-with-screen")}
                </Typography>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { DaySummary } })(theme => ({
    daySummaryBox: {
        width: "300px",
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.main,
        marginTop: "1rem",
    },
    rowBox: {
        display: "flex",
        alignItems: "center",
        padding: "0.25rem 0",
    },
    label: {
        color: theme.palette.text.primary,
    },
    valueBox: {
        minWidth: "55px",
        textAlign: "center",
    },
    title: {
        marginTop: 0,
    },
}));

export default DaySummary;
