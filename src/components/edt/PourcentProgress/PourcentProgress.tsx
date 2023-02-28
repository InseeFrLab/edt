import { Box } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface PourcentProgressProps {
    labelledBy: string;
    describedBy: string;
    progress: number;
    isClose?: boolean;
}

const PourcentProgress = (props: PourcentProgressProps) => {
    const { labelledBy, describedBy, progress, isClose } = props;
    const { classes, cx } = useStyles();
    return (
        <Box
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            className={cx(classes.roundedBox, isClose ? classes.closeBox : "")}
        >
            {progress}%
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { PourcentProgress } })(theme => ({
    roundedBox: {
        border: "1px solid transparent",
        borderRadius: "50%",
        backgroundColor: "#dfe9fa",
        padding: "0.5rem",
    },
    closeBox: {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

export default PourcentProgress;
