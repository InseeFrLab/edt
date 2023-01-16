import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, Typography } from "@mui/material";
import defaultErrorIcon from "assets/illustration/error/error.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { makeStylesEdt } from "lunatic-edt";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const { t } = useTranslation();
    const { classes } = useStyles();
    const navigate = useNavigate();

    const navToHome = () => {
        navigate("/");
    };

    return (
        <>
            <PageIcon srcIcon={defaultErrorIcon} altIcon={t("accessibility.asset.error.default")} />
            <Box className={classes.textBox}>
                <Typography>{t("common.error.error-default-title")}</Typography>
                <Typography>{t("common.error.error-default")}</Typography>
            </Box>
            <FlexCenter className={classes.buttonBox}>
                <Button
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={useCallback(() => navToHome, [])}
                >
                    {t("common.navigation.back-to-home")}
                </Button>
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
    buttonBox: {
        marginTop: "4rem",
    },
}));

export default ErrorPage;
