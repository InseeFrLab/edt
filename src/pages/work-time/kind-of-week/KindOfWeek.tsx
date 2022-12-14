import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxGroupSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getPrintedFirstName, saveData } from "service/survey-service";
import calendarWeek from "assets/illustration/kind-of-week-categories/calendar-week.svg";
import kindOfWeek from "assets/illustration/kind-of-week.svg";

const specificProps: CheckboxGroupSpecificProps = {
    optionsIcons: {
        "1": calendarWeek,
        "2": calendarWeek,
        "3": calendarWeek,
    },
};

const KindOfWeekPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    const validateAndNav = (): void => {
        saveAndGoHome();
    };

    return (
        <SurveyPage
            validate={validateAndNav}
            onNavigateBack={validateAndNav}
            srcIcon={kindOfWeek}
            altIcon={t("accessibility.asset.kind-of-week-alt")}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.kind-of-week.simple-header-label")}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page="4"
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default KindOfWeekPage;
