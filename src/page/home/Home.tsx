import { useTranslation } from "react-i18next";
import reminder_note from "assets/illustration/reminder-note.svg";
import "./Home.scss";

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="page home-page__container">
            <div className="center-image__container">
                <img src={reminder_note} alt={t("asset.reminder-notes-alt")} />
            </div>
            <header>{t("common.welcome")}</header>
        </div>
    );
};

export default Home;
