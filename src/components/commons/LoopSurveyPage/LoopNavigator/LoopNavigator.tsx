import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStylesEdt } from "lunatic-edt";
import { isDesktop } from "service/responsive";

interface LoopNavigatorProps {
    onNext?(event?: React.MouseEvent): void;
    onPrevious?(event?: React.MouseEvent): void;
    onValidate?(): void;
    nextLabel: string;
    previousLabel: string;
    validateLabel: string;
}

const LoopNavigator = (props: LoopNavigatorProps) => {
    const { onNext, onPrevious, onValidate, nextLabel, previousLabel, validateLabel } = props;
    const { classes, cx } = useStyles();
    const hasTwoButtons = (onPrevious && onNext) || (onPrevious && onValidate);
    const isItDesktop = isDesktop();
    return (
        <>
            {!isItDesktop && <Box className={classes.gap}></Box>}
            <FlexCenter
                className={cx(
                    classes.validateButtonBox,
                    isItDesktop ? "" : classes.validateButtonBoxMobileTablet,
                )}
            >
                <>
                    {onPrevious && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIosIcon />}
                            onClick={e => onPrevious(e)}
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
                            onClick={e => onNext(e)}
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
    gap: {
        height: "5rem",
        width: "100%",
    },
    validateButtonBox: {
        width: "100%",
        backgroundColor: theme.variables.white,
    },
    validateButtonBoxMobileTablet: {
        position: "fixed",
        bottom: "0",
        left: "0",
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
}));

export default LoopNavigator;
