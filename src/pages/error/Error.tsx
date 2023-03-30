import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import HomeIcon from "@mui/icons-material/Home";
import ReplayIcon from "@mui/icons-material/Replay";
import { Box, Button, Typography } from "@mui/material";
import defaultErrorIcon from "assets/illustration/error/error.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";

export type ErrorPageProps = {
    errorCode?: ErrorCodeEnum;
    atInit?: boolean;
};

const ErrorPage = (props: ErrorPageProps) => {
    const { errorCode, atInit } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    let navigate: NavigateFunction | undefined = undefined;
    if (!atInit) {
        navigate = useNavigate();
    }

    const navToHome = () => {
        if (navigate) {
            navigate("/");
        }
    };

    const retryInitialize = () => {
        window.location.href = window.location.origin;
    };

    const getErrorText = (errorCode: ErrorCodeEnum | undefined): string => {
        if (errorCode === ErrorCodeEnum.NO_RIGHTS) {
            return t("common.error.error-no-rights");
        } else {
            return t("common.error.error-default");
        }
    };

    const getErrorActionButton = (errorCode: ErrorCodeEnum | undefined) => {
        if (errorCode === ErrorCodeEnum.NO_RIGHTS) {
            return (
                <Button
                    variant="contained"
                    startIcon={<ReplayIcon />}
                    onClick={useCallback(() => retryInitialize(), [])}
                >
                    {t("common.navigation.retry")}
                </Button>
            );
        } else {
            return (
                <Button
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={useCallback(() => navToHome, [])}
                >
                    {t("common.navigation.back-to-home")}
                </Button>
            );
        }
    };

    return (
        <>
            <PageIcon srcIcon={defaultErrorIcon} altIcon={t("accessibility.asset.error.default")} />
            <Box className={classes.textBox}>
                <Typography>{t("common.error.error-default-title")}</Typography>
                <br />
                <Typography>{getErrorText(errorCode)}</Typography>
            </Box>
            <FlexCenter className={classes.buttonBox}>{getErrorActionButton(errorCode)}</FlexCenter>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ErrorPage } })(theme => ({
    textBox: {
        display: "flex",
        flexDirection: "column",
        color: theme.palette.error.main,
        textAlign: "center",
    },
    buttonBox: {
        marginTop: "4rem",
    },
}));

export default ErrorPage;
