import { Box } from "@mui/material";
import { makeStyles } from "tss-react/mui";
interface FlexCenterProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const FlexCenter = (props: FlexCenterProps) => {
    const { children, className } = props;
    const { classes, cx } = useStyles({ "color": "grey" });
    return <Box className={cx(className, classes.box)}>{children}</Box>;
};

const useStyles = makeStyles<{}>()(_theme => ({
    box: {
        display: "flex",
        justifyContent: "center",
    },
}));

export default FlexCenter;
