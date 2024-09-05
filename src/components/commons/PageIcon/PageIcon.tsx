import FlexCenter from "../../../components/commons/FlexCenter/FlexCenter";
import { ReactElement } from "react";
import { makeStyles } from "tss-react/mui";

interface PageIconProps {
    icon: ReactElement<any>;
    withMargin?: boolean;
}

const PageIcon = (props: PageIconProps) => {
    const { icon, withMargin = true } = props;
    const { classes } = useStyles();
    return <FlexCenter className={withMargin ? classes.spacing : ""}>{icon}</FlexCenter>;
};

const useStyles = makeStyles({ "name": { PageIcon } })(() => ({
    spacing: {
        margin: "3rem 1rem 1rem 1rem",
    },
}));

export default PageIcon;
