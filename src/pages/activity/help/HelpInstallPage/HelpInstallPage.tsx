import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Paper, Typography } from "@mui/material";
import install from "assets/illustration/install.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import packageJson from "../../../../../package.json";

const HelpInstallPage = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navToHelp = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_ACTIVITY));
    }, []);

    return (
        <Box>
            <Box className={classes.installBox}>
                <FlexCenter className={classes.illustrationBox}>
                    <img src={install} alt={t("accessibility.asset.mui-icon.download")} />
                </FlexCenter>
                <Box className={classes.textBox}>
                    <h2>{t("page.install.title")}</h2>
                    <p>{t("page.install.subtitle")}</p>
                    <p>{t("page.install.info")}</p>
                </Box>
                <Box className={classes.actionsBox}>
                    <Box className={classes.actionBox}>
                        <Button className={classes.button} variant="contained" onClick={navToHelp}>
                            {t("common.navigation.next")}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <br />
            <Paper className={classes.footerBox} component="footer" square variant="outlined">
                <Box>
                    <Typography variant="caption" color="initial">
                        <b>{t("common.version")}:</b> {packageJson.version} - {packageJson.dateVersion}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpInstallPage } })(theme => ({
    installBox: {
        padding: "1rem",
        height: "90vh",
    },
    illustrationBox: {},
    textBox: { textAlign: "center" },
    actionsBox: { display: "flex", flexDirection: "column", alignItems: "center" },
    actionBox: { maxWidth: "300px", margin: "0.5rem 0", width: "90%" },
    button: { width: "100%", backgroundColor: theme.palette.text.primary },
    footerBox: {
        height: "7vh",
        display: "flex",
        alignItems: "center",
        padding: "1rem",
    },
}));

export default HelpInstallPage;
