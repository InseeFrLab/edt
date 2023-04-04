import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import close from "assets/illustration/mui-icon/close.svg";
import { useTranslation } from "react-i18next";

interface LoopSurveyPageSimpleHeaderProps {
    onNavigateBack(): void;
    simpleHeaderLabel?: string;
}

const LoopSurveyPageSimpleHeader = (props: LoopSurveyPageSimpleHeaderProps) => {
    const { simpleHeaderLabel, onNavigateBack } = props;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={cx(classes.headerBox)}>
            <Box>{simpleHeaderLabel}</Box>
            <Box>
                <img
                    src={close}
                    alt={t("accessibility.asset.mui-icon.close")}
                    className={classes.actionIcon}
                    onClick={onNavigateBack}
                />
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
