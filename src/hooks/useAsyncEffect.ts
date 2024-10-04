import { useEffect } from "react";

export function useAsyncEffect(cb: () => Promise<void>, deps: unknown[]) {
    useEffect(() => {
        cb();
    }, deps);
}
