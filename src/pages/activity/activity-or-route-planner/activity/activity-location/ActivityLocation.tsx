import locationErrorIcon from "assets/illustration/error/location.svg";
import option1 from "assets/illustration/locations/1.svg";
import option2 from "assets/illustration/locations/2.svg";
import option3 from "assets/illustration/locations/3.svg";
import option4 from "assets/illustration/locations/4.svg";
import option5 from "assets/illustration/locations/5.svg";
import option6 from "assets/illustration/locations/6.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getPlaceRef } from "service/referentiel-service";
import { FieldNameEnum } from "service/survey-service";

const ActivityLocationPage = () => {
    const specifiquesProps = {
        optionsIcons: {
            "11": option1,
            "12": option2,
            "14": option3,
            "15": option4,
            "13": option5,
            "16": option6,
        },
        referentiel: getPlaceRef(),
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.ACTIVITY_LOCATION}
            labelOfPage={"location-selecter"}
            errorIcon={locationErrorIcon}
            backRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
            fieldCondition={FieldNameEnum.WITHSECONDARYACTIVITY}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default ActivityLocationPage;
