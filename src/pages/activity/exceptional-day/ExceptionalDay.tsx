import exceptionalDay from "assets/illustration/exceptional-day.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";

const ExceptionalDayPage = () => {
    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.EXCEPTIONAL_DAY}
            backRoute={EdtRoutesNameEnum.KIND_OF_DAY}
            errorIcon={exceptionalDay}
            errorAltIcon={"accessibility.asset.exceptional-day-alt"}
        />
    );
};

export default ExceptionalDayPage;
