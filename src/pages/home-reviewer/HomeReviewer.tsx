import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import reviewer from "assets/illustration/reviewer.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const HomeReviewerPage = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();

    const navToSurveysView = useCallback(() => {
        //TODO : nav to new view
    }, []);

    const navToDemonstration = useCallback(() => {
        //TODO : nav to app but offline mode
    }, []);

    return (
        <Box>
            <FlexCenter>
                <img src={reviewer} alt={t("accessibility.assets.reviewer-alt")} />
            </FlexCenter>
            <Box className={classes.titleBox}></Box>
            <Box className={classes.actionsBox}>
                <Button endIcon={<ArrowForwardIcon />} onClick={navToSurveysView}>
                    {t("page.reviewer-home.navigation.surveys")}
                </Button>
                <Button startIcon={<VisibilityIcon />} onClick={navToDemonstration}>
                    {t("page.reviewer-home.navigation.demo")}
                </Button>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { HomeReviewerPage } })(() => ({
    titleBox: {},
    actionsBox: {},
}));

export default HomeReviewerPage;
