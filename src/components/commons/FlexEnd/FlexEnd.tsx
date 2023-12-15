import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";

interface FlexEndProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const FlexEnd = (props: FlexEndProps) => {
    const { children, className } = props;
    const { classes, cx } = useStyles();
    return <Box className={cx(className, classes.box)}>{children}</Box>;
};

const useStyles = makeStylesEdt({ "name": { FlexEnd } })(() => ({
    box: {
        display: "flex",
        justifyContent: "flex-end",
    },
}));

export default FlexEnd;
