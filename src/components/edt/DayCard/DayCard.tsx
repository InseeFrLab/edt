import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import Box from "@mui/material/Box";
import { ReactComponent as PersonSunCloseIcon } from "assets/illustration/card/person-sun-close.svg";
import { ReactComponent as PersonSunIcon } from "assets/illustration/card/person-sun.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PourcentProgress from "components/edt/PourcentProgress/PourcentProgress";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { useTranslation } from "react-i18next";
import { isMobile } from "service/responsive";
import { getQualityScore } from "service/summary-service";
import { getActivitiesOrRoutes, getScore } from "service/survey-activity-service";
import { getStatutSurvey, isDemoMode } from "service/survey-state-service";
import { isReviewer } from "service/user-service";

interface DayCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
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

const getClassModePersist = (
    modeReviewer: boolean,
    classNameReviewer: any,
    classNameInterviewer: any,
) => {
    return modeReviewer ? classNameReviewer : classNameInterviewer;
};

const DayCard = (props: DayCardProps) => {
    const { labelledBy, describedBy, onClick, surveyDate, idSurvey, isClose, tabIndex } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const progressActivity = getScore(idSurvey, t);
    const modeReviewer = getIsModeReviewer();
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey);
    const qualityScore = getQualityScore(idSurvey, activitiesRoutesOrGaps, overlaps, t).group;
    const stateSurvey = getStatutSurvey(idSurvey);
    const isItMobile = isMobile();

    const getLeftBoxClassReviewer = () => {
        return isItMobile ? classes.leftReviewerBoxMobile : classes.leftReviewerBox;
    };

    const getLeftBoxClassInterviewer = () => {
        return isItMobile ? classes.leftBoxMobile : classes.leftBox;
    };

    const getLeftBoxClass = () => {
        return getClassModePersist(
            modeReviewer,
            getLeftBoxClassReviewer(),
            getLeftBoxClassInterviewer(),
        );
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
                        {isClose ? (
                            <PersonSunCloseIcon
                                aria-label={t("accessibility.asset.card.person-sun-close-alt")}
                            />
                        ) : (
                            <PersonSunIcon aria-label={t("accessibility.asset.card.person-sun-alt")} />
                        )}
                    </Box>
                    <Box className={classes.textBox}>
                        <Box id="surveyDate-text" className={classes.breakWordBox}>
                            {surveyDate}
                        </Box>
                    </Box>
                </Box>
                <Box
                    className={getClassModePersist(
                        modeReviewer,
                        isItMobile ? classes.scoreReviewerBoxMobile : classes.scoreReviewerBox,
                        classes.scoreBox,
                    )}
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
                            getClassModePersist(
                                isItMobile && modeReviewer,
                                classes.progressBoxReviewerMobile,
                                "",
                            ),
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
                    className={getClassModePersist(
                        modeReviewer,
                        isItMobile ? classes.statusBoxMobile : classes.statusBox,
                        "",
                    )}
                >
                    {modeReviewer &&
                        (stateSurvey == StateDataStateEnum.INIT ? (
                            <Box className={classes.statusInitBox}>
                                {t("page.reviewer-home.status-survey.init")}
                            </Box>
                        ) : (
                            <Box className={classes.statusProgressBox}>
                                {stateSurvey == StateDataStateEnum.VALIDATED
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
        textAlign: "center",
        minWidth: "67px",
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
