import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";

const TravelTimePage = () => {
    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.TRAVEL_TIME}
            backRoute={EdtRoutesNameEnum.EXCEPTIONAL_DAY}
        />
    );
};

export default TravelTimePage;
