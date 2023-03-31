import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { isDesktop } from "service/responsive";

interface ActivityButtonsProps {
    onClickFinish(): void;
    onClickAdd(): void;
    finishLabel?: string;
    addLabel?: string;
    helpStep?: number;
}

const ActivityButtons = (props: ActivityButtonsProps) => {
    const { onClickFinish, onClickAdd, finishLabel, addLabel, helpStep } = props;
    const { classes, cx } = useStyles();
    const isItDesktop = isDesktop();
    return (
        <>
            {!isItDesktop && <Box className={classes.gap}></Box>}
            <FlexCenter
                className={cx(classes.ButtonsBox, isItDesktop ? "" : classes.ButtonsBoxMobileTablet)}
            >
                <>
                    {!addLabel && (
                        <Button
                            variant="outlined"
                            onClick={onClickFinish}
                            className={cx(
                                classes.buttons,
                                helpStep == 3 ? classes.helpButton : "",
                                helpStep == 3 ? classes.helpCloseButton : "",
                            )}
                        >
                            {finishLabel}
                        </Button>
                    )}
                </>
                <Button
                    variant="contained"
                    onClick={onClickAdd}
                    className={cx(
                        addLabel === undefined ? classes.buttons : classes.aloneAddButton,
                        helpStep == 1 ? classes.helpButton : "",
                        helpStep == 1 ? classes.helpAddButton : "",
                    )}
                >
                    <AddIcon />
                    {addLabel}
                </Button>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityButtons } })(theme => ({
    gap: {
        height: "5rem",
        width: "100%",
    },
    ButtonsBox: {
        width: "100%",
        backgroundColor: theme.variables.white,
        padding: "0.75rem",
    },
    ButtonsBoxMobileTablet: {
        position: "absolute",
        left: "0",
        bottom: "0",
    },
    aloneAddButton: {
        width: "80%",
        maxWidth: "18rem",
    },
    buttons: {
        width: "40%",
        maxWidth: "9rem",
        margin: "0 1rem",
        lineHeight: "1.25rem",
    },
    helpButton: {
        borderRadius: important("12px"),
        zIndex: "1400",
        position: "relative",
        pointerEvents: "none",
    },
    helpAddButton: {
        borderColor: important(theme.variables.white),
        border: important("1px solid white"),
    },
    helpCloseButton: {
        borderColor: important(theme.palette.secondary.main),
        backgroundColor: important(theme.variables.white),
    },
}));

export default ActivityButtons;
