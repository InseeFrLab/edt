import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Button, Divider, Popover, Typography } from "@mui/material";
import arrowBackIos from "assets/illustration/mui-icon/arrow-back-ios.svg";
import moreHorizontal from "assets/illustration/mui-icon/more-horizontal.svg";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface SurveyPageEditHeaderProps {
    firstName: string;
    firstNamePrefix: string;
    onNavigateBack(): void;
    onEdit?(): void;
    onHelp?(): void;
}

const SurveyPageEditHeader = (props: SurveyPageEditHeaderProps) => {
    const { firstName, firstNamePrefix, onNavigateBack, onEdit, onHelp } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-or-help-popover" : undefined;

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [anchorEl]);

    const onEditSurvey = useCallback((e: any) => {
        setAnchorEl(e.currentTarget);
    }, []);

    return (
        <>
            <Box className={classes.headerBox}>
                <Box className={classes.leftPartBox}>
                    <Button
                        variant="outlined"
                        startIcon={
                            <img
                                src={arrowBackIos}
                                alt={t("accessibility.asset.mui-icon.arrow-back-ios")}
                            />
                        }
                        onClick={onNavigateBack}
                        aria-label={t("common.navigation.previous")}
                        className={classes.startIcon}
                    ></Button>
                    <Typography className={classes.infoText}>{firstNamePrefix + firstName}</Typography>
                </Box>
                <Box>
                    <img
                        src={moreHorizontal}
                        alt={t("accessibility.asset.mui-icon.more-horizontal")}
                        className={classes.actionIcon}
                        onClick={onEditSurvey}
                    />
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
                        {onEdit && (
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
                </Box>
            </Box>
            <Divider light />
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
            width: important("10px"),
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
