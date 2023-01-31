import errorIcon from "assets/illustration/error/activity.svg";
import childIcon from "assets/illustration/with-someone-categories/child.svg";
import coupleIcon from "assets/illustration/with-someone-categories/couple.svg";
import otherKnownIcon from "assets/illustration/with-someone-categories/other-known.svg";
import otherIcon from "assets/illustration/with-someone-categories/other.svg";
import parentsIcon from "assets/illustration/with-someone-categories/parents.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";

const WithSomeoneSelectionPage = () => {
    const specifiquesProps = {
        optionsIcons: {
            "1": coupleIcon,
            "2": parentsIcon,
            "3": childIcon,
            "4": otherKnownIcon,
            "5": otherIcon,
        },
        displayStepper: false,
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.WITH_SOMEONE_SELECTION}
            labelOfPage={"with-someone-selecter"}
            errorIcon={errorIcon}
            backRoute={EdtRoutesNameEnum.WITH_SOMEONE}
            nextRoute={EdtRoutesNameEnum.WITH_SCREEN}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default WithSomeoneSelectionPage;
