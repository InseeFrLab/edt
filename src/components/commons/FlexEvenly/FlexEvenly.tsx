import { Box } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface FlexEvenlyProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const FlexEvenly = (props: FlexEvenlyProps) => {
    const { children, className } = props;
    const { classes, cx } = useStyles();
    return <Box className={cx(className, classes.box)}>{children}</Box>;
};

const useStyles = makeStylesEdt({ "name": { FlexEvenly } })(() => ({
    box: {
        display: "flex",
        justifyContent: "space-evenly",
    },
}));

export default FlexEvenly;
