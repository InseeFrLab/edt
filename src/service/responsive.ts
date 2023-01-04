import { useMediaQuery } from "react-responsive";

const mobileMaxWidth = 767;
const tabletMaxWidth = 991;
const tabletMinWidth = 768;
const destktopMinWidth = 992;

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
