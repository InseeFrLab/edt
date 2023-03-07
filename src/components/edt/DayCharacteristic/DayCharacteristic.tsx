import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CommuteIcon from "@mui/icons-material/Commute";
import EventIcon from "@mui/icons-material/Event";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Divider, Popover, Typography } from "@mui/material";
import { UserActivitiesCharacteristics } from "interface/entity/ActivitiesSummary";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface DayCharacteristicsProps {
    userActivitiesCharacteristics?: UserActivitiesCharacteristics;
    onEdit?(): void;
}

const DayCharacteristics = (props: DayCharacteristicsProps) => {
    const { userActivitiesCharacteristics, onEdit } = props;
    const { classes } = useStyles();
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
                <h3 className={classes.title}>{t("component.day-characteristic.title")}</h3>
                <Box className={classes.editBox}>
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
                    </Popover>
                </Box>
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <AddCircleOutlineIcon />
                </Box>
                <Typography>{userActivitiesCharacteristics?.greatestActivityLabel}</Typography>
            </Box>
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <RemoveCircleOutlineIcon />
                </Box>
                <Typography>{userActivitiesCharacteristics?.worstActivityLabel}</Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <WorkIcon />
                </Box>
                <Typography>{userActivitiesCharacteristics?.kindOfDayLabel}</Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <EventIcon />
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
                    <CommuteIcon />
                </Box>
                <Typography>
                    {userActivitiesCharacteristics?.routeTimeLabel +
                        t("component.day-characteristic.travel-time")}
                </Typography>
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.rowBox}>
                <Box className={classes.iconBox}>
                    <PhoneAndroidIcon />
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
}));

export default DayCharacteristics;
