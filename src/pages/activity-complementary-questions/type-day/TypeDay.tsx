import bagIcon from "assets/illustration/type-of-day-categories/bag.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxGroupSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getCurrentNavigatePath, getFullNavigatePath } from "service/navigation-service";
import { getStepData } from "service/stepper.service";
import { getPrintedFirstName, saveData } from "service/survey-service";

const TypeDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.TYPE_DAY;
    const stepData = getStepData(currentPage);

    const specificProps: CheckboxGroupSpecificProps = {
        optionsIcons: {
            "1": bagIcon,
            "2": bagIcon,
            "3": bagIcon,
            "4": bagIcon,
        },
    };

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getCurrentNavigatePath(
                    context.idSurvey,
                    EdtRoutesNameEnum.ACTIVITY,
                    context.source.maxPage,
                    undefined,
                    undefined,
                    false,
                    8,
                ),
            );
        });
    };

    const onPrevious = (e: React.MouseEvent) => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getFullNavigatePath(context.idSurvey, EdtRoutesNameEnum.WORST_ACTIVITY_DAY));
        });
    };

    const onClose = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    return (
        <SurveyPage
            onNavigateBack={onClose}
            onNext={saveAndGoHome}
            onPrevious={onPrevious}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.kind-of-week.simple-header-label")}
            displayStepper={true}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    componentSpecificProps={specificProps}
                    page="7"
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default TypeDayPage;
