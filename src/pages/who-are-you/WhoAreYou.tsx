import who_are_you from "assets/illustration/who-are-you.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";

const WhoAreYouPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <FlexCenter>
                <img src={who_are_you} alt={t("asset.who-are-you-alt")} />
            </FlexCenter>
            <header>Who are You -{t("home-page.welcome")}</header>
        </>
    );
};

export default WhoAreYouPage;
