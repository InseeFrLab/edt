import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Modal } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FlexEvenly from "components/commons/FlexEvenly/FlexEvenly";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface ErrorProps {
    labelledBy: string;
    describedBy: string;
    errorMessage: string;
    errorIcon: string;
    errorIconAlt: string;
    onIgnore(): void;
    onComplete(): void;
}

const Error = (props: ErrorProps) => {
    const { labelledBy, describedBy, errorMessage, errorIcon, errorIconAlt, onIgnore, onComplete } =
        props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [open]);

    return (
        <>
            <Box
                component="div"
                className={classes.shadowBackground}
                sx={{ display: open ? "visible" : "none" }}
            ></Box>
            <React.Fragment>
                <Modal
                    hideBackdrop
                    open={open}
                    onClose={handleClose}
                    aria-labelledby={labelledBy}
                    aria-describedby={describedBy}
                >
                    <Box className={classes.errorBox}>
                        <FlexCenter>
                            <img src={errorIcon} alt={errorIconAlt} />
                        </FlexCenter>
                        <FlexCenter className={classes.errorMessageBox}>
                            <p>{errorMessage}</p>
                        </FlexCenter>
                        <FlexEvenly>
                            <Button variant="outlined" onClick={onIgnore}>
                                {t("common.navigation.ignore")}
                            </Button>
                            <Button variant="contained" onClick={onComplete}>
                                {t("common.navigation.complete")}
                            </Button>
                        </FlexEvenly>
                    </Box>
                </Modal>
            </React.Fragment>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { Error } })(theme => ({
    errorBox: {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: "50%",
        left: "50%",
        backgroundColor: theme.palette.error.light,
        border: "2px solid transparent",
        borderColor: theme.palette.error.light,
        boxShadow: "24",
        index: "2",
        padding: "1rem",
        borderRadius: "10px",
        minWidth: "300px",
        "&:focus": {
            outline: "none",
        },
    },
    shadowBackground: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "#0000004D",
        index: "1",
    },
    errorMessageBox: {
        color: theme.palette.error.main,
    },
}));

export default Error;
