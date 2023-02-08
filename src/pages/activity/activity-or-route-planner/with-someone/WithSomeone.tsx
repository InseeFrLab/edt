import peopleErrorIcon from "assets/illustration/error/people.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";

const WithSomeonePage = () => {
    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.WITH_SOMEONE}
            labelOfPage={"with-someone-selecter"}
            errorIcon={peopleErrorIcon}
            backRoute={EdtRoutesNameEnum.ACTIVITY_LOCATION}
            nextRoute={EdtRoutesNameEnum.WITH_SOMEONE_SELECTION}
            fieldConditionBack={FieldNameEnum.WITHSECONDARYACTIVITY}
            fieldConditionNext={FieldNameEnum.WITHSOMEONE}
        />
    );
};

export default WithSomeonePage;
