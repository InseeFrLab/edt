import { useTranslation } from "react-i18next";

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

const getLabelsWhenQuit = (isRoute?: boolean, labelCancel?: true) => {
    const { t } = useTranslation();

    const labels = {
        boldContent: t("page.alert-when-quit.activity.alert-content-bold"),
        content: isRoute
            ? t("page.alert-when-quit.route.alert-content")
            : t("page.alert-when-quit.activity.alert-content"),
        cancel: labelCancel ? t("page.alert-when-quit.alert-cancel") : t("page.alert-when-quit.alert-undo"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    return labels;
};

export { getLabels, getLabelsWhenQuit };
