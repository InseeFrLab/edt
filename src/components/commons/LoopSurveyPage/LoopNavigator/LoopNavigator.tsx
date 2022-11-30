import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStylesEdt } from "lunatic-edt";

interface LoopNavigatorProps {
    onNext?(): void;
    onPrevious?(): void;
    nextLabel: string;
    previousLabel: string;
}

const LoopNavigator = (props: LoopNavigatorProps) => {
    const { onNext, onPrevious, nextLabel, previousLabel } = props;
    const { classes, cx } = useStyles();
    const hasBothButtons = onNext && onPrevious;
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
                                hasBothButtons ? classes.navButtons : classes.singleNavButton,
                            )}
                        >
                            <Box className={classes.label}>{previousLabel}</Box>
                        </Button>
                    )}
                    {onNext && (
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIosIcon />}
                            onClick={onNext}
                            className={cx(
                                classes.navButton,
                                hasBothButtons ? classes.navButtons : classes.singleNavButton,
                            )}
                        >
                            <Box className={classes.label}>{nextLabel}</Box>
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
