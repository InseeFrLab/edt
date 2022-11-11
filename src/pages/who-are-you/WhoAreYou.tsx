import { Button } from "@mui/material";
import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";

const WhoAreYouPage = () => {
    const { t } = useTranslation();

    const validate = () => {
        console.log("navigate and orchestrator");
    };

    return (
        <>
            <FlexCenter>
                <img src={who_are_you} alt={t("accessibility.asset.who-are-you-alt")} />
            </FlexCenter>
            <header>Who are You</header>

            <FlexCenter>
                <Button variant="contained" onClick={validate}>
                    {t("common.navigation.validate")}
                </Button>
            </FlexCenter>
        </>
    );
};

export default WhoAreYouPage;
