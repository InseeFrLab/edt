import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStylesEdt } from "lunatic-edt";

interface ValidateButtonProps {
    onClick(): void;
    text: string;
    disabled?: boolean;
}

const ValidateButton = (props: ValidateButtonProps) => {
    const { text, onClick, disabled } = props;
    const { classes } = useStyles();

    return (
        <>
            <Box className={classes.gap}></Box>
            <FlexCenter className={disabled ? classes.invalidButtonBox : classes.validateButtonBox}>
                <Button
                    variant="contained"
                    onClick={onClick}
                    disabled={disabled}
                    className={disabled ? classes.invalidButton : classes.validateButton}
                >
                    {text}
                </Button>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: ValidateButton } })(theme => ({
    gap: { height: "5rem", width: "100%" },
    validateButtonBox: {
        width: "100%",
        backgroundColor: theme.variables.white,
        position: "fixed",
        left: "0",
        bottom: "0",
    },
    validateButton: {
        width: "80%",
        maxWidth: "18rem",
        margin: "1rem 0",
    },
    invalidButtonBox: {
        width: "100%",
        position: "fixed",
        bottom: "0",
        left: "0",
        backgroundColor: theme.variables.white,
    },
    invalidButton: {
        width: "80%",
        maxWidth: "18rem",
        margin: "1rem 0",
    },
}));

export default ValidateButton;
