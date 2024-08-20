interface IconProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    alt: string;
    className?: any;
}

const Icon = (props: IconProps) => {
    const { icon: IconComponent, alt, className } = props;

    const renderIcon = () => {
        return <IconComponent aria-label={alt} className={className} />;
    };

    return renderIcon();
};

export default Icon;
