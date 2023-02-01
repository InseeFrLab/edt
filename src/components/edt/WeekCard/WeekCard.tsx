import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Box from "@mui/material/Box";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PourcentProgress from "components/edt/PourcentProgress/PourcentProgress";
import { makeStylesEdt } from "lunatic-edt";
import { getWeeklyPlannerScore } from "service/survey-activity-service";
interface WeekCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
    firstName: string;
    surveyDate: string;
    idSurvey: string;
}

const WeekCard = (props: WeekCardProps) => {
    const { labelledBy, describedBy, onClick, firstName, surveyDate, idSurvey } = props;
    const { classes } = useStyles();
    return (
        <FlexCenter>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={classes.weekCardBox}
                onClick={onClick}
            >
                <Box className={classes.leftBox}>
                    <Box className={classes.iconBox}>
                        <CalendarMonthOutlinedIcon />
                    </Box>
                    <Box>
                        <Box>{surveyDate}</Box>
                        <Box>{firstName}</Box>
                    </Box>
                </Box>
                <Box className={classes.scoreBox}>
                    <PourcentProgress
                        labelledBy={""}
                        describedBy={""}
                        progress={getWeeklyPlannerScore(idSurvey)}
                    />
                </Box>
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
    leftBox: {
        display: "flex",
        alignItems: "center",
    },
    iconBox: {
        marginRight: "1rem",
        color: theme.palette.primary.light,
    },
    scoreBox: {
        color: theme.palette.secondary.main,
    },
}));

export default WeekCard;
