import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface SurveyPageSimpleHeaderProps {
    onNavigateBack(): void;
    simpleHeaderLabel?: string;
    backgroundWhite?: boolean;
}

const SurveyPageSimpleHeader = (props: SurveyPageSimpleHeaderProps) => {
    const { simpleHeaderLabel, onNavigateBack, backgroundWhite } = props;
    const { classes, cx } = useStyles();
    return (
        <Box className={cx(classes.headerBox, backgroundWhite ? classes.headerWhiteBox : "")}>
            <Box>{simpleHeaderLabel}</Box>
            <Box>
                <CloseIcon className={classes.actionIcon} onClick={onNavigateBack} />
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPageSimpleHeader } })(theme => ({
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

export default SurveyPageSimpleHeader;
