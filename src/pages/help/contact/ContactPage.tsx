import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import contact from "assets/illustration/contact.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPageSimpleHeader from "components/commons/SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import { isMobile as isMobileImage, isPwa } from "service/responsive";

const ContactPage = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navToHome = (): void => {
        navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
    };

    const isNavMobile = !isPwa() && isMobile;

    const linkFaq = t("component.help.contact.link-1");
    const linkContact = t("component.help.contact.link-2");

    return (
        <Box className={cx(classes.contentBox, isNavMobile ? classes.contentBoxMobile : "")}>
            <Box className={classes.innerContentBox}>
                <Box className={classes.installBox}>
                    <SurveyPageSimpleHeader
                        onNavigateBack={useCallback(() => navToHome(), [])}
                        backgroundWhite={false}
                    />
                    <FlexCenter>
                        <img src={contact} alt={t("accessibility.asset.mui-icon.download")} />
                    </FlexCenter>
                    <Box className={classes.innerBox}>
                        <Box className={isMobileImage() ? classes.textBoxMobile : classes.textBox}>
                            <h2>{t("component.help.contact.title")}</h2>
                            <p className={classes.paddingBox}>{t("component.help.contact.info-1")}</p>
                            <p>{t("component.help.contact.info-2")}</p>
                            <Box className={classes.linkBox}>
                                <a href={linkFaq}>{linkFaq}</a>
                            </Box>
                            <p>{t("component.help.contact.info-3")}</p>
                            <Box className={classes.linkBox}>
                                <a href={linkContact}>{linkContact}</a>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { ContactPage } })(theme => ({
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
    innerBox: {
        display: "flex",
        justifyContent: "center",
    },
    textBox: { textAlign: "center", width: "50%", fontSize: "14px" },
    textBoxMobile: { textAlign: "center", width: "80%", fontSize: "14px" },
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
    linkBox: {
        backgroundColor: theme.variables.white,
        padding: "1rem",
        marginBottom: "2rem",
    },
    paddingBox: {
        marginBottom: "2rem",
    },
}));

export default ContactPage;