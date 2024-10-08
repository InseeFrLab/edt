
import { Button } from "@mui/material";
import FlexCenter from "../../../components/commons/FlexCenter/FlexCenter";
import { makeStylesEdt } from "../../../theme";

interface NavButtonProps {
    onClick(): void;
    text: string;
}

const NavButton = (props: NavButtonProps) => {
    const { text, onClick } = props;
    const { classes } = useStyles();

    return (
        <FlexCenter className={classes.navButtonBox}>
            <Button variant="contained" onClick={onClick} className={classes.navButton}>
                {text}
            </Button>
        </FlexCenter>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton } })(theme => ({
    navButtonBox: {
        width: "100%",
        position: "fixed",
        bottom: "0",
        backgroundColor: theme.variables.white,
    },
    navButton: {
        width: "80%",
        maxWidth: "18rem",
        margin: "1rem 0",
    },
}));

export default NavButton;
