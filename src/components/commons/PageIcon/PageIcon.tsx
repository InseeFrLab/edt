import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStyles } from "tss-react/mui";

interface PageIconProps {
    srcIcon: string;
    altIcon: string;
    withMargin?: boolean;
}

const PageIcon = (props: PageIconProps) => {
    const { srcIcon, altIcon, withMargin = true } = props;
    const { classes } = useStyles();
    return (
        <FlexCenter className={withMargin ? classes.spacing : ""}>
            <img src={srcIcon} alt={altIcon} />
        </FlexCenter>
    );
};

const useStyles = makeStyles({ "name": { PageIcon } })(() => ({
    spacing: {
        margin: "3rem 1rem 1rem 1rem",
    },
}));

export default PageIcon;
