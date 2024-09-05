import BagIcon from "../../../assets/illustration/type-of-day-categories/bag.svg?react";
import SurveyPageStep from "../../../components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "../../../enumerations/EdtRoutesNameEnum";
import { t } from "i18next";
import { getKindOfDayRef } from "../../../service/referentiel-service";

const KindOfDayPage = () => {
    const specifiquesProps = {
        icon: <BagIcon aria-label={t("accessibility.asset.kind-of-day-alt")} />,
        referentiel: getKindOfDayRef(),
    };

    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.KIND_OF_DAY}
            backRoute={EdtRoutesNameEnum.WORST_ACTIVITY_DAY}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default KindOfDayPage;
