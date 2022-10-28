import { useMediaQuery } from "react-responsive";

interface ResponsiveProps {
    children: JSX.Element[] | JSX.Element;
}

const mobileMaxWidth = 767;
const tabletMaxWidth = 991;
const tabletMinWidth = 768;
const destktopMinWidth = 992;

const isMobile = (): boolean => {
    return useMediaQuery({ query: "(max-width: " + mobileMaxWidth + "px)" });
};

const Desktop = ({ children }: ResponsiveProps) => {
    const isDesktop = useMediaQuery({ minWidth: destktopMinWidth });
    return isDesktop ? <>{children}</> : <></>;
};
const Tablet = ({ children }: ResponsiveProps) => {
    const isTablet = useMediaQuery({ minWidth: tabletMinWidth, maxWidth: tabletMaxWidth });
    return isTablet ? <>{children}</> : <></>;
};
const Mobile = ({ children }: ResponsiveProps) => {
    const isMobile = useMediaQuery({ maxWidth: mobileMaxWidth });
    return isMobile ? <>{children}</> : <></>;
};
const Default = ({ children }: ResponsiveProps) => {
    const isNotMobile = useMediaQuery({ minWidth: tabletMinWidth });
    return isNotMobile ? <>{children}</> : <></>;
};

export { Desktop, Tablet, Mobile, Default, isMobile };
