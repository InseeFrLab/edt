import { memo } from "react";

interface IconProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    alt: string;
    className?: any;
}

const Icon = memo((props: IconProps) => {
    const { icon, alt, className } = props;

    const renderIcon = () => {
        const Icon = icon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        return <Icon aria-label={alt} className={className} />;
    };

    return renderIcon();
});

//export default createCustomizableLunaticField(Icon, "Icon");
export default Icon;
