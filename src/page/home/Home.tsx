import { Button } from "@mui/material";
import "./Home.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import reminder_note from "assets/illustration/reminder-note.svg";

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="page home-page__container">
            <div className="center-image__container">
                <img src={reminder_note} alt={t("asset.reminder-notes-alt")} />
            </div>
            <header>{t("common.welcome")}</header>
            <Button color="primary" variant="contained">
                Test primary
            </Button>
            <Button color="secondary" variant="contained">
                Test secondary
            </Button>
        </div>
    );
};

export default Home;
