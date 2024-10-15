// @ts-ignore
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button, Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";

export function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW();

    const refresh = () => {
        updateServiceWorker(true).then(() => {
            window.location.reload();
        });
    };

    if (offlineReady) {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={offlineReady}
                onClose={() => setNeedRefresh(false)}
                message="L'application peut maintenant fonctionner hors ligne"
                TransitionComponent={Slide}
                action={
                    <Button size="small" onClick={() => setOfflineReady(false)}>
                        Fermer
                    </Button>
                }
            />
        );
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={needRefresh}
            onClose={() => setNeedRefresh(false)}
            message="Une nouvelle version de l'application est disponible"
            TransitionComponent={Slide}
            action={
                <Button size="small" onClick={refresh}>
                    Actualiser
                </Button>
            }
        />
    );
}
