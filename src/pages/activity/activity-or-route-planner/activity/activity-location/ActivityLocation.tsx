import locationErrorIcon from "assets/illustration/error/location.svg";
import option1 from "assets/illustration/locations/1.svg";
import option2 from "assets/illustration/locations/2.svg";
import option3 from "assets/illustration/locations/3.svg";
import option4 from "assets/illustration/locations/4.svg";
import option5 from "assets/illustration/locations/5.svg";
import option6 from "assets/illustration/locations/6.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { useTranslation } from "react-i18next";
import { getPlaceRef } from "service/referentiel-service";

const ActivityLocationPage = () => {
    const { t } = useTranslation();
    const specifiquesProps = {
        optionsIcons: {
            "11": { icon: option1, altIcon: t("accessibility.assets.place.categories.option1-alt") },
            "12": { icon: option2, altIcon: t("accessibility.assets.place.categories.option1-alt") },
            "14": { icon: option3, altIcon: t("accessibility.assets.place.categories.option1-alt") },
            "15": { icon: option4, altIcon: t("accessibility.assets.place.categories.option1-alt") },
            "13": { icon: option5, altIcon: t("accessibility.assets.place.categories.option1-alt") },
            "16": { icon: option6, altIcon: t("accessibility.assets.place.categories.option1-alt") },
        },
        referentiel: getPlaceRef(),
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.ACTIVITY_LOCATION}
            labelOfPage={"location-selecter"}
            errorIcon={locationErrorIcon}
            backRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
            fieldConditionBack={FieldNameEnum.WITHSECONDARYACTIVITY}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default ActivityLocationPage;
