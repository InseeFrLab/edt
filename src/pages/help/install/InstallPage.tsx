import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import finalization from "assets/illustration/help.svg";
import installation from "assets/illustration/installation.svg";
import download from "assets/illustration/mui-icon/download.svg";
import InstallPageStep from "components/commons/InstallPageStep/InstallPageStep";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createMap, getDevice, getLabelStep, getNavigator } from "./utils";

const InstallPage = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();

    const mapSteps = createMap();
    const device = getDevice();
    const navigator = getNavigator();
    const stepFinal = (mapSteps?.get(device)?.get(navigator)?.length ?? 4) + 1;

    const [step, setStep] = React.useState(1);

    let label = getLabelStep(step, stepFinal);

    let stepImage = mapSteps?.get(device)?.get(navigator)?.[step - 2] ?? "";

    useEffect(() => {
        label = getLabelStep(step, stepFinal);
        stepImage = mapSteps?.get(device)?.get(navigator)?.[step - 2] ?? "";
    }, [step]);

    return (
        <InstallPageStep
            iconTitle={step == 1 ? installation : (step < stepFinal ? download : finalization)}
            iconTitleAlt={t("accessibility.asset.installation-alt")}
            title={t("component.help.install.common.title")}
            description={step == 1 ? t("component.help.install.common.description-1") : t("component.help.install.description")}
            description2={step == 1 ? t("component.help.install.common.description-2") : undefined}
            step={step}
            stepFinal={stepFinal}
            stepTitle={t(label)}
            stepImage={stepImage}
            stepImageAlt={t("accessibility.asset.installation-alt")}
            setStep={setStep}
        />
    );
};

const useStyles = makeStylesEdt({ "name": { InstallPage } })(theme => ({
    installBox: {
        padding: "1rem",
    },
    contentBox: {
        height: "100vh",
    },
    contentBoxMobile: {
        height: "95vh",
    },
    innerContentBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
    },
    illustrationBox: {},
    textBox: { textAlign: "center" },
    actionsBox: { display: "flex", flexDirection: "column", alignItems: "center" },
    actionBox: { maxWidth: "300px", margin: "0.5rem 0", width: "90%" },
    button: { width: "100%", backgroundColor: theme.palette.text.primary },
    footerBox: {
        display: "flex",
        alignItems: "baseline",
        padding: "1rem",
    },
    footerBoxMobile: {
        height: "8vh",
        padding: important("1rem 0rem 0rem 1rem"),
    },
}));

export default InstallPage;
