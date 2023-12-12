import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import Box from "@mui/material/Box";
import PersonSunCloseIcon from "assets/illustration/card/person-sun-close.svg";
import PersonSunIcon from "assets/illustration/card/person-sun.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PourcentProgress from "components/edt/PourcentProgress/PourcentProgress";
import { StateSurveyEnum } from "enumerations/StateSurveyEnum";
import { useTranslation } from "react-i18next";
import { isMobile } from "service/responsive";
import { getQualityScore } from "service/summary-service";
import { getActivitiesOrRoutes, getScore } from "service/survey-activity-service";
import { getStatutSurvey, isDemoMode } from "service/survey-service";
import { isReviewer } from "service/user-service";

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

const getIsModeReviewer = () => {
    return isReviewer() && !isDemoMode();
};

const getClassClose = (isClose: boolean, classNameClose: any, classNameNotClose?: any) => {
    return isClose ? classNameClose : classNameNotClose ?? "";
};

const DayCard = (props: DayCardProps) => {
    const { labelledBy, describedBy, onClick, firstName, surveyDate, idSurvey, isClose, tabIndex } =
        props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const progressActivity = getScore(idSurvey, t);
    const modeReviewer = getIsModeReviewer();
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey);
    const qualityScore = getQualityScore(activitiesRoutesOrGaps, overlaps, t);
    const stateSurvey = getStatutSurvey(idSurvey);
    const isItMobile = isMobile();

    const getLeftBoxClass = () => {
        return modeReviewer
            ? isItMobile
                ? classes.leftReviewerBoxMobile
                : classes.leftReviewerBox
            : isItMobile
            ? classes.leftBoxMobile
            : classes.leftBox;
    };

    return (
        <FlexCenter key={"dayCard-flx" + tabIndex}>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={cx(classes.dayCardBox, getClassClose(isClose, classes.closeCardBox))}
                onClick={onClick}
                tabIndex={tabIndex}
                id={"dayCard-" + tabIndex}
            >
                <Box className={getLeftBoxClass()}>
                    <Box className={cx(classes.iconBox, getClassClose(isClose, classes.closeIconBox))}>
                        <img
                            src={isClose ? PersonSunCloseIcon : PersonSunIcon}
                            alt={
                                isClose
                                    ? t("accessibility.asset.card.person-sun-close-alt")
                                    : t("accessibility.asset.card.person-sun-alt")
                            }
                        />
                    </Box>
                    <Box className={classes.textBox}>
                        <Box id="surveyDate-text" className={classes.breakWordBox}>
                            {surveyDate}
                        </Box>
                        <Box id="firstName-text" className={classes.breakWordBox}>
                            {firstName}
                        </Box>
                    </Box>
                </Box>
                <Box
                    className={
                        modeReviewer
                            ? isItMobile
                                ? classes.scoreReviewerBoxMobile
                                : classes.scoreReviewerBox
                            : classes.scoreBox
                    }
                >
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
                    <Box
                        className={cx(
                            classes.progressBox,
                            isItMobile && modeReviewer ? classes.progressBoxReviewerMobile : "",
                        )}
                    >
                        <PourcentProgress
                            labelledBy={""}
                            describedBy={""}
                            progress={progressActivity}
                            isClose={isClose}
                        />
                    </Box>
                </Box>
                <Box
                    className={
                        modeReviewer ? (isItMobile ? classes.statusBoxMobile : classes.statusBox) : ""
                    }
                >
                    {modeReviewer &&
                        (stateSurvey == StateSurveyEnum.INIT ? (
                            <Box className={classes.statusInitBox}>
                                {t("page.reviewer-home.status-survey.init")}
                            </Box>
                        ) : (
                            <Box className={classes.statusProgressBox}>
                                {stateSurvey == StateSurveyEnum.VALIDATED
                                    ? t("page.reviewer-home.status-survey.validated")
                                    : t("page.reviewer-home.status-survey.locked")}
                            </Box>
                        ))}
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
    closeCardBox: {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.light,
        border: "1px solid ",
        borderColor: theme.palette.secondary.dark,
    },
    leftBox: {
        display: "flex",
        alignItems: "center",
        maxWidth: "100%",
        width: "100%",
    },
    leftReviewerBox: {
        display: "flex",
        alignItems: "center",
        maxWidth: "35%",
        width: "35%",
    },
    leftBoxMobile: {
        display: "flex",
        alignItems: "center",
        maxWidth: "100%",
        width: "100%",
    },
    leftReviewerBoxMobile: {
        maxWidth: "45%",
        width: "45%",
    },
    iconBox: {
        marginRight: "1rem",
    },
    textBox: {
        width: "90%",
    },
    closeIconBox: {
        color: theme.palette.secondary.main,
    },
    scoreReviewerBox: {
        display: "flex",
        justifyContent: "space-evenly",
        width: "45%",
    },
    scoreReviewerBoxMobile: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "27%",
    },
    scoreBox: {
        display: "flex",
        justifyContent: "space-between",
    },
    progressBox: {
        color: theme.palette.secondary.main,
    },
    progressBoxReviewerMobile: {
        width: "42%",
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
    statusProgressBox: {
        color: theme.palette.secondary.main,
        border: "2px solid " + theme.palette.secondary.main,
        padding: "0.5rem",
        borderRadius: "10px",
        width: "70%",
        minWidth: "92px",
    },
    statusInitBox: {
        color: theme.variables.white,
        backgroundColor: theme.palette.primary.main,
        border: "2px solid " + theme.palette.primary.main,
        padding: "0.5rem",
        borderRadius: "10px",
        width: "60%",
        minWidth: "92px",
    },
    statusBox: {
        width: "20%",
        display: "flex",
        justifyContent: "center",
    },
    statusBoxMobile: {
        width: "30%",
        display: "flex",
        justifyContent: "center",
    },
    breakWordBox: {
        overflowWrap: "anywhere",
    },
}));

export default DayCard;
