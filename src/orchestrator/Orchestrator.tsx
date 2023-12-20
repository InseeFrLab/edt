import * as lunatic from "@inseefr/lunatic";
import * as lunaticEDT from "@inseefrlab/lunatic-edt";
import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, CircularProgress } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LunaticData, LunaticModel } from "interface/lunatic/Lunatic";
import React from "react";
import { isReviewer } from "service/user-service";

const { ...edtComponents } = lunaticEDT;

//notLunaticComponents contains all components that don't come directly from lunatic.
lunaticEDT.notLunaticComponents.forEach((component: React.MemoExoticComponent<any>, name: string) => {
    lunatic[name] = component;
});

export const callbackHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } } = {
    getData: () => {
        return {};
    },
    getErrors: () => {
        return {};
    },
};

export type OrchestratorProps = {
    source?: LunaticModel;
    data?: LunaticData;
    cbHolder: { getData(): LunaticData; getErrors(): { [key: string]: [] } };
    page: string;
    subPage?: string;
    iteration?: number;
    componentSpecificProps?: any;
    overrideOptions?: any;
    idSurvey?: string;
};

const renderLoading = () => {
    return (
        <FlexCenter>
            <CircularProgress />
        </FlexCenter>
    );
};

const getDataOfLoop = (collected: any, editedSaved: any, iteration: number | undefined) => {
    let maxLenght = Number(localStorage.getItem("loopSize") ?? 0);
    for (let i = 0; i < maxLenght; i++) {
        if (i != iteration || (collected[i] == null && i == iteration)) {
            collected[i] = editedSaved[i];
        }
    }
    return collected;
};

const getDataOfCurrentBinding = (
    collected: any,
    edited: any,
    collectedSaved: any,
    editedSaved: any,
    dataOfField: any,
    iteration: number | undefined,
) => {
    // partie collected dejà set (mode enquete) -> set values of collected (value current lunawtic) to edited
    // and collected remains with the collected value on bdd
    if (collected) {
        if (editedSaved && Array.isArray(collected)) {
            collected = getDataOfLoop(collected, editedSaved, iteration);
        }
        dataOfField.EDITED = collected;
        dataOfField.COLLECTED = collectedSaved;
    } else if (dataOfField) {
        dataOfField.EDITED = edited ?? editedSaved;
        dataOfField.COLLECTED = collectedSaved;
    }

    return dataOfField;
};

const isPropOfActivityCurrent = (prop: string, bindings: string[]) => {
    return prop != FieldNameEnum.WEEKLYPLANNER && bindings != null && bindings.includes(prop);
};

const isPropActivity = (prop: string, dataOfField: any) => {
    return prop != FieldNameEnum.WEEKLYPLANNER && dataOfField;
};

const isPropWorktime = (prop: string, dataOfField: any) => {
    return prop == FieldNameEnum.WEEKLYPLANNER && dataOfField;
};

const copyObject = (object: any) => {
    if (object == null) return object;
    return Array.isArray(object) ? [...object] : JSON.parse(JSON.stringify(object));
}

const getDataReviewer = (
    getData: any,
    data: LunaticData | undefined,
    components: any,
    iteration: number | undefined,
) => {
    const callbackholder = getData();
    const dataCollected = callbackholder.COLLECTED;
    const bindings: string[] = components?.filter(
        (component: any) => component.componentType != "Sequence",
    )[0]?.bindingDependencies;
    // data -> get of bdd, callbackholder -> lunatic / current
    if (callbackholder && dataCollected) {
        for (let prop in FieldNameEnum as any) {
            let dataOfField = dataCollected[prop];
            const collected = dataOfField?.COLLECTED;
            const previous = dataOfField?.PREVIOUS;
            const edited = dataOfField?.EDITED;
            const editedSaved = data?.COLLECTED?.[prop]?.EDITED;
            const previousSaved = data?.COLLECTED?.[prop]?.PREVIOUS;
            const collectedSaved = data?.COLLECTED?.[prop]?.COLLECTED;
            //prop activity + prop currently being edited
            if (isPropOfActivityCurrent(prop, bindings)) {
                dataOfField = getDataOfCurrentBinding(
                    copyObject(collected),
                    copyObject(edited),
                    copyObject(collectedSaved),
                    copyObject(editedSaved),
                    dataOfField,
                    iteration,
                );
                dataOfField.PREVIOUS = copyObject(previousSaved);
            } else if (isPropActivity(prop, dataOfField)) {
                //prop activity + prop not currently being edited, so edited get value of edited in bdd, and collected get value of partie collected in bdd
                dataOfField.EDITED = copyObject(editedSaved);
                dataOfField.COLLECTED = copyObject(collectedSaved);
                dataOfField.PREVIOUS = copyObject(previousSaved);
            }
            //if weekly planner, doesn't distinction edited/collected, so edited/collected get value of collected
            if (isPropWorktime(prop, dataOfField)) {
                dataOfField.EDITED = collected;
                dataOfField.COLLECTED = collected;
                dataOfField.PREVIOUS = collected;
            }
        }
    }
    callbackholder.COLLECTED = dataCollected;
    return callbackholder;
};

