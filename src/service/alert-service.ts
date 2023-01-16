import { useTranslation } from "react-i18next";
import { validateWithAlertAndNav } from "./navigation-service";

export type LabelsAlerts = {
    alertMessage: string;
    alertIgnore: string;
    alertComplete: string;
    alertAlticon: string;
};

const getLabels = (component: string) => {
    const { t } = useTranslation();

    const labels: LabelsAlerts = {
        alertMessage: t("component." + component + ".alert-message"),
        alertIgnore: t("common.navigation.alert.ignore"),
        alertComplete: t("common.navigation.alert.complete"),
        alertAlticon: t("common.navigation.alert.alt-icon"),
    };
    return labels;
};

export { getLabels };
