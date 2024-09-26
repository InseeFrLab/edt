import { Button, CircularProgress } from "@mui/material";
import ReminderNoteImg from "../../../assets/illustration/reminder-note.svg";
import FlexCenter from "../../../components/commons/FlexCenter/FlexCenter";
import PageIcon from "../../../components/commons/PageIcon/PageIcon";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import PowerSettingsIcon from "../../../assets/illustration/mui-icon/power-settings.svg?react";
import { useAuth } from "../../../hooks/useAuth.ts";

interface LoadingFullProps {
    message: string;
    thanking?: string;
}

const LoadingFull = (props: LoadingFullProps) => {
    const { message, thanking } = props;
    const { t } = useTranslation();
    const { classes } = useStyles({});
    const { logout } = useAuth();

    return (
        <>
            <FlexCenter>
                <PageIcon
                    icon={
                        <img src={ReminderNoteImg} alt={t("accessibility.asset.reminder-notes-alt")} />
                    }
                />
            </FlexCenter>
            <FlexCenter>
                <CircularProgress thickness={2} className={classes.loading} />
            </FlexCenter>
            <FlexCenter>
                <h2 className={classes.centerMobile}>{message}</h2>
            </FlexCenter>
            <FlexCenter>{thanking ? <h3>{thanking}</h3> : <></>}</FlexCenter>

            <FlexCenter>
                <Button
                    color="secondary"
                    startIcon={
                        <PowerSettingsIcon
                            aria-label={t("accessibility.asset.mui-icon.power-settings")}
                        />
                    }
                    onClick={logout}
                    id={"button-logout"}
                >
                    {t("page.home.navigation.logout")}
                </Button>
            </FlexCenter>
        </>
    );
};

const useStyles = makeStyles<{}>()(() => ({
    loading: {
        width: "117px !important",
        height: "117px !important",
    },
    centerMobile: {
        width: "100%",
        textAlign: "center",
    },
}));

export default LoadingFull;
