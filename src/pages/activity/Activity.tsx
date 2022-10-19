import { useTranslation } from "react-i18next";

const ActivityPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <header>Activity -{t("home-page.welcome")}</header>
        </>
    );
};

export default ActivityPage;
