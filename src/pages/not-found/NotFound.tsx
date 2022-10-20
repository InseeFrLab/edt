import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <header>{t("not-found-page.not-found")}</header>
        </>
    );
};

export default NotFoundPage;
