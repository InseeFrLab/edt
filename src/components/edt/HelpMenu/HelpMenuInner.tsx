import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Divider } from "@mui/material";
import arrowForwardIos from "assets/illustration/mui-icon/arrow-forward-ios.svg";
import close from "assets/illustration/mui-icon/close.svg";
import download from "assets/illustration/mui-icon/download.svg";
import expandLess from "assets/illustration/mui-icon/expand-less.svg";
import mail from "assets/illustration/mui-icon/mail.svg";
import rebaseEdit from "assets/illustration/mui-icon/rebase_edit.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";
import { getDeviceNavigatorIsAvaiableForInstall } from "utils/utils";

interface HelpMenuInnerProps {
    handleClose(): void;
    onClickContact(idSurvey?: any, source?: any): void;
    onClickInstall(idSurvey?: any, source?: any): void;
    onClickHelp(idSurvey?: any, source?: any): void;
    className: string;
    isMobile: boolean;
}

const HelpMenuInner = (props: HelpMenuInnerProps) => {
    const { handleClose, onClickContact, onClickInstall, onClickHelp, className, isMobile } = props;
    const { t } = useTranslation();
    const { classes, cx } = useStyles();

    const getClassDevice = (classMobile: any, classDesktop: any) => {
        return isMobile ? classMobile : classDesktop;
    };

    const getClassNavigateBox = () => {
        return getClassDevice(classes.navigateBoxMobile, classes.navigateBox);
    };

    const getClassIconBox = () => {
        return getClassDevice(classes.iconBoxMobile, classes.iconBox);
    };

    const getClassTextBox = () => {
        return getClassDevice(classes.textBoxMobile, classes.textBox);
    };

    const getClassNavIconBox = () => {
        return classes.navIconBox;
    };

    return (
        <Box className={cx(className, getClassDevice(classes.modalMobile, classes.modalDefault))}>
            <Box id="contact" className={getClassNavigateBox()} onClick={onClickContact}>
                <Box className={getClassIconBox()}>
                    <img src={mail} alt={t("accessibility.asset.help-menu.contact-alt")} />
                </Box>
                <Box className={getClassTextBox()}>
                    <p>{t("component.help-menu.contact-label")}</p>
                </Box>
                <Box className={getClassNavIconBox()}>
                    <img
                        src={arrowForwardIos}
                        alt={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                    />
                </Box>
            </Box>
            <Divider light />
            {getDeviceNavigatorIsAvaiableForInstall() && (
                <>
                    <Box id="install" className={getClassNavigateBox()} onClick={onClickInstall}>
                        <Box className={getClassIconBox()}>
                            <img src={download} alt={t("accessibility.asset.help-menu.install-alt")} />
                        </Box>
                        <Box className={getClassTextBox()}>
                            <p>{t("component.help-menu.install-label")}</p>
                        </Box>
                        <Box className={getClassNavIconBox()}>
                            <img
                                src={arrowForwardIos}
                                alt={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                            />
                        </Box>
                    </Box>
                    <Divider light />
                </>
            )}
            <Box id="help" className={getClassNavigateBox()} onClick={onClickHelp}>
                <Box className={getClassIconBox()}>
                    <img src={rebaseEdit} alt={t("accessibility.asset.help-menu.help-alt")} />
                </Box>
                <Box className={getClassTextBox()}>
                    <p>{t("component.help-menu.help-label")}</p>
                </Box>
                <Box className={getClassNavIconBox()}>
                    <img
                        src={arrowForwardIos}
                        alt={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                    />
                </Box>
            </Box>
            <FlexCenter>
                <Button
                    className={getClassDevice(classes.closeButtonMobile, classes.closeButton)}
                    onClick={handleClose}
                >
                    <Box>
                        <Box>
                            <img
                                src={isMobile ? expandLess : close}
                                alt={t("accessibility.asset.mui-icon.close")}
                            />
                        </Box>
                        {!isMobile && <Box>{t("common.navigation.close")}</Box>}
                    </Box>
                </Button>
            </FlexCenter>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpMenuInner } })(theme => ({
    iconBox: {
        width: "20%",
        textAlign: "center",
    },
    iconBoxMobile: {
        "img": {
            width: "33px",
        },
    },
    textBox: {
        width: "60%",
    },
    textBoxMobile: {
        width: "70%",
    },
    iconPlusBoxMobile: {
        "img": {
            width: "50px",
        },
    },
    modalDefault: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "2rem",
        borderRadius: "37px",
        width: "500px",
    },
    modalMobile: {
        top: "3rem",
        width: "100%",
        padding: "1rem",
        borderRadius: "0 0 37px 37px",
    },
    closeButton: {
        fontSize: "14px",
        color: theme.palette.text.primary,
    },
    closeButtonMobile: {
        marginTop: "1rem",
        fontSize: "14px",
        color: theme.palette.text.primary,
    },
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
    navIconBox: {
        color: theme.palette.primary.light,
    },
}));

export default HelpMenuInner;
