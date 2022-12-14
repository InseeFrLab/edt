import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface LoopSurveyPageHeaderProps {
    onClose?(): void;
    label: string;
    children: JSX.Element[] | JSX.Element;
}

const LoopSurveyPageHeader = (props: LoopSurveyPageHeaderProps) => {
    const { label, onClose, children } = props;
    const { classes } = useStyles();
    return (
        <Box className={classes.headerBox}>
            <Box className={classes.topBox}>
                <Box>
                    <Typography className={classes.infoText}>{label}</Typography>
                </Box>
                <Box>
                    <CloseIcon className={classes.actionIcon} onClick={onClose} />
                </Box>
            </Box>
            {children}
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { LoopSurveyPageHeader } })(theme => ({
    headerBox: {
        backgroundColor: theme.variables.white,
    },
    topBox: {
        padding: "1rem 1rem 0 1rem",
        display: "flex",
        flexGrow: "1",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoText: {
        fontSize: "14px",
    },
    actionIcon: {
        cursor: "pointer",
    },
}));

export default LoopSurveyPageHeader;
