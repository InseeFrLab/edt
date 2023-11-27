import { Info, important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import InfoIcon from "assets/illustration/info.svg";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import FlexCenter from "../FlexCenter/FlexCenter";
import NavigationStep from "../NavigationStep/NavigationStep";
import SurveyPageSimpleHeader from "../SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";

interface InstallPageStepProps {
    iconTitle: string;
    iconTitleAlt: string;
    title: string;
    description: string;
    stepTitle: string;
    stepImage: string;
    stepImageAlt: string;
    step: number;
    stepFinal: number;
    setStep: (value: number) => void;
}

const InstallPageStep = (props: InstallPageStepProps) => {
    const {
        iconTitle,
        iconTitleAlt,
        title,
        description,
        stepTitle,
        stepImage,
        stepImageAlt,
        step,
        stepFinal,
        setStep,
    } = props;

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { classes, cx } = useStyles();

    const navToHome = (): void => {
        navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
    };

    return (
        <>
            <Box>
                <Box className={step == 1 ? classes.rootFirst : classes.root}>
                    <SurveyPageSimpleHeader
                        onNavigateBack={useCallback(() => navToHome(), [])}
                        backgroundWhite={false}
                    />
                    <FlexCenter className={step > 1 ? classes.imgBox : undefined}>
                        <img src={iconTitle} alt={t(iconTitleAlt)} />
                    </FlexCenter>
                    <Box className={classes.textBox}>
                        <Box
                            className={cx(
                                classes.textInnerBox,
                                isMobile ? classes.textInnerBoxMobile : undefined,
                            )}
                        >
                            <h2>{title}</h2>
                            <p>{description}</p>
                            {step > 1 && <h3>{step - 1 + ". " + stepTitle}</h3>}
                        </Box>
                    </Box>

                    {step > 1 && (
                        <FlexCenter>
                            <img className={classes.stepImageBox} src={stepImage} alt={t(stepImageAlt)} />
                        </FlexCenter>
                    )}
                </Box>
                {step == 1 && (
                    <Box className={classes.infoBox}>
                        <Info
                            normalText={t("component.help.install.common.info-text")}
                            boldText={t("component.help.install.common.info-bold")}
                            infoIcon={InfoIcon}
                            infoIconAlt={t("accessibility.asset.info.info-alt")}
                            boldFirst={true}
                        />
                    </Box>
                )}
            </Box>
            <Box>
                <NavigationStep step={step} stepFinal={stepFinal} setStep={setStep} />
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: InstallPageStep } })(() => ({
    rootFirst: {
        height: "70vh",
        maxHeight: "70vh",
    },
    root: {
        height: "91vh",
        maxHeight: "91vh",
    },
    textBox: {
        display: "flex",
        justifyContent: "center",
    },
    textInnerBox: {
        width: "55%",
        textAlign: "center",
        fontSize: "14px",
    },
    textInnerBoxMobile: {
        width: important("90%"),
    },
    infoBox: {
        display: "flex",
        justifyContent: "center",
        height: "8rem",
        marginBottom: "1rem",
    },
    imgBox: {
        position: "absolute",
        top: "2rem",
        left: "47%",
    },
    stepImageBox: {
        height: "50vh"
    }
}));

export default InstallPageStep;
