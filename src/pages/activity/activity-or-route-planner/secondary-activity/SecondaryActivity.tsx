import activityErrorIcon from "assets/illustration/error/activity.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { FieldNameEnum } from "service/survey-service";

const SecondaryActivityPage = () => {
    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.SECONDARY_ACTIVITY}
            labelOfPage={"secondary-activity-selecter"}
            errorIcon={activityErrorIcon}
            backRoute={EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL}
            nextRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
            fieldConditionBack={FieldNameEnum.GOAL}
            fieldConditionNext={FieldNameEnum.WITHSECONDARYACTIVITY}
        />
    );
};

export default SecondaryActivityPage;
