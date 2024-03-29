import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { useTranslation } from "react-i18next";
import Icon from "../Icon/Icon";

interface AddActivityOrRouteStepperStepperProps {
    numberOfSteps: number;
    lastCompletedStepNumber: number;
    currentStepIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    currentStepIconAlt: string;
    currentStepNumber: number;
    currentStepLabel: string;
}

const AddActivityOrRouteStepper = (props: AddActivityOrRouteStepperStepperProps) => {
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
    let stepIncrement = 100 / numberOfSteps;
    const progress = stepIncrement * lastCompletedStepNumber;

    return (
        <Box className={classes.stepper}>
            <Box className={classes.progressBox}>
                <LinearProgress variant="determinate" value={progress} aria-label="linear-progressbar" />
            </Box>
            <Box className={classes.stepBox}>
                <Box>
                    <Icon icon={currentStepIcon} alt={currentStepIconAlt} />
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

const useStyles = makeStylesEdt({ "name": { AddActivityOrRouteStepper } })(theme => ({
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

export default AddActivityOrRouteStepper;
