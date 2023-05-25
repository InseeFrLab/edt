import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Divider, Popover, Typography } from "@mui/material";
import addCircle from "assets/illustration/mui-icon/add-circle.svg";
import commute from "assets/illustration/mui-icon/commute.svg";
import event from "assets/illustration/mui-icon/event.svg";
import moreHorizontal from "assets/illustration/mui-icon/more-horizontal.svg";
import phoneAndroid from "assets/illustration/mui-icon/phone-android.svg";
import removeCircle from "assets/illustration/mui-icon/remove-circle.svg";
import work from "assets/illustration/mui-icon/work.svg";
import { UserActivitiesCharacteristics } from "interface/entity/ActivitiesSummary";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface DayCharacteristicsProps {
    userActivitiesCharacteristics?: UserActivitiesCharacteristics;
    onEdit?(): void;
}

const DayCharacteristics = (props: DayCharacteristicsProps) => {
    const { userActivitiesCharacteristics, onEdit } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-or-delete-popover" : undefined;

    const onEditIn = useCallback((e: React.MouseEvent) => {
        onEdit && onEdit();
        e.stopPropagation();
    }, []);

    const onEditCard = useCallback((e: React.MouseEvent) => {
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
                <Box className={classes.editBox}>
                    <img
                        src={moreHorizontal}
                        alt={t("accessibility.asset.mui-icon.more-horizontal")}
                        className={classes.actionIcon}
                        onClick={onEditCard}
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
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <img src={addCircle} alt={t("accessibility.asset.mui-icon.add-circle")} />
                </Box>
                <Typography>{userActivitiesCharacteristics?.greatestActivityLabel}</Typography>
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <img src={removeCircle} alt={t("accessibility.asset.mui-icon.remove-circle")} />
                </Box>
                <Typography>{userActivitiesCharacteristics?.worstActivityLabel}</Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <img src={work} alt={t("accessibility.asset.mui-icon.work")} />
                </Box>
                <Typography>{userActivitiesCharacteristics?.kindOfDayLabel}</Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <img src={event} alt={t("accessibility.asset.mui-icon.event")} />
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
                    <img src={commute} alt={t("accessibility.asset.mui-icon.commute")} />
                </Box>
                <Typography>
                    {userActivitiesCharacteristics?.routeTimeLabel +
                        t("component.day-characteristic.travel-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <img src={phoneAndroid} alt={t("accessibility.asset.mui-icon.phone-android")} />
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
