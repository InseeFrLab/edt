import { OrchestratorForStories } from "orchestrator/Orchestrator";
import localSource from "questionnaire-edt.json";
import { useTranslation } from "react-i18next";
const OrchestratorPage = () => {
    const { t } = useTranslation();
    /*const [data, setData] = useState(null as LunaticData | null);
    const [source, setSource] = useState(null as object | null);

    useEffect(() => {
        // TODO : this will be used when the questionnaire-edt.json will be available from insee endpoint
        // url will be extracted in a properties file in this moment
        const url =
            "https://pogues-back-office-insee.k8s.keyconsulting.fr/api/persistence/questionnaire/json-lunatic/l8lq5lp6";

        fetch(url)
            .then(sourcePromise => sourcePromise.json())
            .then(source => setSource(source));

        lunaticDatabase.get("edt").then(d => {
            setData(d ? d : {});
        });
    }, []);*/

    return localSource ? (
        <>
            <OrchestratorForStories source={localSource} data={{}}></OrchestratorForStories>
        </>
    ) : (
        <div>{t("component.orchestrator.loading")}</div>
    );
};

export default OrchestratorPage;
