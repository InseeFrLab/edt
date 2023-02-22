import { Backdrop, Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { makeStylesEdt } from "lunatic-edt";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface HelpModalProps {
    content?: string;
    isModalDisplayed: boolean;
    onNext?(event?: React.MouseEvent): void;
    onPrevious?(event?: React.MouseEvent): void;
    onSkip?(event?: React.MouseEvent): void;
}

const HelpModal = (props: HelpModalProps) => {
    const { content, isModalDisplayed, onNext, onPrevious, onSkip } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const [open, setOpen] = useState(true);

    const alertLabels = {
        title: t("component.modal-edt.modal-felicitation.title"),
        content: content,
        endContent: t("component.modal-edt.modal-felicitation.end-content"),
        buttonLabel: t("component.modal-edt.modal-felicitation.button"),
    };

    console.log("modal" + isModalDisplayed);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [open]);

    return (
        <>
            <Modal
                hideBackdrop
                disableEnforceFocus
                open={open}
                //onClick={handleClose}
            >
                <Box className={classes.root}>
                    <Box className={classes.headerBox}>
                        <Button className={classes.buttonBox} variant="outlined" onClick={onPrevious}>
                            {t("common.navigation.previous")}
                        </Button>
                        <Button className={classes.buttonBox} variant="outlined" onClick={onNext}>
                            {t("common.navigation.next")}
                        </Button>
                    </Box>
                    <Box>
                        <Button className={classes.buttonBox} variant="outlined" onClick={handleClose}>
                            {t("common.navigation.skip")}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { HelpModal } })(theme => ({
    headerBox: {
        display: "flex",
    },
    root: {
        backgroundColor: "#0000004D",
        padding: "0.5rem",
        display: "flex",
        //justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "10vh",
    },
    buttonBox: {
        backgroundColor: "black",
        color: "white",
        borderColor: "transparent",
        marginBottom: "1rem",
        marginRight: "1rem",
    },
}));

export default HelpModal;
