// @ts-ignore
// @ts-nocheck
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

export function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log("SW Registered: " + r);
        },
        onRegisterError(error) {
            console.log("SW registration error: ", error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };
    const { t } = useTranslation();

    return (
        <Snackbar
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            open={offlineReady || needRefresh}
            autoHideDuration={6000}
            message={offlineReady ? t("sw.ready") : t("sw.update")}
            action={
                <>
                    {needRefresh && (
                        <Button color="primary" size="small" onClick={() => updateServiceWorker(true)}>
                            {t("sw.refresh")}
                        </Button>
                    )}
                    <Button size="small" aria-label="close" color="inherit" onClick={close}>
                        {t("sw.close")}
                    </Button>
                </>
            }
        />
    );
}
