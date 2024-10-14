import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Divider, Popover, Typography } from "@mui/material";
import activityErrorIconSvg from "../../../assets/illustration/error/activity.svg?react";
import locationErrorIconSvg from "../../../assets/illustration/error/location.svg?react";
import meanOfTransportErrorIconSvg from "../../../assets/illustration/error/mean-of-transport.svg?react";
import peopleErrorIconSvg from "../../../assets/illustration/error/people.svg?react";
import routeErrorIconSvg from "../../../assets/illustration/error/route.svg?react";
import screenErrorIconSvg from "../../../assets/illustration/error/screen.svg?react";
import MoreHorizontalImage from "../../../assets/illustration/mui-icon/more-horizontal.svg?react";
import { InsideAlertTypes } from "../../../enumerations/InsideAlertTypesEnum";
import { ActivityRouteOrGap } from "../../../interface/entity/ActivityRouteOrGap";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { EdtRoutesNameEnum } from "../../../routes/EdtRoutesMapping";
import { filtrePage } from "../../../service/loop-service";
import Icon from "../Icon/Icon";

interface ActivityOrRouteCardProps {
    labelledBy: string;
    describedBy: string;
    onClick?(idSurvey?: any, source?: any): void;
    onClickGap?(startTime: string | undefined, endTime: string | undefined): void;
    activityOrRoute: ActivityRouteOrGap;
    onEdit?(idSurvey?: any, source?: any): void;
    onDelete?(idSurvey?: any, source?: any): void;
    helpStep?: number;
    tabIndex?: number;
    modifiable?: boolean;
}

const renderMeanOfTransport = (
    activityOrRoute: ActivityRouteOrGap,
    classes: Record<string, string>,
    renderInsideAlert: (type: InsideAlertTypes) => JSX.Element,
) => {
    return (
        activityOrRoute.isRoute &&
        (activityOrRoute.meanOfTransportLabels ? (
            <Box className={classes.otherInfoLabel}>{activityOrRoute.meanOfTransportLabels}</Box>
        ) : (
            renderInsideAlert(InsideAlertTypes.MEANOFTRANSPORT)
        ))
    );
};

const renderPlace = (
    activityOrRoute: ActivityRouteOrGap,
    classes: Record<string, string>,
    renderInsideAlert: (type: InsideAlertTypes) => JSX.Element,
) => {
    const sectionFiltrer = filtrePage(
        EdtRoutesNameEnum.ACTIVITY_LOCATION,
        activityOrRoute.activity?.activityCode ?? "",
    );

    return (
        !sectionFiltrer &&
        !activityOrRoute.isRoute &&
        (activityOrRoute.place ? (
            <Box className={classes.otherInfoLabel}>{activityOrRoute.place.placeLabel}</Box>
        ) : (
            renderInsideAlert(InsideAlertTypes.PLACE)
        ))
    );
};

const renderWithSomeone = (
    activityOrRoute: ActivityRouteOrGap,
    classes: Record<string, string>,
    renderInsideAlert: (type: InsideAlertTypes) => JSX.Element,
    t: TFunction<"translation", undefined>,
) => {
    const withSomeoneLabel =
        activityOrRoute.withSomeoneLabels != null && activityOrRoute.withSomeoneLabels ? (
            <Box className={classes.otherInfoLabel}>{activityOrRoute.withSomeoneLabels}</Box>
        ) : (
            renderInsideAlert(InsideAlertTypes.WITHSOMEONE)
        );

    const isWithSecondaryActivity = activityOrRoute.withSomeone ? (
        withSomeoneLabel
    ) : (
        <Box className={classes.otherInfoLabel}>{t("page.activity-planner.alone")}</Box>
    );

    const sectionFiltrer = filtrePage(
        EdtRoutesNameEnum.WITH_SOMEONE,
        activityOrRoute.activity?.activityCode ?? "",
    );

    return (
        !sectionFiltrer &&
        (activityOrRoute.withSomeone == null
            ? renderInsideAlert(InsideAlertTypes.WITHSOMEONE)
            : isWithSecondaryActivity)
    );
};

