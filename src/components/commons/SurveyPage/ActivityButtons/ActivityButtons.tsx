import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStylesEdt } from "lunatic-edt";

interface ActivityButtonsProps {
    onClickFinish(): void;
    onClickAdd(): void;
    finishLabel?: string;
    addLabel?: string;
}

const ActivityButtons = (props: ActivityButtonsProps) => {
    const { onClickFinish, onClickAdd, finishLabel, addLabel } = props;
    const { classes } = useStyles();
    return (
        <>
            <Box className={classes.gap}></Box>
            <FlexCenter className={classes.ButtonsBox}>
                <>
                    {!addLabel && (
                        <Button variant="outlined" onClick={onClickFinish} className={classes.buttons}>
                            {finishLabel}
                        </Button>
                    )}
                </>
                <Button
                    variant="contained"
                    onClick={onClickAdd}
                    className={addLabel === undefined ? classes.buttons : classes.aloneAddButton}
                >
                    <AddIcon />
                    {addLabel}
                </Button>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityButtons } })(theme => ({
    ButtonsBox: {
        width: "100%",
        position: "fixed",
        bottom: "0",
        backgroundColor: theme.variables.white,
    },
    gap: {
        height: "4.25rem",
        width: "100%",
    },
    aloneAddButton: {
        width: "80%",
        maxWidth: "18rem",
        margin: "1rem 0",
    },
    buttons: {
        width: "40%",
        maxWidth: "9rem",
        margin: "1rem 1rem",
    },
}));

export default ActivityButtons;
