import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";

const HelpPage = () => {
    const { t } = useTranslation();
    const { classes } = useStyles();
    const navigate = useNavigate();

    return (
        <>
            <header>Help - Page temporaire</header>
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
