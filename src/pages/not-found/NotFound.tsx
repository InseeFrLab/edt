import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Typography } from "@mui/material";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { ReactComponent as DefaultErrorIcon } from "assets/illustration/error/error.svg";
import ErrorPage from "pages/error/ErrorPage";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();
    const { classes } = useStyles();
    return (
        <>
            <PageIcon icon={<DefaultErrorIcon aria-label={t("accessibility.asset.error.default")} />} />
            <Box className={classes.textBox}>
                <Typography>{t("common.error.error-default-title")}</Typography>
                <br />
                <Typography>{t("page.not-found.not-found")}</Typography>
                <br />
            </Box>
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
export default NotFoundPage;
