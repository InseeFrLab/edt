import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button } from "@mui/material";
import install from "assets/illustration/install.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const InstallPage = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const understood = useCallback(() => {
        localStorage.setItem(LocalStorageVariableEnum.HAS_SEEN_INSTALL_SCREEN, "true");
        navigate("/");
    }, []);

    return (
        <Box className={classes.installBox}>
            <FlexCenter className={classes.illustrationBox}>
                <img src={install} alt={t("accessibility.asset.install-alt")} />
            </FlexCenter>
            <Box className={classes.textBox}>
                <h2>{t("page.install.title")}</h2>
                <p>{t("page.install.subtitle")}</p>
                <p>{t("page.install.info")}</p>
            </Box>
            <Box className={classes.actionsBox}>
                <Box className={classes.actionBox}>
                    <Button className={classes.button} variant="contained" onClick={understood}>
                        {t("page.install.continue")}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { InstallPage } })(theme => ({
    installBox: { padding: "1rem" },
    illustrationBox: {},
    textBox: { textAlign: "center" },
    actionsBox: { display: "flex", flexDirection: "column", alignItems: "center" },
    actionBox: { maxWidth: "300px", margin: "0.5rem 0", width: "90%" },
    button: { width: "100%", backgroundColor: theme.palette.text.primary },
}));

export default InstallPage;
