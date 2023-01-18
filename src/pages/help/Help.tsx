import { Box, Paper, Typography } from "@mui/material";
import iconNoResult from "assets/illustration/error/activity.svg";
import { ClickableList, makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import activites from "refs/activitesAutoCompleteRef.json";
import packageJson from "../../../package.json";

const HelpPage = () => {
    const { t } = useTranslation();
    const { classes } = useStyles();

    return (
        <>
            <header>Help - {t("page.home.welcome")}</header>
            <Box className={classes.clickableListBox}>
                <ClickableList
                    options={activites}
                    handleChange={() => console.log("handleChange")}
                    createActivity={() => console.log("createActivity")}
                    placeholder="Saisissez une activité"
                    notFoundLabel="Aucun résultat trouvé"
                    notFoundComment="Vous pourrez l'ajouter en cliquant sur le bouton ci-dessous, ou le bouton + ci-dessus"
                    addActivityButtonLabel="Ajouter l'activité"
                    iconNoResult={iconNoResult}
                    iconNoResultAlt="alt pour icon no result"
                ></ClickableList>
            </Box>

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
