import { Box } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface FlexCenterProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const FlexCenter = (props: FlexCenterProps) => {
    const { children, className } = props;
    const { classes, cx } = useStyles();
    return <Box className={cx(className, classes.box)}>{children}</Box>;
};

const useStyles = makeStylesEdt({ "name": { FlexCenter } })(() => ({
    box: {
        display: "flex",
        justifyContent: "center",
    },
}));

export default FlexCenter;
