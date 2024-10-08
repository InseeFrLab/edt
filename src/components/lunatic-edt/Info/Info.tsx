import { Box } from "@mui/system";
import { memo } from "react";
import { InfoProps } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt";

const Info = memo((props: InfoProps) => {
    const {
        normalText,
        boldText,
        infoIcon,
        border,
        isAlertInfo,
        infoIconTop = false,
        boldFirst = false,
    } = props;
    const { classes, cx } = useStyles();

    return (
        <Box
            className={cx(
                classes.root,
                border ? classes.borderDashedBox : "",
                isAlertInfo ? classes.alert : classes.info,
            )}
        >
            {infoIconTop && infoIcon && <Box className={classes.iconContainerTop}>{infoIcon}</Box>}
            <Box className={cx(classes.titleWithIcon)}>
                {!infoIconTop && infoIcon && <Box className={classes.iconContainer}>{infoIcon}</Box>}
                <Box>
                    {boldText && boldFirst && (
                        <Box>
                            <p className={classes.textBold}>{boldText}</p>
                        </Box>
                    )}
                    {normalText && (
                        <Box>
                            <p className={classes.text}>{normalText}</p>
                        </Box>
                    )}
                    {boldText && !boldFirst && (
                        <Box>
                            <p className={classes.textBold}>{boldText}</p>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { Info } })(theme => ({
    root: {
        border: "1px dashed " + theme.variables.neutral,
        borderRadius: "13px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "520px",
        padding: "0.5rem 0.5rem 0.5rem 0",
        marginTop: "1rem",
    },
    titleWithIcon: {
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    iconContainer: {
        width: "55px",
        minWidth: "55px",
        display: "flex",
        justifyContent: "center",
        alignSelf: "center",
    },
    iconContainerTop: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "1rem",
    },
    text: {
        fontSize: "12px",
    },
    textBold: {
        fontSize: "12px",
        fontWeight: "bold",
    },
    borderDashedBox: {
        borderStyle: "dashed",
    },
    alert: {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main,
    },
    info: {
        backgroundColor: theme.variables.white,
        color: theme.palette.action.hover,
        borderColor: theme.palette.primary.main,
    },
}));

export default createCustomizableLunaticField(Info, "Info");
