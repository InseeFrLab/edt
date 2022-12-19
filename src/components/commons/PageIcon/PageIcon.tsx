import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStyles } from "tss-react/mui";

interface PageIconProps {
    srcIcon: string;
    altIcon: string;
}

const PageIcon = (props: PageIconProps) => {
    const { srcIcon, altIcon } = props;
    const { classes } = useStyles();
    return (
        <FlexCenter className={classes.spacing}>
            <img src={srcIcon} alt={altIcon} />
        </FlexCenter>
    );
};

const useStyles = makeStyles({ "name": { PageIcon } })(() => ({
    spacing: {
        margin: "2rem 0",
    },
}));

export default PageIcon;
