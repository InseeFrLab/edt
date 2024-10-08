import { Box, Button, Modal, Typography } from "@mui/material";
import { Fragment, ReactElement, memo } from "react";
import { makeStylesEdt } from "../../../theme";

type AlertProps = {
    isAlertDisplayed: boolean;
    onCompleteCallBack(): void;
    onCancelCallBack(forceQuite: boolean): void;
    labels: {
        boldContent?: string;
        content: string;
        cancel: string | undefined;
        complete: string;
    };
    icon: ReactElement<any>;
};

const Alert = memo((props: AlertProps) => {
    const { isAlertDisplayed, onCompleteCallBack, onCancelCallBack, labels, icon } = props;
    const { classes, cx } = useStyles();

    const renderCancelButton = () => {
        return (
            labels.cancel && (
                <Button
                    className={classes.cancelButton}
                    variant="outlined"
                    onClick={() => onCancelCallBack(true)}
                    id={"button-cancel"}
                >
                    {labels.cancel}
                </Button>
            )
        );
    };

    return (
        <>
            <Box
                component="div"
                className={classes.shadowBackground}
                sx={{ display: isAlertDisplayed ? "visible" : "none" }}
            ></Box>
            <Fragment>
                <Modal open={isAlertDisplayed} aria-labelledby={""} aria-describedby={""}>
                    <Box className={classes.errorBox}>
                        <Box className={classes.boxCenter}>{icon}</Box>
                        <Box className={cx(classes.boxCenter, classes.errorMessageBox)}>
                            {labels.boldContent && (
                                <Typography className={classes.boldText}>
                                    {labels.boldContent}
                                </Typography>
                            )}
                            <Typography>{labels.content}</Typography>
                        </Box>
                        <Box className={classes.boxEvenly}>
                            {renderCancelButton()}
                            <Button
                                variant="contained"
                                onClick={onCompleteCallBack}
                                id={"button-complete"}
                            >
                                {labels.complete}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Fragment>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Alert } })(theme => ({
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
        display: "flex",
        flexDirection: "column",
        color: theme.palette.error.main,
        textAlign: "center",
        marginTop: "1.5rem",
        marginBottom: "1.5rem",
    },
    boldText: {
        fontWeight: "bold",
    },
    boxCenter: {
        display: "flex",
        justifyContent: "center",
    },
    boxEvenly: {
        display: "flex",
        justifyContent: "space-evenly",
    },
    cancelButton: {
        backgroundColor: theme.variables.white,
    },
}));

export default Alert;
