import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CommuteIcon from "@mui/icons-material/Commute";
import EventIcon from "@mui/icons-material/Event";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Divider, Typography } from "@mui/material";
import { UserActivitiesCharacteristics } from "interface/entity/ActivitiesSummary";
import { useTranslation } from "react-i18next";

interface DayCharacteristicsProps {
    userActivitiesCharacteristics?: UserActivitiesCharacteristics;
}

const DayCharacteristics = (props: DayCharacteristicsProps) => {
    const { userActivitiesCharacteristics } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={classes.dayCharacteristicBox}>
            <h3 className={classes.title}>{t("component.day-characteristic.title")}</h3>
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
