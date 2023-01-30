import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";

import errorIcon from "assets/illustration/error/activity.svg";
import option1 from "assets/illustration/goals/1.svg";
import option2 from "assets/illustration/goals/2.svg";
import option3 from "assets/illustration/goals/3.svg";
import option4 from "assets/illustration/goals/4.svg";

import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";

const MainActivityGoalPage = () => {
    const specifiquesProps = {
        optionsIcons: {
            "1": option1,
            "2": option2,
            "3": option3,
            "4": option4,
        },
        displayStepper: true,
        currentStepLabel: "component.add-activity-stepper.step-2-label",
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL}
            labelOfPage={"goal-selecter"}
            errorIcon={errorIcon}
            backRoute={EdtRoutesNameEnum.MAIN_ACTIVITY}
            nextRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default MainActivityGoalPage;
