import { Box, CircularProgress } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";
import React from "react";
import { useTranslation } from "react-i18next";

interface EndActivityStepperProps {
    numberOfSteps: number;
    lastCompletedStepNumber: number;
    currentStepNumber: number;
    currentStepLabel: string;
}

const EndActivityStepper = (props: EndActivityStepperProps) => {
    const { numberOfSteps, lastCompletedStepNumber, currentStepNumber, currentStepLabel } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    let stepIncrement = 100 / numberOfSteps;
    const [progress] = React.useState(stepIncrement * lastCompletedStepNumber);
    console.log(numberOfSteps);
    console.log(lastCompletedStepNumber);

    return (
        <Box className={classes.stepper}>
            <Box className={classes.progressBox}></Box>
            <Box className={classes.stepBox}>
                <Box>
                    <CircularProgress
                        className={classes.circularProgressBox}
                        color="primary"
                        variant="determinate"
                        value={progress}
                    ></CircularProgress>
                    <Box>{currentStepNumber + " / " + numberOfSteps}</Box>
                </Box>

                <Box className={classes.textBox}>
                    <Box className={classes.textStepLabel}>{currentStepLabel}</Box>
                </Box>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { EndActivityStepper } })(theme => ({
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
    circularProgressBox: {
        borderRadius: "30px",
        width: "50px",
        "& .MuiCircularProgress-circle": {
            background: theme.palette.secondary.main,
        },
    },
    iconBox: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 10,
        borderWidth: 1,
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

export default EndActivityStepper;
