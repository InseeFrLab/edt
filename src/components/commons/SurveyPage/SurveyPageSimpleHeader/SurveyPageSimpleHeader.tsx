import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import { ReactComponent as CloseIcon } from "assets/illustration/mui-icon/close.svg";
import { useTranslation } from "react-i18next";

interface SurveyPageSimpleHeaderProps {
    onNavigateBack(): void;
    simpleHeaderLabel?: string;
    backgroundWhite?: boolean;
}

const SurveyPageSimpleHeader = (props: SurveyPageSimpleHeaderProps) => {
    const { simpleHeaderLabel, onNavigateBack, backgroundWhite } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={cx(classes.headerBox, backgroundWhite ? classes.headerWhiteBox : "")}>
            <Box>{simpleHeaderLabel}</Box>
            <Box onClick={onNavigateBack} onKeyUp={onNavigateBack}>
                <CloseIcon
                    aria-label={t("accessibility.asset.mui-icon.close")}
                    className={classes.actionIcon}
                    id="close-button"
                />
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
