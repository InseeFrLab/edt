import HelpIcon from "@mui/icons-material/Help";
import { Box, Button } from "@mui/material";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexEnd from "components/commons/FlexEnd/FlexEnd";
import PageIcon from "components/commons/PageIcon/PageIcon";
import DayCard from "components/edt/DayCard/DayCard";
import WeekCard from "components/edt/WeekCard/WeekCard";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutes";
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

    return (
        <>
            <FlexEnd>
                <Button
                    color="secondary"
                    startIcon={<HelpIcon />}
                    onClick={() => navigate(getNavigatePath(EdtRoutesNameEnum.HELP))}
                >
                    {t("page.home.navigation.link-help-label")}
                </Button>
            </FlexEnd>
            <Box>
                <PageIcon
                    srcIcon={reminder_note}
                    altIcon={t("accessibility.asset.reminder-notes-alt")}
                />
                {activitySurveysIds.map((idSurvey, index) => (
                    <DayCard
                        key={idSurvey + "-dayCard"}
                        labelledBy={""}
                        describedBy={""}
                        onClick={() =>
                            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey))
                        }
                        firstName={getPrintedFirstName(idSurvey)}
                        surveyDate={getPrintedSurveyDate(idSurvey)}
                    />
                ))}

                {workingTimeSurveysIds.map((idSurvey, index) => (
                    <WeekCard
                        key={idSurvey + "-weekCard"}
                        labelledBy={""}
                        describedBy={""}
                        onClick={() =>
                            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, idSurvey))
                        }
                        firstName={getPrintedFirstName(idSurvey)}
                        surveyDate={getPrintedSurveyDate(idSurvey)}
                    />
                ))}
            </Box>
        </>
    );
};

export default HomePage;
