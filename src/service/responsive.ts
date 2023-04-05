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

export {
    isMobile,
    isTablet,
    isDesktop,
    mobileMaxWidth,
    tabletMinWidth,
    tabletMaxWidth,
    destktopMinWidth,
};
