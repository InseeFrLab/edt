import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Divider, Popover, Typography } from "@mui/material";
import activityErrorIconSvg, { default as gapIconSvg } from "assets/illustration/error/activity.svg";
import locationErrorIconSvg from "assets/illustration/error/location.svg";
import meanOfTransportErrorIconSvg from "assets/illustration/error/mean-of-transport.svg";
import peopleErrorIconSvg from "assets/illustration/error/people.svg";
import routeErrorIconSvg from "assets/illustration/error/route.svg";
import screenErrorIconSvg from "assets/illustration/error/screen.svg";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { makeStylesEdt } from "lunatic-edt";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getActivityOrRouteDurationLabel } from "service/survey-activity-service";

export const enum InsideAlertTypes {
    PLACE = "place",
    ACTIVITY = "activity",
    ROUTE = "route",
    MEANOFTRANSPORT = "meanOfTransport",
    SECONDARYACTIVITY = "secondaryActivity",
    WITHSOMEONE = "withSomeone",
    SCREEN = "screen",
}

interface ActivityOrRouteCardProps {
    labelledBy: string;
    describedBy: string;
    onClick?(): void;
    activityOrRoute: ActivityRouteOrGap;
    onEdit?(): void;
    onDelete?(): void;
}

const ActivityOrRouteCard = (props: ActivityOrRouteCardProps) => {
    const { labelledBy, describedBy, onClick, activityOrRoute, onEdit, onDelete } = props;
    const { t } = useTranslation();
    const { classes, cx } = useStyles();
    const insideAlertLabels = {
        [InsideAlertTypes.ACTIVITY]: {
            icon: activityErrorIconSvg,
            label: t("page.activity-planner.no-activity"),
        },
        [InsideAlertTypes.ROUTE]: {
            icon: routeErrorIconSvg,
            label: t("page.activity-planner.no-route"),
        },
        [InsideAlertTypes.PLACE]: {
            icon: locationErrorIconSvg,
            label: t("page.activity-planner.no-place"),
        },
        [InsideAlertTypes.MEANOFTRANSPORT]: {
            icon: meanOfTransportErrorIconSvg,
            label: t("page.activity-planner.no-mean-of-transport"),
        },
        [InsideAlertTypes.SECONDARYACTIVITY]: {
            icon: activityErrorIconSvg,
            label: t("page.activity-planner.no-secondary-activity"),
        },
        [InsideAlertTypes.WITHSOMEONE]: {
            icon: peopleErrorIconSvg,
            label: t("page.activity-planner.no-with-someone"),
        },
        [InsideAlertTypes.SCREEN]: {
            icon: screenErrorIconSvg,
            label: t("page.activity-planner.no-screen"),
        },
    };
    const gapIcon = gapIconSvg;
    const gapLabels = {
        main: t("page.activity-planner.gap-main"),
        secondary: t("page.activity-planner.gap-secondary"),
    };

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-or-delete-popover" : undefined;

    const handleClose = (e: any) => {
        setAnchorEl(null);
        e.stopPropagation();
    };

    const onEditIn = useCallback((e: any) => {
        if (onEdit) {
            onEdit();
        }
        e.stopPropagation();
    }, []);

    const onDeleteIn = useCallback((e: any) => {
        if (onDelete) {
            onDelete();
        }
        e.stopPropagation();
    }, []);

    const renderInsideAlert = (type: InsideAlertTypes) => {
        return (
            <Box className={classes.insideAlertBox}>
                <img className={classes.insideAlertIcon} src={insideAlertLabels[type].icon}></img>
                <Typography className={classes.insideAlertText}>
                    {" "}
                    {insideAlertLabels[type].label}{" "}
                </Typography>
            </Box>
        );
    };

    const onEditCard = useCallback((e: any) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    }, []);

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
                            ? activityOrRoute.route?.routeLabel
                            : activityOrRoute.activity?.activityLabel}
                    </Box>
                    {activityOrRoute.isRoute &&
                        (activityOrRoute.meanOfTransportLabels ? (
                            <Box className={classes.otherInfoLabel}>
                                {activityOrRoute.meanOfTransportLabels}
                            </Box>
                        ) : (
                            renderInsideAlert(InsideAlertTypes.MEANOFTRANSPORT)
                        ))}
                    {activityOrRoute.secondaryActivity?.activityLabel && (
                        <Box className={classes.otherInfoLabel}>
                            {activityOrRoute.secondaryActivity.activityLabel}
                        </Box>
                    )}
                    {!activityOrRoute.isRoute &&
                        (activityOrRoute.place ? (
                            <Box className={classes.otherInfoLabel}>
                                {activityOrRoute.place.placeLabel}
                            </Box>
                        ) : (
                            renderInsideAlert(InsideAlertTypes.PLACE)
                        ))}
                    {activityOrRoute.withSomeone == null ? (
                        renderInsideAlert(InsideAlertTypes.WITHSOMEONE)
                    ) : (
                        <Box className={classes.otherInfoLabel}>{activityOrRoute.withSomeoneLabels}</Box>
                    )}
                    {activityOrRoute.withScreen == null ? (
                        renderInsideAlert(InsideAlertTypes.SCREEN)
                    ) : (
                        <Box className={classes.otherInfoLabel}>
                            {t("page.activity-planner.with-screen")}
                        </Box>
                    )}
                </Box>
                {onEdit && onDelete && (
                    <Box>
                        <MoreHorizIcon
                            className={classes.actionIcon}
                            onClick={onEditCard}
                            aria-label="editCardToggle"
                        ></MoreHorizIcon>
                        <Popover
                            id={id}
                            open={openPopOver}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            className={classes.popOver}
                        >
                            <Typography onClick={onEditIn} className={classes.clickableText}>
                                {t("common.navigation.edit")}
                            </Typography>
                            <Typography onClick={onDeleteIn} className={classes.clickableText}>
                                {t("common.navigation.delete")}
                            </Typography>
                        </Popover>
                    </Box>
                )}
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
        marginBottom: "0.25rem",
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
        width: "25px",
        maxHeight: "25px",
    },
    insideAlertText: {
        fontSize: "10px",
        color: theme.variables.alertActivity,
    },
    gapBox: {
        flexDirection: "column",
        alignItems: "center",
        border: "1px dashed",
        borderColor: theme.variables.alertActivity,
    },
    gapText: {
        color: theme.variables.alertActivity,
    },
    actionIcon: {
        cursor: "pointer",
        color: theme.palette.primary.light,
    },
    popOver: {
        "& .MuiPopover-paper": {
            backgroundColor: theme.variables.white,
            padding: "0.5rem",
        },
    },
    clickableText: {
        cursor: "pointer",
        "&:hover": {
            color: theme.palette.primary.light,
        },
    },
}));

export default ActivityOrRouteCard;