const getDataInterviewer = (getData: any, data: LunaticData | undefined) => {
    const callbackholder = getData();
    const dataCollected = callbackholder.COLLECTED;
    //dataCollected values get of lunatic
    if (callbackholder && dataCollected) {
        for (let prop in FieldNameEnum as any) {
            const dataOfField = dataCollected[prop];
            //set values edited with values in bdd, because we don't recover the edited part with lunatic
            if (dataOfField) {
                dataOfField.EDITED = data?.COLLECTED?.[prop]?.EDITED;
                dataOfField.PREVIOUS = data?.COLLECTED?.[prop]?.COLLECTED;
            }
        }
    }
    callbackholder.COLLECTED = dataCollected;
    return callbackholder;
};

const getBindingDependencies = (components: any) => {
    let bindings =
        components.filter((component: any) => component.componentType != "Sequence")[0]
            ?.bindingDependencies ?? [];
    return bindings;
};

const getVariables = (
    data: LunaticData | undefined,
    iteration: number | undefined,
    bindingDependencies: string[],
    value: any,
) => {
    let variables = new Map<string, any>();
    const isReviewerMode = isReviewer();
    const isLocked = data?.COLLECTED?.[FieldNameEnum.ISLOCKED]?.COLLECTED;

    bindingDependencies?.forEach((bindingDependency: string) => {
        let varE = data?.COLLECTED?.[bindingDependency]?.EDITED;
        let varC = data?.COLLECTED?.[bindingDependency]?.COLLECTED;

        const variableEdited = iteration != null && varE && Array.isArray(varE) ? varE[iteration] : varE;
        let variableCollected = iteration != null && Array.isArray(varC) ? varC[iteration] : varC;
        variableCollected = variableCollected ?? value?.[bindingDependency];
        let variable =
            isReviewerMode || isLocked ? variableEdited ?? variableCollected : variableCollected;

        variables.set(bindingDependency, variable);
    });

    return variables;
};

export const OrchestratorForStories = (props: OrchestratorProps) => {
    const {
        source,
        data,
        cbHolder,
        page,
        subPage,
        iteration,
        componentSpecificProps,
        overrideOptions,
        idSurvey,
    } = props;
    const { classes, cx } = useStyles();
    const { getComponents, getCurrentErrors, getData } = lunatic.useLunatic(source, data, {
        initialPage:
            page +
            (subPage === undefined ? "" : `.${subPage}`) +
            (iteration === undefined ? "" : `#${iteration + 1}`),
        activeControls: false,
    });

    const components = getComponents();
    const currentErrors = getCurrentErrors();

    const getDataLocal = () => {
        return isReviewer()
            ? getDataReviewer(getData, data, components, iteration)
            : getDataInterviewer(getData, data);
    };

    cbHolder.getData = getDataLocal;
    cbHolder.getErrors = getCurrentErrors;

    const renderComponent = () => {
        return (
            <Box className={classes.orchestratorBox}>
                <div
                    className={cx(
                        "components",
                        classes.styleOverride,
                        window.innerWidth <= 667 && componentSpecificProps.widthGlobal
                            ? classes.styleOverrideMobile
                            : "",
                    )}
                >
                    {components.map(function (component: any) {
                        const { id, componentType, response, options, value, ...other } = component;
                        const Component = lunatic[componentType];
                        return (
                            <div className="lunatic lunatic-component" key={`component-${id}`}>
                                <Component
                                    id={id}
                                    response={response}
                                    options={options ?? overrideOptions}
                                    {...other}
                                    errors={currentErrors}
                                    custom={edtComponents}
                                    componentSpecificProps={componentSpecificProps}
                                    variables={getVariables(
                                        data,
                                        iteration,
                                        getBindingDependencies(components),
                                        value,
                                    )}
                                    bindingDependencies={getBindingDependencies(components)}
                                    value={value}
                                />
                            </div>
                        );
                    })}
                </div>
            </Box>
        );
    };

    return source && data ? renderComponent() : renderLoading();
};

const useStyles = makeStylesEdt({ "name": { OrchestratorForStories } })(() => ({
    styleOverride: {
        width: "100%",
        maxWidth: "350px",
        "& .sequence-lunatic": {
            display: "none",
        },
        "& label": {
            backgroundColor: "transparent !important",
            marginBottom: "1rem !important",
            fontSize: "20px !important",
        },
        "& legend": {
            backgroundColor: "transparent",
            marginBottom: "1rem",
            fontSize: "20px",
            display: important("none"),
        },
        "& .field-container": {
            margin: "1rem 0",
        },
    },
    styleOverrideMobile: {
        maxWidth: important("100vw"),
        width: important("100vw"),
    },
    orchestratorBox: {
        display: "flex",
        flexDirection: "column",
    },
}));
