import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface SurveyPageSimpleHeaderProps {
    onNavigateBack(): void;
}

const SurveyPageSimpleHeader = (props: SurveyPageSimpleHeaderProps) => {
    const { onNavigateBack } = props;
    const { classes } = useStyles();
    return (
        <Box className={classes.headerBox}>
            <Box></Box>
            <Box>
                <CloseIcon className={classes.actionIcon} onClick={onNavigateBack} />
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPageSimpleHeader } })(() => ({
    headerBox: {
        display: "flex",
        flexGrow: "1",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "1rem",
        position: "relative",
        zIndex: "10",
    },
    actionIcon: {
        cursor: "pointer",
    },
}));

export default SurveyPageSimpleHeader;
