import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Typography } from "@mui/material";
import { ReactComponent as CloseIcon } from "assets/illustration/mui-icon/close.svg";
import { useTranslation } from "react-i18next";

interface LoopSurveyPageHeaderProps {
    onClose?(): void;
    label: string;
    children: JSX.Element[] | JSX.Element;
}

const LoopSurveyPageHeader = (props: LoopSurveyPageHeaderProps) => {
    const { label, onClose, children } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();
    return (
        <Box className={classes.headerBox}>
            <Box className={classes.topBox}>
                <Box>
                    <Typography className={classes.infoText}>{label}</Typography>
                </Box>
                <Box onClick={onClose} onKeyUp={onClose}>
                    <CloseIcon
                        aria-label={t("accessibility.asset.mui-icon.close")}
                        className={classes.actionIcon}
                    />
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
