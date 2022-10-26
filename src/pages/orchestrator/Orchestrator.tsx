import { OrchestratorForStories } from "orchestrator/Orchestrator";
import source2 from "questionnaire-edt.json";
import { useEffect, useState } from "react";
import { LunaticData, lunaticDatabase } from "service/lunatic-database";
const OrchestratorPage = () => {
    const [data, setData] = useState(null as LunaticData | null);
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
    }, []);

    return source && data ? (
        <>
            <OrchestratorForStories source={source2} data={data}></OrchestratorForStories>
        </>
    ) : (
        <div>Chargement du questionnaire lunatic...</div>
    );
};

export default OrchestratorPage;
