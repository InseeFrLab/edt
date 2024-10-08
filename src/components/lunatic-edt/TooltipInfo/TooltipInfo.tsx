import { IconButton, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { memo } from "react";
import Info from "../Info";
import { InfoProps } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt";

export type TooltipInfoProps = {
    infoLabels: InfoProps;
    titleLabels?: {
        normalTitle: string;
        boldTitle: string;
        typeTitle: string;
    };
    displayTooltip?: boolean;
};

const TooltipInfo = memo((props: TooltipInfoProps) => {
    const { infoLabels, titleLabels, displayTooltip } = props;
    const { classes, cx } = useStyles();

    const [displayInfo, setDisplayInfo] = React.useState<boolean>(false);

    const displayTitle = () => {
        if (titleLabels?.typeTitle == "h1") {
            return <h1 className={cx(classes.titleBold, classes.h1)}>{titleLabels.boldTitle}</h1>;
        } else if (titleLabels?.typeTitle == "h2") {
            return <h2 className={cx(classes.titleBold, classes.h2)}>{titleLabels.boldTitle}</h2>;
        } else {
            return <Typography className={classes.titleBold}>{titleLabels?.boldTitle}</Typography>;
        }
    };

    return (
        <Box className={classes.root}>
            <Box className={titleLabels ? classes.titleBox : classes.headerBox}>
                {titleLabels?.normalTitle && (
                    <Typography className={classes.title}>{titleLabels.normalTitle}</Typography>
                )}
                {titleLabels?.boldTitle && displayTitle()}
                <Tooltip title="Info" className={displayTooltip ? classes.hiddenBox : classes.iconBox}>
                    <IconButton
                        className={classes.iconInfoBox}
                        onClick={() => setDisplayInfo(!displayInfo)}
                    >
                        {infoLabels.infoIconTooltip}
                    </IconButton>
                </Tooltip>
            </Box>

            {infoLabels && (
                <Box className={displayInfo || displayTooltip ? classes.infoBox : classes.hiddenBox}>
                    <Info {...infoLabels} />
                </Box>
            )}
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { TooltipInfo } })(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        fontSize: "14px",
    },
    titleBold: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    headerBox: {
        display: "flex",
        justifyContent: "end",
        padding: "0.5rem",
    },
    titleBox: {
        display: "flex",
    },
    infoBox: {
        display: "flex",
        justifyContent: "center",
    },
    iconBox: {
        padding: "0rem 0.5rem",
    },
    iconInfoBox: {
        svg: {
            color: theme.palette.secondary.main,
            height: "1.5rem",
            width: "1.5rem",
            marginBottom: "2px",
        },
    },
    hiddenBox: {
        display: "none",
    },
    h1: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
    h2: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
}));

export default createCustomizableLunaticField(TooltipInfo, "TooltipInfo");
