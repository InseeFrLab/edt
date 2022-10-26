import source2 from "local-test-source.json";
import { OrchestratorForStories } from "orchestrator/Orchestrator";
import { useEffect, useState } from "react";
import { LunaticData, lunaticDatabase } from "service/lunatic-database";
const OrchestratorPage = () => {
    const [data, setData] = useState(null as LunaticData | null);
    const [source, setSource] = useState(null as object | null);

    useEffect(() => {
        // this is temporary !!! TODO : replace when we know how we shoulmd do it ! This was to prenvent a source.json in the repo
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
