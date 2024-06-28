import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import ErrorPage from "./Error";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { Box, Button, Typography } from "@mui/material";
import { ReactComponent as HomeIcon } from "assets/illustration/mui-icon/home.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as DefaultErrorIcon } from "assets/illustration/error/error.svg";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { useAuth } from "oidc-react";

export type ErrorProviderProps = {
    errorCode?: ErrorCodeEnum;
    error?: Error;
    resetErrorBoundary?: () => void;
};
const navToHome = () => {
    window.location.href = "/";
};

const ErrorProvider = ({ errorCode, error }: ErrorProviderProps) => {
    const { t } = useTranslation();
    const { classes } = useStyles();
    const auth = useAuth();

    return (
        <>
            {error ? (
                <>
                    <PageIcon
                        icon={<DefaultErrorIcon aria-label={t("accessibility.asset.error.default")} />}
                    />
                    <Box className={classes.textBox}>
                        <Typography>{t("common.error.error-default-title")}</Typography>
                        <br />
                        <Typography>{t("common.error.error-default")}</Typography>
                        <br />
                        <Typography>
                            {t("common.error.error-user-info") +
                                auth.userData?.profile?.preferred_username}
                        </Typography>
                    </Box>

                    <FlexCenter>
                        <Box className={classes.buttonBox}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                startIcon={
                                    <HomeIcon
                                        aria-label={t("accessibility.asset.mui-icon.power-settings")}
                                    />
                                }
                                onClick={navToHome}
                            >
                                {t("common.navigation.back-to-home")}
                            </Button>
                        </Box>
                    </FlexCenter>
                </>
            ) : (
                <ErrorPage errorCode={errorCode || ErrorCodeEnum.COMMON} atBoundary={true} />
            )}
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
    button: {
        margin: "0.25rem",
    },
    buttonBox: {
        marginTop: "4rem",
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        justifyContent: "center",
    },
}));
export default ErrorProvider;
