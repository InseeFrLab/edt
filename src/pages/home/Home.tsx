import HelpIcon from "@mui/icons-material/Help";
import { Box, Button } from "@mui/material";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexEnd from "components/commons/FlexEnd/FlexEnd";
import PageIcon from "components/commons/PageIcon/PageIcon";
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

    return (
        <>
            <FlexEnd>
                <Button
                    color="secondary"
                    startIcon={<HelpIcon />}
                    onClick={useCallback(() => navigate(getNavigatePath(EdtRoutesNameEnum.HELP)), [])}
                >
                    {t("page.home.navigation.link-help-label")}
                </Button>
            </FlexEnd>
            <Box className={classes.cardsBox}>
                <PageIcon
                    srcIcon={reminder_note}
                    altIcon={t("accessibility.asset.reminder-notes-alt")}
                />
                {activitySurveysIds.map(idSurvey => (
                    <DayCard
                        key={idSurvey + "-dayCard"}
                        labelledBy={""}
                        describedBy={""}
                        onClick={useCallback(
                            () =>
                                navigate(
                                    getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey),
                                ),
                            [],
                        )}
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
                        onClick={useCallback(
                            () =>
                                navigate(
                                    getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, idSurvey),
                                ),
                            [],
                        )}
                        firstName={getPrintedFirstName(idSurvey)}
                        surveyDate={getPrintedSurveyDate(idSurvey, EdtRoutesNameEnum.WORK_TIME)}
                    />
                ))}
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: HomePage } })(() => ({
    cardsBox: {
        overflowY: "scroll",
        paddingBottom: "6rem",
    },
}));

export default HomePage;
