import errorIcon from "assets/illustration/error/activity.svg";
import childIcon from "assets/illustration/with-someone-categories/child.svg";
import coupleIcon from "assets/illustration/with-someone-categories/couple.svg";
import otherKnownIcon from "assets/illustration/with-someone-categories/other-known.svg";
import otherIcon from "assets/illustration/with-someone-categories/other.svg";
import parentsIcon from "assets/illustration/with-someone-categories/parents.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { useTranslation } from "react-i18next";

const WithSomeoneSelectionPage = () => {
    const { t } = useTranslation();

    const specifiquesProps = {
        optionsIcons: {
            "1": {
                icon: coupleIcon,
                altIcon: t("accessibility.assets.with-someone.categories.couple-alt"),
            },
            "2": {
                icon: parentsIcon,
                altIcon: t("accessibility.assets.with-someone.categories.parents-alt"),
            },
            "3": {
                icon: childIcon,
                altIcon: t("accessibility.assets.with-someone.categories.child-alt"),
            },
            "4": {
                icon: otherKnownIcon,
                altIcon: t("accessibility.assets.with-someone.categories.other-know-alt"),
            },
            "5": {
                icon: otherIcon,
                altIcon: t("accessibility.assets.with-someone.categories.other-alt"),
            },
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
