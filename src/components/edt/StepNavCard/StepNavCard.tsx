import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Typography } from "@mui/material";
import { StepData } from "service/loop-stepper-service";

interface StepNavCardProps {
    onClick(): void;
    labelledBy: string;
    describedBy: string;
    stepData: StepData;
}

const StepNavCard = (props: StepNavCardProps) => {
    const { onClick, labelledBy, describedBy, stepData } = props;
    const { classes } = useStyles();
    return (
        <Box
            className={classes.mainCardBox}
            onClick={onClick}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
        >
            <Box className={classes.stepInfoBox}>
                <img className={classes.stepIcon} src={stepData.stepIcon} alt={stepData.stepIconAlt} />
                <Typography>{stepData.stepLabel}</Typography>
            </Box>
            <ArrowForwardIosIcon className={classes.arrowIcon} />
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { StepNavCard } })(theme => ({
    mainCardBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        border: "1px solid transparent",
        borderRadius: "6px",
        marginBottom: "1rem",
        padding: "1rem",
        width: "90%",
        cursor: "pointer",
    },
    stepInfoBox: {
        display: "flex",
        alignItems: "center",
    },
    stepIcon: {
        width: "30px",
        height: "30px",
        marginRight: "1rem",
    },
    arrowIcon: {
        color: theme.palette.primary.light,
        width: "20px",
    },
}));

export default StepNavCard;
