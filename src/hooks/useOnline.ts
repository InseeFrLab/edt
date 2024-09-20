import { useEffect, useState } from "react";

const missingWindow = typeof window === "undefined";

const missingNavigator = typeof navigator === "undefined";

/**
 * Detects if browser is online or not
 */
export const useOnline = (): boolean => {
    if (missingWindow || missingNavigator) {
        return true;
    }

    const [isOnline, setOnlineStatus] = useState(window.navigator.onLine);

    useEffect(() => {
        const toggleOnlineStatus = () => setOnlineStatus(window.navigator.onLine);

        window.addEventListener("online", toggleOnlineStatus);
        window.addEventListener("offline", toggleOnlineStatus);

        return () => {
            window.removeEventListener("online", toggleOnlineStatus);
            window.removeEventListener("offline", toggleOnlineStatus);
        };
    }, [isOnline]);

    return isOnline;
};
