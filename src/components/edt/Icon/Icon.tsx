import { makeStylesEdt } from "@inseefrlab/lunatic-edt";

interface IconProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    alt: string;
    className?: any;
}

const Icon = (props: IconProps) => {
    const { icon, alt, className } = props;

    const renderIcon = () => {
        //const Icon = require(icon).default;
        const Icon = icon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        return <Icon aria-label={alt} className={className} />;
    };

    return renderIcon();
};

const useStyles = makeStylesEdt({ "name": { Icon } })(() => ({}));

export default Icon;
