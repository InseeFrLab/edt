import { useMediaQuery } from "react-responsive";

const mobileMaxWidth = 615;
const tabletMaxWidth = 931;
const tabletMinWidth = 616;
const destktopMinWidth = 932;

const isMobile = (): boolean => {
    return useMediaQuery({ query: "(max-width: " + mobileMaxWidth + "px)" });
};

const isTablet = (): boolean => {
    return useMediaQuery({ query: "(max-width: " + tabletMaxWidth + "px)" });
};

const isDesktop = (): boolean => {
    return useMediaQuery({ query: "(min-width: " + destktopMinWidth + "px)" });
};

const isPwa = (): boolean => {
    return ["fullscreen", "standalone", "minimal-ui"].some(
        displayMode => window.matchMedia("(display-mode: " + displayMode + ")").matches,
    );
};

export {
    destktopMinWidth,
    isDesktop,
    isMobile,
    isPwa,
    isTablet,
    mobileMaxWidth,
    tabletMaxWidth,
    tabletMinWidth,
};
