import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStylesEdt } from "lunatic-edt";

interface LoopNavigatorProps {
    onNext?(): void;
    onPrevious?(): void;
    onValidate?(): void;
    nextLabel: string;
    previousLabel: string;
    validateLabel: string;
}

const LoopNavigator = (props: LoopNavigatorProps) => {
    const { onNext, onPrevious, onValidate, nextLabel, previousLabel, validateLabel } = props;
    const { classes, cx } = useStyles();
    const hasTwoButtons = (onPrevious && onNext) || (onPrevious && onValidate);
    return (
        <>
            <Box className={classes.gap}></Box>
            <FlexCenter className={classes.validateButtonBox}>
                <>
                    {onPrevious && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIosIcon />}
                            onClick={onPrevious}
                            className={cx(
                                classes.navButton,
                                hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                            )}
                        >
                            <Box className={classes.label}>{previousLabel}</Box>
                        </Button>
                    )}
                    {onNext && !onValidate && (
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIosIcon />}
                            onClick={onNext}
                            className={cx(
                                classes.navButton,
                                hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                            )}
                        >
                            <Box className={classes.label}>{nextLabel}</Box>
                        </Button>
                    )}
                    {onValidate && (
                        <Button
                            variant="outlined"
                            endIcon={<DoneIcon />}
                            onClick={onValidate}
                            className={cx(
                                classes.navButton,
                                hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                            )}
                        >
                            <Box className={classes.label}>{validateLabel}</Box>
                        </Button>
                    )}
                </>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { LoopNavigator } })(theme => ({
    validateButtonBox: {
        width: "100%",
        position: "fixed",
        bottom: "0",
        backgroundColor: theme.variables.white,
    },
    navButton: {
        borderRadius: "0",
        padding: "1rem",
    },
    navButtons: {
        width: "50%",
    },
    singleNavButton: {
        width: "100%",
    },
    label: {
        color: theme.palette.secondary.main,
    },
    gap: {
        height: "4.25rem",
        width: "100%",
    },
}));

export default LoopNavigator;
