import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";

interface LoopSurveyPageSimpleHeaderProps {
    onNavigateBack(): void;
    simpleHeaderLabel?: string;
}

const LoopSurveyPageSimpleHeader = (props: LoopSurveyPageSimpleHeaderProps) => {
    const { simpleHeaderLabel, onNavigateBack } = props;
    const { classes, cx } = useStyles();
    return (
        <Box className={cx(classes.headerBox)}>
            <Box>{simpleHeaderLabel}</Box>
            <Box>
                <CloseIcon className={classes.actionIcon} onClick={onNavigateBack} />
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { LoopSurveyPageSimpleHeader } })(theme => ({
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        position: "relative",
        zIndex: "10",
    },
    headerWhiteBox: {
        backgroundColor: theme.variables.white,
    },
    actionIcon: {
        cursor: "pointer",
    },
}));

export default LoopSurveyPageSimpleHeader;
