import { ReactComponent as FinalizationIcon } from "assets/illustration/help.svg";
import { ReactComponent as InstallationImg } from "assets/illustration/installation.svg";
import { ReactComponent as DownloadIcon } from "assets/illustration/mui-icon/download.svg";
import InstallPageStep from "components/commons/InstallPageStep/InstallPageStep";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getDevice, getNavigator } from "utils/utils";
import { createMap, getLabelStep } from "./utils";

const InstallPage = () => {
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

    const altIcon = t("accessibility.asset.installation-alt");

    const getIconStepOthers = () => {
        return step < stepFinal ? (
            <DownloadIcon aria-label={altIcon} />
        ) : (
            <FinalizationIcon aria-label={altIcon} />
        );
    };

    const getIconStepInit = () => {
        return <InstallationImg aria-label={altIcon} />;
    };
    return (
        <InstallPageStep
            icon={step == 1 ? getIconStepInit() : getIconStepOthers()}
            title={t("component.help.install.common.title")}
            description={
                step == 1
                    ? t("component.help.install.common.description-1")
                    : t("component.help.install.description")
            }
            step={step}
            stepFinal={stepFinal}
            stepTitle={t(label)}
            stepImage={stepImage}
            stepImageAlt={t("accessibility.asset.installation-alt")}
            setStep={setStep}
        />
    );
};
export default InstallPage;
