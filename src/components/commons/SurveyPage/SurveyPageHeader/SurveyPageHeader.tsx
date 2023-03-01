import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";

interface SurveyPageHeaderProps {
    surveyDate: string;
    firstName: string;
    onNavigateBack(): void;
}

const SurveyPageHeader = (props: SurveyPageHeaderProps) => {
    const { surveyDate, firstName, onNavigateBack } = props;
    const { classes } = useStyles();
    return (
        <Box className={classes.headerBox}>
            <Box>
                <Typography className={classes.infoText}>{surveyDate + " - " + firstName}</Typography>
            </Box>
            <Box>
                <CloseIcon className={classes.actionIcon} onClick={onNavigateBack} />
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPageHeader } })(() => ({
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "1rem",
    },
    infoText: {
        fontSize: "14px",
    },
    actionIcon: {
        cursor: "pointer",
    },
}));

export default SurveyPageHeader;