const renderSecondaryActivity = (
    activityOrRoute: ActivityRouteOrGap,
    classes: Record<string, string>,
    renderInsideAlert: (type: InsideAlertTypes) => JSX.Element,
    t: TFunction<"translation", undefined>,
) => {
    const hasLabel = activityOrRoute.secondaryActivity?.activityLabel ? (
        <Box className={classes.otherInfoLabel}>{activityOrRoute.secondaryActivity.activityLabel}</Box>
    ) : (
        renderInsideAlert(InsideAlertTypes.SECONDARYACTIVITY)
    );

    const isWithSecondaryActivity = activityOrRoute.withSecondaryActivity ? (
        hasLabel
    ) : (
        <Box className={classes.otherInfoLabel}>
            {t("page.activity-planner.without-secondary-activity")}
        </Box>
    );

    const sectionFiltrer = filtrePage(
        EdtRoutesNameEnum.SECONDARY_ACTIVITY,
        activityOrRoute.activity?.activityCode ?? "",
    );

    return (
        !sectionFiltrer &&
        (activityOrRoute.withSecondaryActivity == null
            ? renderInsideAlert(InsideAlertTypes.SECONDARYACTIVITY)
            : isWithSecondaryActivity)
    );
};

const renderWithScreen = (
    activityOrRoute: ActivityRouteOrGap,
    classes: Record<string, string>,
    renderInsideAlert: (type: InsideAlertTypes) => JSX.Element,
    t: TFunction<"translation", undefined>,
) => {
    const withScreenLabel = activityOrRoute.withScreen
        ? t("page.activity-planner.with-screen")
        : t("page.activity-planner.without-screen");

    const sectionFiltrer = filtrePage(
        EdtRoutesNameEnum.WITH_SCREEN,
        activityOrRoute.activity?.activityCode ?? "",
    );

    return (
        !sectionFiltrer &&
        (activityOrRoute.withScreen == null ? (
            renderInsideAlert(InsideAlertTypes.SCREEN)
        ) : (
            <Box className={classes.otherInfoLabel}>{withScreenLabel}</Box>
        ))
    );
};

