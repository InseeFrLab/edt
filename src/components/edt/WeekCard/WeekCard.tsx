import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import Box from "@mui/material/Box";
import calendarMonth from "assets/illustration/mui-icon/calendar-month.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";
import { isMobile } from "service/responsive";
import { isDemoMode } from "service/survey-service";
import { isReviewer } from "service/user-service";

interface WeekCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
    firstName: string;
    surveyDate: string;
    isClose: boolean;
    tabIndex: number;
}

const WeekCard = (props: WeekCardProps) => {
    const { labelledBy, describedBy, onClick, firstName, surveyDate, isClose, tabIndex } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const modeReviewer = isReviewer() && !isDemoMode();
    const isItMobile = isMobile();

    const getLeftBoxClassInterviewer = () => {
        return isItMobile ? classes.leftBoxMobile : classes.leftBox;
    };

    const getLeftBoxClassReviewer = () => {
        return isItMobile ? classes.leftReviewerBoxMobile : classes.leftReviewerBox;
    };

    const getLeftBoxClass = () => {
        return modeReviewer ? getLeftBoxClassReviewer() : getLeftBoxClassInterviewer();
    };

    return (
        <FlexCenter key={"weekCard-flex-" + tabIndex}>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={cx(classes.weekCardBox, isClose ? classes.closeCardBox : "")}
                onClick={onClick}
                tabIndex={tabIndex}
                id={"weekCard-" + tabIndex}
            >
                <Box className={getLeftBoxClass()}>
                    <Box className={cx(classes.iconBox, isClose ? classes.closeIconBox : "")}>
                        <img
                            src={calendarMonth}
                            alt={t("accessibility.asset.mui-icon.calendar-month")}
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
                    <Box
                        className={cx(
                            classes.progressBox,
                            isItMobile && modeReviewer ? classes.progressBoxReviewerMobile : "",
                        )}
                    ></Box>
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
        color: theme.palette.primary.light,
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

export default WeekCard;
