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
    const widthPercent = isDesktop() ? "70%" : "100%";
    const { classes, cx } = useStyles({ "width": widthPercent });
    const hasTwoButtons = (onPrevious && onNext) || (onPrevious && onValidate);
    return (
        <>
            <FlexCenter className={classes.validateButtonBox}>
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

const useStyles = makeStylesEdt<{ width: string }>({ "name": { LoopNavigator } })(
    (theme, { width }) => ({
        validateButtonBox: {
            width: "100%",
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
    }),
);

export default LoopNavigator;
