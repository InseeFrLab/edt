
import { Box, Button } from "@mui/material";
import ArrowBackIosIcon from "../../../assets/illustration/mui-icon/arrow-back-ios.svg?react";
import ArrowForwardIosIcon from "../../../assets/illustration/mui-icon/arrow-forward-ios.svg?react";
import { EdtRoutesNameEnum } from "../../../enumerations/EdtRoutesNameEnum";
import { useCallback } from "react";
import { isIOS, isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "../../../service/navigation-service";
import { makeStylesEdt } from "../../../theme";
import { important } from "../../../utils/lunatic-edt";

interface NavigationStepProps {
    step: number;
    stepFinal: number;
    setStep: (value: number) => void;
}

const NavigationStep = (props: NavigationStepProps) => {
    const { step, stepFinal, setStep } = props;
    const navigate = useNavigate();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const navToBackPage = useCallback(
        () => navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME)),
        [step],
    );

    const navToNextPage = useCallback(
        () => navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME)),
        [step],
    );

    const previousHelpStep = useCallback(() => {
        step > 1 ? setStep(step - 1) : navToBackPage();
    }, [step]);

    const nextHelpStep = useCallback(() => {
        step < stepFinal ? setStep(step + 1) : navToNextPage();
    }, [step]);

    const hasTwoButtons = step > 1 && step < stepFinal;

    const renderHelp = () => {
        return (
            <Box className={classes.rootHelp}>
                {step > 1 && (
                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBackIosIcon
                                aria-label={t("accessibility.asset.mui-icon.arrow-back-ios")}
                            />
                        }
                        onClick={previousHelpStep}
                        className={cx(
                            classes.navButton,
                            hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                            isIOS && isMobile ? classes.buttonBoxPwa : "",
                        )}
                        id="validate-button"
                    >
                        <Box className={classes.label}>{t("common.navigation.previous")}</Box>
                    </Button>
                )}

                {step < stepFinal && (
                    <Button
                        variant="outlined"
                        endIcon={
                            <ArrowForwardIosIcon
                                aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                            />
                        }
                        onClick={nextHelpStep}
                        className={cx(
                            classes.navButton,
                            hasTwoButtons ? classes.navButtons : classes.singleNavButton,
                            isIOS && isMobile ? classes.buttonBoxPwa : "",
                        )}
                        id="validate-button"
                    >
                        <Box className={classes.label}>{t("common.navigation.next")}</Box>
                    </Button>
                )}
            </Box>
        );
    };

    return <Box className={classes.root}>{renderHelp()}</Box>;
};

const useStyles = makeStylesEdt({ "name": { NavButton: NavigationStep } })(theme => ({
    root: {
        height: "100vh",
        maxHeight: "100vh",
    },
    headerHelpBox: {
        display: "flex",
    },
    rootHelp: {
        display: "flex",
        alignItems: "center",
        height: "4rem",
        marginTop: "0.5rem",
    },
    buttonBox: {
        borderColor: "transparent",
        marginBottom: "1rem",
        marginRight: "1rem",
        "&:hover": {
            color: theme.variables.white,
            borderColor: important(theme.variables.white),
        },
    },
    buttonBoxPwa: {
        height: "3.75rem",
    },
    navButton: {
        borderRadius: "0",
        height: "3.75rem",
    },
    navButtons: {
        width: "50%",
    },
    singleNavButton: {
        width: "100%",
    },
    label: {
        color: theme.palette.secondary.main,
    },
}));

export default NavigationStep;
