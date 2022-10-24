import CodeIcon from "@mui/icons-material/Code";
import HelpIcon from "@mui/icons-material/Help";
import { Button } from "@mui/material";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FlexEnd from "components/commons/FlexEnd/FlexEnd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <>
            <FlexEnd>
                <Button startIcon={<HelpIcon />} onClick={() => navigate("/help")}>
                    {t("home-page.navigation.link-help-label")}
                </Button>
                {/* DEV : this will be removed */}
                <Button startIcon={<CodeIcon />} onClick={() => navigate("/orchestrator")}>
                    Orchestrator
                </Button>
                <Button startIcon={<CodeIcon />} onClick={() => navigate("/activity")}>
                    Activity
                </Button>
                <Button startIcon={<CodeIcon />} onClick={() => navigate("/who-are-you")}>
                    Who are you
                </Button>
            </FlexEnd>
            <div>
                <FlexCenter>
                    <img src={reminder_note} alt={t("asset.reminder-notes-alt")} />
                </FlexCenter>
                <header>{t("home-page.welcome")}</header>
            </div>
        </>
    );
};

export default HomePage;