const ActivityOrRouteCard = (props: ActivityOrRouteCardProps) => {
    const {
        labelledBy,
        describedBy,
        onClick,
        onClickGap,
        activityOrRoute,
        onEdit,
        onDelete,
        helpStep,
        tabIndex,
        modifiable = true,
    } = props;
    const { t } = useTranslation();
    const { classes, cx } = useStyles();
    const insideAlertLabels = {
        [InsideAlertTypes.ACTIVITY]: {
            icon: activityErrorIconSvg,
            altIcon: t("accessibility.asset.insideAlerts.activity-error-alt"),
            label: t("page.activity-planner.no-activity"),
        },
        [InsideAlertTypes.ROUTE]: {
            icon: routeErrorIconSvg,
            altIcon: t("accessibility.asset.insideAlerts.route-error-alt"),
            label: t("page.activity-planner.no-route"),
        },
        [InsideAlertTypes.PLACE]: {
            icon: locationErrorIconSvg,
            altIcon: t("accessibility.asset.insideAlerts.place-error-alt"),
            label: t("page.activity-planner.no-place"),
        },
        [InsideAlertTypes.MEANOFTRANSPORT]: {
            icon: meanOfTransportErrorIconSvg,
            altIcon: t("accessibility.asset.insideAlerts.mean-of-transport-error-alt"),
            label: t("page.activity-planner.no-mean-of-transport"),
        },
        [InsideAlertTypes.SECONDARYACTIVITY]: {
            icon: activityErrorIconSvg,
            altIcon: t("accessibility.asset.insideAlerts.secondary-activity-error-alt"),
            label: t("page.activity-planner.no-secondary-activity"),
        },
        [InsideAlertTypes.WITHSOMEONE]: {
            icon: peopleErrorIconSvg,
            altIcon: t("accessibility.asset.insideAlerts.someone-error-alt"),
            label: t("page.activity-planner.no-with-someone"),
        },
        [InsideAlertTypes.SCREEN]: {
            icon: screenErrorIconSvg,
            altIcon: t("accessibility.asset.insideAlerts.screen-error-alt"),
            label: t("page.activity-planner.no-screen"),
        },
    };

    const gapLabels = {
        main: t("page.activity-planner.gap-main"),
        secondary: t("page.activity-planner.gap-secondary"),
    };

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-or-delete-popover" : undefined;

    const handleClose = useCallback(
        (e: React.MouseEvent) => {
            setAnchorEl(null);
            e.stopPropagation();
        },
        [anchorEl],
    );

    const onEditIn = useCallback((e: React.MouseEvent) => {
        onEdit?.();
        e.stopPropagation();
    }, []);

    const onDeleteIn = useCallback((e: React.MouseEvent) => {
        onDelete?.();
        e.stopPropagation();
    }, []);

    const renderInsideAlert = (type: InsideAlertTypes) => {
        return (
            <Box className={classes.insideAlertBox}>
                <Icon
                    icon={insideAlertLabels[type].icon}
                    alt={insideAlertLabels[type].altIcon}
                    className={classes.insideAlertIcon}
                />
                <Typography className={classes.insideAlertText}>
                    {" "}
                    {insideAlertLabels[type].label}{" "}
                </Typography>
            </Box>
        );
    };

    const onEditCard = useCallback((e: any) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget as HTMLButtonElement);
    }, []);

    const renderActivityOrRoute = (index?: number) => {
        return (
            <Box
                className={cx(classes.mainCardBox, classes.activityCardBox)}
                onClick={onClick}
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                tabIndex={index}
                id={"activityOrRouteCard-" + index}
            >
                <Box className={classes.timeBox}>
                    <Box className={classes.hour}>{activityOrRoute.startTime}</Box>
                    <Box>{activityOrRoute.durationLabel}</Box>
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
                        !activityOrRoute.route?.routeCode &&
                        renderInsideAlert(InsideAlertTypes.ROUTE)}
                    {!activityOrRoute.isRoute &&
                        !activityOrRoute.activity?.activityLabel &&
                        renderInsideAlert(InsideAlertTypes.ACTIVITY)}
                    {renderMeanOfTransport(activityOrRoute, classes, renderInsideAlert)}
                    {renderSecondaryActivity(activityOrRoute, classes, renderInsideAlert, t)}
                    {renderPlace(activityOrRoute, classes, renderInsideAlert)}
                    {renderWithSomeone(activityOrRoute, classes, renderInsideAlert, t)}
                    {renderWithScreen(activityOrRoute, classes, renderInsideAlert, t)}
                </Box>
                {onEdit && onDelete && modifiable && (
                    <Box className={classes.editBox} onClick={onEditCard} onKeyUp={onEditCard}>
                        <MoreHorizontalImage
                            className={classes.actionIcon}
                            aria-label="editCardToggle"
                        />
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

    const clickToGap = useCallback(() => {
        onClickGap && modifiable && onClickGap(activityOrRoute.startTime, activityOrRoute.endTime);
    }, []);

    const renderGap = () => {
        return (
            <Box
                className={cx(classes.mainCardBox, helpStep == 2 ? classes.gapHelpBox : classes.gapBox)}
                onClick={clickToGap}
            >
                <Typography
                    className={cx(
                        classes.mainActivityLabel,
                        helpStep == 2 ? classes.gapHelpText : classes.gapText,
                    )}
                >
                    {gapLabels.main}
                </Typography>
                <Typography
                    className={cx(
                        classes.otherInfoLabel,
                        helpStep == 2 ? classes.gapHelpText : classes.gapText,
                    )}
                >
                    {gapLabels.secondary}
                </Typography>
                <Button
                    className={helpStep == 2 ? classes.addActivityButtonHelp : classes.addActivityButton}
                    variant="contained"
                    onClick={clickToGap}
                    disabled={!modifiable}
                >
                    {t("common.navigation.add")}
                </Button>
            </Box>
        );
    };

    return activityOrRoute.isGap ? renderGap() : renderActivityOrRoute(tabIndex);
};

const useStyles = makeStylesEdt({ "name": { ActivityOrRouteCard } })(theme => ({
    mainCardBox: {
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        cursor: "pointer",
        width: "300px",
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
        fontSize: "12px",
        color: theme.variables.alertActivity,
    },
    gapBox: {
        flexDirection: "column",
        alignItems: "center",
        border: "1px dashed",
        borderColor: theme.variables.alertActivity,
    },
    gapHelpBox: {
        flexDirection: "column",
        alignItems: "center",
        border: "1px dashed",
        borderColor: theme.variables.white,
        zIndex: "1400",
        position: "relative",
        pointerEvents: "none",
        backgroundColor: "#707070",
    },
    gapText: {
        color: theme.variables.alertActivity,
    },
    gapHelpText: {
        color: theme.variables.white,
    },
    actionIcon: {
        cursor: "pointer",
        color: theme.palette.primary.light,
    },
    popOver: {
        "& .MuiPopover-paper": {
            backgroundColor: theme.variables.white,
            padding: "0.2rem",
        },
        top: "-132px",
    },
    clickableText: {
        cursor: "pointer",
        "&:hover": {
            color: theme.palette.primary.light,
        },
    },
    editBox: {
        marginLeft: "auto",
    },
    addActivityButton: {
        marginTop: "0.5rem",
        backgroundColor: theme.variables.alertActivity,
        "&:hover": {
            backgroundColor: theme.variables.alertActivity + "99",
        },
    },
    addActivityButtonHelp: {
        marginTop: "0.5rem",
        backgroundColor: "#FBE7E2",
        color: theme.variables.alertActivity,
        "&:hover": {
            backgroundColor: theme.variables.alertActivity,
        },
    },
}));

export default ActivityOrRouteCard;
