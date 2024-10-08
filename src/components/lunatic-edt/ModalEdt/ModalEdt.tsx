import { Box, Button, Modal } from "@mui/material";
import { Fragment, ReactElement, memo } from "react";
import { makeStylesEdt } from "../../../theme";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt";

type ModalProps = {
    isModalDisplayed: boolean;
    onCompleteCallBack(): void;
    labels: {
        title: string;
        content: string;
        endContent: string;
        buttonLabel: string;
    };
    icon: ReactElement<any>;
    arrowForwardIcon: ReactElement<any>;
};

const ModalEdt = memo((props: ModalProps) => {
    const { isModalDisplayed, onCompleteCallBack, labels, icon, arrowForwardIcon } = props;
    const { classes, cx } = useStyles();

    return (
        <>
            <Box component="div" sx={{ display: isModalDisplayed ? "visible" : "none" }}></Box>
            <Fragment>
                <Modal open={isModalDisplayed} aria-labelledby={""} aria-describedby={""}>
                    <Box className={classes.errorBox}>
                        <Box className={cx(classes.boxCenter, classes.titleBox)}>{icon}</Box>
                        <Box className={cx(classes.boxCenter)}>
                            <h2>{labels?.title}</h2>
                        </Box>
                        <Box className={cx(classes.boxCenter)}>
                            <p className={classes.contentBox}>{labels?.content}</p>
                        </Box>
                        <Box className={cx(classes.boxCenter)}>
                            <p className={classes.endContentBox}>{labels?.endContent}</p>
                        </Box>
                        <Box className={classes.boxEvenly}>
                            <Button
                                variant="contained"
                                onClick={onCompleteCallBack}
                                className={classes.buttonNext}
                                endIcon={<Box className={classes.arrowIcon}>{arrowForwardIcon}</Box>}
                                aria-label={labels?.buttonLabel ?? ""}
                                id="next-modal-button"
                            >
                                {labels?.buttonLabel}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Fragment>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Modal } })(theme => ({
    errorBox: {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: "50%",
        left: "50%",
        backgroundColor: theme.variables.modal,
        border: "2px solid transparent",
        borderColor: theme.variables.modal,
        boxShadow: "24",
        index: "2",
        padding: "1rem",
        borderRadius: "10px",
        minWidth: "300px",
        "&:focus": {
            outline: "none",
        },
    },
    boxCenter: {
        display: "flex",
        justifyContent: "center",
    },
    titleBox: {
        color: theme.palette.secondary.main,
    },
    endContentBox: {
        fontWeight: "bold",
        color: theme.palette.primary.main,
        margin: "0.5rem",
    },
    contentBox: {
        margin: "0.5rem",
        color: theme.palette.secondary.main,
    },
    boxEvenly: {
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: "2rem",
        marginBottom: "1rem",
    },
    buttonNext: {
        width: "100%",
        fontSize: "16px",
    },
    arrowIcon: {
        svg: {
            color: theme.variables.white,
        },
    },
}));

export default createCustomizableLunaticField(ModalEdt, "ModalEdt");
