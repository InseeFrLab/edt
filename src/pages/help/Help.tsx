import { Box, Button, Paper, Typography } from "@mui/material";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { SurveyData } from "interface/entity/Api";
import { makeStylesEdt } from "lunatic-edt";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { remotePutSurveyData } from "service/api-service";
import { lunaticDatabase } from "service/lunatic-database";
import { surveysIds } from "service/survey-service";
import packageJson from "../../../package.json";

const HelpPage = () => {
    const { t } = useTranslation();
    const { classes } = useStyles();

    const resetDataAndReload = useCallback(() => {
        const promises: any[] = [];
        surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS].forEach(idSurvey => {
            const surveyData: SurveyData = {
                stateData: { state: null, date: 0, currentPage: 1 },
                data: {},
            };
            promises.push(remotePutSurveyData(idSurvey, surveyData));
        });
        Promise.all(promises).then(() => {
            lunaticDatabase.clear().then(() => {
                window.location.href = window.location.origin;
            });
        });
    }, []);

    return (
        <>
            <header>Help - Page temporaire</header>
            <br />
            <Button variant="contained" onClick={resetDataAndReload}>
                Supprimer les données et recharger
            </Button>
            <br />
            <Paper className={classes.footerBox} component="footer" square variant="outlined">
                <Box>
                    <Typography variant="caption" color="initial">
                        <b>{t("common.version")}:</b> {packageJson.version} - {packageJson.dateVersion}
                    </Typography>
                </Box>
            </Paper>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpPage } })(() => ({
    clickableListBox: {
        height: "90vh",
    },
    footerBox: {
        height: "7vh",
        display: "flex",
        alignItems: "center",
        padding: "1rem",
    },
}));

export default HelpPage;
