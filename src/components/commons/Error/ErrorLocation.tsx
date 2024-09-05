import LocationErrorImg from "../../../assets/illustration/error/location.svg?react";
import Error from "../../../components/commons/Error/Error";
import { useTranslation } from "react-i18next";

interface ErrorLocationProps {
    onIgnore(): void;
    onComplete(): void;
}

const ErrorLocation = (props: ErrorLocationProps) => {
    const { onIgnore, onComplete } = props;
    const { t } = useTranslation();

    return (
        <Error
            labelledBy={""}
            describedBy={""}
            errorMessage={t("common.error.error-location.message")}
            icon={<LocationErrorImg aria-label={t("asset.error.location-error-alt")} />}
            onIgnore={onIgnore}
            onComplete={onComplete}
        />
    );
};

export default ErrorLocation;
