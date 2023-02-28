import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";

interface PourcentProgressProps {
    labelledBy: string;
    describedBy: string;
    progress: number;
}

const PourcentProgress = (props: PourcentProgressProps) => {
    const { labelledBy, describedBy, progress } = props;
    const { classes } = useStyles();
    return (
        <Box aria-labelledby={labelledBy} aria-describedby={describedBy} className={classes.roundedBox}>
            {progress}%
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { PourcentProgress } })(() => ({
    roundedBox: {
        border: "1px solid transparent",
        borderRadius: "50%",
        backgroundColor: "#dfe9fa",
        padding: "0.5rem",
    },
}));

export default PourcentProgress;
