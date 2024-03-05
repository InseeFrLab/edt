import { Info, important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import { ReactComponent as InfoIcon } from "assets/illustration/info.svg";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ReactElement, useCallback } from "react";
import { isIOS, isMobile as isMobileDevice } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import { isMobile as isMobileScreen } from "service/responsive";
import FlexCenter from "../FlexCenter/FlexCenter";
import NavigationStep from "../NavigationStep/NavigationStep";
import SurveyPageSimpleHeader from "../SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";

interface InstallPageStepProps {
    icon: ReactElement<any>;
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
    const { icon, title, description, stepTitle, stepImage, stepImageAlt, step, stepFinal, setStep } =
        props;

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { classes, cx } = useStyles({ "innerHeight": window.innerHeight });
    const navToHome = (): void => {
        navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
    };
    const isMobile = isMobileScreen() || isMobileDevice;

    return (
        <>
            <Box>
                <Box
                    className={cx(
                        step == 1 ? classes.rootFirst : classes.root,
                        isIOS ? classes.rootFirstMobile : "",
                    )}
                >
                    <SurveyPageSimpleHeader
                        onNavigateBack={useCallback(() => navToHome(), [])}
                        backgroundWhite={false}
                    />
                    <FlexCenter className={step > 1 ? classes.imgBox : undefined}>{icon}</FlexCenter>
                    <Box className={classes.textBox}>
                        <Box
                            className={cx(
                                classes.textInnerBox,
                                isMobile ? classes.textInnerBoxMobile : undefined,
                            )}
                        >
                            <h2 className={classes.titleBox}>{title}</h2>
                            <p>{description}</p>
                            {step > 1 && (
                                <h3 className={classes.titleBox}>{step - 1 + ". " + stepTitle}</h3>
                            )}
                        </Box>
                    </Box>

                    {step > 1 && (
                        <FlexCenter>
                            <img
                                className={classes.stepImageBox}
                                src={stepImage}
                                alt={t(stepImageAlt)}
                            />
                        </FlexCenter>
                    )}
                </Box>
                {step == 1 && (
                    <Box className={classes.infoBox}>
                        <Info
                            normalText={t("component.help.install.common.info-text")}
                            boldText={t("component.help.install.common.info-bold")}
                            infoIcon={<InfoIcon aria-label={t("accessibility.asset.info.info-alt")} />}
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

const useStyles = makeStylesEdt<{ innerHeight: number }>({ "name": { NavButton: InstallPageStep } })(
    () => ({
        rootFirst: {
            height: innerHeight - 208 + "px",
            maxHeight: innerHeight - 208 + "px",
        },
        rootFirstMobile: {
            maxHeight: "94vh",
        },
        root: {
            height: innerHeight - 58 + "px",
            maxHeight: innerHeight - 58 + "px",
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
            top: "1.5rem",
            left: "50%",
        },
        stepImageBox: {
            height: "50vh",
        },
        titleBox: {
            margin: "1.5rem 0rem",
        },
    }),
);

export default InstallPageStep;
