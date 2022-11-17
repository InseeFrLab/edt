import { Button } from "@mui/material";
import { makeStyles } from "tss-react/mui";

interface NavButtonProps {
    onClick(): void;
    text: string;
}

const NavButton = (props: NavButtonProps) => {
    const { text, onClick } = props;
    const { classes } = useStyles();

    return (
        <Button variant="contained" onClick={onClick} className={classes.navButton}>
            {text}
        </Button>
    );
};

const useStyles = makeStyles({ "name": { NavButton } })(() => ({
    navButton: {
        width: "80%",
        maxWidth: "18rem",
        marginTop: "1rem",
        position: "fixed",
        bottom: "1rem",
    },
}));

export default NavButton;
