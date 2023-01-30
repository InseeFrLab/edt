import HelpIcon from "@mui/icons-material/Help";
import { Box, Button } from "@mui/material";
import logo from "assets/illustration/logo.png";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import DayCard from "components/edt/DayCard/DayCard";
import WeekCard from "components/edt/WeekCard/WeekCard";
import { makeStylesEdt } from "lunatic-edt";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getNavigatePath, getParameterizedNavigatePath } from "service/navigation-service";
import {
    activitySurveysIds,
    getPrintedFirstName,
    getPrintedSurveyDate,
    workingTimeSurveysIds,
} from "service/survey-service";

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { classes } = useStyles();

    const navWorkTime = useCallback(
        (idSurvey: string) => () =>
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, idSurvey)),
        [],
    );

    const navActivity = useCallback(
        (idSurvey: string) => () =>
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey)),
        [],
    );

    return (
        <>
            <Box className={classes.headerBox}>
                <Box className={classes.logoBox}>
                    <img
                        className={classes.logoImg}
                        src={logo}
                        alt={t("accessibility.asset.logo-alt")}
                    />
                </Box>
                <Box className={classes.helpBox}>
                    <Button
                        color="secondary"
                        startIcon={<HelpIcon />}
                        onClick={useCallback(
                            () => navigate(getNavigatePath(EdtRoutesNameEnum.HELP)),
                            [],
                        )}
                    >
                        {t("page.home.navigation.link-help-label")}
                    </Button>
                </Box>
            </Box>

            <Box className={classes.cardsBox}>
                <FlexCenter className={classes.spacing}>
                    <img src={reminder_note} alt={t("accessibility.asset.reminder-notes-alt")} />
                </FlexCenter>
                {activitySurveysIds.map(idSurvey => (
                    <DayCard
                        key={idSurvey + "-dayCard"}
                        labelledBy={""}
                        describedBy={""}
                        onClick={navActivity(idSurvey)}
                        firstName={getPrintedFirstName(idSurvey)}
                        surveyDate={getPrintedSurveyDate(idSurvey)}
                        idSurvey={idSurvey}
                    />
                ))}

                {workingTimeSurveysIds.map(idSurvey => (
                    <WeekCard
                        key={idSurvey + "-weekCard"}
                        labelledBy={""}
                        describedBy={""}
                        onClick={navWorkTime(idSurvey)}
                        firstName={getPrintedFirstName(idSurvey)}
                        surveyDate={getPrintedSurveyDate(idSurvey, EdtRoutesNameEnum.WORK_TIME)}
                        idSurvey={idSurvey}
                    />
                ))}
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: HomePage } })(() => ({
    cardsBox: {
        overflowY: "scroll",
        paddingBottom: "1rem",
    },
    logoBox: {
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
    },
    logoImg: {
        width: "40px",
    },
    helpBox: {
        paddingRight: "0.5rem",
    },
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "0.5rem",
    },
    spacing: {
        margin: "1rem",
    },
}));

export default HomePage;
