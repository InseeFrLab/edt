import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { isIOS } from "react-device-detect";
import { isDesktop } from "service/responsive";

interface ValidateButtonProps {
    onClick(): void;
    text: string;
    disabled?: boolean;
}

const ValidateButton = (props: ValidateButtonProps) => {
    const { text, onClick, disabled } = props;
    const { classes, cx } = useStyles();
    const isItDesktop = isDesktop();

    return (
        <>
            <FlexCenter className={cx(disabled ? classes.invalidButtonBox : classes.validateButtonBox)}>
                <Button
                    id={"validateButton"}
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
    },
    validateButton: {
        width: "80%",
        maxWidth: "18rem",
        margin: "1rem 0",
    },
    invalidButtonBox: {
        width: "100%",
        backgroundColor: theme.variables.white,
    },
    invalidButton: {
        width: "80%",
        maxWidth: "18rem",
        margin: "1rem 0",
    },
    buttonBoxPwa: {
        marginBottom: "1rem",
    },
}));

export default ValidateButton;
