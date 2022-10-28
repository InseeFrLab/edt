import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Button, Divider } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";

interface AddActivityOrRouteDefaultProps {
    handleClose(): void;
    onClickActivity(): void;
    onClickRoute(): void;
    className: string;
    iconTitle: string;
    iconActivity: string;
    iconRoute: string;
}

const AddActivityOrRouteDefault = (props: AddActivityOrRouteDefaultProps) => {
    const { handleClose, onClickActivity, onClickRoute, className, iconTitle, iconActivity, iconRoute } =
        props;
    const { t } = useTranslation();
    const { classes, cx } = useStyles();
    return (
        <>
            <Box className={cx(className, classes.modalDefault)}>
                <Box
                    id="modal-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box className={classes.iconBox}>
                        <img src={iconTitle} alt={t("accessibility.asset.yellow-plus-alt")} />
                    </Box>
                    <Box className={classes.modalTitleBox}>
                        <h1>{t("component.add-activity-or-route.title")}</h1>
                    </Box>
                </Box>
                <Box id="add-activity" className={classes.navigateBox} onClick={onClickActivity}>
                    <Box className={classes.iconBox}>
                        <img src={iconActivity} alt={t("accessibility.asset.activity-alt")} />
                    </Box>
                    <Box className={classes.textBox}>
                        <h2>{t("component.add-activity-or-route.activity-label")}</h2>
                        <p>{t("component.add-activity-or-route.activity-description")}</p>
                    </Box>
                    <Box className={classes.navIconBox}>
                        <NavigateNextIcon />
                    </Box>
                </Box>
                <Divider light />
                <Box id="add-route" className={classes.navigateBox} onClick={onClickRoute}>
                    <Box className={classes.iconBox}>
                        <img src={iconRoute} alt={t("accessibility.asset.route-alt")} />
                    </Box>
                    <Box className={classes.textBox}>
                        <h2>{t("component.add-activity-or-route.route-label")}</h2>
                        <p>{t("component.add-activity-or-route.route-description")}</p>
                    </Box>
                    <Box className={classes.navIconBox}>
                        <NavigateNextIcon />
                    </Box>
                </Box>
                <FlexCenter>
                    <Button className={classes.closeButton} onClick={handleClose}>
                        <Box>
                            <Box>
                                <CloseIcon />
                            </Box>
                            <Box>{t("common.navigation.close")}</Box>
                        </Box>
                    </Button>
                </FlexCenter>
            </Box>
        </>
    );
};

const useStyles = makeStyles({ "name": { AddActivityOrRouteDefault } })(theme => ({
    navigateBox: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        border: "1px solid transparent",
        borderRadius: "3px",
        "&:hover": {
            backgroundColor: "ghostwhite",
        },
    },
    navIconBox: {
        color: theme.palette.primary.light,
    },
    iconBox: {
        width: "20%",
        textAlign: "center",
    },
    textBox: {
        width: "60%",
    },
    modalDefault: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "2rem",
        borderRadius: "37px",
    },
    modalTitleBox: {
        width: "70%",
    },
    closeButton: {
        marginTop: "2rem",
        fontSize: "14px",
    },
}));

export default AddActivityOrRouteDefault;
