import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxGroupSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getPrintedFirstName, saveData } from "service/survey-service";
import { SetStateAction, useState } from "react";
import calendarWeek from "assets/illustration/kind-of-week-categories/calendar-week.svg";
import kindOfWeek from "assets/illustration/kind-of-week.svg";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getOrchestratorPage } from "service/navigation-service";

const specificProps: CheckboxGroupSpecificProps = {
    optionsIcons: {
        "1": calendarWeek,
        "2": calendarWeek,
        "3": calendarWeek,
    },
};

const validateAndNav = (
    forceQuit: boolean,
    setIsModalDisplayed: (value: SetStateAction<boolean>) => void,
    saveAndGoHome: () => void,
): void => {
    if (forceQuit) {
        saveAndGoHome();
    } else {
        setIsModalDisplayed(true);
    }
};

const KindOfWeekPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const currentPage = EdtRoutesNameEnum.KIND_OF_WEEK;

    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    return (
        <SurveyPage
            validate={() => validateAndNav(false, setIsModalDisplayed, saveAndGoHome)}
            onNavigateBack={() => validateAndNav(false, setIsModalDisplayed, saveAndGoHome)}
            srcIcon={kindOfWeek}
            altIcon={t("accessibility.asset.kind-of-week-alt")}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.complementary-questions.simple-header-label")}
        >
            <FlexCenter>
                <FelicitationModal
                    isModalDisplayed={isModalDisplayed}
                    onCompleteCallBack={() => validateAndNav(true, setIsModalDisplayed, saveAndGoHome)}
                    content={t("component.modal-edt.modal-felicitation.survey-content")}
                />
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getOrchestratorPage(currentPage)}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default KindOfWeekPage;
