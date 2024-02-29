import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Divider } from "@mui/material";
import { ReactComponent as ArrowForwardIosIcon } from "assets/illustration/mui-icon/arrow-forward-ios.svg";
import { ReactComponent as CloseIcon } from "assets/illustration/mui-icon/close.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";

interface AddActivityOrRouteMobileProps {
    handleClose(): void;
    onClickActivity(idSurvey?: any, source?: any): void;
    onClickRoute(idSurvey?: any, source?: any): void;
    className: string;
    iconTitle: string;
    iconActivity: string;
    iconRoute: string;
}

const AddActivityOrRouteMobile = (props: AddActivityOrRouteMobileProps) => {
    const { handleClose, onClickActivity, onClickRoute, className, iconTitle, iconActivity, iconRoute } =
        props;
    const { t } = useTranslation();
    const { classes, cx } = useStyles();
    return (
        <Box className={cx(className, classes.modalMobile)}>
            <Box id="modal-title" className={classes.titleBoxMobile}>
                <Box className={classes.iconPlusBoxMobile}>
                    <img src={iconTitle} alt={t("accessibility.asset.yellow-plus-alt")} />
                </Box>
                <Box className={classes.modalTitleBoxMobile}>
                    <h2>{t("component.add-activity-or-route.title")}</h2>
                </Box>
            </Box>
            <Box id="add-activity" className={classes.navigateBoxMobile} onClick={onClickActivity}>
                <Box className={classes.iconBoxMobile}>
                    <img src={iconActivity} alt={t("accessibility.asset.activity-alt")} />
                </Box>
                <Box className={classes.textBoxMobile}>
                    <h3>{t("component.add-activity-or-route.activity-label")}</h3>
                    <p>{t("component.add-activity-or-route.activity-description")}</p>
                </Box>
                <Box className={classes.navIconBoxMobile}>
                    <ArrowForwardIosIcon
                        aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                    />
                </Box>
            </Box>
            <Divider light />
            <Box id="add-route" className={classes.navigateBoxMobile} onClick={onClickRoute}>
                <Box className={classes.iconBoxMobile}>
                    <img src={iconRoute} alt={t("accessibility.asset.route-alt")} />
                </Box>
                <Box className={classes.textBoxMobile}>
                    <h3>{t("component.add-activity-or-route.route-label")}</h3>
                    <p>{t("component.add-activity-or-route.route-description")}</p>
                </Box>
                <Box className={classes.navIconBoxMobile}>
                    <ArrowForwardIosIcon
                        aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                    />
                </Box>
            </Box>
            <FlexCenter>
                <Button className={classes.closeButtonMobile} onClick={handleClose}>
                    <Box>
                        <Box>
                            <CloseIcon aria-label={t("accessibility.asset.mui-icon.close")} />
                        </Box>
                        <Box>{t("common.navigation.close")}</Box>
                    </Box>
                </Button>
            </FlexCenter>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { AddActivityOrRouteMobile } })(theme => ({
    iconBoxMobile: {
        "img": {
            width: "70px",
        },
    },
    titleBoxMobile: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconPlusBoxMobile: {
        "img": {
            width: "50px",
        },
    },
    modalMobile: {
        bottom: 0,
        width: "100%",
        padding: "1rem",
        borderRadius: "37px 37px 0 0",
    },
    modalTitleBoxMobile: {
        width: "70%",
    },
    closeButtonMobile: {
        marginTop: "1rem",
        fontSize: "14px",
        color: theme.palette.text.primary,
    },
    navigateBoxMobile: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        border: "1px solid transparent",
        borderRadius: "3px",
        "&:click": {
            backgroundColor: "ghostwhite",
        },
    },
    textBoxMobile: {
        width: "50%",
    },
    navIconBoxMobile: {
        color: theme.palette.primary.light,
    },
}));

export default AddActivityOrRouteMobile;
