import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStylesEdt } from "lunatic-edt";

interface ValidateButtonProps {
    onClick(): void;
    text: string;
}

const ValidateButton = (props: ValidateButtonProps) => {
    const { text, onClick } = props;
    const { classes } = useStyles();

    return (
        <>
            <Box className={classes.gap}></Box>
            <FlexCenter className={classes.validateButtonBox}>
                <Button variant="contained" onClick={onClick} className={classes.validateButton}>
                    {text}
                </Button>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: ValidateButton } })(theme => ({
    validateButtonBox: {
        width: "100%",
        position: "fixed",
        bottom: "0",
        backgroundColor: theme.variables.white,
    },
    validateButton: {
        width: "80%",
        maxWidth: "18rem",
        margin: "1rem 0",
    },
    gap: {
        height: "4.25rem",
        width: "100%",
    },
}));

export default ValidateButton;
