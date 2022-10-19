import { useTranslation } from "react-i18next";

const HelpPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <header>Help - {t("home-page.welcome")}</header>
        </>
    );
};

export default HelpPage;
