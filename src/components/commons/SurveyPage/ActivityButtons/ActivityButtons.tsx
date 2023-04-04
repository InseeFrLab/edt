import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button } from "@mui/material";
import add from "assets/illustration/mui-icon/add.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";
import { isDesktop } from "service/responsive";

interface ActivityButtonsProps {
    onClickFinish(): void;
    onClickAdd(): void;
    finishLabel?: string;
    addLabel?: string;
}

const ActivityButtons = (props: ActivityButtonsProps) => {
    const { onClickFinish, onClickAdd, finishLabel, addLabel } = props;
    const { classes, cx } = useStyles();
    const isItDesktop = isDesktop();
    const { t } = useTranslation();
    return (
        <>
            {!isItDesktop && <Box className={classes.gap}></Box>}
            <FlexCenter
                className={cx(classes.ButtonsBox, isItDesktop ? "" : classes.ButtonsBoxMobileTablet)}
            >
                <>
                    {!addLabel && (
                        <Button variant="outlined" onClick={onClickFinish} className={classes.buttons}>
                            {finishLabel}
                        </Button>
                    )}
                </>
                <Button
                    variant="contained"
                    onClick={onClickAdd}
                    className={addLabel === undefined ? classes.buttons : classes.aloneAddButton}
                >
                    <img src={add} alt={t("accessibility.asset.mui-icon.add")} />
                    {addLabel}
                </Button>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityButtons } })(theme => ({
    gap: {
        height: "5rem",
        width: "100%",
    },
    ButtonsBox: {
        width: "100%",
        backgroundColor: theme.variables.white,
        padding: "0.75rem",
    },
    ButtonsBoxMobileTablet: {
        position: "fixed",
        left: "0",
        bottom: "0",
    },
    aloneAddButton: {
        width: "80%",
        maxWidth: "18rem",
    },
    buttons: {
        width: "40%",
        maxWidth: "9rem",
        margin: "0 1rem",
        lineHeight: "1.25rem",
    },
}));

export default ActivityButtons;
