import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

interface EndActivityStepperProps {
    numberOfSteps: number;
    lastCompletedStepNumber: number;
    currentStepNumber: number;
    currentStepLabel: string;
}

const EndActivityStepper = (props: EndActivityStepperProps) => {
    const { numberOfSteps, lastCompletedStepNumber, currentStepNumber, currentStepLabel } = props;
    const { classes } = useStyles();
    let stepIncrement = 100 / numberOfSteps;
    const [progress] = React.useState(stepIncrement * lastCompletedStepNumber);

    return (
        <Box className={classes.stepper}>
            <Box className={classes.stepBox}>
                <Box className={classes.progressBox}>
                    <CircularProgress
                        className={classes.circularProgressBox}
                        color="primary"
                        variant="determinate"
                        value={progress}
                        aria-label="circular-progressbar"
                    ></CircularProgress>
                    <Box className={classes.labelProgressBox}>
                        <Typography className={classes.textStepNumber}>
                            {currentStepNumber + " / " + numberOfSteps}
                        </Typography>
                    </Box>
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
        backgroundColor: theme.variables.white,
        marginBottom: "1rem",
    },
    stepBox: {
        display: "flex",
        alignItems: "center",
    },
    circularProgressBox: {
        borderRadius: "30px",
        width: "54px !important",
        height: "54px !important",
        "& .MuiCircularProgress-circle": {
            background: theme.palette.secondary.main,
        },
    },
    progressBox: {
        position: "relative",
        display: "inline-flex",
    },
    labelProgressBox: {
        top: "7px",
        left: "7px",
        bottom: 0,
        right: 0,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.light,
        borderRadius: "30px",
        width: "40px",
        height: "40px",
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
        color: theme.variables.white,
    },
    textStepLabel: {
        fontSize: "18px",
        color: theme.palette.text.secondary,
        fontWeight: "bold",
    },
}));

export default EndActivityStepper;
