import HelpIcon from "@mui/icons-material/Help";
import { Box, Button } from "@mui/material";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexEnd from "components/commons/FlexEnd/FlexEnd";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import PageIcon from "components/commons/PageIcon/PageIcon";
import DayCard from "components/edt/DayCard/DayCard";
import WeekCard from "components/edt/WeekCard/WeekCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutes";
import { getNavigatePath, getParameterizedNavigatePath } from "service/navigation-service";
import {
    activitySurveysIds,
    getFirstName,
    getSurveyDate,
    initializeDatas,
    workingTimeSurveysIds,
} from "service/survey-service";

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        initializeDatas()
            .then(() => setInitialized(true))
            .catch(err => console.error(err));
    }, []);

    return initialized ? (
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
                        firstName={getFirstName(idSurvey) || t("common.user.person") + " " + (index + 1)}
                        surveyDate={
                            getSurveyDate(idSurvey) || t("component.day-card.day") + " " + (index + 1)
                        }
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
                        firstName={getFirstName(idSurvey) || t("common.user.person") + " " + (index + 1)}
                        surveyDate={
                            getSurveyDate(idSurvey) || t("component.day-card.day") + " " + (index + 1)
                        }
                    />
                ))}
            </Box>
        </>
    ) : (
        <LoadingFull
            message={t("page.home.loading.message")}
            thanking={t("page.home.loading.thanking")}
        />
    );
};

export default HomePage;
