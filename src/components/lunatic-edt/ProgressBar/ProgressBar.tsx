import Box from "@mui/material/Box";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import React, { memo, useEffect } from "react";
import { makeStylesEdt } from "../../../theme/make-style-edt";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number; showlabel: string }) {
    let labelTranslateX = props.value === 0 ? props.value : props.value - 2;
    const { classes } = useStyles();
    return (
        <Box className={classes.linearProgressBox}>
            <Box className={classes.barBox}>
                <LinearProgress variant="determinate" {...props} aria-label="linear-progressbar" />
            </Box>
            <Box className={classes.labelBox}>
                {props.showlabel && (
                    <Typography
                        className={classes.label}
                        sx={{ transform: "translateX(" + labelTranslateX + "%)" }}
                        color="primary"
                    >
                        {props.value + "%"}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export type ProgressBarProps = {
    value?: number;
    showlabel?: boolean;
    id?: string;
    className?: string;
    isPrimaryMainColor?: boolean;
};

const ProgressBar = memo((props: ProgressBarProps) => {
    //TODO : to complete when we know how to override/use it from lunatic
    const { value, showlabel = false, id, className, isPrimaryMainColor = false } = props;

    const [progress, setProgress] = React.useState(value);

    const { classes, cx } = useStyles();

    useEffect(() => {
        setProgress(value);
    }, [value]);

    return (
        <Box
            className={cx(
                className,
                classes.root,
                isPrimaryMainColor ? classes.primaryMainColor : classes.primaryWarningColor,
            )}
            aria-label="progressbar"
        >
            <LinearProgressWithLabel
                id={id}
                value={progress || 0}
                showlabel={showlabel ? "true" : "false"}
            />
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { ProgressBar } })(theme => ({
    root: {
        width: "100%",
        "& .MuiLinearProgress-colorPrimary": {
            backgroundColor: theme.variables.neutral,
            borderRadius: "10px",
            height: "8px",
        },
        "& .MuiLinearProgress-barColorPrimary": {
            borderRadius: "10px",
        },
    },
    primaryMainColor: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.primary.main,
        },
    },
    primaryWarningColor: {
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: theme.palette.warning.main,
        },
    },
    linearProgressBox: {
        display: "flex",
        flexDirection: "column",
    },
    barBox: {
        width: "100%",
        mr: 1,
    },
    labelBox: {
        minWidth: 35,
        ml: 1,
    },
    label: {
        fontSize: "12px",
    },
}));

export default ProgressBar;
