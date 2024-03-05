interface IconProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    alt: string;
    className?: any;
}

const Icon = (props: IconProps) => {
    const { icon, alt, className } = props;

    const renderIcon = () => {
        const Icon = icon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        return <Icon aria-label={alt} className={className} />;
    };

    return renderIcon();
};

export default Icon;
