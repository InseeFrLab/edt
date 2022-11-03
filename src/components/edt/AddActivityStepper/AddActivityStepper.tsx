import { Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";

interface AddActivityStepperProps {
    numberOfSteps: number;
    lastCompletedStepNumber: number;
    currentStepIcon: string;
    currentStepIconAlt: string;
    currentStepNumber: number;
    currentStepLabel: string;
}

const AddActivityStepper = (props: AddActivityStepperProps) => {
    const {
        numberOfSteps,
        lastCompletedStepNumber,
        currentStepIcon,
        currentStepIconAlt,
        currentStepNumber,
        currentStepLabel,
    } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const [progress, setProgress] = React.useState((100 / numberOfSteps) * lastCompletedStepNumber);

    return (
        <Box className={classes.stepper}>
            <Box className={classes.progressBox}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box className={classes.stepBox}>
                <Box>
                    <img src={currentStepIcon} alt={currentStepIconAlt} />
                </Box>
                <Box className={classes.textBox}>
                    <Box className={classes.textStepNumber}>
                        {t("common.stepper.step") + " " + currentStepNumber + " / " + numberOfSteps}
                    </Box>
                    <Box className={classes.textStepLabel}>{currentStepLabel}</Box>
                </Box>
            </Box>
        </Box>
    );
};

const useStyles = makeStyles({ "name": { AddActivityStepper } })(theme => ({
    stepper: {
        padding: "1rem",
    },
    progressBox: {
        marginBottom: "1.5rem",
        "& .MuiLinearProgress-colorPrimary": {
            borderRadius: "10px",
            height: "8px",
        },
        "& .MuiLinearProgress-barColorPrimary": {
            borderRadius: "10px",
        },
    },
    stepBox: {
        display: "flex",
        alignItems: "center",
    },
    textBox: {
        marginLeft: "1rem",
    },
    textStepNumber: {
        fontSize: "12px",
        color: theme.palette.action.hover,
        textTransform: "uppercase",
    },
    textStepLabel: {
        fontSize: "18px",
        color: theme.palette.text.secondary,
        fontWeight: "bold",
    },
}));

export default AddActivityStepper;
