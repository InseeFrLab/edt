import meanOfTransportErrorIcon from "assets/illustration/error/mean-of-transport.svg";
import option1 from "assets/illustration/mean-of-transport-categories/1.svg";
import option2 from "assets/illustration/mean-of-transport-categories/2.svg";
import option3 from "assets/illustration/mean-of-transport-categories/3.svg";
import option4 from "assets/illustration/mean-of-transport-categories/4.svg";
import option5 from "assets/illustration/mean-of-transport-categories/5.svg";
import option6 from "assets/illustration/mean-of-transport-categories/6.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { CheckboxGroupSpecificProps } from "lunatic-edt";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";

const MeanOfTransportPage = () => {
    const specifiquesProps: CheckboxGroupSpecificProps = {
        optionsIcons: {
            "1": option1,
            "2": option2,
            "3": option3,
            "4": option4,
            "5": option5,
            "6": option6,
        },
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.MEAN_OF_TRANSPORT}
            labelOfPage={"mean-of-transport-selecter"}
            errorIcon={meanOfTransportErrorIcon}
            specifiquesProps={specifiquesProps}
            isRoute={true}
        />
    );
};

export default MeanOfTransportPage;
