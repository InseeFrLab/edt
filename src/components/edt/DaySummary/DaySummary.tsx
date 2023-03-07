import { makeStylesEdt, TooltipInfo } from "@inseefrlab/lunatic-edt";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import InfoIcon from "assets/illustration/info.svg";
import { UserActivitiesSummary } from "interface/entity/ActivitiesSummary";
import { useTranslation } from "react-i18next";
interface DaySummaryProps {
    userActivitiesSummary?: UserActivitiesSummary;
}

const DaySummary = (props: DaySummaryProps) => {
    const { userActivitiesSummary } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();
    const tooltipTitleLabels = {
        boldText: t("component.day-summary.tooltip-summary"),
        infoIconAlt: t("accessibility.asset.info.info-alt"),
        infoIcon: InfoIcon,
        border: true,
        infoIconTop: true,
    };
    const titleLabels = {
        boldTitle: t("component.day-summary.title"),
    };

    const getCardSummary = (timeLabel: string | undefined, label: string) => {
        return (
            <>
                <Divider variant="middle" flexItem />
                <Box className={classes.rowBox}>
                    <Box className={classes.valueBox}>
                        {timeLabel || t("component.day-summary.no-time")}
                    </Box>
                    <Typography className={classes.label}>{t(label)}</Typography>
                </Box>
            </>
        );
    };

    return (
        <Box className={classes.daySummaryBox}>
            <Box className={classes.titleBox}>
                <TooltipInfo
                    displayTooltip={false}
                    titleLabels={titleLabels}
                    infoLabels={tooltipTitleLabels}
                />
            </Box>
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
            {getCardSummary(
                userActivitiesSummary?.realRouteTimeLabel,
                "component.day-summary.real-route-time",
            )}
            {getCardSummary(
                userActivitiesSummary?.homeTasksTimeLabel,
                "component.day-summary.home-task-time",
            )}
            {getCardSummary(
                userActivitiesSummary?.aloneTimeLabel,
                "component.day-summary.alone-task-time",
            )}
            {getCardSummary(
                userActivitiesSummary?.sleepingTimeLabel,
                "component.day-summary.sleep-time",
            )}
            {getCardSummary(userActivitiesSummary?.workingTimeLabel, "component.day-summary.work-time")}
            {getCardSummary(
                userActivitiesSummary?.domesticTasksTimeLabel,
                "component.day-summary.domestic-task-time",
            )}
            {getCardSummary(
                userActivitiesSummary?.otherFamilyTasksTimeLabel,
                "component.day-summary.other-home-time",
            )}
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
    titleBox: {
        marginBottom: "1rem",
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
        marginBottom: 0,
    },
}));

export default DaySummary;
