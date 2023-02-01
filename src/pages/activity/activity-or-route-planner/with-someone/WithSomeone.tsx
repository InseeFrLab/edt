import peopleErrorIcon from "assets/illustration/error/people.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { FieldNameEnum } from "service/survey-service";

const WithSomeonePage = () => {
    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.WITH_SOMEONE}
            labelOfPage={"with-someone-selecter"}
            errorIcon={peopleErrorIcon}
            backRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
            nextRoute={EdtRoutesNameEnum.WITH_SOMEONE_SELECTION}
            fieldConditionBack={FieldNameEnum.WITHSECONDARYACTIVITY}
            fieldConditionNext={FieldNameEnum.WITHSOMEONE}
        />
    );
};

export default WithSomeonePage;
