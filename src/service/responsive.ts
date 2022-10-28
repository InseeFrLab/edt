import { useMediaQuery } from "react-responsive";

const mobileMaxWidth = 767;
const tabletMaxWidth = 991;
const tabletMinWidth = 768;
const destktopMinWidth = 992;

const isMobile = (): boolean => {
    return useMediaQuery({ query: "(max-width: " + mobileMaxWidth + "px)" });
};

export { isMobile, mobileMaxWidth, tabletMinWidth, tabletMaxWidth, destktopMinWidth };
