import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, Divider, Popover, Typography } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface SurveyPageEditHeaderProps {
    firstName: string;
    firstNamePrefix: string;
    onNavigateBack(): void;
    onEdit(): void;
    onHelp(): void;
}

const SurveyPageEditHeader = (props: SurveyPageEditHeaderProps) => {
    const { firstName, firstNamePrefix, onNavigateBack, onEdit, onHelp } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPopOver = Boolean(anchorEl);
    const id = openPopOver ? "edit-or-help-popover" : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onEditSurvey = useCallback((e: any) => {
        setAnchorEl(e.currentTarget);
    }, []);

    return (
        <>
            <Box className={classes.headerBox}>
                <Box className={classes.leftPartBox}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIosNewIcon />}
                        onClick={onNavigateBack}
                        aria-label={t("common.navigation.previous")}
                    ></Button>
                    <Typography className={classes.infoText}>{firstNamePrefix + firstName}</Typography>
                </Box>
                <Box>
                    <MoreHorizIcon className={classes.actionIcon} onClick={onEditSurvey}></MoreHorizIcon>
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
                        <Typography onClick={onEdit} className={classes.clickableText}>
                            {t("common.navigation.edit")}
                        </Typography>
                        <Typography onClick={onHelp} className={classes.clickableText}>
                            {t("common.navigation.help")}
                        </Typography>
                    </Popover>
                </Box>
            </Box>
            <Divider light className={classes.dividerBox} />
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPageEditHeader } })(theme => ({
    headerBox: {
        display: "flex",
        flexGrow: "1",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: theme.variables.white,
    },
    leftPartBox: {
        display: "flex",
        alignItems: "center",
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
    dividerBox: {
        marginBottom: "1rem",
    },
}));

export default SurveyPageEditHeader;
