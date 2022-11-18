import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface SurveyPageHeaderProps {
    surveyDate: string;
    firstName: string;
    onNavigateBack(): void;
}

const SurveyPageHeader = (props: SurveyPageHeaderProps) => {
    const { surveyDate, firstName, onNavigateBack } = props;
    const { classes } = useStyles();
    return (
        <Box sx={{ width: "100%", display: "flex" }}>
            <Box>
                <Typography>{surveyDate + " - " + firstName}</Typography>
            </Box>
            <Box>
                <CloseIcon className={classes.actionIcon} onClick={onNavigateBack} />
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPageHeader } })(() => ({
    actionIcon: {
        cursor: "pointer",
    },
}));

export default SurveyPageHeader;
