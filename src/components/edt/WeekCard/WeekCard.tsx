import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import Box from "@mui/material/Box";
import calendarMonth from "assets/illustration/mui-icon/calendar-month.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";
interface WeekCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
    firstName: string;
    surveyDate: string;
    idSurvey: string;
    isClose: boolean;
    tabIndex: number;
}

const WeekCard = (props: WeekCardProps) => {
    const { labelledBy, describedBy, onClick, firstName, surveyDate, isClose, tabIndex } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    return (
        <FlexCenter>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={cx(classes.weekCardBox, isClose ? classes.closeCardBox : "")}
                onClick={onClick}
                tabIndex={tabIndex}
            >
                <Box className={classes.leftBox}>
                    <Box className={cx(classes.iconBox, isClose ? classes.closeIconBox : "")}>
                        <img
                            src={calendarMonth}
                            alt={t("accessibility.asset.mui-icon.calendar-month")}
                        />
                    </Box>
                    <Box>
                        <Box>{surveyDate}</Box>
                        <Box>{firstName}</Box>
                    </Box>
                </Box>
                <Box className={classes.scoreBox}></Box>
            </Box>
        </FlexCenter>
    );
};

const useStyles = makeStylesEdt({ "name": { WeekCard } })(theme => ({
    weekCardBox: {
        width: "90%",
        maxWidth: "800px",
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.light,
        marginTop: "1rem",
        cursor: "pointer",
    },
    closeCardBox: {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.light,
        border: "1px solid ",
        borderColor: theme.palette.secondary.dark,
    },
    leftBox: {
        display: "flex",
        alignItems: "center",
    },
    iconBox: {
        marginRight: "1rem",
        color: theme.palette.primary.light,
    },
    closeIconBox: {
        color: theme.palette.secondary.main,
    },
    scoreBox: {
        color: theme.palette.secondary.main,
    },
}));

export default WeekCard;
