import Box from "@mui/material/Box";
import PersonSunIcon from "assets/illustration/card/person-sun.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PourcentProgress from "components/edt/PourcentProgress/PourcentProgress";
import { makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import { getScore } from "service/survey-activity-service";

interface DayCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
    firstName: string;
    surveyDate: string;
    idSurvey: string;
}

const DayCard = (props: DayCardProps) => {
    const { labelledBy, describedBy, onClick, firstName, surveyDate, idSurvey } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();
    const progressActivity = getScore(idSurvey, t);

    return (
        <FlexCenter>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={classes.dayCardBox}
                onClick={onClick}
            >
                <Box className={classes.leftBox}>
                    <Box className={classes.iconBox}>
                        <img src={PersonSunIcon} alt={t("accessibility.asset.card.person-sun-alt")} />
                    </Box>
                    <Box>
                        <Box>{surveyDate}</Box>
                        <Box>{firstName}</Box>
                    </Box>
                </Box>
                <Box className={classes.scoreBox}>
                    <PourcentProgress labelledBy={""} describedBy={""} progress={progressActivity} />
                </Box>
            </Box>
        </FlexCenter>
    );
};

const useStyles = makeStylesEdt({ "name": { DayCard } })(theme => ({
    dayCardBox: {
        width: "90%",
        maxWidth: "800px",
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.main,
        marginTop: "1rem",
        cursor: "pointer",
    },
    leftBox: {
        display: "flex",
        alignItems: "center",
    },
    iconBox: {
        marginRight: "1rem",
    },
    scoreBox: {
        color: theme.palette.secondary.main,
    },
}));

export default DayCard;
