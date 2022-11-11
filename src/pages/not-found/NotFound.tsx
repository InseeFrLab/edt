import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <header>{t("page.not-found.not-found")}</header>
        </>
    );
};

export default NotFoundPage;
