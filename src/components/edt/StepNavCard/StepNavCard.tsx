import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Typography } from "@mui/material";
import { ReactComponent as ArrowForwardIosIcon } from "../../../assets/illustration/mui-icon/arrow-forward-ios.svg";
import { useTranslation } from "react-i18next";
import { StepData } from "../../../service/loop-stepper-service";
import Icon from "../Icon/Icon";

interface StepNavCardProps {
    onClick(): void;
    labelledBy: string;
    describedBy: string;
    stepData: StepData;
}

const StepNavCard = (props: StepNavCardProps) => {
    const { onClick, labelledBy, describedBy, stepData } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();
    return (
        <Box
            className={classes.mainCardBox}
            onClick={onClick}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
        >
            <Box className={classes.stepInfoBox}>
                <Icon className={classes.stepIcon} icon={stepData.stepIcon} alt={stepData.stepIconAlt} />
                <Typography>{stepData.stepLabel}</Typography>
            </Box>
            <ArrowForwardIosIcon
                aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                className={classes.arrowIcon}
            />
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { StepNavCard } })(theme => ({
    mainCardBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        border: "1px solid transparent",
        borderRadius: "6px",
        marginBottom: "1rem",
        padding: "1rem",
        width: "90%",
        cursor: "pointer",
    },
    stepInfoBox: {
        display: "flex",
        alignItems: "center",
    },
    stepIcon: {
        width: "30px",
        height: "30px",
        marginRight: "1rem",
    },
    arrowIcon: {
        color: theme.palette.primary.light,
        width: "20px",
    },
}));

export default StepNavCard;
