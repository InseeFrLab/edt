import day_of_survey from "assets/illustration/day-of-survey.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";

const DayOfSurveyPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <FlexCenter>
                <img src={day_of_survey} alt={t("accessibility.asset.day-of-survey-alt")} />
            </FlexCenter>
            <header>Day of Survey</header>
        </>
    );
};

export default DayOfSurveyPage;
