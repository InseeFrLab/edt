import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Divider, Popover, Typography } from "@mui/material";
import { ReactComponent as AddCircleIcon } from "assets/illustration/mui-icon/add-circle.svg";
import { ReactComponent as CommuteIcon } from "assets/illustration/mui-icon/commute.svg";
import { ReactComponent as EventIcon } from "assets/illustration/mui-icon/event.svg";
import { ReactComponent as MoreHorizontalImage } from "assets/illustration/mui-icon/more-horizontal.svg";
import { ReactComponent as PhoneAndroidIcon } from "assets/illustration/mui-icon/phone-android.svg";
import { ReactComponent as RemoveCircleIcon } from "assets/illustration/mui-icon/remove-circle.svg";
import { ReactComponent as WorkIcon } from "assets/illustration/mui-icon/work.svg";
import { UserActivitiesCharacteristics } from "interface/entity/ActivitiesSummary";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface DayCharacteristicsProps {
    userActivitiesCharacteristics?: UserActivitiesCharacteristics;
    onEdit?(): void;
    modifiable?: boolean;
}

const DayCharacteristics = (props: DayCharacteristicsProps) => {
    const { userActivitiesCharacteristics, onEdit, modifiable = true } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-or-delete-popover" : undefined;

    const onEditIn = useCallback((e: React.MouseEvent) => {
        onEdit?.();
        e.stopPropagation();
    }, []);

    const onEditCard = useCallback((e: any) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget as HTMLButtonElement);
    }, []);

    const handleClose = useCallback(
        (e: React.MouseEvent) => {
            setAnchorEl(null);
            e.stopPropagation();
        },
        [anchorEl],
    );

    return (
        <Box className={classes.dayCharacteristicBox}>
            <Box className={classes.headerRow}>
                <h2 className={cx(classes.title, classes.h2)}>
                    {t("component.day-characteristic.title")}
                </h2>
                {onEdit && modifiable && (
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
                        </Popover>
                    </Box>
                )}
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <AddCircleIcon aria-label={t("accessibility.asset.mui-icon.add-circle")} />
                </Box>
                <Typography>{userActivitiesCharacteristics?.greatestActivityLabel}</Typography>
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <RemoveCircleIcon aria-label={t("accessibility.asset.mui-icon.remove-circle")} />
                </Box>
                <Typography>{userActivitiesCharacteristics?.worstActivityLabel}</Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <WorkIcon aria-label={t("accessibility.asset.mui-icon.work")} />
                </Box>
                <Typography>{userActivitiesCharacteristics?.kindOfDayLabel}</Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <EventIcon aria-label={t("accessibility.asset.mui-icon.event")} />
                </Box>
                <Typography>
                    {userActivitiesCharacteristics?.isExceptionalDay
                        ? t("component.day-characteristic.exceptional-day")
                        : t("component.day-characteristic.normal-day")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <CommuteIcon aria-label={t("accessibility.asset.mui-icon.commute")} />
                </Box>
                <Typography>
                    {userActivitiesCharacteristics?.routeTimeLabel +
                        t("component.day-characteristic.travel-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <PhoneAndroidIcon aria-label={t("accessibility.asset.mui-icon.phone-android")} />
                </Box>
                <Typography>
                    {userActivitiesCharacteristics?.phoneTimeLabel +
                        t("component.day-characteristic.phone-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <Typography>{userActivitiesCharacteristics?.userMarkLabel}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { DayCharacteristics } })(theme => ({
    dayCharacteristicBox: {
        width: "300px",
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.main,
        marginTop: "1rem",
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
    editBox: {
        marginLeft: "auto",
    },
    headerRow: {
        display: "flex",
    },
    rowBox: {
        display: "flex",
        color: theme.palette.text.primary,
        padding: "0.25rem 0",
        alignItems: "center",
    },
    iconBox: {
        marginRight: "1rem",
        color: theme.palette.primary.main,
    },
    title: {
        marginTop: 0,
    },
    h2: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
}));

export default DayCharacteristics;
