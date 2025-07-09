import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Divider, Popover, Typography } from "@mui/material";
import ArrowBackIosIcon from "../../../../assets/illustration/mui-icon/arrow-back-ios.svg?react";
import MoreHorizontalImage from "../../../../assets/illustration/mui-icon/more-horizontal.svg?react";
import React from "react";
import { useTranslation } from "react-i18next";

interface SurveyPageEditHeaderProps {
    firstName: string;
    firstNamePrefix: string;
    onNavigateBack(): void;
    onEdit?(): void;
    onHelp?(): void;
    modifiable?: boolean;
}

const SurveyPageEditHeader = (props: SurveyPageEditHeaderProps) => {
    const { firstName, firstNamePrefix, onNavigateBack, onEdit, onHelp, modifiable = true } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-or-help-popover" : undefined;

    const handleOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <Box className={classes.headerBox}>
                <Box className={classes.leftPartBox}>
                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBackIosIcon
                                aria-label={t("accessibility.asset.mui-icon.arrow-back-ios")}
                            />
                        }
                        onClick={onNavigateBack}
                        aria-label={t("common.navigation.previous")}
                        className={classes.startIcon}
                    ></Button>
                    <Typography className={classes.infoText}>{firstNamePrefix + firstName}</Typography>
                </Box>
                <Box onClick={handleOpen} onKeyUp={handleOpen}>
                    <MoreHorizontalImage
                        aria-label={t("accessibility.asset.mui-icon.more-horizontal")}
                        className={classes.actionIcon}
                    />
                </Box>
            </Box>
            <Divider light />
            <Popover
                id={id}
                open={openPopOver}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                className={classes.popOver}
            >
                {onEdit && modifiable && (
                    <Typography onClick={onEdit} className={classes.clickableText}>
                        {t("common.navigation.edit")}
                    </Typography>
                )}
                {onHelp && (
                    <Typography onClick={onHelp} className={classes.clickableText}>
                        {t("common.navigation.help")}
                    </Typography>
                )}
            </Popover>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPageEditHeader } })(theme => ({
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: theme.variables.white,
    },
    leftPartBox: {
        display: "flex",
        alignItems: "center",
    },
    startIcon: {
        "& .MuiButton-startIcon": {
            marginLeft: important("0px"),
            marginRight: important("0px"),
            width: important("20px"),
        },
    },
    infoText: {
        marginLeft: "2rem",
        fontSize: "14px",
        fontWeight: "bold",
    },
    actionIcon: {
        cursor: "pointer",
    },
    popOver: {
        "& .MuiBackdrop-root": {
            overflow: "hidden",
        },
        overflow: "hidden",
        "& .MuiPopover-paper": {
            backgroundColor: theme.variables.white,
            padding: "0.5rem",
        },
    },
    clickableText: {
        cursor: "pointer",
        "&:hover": {
            color: theme.palette.primary.light,
        },
    },
}));

export default SurveyPageEditHeader;
