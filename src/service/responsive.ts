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

export { isMobile, isTablet, mobileMaxWidth, tabletMinWidth, tabletMaxWidth, destktopMinWidth };
