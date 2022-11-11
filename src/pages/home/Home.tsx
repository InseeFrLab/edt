import HelpIcon from "@mui/icons-material/Help";
import { Box, Button } from "@mui/material";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FlexEnd from "components/commons/FlexEnd/FlexEnd";
import DayCard from "components/edt/DayCard/DayCard";
import WeekCard from "components/edt/WeekCard/WeekCard";
import { makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EdtRoutesNameEnum, getNavigatePath } from "routes/EdtRoutes";

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
                    onClick={() => navigate(getNavigatePath(EdtRoutesNameEnum.HELP))}
                >
                    {t("page.home.navigation.link-help-label")}
                </Button>
            </FlexEnd>
            <Box>
                <FlexCenter className={classes.spacing}>
                    <img src={reminder_note} alt={t("accessibility.asset.reminder-notes-alt")} />
                </FlexCenter>
                <DayCard
                    labelledBy={""}
                    describedBy={""}
                    onClick={() => navigate(getNavigatePath(EdtRoutesNameEnum.ACTIVITY))}
                />
                <DayCard
                    labelledBy={""}
                    describedBy={""}
                    onClick={() => navigate(getNavigatePath(EdtRoutesNameEnum.ACTIVITY))}
                />
                <DayCard
                    labelledBy={""}
                    describedBy={""}
                    onClick={() => navigate(getNavigatePath(EdtRoutesNameEnum.ACTIVITY))}
                />
                <WeekCard labelledBy={""} describedBy={""} onClick={() => console.log("weekCard")} />
                <WeekCard labelledBy={""} describedBy={""} onClick={() => console.log("weekCard")} />
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { HomePage } })(() => ({
    spacing: {
        margin: "2rem 0",
    },
}));

export default HomePage;
