import ErrorPage from "./ErrorPage";
import FlexCenter from "../../components/commons/FlexCenter/FlexCenter";
import { Box, Button, Typography } from "@mui/material";
import HomeIcon from "../../assets/illustration/mui-icon/home.svg?react";
import { useTranslation } from "react-i18next";
import DefaultErrorIcon from "../../assets/illustration/error/error.svg?react";
import PowerSettingsIcon from "../../assets/illustration/mui-icon/power-settings-white.svg?react";
import PageIcon from "../../components/commons/PageIcon/PageIcon";
import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { navToHome } from "../../service/navigation-service";
import { useAuth } from "../../hooks/useAuth.ts";

const ErrorProvider = () => {
    const { t } = useTranslation();
    const { classes } = useStyles();
    const { logout, username } = useAuth();

    return (
        <>
            <PageIcon icon={<DefaultErrorIcon aria-label={t("accessibility.asset.error.default")} />} />
            <Box className={classes.textBox}>
                <Typography>{t("common.error.error-default-title")}</Typography>
                <br />
                <Typography>{t("common.error.error-default")}</Typography>
                <br />
                <Typography>{t("common.error.error-user-info") + username}</Typography>
            </Box>

            <FlexCenter>
                <Box className={classes.buttonBox}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={
                            <HomeIcon aria-label={t("accessibility.asset.mui-icon.power-settings")} />
                        }
                        onClick={navToHome}
                    >
                        {t("common.navigation.back-to-home")}
                    </Button>
                </Box>
                <Box className={classes.buttonBox}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        startIcon={
                            <PowerSettingsIcon
                                aria-label={t("accessibility.asset.mui-icon.power-settings")}
                            />
                        }
                        onClick={logout}
                    >
                        {t("page.home.navigation.logout")}
                    </Button>
                </Box>
            </FlexCenter>
        </>
    );
};
const useStyles = makeStylesEdt({ "name": { ErrorPage } })(theme => ({
    textBox: {
        display: "flex",
        flexDirection: "column",
        color: theme.palette.error.main,
        textAlign: "center",
    },
    button: {
        margin: "0.25rem",
    },
    buttonBox: {
        marginTop: "4rem",
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        justifyContent: "center",
    },
}));
export default ErrorProvider;
