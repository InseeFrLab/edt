import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";

const PhoneTimePage = () => {
    const specifiquesProps = {
        displayModal: true,
    };

    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.PHONE_TIME}
            backRoute={EdtRoutesNameEnum.TRAVEL_TIME}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default PhoneTimePage;
