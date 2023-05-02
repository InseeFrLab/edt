import routeErrorIcon from "assets/illustration/error/route.svg";
import option1 from "assets/illustration/route-categories/1.svg";
import option2 from "assets/illustration/route-categories/2.svg";
import option3 from "assets/illustration/route-categories/3.svg";
import option4 from "assets/illustration/route-categories/4.svg";
import option5 from "assets/illustration/route-categories/5.svg";
import option6 from "assets/illustration/route-categories/6.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { useTranslation } from "react-i18next";
import { getRouteRef } from "service/referentiel-service";

const RoutePage = () => {
    const { t } = useTranslation();

    const specifiquesProps = {
        optionsIcons: {
            "1": { icon: option1, altIcon: t("accessibility.asset.route.categories.option1-alt") },
            "2": { icon: option2, altIcon: t("accessibility.asset.route.categories.option1-alt") },
            "3": { icon: option3, altIcon: t("accessibility.asset.route.categories.option1-alt") },
            "4": { icon: option4, altIcon: t("accessibility.asset.route.categories.option1-alt") },
            "5": { icon: option5, altIcon: t("accessibility.asset.route.categories.option1-alt") },
            "6": { icon: option6, altIcon: t("accessibility.asset.route.categories.option1-alt") },
        },
        referentiel: getRouteRef(),
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.ROUTE}
            labelOfPage={"route-selecter"}
            errorIcon={routeErrorIcon}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default RoutePage;
