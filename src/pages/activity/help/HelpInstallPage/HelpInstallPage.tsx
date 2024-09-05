import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Paper, Typography } from "@mui/material";
import InstallImg from "../../../../assets/illustration/mui-icon/download.svg?react";
import FlexCenter from "../../../../components/commons/FlexCenter/FlexCenter";
import SurveyPageSimpleHeader from "../../../../components/commons/SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";
import { EdtRoutesNameEnum } from "../../../../enumerations/EdtRoutesNameEnum";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath, navToHome } from "../../../../service/navigation-service";
import { isPwa } from "../../../../service/responsive";
import packageJson from "../../../../../package.json";

const HelpInstallPage = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navToHelp = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_ACTIVITY));
    }, []);

    const isNavMobile = !isPwa() && isMobile;

    return (
        <Box className={cx(classes.contentBox, isNavMobile ? classes.contentBoxMobile : "")}>
            <Box className={classes.innerContentBox}>
                <Box className={classes.installBox}>
                    <SurveyPageSimpleHeader
                        onNavigateBack={useCallback(() => navToHome(), [])}
                        backgroundWhite={false}
                    />
                    <FlexCenter className={classes.illustrationBox}>
                        <InstallImg aria-label={t("accessibility.asset.mui-icon.download")} />
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
                <Paper
                    className={cx(classes.footerBox, isNavMobile ? classes.footerBoxMobile : "")}
                    component="footer"
                    square
                    variant="outlined"
                >
                    <Box>
                        <Typography variant="caption" color="initial">
                            <b>{t("common.version")}:</b> {packageJson.version} -{" "}
                            {packageJson.dateVersion}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpInstallPage } })(theme => ({
    installBox: {
        padding: "1rem",
    },
    contentBox: {
        height: "100vh",
    },
    contentBoxMobile: {
        height: "95vh",
    },
    innerContentBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
    },
    illustrationBox: {},
    textBox: { textAlign: "center" },
    actionsBox: { display: "flex", flexDirection: "column", alignItems: "center" },
    actionBox: { maxWidth: "300px", margin: "0.5rem 0", width: "90%" },
    button: { width: "100%", backgroundColor: theme.palette.text.primary },
    footerBox: {
        display: "flex",
        alignItems: "baseline",
        padding: "1rem",
    },
    footerBoxMobile: {
        height: "8vh",
        padding: important("1rem 0rem 0rem 1rem"),
    },
}));

export default HelpInstallPage;
