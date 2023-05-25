import meanOfTransportErrorIcon from "assets/illustration/error/mean-of-transport.svg";
import option1 from "assets/illustration/mean-of-transport-categories/1.svg";
import option2 from "assets/illustration/mean-of-transport-categories/2.svg";
import option3 from "assets/illustration/mean-of-transport-categories/3.svg";
import option4 from "assets/illustration/mean-of-transport-categories/4.svg";
import option5 from "assets/illustration/mean-of-transport-categories/5.svg";
import option6 from "assets/illustration/mean-of-transport-categories/6.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { useTranslation } from "react-i18next";
import { getMeanOfTransportRef } from "service/referentiel-service";

const MeanOfTransportPage = () => {
    const { t } = useTranslation();

    const specifiquesProps = {
        optionsIcons: {
            "1": {
                icon: option1,
                altIcon: t("accessibility.assets.mean-of-transport.categories.option1-alt"),
            },
            "2": {
                icon: option2,
                altIcon: t("accessibility.assets.mean-of-transport.categories.option1-alt"),
            },
            "3": {
                icon: option3,
                altIcon: t("accessibility.assets.mean-of-transport.categories.option1-alt"),
            },
            "4": {
                icon: option4,
                altIcon: t("accessibility.assets.mean-of-transport.categories.option1-alt"),
            },
            "5": {
                icon: option5,
                altIcon: t("accessibility.assets.mean-of-transport.categories.option1-alt"),
            },
            "6": {
                icon: option6,
                altIcon: t("accessibility.assets.mean-of-transport.categories.option1-alt"),
            },
        },
        referentiel: getMeanOfTransportRef(),
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.MEAN_OF_TRANSPORT}
            labelOfPage={"mean-of-transport-selecter"}
            errorIcon={meanOfTransportErrorIcon}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default MeanOfTransportPage;
