import { useMediaQuery } from "react-responsive";
import { destktopMinWidth, mobileMaxWidth, tabletMaxWidth, tabletMinWidth } from "service/responsive";

interface ResponsiveProps {
    children: JSX.Element[] | JSX.Element;
}

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

export { Default, Desktop, Mobile, Tablet };
