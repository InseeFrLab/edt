import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import Box from "@mui/material/Box";
import PersonSunCloseIcon from "assets/illustration/card/person-sun-close.svg";
import PersonSunIcon from "assets/illustration/card/person-sun.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PourcentProgress from "components/edt/PourcentProgress/PourcentProgress";
import { useTranslation } from "react-i18next";
import { getScore, getActivitiesOrRoutes, getStatutSurvey } from "service/survey-activity-service";
import { getQualityScore } from "service/summary-service";
import { isReviewer } from "service/user-service";
import { StateSurveyEnum } from "enumerations/StateSurveyEnum";

interface DayCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
    firstName: string;
    surveyDate: string;
    idSurvey: string;
    isClose: boolean;
    tabIndex: number;
}

const DayCard = (props: DayCardProps) => {
    const { labelledBy, describedBy, onClick, firstName, surveyDate, idSurvey, isClose, tabIndex } =
        props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const progressActivity = getScore(idSurvey, t);
    const modeReviewer = isReviewer();
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey);
    const qualityScore = getQualityScore(activitiesRoutesOrGaps, overlaps, t);
    const stateSurvey = getStatutSurvey(idSurvey);

    return (
        <FlexCenter>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={cx(classes.dayCardBox, isClose ? classes.closeCardBox : "")}
                onClick={onClick}
                tabIndex={tabIndex}
                id={"dayCard-" + tabIndex}
            >
                <Box className={classes.leftBox}>
                    <Box className={cx(classes.iconBox, isClose ? classes.closeIconBox : "")}>
                        <img
                            src={isClose ? PersonSunCloseIcon : PersonSunIcon}
                            alt={
                                isClose
                                    ? t("accessibility.asset.card.person-sun-close-alt")
                                    : t("accessibility.asset.card.person-sun-alt")
                            }
                        />
                    </Box>
                    <Box>
                        <Box id="surveyDate-text">{surveyDate}</Box>
                        <Box id="firstName-text">{firstName}</Box>
                    </Box>
                </Box>
                {modeReviewer && (
                    <Box className={classes.qualityScoreBox}>
                        <Box id="group-text" className={classes.qualityScoreText}>
                            {t("page.activity-summary.quality-score.label")}
                        </Box>
                        <Box id="group-score" className={classes.qualityScore}>
                            {qualityScore}
                        </Box>
                    </Box>
                )}
                <Box className={cx(classes.scoreBox)}>
                    <PourcentProgress
                        labelledBy={""}
                        describedBy={""}
                        progress={progressActivity}
                        isClose={isClose}
                    />
                </Box>
                {modeReviewer &&
                    (stateSurvey == StateSurveyEnum.INIT ? (
                        <Box className={classes.statusInitBox}>
                            {t("page.reviewer-home.status-survey.init")}
                        </Box>
                    ) : (
                        <Box className={classes.statusBox}>
                            {stateSurvey == StateSurveyEnum.VALIDATED
                                ? t("page.reviewer-home.status-survey.validated")
                                : t("page.reviewer-home.status-survey.locked")}
                        </Box>
                    ))}
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
    closeCardBox: {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.light,
        border: "1px solid ",
        borderColor: theme.palette.secondary.dark,
    },
    leftBox: {
        display: "flex",
        alignItems: "center",
        maxWidth: "35%",
        width: "35%",
    },
    iconBox: {
        marginRight: "1rem",
    },
    closeIconBox: {
        color: theme.palette.secondary.main,
    },
    scoreBox: {
        color: theme.palette.secondary.main,
        width: "7%",
    },
    qualityScoreBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    qualityScoreText: {
        color: theme.palette.secondary.main,
    },
    qualityScore: {
        fontWeight: "bold",
    },
    statusBox: {
        color: theme.palette.secondary.main,
        border: "2px solid " + theme.palette.secondary.main,
        padding: "0.5rem",
        borderRadius: "10px",
    },
    statusInitBox: {
        color: theme.variables.white,
        backgroundColor: theme.palette.primary.main,
        border: "2px solid " + theme.palette.primary.main,
        padding: "0.5rem",
        borderRadius: "10px",
    },
}));

export default DayCard;
