
import { Box, Typography } from "@mui/material";
import CloseIcon from "../../../../assets/illustration/mui-icon/close.svg?react";
import { useTranslation } from "react-i18next";
import { makeStylesEdt } from "../../../../theme";

interface SurveyPageHeaderProps {
    surveyDate: string;
    firstName: string;
    onNavigateBack(): void;
}

const SurveyPageHeader = (props: SurveyPageHeaderProps) => {
    const { surveyDate, firstName, onNavigateBack } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={classes.headerBox}>
            <Box>
                <Typography className={classes.infoText}>{surveyDate + " - " + firstName}</Typography>
            </Box>
            <Box onClick={onNavigateBack} onKeyUp={onNavigateBack}>
                <CloseIcon
                    aria-label={t("accessibility.asset.mui-icon.close")}
                    className={classes.actionIcon}
                />
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
