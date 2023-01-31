import routeErrorIcon from "assets/illustration/error/route.svg";
import option1 from "assets/illustration/route-categories/1.svg";
import option2 from "assets/illustration/route-categories/2.svg";
import option3 from "assets/illustration/route-categories/3.svg";
import option4 from "assets/illustration/route-categories/4.svg";
import option5 from "assets/illustration/route-categories/5.svg";
import option6 from "assets/illustration/route-categories/6.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getRouteRef } from "service/referentiel-service";

const RoutePage = () => {
    const specifiquesProps = {
        optionsIcons: {
            "1": option1,
            "2": option2,
            "3": option3,
            "4": option4,
            "5": option5,
            "6": option6,
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
